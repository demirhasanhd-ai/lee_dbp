import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const handler = source.match(/^async function handleDbpApi\([^\n]*\) \{[\s\S]*?^\}/m)[0];
const identity = { code: "MAT864", department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans" };

function fixture(t, role = "enstitu_yoneticisi") {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(`CREATE TABLE courses (
    id INTEGER PRIMARY KEY, academic_year TEXT, program_code TEXT, department TEXT, program_name TEXT,
    level TEXT, code TEXT, name TEXT, type TEXT, credit REAL, ects REAL, theory REAL, practice REAL, term TEXT,
    status TEXT, instructor TEXT, instructor_tc_kimlik TEXT, instructor_email TEXT, instructor_title TEXT,
    instructor_source TEXT, instructor_assigned_at TEXT, source TEXT, package_json TEXT, created_at TEXT, updated_at TEXT
  );
  CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE public_visibility (key TEXT PRIMARY KEY, visible INTEGER, updated_at TEXT);
  CREATE TABLE workflow_requests (id INTEGER PRIMARY KEY, course_id INTEGER, status TEXT);
  CREATE TABLE course_review_assignees (id INTEGER PRIMARY KEY, course_id INTEGER, member TEXT);
  INSERT INTO workflow_requests VALUES (1, 1, 'Komisyon Onayı Bekliyor');
  INSERT INTO course_review_assignees VALUES (1, 1, 'Existing Reviewer');`);
  const envelope = JSON.stringify({ publicationModel: "published-draft-v1", published: { package: { content: "Approved content" } }, draft: { package: { content: "Latest academic edits" } } });
  db.prepare(`INSERT INTO courses (id, department, program_name, level, code, name, term, status,
    instructor, instructor_tc_kimlik, instructor_email, instructor_title, instructor_source, instructor_assigned_at,
    package_json, created_at, updated_at) VALUES (1, ?, ?, ?, ?, 'ANALİZDEN SEÇME KONULAR II', '', ?,
    'Existing Instructor', '11111111111', 'existing@example.test', 'Prof. Dr.', 'e_enstitu_api', 'assignment-time', ?, 'created-time', 'old-time')`)
    .run(identity.department, identity.programName, identity.level, identity.code, "Komisyon Onayı Bekliyor", envelope);
  let resolutions = 0;
  const context = vm.createContext({
    URL, Response, db, console: { error: (...args) => assert.fail(args.join(" ")) },
    stripBasePath: (pathname) => pathname.replace(/^\/dbp/, ""), ensureDb() {},
    requireDbpSession: () => ({ session: { role, username: "test-user" } }),
    readJsonBody: (request) => request.json(), jsonResponse: (data, init) => Response.json(data, init),
    displayLevel: (value) => value, repairText: (value) => value, courseCodeMatchesLevel: () => true,
    repairObject: (value) => value,
    normalizeScope: (value = "") => value.trim().toLocaleLowerCase("tr-TR"), levelKey: (value) => value,
    courseCodeCandidates: (code) => [code], normalizeDbCourseForList: (course) => course,
    dbCourseList: () => db.prepare("SELECT * FROM courses").all().map((row) => context.courseFromRow(row)),
    findExactCourseRow: (query) => db.prepare("SELECT * FROM courses WHERE code = ? AND department = ? AND program_name = ? AND level = ?")
      .get(query.code, query.department, query.programName, query.level),
    resolveInstructorIdentityFromName: async () => { resolutions++; return { instructorEmail: "new@example.test" }; },
    audit() {},
    createCourseAssignmentTemplateWorkbook: () => "test workbook",
    buildCourseAssignmentImportPreview: () => ({ rowsRead: 1 }),
    applyCourseAssignmentImport: () => ({ changed: 1 }),
  });
  const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
  vm.runInContext(["courseIdentityEdits", "courseIdentityEditFor", "courseRowsForIdentity", "updateManagedCourse", "courseFromRow", "getPublicVisibilityMap", "courseVisibilityKeyFor", "courseContentVisibilityKeyFor", "programLevelVisibilityKeyFromKey", "programVisibilityKeyFor", "visibilitySlug"]
    .map((name) => declarations.get(name)).join("\n") + "\n" + declarations.get("normalizePublicRouteSegment") + "\n" + handler, context);
  const request = (body, path = "course-management", method = "POST") => context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/${path}`, {
    method, headers: { "Content-Type": "application/json" }, ...(method === "GET" ? {} : { body: JSON.stringify(body) }),
  }));
  const row = () => db.prepare("SELECT * FROM courses WHERE id = 1").get();
  return { db, request, row, context, resolutions: () => resolutions };
}

test("term-only correction preserves instructor identity, both package revisions, approvals and other courses", async (t) => {
  const { db, request, row, context, resolutions } = fixture(t);
  const before = row();
  db.exec("INSERT INTO courses (id, code, term, package_json) VALUES (2, 'MAT866', 'Güz', 'unrelated content')");
  const other = db.prepare("SELECT * FROM courses WHERE id = 2").get();
  const workflow = db.prepare("SELECT * FROM workflow_requests").all();
  const reviewers = db.prepare("SELECT * FROM course_review_assignees").all();
  context.publicCourseRouteIndexCache = new Map();
  assert.equal((await request({ ...identity, action: "assign", term: "Bahar" })).status, 200);
  const after = row();
  assert.equal(after.term, "Bahar");
  assert.notEqual(after.updated_at, before.updated_at);
  assert.deepEqual({ ...after, term: before.term, updated_at: before.updated_at }, { ...before });
  assert.deepEqual(db.prepare("SELECT * FROM courses WHERE id = 2").get(), other);
  assert.deepEqual(db.prepare("SELECT * FROM workflow_requests").all(), workflow);
  assert.deepEqual(db.prepare("SELECT * FROM course_review_assignees").all(), reviewers);
  assert.equal(resolutions(), 0);
  assert.equal(context.publicCourseRouteIndexCache, undefined);
});

test("new courses persist each explicitly chosen term and reject missing or invalid terms", async (t) => {
  const { db, request } = fixture(t);
  for (const [index, term] of ["Güz", "Bahar", "Güz ve Bahar"].entries()) {
    const code = `MAT87${index}`;
    assert.equal((await request({ ...identity, action: "create", code, term, name: "New course" })).status, 200);
    assert.equal(db.prepare("SELECT term FROM courses WHERE code = ?").get(code).term, term);
  }
  for (const term of [undefined, "", "Yaz", null]) {
    assert.equal((await request({ ...identity, action: "create", code: "MAT880", term })).status, 422);
    assert.equal(db.prepare("SELECT * FROM courses WHERE code = 'MAT880'").get(), undefined);
  }
});

test("teacher-only legacy requests preserve term; combined requests update term and teacher without resetting content", async (t) => {
  const { db, request, row } = fixture(t);
  db.exec("UPDATE courses SET term = 'Bahar' WHERE id = 1");
  const before = row();
  assert.equal((await request({ ...identity, action: "assign", instructor: "New Instructor" })).status, 200);
  assert.equal(row().term, "Bahar");
  assert.equal((await request({ ...identity, action: "assign", instructor: "Other Instructor", term: "Güz ve Bahar" })).status, 200);
  assert.equal(row().term, "Güz ve Bahar");
  assert.equal(row().instructor, "Other Instructor");
  assert.equal(row().status, before.status);
  assert.equal(row().package_json, before.package_json);
  assert.equal((await request({ ...identity, action: "assign", name: null, term: "Bahar" })).status, 200);
  assert.equal(row().name, before.name, "old assignment forms send a null name and must preserve it");
});

test("invalid, empty or incorrectly scoped updates leave all stored fields unchanged", async (t) => {
  const { request, row } = fixture(t);
  const before = row();
  for (const [patch, status] of [[{ term: "Yaz", instructor: "Must not change" }, 422], [{ term: "" }, 422], [{}, 400], [{ programName: "Other program", term: "Bahar" }, 404]]) {
    assert.equal((await request({ ...identity, action: "assign", ...patch })).status, status);
    assert.deepEqual(row(), before);
  }
});

test("course editing and bulk assignment APIs allow institute managers and keep unrelated roles forbidden", async (t) => {
  for (const role of ["enstitu_yoneticisi", "lee_ogrenci_isleri", "admin", "akademisyen", "abd_asd_baskani", "enstitu_sekreteri"]) {
    const { request, row } = fixture(t, role);
    const before = row();
    const allowed = ["enstitu_yoneticisi", "lee_ogrenci_isleri", "admin"].includes(role);
    for (const [path, method] of [["course-management", "POST"], ["course-assignment-import/template", "GET"], ["course-assignment-import/preview", "POST"], ["course-assignment-import/apply", "POST"]]) {
      assert.equal((await request({ ...identity, action: "assign", term: "Bahar" }, path, method)).status, allowed ? 200 : 403, `${role}: ${path}`);
    }
    if (!allowed) assert.deepEqual(row(), before);
  }
});

test("name and code edits preserve every other course field, both package revisions, assignments and approvals", async (t) => {
  for (const status of ["Taslak", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Yayımlandı", "Public", "Düzeltme İstendi"]) {
    const { db, request, row, resolutions } = fixture(t);
    db.prepare("UPDATE courses SET status = ? WHERE id = 1").run(status);
    db.exec("INSERT INTO courses(id, code, name, department, program_name, level) VALUES (2, 'MAT866', 'Unrelated', 'Matematik ABD', 'Matematik', 'Tezli Yüksek Lisans')");
    const before = row();
    const other = db.prepare("SELECT * FROM courses WHERE id = 2").get();
    const approvals = db.prepare("SELECT * FROM workflow_requests").all();
    const reviewers = db.prepare("SELECT * FROM course_review_assignees").all();
    const response = await request({ ...identity, action: "assign", courseId: 1, newCode: "MAT868", name: "Yeni Ders Adı", expectedCode: before.code, expectedName: before.name });
    assert.equal(response.status, 200, JSON.stringify(await response.clone().json()));
    const after = row();
    assert.equal(after.code, "MAT868");
    assert.equal(after.name, "Yeni Ders Adı");
    assert.deepEqual({ ...after, code: before.code, name: before.name, updated_at: before.updated_at }, { ...before });
    assert.deepEqual(db.prepare("SELECT * FROM courses WHERE id = 2").get(), other);
    assert.deepEqual(db.prepare("SELECT * FROM workflow_requests").all(), approvals);
    assert.deepEqual(db.prepare("SELECT * FROM course_review_assignees").all(), reviewers);
    assert.equal(resolutions(), 0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM courses").get().n, 2);
  }
});

test("identity edits reject collisions, stale forms and empty fields atomically", async (t) => {
  const { db, request, row, context } = fixture(t);
  db.exec("INSERT INTO courses(id, code, name, department, program_name, level) VALUES (2, 'MAT868', 'Other', 'Matematik ABD', 'Matematik', 'Tezli Yüksek Lisans')");
  const before = row();
  for (const [fields, status] of [
    [{ newCode: "MAT868" }, 409], [{ name: "" }, 422], [{ newCode: "" }, 422],
    [{ expectedName: "Stale name", name: "Changed" }, 409], [{ expectedCode: "MAT899", name: "Changed" }, 409],
    [{ courseId: 2, newCode: "MAT870" }, 404],
  ]) {
    const response = await request({ ...identity, action: "assign", term: "Bahar", ...fields });
    assert.equal(response.status, status, JSON.stringify(await response.clone().json()));
    assert.deepEqual(row(), before);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM metadata").get().n, 0);
  }
  context.courseCodeMatchesLevel = () => false;
  assert.equal((await request({ ...identity, action: "assign", newCode: "MAT901", term: "Bahar" })).status, 422);
  assert.deepEqual(row(), before);
});

test("combined identity, term and instructor edit commits once and keeps academic content and publication", async (t) => {
  const { request, row } = fixture(t);
  const before = row();
  assert.equal((await request({ ...identity, action: "assign", newCode: "MAT868", name: "New name", term: "Bahar", instructor: "New Instructor" })).status, 200);
  const after = row();
  assert.equal(after.instructor, "New Instructor");
  assert.equal(after.term, "Bahar");
  assert.equal(after.package_json, before.package_json);
  assert.equal(after.status, before.status);
  assert.equal(after.created_at, before.created_at);
});
