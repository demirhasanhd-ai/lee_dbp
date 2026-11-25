import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../server.mjs", import.meta.url), "utf8");
const ast = ts.createSourceFile("server.mjs", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const names = new Set([
  "textRepairPairs", "placeholderInstructorNames", "commonProcessCourseLabels", "qualitySdgTitles",
  "repairText", "sanitizeInstructorName", "normalizeScope", "isMeaningfulInstructorName", "isCommonProcessCourse",
  "normalizePublicRouteSegment", "visibilitySlug", "programVisibilityKeyFor", "programLevelVisibilityKeyFromKey", "courseVisibilityKeyFor",
  "isPublicCourseStatus", "workloadMatchesEcts", "qualityCourseAssignment", "qualityStats", "buildAdminQualityReport",
  "readQualitySnapshot", "refreshQualitySnapshot", "currentQualitySnapshot", "buildQualitySnapshot", "currentAdminQualityReport",
  "scopedInstructorOptions", "courseMatchesFilters", "qualityScopeDefinitions", "qualitySnapshotMetadataKey", "adminQualityReportMetadataKey",
  "handleDbpApi", "requireDbpSession", "parseSession",
  "titleLoadStats", "academicTitle", "instructorPeople", "normalizeInstructorScope",
]);
const declarations = ast.statements.filter((statement) => ts.isFunctionDeclaration(statement)
  ? names.has(statement.name?.text)
  : ts.isVariableStatement(statement) && statement.declarationList.declarations.some((declaration) => names.has(declaration.name.getText(ast))))
  .map((statement) => statement.getText(ast)).join("\n");

export function adminQualityFixture() {
  const metadata = new Map();
  const visibility = {};
  const catalog = [
    { mainDepartment: "İşletme ABD", department: "İşletme", programName: "İşletme", levels: ["Tezli Yüksek Lisans"] },
    { mainDepartment: "İşletme ABD", department: "Muhasebe ve Finansman", programName: "Muhasebe ve Finansman", levels: ["Tezli Yüksek Lisans"] },
    { mainDepartment: "Matematik ABD", department: "Matematik ABD", programName: "Matematik", levels: ["Tezli Yüksek Lisans"] },
    { mainDepartment: "Boş ASD", department: "Boş ASD", programName: "Boş", levels: ["Doktora"] },
  ];
  const course = (code, fields = {}) => ({
    code, name: "TEMEL DERS", department: "İşletme", programName: "İşletme", level: "Tezli Yüksek Lisans",
    type: "Seçmeli", term: "Güz", theory: 3, practice: 0, ects: 6,
    instructor: "Prof. Dr. Örnek Hoca", status: "Yayımlandı", instructorTcKimlik: "01234567890", ...fields,
  });
  const courses = [
    course("ISL1"),
    course("ISL2", { instructor: "Atama Bekliyor", status: "Taslak" }),
    course("ISL3", { instructor: "Yok", status: "Komisyon Onayı Bekliyor" }),
    course("ISL4", { status: "Atama Bekliyor" }),
    course("ISL5", { instructor: "", name: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", status: "ABD Onayı Bekliyor" }),
    course("ISL6", { instructor: "Öğrencinin Danışmanı", name: "TEZ ÇALIŞMASI", status: "Taslak" }),
    course("ISL7", { instructor: "", packageData: { detailFields: { instructors: "Doç. Dr. Paket Hocası" } }, status: "Public" }),
    course("MUF1", { department: "Muhasebe ve Finansman", programName: "Muhasebe ve Finansman", status: "Yayınlandı" }),
    course("MAT1", { department: "Matematik ABD", programName: "Matematik", status: "Düzeltme İstendi" }),
    course("HIDDEN1", { instructor: "Atama Bekliyor", status: "Taslak" }),
    course("HIDDEN2", { department: "Matematik ABD", programName: "Matematik" }),
  ];
  const context = vm.createContext({
    URL, Response,
    db: { prepare: (sql) => ({
      all: () => { if (!sql.includes("FROM courses")) throw new Error(sql); return courses; },
      get: (key) => metadata.has(key) ? { value: metadata.get(key) } : undefined,
      run: (key, value) => metadata.set(key, value),
    }) },
    databaseProgramCatalog: () => catalog,
    getPublicVisibilityMap: () => visibility,
    dbCourseList: () => courses,
    findExactCourseRow: (value) => value,
    qualityPackageRecordForRow: (row) => row?.packageData ? { package: row.packageData } : null,
    displayLevel: (value) => value, levelKey: (value) => value,
    loadEEnstituInstructorOptions: async () => ({ instructors: [], source: "test" }),
    courseStatisticsSchedule: () => ["Her gün · 03:00"],
    titleLoadStats: () => [], departmentMatchesInstructorScope: () => true,
    parseJsonField: (value, fallback) => value ? JSON.parse(value) : fallback,
    qualitySnapshotCache: undefined, qualitySnapshotRefreshPromise: undefined, qualitySnapshotTtlMs: 86_400_000,
    queueQualitySnapshotRefresh() {}, audit() {}, ensureDb: async () => {},
    stripBasePath: (value) => value.replace(/^\/dbp/u, ""),
    jsonResponse: (body, init) => Response.json(body, init),
    modulesForRole: (role) => ["admin", "enstitu_yoneticisi", "lee_ogrenci_isleri"].includes(role) ? ["quality_reports"] : [],
  });
  vm.runInContext(declarations, context);
  for (const value of courses.filter((value) => value.code.startsWith("HIDDEN"))) visibility[context.courseVisibilityKeyFor(value)] = false;
  return { context, metadata, visibility, catalog, courses };
}
