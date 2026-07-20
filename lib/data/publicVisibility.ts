import { programSlug, type LeeProgram, type ProgramLevel } from "./programs";

export const PUBLIC_VISIBILITY_STORAGE_KEY = "lee-dbp-public-program-visibility";

export type ProgramVisibilityMap = Record<string, boolean>;

export const programVisibilityKey = (program: Pick<LeeProgram, "department" | "programName">) =>
  programSlug(program);

export const programLevelVisibilityKey = (
  program: Pick<LeeProgram, "department" | "programName">,
  level: ProgramLevel | string,
) => `${programVisibilityKey(program)}__${String(level).toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`;

export function readProgramVisibility(): ProgramVisibilityMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PUBLIC_VISIBILITY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgramVisibilityMap) : {};
  } catch {
    return {};
  }
}

export function writeProgramVisibility(visibility: ProgramVisibilityMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PUBLIC_VISIBILITY_STORAGE_KEY, JSON.stringify(visibility));
  window.dispatchEvent(new Event("lee-dbp-public-visibility-change"));
}

export function isProgramPublic(
  program: Pick<LeeProgram, "department" | "programName">,
  visibility = readProgramVisibility(),
) {
  return visibility[programVisibilityKey(program)] !== false;
}

export function isProgramLevelPublic(
  program: Pick<LeeProgram, "department" | "programName">,
  level: ProgramLevel | string,
  visibility = readProgramVisibility(),
) {
  const levelKey = programLevelVisibilityKey(program, level);
  if (levelKey in visibility) return visibility[levelKey] !== false;
  return isProgramPublic(program, visibility);
}

export function publicLevelsForProgram(
  program: Pick<LeeProgram, "department" | "programName" | "levels">,
  visibility = readProgramVisibility(),
) {
  return program.levels.filter((level) => isProgramLevelPublic(program, level, visibility));
}
