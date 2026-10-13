import { LEE_PROGRAMS, programSlug, type LeeProgram } from "./programs";
import { publicProgramHref } from "./publicRoutes";

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
  const programFromExplicitContext = LEE_PROGRAMS.find((candidate) =>
    (!context.department ||
      normalizeProgramContext(candidate.department) === normalizeProgramContext(context.department)) &&
    (!context.programName ||
      normalizeProgramContext(candidate.programName) === normalizeProgramContext(context.programName)) &&
    (!context.level || candidate.levels.some(
      (level) => normalizeProgramContext(level) === normalizeProgramContext(context.level),
    )),
  );
  const program = programFromExplicitContext;
  const resolvedLevel = context.level ?? program?.levels[0];

  return program && resolvedLevel
    ? { course: { code: context.code, level: resolvedLevel }, program }
    : null;
}

export function programViewHref(
  program: Pick<LeeProgram, "department" | "programName"> | string,
  level: string,
  tab: ProgramViewTab,
) {
  const resolvedProgram = typeof program === "string"
    ? LEE_PROGRAMS.find((candidate) => programSlug(candidate) === program)
    : program;
  if (resolvedProgram) {
    const canonical = publicProgramHref(resolvedProgram, level, tab);
    if (canonical) return canonical;
  }
  const key = typeof program === "string" ? program : programSlug(program);
  const query = new URLSearchParams({ programKey: key, duzey: level, sekme: tab });
  return `/programlar/${key}?${query.toString()}#program-dersleri`;
}
