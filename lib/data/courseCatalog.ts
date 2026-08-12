import type { LeeProgram } from "./programs";
import {
  OFFICIAL_COURSES as OBS_OFFICIAL_COURSES,
  type OfficialCourse,
} from "./officialCourses";

const YBS_SPECIALIZATION_CODES = new Set([
  "YBS901",
  "YBS902",
  "YBS903",
  "YBS904",
  "YBS905",
  "YBS906",
  "YBS907",
  "YBS908",
]);

const YBS_THESIS_CODES = new Set([
  "YBS911",
  "YBS912",
  "YBS913",
  "YBS914",
  "YBS915",
  "YBS916",
]);

const withAdvisor = (course: OfficialCourse): OfficialCourse => ({
  ...course,
  instructor: "Öğrencinin Danışmanı",
});

const normalizeYbsDoctorateCourse = (course: OfficialCourse): OfficialCourse | null => {
  if (course.code === "YBS925") return { ...course, instructor: "Doç. Dr. Emre YAKUT", status: "İncelemede" };
  if (YBS_SPECIALIZATION_CODES.has(course.code)) {
    if (course.code !== "YBS901") return null;
    return withAdvisor({
      ...course,
      code: "YBS9XX",
      name: "UZMANLIK ALAN DERSİ",
      ects: 5,
    });
  }

  if (YBS_THESIS_CODES.has(course.code)) {
    if (course.code !== "YBS911") return null;
    return withAdvisor({
      ...course,
      code: "YBS91X",
      name: "DOKTORA TEZİ",
      ects: 24,
    });
  }

  if (course.code === "DAN902") return withAdvisor({ ...course, ects: 1 });
  if (course.code === "YBS909") return null;
  if (course.code === "YBS910") return withAdvisor({ ...course, ects: 6 });
  if (course.code === "YBS917") return withAdvisor({ ...course, ects: 6 });
  if (course.code === "YBS918") return null;
  return course;
};

export const OFFICIAL_COURSES: OfficialCourse[] = OBS_OFFICIAL_COURSES.flatMap((course) => {
  const isYbsDoctorate =
    course.level === "Doktora" &&
    (course.code.startsWith("YBS") ||
      (course.code === "DAN902" &&
        (course.programName.includes("Yönetim Bilişim") ||
          course.programName.includes("YÃ¶netim BiliÅŸim"))));
  if (!isYbsDoctorate) return [course];
  const normalized = normalizeYbsDoctorateCourse(course);
  return normalized ? [normalized] : [];
});

const same = (left: string, right: string) =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

export const officialCoursesForProgram = (program: LeeProgram) =>
  OFFICIAL_COURSES.filter(
    (course) =>
      same(course.department, program.department) &&
      same(course.programName, program.programName),
  );

const normalizeCourseName = (name: string) =>
  name
    .toLocaleUpperCase("tr-TR")
    .replaceAll("Ã‡", "Ç")
    .replaceAll("Ä°", "İ")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Åž", "Ş");

export const isDepartmentPoolCourse = (course: Pick<OfficialCourse, "name">) => {
  const name = normalizeCourseName(course.name);
  if (name.includes("BİLİMSEL ARAŞTIRMA")) return false;
  return [
    "DANIŞMANLIK",
    "UZMANLIK ALAN DERSİ",
    "SEMİNER",
    "DOKTORA YETERLİK",
    "DOKTORA TEZİ",
    "TEZ ÇALIŞMASI",
  ].some((label) => name.includes(label));
};
