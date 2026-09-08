import aliases from "./public-route-aliases.json";
import { LEE_PROGRAMS, type LeeProgram, type ProgramLevel } from "./programs";

export type PublicLevelCode = "tezsiz" | "tezli" | "dr";

type AliasEntry = {
  department: string;
  programs: Partial<Record<PublicLevelCode, string>>;
};

const routeAliases = aliases as Record<string, AliasEntry>;

export const PUBLIC_LEVELS: Record<PublicLevelCode, ProgramLevel> = {
  tezsiz: "Tezsiz Yüksek Lisans",
  tezli: "Tezli Yüksek Lisans",
  dr: "Doktora",
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("tr-TR");

export function normalizePublicSegment(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .toLowerCase();
}

export function isPublicLevelCode(value: string): value is PublicLevelCode {
  return Object.hasOwn(PUBLIC_LEVELS, value);
}

export function resolvePublicProgramRoute(alias: string, levelCode?: string) {
  const normalizedAlias = normalizePublicSegment(alias);
  const entry = routeAliases[normalizedAlias];
  if (!entry) return null;
  const selectedLevelCode = levelCode && isPublicLevelCode(levelCode)
    ? levelCode
    : (Object.keys(entry.programs)[0] as PublicLevelCode | undefined);
  if (!selectedLevelCode) return null;
  const programName = entry.programs[selectedLevelCode];
  if (!programName) return null;
  const level = PUBLIC_LEVELS[selectedLevelCode];
  const program = LEE_PROGRAMS.find((candidate) =>
    normalize(candidate.department) === normalize(entry.department) &&
    normalize(candidate.programName) === normalize(programName) &&
    candidate.levels.includes(level),
  );
  return program ? { alias: normalizedAlias, levelCode: selectedLevelCode, level, program } : null;
}

export function publicProgramRouteFor(
  program: Pick<LeeProgram, "department" | "programName">,
  level?: string,
) {
  for (const [alias, entry] of Object.entries(routeAliases)) {
    if (normalize(entry.department) !== normalize(program.department)) continue;
    for (const [levelCode, programName] of Object.entries(entry.programs)) {
      const typedLevelCode = levelCode as PublicLevelCode;
      if (normalize(programName ?? "") !== normalize(program.programName)) continue;
      if (level && normalize(PUBLIC_LEVELS[typedLevelCode]) !== normalize(level)) continue;
      return { alias, levelCode: typedLevelCode, level: PUBLIC_LEVELS[typedLevelCode] };
    }
  }
  return null;
}

export function publicProgramHref(
  program: Pick<LeeProgram, "department" | "programName">,
  level?: string,
  tab?: "profile" | "courses",
) {
  const route = publicProgramRouteFor(program, level);
  if (!route) return null;
  const path = level ? `/${route.alias}/${route.levelCode}` : `/${route.alias}`;
  return tab === "courses" ? `${path}?sekme=courses#program-dersleri` : path;
}

export function publicCourseHref(course: {
  department: string;
  programName: string;
  level: string;
  code: string;
}) {
  const route = publicProgramRouteFor(course, course.level);
  return route ? `/${route.alias}/${route.levelCode}/${normalizePublicSegment(course.code)}` : null;
}

export const PUBLIC_ROUTE_ALIASES = routeAliases;
