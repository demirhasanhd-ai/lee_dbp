import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import test from "node:test";
import { nextDailyRefreshDate } from "../lib/publicDataRefreshPlan.mjs";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const flush = () => new Promise((resolve) => setImmediate(resolve));
const day = 86_400_000;

function load(context, names) {
  vm.runInContext(names.map((name) => {
    assert.ok(declarations.has(name), name);
    return declarations.get(name);
  }).join("\n"), context);
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function cacheContext() {
  let now = Date.parse("2026-10-16T12:00:00Z");
  const timers = new Map();
  const errors = [];
  const context = vm.createContext({
    Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    },
    console: { log() {}, error: (...args) => errors.push(args) },
    nextDailyRefreshDate,
    homeStatsCacheTtlMs: day,
    homeStatsCacheWarmupHour: 3,
    qualitySnapshotTtlMs: day,
    homeStatsCache: undefined,
    homeStatsRefreshPromise: undefined,
    homeStatsDailyWarmupTimer: undefined,
    homeStatsCacheCreatedAt: 0,
    qualitySnapshotCache: undefined,
    qualitySnapshotRefreshPromise: undefined,
    qualityRefreshTimer: undefined,
    qualitySnapshotMetadataKey: "quality_indicators_snapshot_v3",
    db: { prepare: () => ({ get: () => undefined }) },
    parseJsonField: (value, fallback) => value ? JSON.parse(value) : fallback,
    setTimeout: (callback, delay) => {
      const timer = { unref() {} };
      timers.set(timer, { callback, delay });
      return timer;
    },
    clearTimeout: (timer) => timers.delete(timer),
  });
  load(context, [
    "isHomeStatsCacheFresh", "warmHomeStatsCache", "queueHomeStatsCacheRefresh", "cachedHomeStats",
    "nextHomeStatsCacheWarmupDate", "courseStatisticsSchedule", "scheduleDailyHomeStatsCacheWarmup",
    "readQualitySnapshot", "refreshQualitySnapshot", "queueQualitySnapshotRefresh", "currentQualitySnapshot", "scheduleQualityRefresh",
  ]);
  return { context, timers, errors, advance: (ms) => { now += ms; } };
}

test("daily refresh uses Istanbul 03:00 across midnight, month and year boundaries", () => {
  for (const [now, expected] of [
    ["2026-10-15T23:59:59Z", "2026-10-16T00:00:00.000Z"],
    ["2026-10-16T00:00:00Z", "2026-10-17T00:00:00.000Z"],
    ["2026-10-31T21:15:00Z", "2026-11-01T00:00:00.000Z"],
    ["2026-12-31T23:30:00Z", "2027-01-01T00:00:00.000Z"],
    ["2028-02-28T23:00:00Z", "2028-02-29T00:00:00.000Z"],
  ]) assert.equal(nextDailyRefreshDate(new Date(now)).toISOString(), expected);
});

test("concurrent first home requests share one calculation", async () => {
  const { context } = cacheContext();
  const pending = deferred();
  let calls = 0;
  context.homeStats = () => { calls++; return pending.promise; };
  const requests = [context.cachedHomeStats(), context.cachedHomeStats()];
  await flush();
  assert.equal(calls, 1);
  const stats = { totalCourses: 10, totalPrograms: 2 };
  pending.resolve(stats);
  assert.deepEqual(await Promise.all(requests), [stats, stats]);
  assert.equal(await context.cachedHomeStats(), stats);
  assert.equal(calls, 1);
});

test("expired home statistics remain available while refreshing and after a failure", async () => {
  const { context, advance, errors } = cacheContext();
  const original = { totalCourses: 10, totalPrograms: 2 };
  context.homeStats = async () => original;
  await context.warmHomeStatsCache("startup");
  advance(day + 1);
  const pending = deferred();
  let calls = 0;
  context.homeStats = () => { calls++; return pending.promise; };
  assert.equal(await context.cachedHomeStats(), original);
  assert.equal(await context.cachedHomeStats(), original);
  assert.equal(calls, 1);
  pending.reject(new Error("temporary failure"));
  await flush();
  assert.equal(context.homeStatsCache, original);
  assert.ok(errors.length);
  const updated = { totalCourses: 11, totalPrograms: 2 };
  context.homeStats = async () => updated;
  assert.equal(await context.cachedHomeStats(), original);
  await flush();
  assert.equal(await context.cachedHomeStats(), updated);
});

test("a saved quality snapshot is reused until 24 hours old, then refreshed in the background", async () => {
  const { context, advance } = cacheContext();
  const original = { generatedAt: new Date(context.Date.now()).toISOString(), institute: { totalCourses: 10 } };
  context.db = { prepare: () => ({ get: () => ({ value: JSON.stringify(original) }) }) };
  let calls = 0;
  const pending = deferred();
  context.buildQualitySnapshot = async () => {
    calls++;
    const snapshot = await pending.promise;
    context.qualitySnapshotCache = snapshot;
    return snapshot;
  };
  assert.equal(JSON.stringify(await context.currentQualitySnapshot()), JSON.stringify(original));
  advance(day - 1);
  await context.currentQualitySnapshot();
  assert.equal(calls, 0);
  advance(1);
  const first = await context.currentQualitySnapshot();
  assert.equal(await context.currentQualitySnapshot(), first);
  assert.equal(calls, 1);
  const manual = context.refreshQualitySnapshot("admin");
  await flush();
  assert.equal(calls, 1, "manual refresh shares an ongoing background calculation");
  const updated = { generatedAt: new Date(context.Date.now()).toISOString(), institute: { totalCourses: 11 } };
  pending.resolve(updated);
  await manual;
  assert.equal(await context.currentQualitySnapshot(), updated);
});

test("missing quality snapshot requests share a calculation; failed refresh preserves the last snapshot", async () => {
  const { context } = cacheContext();
  const pending = deferred();
  let calls = 0;
  context.buildQualitySnapshot = () => { calls++; return pending.promise; };
  const requests = [context.currentQualitySnapshot(), context.currentQualitySnapshot()];
  await flush();
  assert.equal(calls, 1);
  const snapshot = { generatedAt: new Date(context.Date.now()).toISOString() };
  pending.resolve(snapshot);
  assert.deepEqual(await Promise.all(requests), [snapshot, snapshot]);
  context.qualitySnapshotCache = snapshot;
  context.buildQualitySnapshot = async () => { throw new Error("database unavailable"); };
  assert.equal(await context.queueQualitySnapshotRefresh("daily"), snapshot);
  assert.equal(await context.currentQualitySnapshot(), snapshot);
});

test("both daily timers refresh without clearing existing values and rearm for the next day", async () => {
  const { context, timers, advance } = cacheContext();
  const home = { totalCourses: 10, totalPrograms: 2 };
  const quality = { generatedAt: new Date(context.Date.now()).toISOString() };
  context.homeStatsCache = home;
  context.homeStatsCacheCreatedAt = context.Date.now();
  context.qualitySnapshotCache = quality;
  const homePending = deferred(), qualityPending = deferred();
  context.homeStats = () => homePending.promise;
  context.buildQualitySnapshot = () => qualityPending.promise;
  context.scheduleDailyHomeStatsCacheWarmup();
  context.scheduleQualityRefresh();
  assert.equal(timers.size, 2);
  const scheduled = [...timers.entries()];
  assert.equal(scheduled[0][1].delay, 12 * 60 * 60 * 1000);
  assert.equal(scheduled[1][1].delay, scheduled[0][1].delay);
  advance(scheduled[0][1].delay);
  for (const [timer, { callback }] of scheduled) { timers.delete(timer); callback(); }
  await flush();
  assert.equal(await context.cachedHomeStats(), home);
  assert.equal(await context.currentQualitySnapshot(), quality);
  homePending.resolve(home);
  qualityPending.resolve(quality);
  await flush();
  assert.equal(timers.size, 2);
  for (const { delay } of timers.values()) assert.equal(delay, day);
});

test("quality API reports the daily schedule even for a snapshot saved with the old schedule", async () => {
  const { context } = cacheContext();
  context.URL = URL;
  context.Response = Response;
  context.ensureDb = () => {};
  context.stripBasePath = (pathname) => pathname.replace(/^\/dbp/, "");
  context.jsonResponse = (payload, init) => Response.json(payload, init);
  context.qualitySnapshotCache = {
    generatedAt: new Date(context.Date.now()).toISOString(),
    schedule: ["Old quarterly schedule"], institute: { totalCourses: 10 },
  };
  load(context, ["handleDbpApi"]);
  const response = await context.handleDbpApi(new Request("http://localhost/dbp/api/dbp/quality-stats"));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.nextRefreshAt, "2026-10-17T00:00:00.000Z");
  assert.match(payload.schedule.join(" "), /Her gün.*03:00.*Europe\/Istanbul/);
  assert.equal(payload.institute.totalCourses, 10);
});

test("course saves, approvals, creation and assignments persist without starting statistics work", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(`CREATE TABLE courses (
    id INTEGER PRIMARY KEY, academic_year TEXT, program_code TEXT, department TEXT, program_name TEXT,
    level TEXT, code TEXT, name TEXT, type TEXT, credit REAL, ects REAL, theory REAL, practice REAL, term TEXT,
    status TEXT, instructor TEXT, instructor_tc_kimlik TEXT, instructor_email TEXT, instructor_title TEXT,
    instructor_source TEXT, instructor_assigned_at TEXT, source TEXT, package_json TEXT, created_at TEXT, updated_at TEXT
  )`);
  db.prepare("INSERT INTO courses(id, code, name, status, package_json) VALUES (1, 'ABC801', 'Example', 'Taslak', '{}')").run();
  const work = [];
  const trap = () => { work.push("unexpected statistics refresh"); };
  const context = vm.createContext({
    URL, Response, db,
    console: { error: (...args) => assert.fail(args.join(" ")) },
    stripBasePath: (pathname) => pathname.replace(/^\/dbp/, ""),
    ensureDb() {},
    requireDbpSession: () => ({ session: { role: "admin", name: "Test" } }),
    readJsonBody: (request) => request.json(),
    jsonResponse: (payload, init) => Response.json(payload, init),
    upsertSessionUser() {},
    displayLevel: (value) => value,
    repairText: (value) => value,
    repairObject: (value) => value,
    normalizeScope: (value) => value.toLocaleLowerCase("tr-TR"),
    courseCodeMatchesLevel: () => true,
    courseRowsForIdentity: () => [db.prepare("SELECT * FROM courses WHERE id = 1").get()],
    canEditCoursePackage: () => true,
    canApproveCoursePackage: () => true,
    isCommitteeMemberForCourse: () => true,
    committeeMembersForDepartment: () => [{ name: "Member" }],
    recordWorkflowRequest() {}, replaceCourseReviewAssignees() {}, audit() {},
    courseWorkflowSummary: () => ({}),
    countRows: () => db.prepare("SELECT COUNT(*) AS total FROM courses").get().total,
    coursePackagePublicationModel: "published-draft-v1",
    isPublicCourseStatus: (status) => status === "Yayımlandı",
    findExactCourseRow: ({ code }) => db.prepare("SELECT * FROM courses WHERE code = ?").get(code),
    resolveInstructorIdentityFromName: async () => ({}),
    transitionCoursePackageStatus: (body, status) => {
      db.prepare("UPDATE courses SET status = ? WHERE id = 1").run(status);
      return {};
    },
    applyCourseAssignmentImport: (items) => {
      for (const item of items) db.prepare("UPDATE courses SET instructor = ? WHERE code = ?").run(item.instructor, item.code);
      return { changed: items.length };
    },
    invalidateHomeStatsCache: trap, warmHomeStatsCache: trap, queueHomeStatsCacheRefresh: trap,
    queueQualitySnapshotRefresh: trap, refreshQualitySnapshot: trap, refreshHomeInstructorCount: trap,
    setTimeout: trap,
  });
  load(context, ["parseCoursePackageJson", "isVersionedCoursePackage", "compactCoursePackageEnvelope", "coursePackageRecords", "packageJsonForDraft", "handleDbpApi"]);
  const identity = { code: "ABC801", name: "Example", department: "Example ABD", programName: "Example", level: "Tezli Yüksek Lisans" };
  const operations = [
    ["course-package", { ...identity, status: "Taslak", package: { detailFields: { purpose: "Saved draft" } } }],
    ["course-package", { ...identity, status: "Komisyon Onayı Bekliyor", package: { detailFields: { purpose: "Submitted draft" } } }],
    ["course-package/status", { ...identity, status: "ABD Son Onayı Bekliyor" }],
    ["course-package/status", { ...identity, status: "Yayımlandı" }],
    ["course-management", { ...identity, action: "assign", instructor: "Updated Instructor" }],
    ["course-management", { ...identity, action: "assign", term: "Bahar" }],
    ["course-management", { ...identity, code: "ABC802", term: "Bahar", instructor: "New Instructor" }],
    ["course-assignment-import/apply", { items: [{ code: "ABC801", instructor: "Imported Instructor" }] }],
  ];
  for (const [endpoint, body] of operations) {
    context.publicCourseRouteIndexCache = new Map([["old", "cached course"]]);
    const response = await context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/${endpoint}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }));
    assert.equal(response.status, 200, `${endpoint}: ${body.status || body.action || "create/import"}`);
    assert.equal((await response.json()).ok, true);
    assert.equal(context.publicCourseRouteIndexCache, undefined, "course detail index must read updated data on the next request");
    assert.deepEqual(work, []);
  }
  const existing = db.prepare("SELECT * FROM courses WHERE id = 1").get();
  assert.equal(existing.status, "Yayımlandı");
  assert.equal(existing.instructor, "Imported Instructor");
  assert.equal(JSON.parse(existing.package_json).draft.package.detailFields.purpose, "Submitted draft");
  assert.equal(db.prepare("SELECT instructor FROM courses WHERE code = 'ABC802'").get().instructor, "New Instructor");
});
