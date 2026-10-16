import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import ts from "typescript";

// This database exists only in memory. Never import server.mjs: importing it
// would start the application and its production startup migrations/jobs.
export function createPublicFixtures() {
  const db = new DatabaseSync(":memory:");
  const officialModule = { exports: {} };
  const officialSource = readFileSync(new URL("../../lib/data/officialCourses.ts", import.meta.url), "utf8");
  vm.runInNewContext(ts.transpileModule(officialSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports: officialModule.exports, module: officialModule });
  const official = officialModule.exports.OFFICIAL_COURSES;
  const serverSource = readFileSync(new URL("../../server.mjs", import.meta.url), "utf8");
  const declarations = new Map([...serverSource.matchAll(/^function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((item) => [item[1], item[0]]));
  const conversion = vm.createContext({ displayLevel: (value) => value });
  vm.runInContext(["workloadRecord", "weeklyTopicRecord", "contributionRecord", "storedPackageFromSeed"].map((name) => declarations.get(name)).join("\n"), conversion);
  db.exec("CREATE TABLE courses (department TEXT, program TEXT, level TEXT, code TEXT, aliases TEXT, course_json TEXT, package_json TEXT)");
  const insert = db.prepare("INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?)");
  const packages = JSON.parse(readFileSync(new URL("../../seed/course-packages.json", import.meta.url), "utf8"));
  for (const pkg of packages) {
    const department = pkg.department || "Yönetim Bilişim Sistemleri ABD";
    const programName = pkg.programName || "Yönetim Bilişim Sistemleri";
    const aliases = new Set([pkg.code, ...(pkg.aliases || [])]);
    const matches = official.filter((course) => aliases.has(course.code) && course.department === department && course.programName === programName && course.level === pkg.level);
    const original = matches[0] || {};
    const terms = new Set(matches.map((course) => course.term));
    const course = {
      ...original, department, programName, level: pkg.level, code: pkg.code,
      name: pkg.name || original.name || pkg.code,
      type: original.type || "Seçmeli", theory: pkg.theory, practice: pkg.practice,
      credit: pkg.credit, ects: pkg.ects, instructor: pkg.instructor || original.instructor || "",
      term: terms.size > 1 ? "Güz ve Bahar" : original.term || "Güz ve Bahar",
      status: "Yayımlandı", updatedAt: "2026-10-16T09:00:00.000Z", hasPackage: true,
    };
    if (/7XX$/u.test(course.code) && /bitirme projesi/iu.test(course.name)) course.name = "BİTİRME PROJESİ";
    insert.run(department, programName, pkg.level, pkg.code, JSON.stringify([...aliases]), JSON.stringify(course), JSON.stringify(conversion.storedPackageFromSeed(pkg, course)));
  }

  return {
    close: () => db.close(),
    respond(url, options = {}) {
      const pathname = url.pathname.replace(/^\/dbp/u, "");
      if (pathname === "/api/dbp/public-visibility") return { visibility: {} };
      if (pathname === "/api/dbp/program-profile") return { profile: options.profileFor?.(url) || null };
      if (pathname === "/api/dbp/courses") {
        const rows = db.prepare("SELECT course_json FROM courses WHERE (? = '' OR department = ?) AND (? = '' OR program = ?) AND (? = '' OR level = ?)").all(
          ...["department", "programName", "level"].flatMap((key) => [url.searchParams.get(key) || "", url.searchParams.get(key) || ""]),
        );
        const courses = rows.map((row) => JSON.parse(row.course_json)).map((course) => options.courseTransform?.(course) || course);
        return { courses, total: courses.length, source: "database" };
      }
      if (["/api/dbp/course-package", "/api/dbp/public-course"].includes(pathname)) {
        if (pathname === "/api/dbp/course-package" && url.searchParams.get("public") !== "1") throw new Error("Public package tests must request the published version");
        const code = (url.searchParams.get("code") || "").toLocaleUpperCase("tr-TR");
        const rows = db.prepare("SELECT * FROM courses WHERE department = ? AND program = ? AND level = ?").all(
          url.searchParams.get("department"), url.searchParams.get("programName"), url.searchParams.get("level"),
        );
        const row = rows.find((item) => JSON.parse(item.aliases).includes(code));
        if (!row) throw new Error(`Fixture course not found: ${url.search}`);
        const course = JSON.parse(row.course_json);
        const stored = JSON.parse(row.package_json);
        const packageData = options.packageTransform ? options.packageTransform(stored) : stored;
        return {
          course: options.courseTransform?.(course) || course,
          package: options.published === false ? null : packageData,
          status: options.status || (options.published === false ? "Komisyon Onayı Bekliyor" : "Yayımlandı"),
          approvedAt: "2026-10-16T09:00:00.000Z", updatedAt: "2026-10-16T09:00:00.000Z",
          packagePending: options.published === false,
        };
      }
      throw new Error(`Unexpected test API request: ${pathname}`);
    },
  };
}
