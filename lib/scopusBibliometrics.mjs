const SCOPUS_ENDPOINT = "https://api.elsevier.com/content/search/scopus";
const SNAPSHOT_KEY = "scopus_bibliometrics_snapshot_v1";
const RECORDS_KEY = "scopus_bibliometrics_records_v1";
const AFFILIATION_ID = String(process.env.SCOPUS_AFFILIATION_ID || "60088374").trim();
const TARGET_COUNTRY = "Turkey";
const TARGET_MARKERS = ["osmaniye korkut ata", "korkut ata university", "osmaniye korkut ata üniversitesi"];

export const SCOPUS_SYNC_SCHEDULE = {
  timezone: "Europe/Istanbul",
  february: "15 Şubat'a denk gelen/önceki Pazartesi 01:00",
  september: "Eylül ayının son Pazartesi günü 01:00",
  citations: "Her Pazartesi 01:00",
};

const subjectNames = {
  AGRI: "Tarım ve Biyoloji Bilimleri", ARTS: "Sanat ve Beşeri Bilimler", BIOC: "Biyokimya, Genetik ve Moleküler Biyoloji",
  BUSI: "İşletme, Yönetim ve Muhasebe", CENG: "Kimya Mühendisliği", CHEM: "Kimya", COMP: "Bilgisayar Bilimleri",
  DECI: "Karar Bilimleri", DENT: "Diş Hekimliği", EART: "Yer ve Gezegen Bilimleri", ECON: "Ekonomi, Ekonometri ve Finans",
  ENER: "Enerji", ENGI: "Mühendislik", ENVI: "Çevre Bilimleri", HEAL: "Sağlık Meslekleri", IMMU: "İmmünoloji ve Mikrobiyoloji",
  MATE: "Malzeme Bilimi", MATH: "Matematik", MEDI: "Tıp", NEUR: "Sinir Bilimleri", NURS: "Hemşirelik",
  PHAR: "Farmakoloji, Toksikoloji ve Farmasötik Bilimler", PHYS: "Fizik ve Astronomi", PSYC: "Psikoloji",
  SOCI: "Sosyal Bilimler", VETE: "Veterinerlik", MULT: "Çok Disiplinli",
};

const sdgRules = [
  [1, "Yoksulluğa Son", ["poverty", "yoksulluk", "social assistance", "sosyal yardım"]],
  [2, "Açlığa Son", ["food security", "agriculture", "crop", "soil", "tarım", "gıda güvenliği", "bitki", "toprak"]],
  [3, "Sağlık ve Kaliteli Yaşam", ["health", "disease", "patient", "medicine", "nursing", "sağlık", "hastalık", "hasta", "hemşirelik"]],
  [4, "Nitelikli Eğitim", ["education", "learning", "teaching", "student", "eğitim", "öğrenme", "öğretim", "öğrenci"]],
  [5, "Toplumsal Cinsiyet Eşitliği", ["gender", "women", "female", "kadın", "toplumsal cinsiyet"]],
  [6, "Temiz Su ve Sanitasyon", ["water", "wastewater", "sanitation", "su", "atıksu"]],
  [7, "Erişilebilir ve Temiz Enerji", ["renewable energy", "solar", "hydrogen", "battery", "energy efficiency", "yenilenebilir enerji", "güneş", "hidrojen", "batarya"]],
  [8, "İnsana Yakışır İş ve Ekonomik Büyüme", ["employment", "economic growth", "labour", "tourism", "istihdam", "ekonomik büyüme", "turizm"]],
  [9, "Sanayi, Yenilikçilik ve Altyapı", ["innovation", "industry", "infrastructure", "engineering", "yenilik", "sanayi", "altyapı", "mühendislik"]],
  [10, "Eşitsizliklerin Azaltılması", ["inequality", "migration", "refugee", "disability", "eşitsizlik", "göç", "mülteci", "engelli"]],
  [11, "Sürdürülebilir Şehirler ve Topluluklar", ["urban", "city", "transport", "heritage", "şehir", "kent", "ulaşım", "miras"]],
  [12, "Sorumlu Üretim ve Tüketim", ["recycling", "waste", "circular economy", "life cycle", "geri dönüşüm", "atık", "döngüsel ekonomi"]],
  [13, "İklim Eylemi", ["climate", "carbon", "greenhouse gas", "iklim", "karbon", "sera gazı"]],
  [14, "Sudaki Yaşam", ["marine", "ocean", "aquatic", "fish", "deniz", "sucul", "balık"]],
  [15, "Karasal Yaşam", ["biodiversity", "forest", "ecosystem", "ecology", "biyoçeşitlilik", "orman", "ekosistem", "ekoloji"]],
  [16, "Barış, Adalet ve Güçlü Kurumlar", ["justice", "governance", "democracy", "law", "adalet", "yönetişim", "demokrasi", "hukuk"]],
  [17, "Amaçlar için Ortaklıklar", ["partnership", "collaboration", "international cooperation", "ortaklık", "iş birliği", "uluslararası işbirliği"]],
];

const strategyGoals = [
  { id: "A1", title: "Kurumsal kapasite", sdgs: [4, 9] },
  { id: "A2", title: "Eğitim-öğretim", sdgs: [3, 4, 5] },
  { id: "A3", title: "Araştırma ve bilim", sdgs: [2, 6, 9, 15] },
  { id: "A4", title: "Toplumsal hizmet", sdgs: [3, 5, 10, 11, 16] },
  { id: "A5", title: "Yenilenebilir enerji ve sürdürülebilirlik", sdgs: [6, 7, 9, 12, 13] },
];

const asArray = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const normalize = (value) => text(value).toLocaleLowerCase("tr-TR");
const latin = (value) => normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const increment = (map, key, amount = 1) => { if (key) map[key] = (map[key] || 0) + amount; };
const sortedCounts = (map, limit = Infinity) => Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr")).slice(0, limit).map(([name, count]) => ({ name, count }));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function personSignature(value, scopusOrder = false) {
  const cleaned = latin(text(value).replace(/\b(prof|doc|doç|dr|ogr|öğr|gör|ars|arş)\.?\b/giu, " ").replace(/\([^)]*\)|\S+@\S+/g, " "));
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length < 2) return "";
  const firstLooksLikeSurname = scopusOrder || /^[a-zçğıöşü]+[, ]+[a-z](?:[. ]?[a-z])*\.?$/iu.test(text(value));
  const surname = firstLooksLikeSurname ? words[0] : words.at(-1);
  const given = firstLooksLikeSurname ? words.slice(1) : words.slice(0, -1);
  return `${surname}|${given.map((item) => item[0]).join("")}`;
}

const facultyRules = [
  [/makine|insaat|inşaat|elektrik|elektronik|enerji sistem|gida muh|gıda müh|harita|batarya|hidrojen/iu, "Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)"],
  [/isletme|işletme|iktisat|siyaset|kamu yonet|kamu yönet|yonetim bilisim|yönetim bilişim|muhasebe|finansman|yonetim ve organiz|yönetim ve organiz/iu, "İktisadi ve İdari Bilimler Fakültesi (İİBF)"],
  [/organik tarim|organik tarım|gastronomi|ekoturizm/iu, "Kadirli Uygulamalı Bilimler Fakültesi (KUBF)"],
  [/ebelik|hemsire|hemşire|ic hastalik|iç hastalık/iu, "Sağlık Bilimleri Fakültesi (SBF)"],
  [/felsefe|din bilim|temel islam|temel İslam|ilahiyat/iu, "İnsan ve Toplum Bilimleri Fakültesi (İTBF)"],
  [/biyoloji|kimya|fizik|matematik|arkeoloji|tarih|turk dili|türk dili|edebiyat/iu, "Fen-Edebiyat Fakültesi (FEF)"],
];

function facultyForUnit(value) {
  const normalized = latin(value);
  return facultyRules.find(([pattern]) => pattern.test(normalized))?.[1] || "Diğer";
}

const subjectFacultyMap = {
  "muhendislik": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", 1]],
  "enerji": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", 1]],
  "malzeme bilimi": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", 1]],
  "cevre bilimleri": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .75], ["Fen-Edebiyat Fakültesi (FEF)", .25]],
  "kimya muhendisligi": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", 1]],
  "bilgisayar bilimleri": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .75], ["İktisadi ve İdari Bilimler Fakültesi (İİBF)", .25]],
  "yer ve gezegen bilimleri": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .7], ["Fen-Edebiyat Fakültesi (FEF)", .3]],
  "fizik ve astronomi": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .95], ["Fen-Edebiyat Fakültesi (FEF)", .05]],
  "matematik": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .9], ["Fen-Edebiyat Fakültesi (FEF)", .1]],
  "tarim ve biyoloji bilimleri": [["Fen-Edebiyat Fakültesi (FEF)", .15], ["Kadirli Uygulamalı Bilimler Fakültesi (KUBF)", .7], ["Sağlık Bilimleri Fakültesi (SBF)", .15]],
  "biyokimya genetik ve molekuler biyoloji": [["Fen-Edebiyat Fakültesi (FEF)", .3], ["Sağlık Bilimleri Fakültesi (SBF)", .5], ["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .2]],
  "kimya": [["Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)", .8], ["Fen-Edebiyat Fakültesi (FEF)", .2]],
  "cok disiplinli": [["Diğer", 1]],
  "sanat ve beseri bilimler": [["İnsan ve Toplum Bilimleri Fakültesi (İTBF)", .8], ["Fen-Edebiyat Fakültesi (FEF)", .2]],
  "sosyal bilimler": [["İktisadi ve İdari Bilimler Fakültesi (İİBF)", .65], ["İnsan ve Toplum Bilimleri Fakültesi (İTBF)", .35]],
  "isletme yonetim ve muhasebe": [["İktisadi ve İdari Bilimler Fakültesi (İİBF)", 1]],
  "ekonomi ekonometri ve finans": [["İktisadi ve İdari Bilimler Fakültesi (İİBF)", 1]],
  "karar bilimleri": [["İktisadi ve İdari Bilimler Fakültesi (İİBF)", 1]],
  "tip": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "hemsirelik": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "saglik meslekleri": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "farmakoloji toksikoloji ve farmasotik bilimler": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "dis hekimligi": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "sinir bilimleri": [["Sağlık Bilimleri Fakültesi (SBF)", 1]],
  "psikoloji": [["Sağlık Bilimleri Fakültesi (SBF)", .5], ["İnsan ve Toplum Bilimleri Fakültesi (İTBF)", .5]],
  "veterinerlik": [["Kadirli Uygulamalı Bilimler Fakültesi (KUBF)", 1]],
};

function estimatedFacultyAllocation(subjects, total) {
  if (!total) return {};
  const weights = {};
  for (const subject of subjects || []) {
    const mappings = subjectFacultyMap[latin(subject.name)] || [["Diğer", 1]];
    for (const [faculty, share] of mappings) increment(weights, faculty, number(subject.count) * share);
  }
  const weightTotal = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
  const raw = Object.entries(weights).map(([faculty, weight]) => ({ faculty, exact: total * weight / weightTotal }));
  const result = Object.fromEntries(raw.map((item) => [item.faculty, Math.floor(item.exact)]));
  let remainder = total - Object.values(result).reduce((sum, value) => sum + value, 0);
  for (const item of raw.sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (remainder <= 0) break;
    result[item.faculty] += 1;
    remainder -= 1;
  }
  return result;
}

function unitDirectory(instructors = []) {
  const directory = new Map();
  for (const instructor of instructors) {
    const signature = personSignature(instructor.name || "");
    if (!signature) continue;
    const units = [...new Set(asArray(instructor.departmentNames).map(facultyForUnit).filter(Boolean))];
    if (!units.length) continue;
    const current = directory.get(signature) || new Set();
    for (const unit of units) current.add(unit);
    directory.set(signature, current);
  }
  return directory;
}

function inferredUnits(record, directory) {
  const found = new Set();
  for (const author of record.authors || []) {
    if (!author.affiliationIds?.includes(AFFILIATION_ID)) continue;
    const exact = directory.get(personSignature(author.name, true));
    for (const unit of exact || []) found.add(unit);
  }
  if (!found.size && record.unit && record.unit !== "Birim bilgisi belirtilmemiş") found.add(record.unit);
  return [...found];
}

function affiliationIdValues(author) {
  return asArray(author?.afid).flatMap((item) => typeof item === "object" ? [item?.$ || item?.["@id"] || item?.["@afid"]] : [item]).map(text);
}

function affiliationDetails(entry) {
  return asArray(entry.affiliation).map((item) => ({
    id: text(item?.["@id"] || item?.afid),
    name: text(item?.["affilname"] || item?.["affiliation-name"] || item?.name),
    country: text(item?.["affiliation-country"] || item?.country),
  })).filter((item) => item.name || item.country || item.id);
}

function isTargetAffiliation(item) {
  const value = normalize(`${item.id} ${item.name}`);
  return item.id === AFFILIATION_ID || TARGET_MARKERS.some((marker) => value.includes(marker));
}

function internalUnit(affiliations) {
  const candidates = affiliations.filter(isTargetAffiliation).map((item) => item.name).filter(Boolean);
  for (const name of candidates) {
    const parts = name.split(/[,;|]/).map(text).filter(Boolean);
    const unit = parts.find((part) => /(faculty|school|institute|department|fakülte|yüksekokul|enstitü|bölüm|anabilim)/iu.test(part) && !TARGET_MARKERS.some((marker) => normalize(part).includes(marker)));
    if (unit) return unit;
  }
  return "Birim bilgisi belirtilmemiş";
}

function documentAuthors(entry) {
  return asArray(entry.author).map((author) => ({
    id: text(author?.["@auid"] || author?.authid),
    name: text(author?.authname || author?.["ce:indexed-name"] || [author?.surname, author?.initials].filter(Boolean).join(" ")),
    affiliationIds: affiliationIdValues(author),
  })).filter((author) => author.name);
}

function subjectAreas(entry) {
  return asArray(entry["subject-area"]).map((item) => ({
    code: text(item?.["@abbrev"] || item?.["@code"] || item?.code).toUpperCase(),
    name: text(item?.$ || item?.name),
  })).map((item) => ({ ...item, name: subjectNames[item.code] || item.name || item.code })).filter((item) => item.name);
}

function keywords(entry) {
  return [entry.authkeywords, entry["authkeywords"], entry["dc:description"]].flatMap(asArray).map((item) => text(item?.$ || item)).filter(Boolean);
}

function matchesTerm(haystack, term) {
  const normalizedTerm = normalize(term);
  if (normalizedTerm.includes(" ")) return haystack.includes(normalizedTerm);
  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "iu").test(haystack);
}

function classifySdgs(record) {
  const haystack = normalize([record.title, record.source, ...record.subjects, ...record.keywords].join(" "));
  return sdgRules.filter(([, , words]) => words.some((word) => matchesTerm(haystack, word))).map(([id, title]) => ({ id, title }));
}

function parseEntry(entry) {
  const affiliations = affiliationDetails(entry);
  const authors = documentAuthors(entry);
  const subjects = subjectAreas(entry);
  const coverDate = text(entry["prism:coverDate"]);
  const year = number(coverDate.slice(0, 4) || entry["prism:coverDisplayDate"]?.match(/\d{4}/)?.[0]);
  const openAccess = entry.openaccess === "1" || entry.openaccess === 1 || normalize(entry.openaccessFlag) === "true";
  const record = {
    id: text(entry.eid || entry["dc:identifier"]),
    title: text(entry["dc:title"]),
    source: text(entry["prism:publicationName"]),
    year,
    citations: number(entry["citedby-count"]),
    type: text(entry.subtypeDescription || entry.subtype || "Belirtilmemiş"),
    sourceType: text(entry["prism:aggregationType"] || entry.aggregationType || "Belirtilmemiş"),
    openAccess,
    affiliations,
    authors,
    subjects: subjects.map((item) => item.name),
    subjectCodes: subjects.map((item) => item.code),
    keywords: keywords(entry),
    unit: internalUnit(affiliations),
  };
  return { ...record, sdgs: classifySdgs(record) };
}

async function fetchJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(45_000) });
  if (!response.ok) {
    const detail = text(await response.text()).slice(0, 240);
    throw new Error(`Scopus API HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  return response.json();
}

export function scopusConfigured() {
  return Boolean(text(process.env.SCOPUS_API_KEY));
}

export function readScopusSnapshot(db) {
  const row = db.prepare("SELECT value FROM metadata WHERE key = ?").get(SNAPSHOT_KEY);
  if (!row?.value) return null;
  try { return JSON.parse(row.value); } catch { return null; }
}

function readStoredRecords(db) {
  const row = db.prepare("SELECT value FROM metadata WHERE key = ?").get(RECORDS_KEY);
  if (!row?.value) return [];
  try { return JSON.parse(row.value); } catch { return []; }
}

export async function fetchScopusRecords() {
  const apiKey = text(process.env.SCOPUS_API_KEY);
  if (!apiKey) throw new Error("SCOPUS_API_KEY tanımlı değil.");
  const headers = { Accept: "application/json", "X-ELS-APIKey": apiKey };
  const instToken = text(process.env.SCOPUS_INSTTOKEN);
  if (instToken) headers["X-ELS-Insttoken"] = instToken;
  const records = [];
  let cursor = "*";
  let pages = 0;
  let totalResults = 0;
  do {
    const url = new URL(SCOPUS_ENDPOINT);
    url.searchParams.set("query", `AF-ID(${AFFILIATION_ID})`);
    url.searchParams.set("view", "COMPLETE");
    url.searchParams.set("count", "25");
    url.searchParams.set("cursor", cursor);
    url.searchParams.set("sort", "+coverDate");
    const payload = await fetchJson(url, headers);
    const result = payload?.["search-results"] || {};
    totalResults = number(result["opensearch:totalResults"] || totalResults);
    const entries = asArray(result.entry).filter((entry) => entry && !entry.error);
    records.push(...entries.map(parseEntry).filter((record) => record.id || record.title));
    pages += 1;
    const next = text(result.cursor?.["@next"]);
    if (!next || next === cursor || records.length >= totalResults) break;
    cursor = next;
    await sleep(140);
    if (pages > 2000) throw new Error("Scopus sayfalama güvenlik sınırı aşıldı.");
  } while (cursor);
  if (!records.length) throw new Error("Scopus sorgusu yayın kaydı döndürmedi.");
  const years = [...new Set(records.map((record) => record.year).filter((year) => Number.isInteger(year) && year > 1900))].sort();
  const facets = await fetchScopusFacets(headers, years);
  return { records, pages, totalResults, facets };
}

async function fetchScopusFacets(headers, years = []) {
  const fetchFacets = async (query, declaration) => {
    const url = new URL(SCOPUS_ENDPOINT);
    url.searchParams.set("query", query);
    url.searchParams.set("count", "1");
    url.searchParams.set("facets", declaration);
    const payload = await fetchJson(url, headers);
    return asArray(payload?.["search-results"]?.facet);
  };
  const facets = await fetchFacets(`AF-ID(${AFFILIATION_ID})`, "subjarea(count=40,sort=fd);srctype(count=10,sort=fd)");
  const categories = (name) => asArray(facets.find((facet) => facet.name === name)?.category).map((item) => ({
    name: name === "subjarea" ? (subjectNames[text(item.value || item.name).toUpperCase()] || text(item.label)) : text(item.label),
    count: number(item.hitCount),
  })).filter((item) => item.name && item.count > 0);
  const subjectYearly = [];
  for (const year of years.slice(-9)) {
    const yearFacets = await fetchFacets(`AF-ID(${AFFILIATION_ID}) AND PUBYEAR = ${year}`, "subjarea(count=40,sort=fd)");
    const category = asArray(yearFacets.find((facet) => facet.name === "subjarea")?.category);
    subjectYearly.push({
      year: String(year),
      values: Object.fromEntries(category.map((item) => [
        subjectNames[text(item.value || item.name).toUpperCase()] || text(item.label),
        number(item.hitCount),
      ]).filter(([name, count]) => name && count > 0)),
    });
    await sleep(140);
  }
  return { subjects: categories("subjarea"), sourceTypes: categories("srctype"), subjectYearly };
}

async function fetchCitationRecords() {
  const apiKey = text(process.env.SCOPUS_API_KEY);
  if (!apiKey) throw new Error("SCOPUS_API_KEY tanımlı değil.");
  const headers = { Accept: "application/json", "X-ELS-APIKey": apiKey };
  const instToken = text(process.env.SCOPUS_INSTTOKEN);
  if (instToken) headers["X-ELS-Insttoken"] = instToken;
  const records = [];
  let cursor = "*", pages = 0, totalResults = 0;
  do {
    const url = new URL(SCOPUS_ENDPOINT);
    url.searchParams.set("query", `AF-ID(${AFFILIATION_ID})`);
    url.searchParams.set("field", "eid,dc:identifier,prism:coverDate,citedby-count");
    url.searchParams.set("count", "200");
    url.searchParams.set("cursor", cursor);
    url.searchParams.set("sort", "+coverDate");
    const payload = await fetchJson(url, headers);
    const result = payload?.["search-results"] || {};
    totalResults = number(result["opensearch:totalResults"] || totalResults);
    for (const entry of asArray(result.entry).filter((item) => item && !item.error)) {
      records.push({ id: text(entry.eid || entry["dc:identifier"]), citations: number(entry["citedby-count"]) });
    }
    pages += 1;
    const next = text(result.cursor?.["@next"]);
    if (!next || next === cursor || records.length >= totalResults) break;
    cursor = next;
    await sleep(140);
    if (pages > 500) throw new Error("Scopus atıf sayfalama güvenlik sınırı aşıldı.");
  } while (cursor);
  if (!records.length) throw new Error("Scopus atıf sorgusu kayıt döndürmedi.");
  return { records, pages, totalResults };
}

function buildSnapshot(records, run, facets = {}, instructors = []) {
  const yearPublications = {}, yearCitations = {}, types = {}, oa = {}, sourceTypes = {}, units = {}, unitYears = {}, authors = {}, subjects = {}, countries = {}, nationalInstitutions = {}, sdgs = {};
  const sources = new Set(), authorIds = new Set();
  const directory = unitDirectory(instructors);
  let totalCitations = 0, maxCitations = 0, articleCount = 0, unitMatchedRecords = 0;
  for (const record of records) {
    increment(yearPublications, record.year || "Belirtilmemiş");
    increment(yearCitations, record.year || "Belirtilmemiş", record.citations);
    totalCitations += record.citations;
    maxCitations = Math.max(maxCitations, record.citations);
    increment(types, record.type);
    increment(oa, record.openAccess ? "Açık erişim" : "Açık erişim değil/belirtilmemiş");
    increment(sourceTypes, record.sourceType);
    if (record.source) sources.add(record.source);
    if (/article|makale/iu.test(record.type)) articleCount += 1;
    const recordUnits = inferredUnits(record, directory);
    if (recordUnits.length) unitMatchedRecords += 1;
    const unit = recordUnits[0] || "Birim bilgisi belirtilmemiş";
    increment(units, unit);
    unitYears[unit] ||= {};
    increment(unitYears[unit], record.year || "Belirtilmemiş");
    for (const author of record.authors) {
      const target = author.affiliationIds.includes(AFFILIATION_ID);
      if (!target) continue;
      const key = author.id || author.name;
      authorIds.add(key);
      authors[key] ||= { name: author.name, count: 0 };
      authors[key].count += 1;
    }
    for (const subject of record.subjects) increment(subjects, subject);
    for (const affiliation of record.affiliations) {
      if (isTargetAffiliation(affiliation)) continue;
      if (normalize(affiliation.country) === normalize(TARGET_COUNTRY) || normalize(affiliation.country) === "türkiye") increment(nationalInstitutions, affiliation.name);
      else if (affiliation.country) increment(countries, affiliation.country);
    }
    for (const sdg of record.sdgs) increment(sdgs, `${sdg.id}|${sdg.title}`);
  }
  const citationsDescending = records.map((record) => record.citations).sort((a, b) => b - a);
  let hIndex = 0;
  for (let index = 0; index < citationsDescending.length; index += 1) if (citationsDescending[index] >= index + 1) hIndex = index + 1;
  const total = records.length;
  const openAccessCount = oa["Açık erişim"] || 0;
  const estimatedUnitCount = units["Birim bilgisi belirtilmemiş"] || 0;
  delete units["Birim bilgisi belirtilmemiş"];
  const estimatedUnits = estimatedFacultyAllocation(facets.subjects || sortedCounts(subjects), estimatedUnitCount);
  for (const [faculty, count] of Object.entries(estimatedUnits)) increment(units, faculty, count);
  const unitList = sortedCounts(units);
  const selectedUnits = unitList.filter((item) => item.name !== "Birim bilgisi belirtilmemiş").slice(0, 8).map((item) => item.name);
  const years = Object.keys(yearPublications).filter((year) => /^\d{4}$/.test(year)).sort();
  const generatedAt = new Date().toISOString();
  const sdgList = sortedCounts(sdgs).map((item) => { const [id, title] = item.name.split("|"); return { id: number(id), title, count: item.count, share: total ? Math.round(item.count / total * 1000) / 10 : 0 }; });
  return {
    version: 1, source: "scopus_api_snapshot", affiliationId: AFFILIATION_ID, generatedAt, lastSuccessfulHarvestAt: generatedAt,
    schedule: SCOPUS_SYNC_SCHEDULE, run,
    summary: { totalPublications: total, hIndex, totalCitations, citationsPerPublication: total ? Math.round(totalCitations / total * 100) / 100 : 0, maxCitations, openAccessRate: total ? Math.round(openAccessCount / total * 1000) / 10 : 0, authorCount: authorIds.size, sourceCount: sources.size, activeSdgCount: sdgList.length, researchArticleCount: articleCount },
    yearlyPublications: years.map((year) => ({ year, count: yearPublications[year] || 0 })),
    yearlyCitations: years.map((year) => ({ year, count: yearCitations[year] || 0 })),
    publicationTypes: sortedCounts(types), openAccess: sortedCounts(oa), sourceTypes: facets.sourceTypes?.length ? facets.sourceTypes : sortedCounts(sourceTypes),
    units: unitList,
    unitYearly: years.map((year) => ({ year, values: Object.fromEntries(selectedUnits.map((unit) => [unit, unitYears[unit]?.[year] || 0])) })),
    authors: Object.values(authors).filter((author) => author.count >= 20).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "tr")),
    subjects: facets.subjects?.length ? facets.subjects : sortedCounts(subjects),
    subjectYearly: facets.subjectYearly || [],
    countries: sortedCounts(countries), nationalInstitutions: sortedCounts(nationalInstitutions, 10), sdgs: sdgList,
    developingSdgs: sdgRules.map(([id, title]) => ({ id, title, count: sdgList.find((item) => item.id === id)?.count || 0 })).sort((a, b) => a.count - b.count).slice(0, 5),
    strategicGoals: strategyGoals.map((goal) => ({ ...goal, count: goal.sdgs.reduce((sum, id) => sum + (sdgList.find((item) => item.id === id)?.count || 0), 0) })),
    quality: {
      unitCoverage: total ? Math.round(unitMatchedRecords / total * 1000) / 10 : 0,
      unitEstimatedCount: estimatedUnitCount,
      unitMethod: directory.size ? "Doğrudan eşleşen yayınlarda kurumsal akademisyen–ABD/ASD dizini; kalan kayıtlarda canlı Scopus alan kategorilerinin ağırlıklı fakülte eşlemesi kullanıldı" : "Canlı Scopus alan kategorilerinin ağırlıklı fakülte eşlemesi kullanıldı",
      authorCoverage: total ? Math.round(records.filter((record) => record.authors.some((author) => author.affiliationIds.includes(AFFILIATION_ID))).length / total * 1000) / 10 : 0,
      sdgMethod: "Başlık, yazar anahtar kelimeleri, kaynak adı ve Scopus alan kategorilerinde doğrulanabilir terim eşleşmesi",
    },
  };
}

export async function refreshScopusSnapshot(db, { actor = "system", instructors = [] } = {}) {
  const startedAt = new Date().toISOString();
  const { records, pages, totalResults, facets } = await fetchScopusRecords();
  const run = { actor, mode: "FULL", startedAt, finishedAt: new Date().toISOString(), pages, seen: records.length, totalResults };
  const snapshot = buildSnapshot(records, run, facets, instructors);
  snapshot.lastFullHarvestAt = snapshot.generatedAt;
  snapshot.lastCitationRefreshAt = snapshot.generatedAt;
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(RECORDS_KEY, JSON.stringify(records));
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(SNAPSHOT_KEY, JSON.stringify(snapshot));
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run("scopus.bibliometrics.sync", actor, JSON.stringify(run), snapshot.generatedAt);
  return snapshot;
}

export async function refreshScopusCitations(db, { actor = "system", instructors = [] } = {}) {
  const stored = readStoredRecords(db);
  if (!stored.length) return refreshScopusSnapshot(db, { actor: `${actor}:bootstrap`, instructors });
  const startedAt = new Date().toISOString();
  const result = await fetchCitationRecords();
  const citations = new Map(result.records.map((record) => [record.id, record.citations]));
  let updated = 0;
  const records = stored.map((record) => {
    if (!citations.has(record.id)) return record;
    const next = citations.get(record.id);
    if (next !== record.citations) updated += 1;
    return { ...record, citations: next };
  });
  const run = { actor, mode: "CITATIONS", startedAt, finishedAt: new Date().toISOString(), pages: result.pages, seen: result.records.length, matched: records.filter((record) => citations.has(record.id)).length, updated };
  const previous = readScopusSnapshot(db);
  const snapshot = buildSnapshot(records, run, { subjects: previous?.subjects || [], sourceTypes: previous?.sourceTypes || [], subjectYearly: previous?.subjectYearly || [] }, instructors);
  snapshot.lastFullHarvestAt = previous?.lastFullHarvestAt || previous?.generatedAt || snapshot.generatedAt;
  snapshot.lastCitationRefreshAt = snapshot.generatedAt;
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(RECORDS_KEY, JSON.stringify(records));
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(SNAPSHOT_KEY, JSON.stringify(snapshot));
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run("scopus.bibliometrics.citations.sync", actor, JSON.stringify(run), snapshot.generatedAt);
  return snapshot;
}

export function rebuildScopusUnitMappings(db, { instructors = [], actor = "system" } = {}) {
  const records = readStoredRecords(db);
  const previous = readScopusSnapshot(db);
  if (!records.length || !previous || !instructors.length) return previous;
  const run = { ...previous.run, actor, mode: "UNIT_MAPPING" };
  const snapshot = buildSnapshot(records, run, {
    subjects: previous.subjects || [],
    sourceTypes: previous.sourceTypes || [],
    subjectYearly: previous.subjectYearly || [],
  }, instructors);
  snapshot.generatedAt = previous.generatedAt;
  snapshot.lastSuccessfulHarvestAt = previous.lastSuccessfulHarvestAt;
  snapshot.lastFullHarvestAt = previous.lastFullHarvestAt;
  snapshot.lastCitationRefreshAt = previous.lastCitationRefreshAt;
  if ((snapshot.quality.unitCoverage || 0) < (previous.quality?.unitCoverage || 0)) return previous;
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(SNAPSHOT_KEY, JSON.stringify(snapshot));
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run("scopus.bibliometrics.units.rebuild", actor, JSON.stringify({ instructors: instructors.length, coverage: snapshot.quality.unitCoverage }), new Date().toISOString());
  return snapshot;
}

export function scopusRefreshDates(year) {
  const mondayOffset = (day) => (day + 6) % 7;
  const february15 = new Date(Date.UTC(year, 1, 15));
  const februaryMonday = 15 - mondayOffset(february15.getUTCDay());
  const september30 = new Date(Date.UTC(year, 8, 30));
  const septemberMonday = 30 - mondayOffset(september30.getUTCDay());
  return [new Date(Date.UTC(year, 1, februaryMonday - 1, 22)), new Date(Date.UTC(year, 8, septemberMonday - 1, 22))];
}

export function nextScopusRefreshDate(now = new Date()) {
  return [now.getUTCFullYear(), now.getUTCFullYear() + 1].flatMap(scopusRefreshDates).find((date) => date > now);
}

export function latestScopusRefreshDate(now = new Date()) {
  return [now.getUTCFullYear() - 1, now.getUTCFullYear()].flatMap(scopusRefreshDates).filter((date) => date <= now).sort((a, b) => b - a)[0];
}

export function nextScopusCitationRefreshDate(now = new Date()) {
  const next = new Date(now);
  const days = (8 - next.getDay()) % 7 || 7;
  next.setDate(next.getDate() + days);
  next.setHours(1, 0, 0, 0);
  return next;
}

export function latestScopusCitationRefreshDate(now = new Date()) {
  const latest = new Date(now);
  const days = (latest.getDay() + 6) % 7;
  latest.setDate(latest.getDate() - days);
  latest.setHours(1, 0, 0, 0);
  if (latest > now) latest.setDate(latest.getDate() - 7);
  return latest;
}
