import assert from "node:assert/strict";
import test from "node:test";
import { adminQualityFixture } from "./helpers/admin-quality-fixtures.mjs";
import { qualityReportExportRows, qualityReportHeaders, qualityReportStatuses, approvalRate } from "../lib/quality/adminQualityReport.ts";
import { summarizeQualityByInstructor, summarizeQualityByProgram } from "../lib/quality/dbpQualityRules.ts";
import { createXlsxBlob } from "../lib/downloadXlsx.ts";

test("admin and public calculations share counts, assignment rules and a persisted data time", async () => {
  const { context, metadata, courses } = adminQualityFixture();
  const snapshot = await context.buildQualitySnapshot("test");
  const report = await context.currentAdminQualityReport();
  assert.equal(report.generatedAt, snapshot.generatedAt);
  assert.equal(report.institute.totalCourses, 11);
  assert.equal(report.institute.inactiveCourses, 2);
  assert.equal(report.institute.publicCourses, 9);
  assert.equal(report.institute.approvedCourses, 3);
  assert.equal(report.institute.unapprovedCourses, 6);
  assert.equal(report.institute.awaitingAssignmentCourses, 4);
  assert.equal(report.institute.publicCourses, snapshot.institute.totalCourses);
  for (const key of ["approvedCourses", "unapprovedCourses", "awaitingAssignmentCourses"]) assert.equal(report.institute[key], snapshot.institute[key]);
  const byCode = new Map(report.courses.map((course) => [course.code, course]));
  for (const code of ["ISL2", "ISL3", "ISL4", "ISL5"]) assert.equal(byCode.get(code).awaitingAssignment, true, code);
  for (const code of ["ISL6", "ISL7"]) assert.equal(byCode.get(code).awaitingAssignment, false, code);
  assert.equal(byCode.get("ISL7").instructor, "Doç. Dr. Paket Hocası");
  assert.equal(byCode.has("HIDDEN1"), false);
  assert.equal(byCode.get("ISL1").instructorTcKimlik, undefined);
  const summaries = summarizeQualityByProgram(report.courses, report.programCatalog);
  assert.equal(summaries.reduce((sum, row) => sum + row.missingInstructorCount, 0), 4);
  assert.equal(summarizeQualityByInstructor(report.courses).find((row) => row.instructor === "Atama bekleyen dersler").courseCount, 4);
  // Later edits must not mix live totals with yesterday's public metrics.
  courses.pop();
  assert.equal((await context.currentAdminQualityReport()).institute.totalCourses, 11);
  assert.ok(metadata.has("quality_control_report_v1"));
});

test("ABD rows include branch programs and empty departments, with exact institute reconciliation", async () => {
  const { context } = adminQualityFixture();
  const report = await context.currentAdminQualityReport();
  const business = report.departments.find((row) => row.department === "İşletme ABD");
  assert.equal(business.totalCourses, 9);
  assert.equal(business.publicCourses, 8);
  assert.equal(business.approvedCourses, 3);
  assert.equal(report.departments.find((row) => row.department === "Boş ASD").totalCourses, 0);
  assert.equal(report.departments.some((row) => row.department === "Muhasebe ve Finansman"), false);
  for (const row of [...report.departments, report.institute]) {
    assert.equal(row.totalCourses, row.inactiveCourses + row.publicCourses);
    assert.equal(row.publicCourses, row.approvedCourses + row.unapprovedCourses);
    assert.equal(Object.values(row.statusCounts).reduce((sum, count) => sum + count, 0), row.unapprovedCourses);
  }
  for (const key of ["totalCourses", "inactiveCourses", "publicCourses", "approvedCourses", "unapprovedCourses", "awaitingAssignmentCourses"]) {
    assert.equal(report.departments.reduce((sum, row) => sum + row[key], 0), report.institute[key], key);
  }
});

test("old snapshots bootstrap the admin report once; daily refresh updates both reports together", async () => {
  const { context, metadata, courses } = adminQualityFixture();
  metadata.set("quality_indicators_snapshot_v4", JSON.stringify({ generatedAt: new Date().toISOString(), institute: { totalCourses: 123 } }));
  const report = await context.currentAdminQualityReport();
  const publicSnapshot = JSON.parse(metadata.get("quality_indicators_snapshot_v4"));
  assert.equal(report.generatedAt, publicSnapshot.generatedAt);
  assert.equal(report.institute.publicCourses, publicSnapshot.institute.totalCourses);
  courses[0].status = "Düzeltme İstendi";
  await context.buildQualitySnapshot("daily");
  const updated = await context.currentAdminQualityReport();
  assert.equal(updated.institute.approvedCourses, 2);
  assert.equal(updated.institute.unapprovedCourses, 7);
});

test("report endpoint checks session and module access, and never caches its response", async () => {
  const { context } = adminQualityFixture();
  const request = (role) => context.handleDbpApi(new Request("http://localhost/dbp/api/dbp/admin/quality-report", {
    headers: role ? { "X-DBP-Session": `uri:${encodeURIComponent(JSON.stringify({ role }))}` } : {},
  }));
  assert.equal((await request()).status, 401);
  assert.equal((await request("akademisyen")).status, 403);
  for (const role of ["admin", "enstitu_yoneticisi", "lee_ogrenci_isleri"]) {
    const response = await request(role);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal((await response.json()).institute.publicCourses, 9);
  }
});

test("Excel export includes every ABD, numeric totals, every process status and the data time", async () => {
  const { context } = adminQualityFixture();
  const report = await context.currentAdminQualityReport();
  const rows = qualityReportExportRows(report);
  const statuses = qualityReportStatuses(report);
  assert.deepEqual(rows[0], qualityReportHeaders(statuses));
  assert.equal(rows.length, report.departments.length + 5);
  const total = rows[report.departments.length + 1];
  assert.equal(total[0], "Enstitü toplamı");
  assert.deepEqual(total.slice(1, 6), [11, 2, 9, 3, 6]);
  assert.equal(typeof total[6], "number");
  assert.equal(approvalRate({ publicCourses: 0, approvedCourses: 0 }), 0);
  const blob = createXlsxBlob(rows, "ABD Kalite Raporu");
  const bytes = new Uint8Array(await blob.arrayBuffer());
  assert.equal(Buffer.from(bytes).subarray(0, 2).toString(), "PK");
  const xml = new TextDecoder().decode(bytes);
  assert.match(xml, /ABD Kalite Raporu/u);
  assert.match(xml, /Enstitü toplamı/u);
  assert.match(xml, /Komisyon Onayı Bekliyor/u);
  assert.match(xml, /Veri tarihi \(Türkiye\)/u);
  assert.match(xml, /<c r="B5"><v>11<\/v><\/c>/u);
});

test("all-passive scopes have zero public metrics; uncatalogued programs are retained in guide totals", async () => {
  const { context, courses, visibility } = adminQualityFixture();
  courses.push({ ...courses[0], code: "NEW1", department: "Yeni ABD", programName: "Yeni Program", instructor: "Atama Bekliyor" });
  let report = await context.currentAdminQualityReport();
  assert.equal(report.institute.totalCourses, 12);
  assert.equal(report.departments.find((row) => row.department === "Yeni ABD").awaitingAssignmentCourses, 1);
  assert.equal(summarizeQualityByProgram(report.courses, report.programCatalog).reduce((sum, row) => sum + row.missingInstructorCount, 0), 5);
  for (const course of courses) visibility[context.courseVisibilityKeyFor(course)] = false;
  await context.buildQualitySnapshot("all-passive");
  report = await context.currentAdminQualityReport();
  assert.equal(report.institute.totalCourses, 12);
  assert.equal(report.institute.inactiveCourses, 12);
  assert.equal(report.institute.publicCourses, 0);
  assert.equal(report.institute.approvedCourses, 0);
  assert.equal(report.institute.unapprovedCourses, 0);
  assert.equal(report.institute.awaitingAssignmentCourses, 0);
  assert.equal(report.courses.length, 0);
  assert.equal(approvalRate(report.institute), 0);
});
