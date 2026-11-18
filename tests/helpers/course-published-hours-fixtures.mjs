import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";

const source = readFileSync(new URL("../../server.mjs", import.meta.url), "utf8");
const declarations = [...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)];
export const publishedHoursScope = { department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", code: "MAT864" };

export function publishedHoursFixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  for (const table of ["courses", "workflow_requests"]) {
    db.exec(source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n    \\);`))[0]);
  }
  for (const column of ["instructor_tc_kimlik", "instructor_email", "instructor_title", "instructor_source", "instructor_assigned_at"]) {
    db.exec(`ALTER TABLE courses ADD COLUMN ${column} TEXT`);
  }
  db.prepare(`INSERT INTO courses(department, program_name, level, code, name, theory, practice, status, package_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'Örnek Ders', 3, 1, 'Public', '{}', 'before', 'before')`)
    .run(publishedHoursScope.department, publishedHoursScope.programName, publishedHoursScope.level, publishedHoursScope.code);
  const context = vm.createContext({ db, URL, Request, Response, console });
  vm.runInContext('const coursePackagePublicationModel = "published-draft-v1";\n' +
    source.match(/const courseListSelect = `[\s\S]*?`;/)[0] + "\n" +
    declarations.map(([declaration]) => declaration).join("\n"), context);
  const row = () => db.prepare("SELECT * FROM courses WHERE id = 1").get();
  Object.assign(context, {
    repairText: (value = "") => String(value), repairObject: (value) => value,
    displayLevel: (value) => value, levelKey: (value) => value,
    normalizeDbCourseForList: (course) => course,
    getPublicVisibilityMap: () => ({}), isCoursePubliclyVisible: () => true,
    isDepartmentPoolCourseRecord: () => false,
    courseIdentityEditFor: () => null, canonicalCourseCode: (code) => code,
    courseRowsForIdentity: () => [row()],
    deactivateCourseReviewAssignees() {}, recordWorkflowRequest() {}, audit() {},
    courseWorkflowSummaryFromSubmit: () => ({}),
    ensureDb() {}, stripBasePath: (pathname) => pathname.replace(/^\/dbp/u, ""),
    jsonResponse: (data, init) => Response.json(data, init),
  });
  const save = (data, status = "Public") => {
    db.prepare("UPDATE courses SET package_json = ?, status = ? WHERE id = 1")
      .run(typeof data === "string" ? data : JSON.stringify(data), status);
    context.publicCourseRouteIndexCache = undefined;
  };
  const list = async () => {
    const response = await context.handleDbpApi(new Request("http://localhost/dbp/api/dbp/courses?publicVisible=true"));
    assert.equal(response.status, 200, await response.clone().text());
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    return (await response.json()).courses[0];
  };
  return { context, db, row, save, list };
}
