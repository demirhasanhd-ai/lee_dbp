import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = [...source.matchAll(/^function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)];
const names = ["parseCoursePackageJson", "isVersionedCoursePackage", "compactCoursePackageEnvelope", "coursePackageRecords", "publicPackageRecordForRow", "editablePackageRecordForRow", "packageJsonForDraft", "packageJsonForPublication", "isStaticSeedPackage", "seedPackageReplacementCondition"];
const context = vm.createContext({
  repairObject: (value) => value,
  normalizeScope: (value) => value.toLocaleLowerCase("tr-TR"),
  isPublicCourseStatus: (value) => ["Public", "Yayımlandı"].includes(value),
  getPublicVisibilityMap: () => ({}),
});
vm.runInContext('const coursePackagePublicationModel = "published-draft-v1";\n' + names.map((name) => {
  const declaration = declarations.find((item) => item[1] === name);
  assert.ok(declaration, name);
  return declaration[0];
}).join("\n"), context);

const seedUpdates = declarations.filter((item) => /^migrate.*FromSeed$/.test(item[1])).flatMap((item) =>
  [...item[0].matchAll(/`\s*UPDATE courses[\s\S]*?`/g)].filter(([sql]) => sql.includes("package_json = ?")).map(([sql]) => ({ name: item[1], sql })),
);

function schema(db) {
  db.exec("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT)");
  db.exec("CREATE TABLE courses (id INTEGER PRIMARY KEY, name TEXT, credit REAL, ects REAL, theory REAL, practice REAL, term TEXT, instructor TEXT, status TEXT, package_json TEXT, updated_at TEXT)");
}

test("all seed package revisions preserve saved drafts, published revisions and legacy user edits", () => {
  assert.ok(seedUpdates.length >= 46);
  const db = new DatabaseSync(":memory:");
  schema(db);
  try {
    for (const { name, sql } of seedUpdates) {
      const query = vm.runInContext(sql, context);
      const update = db.prepare(query);
      const count = (query.match(/\?/g) || []).length;
      const params = [...Array(count - 3).fill(0), JSON.stringify({ staticSeed: true, detailFields: { purpose: "old seed" } }), "tomorrow", 1];
      for (const saved of [
        { publicationModel: "published-draft-v1", draft: { package: { detailFields: { purpose: "teacher draft" } } } },
        { publicationModel: "published-draft-v1", published: { package: { detailFields: { purpose: "approved revision" } } } },
        { detailFields: { purpose: "legacy user edit" }, savedAt: "yesterday" },
        { staticSeed: true, savedAt: "yesterday", detailFields: { purpose: "legacy edit with seed marker" } },
        { publicationModel: "published-draft-v1", published: { package: { detailFields: { purpose: "current approved content" } } }, draft: { package: { detailFields: { purpose: "pending teacher revision" } } } },
      ]) {
        for (const status of ["Taslak", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Yayımlandı"]) {
          db.prepare("INSERT OR REPLACE INTO courses(id, status, package_json, updated_at) VALUES (1, ?, ?, 'yesterday')").run(status, JSON.stringify(saved));
          assert.equal(update.run(...params).changes, 0, `${name}: ${status}`);
          const row = db.prepare("SELECT * FROM courses WHERE id = 1").get();
          assert.equal(row.package_json, JSON.stringify(saved), name);
          assert.equal(row.status, status, name);
          assert.equal(row.updated_at, "yesterday", name);
        }
      }
      for (const initial of ["{}", JSON.stringify({ staticSeed: true })]) {
        db.prepare("UPDATE courses SET package_json = ? WHERE id = 1").run(initial);
        assert.equal(update.run(...params).changes, 1, `${name}: untouched seed remains updatable`);
      }
    }
  } finally { db.close(); }
});

test("startup package bootstrap preserves current drafts, approvals, assignments and workflow history", () => {
  const db = new DatabaseSync(":memory:");
  schema(db);
  db.exec(`
    CREATE TABLE workflow_requests (target TEXT, status TEXT, note TEXT);
    CREATE TABLE course_review_assignees (course_id INTEGER, member_name TEXT, stage TEXT);
    INSERT INTO workflow_requests VALUES ('ABC801', 'Komisyon Onayı Bekliyor', 'Teacher submitted revision');
    INSERT INTO course_review_assignees VALUES (1, 'Committee member', 'committee');
  `);
  for (const [index, status] of ["Taslak", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Yayımlandı"].entries()) {
    const envelope = context.packageJsonForDraft(
      JSON.stringify({ detailFields: { purpose: `approved ${index}` } }),
      { detailFields: { purpose: `teacher edit ${index}` }, savedAt: "2026-10-16T12:00:00Z" },
      status, "teacher", "2026-10-16T12:00:00Z", "Public",
    );
    db.prepare("INSERT INTO courses (id, name, status, package_json, instructor, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(index + 1, `Teacher course ${index}`, status, envelope, `Assigned instructor ${index}`, "2026-10-16T12:00:00Z");
  }
  const snapshot = () => JSON.stringify({
    courses: db.prepare("SELECT * FROM courses ORDER BY id").all(),
    workflow: db.prepare("SELECT * FROM workflow_requests").all(),
    reviewers: db.prepare("SELECT * FROM course_review_assignees").all(),
  });
  const before = snapshot();
  context.db = db;
  context.audit = () => {};
  vm.runInContext(declarations.find((item) => item[1] === "migratePublicCoursePackagesToApprovalDrafts")[0], context);
  try {
    context.migratePublicCoursePackagesToApprovalDrafts();
    assert.equal(snapshot(), before, "bootstrap must preserve teacher edits, status and approval history");
    context.migratePublicCoursePackagesToApprovalDrafts();
    assert.equal(snapshot(), before, "repeated startup must be idempotent");
  } finally { db.close(); }
});

test("draft save survives database close/reopen and public package stays unchanged", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "dbp-persistence-"));
  const file = path.join(dir, "test.sqlite");
  let db;
  try {
    db = new DatabaseSync(file);
    schema(db);
    const published = { detailFields: { purpose: "approved content" } };
    const draft = { detailFields: { purpose: "teacher's saved content" }, savedAt: "2026-10-15T12:00:00Z" };
    const savedJson = context.packageJsonForDraft(JSON.stringify(published), draft, "Taslak", "teacher", "2026-10-15T12:00:00Z", "Public");
    db.prepare("INSERT INTO courses(id, status, package_json) VALUES (1, 'Taslak', ?)").run(savedJson);
    db.close();
    db = new DatabaseSync(file);
    const row = db.prepare("SELECT * FROM courses WHERE id = 1").get();
    assert.equal(JSON.stringify(context.editablePackageRecordForRow(row).package), JSON.stringify(draft));
    assert.equal(JSON.stringify(context.publicPackageRecordForRow(row).package), JSON.stringify(published));
    assert.equal(context.isStaticSeedPackage(row.package_json), false);
    assert.equal(context.isStaticSeedPackage(JSON.stringify({ staticSeed: true, ...draft })), false);
    assert.equal(context.isStaticSeedPackage(JSON.stringify({ staticSeed: true })), true);
  } finally {
    db?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
