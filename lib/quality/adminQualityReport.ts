import type { LeeProgram } from "../data/programs";
import type { QualityCourse } from "./dbpQualityRules";

export type QualityReportCounts = {
  totalCourses: number;
  inactiveCourses: number;
  publicCourses: number;
  approvedCourses: number;
  unapprovedCourses: number;
  awaitingAssignmentCourses: number;
  statusCounts: Record<string, number>;
};

export type DepartmentQualityReport = QualityReportCounts & { department: string };

export type AdminQualityReport = {
  generatedAt: string;
  institute: QualityReportCounts;
  departments: DepartmentQualityReport[];
  programCatalog: LeeProgram[];
  courses: QualityCourse[];
};

export const approvalRate = (counts: QualityReportCounts) =>
  counts.publicCourses ? Math.round(counts.approvedCourses / counts.publicCourses * 1000) / 10 : 0;

export const qualityReportStatuses = (report: AdminQualityReport) =>
  Object.keys(report.institute.statusCounts).sort((left, right) => left.localeCompare(right, "tr-TR"));

export const qualityReportHeaders = (statuses: string[]) => [
  "ABD / ASD", "Toplam ders", "Pasif ders", "Halka açık ders", "Onaylı / yayımlı",
  "Onaysız / süreçte", "Onay oranı (%)", "Hoca ataması bekleyen", ...statuses,
];

export const qualityReportRow = (department: string, counts: QualityReportCounts, statuses: string[]) => [
  department, counts.totalCourses, counts.inactiveCourses, counts.publicCourses,
  counts.approvedCourses, counts.unapprovedCourses, approvalRate(counts),
  counts.awaitingAssignmentCourses, ...statuses.map((status) => counts.statusCounts[status] || 0),
];

export function qualityReportExportRows(report: AdminQualityReport) {
  const statuses = qualityReportStatuses(report);
  return [
    qualityReportHeaders(statuses),
    ...report.departments.map((department) => qualityReportRow(department.department, department, statuses)),
    qualityReportRow("Enstitü toplamı", report.institute, statuses),
    [],
    ["Veri tarihi (Türkiye)", new Date(report.generatedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })],
    ["Kapsam", "Onay ve atama sayıları halka açık dersler içindir. Atama bekleyenler onay durumu toplamına ayrıca eklenmez."],
  ];
}
