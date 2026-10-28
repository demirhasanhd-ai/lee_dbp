import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const scope = { department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", code: "MAT864" };

function fixture(t, file = ":memory:") {
  const db = new DatabaseSync(file);
  t.after(() => { if (db.isOpen) db.close(); });
  for (const table of ["metadata", "courses", "workflow_requests", "course_review_assignees", "public_visibility"]) {
    db.exec(source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`))[0]);
  }
  for (const column of ["instructor_tc_kimlik", "instructor_email", "instructor_title", "instructor_source", "instructor_assigned_at"]) {
    if (!db.prepare("SELECT name FROM pragma_table_info('courses') WHERE name = ?").get(column)) db.exec(`ALTER TABLE courses ADD COLUMN ${column} TEXT`);
  }
  const context = vm.createContext({ db, URL, Request, Response, console, publicCourseRouteIndexCache: undefined, testProgramSeed: { visibilityKey: "test" } });
  vm.runInContext('const coursePackagePublicationModel = "published-draft-v1";\n' +
    source.match(/const courseListSelect = `[\s\S]*?`;/)[0] + "\n" + [...declarations.values()].join("\n"), context);
  // Only catalog-specific legacy aliases are irrelevant to these isolated courses.
  for (const [, name] of declarations.get("normalizeDbCourseForList").matchAll(/\b(normalize\w+)\(repaired\)/g)) context[name] = (course) => course;
  Object.assign(context, {
    normalizeTezsizProjectInstructor: (course) => course,
    isUnsupportedTezsizProcessCourse: () => false, isYbsDoctorateCourse: () => false,
    repairText: (value = "") => String(value), repairObject: (value) => value,
    sanitizeInstructorName: (value = "") => value, isMeaningfulInstructorName: (value) => Boolean(value),
    displayLevel: (value) => value, levelKey: (value) => value,
    courseCodeCandidates: (code) => [code], canonicalCourseCode: (code) => code,
    courseCodeMatchesLevel: (code) => /8\d\d$/.test(code),
    audit() {}, readCoursePackageSeeds: () => [],
  });
  if (!db.prepare("SELECT id FROM courses LIMIT 1").get()) {
    const envelope = { publicationModel: "published-draft-v1", published: { package: { identity: { name: "Old package name", code: "OLD801" }, detailFields: { purpose: "Published purpose" } }, approvedAt: "approval-time" }, draft: { package: { detailFields: { purpose: "Saved draft" } } } };
    db.prepare(`INSERT INTO courses(id, department, program_name, level, code, name, term, instructor, status, package_json, created_at, updated_at)
      VALUES (1, ?, ?, ?, ?, 'Current course', '', 'Existing teacher', 'Komisyon Onayı Bekliyor', ?, 'created-time', 'saved-time')`)
      .run(scope.department, scope.programName, scope.level, scope.code, JSON.stringify(envelope));
    db.prepare("INSERT INTO public_visibility(key, visible, updated_at) VALUES (?, 0, 'visibility-time')").run(context.courseVisibilityKeyFor(scope));
    db.prepare("INSERT INTO public_visibility(key, visible, updated_at) VALUES (?, 1, 'content-time')").run(context.courseContentVisibilityKeyFor(scope));
  }
  const row = () => db.prepare("SELECT * FROM courses WHERE id = 1").get();
  const rename = (newCode, name = "New administrative name", code = row().code) => context.updateManagedCourse({ ...scope, code, newCode, name, courseId: 1 }, "test-admin", "changed-time");
  return { db, context, row, rename };
}

test("old course links resolve after repeated code edits; visibility, publication and package bytes stay unchanged", (t) => {
  const { db, context, row, rename } = fixture(t);
  const before = row();
  const visibility = db.prepare("SELECT * FROM public_visibility ORDER BY key").all();
  assert.equal(rename("MAT868").ok, true);
  assert.equal(rename("MAT870").ok, true);
  for (const code of ["MAT864", "MAT868", "MAT870"]) {
    const found = context.publicCourseForRoute({ ...scope, routeCode: code });
    assert.equal(found.course.id, before.id);
    assert.equal(found.course.code, "MAT870");
    assert.equal(found.course.name, "New administrative name");
    assert.equal(context.publicCourseForRoute({ ...scope, routeCode: code }, { publicVisibleOnly: true }), null, "hidden course must stay hidden through every alias");
    assert.equal(context.courseRowsForIdentity({ ...scope, code })[0].id, before.id);
  }
  assert.equal(row().package_json, before.package_json);
  assert.equal(row().status, before.status);
  for (const original of visibility) assert.deepEqual(db.prepare("SELECT * FROM public_visibility WHERE key = ?").get(original.key), original);
  const current = context.normalizeDbCourseForList(context.courseFromRow(row()));
  assert.equal(context.isCoursePubliclyVisible(current), false);
  assert.equal(context.isCourseContentPublicOverride(current), true);
  assert.equal(context.publicPackageRecordForRow(row()).approvedAt, "approval-time");
  const pdf = context.coursePackagePdfPayload({ ...scope, publicOnly: true });
  assert.equal(pdf.course.code, "MAT870");
  assert.equal(pdf.package.identity.name, "New administrative name");
  assert.equal(pdf.approvedAt, "approval-time");
  assert.equal(context.publicCourseForRoute({ ...scope, department: "Other ABD", routeCode: "MAT864" }), null);
  // A later publication-control change uses the current code and takes precedence.
  db.prepare("INSERT OR REPLACE INTO public_visibility(key, visible, updated_at) VALUES (?, 1, 'later')").run(context.courseVisibilityKeyFor(current));
  assert.equal(context.isCoursePubliclyVisible(current), true);
});

test("administrative edits and aliases survive reopening; catalog sync and seed revisions cannot overwrite them", (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "dbp-course-identity-"));
  const file = path.join(dir, "isolated.sqlite");
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const first = fixture(t, file);
  const original = first.row();
  assert.equal(first.rename("MAT868").ok, true);
  const before = first.row();
  first.db.close();
  const reopened = fixture(t, file);
  const { context, db, row } = reopened;
  context.readInitialSeedData = () => ({ officialCourses: [{ ...scope, name: original.name, status: "Public", instructor: "Seed teacher" }] });
  context.syncCourseCatalogFromSeed();
  assert.deepEqual(row(), before);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM courses").get().n, 1, "seed must not recreate the old course code");
  assert.equal(context.publicCourseForRoute({ ...scope, routeCode: scope.code }).course.code, "MAT868");
  assert.equal(context.findExactCourseRow(scope).id, before.id);
  // Even an otherwise replaceable seed package must remain protected after an admin edit.
  db.prepare("UPDATE courses SET package_json = ? WHERE id = 1").run(JSON.stringify({ staticSeed: true }));
  const update = db.prepare(`UPDATE courses SET status = 'Public' WHERE id = 1 AND ${context.seedPackageReplacementCondition()}`);
  assert.equal(update.run().changes, 0);
  // Close before removing this test's own temporary directory on Windows.
  db.close();
});

test("reading old package identities uses the administrative values without rewriting stored revisions", (t) => {
  const { context, row, rename } = fixture(t);
  const before = row().package_json;
  rename("MAT868");
  const course = context.normalizeDbCourseForList(context.courseFromRow(row()));
  for (const revision of [context.publicPackageRecordForRow(row()), context.editablePackageRecordForRow(row())]) {
    const displayed = context.packageWithCourseIdentity(revision.package, course);
    assert.equal(displayed.identity.name, course.name);
    assert.equal(displayed.identity.code, course.code);
  }
  assert.equal(row().package_json, before);
});

test("name-only edits preserve the underlying code of a legacy normalized course", (t) => {
  const { context, row } = fixture(t);
  const normalize = context.normalizeDbCourseForList;
  context.normalizeDbCourseForList = (course) => ({ ...normalize(course), code: "MAT8XX" });
  const before = row();
  const result = context.updateManagedCourse({ ...scope, name: "Only the name changed", courseId: 1 }, "test-admin", "changed-time");
  assert.equal(result.ok, true);
  assert.equal(row().name, "Only the name changed");
  assert.equal(row().code, before.code);
  assert.equal(row().package_json, before.package_json);
  assert.equal(context.findExactCourseRow(scope).id, before.id);
  assert.equal(context.courseRowsForIdentity({ ...scope, code: "MAT8XX" })[0].id, before.id);
});

test("startup catalog sync preserves preexisting live rows before any identity edits, for every publication state", (t) => {
  const { context, db, row } = fixture(t);
  const seed = { ...scope, name: "Seed name", term: "Güz", instructor: "Seed teacher", ects: 99, status: "Public" };
  context.readInitialSeedData = () => ({ officialCourses: [seed] });
  context.readCoursePackageSeeds = () => [seed];
  context.packageSeedCourseName = (course) => course.name;
  context.storedPackageFromSeed = () => ({ staticSeed: true, purpose: "Seed content" });
  const visibility = db.prepare("SELECT * FROM public_visibility ORDER BY key").all();
  for (const status of ["Taslak", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Düzeltme İstendi", "Yayımlandı", "Public", "İncelemede", "Atama Bekliyor"]) {
    for (const packageJson of [row().package_json, JSON.stringify({ staticSeed: true }), "{}"]) {
      db.prepare("UPDATE courses SET status = ?, package_json = ?, term = 'Bahar' WHERE id = 1").run(status, packageJson);
      const before = row();
      context.syncCourseCatalogFromSeed();
      assert.deepEqual(row(), before, status);
      assert.equal(Object.keys(context.courseIdentityEdits()).length, 0);
      assert.deepEqual(db.prepare("SELECT * FROM public_visibility ORDER BY key").all(), visibility);
    }
  }
});

test("failed identity update rolls back the metadata, course fields and all original state together", (t) => {
  const { context, db, row, rename } = fixture(t);
  const before = row();
  const visibility = db.prepare("SELECT * FROM public_visibility ORDER BY key").all();
  db.exec("CREATE TRIGGER reject_update BEFORE UPDATE ON courses BEGIN SELECT RAISE(ABORT, 'test failure'); END");
  assert.throws(() => rename("MAT868"), /test failure/);
  assert.deepEqual(row(), before);
  assert.equal(Object.keys(context.courseIdentityEdits()).length, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM metadata").get().n, 0);
  assert.deepEqual(db.prepare("SELECT * FROM public_visibility ORDER BY key").all(), visibility);
});

test("returning to an old code retains the current visibility settings rather than reviving stale settings", (t) => {
  const { context, db, row, rename } = fixture(t);
  assert.equal(rename("MAT868").ok, true);
  const current = context.normalizeDbCourseForList(context.courseFromRow(row()));
  db.prepare("UPDATE public_visibility SET visible = 1 WHERE key = ?").run(context.courseVisibilityKeyFor(current));
  db.prepare("UPDATE public_visibility SET visible = 0 WHERE key = ?").run(context.courseContentVisibilityKeyFor(current));
  assert.equal(rename("MAT864").ok, true);
  const reverted = context.normalizeDbCourseForList(context.courseFromRow(row()));
  assert.equal(context.isCoursePubliclyVisible(reverted), true);
  assert.equal(context.isCourseContentPublicOverride(reverted), false);
});
