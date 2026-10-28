import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { newCourseImportFixture as fixture, newCourseImportRow as row } from "./helpers/course-create-fixtures.mjs";

const template = readFileSync(new URL("../public/yeni-ders-sablonu.xlsx", import.meta.url));
const columns = ["Ders Kodu", "Ders Adı", "Dönem", "Zorunlu / Seçmeli", "Teorik", "Uygulama", "Kredi", "AKTS", "Danışman T.C.", "Danışman Unvan", "Danışman İsim", "Danışman E-posta"];

test("downloadable new-course workbook has exact headers, blank data, frozen header, term/type validation and text identifiers", (t) => {
  const { context } = fixture(t);
  assert.deepEqual(Array.from(context.readFirstXlsxSheetRows(template)[0]), columns);
  assert.equal(context.readNewCourseWorkbook(template.toString("base64")).length, 0);
  const entries = context.readXlsxZipEntries(template);
  const xml = entries.get(context.firstWorksheetPath(entries)).toString();
  assert.match(xml, /state="frozen"/);
  assert.match(xml, /Güz.*Bahar.*Güz ve Bahar/);
  assert.match(xml, /Zorunlu.*Seçmeli/);
  assert.match(entries.get("xl/styles.xml").toString(), /formatCode="@"/);
});

test("preview classifies valid, existing, duplicate and invalid rows without changing any record", async (t) => {
  const { db, excel, request } = fixture(t);
  const before = db.prepare("SELECT * FROM courses").all();
  const file = excel([row("MAT864"), row("MAT866"), row("MAT868", { "Dönem": "Güz ve Bahar", "Danışman İsim": "Ayşe Test", "Danışman T.C.": "01234567890", "Danışman Unvan": "Prof. Dr.", "Danışman E-posta": "test@example.test" }), row("MAT870"), row("MAT 870"), row("MAT872", { "Dönem": "", "AKTS": "abc" })]);
  const response = await request(file);
  assert.equal(response.status, 200);
  const { preview } = await response.json();
  assert.deepEqual(preview.summary, { ready: 2, existing: 1, invalid: 3, unassigned: 1 });
  assert.equal(preview.items[2].instructorTcKimlik, "01234567890");
  assert.equal(preview.items[0].action, "existing", "spaces in existing course codes must not permit duplicates");
  assert.deepEqual(db.prepare("SELECT * FROM courses").all(), before);
});

test("new-course import cannot recreate an old code retained after an administrative rename", async (t) => {
  const { db, excel, request } = fixture(t);
  db.exec("CREATE TABLE metadata(key TEXT PRIMARY KEY, value TEXT NOT NULL)");
  db.prepare("UPDATE courses SET code = 'MAT870' WHERE id = 1").run();
  db.prepare("INSERT INTO metadata VALUES (?, ?)").run("course_identity_edits_v1", JSON.stringify({ 1: {
    id: 1, department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", code: "MAT870", aliases: ["MAT 864", "MAT864", "MAT870"],
  } }));
  const before = db.prepare("SELECT * FROM courses").all();
  const response = await request(excel([row("MAT864"), row("MAT870")]), "apply");
  assert.equal(response.status, 200);
  const { result } = await response.json();
  assert.equal(result.created, 0);
  assert.equal(result.existing, 2);
  assert.deepEqual(db.prepare("SELECT * FROM courses").all(), before);
});

test("apply inserts new drafts only, preserves live content, reviewers, terms and identities, and is idempotent", async (t) => {
  const { db, excel, request, context } = fixture(t);
  const before = db.prepare("SELECT * FROM courses WHERE id = 1").get();
  const workflow = db.prepare("SELECT * FROM workflow_requests").all();
  const reviewers = db.prepare("SELECT * FROM course_review_assignees").all();
  const file = excel([row("MAT864"), row("MAT866"), row("MAT868", { "Dönem": "Güz ve Bahar", "Danışman İsim": "Ayşe Test", "Danışman T.C.": "01234567890", "Danışman Unvan": "Doç. Dr.", "Danışman E-posta": "ayse@example.test" })]);
  context.publicCourseRouteIndexCache = new Map();
  const response = await request(file, "apply");
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).result, { created: 2, existing: 1, invalid: 0, unassigned: 1 });
  assert.equal(context.publicCourseRouteIndexCache, undefined);
  assert.deepEqual(db.prepare("SELECT * FROM courses WHERE id = 1").get(), before);
  assert.deepEqual(db.prepare("SELECT * FROM workflow_requests").all(), workflow);
  assert.deepEqual(db.prepare("SELECT * FROM course_review_assignees").all(), reviewers);
  const added = db.prepare("SELECT * FROM courses WHERE code = 'MAT866'").get();
  assert.equal(added.term, "Bahar");
  assert.equal(added.status, "Taslak");
  assert.equal(added.instructor, "");
  assert.equal(added.instructor_assigned_at, "");
  assert.equal(added.package_json, "{}");
  const assigned = db.prepare("SELECT * FROM courses WHERE code = 'MAT868'").get();
  assert.equal(assigned.instructor_tc_kimlik, "01234567890");
  assert.equal(assigned.instructor_email, "ayse@example.test");
  assert.equal(assigned.instructor_title, "Doç. Dr.");
  assert.equal(assigned.term, "Güz ve Bahar");
  assert.equal((await (await request(file, "apply")).json()).result.created, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM courses").get().count, 3);
});

test("apply rechecks courses created after preview and rolls back all inserts on a database error", async (t) => {
  const { db, excel, request } = fixture(t);
  const file = excel([row("MAT866"), row("MAT868")]);
  assert.equal((await (await request(file)).json()).preview.summary.ready, 2);
  db.exec(`INSERT INTO courses(department, program_name, level, code, name, status, package_json) VALUES
    ('Matematik ABD', 'Matematik', 'Tezli Yüksek Lisans', 'MAT866', 'Concurrent course', 'Yayımlandı', 'Concurrent content')`);
  assert.equal((await (await request(file, "apply")).json()).result.created, 1);
  assert.equal(db.prepare("SELECT package_json FROM courses WHERE code = 'MAT866'").get().package_json, "Concurrent content");
  db.exec("CREATE TRIGGER reject_test_course BEFORE INSERT ON courses WHEN NEW.code = 'MAT874' BEGIN SELECT RAISE(ABORT, 'test failure'); END");
  const failed = await request(excel([row("MAT872"), row("MAT874")]), "apply");
  assert.equal(failed.status, 500);
  assert.equal(db.prepare("SELECT * FROM courses WHERE code = 'MAT872'").get(), undefined);
  assert.equal(db.isTransaction, false);
});

test("invalid terms, numbers, levels and partial instructor identities remain visible as errors", async (t) => {
  const { excel, request } = fixture(t);
  const file = excel([row("MAT866", { "Dönem": "Yaz" }), row("MAT868", { "Teorik": "-1" }), row("MAT901"), row("MAT872", { "Danışman E-posta": "email@example.test" }), row("MAT874", { "Danışman İsim": "Test", "Danışman T.C.": "123", "Danışman E-posta": "invalid" }), row("MAT876", { "Kredi": "1,5" })]);
  const { preview } = await (await request(file)).json();
  assert.equal(preview.summary.invalid, 5);
  assert.equal(preview.summary.ready, 1);
  assert.equal(preview.items[5].credit, 1.5);
  assert.ok(preview.items.slice(0, 5).every((item) => item.errors.length));
});

test("corrupt, empty, old or oversized workbooks are rejected and unauthorized roles cannot preview or apply", async (t) => {
  const { request, context, excel } = fixture(t);
  for (const file of ["", "not a workbook", template.toString("base64"), "A".repeat(7_000_001)]) assert.equal((await request(file)).status, 422);
  assert.equal((await request(excel([row("MAT866")]), "preview", { department: "" })).status, 422);
  context.requireDbpSession = () => ({ session: { role: "akademisyen" } });
  for (const endpoint of ["preview", "apply"]) assert.equal((await request(excel([row("MAT866")]), endpoint)).status, 403);
});

test("assignment template and reader remain compatible, while new-course upload rejects the assignment-only template", async (t) => {
  const { context, excel, request } = fixture(t);
  const headers = ["Ders Kodu", "Ders Adı", "Danışman T.C.", "Danışman Unvan", "Danışman İsim", "Danışman E-posta"];
  const oldTemplate = context.createCourseAssignmentTemplateWorkbook();
  assert.deepEqual(Array.from(context.readFirstXlsxSheetRows(oldTemplate)[0]), headers);
  const oldFile = excel([row("MAT866", { "Danışman İsim": "Test Akademisyeni", "Danışman T.C.": "01234567890" })], headers);
  assert.equal(context.readCourseAssignmentWorkbook(oldFile).length, 1);
  assert.equal(context.readCourseAssignmentWorkbook(oldFile)[0].instructor.tcKimlik, "01234567890");
  assert.equal((await request(oldFile)).status, 422);
});
