import assert from "node:assert/strict";
import test from "node:test";
import { publishedHoursFixture, publishedHoursScope as scope } from "./helpers/course-published-hours-fixtures.mjs";

test("catalog, editable/public packages and package saves use administrative type and credit even for conflicting revisions", async (t) => {
  const { context, db, row, save, list } = publishedHoursFixture(t);
  db.prepare("UPDATE courses SET type = ?, credit = ? WHERE id = 1").run("Zorunlu", 0);
  save({ publicationModel: "published-draft-v1",
    published: { package: { identity: { type: "Seçmeli", credit: "3" }, fields: { "Dersin türü": "Seçmeli", Kredi: "3" } } },
    draft: { package: { identity: { type: "Seçmeli", credit: "9" } } },
  }, "Taslak");
  const original = row().package_json;
  for (const record of [context.editablePackageRecordForRow(row()), context.publicPackageRecordForRow(row())]) {
    const output = context.packageWithCourseIdentity(record.package, context.courseFromRow(row()));
    assert.equal(output.identity.type, "Zorunlu");
    assert.equal(output.identity.credit, "0");
    if (output.fields) assert.equal(output.fields.Kredi, "0");
  }
  assert.equal((await list()).type, "Zorunlu");
  assert.equal((await list()).credit, 0);
  assert.equal(row().package_json, original, "reading old revisions does not rewrite them");
  Object.assign(context, {
    requireDbpSession: () => ({ session: { role: "akademisyen", name: "Teacher" } }),
    upsertSessionUser() {}, readJsonBody: (request) => request.json(),
    canEditCoursePackage: () => true, courseCodeMatchesLevel: () => true,
    courseWorkflowSummary: () => ({}),
  });
  const response = await context.handleDbpApi(new Request("http://localhost/dbp/api/dbp/course-package", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...scope, name: "Example", status: "Taslak", package: {
      identity: { type: "Seçmeli", credit: "12" }, fields: { "Dersin türü": "Seçmeli", Kredi: "12" },
    } }),
  }));
  assert.equal(response.status, 200, await response.clone().text());
  const saved = JSON.parse(row().package_json);
  assert.equal(saved.draft.package.identity.type, "Zorunlu");
  assert.equal(saved.draft.package.identity.credit, "0");
  assert.equal(saved.draft.package.fields.Kredi, "0");
  assert.deepEqual(saved.published.package, JSON.parse(original).published.package);
  db.prepare("UPDATE courses SET type = ?, credit = ? WHERE id = 1").run("Seçmeli", 2.5);
  assert.equal((await list()).type, "Seçmeli");
  assert.equal((await list()).credit, 2.5);
  const latest = context.packageWithCourseIdentity(context.editablePackageRecordForRow(row()).package, context.courseFromRow(row()));
  assert.equal(latest.identity.credit, "2.5");
});

test("one-time backfill fills only blank columns, preserves zero/conflicts/history and leaves unknown values blank", (t) => {
  const { context, db } = publishedHoursFixture(t);
  db.exec("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL); DELETE FROM courses");
  const insert = db.prepare("INSERT INTO courses(id, department, program_name, level, code, name, type, credit, package_json, created_at, updated_at) VALUES (?, 'Test ABD', 'Test', 'Tezli Yüksek Lisans', 'TST801', 'Test', ?, ?, ?, 'original-time', 'original-time')");
  const published = { identity: { type: "Seçmeli", credit: "4" } };
  const draft = { identity: { type: "Zorunlu", credit: "5" } };
  const envelope = { publicationModel: "published-draft-v1", published: { package: published }, draft: { package: draft } };
  for (const [id, type, credit, data] of [
    [1, "Zorunlu", 0, envelope], [2, null, null, envelope],
    [3, "", "", { draft: { package: draft } }], [4, null, null, published],
    [5, null, null, { identity: { type: "invalid", credit: false } }],
    [6, "Seçmeli", 3, envelope], [7, null, null, { identity: { type: "Zorunlu", credit: "0" } }],
    [8, null, null, "{broken"],
  ]) insert.run(id, type, credit, typeof data === "string" ? data : JSON.stringify(data));
  const before = db.prepare("SELECT * FROM courses ORDER BY id").all();
  context.backfillCourseManagedMetadata();
  const after = db.prepare("SELECT * FROM courses ORDER BY id").all();
  assert.deepEqual(after.map(({ type, credit }) => [type, credit]), [
    ["Zorunlu", 0], ["Seçmeli", 4], ["Zorunlu", 5], ["Seçmeli", 4],
    [null, null], ["Seçmeli", 3], ["Zorunlu", 0], [null, null],
  ]);
  for (let i = 0; i < after.length; i++) assert.deepEqual({ ...after[i], type: before[i].type, credit: before[i].credit }, { ...before[i] });
  db.exec("UPDATE courses SET type = NULL, credit = NULL WHERE id = 2");
  context.backfillCourseManagedMetadata();
  assert.equal(db.prepare("SELECT credit FROM courses WHERE id = 2").get().credit, null, "completed migration does not run again");
  assert.equal(context.courseFromRow(db.prepare("SELECT * FROM courses WHERE id = 5").get()).credit, null);
});

test("failed backfill rolls back its changes and completion marker so it can retry", (t) => {
  const { context, db, row, save } = publishedHoursFixture(t);
  db.exec("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
  save({ identity: { type: "Seçmeli", credit: "4" } });
  const before = row();
  db.exec("CREATE TRIGGER reject_credit BEFORE UPDATE OF credit ON courses BEGIN SELECT RAISE(ABORT, 'blocked'); END");
  assert.throws(() => context.backfillCourseManagedMetadata(), /blocked/);
  assert.deepEqual(row(), before);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM metadata").get().n, 0);
  db.exec("DROP TRIGGER reject_credit");
  context.backfillCourseManagedMetadata();
  assert.equal(row().type, "Seçmeli");
  assert.equal(row().credit, 4);
});
