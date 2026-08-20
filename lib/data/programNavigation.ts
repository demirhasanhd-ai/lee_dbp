import { OFFICIAL_COURSES } from "./courseCatalog";
import { LEE_PROGRAMS, programSlug, type LeeProgram } from "./programs";

export type ProgramViewTab = "profile" | "courses";

export type CourseProgramContext = {
  code: string;
  department?: string;
  programName?: string;
  level?: string;
};

export const normalizeProgramContext = (value?: string) =>
  value?.trim().toLocaleLowerCase("tr-TR") ?? "";

export function resolveCourseProgramContext(context: CourseProgramContext) {
  const normalizedCode = context.code.trim().toLocaleUpperCase("tr-TR");
  const matchingCourses = OFFICIAL_COURSES.filter(
    (course) => course.code.trim().toLocaleUpperCase("tr-TR") === normalizedCode,
  );
  const course = matchingCourses.find((candidate) =>
    (!context.department || normalizeProgramContext(candidate.department) === normalizeProgramContext(context.department)) &&
    (!context.programName || normalizeProgramContext(candidate.programName) === normalizeProgramContext(context.programName)) &&
    (!context.level || normalizeProgramContext(candidate.level) === normalizeProgramContext(context.level)),
  ) ?? (!context.department && !context.programName && !context.level && matchingCourses.length === 1
    ? matchingCourses[0]
    : undefined);

  const programFromCourse = course && LEE_PROGRAMS.find((candidate) =>
    normalizeProgramContext(candidate.department) === normalizeProgramContext(course.department) &&
    normalizeProgramContext(candidate.programName) === normalizeProgramContext(course.programName),
  );
  const programFromExplicitContext = LEE_PROGRAMS.find((candidate) =>
    (!context.department ||
      normalizeProgramContext(candidate.department) === normalizeProgramContext(context.department)) &&
    (!context.programName ||
      normalizeProgramContext(candidate.programName) === normalizeProgramContext(context.programName)) &&
    (!context.level || candidate.levels.some(
      (level) => normalizeProgramContext(level) === normalizeProgramContext(context.level),
    )),
  );
  const program = programFromCourse ?? programFromExplicitContext;
  const resolvedLevel = course?.level ?? context.level ?? program?.levels[0];

  return program && resolvedLevel
    ? { course: course ?? { code: context.code, level: resolvedLevel }, program }
    : null;
}

export function programViewHref(
  program: Pick<LeeProgram, "department" | "programName"> | string,
  level: string,
  tab: ProgramViewTab,
) {
  const key = typeof program === "string" ? program : programSlug(program);
  const query = new URLSearchParams({ programKey: key, duzey: level, sekme: tab });
  return `/programlar/${key}?${query.toString()}#program-dersleri`;
}
