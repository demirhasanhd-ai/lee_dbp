import { programSlug, type LeeProgram, type ProgramLevel } from "./programs";
import { dbpPath } from "../dbpPath";
import { dbpSessionHeader } from "../dbpSessionHeader";

export const PUBLIC_VISIBILITY_STORAGE_KEY = "lee-dbp-public-program-visibility";
export const DEFAULT_HIDDEN_PROGRAM_KEYS = new Set(["test-abd-test-programi"]);

export type ProgramVisibilityMap = Record<string, boolean>;

export const programVisibilityKey = (program: Pick<LeeProgram, "department" | "programName">) =>
  programSlug(program);

export const isProgramVisibilityKeyPublic = (
  key: string,
  visibility: ProgramVisibilityMap = readProgramVisibility(),
) => {
  if (key in visibility) return visibility[key] !== false;
  return !DEFAULT_HIDDEN_PROGRAM_KEYS.has(key);
};

export const programLevelVisibilityKeyFromKey = (programKey: string, level: ProgramLevel | string) =>
  `${programKey}__${String(level).toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`;

export const programLevelVisibilityKey = (
  program: Pick<LeeProgram, "department" | "programName">,
  level: ProgramLevel | string,
) => programLevelVisibilityKeyFromKey(programVisibilityKey(program), level);

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

export async function fetchProgramVisibility(): Promise<ProgramVisibilityMap> {
  if (typeof window === "undefined") return {};
  try {
    const response = await fetch(dbpPath("/api/dbp/public-visibility"), { cache: "no-store" });
    if (!response.ok) return {};
    const data = await response.json();
    return data.visibility ?? {};
  } catch {
    return {};
  }
}

export async function saveProgramVisibility(
  visibility: ProgramVisibilityMap,
  session: unknown,
) {
  const response = await fetch(dbpPath("/api/dbp/public-visibility"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-DBP-Session": dbpSessionHeader(session ?? {}),
    },
    body: JSON.stringify({ visibility }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Program görünürlüğü kaydedilemedi.");
  }
  return response.json();
}

export function isProgramPublic(
  program: Pick<LeeProgram, "department" | "programName">,
  visibility = readProgramVisibility(),
) {
  return isProgramVisibilityKeyPublic(programVisibilityKey(program), visibility);
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
