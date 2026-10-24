import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const identity = { code: "DAN8XX", name: "DANIŞMANLIK", department: "Elektrik Elektronik Mühendisliği ABD", programName: "Elektrik Elektronik Mühendisliği", level: "Tezli Yüksek Lisans" };
const assignedInstructor = "Dr. Öğr. Üyesi İbrahim Öztürk";

function fixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec("CREATE TABLE courses (id INTEGER PRIMARY KEY, code TEXT, name TEXT, department TEXT, program_name TEXT, level TEXT, status TEXT, instructor TEXT, package_json TEXT, updated_at TEXT)");
  const original = { detailFields: { coordinator: assignedInstructor, instructors: assignedInstructor, purpose: "Approved purpose" } };
  db.prepare("INSERT INTO courses VALUES (1, ?, ?, ?, ?, ?, 'Public', ?, ?, 'before')")
    .run(identity.code, identity.name, identity.department, identity.programName, identity.level, assignedInstructor, JSON.stringify(original));
  const rows = () => db.prepare("SELECT * FROM courses").all();
  const context = vm.createContext({
    db, URL, Response, console,
    repairText: (value) => String(value ?? ""),
    normalizeScope: (value) => String(value ?? "").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/\p{M}/gu, "").replaceAll("ı", "i").trim(),
    stripBasePath: (pathname) => pathname.replace(/^\/dbp/u, ""),
    ensureDb() {}, upsertSessionUser() {}, audit() {},
    requireDbpSession: () => ({ session: { role: "admin", name: "Admin" } }),
    readJsonBody: (request) => request.json(), jsonResponse: (data, init) => Response.json(data, init),
    displayLevel: (value) => value, courseCodeMatchesLevel: () => true,
    canEditCoursePackage: () => true, canApproveCoursePackage: () => true,
    committeeMembersForDepartment: () => [], replaceCourseReviewAssignees() {}, deactivateCourseReviewAssignees() {}, recordWorkflowRequest() {},
    courseRowsForIdentity: rows, countRows: () => 1,
    courseWorkflowSummary: () => ({}), latestWorkflowCorrection: () => null,
    getPublicVisibilityMap: () => ({}), normalizeDbCourseForList: (course) => course, isCoursePubliclyVisible: () => true,
    isPublicCourseStatus: (status) => ["Public", "Yayımlandı"].includes(status),
    publicCourseForRoute: () => ({ row: rows()[0], course: identity }),
  });
  const names = ["sanitizeInstructorName", "isMeaningfulInstructorName", "repairObject", "packageWithCourseInstructor", "parseCoursePackageJson", "isVersionedCoursePackage", "compactCoursePackageEnvelope", "coursePackageRecords", "publicPackageRecordForRow", "editablePackageRecordForRow", "hasAnyCoursePackage", "packageJsonForDraft", "packageJsonForPublication", "expectedStatusesForTransition", "transitionCoursePackageStatus", "courseFromRow", "coursePackagePdfPayload", "handleDbpApi"];
  vm.runInContext(source.match(/const placeholderInstructorNames = new Set\([\s\S]*?\n\]\);/)[0] + '\nconst coursePackagePublicationModel = "published-draft-v1";\n' + names.map((name) => {
    assert.ok(declarations.has(name), name);
    return declarations.get(name);
  }).join("\n"), context);
  context.hasPublicReadableCoursePackage = (row) => Boolean(context.publicPackageRecordForRow(row));
  const request = async (endpoint = "course-package", body, publicOnly = false) => {
    const query = new URLSearchParams({ ...identity, ...(publicOnly ? { public: "1" } : {}) });
    const response = await context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/${endpoint}?${query}`, {
      method: body ? "POST" : "GET",
      ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...identity, ...body }) } : {}),
    }));
    assert.equal(response.status, 200, await response.clone().text());
    return response.json();
  };
  return { context, db, rows, request };
}

test("DAN8XX saved advisor fields survive submission, admin approval and all package readers", async (t) => {
  const { context, rows, request } = fixture(t);
  const details = { coordinator: "Öğrencinin Danışmanı", instructors: "Öğrencinin Danışmanı", purpose: "Revised purpose" };
  await request("course-package", { status: "Komisyon Onayı Bekliyor", package: { detailFields: details } });
  assert.deepEqual((await request()).package.detailFields, details, "editor reopens the saved draft");
  assert.equal((await request("course-package", undefined, true)).package.detailFields.coordinator, assignedInstructor, "pending edits do not leak to the public revision");
  await request("course-package/status", { status: "Yayımlandı" });
  for (const [endpoint, publicOnly] of [["course-package", false], ["course-package", true], ["public-course", false]]) {
    const payload = await request(endpoint, undefined, publicOnly);
    assert.deepEqual(payload.package.detailFields, details, endpoint);
    assert.equal(payload.package.instructor, details.instructors, endpoint);
  }
  const pdf = context.coursePackagePdfPayload({ ...identity, publicOnly: true });
  assert.equal(pdf.package.detailFields.coordinator, details.coordinator);
  assert.equal(pdf.package.detailFields.instructors, details.instructors);
  assert.equal(rows()[0].instructor, assignedInstructor, "package edits preserve assignment/access metadata");
  assert.deepEqual(JSON.parse(rows()[0].package_json).published.package.detailFields, details);
});

test("coordinator and multiple instructors remain independent of the assigned teacher", async (t) => {
  const { request } = fixture(t);
  const details = { coordinator: "Prof. Dr. Koordinatör", instructors: "Dr. Birinci Hoca; Dr. İkinci Hoca" };
  await request("course-package", { status: "Komisyon Onayı Bekliyor", package: { detailFields: details } });
  await request("course-package/status", { status: "Yayımlandı" });
  assert.deepEqual((await request("course-package", undefined, true)).package.detailFields, details);
});

test("assignment only fills missing package fields, preserving explicit empty and generic values", (t) => {
  const { context } = fixture(t);
  const assignment = { instructor: assignedInstructor };
  const emptyPackage = context.packageWithCourseInstructor({}, assignment);
  assert.equal(emptyPackage.detailFields.coordinator, assignedInstructor);
  assert.equal(emptyPackage.detailFields.instructors, assignedInstructor);
  const partial = context.packageWithCourseInstructor({ detailFields: { coordinator: "Öğrencinin Danışmanı" } }, assignment);
  assert.equal(partial.detailFields.coordinator, "Öğrencinin Danışmanı");
  assert.equal(partial.detailFields.instructors, assignedInstructor);
  const blank = context.packageWithCourseInstructor({ detailFields: { coordinator: "", instructors: "" } }, assignment);
  assert.equal(blank.detailFields.coordinator, "");
  assert.equal(blank.detailFields.instructors, "");
  const saved = { detailFields: { coordinator: "Danışman", instructors: "Danışman" } };
  for (const instructor of ["", "Atama bekliyor", "Öğrencinin Danışmanı"]) {
    assert.deepEqual(JSON.parse(JSON.stringify(context.packageWithCourseInstructor(saved, { instructor }))), saved);
  }
});
