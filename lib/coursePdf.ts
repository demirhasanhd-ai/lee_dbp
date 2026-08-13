import { dbpPath } from "./dbpPath";

const TR_MAP = new Map<string, string>([
  ["ç", "c"],
  ["Ç", "C"],
  ["ğ", "g"],
  ["Ğ", "G"],
  ["ı", "i"],
  ["İ", "I"],
  ["ö", "o"],
  ["Ö", "O"],
  ["ş", "s"],
  ["Ş", "S"],
  ["ü", "u"],
  ["Ü", "U"],
]);

export function coursePdfSlug(value: string) {
  const translated = Array.from(value)
    .map((char) => TR_MAP.get(char) ?? char)
    .join("");

  return (
    translated
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "ders"
  );
}

function coursePdfApiHref(code: string, name: string, program?: string, department?: string, level?: string) {
  const params = new URLSearchParams({
    code,
    name,
  });
  if (program?.trim()) {
    params.set("program", program);
  }
  if (department?.trim()) {
    params.set("department", department);
  }
  if (level?.trim()) {
    params.set("level", level);
  }
  return dbpPath(`/api/dbp/course-pdf?${params.toString()}`);
}

export function coursePdfHref({
  code,
  name,
  program,
  department,
  level,
  explicitHref,
}: {
  code: string;
  name: string;
  program?: string;
  department?: string;
  level?: string;
  explicitHref?: string;
}) {
  if (explicitHref?.trim()) {
    return explicitHref;
  }

  return coursePdfApiHref(code, name, program, department, level);
}
