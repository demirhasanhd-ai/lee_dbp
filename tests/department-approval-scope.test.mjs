import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";
import { randomUUID } from "node:crypto";
import ts from "typescript";
import { programTyycGroups, programTyycValidationMessage } from "../lib/programTyycMatrix.mjs";
import { initialContributionMatrix, missingProgramOutcomeMappingMessage } from "../lib/courseContributionDefaults.mjs";
import { recordAudit } from "../lib/auditTrail.mjs";

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
  for (const table of ["metadata", "programs", "program_profiles", "courses", "committee_members", "course_review_assignees", "workflow_requests", "public_visibility", "audit_logs"]) {
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
  const context = vm.createContext({ db, URL, Request, Response, console, randomUUID, programTyycValidationMessage, initialContributionMatrix, missingProgramOutcomeMappingMessage });
  vm.runInContext('const coursePackagePublicationModel = "published-draft-v1";\n' +
    source.match(/const courseListSelect = `[\s\S]*?`;/)[0] + "\n" +
    declarations.map(([declaration]) => declaration).join("\n"), context);
  Object.assign(context, {
    repairText: (value = "") => String(value), repairObject: (value) => value,
    isMeaningfulInstructorName: (value) => Boolean(value),
    ensureDb() {}, upsertSessionUser() {}, audit: (action, actor, payload) => recordAudit(db, action, actor, payload),
    stripBasePath: (pathname) => pathname.replace(/^\/dbp/, ""),
    requireDbpSession: () => ({ session }),
    readJsonBody: (request) => request.json(), jsonResponse: (value, init) => Response.json(value, init),
    displayLevel: (value) => value,
    normalizeDbCourseForList: (course) => {
      const edit = context.courseIdentityEditFor(course);
      return edit ? { ...course, code: edit.code, name: edit.name } : course;
    },
    courseCodeCandidates: (code) => [code], courseCodeMatchesLevel: () => true,
    publicCourseRouteIndexCache: undefined, canonicalCourseCode: (code) => code, isCoursePubliclyVisible: () => true,
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
  const request = async (user, endpoint, body, method = body === undefined ? "GET" : "POST") => {
    session = user;
    return context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/${endpoint}`, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }));
  };
  return { db, context, identities, request };
}

test("İşletme profile revisions preserve course scores by outcome and freeze the approved matrix", async (t) => {
  const { db, identities, request } = fixture(t);
  const [course, otherLevel] = identities.filter(({ programName }) => programName === "İşletme");
  const initial = Array.from({ length: 11 }, (_, i) => `Başlangıç çıktısı ${i + 1}`);
  for (const identity of [course, otherLevel]) {
    const rows = programTyycGroups(identity.level).flatMap((group) => group.items.map((item) => ({ ...item, values: initial.map(() => 0) })));
    db.prepare("INSERT INTO program_profiles(program_name, level, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by) VALUES (?, ?, ?, ?, 'seed', 'seed', 'seed')")
      .run(identity.programName, identity.level, JSON.stringify(initial), JSON.stringify(rows));
  }
  const params = (value) => new URLSearchParams(value).toString();
  const readCourse = async (identity = course, user = instructor) =>
    (await request(user, `course-package?${params(identity)}`)).json();
  const readProfile = async () =>
    (await (await request(chair, `program-profile?${params(course)}`)).json()).profile;
  const saveProfile = async (profile, user = chair) => request(user, "program-profile", { profile }, "PUT");
  const savePackage = (packageData, status = "Taslak") =>
    request(instructor, "course-package", { ...course, status, package: packageData });

  assert.equal((await savePackage({ outcomes: ["Ders çıktısı"], contributionMatrix: [{ P1: 3, P2: 5 }] })).status, 200);
  const profile = await readProfile();
  assert.equal((await saveProfile(profile, { ...chair, department: "Matematik ABD" })).status, 403);
  const savedResponse = await saveProfile({
    ...profile, outcomes: [...initial, "Yeni çıktı"], outcomeIds: [...profile.outcomeIds, null],
    tyycRows: profile.tyycRows.map((row) => ({ ...row, values: [...row.values, 0] })),
  });
  assert.equal(savedResponse.status, 200);
  const added = (await savedResponse.json()).profile;
  const editing = await readCourse();
  assert.equal(editing.programOutcomes.length, 12);
  const newId = editing.programOutcomes[11].id;
  assert.equal(editing.programOutcomes[11].text, "Yeni çıktı");
  assert.equal(editing.package.contributionMatrix[0][newId], undefined);
  assert.equal((await readCourse(otherLevel)).programOutcomes.length, 11);

  const revised = await saveProfile({
    ...added, outcomes: ["Revize edilen ikinci çıktı", ...added.outcomes.slice(2)], outcomeIds: added.outcomeIds.slice(1),
    tyycRows: added.tyycRows.map((row) => ({ ...row, values: row.values.slice(1) })),
  });
  assert.equal(revised.status, 200);
  assert.equal((await savePackage({ ...editing.package, programOutcomes: editing.programOutcomes })).status, 409);
  const refreshed = await readCourse();
  assert.deepEqual(refreshed.programOutcomes[0], { id: "P2", text: "Revize edilen ikinci çıktı" });
  assert.equal(refreshed.programOutcomes.some(({ id }) => id === "P1"), false);
  assert.equal(refreshed.package.contributionMatrix[0].P2, 5);
  const submission = {
    ...refreshed.package, programOutcomes: refreshed.programOutcomes,
    contributionMatrix: [Object.fromEntries(refreshed.programOutcomes.map(({ id }) => [id, id === newId ? 4 : refreshed.package.contributionMatrix[0][id] || 3]))],
  };
  assert.equal((await savePackage(submission, "Komisyon Onayı Bekliyor")).status, 200);
  const review = (await readCourse(course, member)).package;
  assert.deepEqual(review.programOutcomes, refreshed.programOutcomes);
  assert.deepEqual(review.contributionMatrix, submission.contributionMatrix);
  assert.equal((await request(member, "course-package/status", { ...course, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal((await request(chair, "course-package/status", { ...course, status: "Yayımlandı" })).status, 200);
  const latest = await readProfile();
  assert.equal((await saveProfile({ ...latest, outcomes: latest.outcomes.map((text, index) => index ? text : "Sonraki revizyon") })).status, 200);
  const published = JSON.parse(db.prepare("SELECT package_json FROM courses WHERE code = ?").get(course.code).package_json).published.package;
  assert.deepEqual(published.programOutcomes, review.programOutcomes);
  assert.deepEqual(published.contributionMatrix, review.contributionMatrix);
});

test("profile saves reject incomplete TYYÇ cells without changing stored data and accept explicit zeroes", async (t) => {
  const { db, identities, request } = fixture(t);
  const scope = identities.find(({ programName }) => programName === "İşletme");
  const outcomes = Array.from({ length: 11 }, (_, index) => `Çıktı ${index + 1}`);
  const rows = ["T1", "T2"].map((code) => ({ code, title: `${code} yeterliliği`, values: outcomes.map(() => 2) }));
  db.prepare("INSERT INTO program_profiles(program_name, level, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by) VALUES (?, ?, ?, ?, 'seed', 'seed', 'seed')")
    .run(scope.programName, scope.level, JSON.stringify(outcomes), JSON.stringify(rows));
  const before = db.prepare("SELECT * FROM program_profiles").get();
  const profile = { ...scope, outcomes: Array.from({ length: 15 }, (_, index) => `Çıktı ${index + 1}`), tyycRows: rows };
  const save = (value) => request(chair, "program-profile", { profile: value }, "PUT");
  const untouched = await save(profile);
  assert.equal(untouched.status, 400);
  assert.match((await untouched.json()).message, /T1: PÇ12, PÇ13, PÇ14, PÇ15/);
  assert.deepEqual(db.prepare("SELECT * FROM program_profiles").get(), before);

  profile.tyycRows = rows.map((row) => ({ ...row, values: [...row.values, 0, null, null, null] }));
  const partial = await save(profile);
  assert.equal(partial.status, 400);
  const partialMessage = (await partial.json()).message;
  assert.match(partialMessage, /T2: PÇ13, PÇ14, PÇ15/);
  assert.doesNotMatch(partialMessage, /PÇ12/);
  assert.deepEqual(db.prepare("SELECT * FROM program_profiles").get(), before);

  profile.tyycRows = rows.map((row) => ({ ...row, values: [...row.values, 0, 0, 0, 0] }));
  assert.equal((await save({ ...profile, tyycRows: profile.tyycRows.slice(0, 1) })).status, 400, "omitting a saved row must not bypass validation");
  assert.equal((await save({ ...profile, tyycRows: [] })).status, 400);
  assert.equal((await save({ ...profile, tyycRows: [{ ...profile.tyycRows[0], values: [4, ...profile.tyycRows[0].values.slice(1)] }, profile.tyycRows[1]] })).status, 400);
  assert.deepEqual(db.prepare("SELECT * FROM program_profiles").get(), before);
  const complete = await save(profile);
  assert.equal(complete.status, 200);
  assert.deepEqual((await complete.json()).profile.tyycRows, profile.tyycRows);
  assert.equal(JSON.parse(db.prepare("SELECT outcomes_json FROM program_profiles").get().outcomes_json).length, 15);
});

function seedCountChangeProfile(db, scope, count = 3) {
  const outcomes = Array.from({ length: count }, (_, index) => ({ id: `P${index + 1}`, text: `Alan çıktısı ${index + 1}` }));
  db.prepare("INSERT INTO program_profiles(program_name, level, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by) VALUES (?, ?, ?, ?, 'seed', 'seed', 'seed')")
    .run(scope.programName, scope.level, JSON.stringify(outcomes), JSON.stringify([{ code: "T1", title: "Yeterlilik", values: outcomes.map(() => 2) }]));
  return outcomes;
}

async function changeOutcomeCount(request, scope, count) {
  const profile = (await (await request(chair, `program-profile?${new URLSearchParams(scope)}`)).json()).profile;
  return request(chair, "program-profile", { profile: {
    ...profile,
    outcomes: Array.from({ length: count }, (_, index) => profile.outcomes[index] ?? `Eklenen çıktı ${index + 1}`),
    outcomeIds: Array.from({ length: count }, (_, index) => profile.outcomeIds[index] ?? null),
    tyycRows: profile.tyycRows.map((row) => ({ ...row, values: Array.from({ length: count }, (_, index) => row.values[index] ?? 0) })),
  } }, "PUT");
}

test("a future PÇ count increase resets only the matching scope, withdraws old publications and requires complete mapping before a fresh approval cycle", async (t) => {
  const { db, context, identities, request } = fixture(t);
  const scope = identities.find(({ programName }) => programName === "İşletme");
  const programOutcomes = seedCountChangeProfile(db, scope);
  const published = { outcomes: ["Ders çıktısı 1", "Ders çıktısı 2"], programOutcomes, contributionMatrix: [{ P1: 2, P2: 3 }, { P3: 4 }], detailFields: { purpose: "Eski onaylı içerik" } };
  const draft = { ...published, detailFields: { purpose: "Öğretim elemanının son değişikliği" } };
  const statuses = ["Yayımlandı", "Komisyon Onayı Bekliyor", "ABD Son Onayı Bekliyor", "Düzeltme İstendi", "Taslak"];
  const courses = statuses.map((status, index) => ({ ...scope, code: index ? `COUNT${index}801` : scope.code, status }));
  for (const [index, course] of courses.entries()) {
    const envelope = index === 0 ? published : { publicationModel: "published-draft-v1", published: { package: published, status: "Yayımlandı" }, draft: { package: draft, status: course.status } };
    if (index) db.prepare("INSERT INTO courses(department, program_name, level, code, name, instructor, status, package_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'before', 'before')")
      .run(course.department, course.programName, course.level, course.code, course.name, instructor.name, course.status, JSON.stringify(envelope));
    else db.prepare("UPDATE courses SET status = ?, package_json = ? WHERE code = ?").run(course.status, JSON.stringify(envelope), course.code);
    context.replaceCourseReviewAssignees({ body: course, members: [member], actor: chair.username });
    context.recordWorkflowRequest({ kind: "course-package-submit", body: course, route: "Akademisyen -> DBP Komisyonu", status: course.status, actor: instructor.name });
  }
  const otherScopesBefore = db.prepare("SELECT * FROM courses WHERE program_name <> ? OR level <> ? ORDER BY id").all(scope.programName, scope.level);
  const getRow = (course = scope) => db.prepare("SELECT * FROM courses WHERE code = ?").get(course.code);
  const priorPublic = context.publicCourseForRoute({ ...scope, routeCode: scope.code });
  assert.ok(context.publicPackageRecordForRow(priorPublic.row));
  const result = await changeOutcomeCount(request, scope, 4);
  assert.equal(result.status, 200, await result.clone().text());
  assert.deepEqual(db.prepare("SELECT * FROM courses WHERE program_name <> ? OR level <> ? ORDER BY id").all(scope.programName, scope.level), otherScopesBefore);
  for (const [index, course] of courses.entries()) {
    const row = getRow(course), data = JSON.parse(row.package_json);
    assert.equal(row.status, "Taslak");
    assert.equal(data.draft.status, "Taslak");
    assert.equal(data.outcomeCountChange.previousCount, 3);
    assert.equal(data.outcomeCountChange.currentCount, 4);
    assert.deepEqual(data.draft.package.contributionMatrix, published.contributionMatrix);
    assert.equal(data.draft.package.detailFields.purpose, index ? draft.detailFields.purpose : published.detailFields.purpose);
    assert.deepEqual(data.published.package, published);
    assert.equal(context.publicPackageRecordForRow(row), null);
    assert.equal(context.courseReviewAssigneesForTarget(course).length, 0);
    const cached = context.publicCourseForRoute({ ...course, routeCode: course.code });
    assert.equal(cached.row.status, "Taslak", "previously cached public rows must be refreshed");
    const publicResponse = await request(null, `public-course?${new URLSearchParams(course)}`);
    assert.equal(publicResponse.status, 200);
    const publicData = await publicResponse.json();
    assert.equal(publicData.status, "Taslak");
    assert.equal(publicData.package, null);
    assert.equal(publicData.packagePending, true);
  }
  const resets = db.prepare("SELECT * FROM audit_logs WHERE action = 'course.package.outcome-count-reset'").all();
  assert.equal(resets.length, courses.length);
  const profileLog = JSON.parse(db.prepare("SELECT payload_json FROM audit_logs WHERE action = 'program_profile.save' ORDER BY id DESC LIMIT 1").get().payload_json);
  assert.equal(profileLog.previousCount, 3);
  assert.equal(profileLog.currentCount, 4);
  assert.equal(profileLog.affectedCourses, courses.length);
  assert.match(profileLog.note, /3 → 4/);
  assert.equal((await request(member, "course-package/status", { ...scope, status: "ABD Son Onayı Bekliyor" })).status, 409);
  assert.equal((await request(chair, "course-package/status", { ...scope, status: "Yayımlandı" })).status, 409);
  const loaded = await (await request(instructor, `course-package?${new URLSearchParams(scope)}`)).json();
  const packageData = { ...loaded.package, programOutcomes: loaded.programOutcomes };
  const submit = (pkg, status = "Komisyon Onayı Bekliyor") => request(instructor, "course-package", { ...scope, status, package: pkg });
  const incomplete = await submit(packageData);
  assert.equal(incomplete.status, 422);
  assert.match((await incomplete.json()).message, /PÇ4 hiçbir ders öğrenme çıktısıyla eşleştirilmemiş/);
  const bypass = { ...packageData };
  delete bypass.programOutcomes;
  assert.equal((await submit(bypass)).status, 422, "omitting the outcome snapshot cannot bypass the check");
  assert.equal((await submit(packageData, "Taslak")).status, 200);
  assert.equal(context.publicPackageRecordForRow(getRow()), null, "saving the draft must not restore the archived publication");
  const newId = loaded.programOutcomes[3].id;
  packageData.contributionMatrix = [{ ...packageData.contributionMatrix[0], [newId]: 5 }, packageData.contributionMatrix[1]];
  assert.equal((await submit(packageData)).status, 200);
  assert.equal(context.courseReviewAssigneesForTarget(scope).length, 1, "resubmission creates a new committee assignment");
  assert.equal(context.publicPackageRecordForRow(getRow()), null);
  assert.equal((await request(member, "course-package/status", { ...scope, status: "ABD Son Onayı Bekliyor" })).status, 200);
  assert.equal(context.publicPackageRecordForRow(getRow()), null);
  assert.equal((await request(chair, "course-package/status", { ...scope, status: "Yayımlandı" })).status, 200);
  assert.equal(context.publicPackageRecordForRow(getRow()).package.contributionMatrix[0][newId], 5);
  assert.equal(JSON.parse(getRow().package_json).outcomeCountChange, undefined);

  // Ordinary teacher improvements keep the newly approved publication available.
  const improved = { ...packageData, detailFields: { purpose: "Yeni iyileştirme" } };
  assert.equal((await submit(improved, "Taslak")).status, 200);
  assert.equal(context.publicPackageRecordForRow(getRow()).package.detailFields.purpose, published.detailFields.purpose);
  assert.equal((await submit(improved)).status, 200);
  const publicData = await (await request(null, `public-course?${new URLSearchParams(scope)}`)).json();
  assert.equal(publicData.status, "Yayımlandı");
  assert.equal(publicData.package.detailFields.purpose, published.detailFields.purpose);
});

test("PÇ text, ordering and other profile edits leave every course byte-for-byte unchanged; a count decrease still withdraws it", async (t) => {
  const { db, context, identities, request } = fixture(t);
  const scope = identities.find(({ programName }) => programName === "İşletme");
  const programOutcomes = seedCountChangeProfile(db, scope);
  const published = { outcomes: ["Ders çıktısı"], programOutcomes, contributionMatrix: [{ P1: 2, P2: 3, P3: 4 }] };
  db.prepare("UPDATE courses SET status = 'Yayımlandı', package_json = ? WHERE code = ?").run(JSON.stringify(published), scope.code);
  const before = db.prepare("SELECT * FROM courses ORDER BY id").all();
  const profile = (await (await request(chair, `program-profile?${new URLSearchParams(scope)}`)).json()).profile;
  for (const changed of [profile, { ...profile, manager: "Yeni yönetici", outcomes: profile.outcomes.map((text) => `${text} revizyon`) },
    { ...profile, outcomes: [...profile.outcomes].reverse(), outcomeIds: [...profile.outcomeIds].reverse() }]) {
    delete changed.updatedAt;
    assert.equal((await request(chair, "program-profile", { profile: changed }, "PUT")).status, 200);
    assert.deepEqual(db.prepare("SELECT * FROM courses ORDER BY id").all(), before);
  }
  assert.equal((await changeOutcomeCount(request, scope, 2)).status, 200);
  const row = db.prepare("SELECT * FROM courses WHERE code = ?").get(scope.code);
  assert.equal(row.status, "Taslak");
  assert.equal(context.publicPackageRecordForRow(row), null);
  assert.deepEqual(JSON.parse(row.package_json).draft.package.contributionMatrix, published.contributionMatrix);
});

test("a failed count-change reset rolls back profile, courses, reviewers, workflow and audit records together", async (t) => {
  const { db, identities, request } = fixture(t);
  const scope = identities.find(({ programName }) => programName === "İşletme");
  seedCountChangeProfile(db, scope);
  const snapshot = () => JSON.stringify(["program_profiles", "courses", "course_review_assignees", "workflow_requests", "audit_logs"].map((table) => db.prepare(`SELECT * FROM ${table} ORDER BY id`).all()));
  const before = snapshot();
  db.exec("CREATE TRIGGER reject_count_reset BEFORE INSERT ON workflow_requests WHEN NEW.kind = 'course-package-outcome-count-change' BEGIN SELECT RAISE(ABORT, 'test reset failure'); END");
  assert.equal((await changeOutcomeCount(request, scope, 4)).status, 500);
  assert.equal(snapshot(), before);
});

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
