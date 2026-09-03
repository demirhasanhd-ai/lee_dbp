import { createHash } from "node:crypto";
import * as cheerio from "cheerio";

export const THESIS_SNAPSHOT_KEY = "thesis_sdg_snapshot_v1";
export const THESIS_OAI_ENDPOINT = "https://openaccess.osmaniye.edu.tr/server/oai/request";
export const THESIS_OAI_SET = "col_20.500.12502_62";
export const THESIS_SYNC_SCHEDULE = ["Şubat ortasındaki Pazartesi 01:00", "Eylül ayının son Pazartesi günü 01:00"];

export const thesisSdgGoals = [
  ["1", "Yoksulluğa Son", ["yoksulluk", "poverty", "sosyal yardım", "gelir dağılımı", "income inequality"]],
  ["2", "Açlığa Son", ["açlık", "hunger", "gıda güvenliği", "food security", "beslenme", "nutrition", "tarımsal üretim", "agricultural production"]],
  ["3", "Sağlık ve Kaliteli Yaşam", ["sağlık", "health", "hastalık", "disease", "hemşirelik", "nursing", "ebelik", "midwifery", "hasta", "patient", "tedavi", "treatment"]],
  ["4", "Nitelikli Eğitim", ["eğitim", "education", "öğretim", "teaching", "öğrenme", "learning", "öğrenci", "student", "okul", "school"]],
  ["5", "Toplumsal Cinsiyet Eşitliği", ["toplumsal cinsiyet", "gender", "kadın", "women", "female", "cinsiyet eşitliği"]],
  ["6", "Temiz Su ve Sanitasyon", ["su kalitesi", "water quality", "atıksu", "wastewater", "içme suyu", "drinking water", "sanitasyon", "sanitation", "su arıtma", "water treatment"]],
  ["7", "Erişilebilir ve Temiz Enerji", ["yenilenebilir enerji", "renewable energy", "güneş enerj", "solar energy", "rüzgar enerj", "wind energy", "hidrojen", "hydrogen", "batarya", "battery", "enerji verimlili", "energy efficiency"]],
  ["8", "İnsana Yakışır İş ve Ekonomik Büyüme", ["istihdam", "employment", "işgücü", "labor force", "iş sağlığı", "occupational health", "ekonomik büyüme", "economic growth", "girişimcilik", "entrepreneurship"]],
  ["9", "Sanayi, Yenilikçilik ve Altyapı", ["inovasyon", "innovation", "sanayi 4", "industry 4", "üretim teknoloj", "manufacturing technolog", "altyapı", "infrastructure", "yapay zeka", "artificial intelligence", "dijital dönüşüm", "digital transformation"]],
  ["10", "Eşitsizliklerin Azaltılması", ["eşitsizlik", "inequality", "göçmen", "migrant", "mülteci", "refugee", "engelli", "disability", "dezavantajlı", "disadvantaged"]],
  ["11", "Sürdürülebilir Şehirler ve Topluluklar", ["sürdürülebilir şehir", "sustainable cit", "kentsel", "urban", "afet", "disaster", "deprem", "earthquake", "kültürel miras", "cultural heritage", "akıllı şehir", "smart cit"]],
  ["12", "Sorumlu Üretim ve Tüketim", ["atık yönetimi", "waste management", "geri dönüşüm", "recycling", "döngüsel ekonomi", "circular economy", "sürdürülebilir üretim", "sustainable production", "gıda atığı", "food waste"]],
  ["13", "İklim Eylemi", ["iklim değiş", "climate change", "küresel ısınma", "global warming", "karbon emisyon", "carbon emission", "sera gaz", "greenhouse gas"]],
  ["14", "Sudaki Yaşam", ["deniz ekosistem", "marine ecosystem", "su ürünleri", "fisheries", "deniz kirlili", "marine pollution", "akuatik", "aquatic"]],
  ["15", "Karasal Yaşam", ["biyoçeşitlilik", "biodiversity", "orman", "forest", "toprak kalitesi", "soil quality", "ekoloji", "ecology", "yaban hayat", "wildlife", "bitki tür", "plant species"]],
  ["16", "Barış, Adalet ve Güçlü Kurumlar", ["adalet", "justice", "hukuk", "law", "yönetişim", "governance", "şiddet", "violence", "barış", "peace", "kamu yönetimi", "public administration"]],
  ["17", "Amaçlar İçin Ortaklıklar", ["uluslararası işbirliği", "international cooperation", "kalkınma işbirliği", "development cooperation", "paydaş işbirliği", "stakeholder collaboration", "ortaklık", "partnership"]],
].map(([id, title, terms]) => ({ id, title, terms }));

function repairText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function searchable(value = "") {
  return repairText(value).toLocaleLowerCase("tr-TR");
}

export function displayDepartment(value = "") {
  return repairText(value)
    .replace(/^(?:Enstitüler,\s*)?(?:Lisansüstü Eğitim Enstitüsü|Sosyal Bilimler Enstitüsü),\s*/iu, "")
    .replace(/Ana Bilim Dalı/giu, "ABD")
    .replace(/Ana Sanat Dalı/giu, "ASD")
    .replace(/\s*,\s*/gu, ", ")
    .trim() || "Belirtilmemiş";
}

function hashRecord(record) {
  return createHash("sha256").update(JSON.stringify({
    title: record.title,
    alternativeTitle: record.alternativeTitle,
    abstracts: record.abstracts,
    keywords: record.keywords,
    authors: record.authors,
    advisors: record.advisors,
    department: record.department,
    degreeType: record.degreeType,
    publicationYear: record.publicationYear,
  })).digest("hex");
}

function analyzeSdg(record) {
  const title = searchable(`${record.title} ${record.alternativeTitle}`);
  const subjects = searchable(record.keywords.join(" "));
  const abstracts = searchable(record.abstracts.join(" "));
  const matches = thesisSdgGoals.map((goal) => {
    const terms = goal.terms.filter((term) => title.includes(term) || subjects.includes(term) || abstracts.includes(term));
    const score = goal.terms.reduce((sum, term) => sum + (title.includes(term) ? 3 : 0) + (subjects.includes(term) ? 2 : 0) + (abstracts.includes(term) ? 1 : 0), 0);
    return { id: goal.id, title: goal.title, score, matchedTerms: terms };
  }).filter((goal) => goal.score > 0).sort((a, b) => b.score - a.score || Number(a.id) - Number(b.id));
  return matches.map((goal, index) => ({ ...goal, primary: index === 0 }));
}

function xmlNodes($, localName) {
  return $("*").filter((_, element) => String(element.name || "").split(":").at(-1) === localName);
}

function fieldValues($, $record, element, qualifier = "") {
  return $record.find("*").filter((_, node) => {
    if (String(node.name || "").split(":").at(-1) !== "field") return false;
    return node.attribs?.element === element && (qualifier ? node.attribs?.qualifier === qualifier : true);
  }).map((_, node) => repairText($(node).text())).get().filter(Boolean);
}

function parseRecord($, node) {
  const $record = $(node);
  const header = $record.children().filter((_, child) => String(child.name || "").split(":").at(-1) === "header").first();
  const identifier = repairText(header.children().filter((_, child) => String(child.name || "").split(":").at(-1) === "identifier").first().text());
  const datestamp = repairText(header.children().filter((_, child) => String(child.name || "").split(":").at(-1) === "datestamp").first().text());
  const deleted = header.attr("status") === "deleted";
  if (!identifier) return null;
  if (deleted) return { identifier, datestamp, status: "deleted" };
  const titles = fieldValues($, $record, "title");
  const issued = fieldValues($, $record, "date", "issued")[0] || "";
  const handles = fieldValues($, $record, "identifier", "uri");
  const department = fieldValues($, $record, "department")[0] || fieldValues($, $record, "description")[0] || "Belirtilmemiş";
  const record = {
    identifier,
    datestamp,
    status: "active",
    title: titles[0] || "Başlıksız tez",
    alternativeTitle: fieldValues($, $record, "title", "alternative")[0] || titles[1] || "",
    abstracts: fieldValues($, $record, "description", "abstract"),
    keywords: fieldValues($, $record, "subject"),
    authors: fieldValues($, $record, "contributor", "author"),
    advisors: fieldValues($, $record, "contributor", "advisor"),
    department,
    degreeType: fieldValues($, $record, "type")[0] || "Belirtilmemiş",
    language: fieldValues($, $record, "language", "iso")[0] || "",
    publicationYear: Number(String(issued).match(/(?:19|20)\d{2}/u)?.[0] || 0),
    sourceUrl: handles.find((value) => value.includes("hdl.handle.net")) || handles[0] || "",
    yokThesisId: fieldValues($, $record, "identifier", "yoktezid")[0] || "",
  };
  record.metadataHash = hashRecord(record);
  record.sdg = analyzeSdg(record);
  return record;
}

function parseOaiPage(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const error = xmlNodes($, "error").first();
  if (error.length && error.attr("code") !== "noRecordsMatch") throw new Error(`DSpace OAI-PMH: ${error.attr("code") || "error"} ${repairText(error.text())}`);
  const records = xmlNodes($, "record").map((_, node) => parseRecord($, node)).get().filter(Boolean);
  const tokenNode = xmlNodes($, "resumptionToken").first();
  return {
    records,
    token: repairText(tokenNode.text()),
    completeListSize: Number(tokenNode.attr("completeListSize") || records.length),
  };
}

async function fetchXml(url) {
  const response = await fetch(url, { headers: { accept: "application/xml, text/xml" }, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`DSpace OAI-PMH HTTP ${response.status}`);
  return response.text();
}

export function readThesisSnapshot(db) {
  const row = db.prepare("SELECT value FROM metadata WHERE key = ?").get(THESIS_SNAPSHOT_KEY);
  if (!row?.value) return null;
  try { return JSON.parse(row.value); } catch { return null; }
}

export async function harvestTheses(db, { actor = "system", full = false } = {}) {
  const previous = readThesisSnapshot(db);
  const previousRecords = new Map((previous?.records || []).map((record) => [record.identifier, record]));
  const startedAt = new Date().toISOString();
  const effectiveFrom = !full && previous?.lastSuccessfulHarvestAt
    ? new Date(new Date(previous.lastSuccessfulHarvestAt).getTime() - 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "Z")
    : "";
  let url = new URL(THESIS_OAI_ENDPOINT);
  url.searchParams.set("verb", "ListRecords");
  url.searchParams.set("metadataPrefix", "dim");
  url.searchParams.set("set", THESIS_OAI_SET);
  if (effectiveFrom) url.searchParams.set("from", effectiveFrom);
  let token = "";
  let seen = 0;
  let completeListSize = 0;
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  let deleted = 0;
  do {
    const xml = await fetchXml(url);
    const page = parseOaiPage(xml);
    completeListSize = page.completeListSize || completeListSize;
    for (const record of page.records) {
      seen += 1;
      const old = previousRecords.get(record.identifier);
      if (record.status === "deleted") {
        if (old) previousRecords.set(record.identifier, { ...old, status: "deleted", datestamp: record.datestamp });
        deleted += 1;
      } else if (!old) {
        previousRecords.set(record.identifier, record);
        added += 1;
      } else if (old.metadataHash !== record.metadataHash || old.datestamp !== record.datestamp) {
        previousRecords.set(record.identifier, record);
        updated += 1;
      } else {
        unchanged += 1;
      }
    }
    token = page.token;
    if (token) {
      url = new URL(THESIS_OAI_ENDPOINT);
      url.searchParams.set("verb", "ListRecords");
      url.searchParams.set("resumptionToken", token);
    }
  } while (token);
  const finishedAt = new Date().toISOString();
  const snapshot = {
    version: 1,
    source: "dspace_oai_pmh_dim",
    endpoint: THESIS_OAI_ENDPOINT,
    set: THESIS_OAI_SET,
    generatedAt: finishedAt,
    lastSuccessfulHarvestAt: finishedAt,
    schedule: THESIS_SYNC_SCHEDULE,
    run: { actor, mode: full || !previous ? "INITIAL" : "INCREMENTAL", startedAt, finishedAt, effectiveFrom, seen, completeListSize, added, updated, unchanged, deleted },
    records: [...previousRecords.values()].sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0) || String(a.title).localeCompare(String(b.title), "tr")),
  };
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(THESIS_SNAPSHOT_KEY, JSON.stringify(snapshot));
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run("thesis.sdg.sync", actor, JSON.stringify(snapshot.run), finishedAt);
  return snapshot;
}

export function thesisRefreshDates(year) {
  const mondayOffset = (day) => (day + 6) % 7;
  const february15 = new Date(Date.UTC(year, 1, 15));
  const februaryMonday = 15 - mondayOffset(february15.getUTCDay());
  const september30 = new Date(Date.UTC(year, 8, 30));
  const septemberMonday = 30 - mondayOffset(september30.getUTCDay());
  return [new Date(Date.UTC(year, 1, februaryMonday - 1, 22)), new Date(Date.UTC(year, 8, septemberMonday - 1, 22))];
}

export function nextThesisRefreshDate(now = new Date()) {
  return [now.getUTCFullYear(), now.getUTCFullYear() + 1].flatMap(thesisRefreshDates).find((date) => date > now);
}

export function latestThesisRefreshDate(now = new Date()) {
  return [now.getUTCFullYear() - 1, now.getUTCFullYear()].flatMap(thesisRefreshDates)
    .filter((date) => date <= now).sort((a, b) => b - a)[0];
}

export function thesisDashboard(snapshot, filters = {}) {
  if (!snapshot) return null;
  const allActive = snapshot.records.filter((record) => record.status !== "deleted");
  const years = [...new Set(allActive.map((record) => record.publicationYear).filter(Boolean))].sort((a, b) => b - a);
  const departments = [...new Set(allActive.map((record) => displayDepartment(record.department)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  const filtered = allActive.filter((record) =>
    (!filters.year || record.publicationYear === Number(filters.year)) &&
    (!filters.degree || record.degreeType === filters.degree) &&
    (!filters.department || displayDepartment(record.department) === filters.department) &&
    (!filters.sdg || record.sdg.some((goal) => goal.id === filters.sdg))
  );
  const degreeCounts = {};
  const yearCounts = {};
  const departmentCounts = {};
  const sdgCounts = Object.fromEntries(thesisSdgGoals.map((goal) => [goal.id, 0]));
  for (const record of filtered) {
    degreeCounts[record.degreeType] = (degreeCounts[record.degreeType] || 0) + 1;
    const year = record.publicationYear || "Belirtilmemiş";
    yearCounts[year] = (yearCounts[year] || 0) + 1;
    const department = displayDepartment(record.department);
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    for (const goal of record.sdg) sdgCounts[goal.id] += 1;
  }
  return {
    generatedAt: snapshot.generatedAt,
    lastSuccessfulHarvestAt: snapshot.lastSuccessfulHarvestAt,
    nextRefreshAt: nextThesisRefreshDate()?.toISOString() || "",
    schedule: snapshot.schedule,
    source: snapshot.source,
    run: snapshot.run,
    filters: { years, departments, degrees: [...new Set(allActive.map((record) => record.degreeType))].sort() },
    summary: {
      total: filtered.length,
      masters: filtered.filter((record) => /master/i.test(record.degreeType)).length,
      doctorates: filtered.filter((record) => /doctoral|doctorate/i.test(record.degreeType)).length,
      sdgLinked: filtered.filter((record) => record.sdg.length > 0).length,
    },
    degreeCounts,
    yearCounts,
    sdgGoals: thesisSdgGoals.map((goal) => ({ id: goal.id, title: goal.title, count: sdgCounts[goal.id] || 0 })),
    departmentCounts: Object.entries(departmentCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, count]) => ({ name, count })),
    theses: filtered.slice(0, 100).map((record) => ({
      identifier: record.identifier, title: record.title, authors: record.authors, advisors: record.advisors,
      department: displayDepartment(record.department), degreeType: record.degreeType, publicationYear: record.publicationYear,
      sourceUrl: record.sourceUrl, sdg: record.sdg.map(({ id, title, primary }) => ({ id, title, primary })),
    })),
  };
}
