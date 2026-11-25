import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = new Map([...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map((match) => [match[1], match[0]]));
const snapshotKey = source.match(/const qualitySnapshotMetadataKey = ("[^"]+");/u)[1];
const plain = (value) => JSON.parse(JSON.stringify(value));

function fixture() {
  const visibility = {};
  const metadata = new Map();
  const packageData = {
    detailFields: { purpose: "Amaç", content: "İçerik", methods: "Yöntem", resources: "Kaynakça" },
    outcomes: ["Öğrenme çıktısı"],
    weeklyTopics: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [index + 1, "Konu"])),
    contributionMatrix: [Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`P${index + 1}`, 3]))],
    workloads: { study: { count: 15, hours: 6 } },
    assessments: [{ name: "Sınav", percentage: 100 }],
    sdgs: ["1", "4"],
    ects: 3,
  };
  const course = (code, fields = {}) => ({
    code, name: code, department: "Matematik ABD", programName: "Matematik",
    level: "Tezli Yüksek Lisans", type: "Seçmeli", term: "Güz", ects: 3,
    theory: 3, practice: 1, instructor: "Prof. Dr. Örnek Hoca", status: "Yayımlandı",
    packageData, ...fields,
  });
  const courses = [
    course("MAT801"),
    course("MAT802", { instructor: "", status: "Atama Bekliyor", packageData: null }),
    course("MAT803", { instructor: "Doç. Dr. Gizli Hoca" }),
    course("MAT804", { instructor: "", status: "Atama Bekliyor", packageData: null }),
    course("MAT805", { isProcessCourse: true, instructor: "Doç. Dr. Gizli Hoca" }),
  ];
  const normalize = (value = "") => String(value).toLocaleLowerCase("tr-TR").trim();
  const context = vm.createContext({
    repairText: (value) => String(value), normalizeScope: normalize, normalizeInstructorScope: normalize,
    levelKey: (value) => value, displayLevel: (value) => value,
    getPublicVisibilityMap: () => visibility,
    databaseProgramCatalog: () => [{ mainDepartment: "Matematik ABD", department: "Matematik ABD", programName: "Matematik", levels: ["Tezli Yüksek Lisans"] }],
    adminQualityReportMetadataKey: "quality_control_report_v1",
    testProgramSeed: { visibilityKey: "test" }, qualitySdgTitles: { 1: "Yoksulluğa Son", 4: "Nitelikli Eğitim" },
    findExactCourseRow: (value) => value,
    qualityPackageRecordForRow: (row) => row.packageData ? { package: row.packageData } : null,
    isCommonProcessCourse: (value) => Boolean(value.isProcessCourse),
    isMeaningfulInstructorName: (value) => Boolean(value.trim()),
    departmentMatchesInstructorScope: () => true,
    loadEEnstituInstructorOptions: async () => ({ instructors: [], source: "test" }),
    courseStatisticsSchedule: () => ["Her gün · 03:00"], audit() {},
    parseJsonField: (value, fallback) => value ? JSON.parse(value) : fallback,
    qualitySnapshotCache: undefined,
    db: { prepare: (sql) => ({
      all: () => { assert.match(sql, /SELECT \* FROM courses/u); return courses; },
      get: (key) => metadata.has(key) ? { value: metadata.get(key) } : undefined,
      run: (key, value) => metadata.set(key, value),
    }) },
  });
  const names = [
    "normalizePublicRouteSegment", "visibilitySlug", "programVisibilityKeyFor", "programLevelVisibilityKeyFromKey",
    "courseVisibilityKeyFor", "courseContentVisibilityKeyFor", "isVisibilityKeyPublic", "isProgramLevelVisibleForCourse",
    "isCoursePubliclyVisible", "isPublicCourseStatus", "courseMatchesFilters",
    "academicTitle", "instructorPeople", "titleLoadStats", "workloadMatchesEcts", "scopedInstructorOptions",
    "qualityCourseAssignment", "qualityStats", "qualityScopeDefinitions", "readQualitySnapshot", "buildAdminQualityReport", "buildQualitySnapshot",
  ];
  vm.runInContext(`const qualitySnapshotMetadataKey = ${snapshotKey};\n${names.map((name) => {
    assert.ok(declarations.has(name), name);
    return declarations.get(name);
  }).join("\n")}`, context);
  context.dbCourseList = (filters) => courses.filter((value) => context.courseMatchesFilters(value, filters));
  for (const hidden of courses.slice(2)) visibility[context.courseVisibilityKeyFor(hidden)] = false;
  return { context, courses, visibility, metadata };
}

test("course-level hiding excludes courses from every quality metric, warning and teaching load", () => {
  const { context, courses, visibility } = fixture();
  const options = { courses, visibility, includeTitleLoads: true };
  const actual = plain(context.qualityStats({}, options));
  const expected = plain(context.qualityStats({}, { ...options, courses: courses.slice(0, 2) }));
  assert.deepEqual(actual, expected);
  assert.equal(actual.totalCourses, 2);
  assert.equal(actual.completePackages, 1);
  assert.equal(actual.packagedCourses, 1);
  assert.equal(actual.approvedCourses, 1);
  assert.equal(actual.unapprovedCourses, 1);
  assert.equal(actual.awaitingAssignmentCourses, 1);
  assert.equal(actual.processCourses, 0);
  assert.equal(actual.processResponsible, 0);
  assert.equal(actual.sdgLinks, 2);
  assert.deepEqual(actual.warnings.map((item) => item.code), ["MAT802"]);
  assert.deepEqual(actual.titleLoads.map((item) => [item.title, item.academics, item.assignedCourses, item.weeklyHours]), [["Prof. Dr.", 1, 1, 4]]);
  assert.deepEqual(plain(context.qualityStats({}, { includeTitleLoads: true })), actual, "database-backed calls apply the same exclusion");
});

test("only explicit course hiding changes quality scope; program and content visibility retain their behavior", () => {
  const { context, courses, visibility } = fixture();
  visibility[context.programLevelVisibilityKeyFromKey(context.programVisibilityKeyFor(courses[0]), courses[0].level)] = false;
  visibility[context.courseContentVisibilityKeyFor(courses[0])] = false;
  assert.equal(context.qualityStats().totalCourses, 2);
  visibility[context.courseVisibilityKeyFor(courses[2])] = true;
  assert.equal(context.qualityStats().totalCourses, 3);
  assert.equal(context.qualityStats().completePackages, 2);
  for (const value of courses) visibility[context.courseVisibilityKeyFor(value)] = false;
  const empty = context.qualityStats({}, { includeTitleLoads: true });
  assert.equal(empty.totalCourses, 0);
  assert.equal(empty.packagedCourses, 0);
  assert.equal(empty.sdgLinks, 0);
  assert.equal(empty.warnings.length, 0);
  assert.equal(empty.titleLoads.length, 0);
});

test("institute and program snapshots persist the same filtered metrics and ignore old unfiltered snapshots", async () => {
  const { context, metadata } = fixture();
  metadata.set("quality_indicators_snapshot_v3", JSON.stringify({ institute: { totalCourses: 999 } }));
  assert.equal(context.readQualitySnapshot(), null, "previous calculations must not be served after deployment");
  const snapshot = await context.buildQualitySnapshot("test");
  assert.equal(snapshot.institute.totalCourses, 2);
  assert.equal(snapshot.programs.length, 1);
  assert.equal(snapshot.programs[0].stats.totalCourses, 2);
  const { scope: instituteScope, ...institute } = plain(snapshot.institute);
  const { scope: programScope, ...program } = plain(snapshot.programs[0].stats);
  assert.deepEqual(instituteScope, {});
  assert.equal(programScope.programName, "Matematik");
  assert.deepEqual(program, institute);
  assert.equal(JSON.parse(metadata.get(JSON.parse(snapshotKey))).institute.totalCourses, 2);
  assert.equal(JSON.parse(metadata.get("quality_indicators_snapshot_v3")).institute.totalCourses, 999);
});

test("two filters aggregate every metric by catalog parent and track, deduplicating teaching staff", async () => {
  const { context, courses } = fixture();
  const masters = "Tezli Yüksek Lisans";
  // Use arbitrary parent/branch names: the grouping must never depend on a special ABD.
  const catalog = [
    { mainDepartment: "Örnek ABD", department: "Matematik ABD", programName: "Matematik", levels: [masters, "Doktora"] },
    { mainDepartment: "Örnek ABD", department: "Alt Dal", programName: "İkinci Program", levels: [masters] },
    { mainDepartment: "Diğer ASD", department: "Diğer ASD", programName: "Diğer", levels: ["Doktora"] },
    { mainDepartment: "Boş ABD", department: "Boş ABD", programName: "Boş", levels: [masters] },
  ];
  context.databaseProgramCatalog = () => catalog;
  courses.push(
    { ...courses[0], code: "SECOND", department: "Alt Dal", programName: "İkinci Program", term: "Bahar", status: "Taslak", packageData: null },
    { ...courses[0], code: "PHD", level: "Doktora", instructor: "Doç. Dr. Diğer Hoca" },
    { ...courses[0], code: "OTHER", department: "Diğer ASD", programName: "Diğer", level: "Doktora" },
  );
  const snapshot = plain(await context.buildQualitySnapshot());
  const find = (department, level) => snapshot.filterScopes.find((scope) => scope.mainDepartment === department && scope.level === level)?.stats;
  for (const [department, level, included] of [
    ["Örnek ABD", "", [courses[0], courses[1], courses[5], courses[6]]],
    ["Örnek ABD", masters, [courses[0], courses[1], courses[5]]],
    ["", "Doktora", [courses[6], courses[7]]],
    ["Diğer ASD", "Doktora", [courses[7]]],
    ["Boş ABD", "", []],
  ]) {
    const { scope, ...actual } = find(department, level);
    const { scope: ignored, ...expected } = plain(context.qualityStats({}, { courses: included, includeTitleLoads: true }));
    assert.deepEqual(actual, expected, `${department} / ${level}: every counter, warning, distribution, SDG and teaching load follows the same courses`);
  }
  assert.equal(find("Örnek ABD", masters).titleLoads[0].academics, 1);
  assert.equal(find("Örnek ABD", masters).titleLoads[0].assignedCourses, 2);
  assert.equal(find("Örnek ABD", masters).warnings.length, 2);
  assert.equal(find("", "Doktora").totalCourses, 2);
  assert.equal(find("Diğer ASD", masters), undefined, "unsupported program types are absent");
});
