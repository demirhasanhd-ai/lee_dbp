import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function normalize(value = "") {
  return String(value)
    .toLocaleLowerCase("en-US")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/&/gu, " and ")
    .replace(/[^a-z0-9]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function splitCsvLine(line, delimiter) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      current += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else current += character;
  }
  cells.push(current.trim());
  return cells;
}

function rowsFromCsv(filePath) {
  const content = readFileSync(filePath, "utf8").replace(/^\uFEFF/u, "");
  const lines = content.split(/\r?\n/u).filter(Boolean);
  if (!lines.length) return [];
  const delimiter = (lines[0].match(/;/gu) || []).length >= (lines[0].match(/,/gu) || []).length ? ";" : ",";
  const headers = splitCsvLine(lines[0], delimiter).map(normalize);
  return lines.slice(1).map((line) => Object.fromEntries(splitCsvLine(line, delimiter).map((value, index) => [headers[index], value])));
}

function findDatasetFiles(dataDir) {
  const configured = String(process.env.SCIMAGO_CSV_PATH || "").trim();
  if (configured && existsSync(configured)) return [configured];
  const folders = [...new Set([path.join(dataDir, "scimago"), path.join(process.cwd(), "data", "scimago")])];
  return folders.flatMap((folder) => existsSync(folder) ? readdirSync(folder)
    .filter((name) => /\.csv$/iu.test(name))
    .map((name) => path.join(folder, name)) : []).sort();
}

export function readScimagoQuartiles(dataDir) {
  const files = findDatasetFiles(dataDir);
  const byJournal = new Map();
  const years = new Set();
  for (const filePath of files) {
    const fileYear = Number(path.basename(filePath).match(/(?:19|20)\d{2}/u)?.[0]) || 0;
    if (fileYear) years.add(fileYear);
    for (const row of rowsFromCsv(filePath)) {
      const title = row.title || row.journal || row.source || "";
      const quartile = String(row["sjr best quartile"] || row["best quartile"] || row.quartile || "").toUpperCase().match(/Q[1-4]/u)?.[0] || "";
      if (!title || !quartile) continue;
      const year = Number(row.year) || fileYear;
      const key = normalize(title);
      const values = byJournal.get(key) || [];
      values.push({ year, quartile });
      byJournal.set(key, values);
    }
  }
  for (const values of byJournal.values()) values.sort((left, right) => left.year - right.year);
  return {
    loaded: files.length > 0,
    files: files.map((filePath) => path.basename(filePath)),
    years: [...years].sort((left, right) => left - right),
    journalCount: byJournal.size,
    lookup(journal, publicationYear) {
      const values = byJournal.get(normalize(journal)) || [];
      if (!values.length) return "";
      return (values.find((item) => item.year === Number(publicationYear))
        || [...values].reverse().find((item) => !item.year || item.year <= Number(publicationYear))
        || values.at(-1))?.quartile || "";
    },
  };
}
