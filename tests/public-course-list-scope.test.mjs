import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { publishedHoursFixture } from "./helpers/course-published-hours-fixtures.mjs";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)]
  .map((match) => [match[1], match[0]]));

function fixture(t) {
  const { context, db } = publishedHoursFixture(t);
  db.exec(`DELETE FROM courses;
    CREATE INDEX idx_courses_program ON courses(department, program_name, level);
    CREATE TABLE public_visibility (key TEXT PRIMARY KEY, visible INTEGER, updated_at TEXT);`);
  // Use the production text, level, visibility and workflow rules rather than the helper's stubs.
  vm.runInContext(source.match(/const textRepairPairs = \[[\s\S]*?\n\];/)[0] + "\n" +
    source.match(/const testProgramSeed = \{[\s\S]*?\n\};/)[0] + "\n" +
    ["repairText", "repairObject", "displayLevel", "levelKey", "getPublicVisibilityMap",
      "isCoursePubliclyVisible", "courseWorkflowSummaryFromSubmit"]
      .map((name) => declarations.get(name)).join("\n"), context);
  const insert = db.prepare(`INSERT INTO courses
    (department, program_name, level, code, name, theory, practice, status, package_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 3, 1, ?, ?, 'before', 'before')`);
  const add = (course = {}) => {
    const identity = { department: "İşletme ABD", programName: "İşletme", level: "Tezli Yüksek Lisans",
      code: "ISL801", name: "Örnek Ders", status: "Public", ...course };
    insert.run(identity.department, identity.programName, identity.level, identity.code, identity.name,
      identity.status, JSON.stringify(identity.package || {}));
    return identity;
  };
  const visibility = (key, visible) => db.prepare("INSERT OR REPLACE INTO public_visibility VALUES (?, ?, 'now')")
    .run(key, Number(visible));
  const queries = [];
  context.db = { prepare(sql) {
    const statement = db.prepare(sql);
    if (!sql.includes("AS published_identity_json")) return statement;
    return { all(...params) {
      const rows = statement.all(...params);
      queries.push({ sql, params, rows: rows.length });
      return rows;
    } };
  } };
  const request = async (filters, limit = 0) => {
    const query = new URLSearchParams({ ...filters, limit });
    const response = await context.handleDbpApi(new Request(`http://localhost/dbp/api/dbp/courses?${query}`));
    assert.equal(response.status, 200, await response.clone().text());
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    return response.json();
  };
  const legacy = (filters, limit = 0) => {
    const courses = context.dbCourseList(filters);
    return JSON.parse(JSON.stringify({ courses: limit ? courses.slice(0, limit) : courses,
      total: courses.length, source: "database" }));
  };
  return { context, db, add, visibility, queries, request, legacy };
}

test("public department lists project only matching rows and retain Turkish/spelling aliases and sibling programs", async (t) => {
  const { add, db, queries, request, legacy } = fixture(t);
  add();
  add({ department: "ISLETME ANABILIM DALI", code: "ISL802" });
  add({ department: "İÅŸletme ABD", code: "ISL803" });
  add({ programName: "Uluslararası İşletmecilik", level: "Doktora", code: "ISL901" });
  add({ department: "Matematik ABD", programName: "Matematik", code: "MAT801" });
  const filters = { department: "işletme anabilim dalı", publicVisible: true };
  const expected = legacy(filters);
  queries.length = 0;
  const result = await request(filters);
  assert.deepEqual(result, expected);
  assert.equal(result.total, 4);
  assert.equal(queries.length, 1);
  assert.equal(queries[0].rows, 4, "unrelated departments must not reach package projection or list processing");
  const plan = db.prepare(`EXPLAIN QUERY PLAN ${queries[0].sql}`).all(...queries[0].params);
  assert.ok(plan.some(({ detail }) => /SEARCH courses USING INDEX idx_courses_program/.test(detail)));
});

test("public program and level filters retain level aliases, sorting, totals and limits", async (t) => {
  const { add, queries, request, legacy } = fixture(t);
  add({ code: "ISL803" });
  add({ level: "Tezli YL", code: "ISL801" });
  add({ code: "ISL802" });
  add({ level: "Doktora", code: "ISL901" });
  add({ programName: "Uluslararası İşletmecilik", code: "UIS801" });
  for (const scope of [
    { department: "İşletme ABD", programName: "ISLETME", level: "Tezli YL" },
    { programName: "İşletme", level: "Tezli Yüksek Lisans" },
    { level: "Doktora" },
  ]) {
    const filters = { ...scope, publicVisible: true };
    const expected = legacy(filters, 2);
    queries.length = 0;
    assert.deepEqual(await request(filters, 2), expected);
    assert.equal(queries[0].rows, scope.level === "Doktora" ? 1 : 3);
  }
});

test("SQL scoping preserves course/program/level visibility overrides and published hours/status alongside drafts", async (t) => {
  const { add, context, visibility, request, legacy } = fixture(t);
  const published = add({ status: "Taslak", package: { publicationModel: "published-draft-v1",
    published: { status: "Yayımlandı", package: { identity: { theory: 2, practice: 0 } } },
    draft: { package: { identity: { theory: 9, practice: 9 } } } } });
  const hidden = add({ code: "ISL802" });
  add({ code: "ISL803", status: "Taslak" });
  const filters = { department: "İşletme ABD", publicVisible: true };
  visibility(context.courseVisibilityKeyFor(hidden), false);
  let result = await request(filters);
  assert.deepEqual(result, legacy(filters));
  assert.equal(result.total, 2);
  assert.equal(result.courses[0].status, "Yayımlandı");
  assert.equal(result.courses[0].theory, 2);
  assert.equal(result.courses[0].practice, 0);
  assert.equal(result.courses[1].status, "Taslak", "visibility and approval status remain separate rules");
  const programKey = context.programVisibilityKeyFor(published);
  visibility(programKey, false);
  assert.deepEqual(await request(filters), legacy(filters));
  assert.equal((await request(filters)).total, 0);
  const levelKey = context.programLevelVisibilityKeyFromKey(programKey, published.level);
  visibility(levelKey, true);
  result = await request(filters);
  assert.deepEqual(result, legacy(filters));
  assert.equal(result.total, 2, "explicit level visibility still overrides the program default");
  visibility(levelKey, false);
  visibility(context.courseVisibilityKeyFor(hidden), true);
  assert.equal((await request(filters)).total, 0, "a course override cannot bypass a hidden level");
});

test("public scoping keeps canonical deduplication and searches after identity normalization", async (t) => {
  const { add, context, request, legacy } = fixture(t);
  context.normalizeDbCourseForList = (course) => course.code === "DAN801"
    ? { ...course, code: "DAN8XX", name: "DANIŞMANLIK" } : course;
  add({ code: "DAN801" });
  add({ code: "DAN8XX" });
  add({ department: "Matematik ABD", programName: "Matematik", code: "DAN801" });
  const filters = { department: "İşletme ABD", q: "DAN8XX", publicVisible: true };
  const result = await request(filters, 1);
  assert.deepEqual(result, legacy(filters, 1));
  assert.equal(result.total, 1);
  assert.equal(result.courses[0].code, "DAN8XX");
});

test("missing and quoted scopes are safe, and unscoped public catalog searches retain their results", async (t) => {
  const { add, queries, request, legacy } = fixture(t);
  add();
  add({ department: "Test' OR 1=1 --", programName: "Test", code: "TST801" });
  for (const scope of [
    { department: "Missing ABD" }, { department: "İşletme ABD", programName: "Missing" },
    { department: "Test' OR 1=1 --" }, { q: "Örnek" }, {},
  ]) {
    const filters = { ...scope, publicVisible: true };
    const expected = legacy(filters);
    queries.length = 0;
    assert.deepEqual(await request(filters), expected);
    if (scope.department?.includes("Missing") || scope.programName === "Missing") {
      assert.equal(queries.length, 0, "unknown scopes do not need any package projection");
    }
  }
});

test("management list requests continue using the existing path", async (t) => {
  const { add, context, request, legacy } = fixture(t);
  add();
  add({ department: "Matematik ABD", programName: "Matematik", code: "MAT801" });
  context.publicCourseListRows = () => assert.fail("non-public requests must not use the optimized public path");
  for (const filters of [{}, { department: "İşletme ABD" }, { publicVisible: false, limit: 5000 }]) {
    assert.deepEqual(await request(filters), legacy(filters));
  }
});
