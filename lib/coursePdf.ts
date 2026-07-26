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

function catalogPdfHref(code: string, name: string) {
  if (coursePdfSlug(code) !== "lee-501") {
    return undefined;
  }

  const codePart = code.trim().replace(/\s+/g, "-").toUpperCase();
  const namePart = name
    .trim()
    .split(/\s+/)
    .map((word) => {
      const slug = coursePdfSlug(word);
      return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";
    })
    .filter(Boolean)
    .join("-");

  return dbpPath(`/pdf/${codePart}-${namePart}.pdf`);
}

export function coursePdfHref({
  code,
  name,
  program,
  explicitHref,
}: {
  code: string;
  name: string;
  program?: string;
  explicitHref?: string;
}) {
  if (explicitHref?.trim()) {
    return explicitHref;
  }

  if (program?.trim()) {
    return dbpPath(`/pdf/dbp/${coursePdfSlug(code)}-${coursePdfSlug(program)}-${coursePdfSlug(name)}.pdf`);
  }

  return catalogPdfHref(code, name);
}
