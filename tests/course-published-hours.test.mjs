import assert from "node:assert/strict";
import test from "node:test";
import { publishedHoursFixture as fixture, publishedHoursScope as scope } from "./helpers/course-published-hours-fixtures.mjs";

const hours = (course) => [course.theory, course.practice];

test("ordinary revisions stay published in public lists, while an explicit PÇ count reset hides content until approval", async (t) => {
  const { context, row, save, list } = fixture(t);
  const published = { identity: { theory: "4", practice: "2" }, detailFields: { purpose: "Onaylı içerik" } };
  const draft = { identity: { theory: "9", practice: "8" }, detailFields: { purpose: "Son taslak" } };
  save(context.packageJsonForDraft(JSON.stringify(published), draft, "Komisyon Onayı Bekliyor", "teacher", "now", "Public"), "Komisyon Onayı Bekliyor");
  assert.equal((await list()).status, "Public");
  assert.equal(row().status, "Komisyon Onayı Bekliyor", "the public status does not overwrite the internal workflow");
  const envelope = JSON.parse(row().package_json);
  envelope.outcomeCountChange = { previousCount: 11, currentCount: 15, changedAt: "now", changedBy: "chair" };
  envelope.draft.status = "Taslak";
  save(envelope, "Taslak");
  assert.equal((await list()).status, "Taslak");
  assert.deepEqual(hours(await list()), [3, 1], "withdrawn identities must not be projected as approved hours");
  assert.equal(context.publicPackageRecordForRow(row()), null);
  assert.equal(context.coursePackagePdfPayload({ ...scope, publicOnly: true }), null);
  assert.equal(context.editablePackageRecordForRow(row()).package.detailFields.purpose, "Son taslak");
  save(context.packageJsonForDraft(row().package_json, draft, "Taslak", "teacher", "later", "Taslak"), "Taslak");
  assert.equal(context.publicPackageRecordForRow(row()), null);
  assert.deepEqual(JSON.parse(row().package_json).published.package, published, "the old approved package remains archived");
});

test("course list keeps approved hours through drafts and committee review, then reads final approval on the next request", async (t) => {
  const { context, row, save, list } = fixture(t);
  const published = { identity: { theory: "3", practice: "0" } };
  const revision = { identity: { theory: "4", practice: "2" } };
  save(published);
  assert.deepEqual(hours(await list()), [3, 0]);
  for (const status of ["Taslak", "Komisyon Onayı Bekliyor"]) {
    save(context.packageJsonForDraft(row().package_json, revision, status, "teacher", "now", row().status), status);
    assert.deepEqual(hours(await list()), [3, 0], status);
  }
  assert.equal(context.transitionCoursePackageStatus(scope, "ABD Son Onayı Bekliyor", "committee").ok, true);
  assert.deepEqual(hours(await list()), [3, 0]);
  assert.equal(context.transitionCoursePackageStatus(scope, "Yayımlandı", "chair").ok, true);
  assert.deepEqual(hours(await list()), [4, 2]);
  assert.deepEqual(hours(row()), [3, 1], "reading approved hours does not rewrite administrative columns");
  const found = context.publicCourseForRoute({ ...scope, routeCode: scope.code }, { publicVisibleOnly: true });
  assert.deepEqual(hours(found.course), [4, 2], "public detail course metadata agrees with the list");
  const projected = context.dbCourseRows()[0];
  assert.equal(Object.hasOwn(projected, "package_json"), false, "list queries do not load or expose the full package");
  assert.equal(JSON.parse(projected.published_identity_json).theory, "4");
  const pending = { identity: { theory: "9", practice: "8" } };
  save(context.packageJsonForDraft(row().package_json, pending, "Düzeltme İstendi", "teacher", "later", row().status), "Düzeltme İstendi");
  assert.deepEqual(hours(await list()), [4, 2], "a subsequent revision cannot leak into the public list");
});

test("draft-only, malformed and missing packages fall back to course columns without exposing pending hours", async (t) => {
  const { save, list } = fixture(t);
  for (const data of ["{}", "{invalid", "null",
    { identity: { theory: "9", practice: "8" } },
    { publicationModel: "published-draft-v1", draft: { package: { identity: { theory: "9", practice: "8" } } } },
  ]) {
    save(data, "Komisyon Onayı Bekliyor");
    assert.deepEqual(hours(await list()), [3, 1]);
  }
  save({ publicationModel: "published-draft-v1", identity: { theory: "9", practice: "8" },
    draft: { package: { identity: { theory: "9", practice: "8" } } } }, "Yayımlandı");
  assert.deepEqual(hours(await list()), [3, 1], "a status alone cannot expose a draft-only package");
});

test("approved zero hours and partial legacy packages work while invalid hour fields fall back independently", async (t) => {
  const { context, row, save, list } = fixture(t);
  const cases = [
    [{ theory: "0", practice: 0 }, [0, 0]],
    [{ theory: "4.5" }, [4.5, 1]],
    [{ theory: null, practice: "2" }, [3, 2]],
    [{ theory: "", practice: " " }, [3, 1]],
    [{ theory: false, practice: {} }, [3, 1]],
    [{ theory: -1, practice: "invalid" }, [3, 1]],
  ];
  for (const [identity, expected] of cases) {
    for (const data of [{ identity }, { publicationModel: "published-draft-v1", published: { package: { identity } } }]) {
      save(data, "Yayımlandı");
      assert.deepEqual(hours(await list()), expected);
      assert.deepEqual(hours(context.courseWithPublishedHours(context.courseFromRow(row()), row())), expected);
    }
  }
  context.normalizeDbCourseForList = (course) => ({ ...course, theory: 9, practice: 8 });
  save({ published: { package: { identity: { theory: "4", practice: "2" } } } });
  assert.deepEqual(hours(await list()), [4, 2], "approved hours take precedence over catalog normalization");
});
