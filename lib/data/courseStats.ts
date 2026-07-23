import { OFFICIAL_COURSES } from "./officialCourses";

const programKey = (department: string, programName: string, level: string) =>
  `${department.trim()}|${programName.trim()}|${level.trim()}`;

const percent = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

const uniqueValues = (values: Array<string | undefined>) =>
  new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]);

const programKeys = new Set(
  OFFICIAL_COURSES.map((course) =>
    programKey(course.department, course.programName, course.level),
  ),
);

const assignedCourses = OFFICIAL_COURSES.filter((course) => Boolean(course.instructor?.trim()));
const compulsoryCourses = OFFICIAL_COURSES.filter((course) => course.type === "Zorunlu");
const electiveCourses = OFFICIAL_COURSES.filter((course) => course.type === "Seçmeli");
const fallCourses = OFFICIAL_COURSES.filter((course) => course.term === "Güz");
const springCourses = OFFICIAL_COURSES.filter((course) => course.term === "Bahar");

export const COURSE_STATS = {
  academicYear: "2026–2027",
  totalCourses: OFFICIAL_COURSES.length,
  totalPrograms: programKeys.size,
  mainDepartments: uniqueValues(OFFICIAL_COURSES.map((course) => course.department)).size,
  instructors: uniqueValues(OFFICIAL_COURSES.map((course) => course.instructor)).size,
  assignedCourses: assignedCourses.length,
  unassignedCourses: OFFICIAL_COURSES.length - assignedCourses.length,
  assignmentRate: percent(assignedCourses.length, OFFICIAL_COURSES.length),
  compulsoryCourses: compulsoryCourses.length,
  electiveCourses: electiveCourses.length,
  fallCourses: fallCourses.length,
  springCourses: springCourses.length,
  totalEcts: OFFICIAL_COURSES.reduce((sum, course) => sum + course.ects, 0),
  levels: {
    tezsiz: [...programKeys].filter((key) => key.includes("Tezsiz")).length,
    tezli: [...programKeys].filter((key) => key.includes("Tezli")).length,
    doktora: [...programKeys].filter((key) => key.includes("Doktora")).length,
  },
};

