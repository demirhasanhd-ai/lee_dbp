import type { LeeProgram } from "../data/programs";
import type { OfficialCourse } from "../data/officialCourses";

export type QualitySeverity = "critical" | "warning" | "info";

export type QualityIssue = {
  severity: QualitySeverity;
  field: string;
  message: string;
};

export type ProgramQualitySummary = {
  key: string;
  mainDepartment: string;
  department: string;
  programName: string;
  level: string;
  courseCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  missingInstructorCount: number;
  score: number;
  sampleIssues: QualityIssue[];
};

export type InstructorQualitySummary = {
  instructor: string;
  courseCount: number;
  criticalCount: number;
  warningCount: number;
  missingInstructorCount: number;
};

export const COURSE_LEARNING_OUTCOME_COUNT = 5;
export const COURSE_WEEK_COUNT = 15;

export const vagueOutcomeVerbs = [
  "bilir",
  "anlar",
  "fark eder",
  "kavrar",
  "maruz kalır",
  "haberdar olur",
  "bilgi sahibi olur",
  "fikir sahibi olur",
  "aşina olur",
  "öğrenir",
];

export const measurableOutcomeVerbs = [
  "açıklar",
  "uygular",
  "tasarlar",
  "değerlendirir",
  "karşılaştırır",
  "analiz eder",
  "çözümler",
  "problem çözer",
  "ilişkilendirir",
  "kullanır",
  "sıralar",
  "listeler",
  "gösterir",
  "çizer",
  "eleştirir",
  "yorumlar",
  "raporlar",
  "geliştirir",
  "üretir",
  "seçer",
  "planlar",
  "yürütür",
  "sunar",
  "hesaplar",
  "modeller",
];

const generalCoursePattern =
  /SEMİNER|BİLİMSEL ARAŞTIRMA|TEZ ÇALIŞMASI|UZMANLIK ALAN|DANIŞMANLIK|BİTİRME PROJESİ|DOKTORA YETERLİK/u;

const normalize = (value: string) =>
  value.toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();

const includesAny = (text: string, items: string[]) =>
  items.some((item) => text.includes(item));

export const isGeneralAssignableCourse = (courseName: string) =>
  generalCoursePattern.test(courseName.toLocaleUpperCase("tr-TR"));

export function evaluateOutcomeText(rawText: string): QualityIssue[] {
  const text = normalize(rawText);
  if (!text) {
    return [
      {
        severity: "critical",
        field: "Çıktı",
        message: "Çıktı maddesi boş bırakılmamalı.",
      },
    ];
  }

  const issues: QualityIssue[] = [];
  if (includesAny(text, vagueOutcomeVerbs)) {
    issues.push({
      severity: "warning",
      field: "Çıktı fiili",
      message:
        "Belirsiz fiil var. Kılavuz doğrultusunda ölçülebilir aktif fiil kullanılmalı.",
    });
  }
  if (!includesAny(text, measurableOutcomeVerbs)) {
    issues.push({
      severity: "warning",
      field: "Çıktı fiili",
      message:
        "Ölçülebilir fiil algılanmadı. Örn. açıklar, analiz eder, değerlendirir, tasarlar.",
    });
  }
  if (text.split(" ").length < 4) {
    issues.push({
      severity: "warning",
      field: "Çıktı ifadesi",
      message: "İfade konu başlığı gibi duruyor; tam kazanım cümlesi yazılmalı.",
    });
  }
  if (rawText.length > 180) {
    issues.push({
      severity: "info",
      field: "Çıktı uzunluğu",
      message: "Cümle sadeleştirilebilir; tek yargı/yüklem tercih edilmeli.",
    });
  }
  return issues;
}

export function buildCourseQualityIssues(course: OfficialCourse): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const generalCourse = isGeneralAssignableCourse(course.name);

  if (!course.code.trim()) {
    issues.push({ severity: "critical", field: "Ders kodu", message: "Ders kodu eksik." });
  }
  if (!course.name.trim()) {
    issues.push({ severity: "critical", field: "Ders adı", message: "Ders adı eksik." });
  }
  if (!course.type) {
    issues.push({
      severity: "critical",
      field: "Zorunlu / Seçmeli",
      message: "Ders türü seçilmemiş.",
    });
  }
  if (!course.term) {
    issues.push({ severity: "critical", field: "Yarıyıl", message: "Güz/Bahar bilgisi eksik." });
  }
  if (course.ects < 0) {
    issues.push({ severity: "critical", field: "AKTS", message: "AKTS negatif olamaz." });
  }
  if (course.ects === 0 && !generalCourse) {
    issues.push({
      severity: "warning",
      field: "AKTS",
      message: "Genel/tez dersi olmayan derste AKTS 0 görünüyor.",
    });
  }
  if (course.theory + course.practice === 0 && !generalCourse) {
    issues.push({
      severity: "warning",
      field: "T/U",
      message: "Genel ders dışında teori ve uygulama saatlerinin ikisi de 0 olmamalı.",
    });
  }
  if (!course.instructor && !generalCourse) {
    issues.push({
      severity: "warning",
      field: "Öğretim elemanı",
      message: "Dersi veren öğretim elemanı ataması bekliyor.",
    });
  }
  if (course.status === "Atama Bekliyor") {
    issues.push({
      severity: "warning",
      field: "Atama",
      message: "Dersin öğretim elemanı ataması tamamlanmamış.",
    });
  }
  if (course.status !== "Onaylandı") {
    issues.push({
      severity: "info",
      field: "Bologna formu",
      message:
        `Yayın öncesi ${COURSE_LEARNING_OUTCOME_COUNT} ÖÇ, ${COURSE_WEEK_COUNT} haftalık plan, kaynaklar, değerlendirme yüzdeleri, AKTS iş yükü ve ÖÇ-PÇ matrisi kontrol edilmeli.`,
    });
  }

  return issues;
}

export function summarizeQualityByProgram(
  courses: OfficialCourse[],
  programs: LeeProgram[],
): ProgramQualitySummary[] {
  return programs.flatMap((program) =>
    program.levels.map((level) => {
      const programCourses = courses.filter(
        (course) =>
          course.department === program.department &&
          course.programName === program.programName &&
          course.level === level,
      );
      const issues = programCourses.flatMap(buildCourseQualityIssues);
      const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
      const warningCount = issues.filter((issue) => issue.severity === "warning").length;
      const infoCount = issues.filter((issue) => issue.severity === "info").length;
      const missingInstructorCount = programCourses.filter(
        (course) => !course.instructor && !isGeneralAssignableCourse(course.name),
      ).length;
      const penalty = criticalCount * 12 + warningCount * 4 + missingInstructorCount * 3;
      const score = Math.max(0, Math.min(100, 100 - penalty));

      return {
        key: `${program.department}__${program.programName}__${level}`,
        mainDepartment: program.mainDepartment,
        department: program.department,
        programName: program.programName,
        level,
        courseCount: programCourses.length,
        criticalCount,
        warningCount,
        infoCount,
        missingInstructorCount,
        score,
        sampleIssues: issues.slice(0, 4),
      };
    }),
  );
}

export function summarizeQualityByInstructor(
  courses: OfficialCourse[],
): InstructorQualitySummary[] {
  const map = new Map<string, InstructorQualitySummary>();

  courses.forEach((course) => {
    const instructor = course.instructor?.trim() || "Atama bekleyen dersler";
    const issues = buildCourseQualityIssues(course);
    const current =
      map.get(instructor) ??
      {
        instructor,
        courseCount: 0,
        criticalCount: 0,
        warningCount: 0,
        missingInstructorCount: 0,
      };

    current.courseCount += 1;
    current.criticalCount += issues.filter((issue) => issue.severity === "critical").length;
    current.warningCount += issues.filter((issue) => issue.severity === "warning").length;
    current.missingInstructorCount += course.instructor ? 0 : 1;
    map.set(instructor, current);
  });

  return [...map.values()].sort(
    (left, right) =>
      right.criticalCount - left.criticalCount ||
      right.warningCount - left.warningCount ||
      right.courseCount - left.courseCount,
  );
}
