import { readFileSync } from "node:fs";

const candidateSource = JSON.parse(readFileSync(new URL("./data/thesis-award-candidates-2023-2025.json", import.meta.url), "utf8"));

export const thesisAwardCandidateSource = candidateSource.source;
export const thesisAwardCandidateYears = Object.keys(candidateSource.years || {}).map(Number).filter(Number.isFinite).sort();
export const thesisAwardCandidateCounts = Object.fromEntries(thesisAwardCandidateYears.map((year) => [year, candidateSource.years[String(year)].length]));

export function thesisAwardCandidateIds(year) {
  return new Set((candidateSource.years?.[String(Number(year))] || []).map((value) => String(value).trim()).filter(Boolean));
}

export function isThesisAwardCandidate(record = {}) {
  return thesisAwardCandidateIds(record.publicationYear).has(String(record.yokThesisId || "").trim());
}
