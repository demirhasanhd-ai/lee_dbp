import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = [...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)];
const catalogModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../lib/data/programs.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: catalogModule.exports });

const chair = { username: "chair", name: "İşletme Başkanı", role: "abd_asd_baskani", department: "İşletme ABD" };
const member = { username: "reviewer", name: "Komisyon Üyesi", role: "akademisyen", department: "Matematik ABD" };
const instructor = { username: "teacher", name: "Ders Hocası", role: "akademisyen", department: "İşletme ABD" };

function fixture(t, department = chair.department) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  for (const table of ["metadata", "programs", "courses", "committee_members", "course_review_assignees", "workflow_requests", "public_visibility"]) {
    const schema = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`));
    assert.ok(schema, table);
    db.exec(schema[0]);
  }
  for (const column of ["instructor_tc_kimlik", "instructor_email", "instructor_title", "instructor_source", "instructor_assigned_at"]) {
    db.exec(`ALTER TABLE courses ADD COLUMN ${column} TEXT`);
  }
  for (const program of catalogModule.exports.LEE_PROGRAMS) {
    db.prepare("INSERT INTO programs(main_department, department, program_name, flags, levels_json, created_at, updated_at) VALUES (?, ?, ?, '', ?, 'now', 'now')")
      .run(program.mainDepartment, program.department, program.programName, JSON.stringify(program.levels));
  }
  let session = instructor;
  const context = vm.createContext({ db, URL, Request, Response, console });
  vm.runInContext('const coursePackagePublicationModel = "published-draft-v1";\n' +
    source.match(/const courseListSelect = `[\s\S]*?`;/)[0] + "\n" +
    declarations.map(([declaration]) => declaration).join("\n"), context);
  Object.assign(context, {
    repairText: (value = "") => String(value), repairObject: (value) => value,
    isMeaningfulInstructorName: (value) => Boolean(value),
    ensureDb() {}, upsertSessionUser() {}, audit() {},
    stripBasePath: (pathname) => pathname.replace(/^\/dbp/, ""),
    requireDbpSession: () => ({ session }),
    readJsonBody: (request) => request.json(), jsonResponse: (value, init) => Response.json(value, init),
    displayLevel: (value) => value,
    normalizeDbCourseForList: (course) => {
      const edit = context.courseIdentityEditFor(course);
      return edit ? { ...course, code: edit.code, name: edit.name } : course;
    },
    courseCodeCandidates: (code) => [code], courseCodeMatchesLevel: () => true,
    // Keep fixtures focused on routing; production list rendering is tested separately.
    dbCourseListFromRows: (rows) => rows.map((row) => ({
      id: row.id, department: row.department, programName: row.program_name,
      code: row.code, level: row.level, instructor: row.instructor, status: row.status,
    })),
    instructorCandidateRows: (user) => db.prepare("SELECT * FROM courses WHERE instructor = ?").all(user.name),
  });
  const identities = [];
  for (const [branchIndex, program] of catalogModule.exports.LEE_PROGRAMS.filter((item) => item.mainDepartment === department).entries()) {
    for (const [levelIndex, level] of program.levels.entries()) {
      const identity = { department: program.department, programName: program.programName, level, code: `BR${branchIndex}${levelIndex}801`, name: "Örnek Ders" };
      db.prepare("INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, status, instructor, package_json, created_at, updated_at) VALUES ('2026', '', ?, ?, ?, ?, ?, 'Taslak', ?, '{}', 'now', 'now')")
        .run(identity.department, identity.programName, level, identity.code, identity.name, instructor.name);
      identities.push(identity);
    }
  }
  context.replaceCommitteeMembers({ department, members: [member] }, "chair");
  const request = async (user, endpoint, body) => {
    session = user;
    return context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/${endpoint}`, {
      method: body === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }));
  };
  return { db, context, identities, request };
}

test("all seven levels route from instructor to the shared İşletme committee and then to its chair for publication", async (t) => {
  const { context, identities, request, db } = fixture(t);
  assert.equal(identities.length, 7);
  for (const identity of identities) {
    const submission = await request(instructor, "course-package", {
      ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { content: identity.code }, savedAt: "now" },
    });
    assert.equal(submission.status, 200, JSON.stringify(await submission.clone().json()));
    const result = await submission.json();
    assert.equal(result.status, "Komisyon Onayı Bekliyor");
    assert.equal(result.committeeSkipped, false);
    const assignees = context.courseReviewAssigneesForTarget(identity);
    assert.deepEqual(Array.from(assignees, (item) => item.username), [member.username]);
    assert.equal(context.canReadCoursePackage(member, identity), true);
    assert.equal(context.canReadCoursePackage(chair, identity), true);
    assert.equal((await request(chair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 409, "chair must wait for committee approval");
    assert.equal((await request(member, "course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" })).status, 200);
    assert.equal((await request(member, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 403);
    assert.equal((await request(chair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
    const row = db.prepare("SELECT * FROM courses WHERE code = ?").get(identity.code);
    assert.equal(row.status, "Yayımlandı");
    assert.equal(JSON.parse(row.package_json).published.package.detailFields.content, identity.code);
  }
});

test("renaming a pending course preserves the frozen reviewers, history and publication, and approval continues with its new code", async (t) => {
  const { db, context, identities, request } = fixture(t);
  const identity = identities[3];
  const content = { identity: { name: "Old academic name", code: "OLD801" }, detailFields: { purpose: "Saved academic content" } };
  assert.equal((await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: content })).status, 200);
  const before = db.prepare("SELECT * FROM courses WHERE code = ?").get(identity.code);
  const history = db.prepare("SELECT * FROM workflow_requests ORDER BY id").all();
  const reviewers = db.prepare("SELECT * FROM course_review_assignees ORDER BY id").all();
  const renamed = { ...identity, code: "NEW801", name: "İdari Ders Adı" };
  const response = await request({ role: "admin", username: "admin" }, "course-management", {
    ...identity, action: "assign", courseId: before.id, newCode: renamed.code, name: renamed.name,
  });
  assert.equal(response.status, 200, JSON.stringify(await response.clone().json()));
  const after = db.prepare("SELECT * FROM courses WHERE id = ?").get(before.id);
  assert.deepEqual({ ...after, name: before.name, code: before.code, updated_at: before.updated_at }, { ...before });
  assert.deepEqual(db.prepare("SELECT * FROM workflow_requests ORDER BY id").all(), history);
  assert.deepEqual(db.prepare("SELECT * FROM course_review_assignees ORDER BY id").all(), reviewers);
  assert.equal(context.workflowTarget(renamed), context.workflowTarget(identity));
  assert.equal(context.isCommitteeMemberForCourse(member, renamed), true);
  const preview = await request(member, `course-package?${new URLSearchParams(renamed)}`);
  const previewData = await preview.json();
  assert.equal(previewData.package.identity.code, renamed.code);
  assert.equal(previewData.package.identity.name, renamed.name);
  assert.equal((await request(member, "course-package/status", { ...renamed, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal((await request(chair, "course-package/status", { ...renamed, status: "Yayımlandı" })).status, 200);
  const published = db.prepare("SELECT * FROM courses WHERE id = ?").get(before.id);
  assert.equal(published.status, "Yayımlandı");
  assert.equal(JSON.parse(published.package_json).published.package.detailFields.purpose, content.detailFields.purpose);
});

test("package API ignores academic identity changes and retains the authoritative course identity", async (t) => {
  const { db, identities, request } = fixture(t);
  const identity = identities[0];
  const response = await request(instructor, "course-package", {
    ...identity, name: "Unauthorized name", status: "Taslak",
    package: { name: "Unauthorized name", code: "OTHER801", identity: { name: "Unauthorized name", code: "OTHER801", language: "Türkçe" }, fields: { "Dersin Adı": "Unauthorized name", Kodu: "OTHER801" }, detailFields: { purpose: "Updated purpose" } },
  });
  assert.equal(response.status, 200);
  const row = db.prepare("SELECT * FROM courses WHERE code = ?").get(identity.code);
  assert.equal(row.name, identity.name);
  const saved = JSON.parse(row.package_json).draft.package;
  assert.equal(saved.identity.code, identity.code);
  assert.equal(saved.identity.name, identity.name);
  assert.equal(saved.identity.language, "Türkçe");
  assert.equal(saved.fields["Dersin Adı"], identity.name);
  assert.equal(saved.fields.Kodu, identity.code);
  assert.equal(saved.detailFields.purpose, "Updated purpose");
  assert.equal((await request(instructor, "course-management", { ...identity, action: "assign", name: "Unauthorized" })).status, 403);
});

test("committee and chair course lists contain every child branch, without unrelated ABD courses", (t) => {
  const { context, identities, db } = fixture(t);
  db.prepare("INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, status, instructor, package_json, created_at, updated_at) VALUES ('2026', '', 'Matematik ABD', 'Matematik', 'Tezli Yüksek Lisans', 'MAT801', 'Başka Ders', 'Komisyon Onayı Bekliyor', 'Başka Hoca', '{}', 'now', 'now')").run();
  for (const user of [chair, member]) {
    assert.deepEqual(Array.from(context.sessionScopedCourses(user), (course) => course.code).sort(), identities.map((course) => course.code).sort());
  }
  const foreignChair = { ...chair, department: "Matematik ABD" };
  assert.equal(context.canApproveCoursePackage(foreignChair, identities[3]), false);
  assert.equal(context.canReadCoursePackage(foreignChair, identities[3]), false);
  assert.equal(context.canManageCommittee(foreignChair, "Muhasebe ve Finansman"), false);
  assert.equal(context.canManageCommittee(chair, "Yönetim Organizasyon"), true);
  assert.equal(context.departmentScopeIncludes("Muhasebe ve Finansman", "İşletme"), false);
});

test("pending submissions retain their assigned reviewers when the ABD committee changes", async (t) => {
  const { context, identities, request } = fixture(t);
  const identity = identities[3];
  assert.equal((await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { content: "Bekleyen içerik" } } })).status, 200);
  const replacement = { ...member, username: "new-reviewer", name: "Yeni Üye" };
  context.replaceCommitteeMembers({ department: "İşletme ABD", members: [replacement] }, "chair");
  assert.equal(context.isCommitteeMemberForCourse(member, identity), true);
  assert.equal(context.isCommitteeMemberForCourse(replacement, identity), false);
  assert.ok(context.committeeMembershipsForSession(member).length, "frozen assignment still supplies the review module");
  assert.ok(context.sessionScopedCourses(member).some((course) => course.code === identity.code));
  assert.equal((await request(member, "course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal((await request(chair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
});

test("a branch submission still skips committee only when its parent ABD has no committee", async (t) => {
  const { context, identities, request } = fixture(t);
  context.replaceCommitteeMembers({ department: "İşletme ABD", members: [] }, "chair");
  const identity = identities[5];
  const response = await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { content: "İçerik" } } });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.status, "ABD Son Onayı Bekliyor");
  assert.equal(result.committeeSkipped, true);
  assert.equal((await request(chair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
});

test("both İktisat and Ekonomi ve Finans use one ABD committee and the İktisat chair's final approval", async (t) => {
  const { context, identities, request } = fixture(t, "İktisat ABD");
  const iktisatChair = { ...chair, department: "İktisat ABD" };
  assert.deepEqual(identities.map((identity) => identity.programName), ["Ekonomi ve Finans", "İktisat"]);
  for (const identity of identities) {
    const response = await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { content: identity.programName } } });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).committeeSkipped, false);
    assert.equal(context.canReadCoursePackage(iktisatChair, identity), true);
    assert.equal(context.canApproveCoursePackage(chair, identity), false);
    assert.equal(context.isCommitteeMemberForCourse(member, identity), true);
    assert.equal((await request(member, "course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" })).status, 200);
    assert.equal((await request(iktisatChair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
  }
  for (const user of [iktisatChair, member]) assert.equal(context.sessionScopedCourses(user).length, 2);
});

test("a new database-only Makine branch immediately inherits its ABD committee, course access and approval", async (t) => {
  const { db, context, request } = fixture(t, "Makine Mühendisliği ABD");
  const machineChair = { ...chair, department: "Makine Mühendisliği ABD" };
  const identity = { department: "İmalat Sistemleri", programName: "İmalat Sistemleri", level: "Tezli Yüksek Lisans", code: "IMS801", name: "İleri İmalat" };
  // Add the branch after initialization. No source catalog update or server restart.
  db.prepare("INSERT INTO programs(main_department, department, program_name, flags, levels_json, created_at, updated_at) VALUES (?, ?, ?, '', ?, 'now', 'now')")
    .run(machineChair.department, identity.department, identity.programName, JSON.stringify([identity.level]));
  db.prepare("INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, status, instructor, package_json, created_at, updated_at) VALUES ('2026', '', ?, ?, ?, ?, ?, 'Taslak', ?, '{}', 'now', 'now')")
    .run(identity.department, identity.programName, identity.level, identity.code, identity.name, instructor.name);
  const catalog = await request(machineChair, "programs");
  assert.equal(catalog.status, 200);
  assert.equal(catalog.headers.get("Cache-Control"), "no-store");
  const program = (await catalog.json()).programs.find((item) => item.programName === identity.programName);
  assert.equal(program.mainDepartment, machineChair.department);
  assert.deepEqual(program.levels, [identity.level]);
  for (const user of [machineChair, member]) {
    assert.ok(context.sessionScopedCourses(user).some((course) => course.code === identity.code));
  }
  assert.equal(context.canApproveCoursePackage(chair, identity), false);
  const response = await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { content: "Yeni program içeriği" } } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).committeeSkipped, false);
  assert.equal(context.isCommitteeMemberForCourse(member, identity), true);
  assert.equal((await request(member, "course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal((await request(machineChair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
});

test("resetting a legacy skipped-committee submission preserves content and resubmission rebuilds the parent ABD approval chain", async (t) => {
  const { db, context, identities, request } = fixture(t);
  const identity = identities[3]; // Muhasebe ve Finansman
  const content = { detailFields: { content: "Hocanın canlıda kaydettiği içerik" }, savedAt: "2026-10-23T10:00:00Z" };
  const legacyPackage = context.packageJsonForDraft("{}", content, "ABD Son Onayı Bekliyor", instructor.name, "2026-10-23T10:00:00Z");
  db.prepare("UPDATE courses SET status = 'ABD Son Onayı Bekliyor', package_json = ? WHERE code = ?").run(legacyPackage, identity.code);
  context.recordWorkflowRequest({ kind: "course-package-submit", body: identity, route: "Akademisyen -> ABD/ASD Başkanı", status: "ABD Son Onayı Bekliyor", actor: instructor.name });
  context.replaceCourseReviewAssignees({ body: identity, members: [{ username: "old", name: "Eski Atama" }], actor: "old" });
  const admin = { ...chair, role: "admin" };
  const reset = await request(admin, "course-package/status", { ...identity, status: "Taslak", force: true });
  assert.equal(reset.status, 200);
  const row = db.prepare("SELECT * FROM courses WHERE code = ?").get(identity.code);
  assert.equal(row.status, "Taslak");
  assert.equal(row.package_json, legacyPackage);
  assert.equal(context.courseReviewAssigneesForTarget(identity).length, 0);

  const resubmission = await request(instructor, "course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: content });
  assert.equal(resubmission.status, 200);
  const result = await resubmission.json();
  assert.equal(result.status, "Komisyon Onayı Bekliyor");
  assert.equal(result.committeeSkipped, false);
  assert.equal(result.workflow.committeeSkipped, false);
  assert.deepEqual(Array.from(context.courseReviewAssigneesForTarget(identity), (assignee) => assignee.username), [member.username]);
  assert.equal((await request(member, "course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal((await request(chair, "course-package/status", { ...identity, status: "Yayımlandı" })).status, 200);
  const published = JSON.parse(db.prepare("SELECT package_json FROM courses WHERE code = ?").get(identity.code).package_json);
  assert.equal(published.published.package.detailFields.content, content.detailFields.content);
});
