const TR_DIZIN_ENDPOINT = "https://search.trdizin.gov.tr/api/defaultSearch/publication/";
const SNAPSHOT_KEY = "tr_dizin_bibliometrics_snapshot_v1";
const RECORDS_KEY = "tr_dizin_bibliometrics_records_v1";
const INSTITUTION_NAME = String(process.env.TR_DIZIN_INSTITUTION_NAME || "OSMANİYE KORKUT ATA ÜNİVERSİTESİ").trim();

export const TR_DIZIN_SYNC_SCHEDULE = {
  timezone: "Europe/Istanbul",
  february: "15 Şubat'a denk gelen/önceki Pazartesi 01:00",
  september: "Eylül ayının son Pazartesi günü 01:00",
  citations: "Her Pazartesi 01:00",
};

const publicationTypeLabels = {
  RESEARCH: "Araştırma Makalesi", COMPILATION: "Derleme", FACT_PRESENTATION: "Olgu Sunumu", OTHER: "Diğer",
  BOOK_PRESENTATION: "Kitap Tanıtımı", CORRECTION: "Düzeltme", EDITORIAL: "Editöryal", LETTER: "Mektup",
  LETTER_TO_EDITOR: "Editöre Mektup", MEETING_SUMMARY: "Toplantı Özeti", REPORT: "Rapor", SHORT_REPORT: "Kısa Rapor",
  TRANSLATION: "Çeviri", RETRACTED: "Geri Çekilmiş",
};
const languageLabels = { TUR: "Türkçe", ENG: "İngilizce", GER: "Almanca", FRE: "Fransızca", ARA: "Arapça", RUS: "Rusça", ITA: "İtalyanca", SPA: "İspanyolca", OTH: "Diğer" };
const databaseLabels = { SCIENCE: "Fen Bilimleri", SOCIAL: "Sosyal Bilimler" };
const accessLabels = { OPEN: "Açık erişim", CLOSED: "Kapalı erişim", CLOSE: "Kapalı erişim" };

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
const facultyRules = [
  [/makine|insaat|inşaat|elektrik|elektronik|enerji sistem|gida muh|gıda müh|harita|batarya|hidrojen/iu, "Mühendislik ve Doğa Bilimleri Fakültesi (MDBF)"],
  [/isletme|işletme|iktisat|siyaset|kamu yonet|kamu yönet|yonetim bilisim|yönetim bilişim|muhasebe|finansman|yonetim ve organiz|yönetim ve organiz/iu, "İktisadi ve İdari Bilimler Fakültesi (İİBF)"],
  [/organik tarim|organik tarım|gastronomi|ekoturizm/iu, "Kadirli Uygulamalı Bilimler Fakültesi (KUBF)"],
  [/ebelik|hemsire|hemşire|ic hastalik|iç hastalık/iu, "Sağlık Bilimleri Fakültesi (SBF)"],
  [/felsefe|din bilim|temel islam|temel İslam|ilahiyat/iu, "İnsan ve Toplum Bilimleri Fakültesi (İTBF)"],
  [/biyoloji|kimya|fizik|matematik|arkeoloji|tarih|turk dili|türk dili|edebiyat/iu, "Fen-Edebiyat Fakültesi (FEF)"],
];

const asArray = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const normalize = (value) => text(value).toLocaleLowerCase("tr-TR");
const latin = (value) => normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const increment = (map, key, amount = 1) => { if (key) map[key] = (map[key] || 0) + amount; };
const sortedCounts = (map, limit = Infinity) => Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr")).slice(0, limit).map(([name, count]) => ({ name, count }));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function personSignature(value) {
  const cleaned = latin(text(value).replace(/\b(prof|doc|doç|dr|ogr|öğr|gör|ars|arş)\.?\b/giu, " ").replace(/\([^)]*\)|\S+@\S+/g, " "));
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length < 2) return "";
  return `${words.at(-1)}|${words.slice(0, -1).map((item) => item[0]).join("")}`;
}

function facultyForUnit(value) {
  const normalized = latin(value);
  return facultyRules.find(([pattern]) => pattern.test(normalized))?.[1] || "Diğer";
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

function isTargetInstitution(value) {
  return normalize(value).includes(normalize(INSTITUTION_NAME));
}

function subjectName(item) {
  const fullName = text(item?.fullName || item?.name || item?.key || item);
  return fullName.split(/\s*>\s*/u).at(-1)?.trim() || fullName;
}

function compactSubjectCounts(items) {
  const counts = {};
  for (const item of items) increment(counts, subjectName(item.name), item.count);
  return sortedCounts(counts);
}

function recordTitle(source) {
  return text(asArray(source.abstracts).find((item) => text(item?.title))?.title || source.orderTitle || source.title);
}

function recordAbstract(source) {
  return text(asArray(source.abstracts).find((item) => text(item?.abstract))?.abstract);
}

function parseRecord(source) {
  const authors = asArray(source.authors).map((author) => ({
    id: text(author?.authorId || author?.id),
    name: text(author?.inPublicationName || author?.name),
    institutions: asArray(author?.institutionName).map(text).filter(Boolean),
  })).filter((author) => author.name);
  const institutions = asArray(source.facetAuthorInstitution).map(text).filter(Boolean);
  const countries = asArray(source.facetAuthorCountry).map(text).filter(Boolean);
  const subjects = asArray(source.subjects).map(subjectName).filter(Boolean);
  const keywords = asArray(source.abstracts).flatMap((item) => asArray(item?.keywords)).map((item) => text(item?.name || item)).filter(Boolean);
  const record = {
    id: text(source.id), title: recordTitle(source), abstract: recordAbstract(source), year: number(source.publicationYear || source.issue?.year),
    documentType: text(source.docType).toUpperCase(), publicationType: text(source.publicationType).toUpperCase(),
    publicationTypeLabel: publicationTypeLabels[text(source.publicationType).toUpperCase()] || text(source.publicationType) || "Belirtilmemiş",
    authors, institutions, countries, journalName: text(source.journal?.name), doi: text(source.doi), language: text(source.language).toUpperCase(),
    languageLabel: languageLabels[text(source.language).toUpperCase()] || text(source.language) || "Belirtilmemiş",
    databases: asArray(source.databases).map((item) => databaseLabels[text(item).toUpperCase()] || text(item)).filter(Boolean),
    accessType: text(source.accessType).toUpperCase(), accessLabel: accessLabels[text(source.accessType).toUpperCase()] || text(source.accessType) || "Belirtilmemiş",
    subjects, citations: number(source.orderCitationCount), projectGroup: text(source.projectGroup), projectNumber: text(source.projectnumber),
    detailUrl: source.id ? `https://search.trdizin.gov.tr/tr/yayin/detay/${source.id}` : "", keywords,
  };
  return { ...record, sdgs: classifySdgs(record) };
}

function matchesTerm(haystack, term) {
  const normalizedTerm = normalize(term);
  if (normalizedTerm.includes(" ")) return haystack.includes(normalizedTerm);
  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "iu").test(haystack);
}

function classifySdgs(record) {
  const haystack = normalize([record.title, record.abstract, record.journalName, ...record.subjects, ...record.keywords].join(" "));
  return sdgRules.filter(([, , words]) => words.some((word) => matchesTerm(haystack, word))).map(([id, title]) => ({ id, title }));
}

function buildQuery({ documentType, page = 1, limit = 100, order = "publicationYear-DESC", facets = {} }) {
  const url = new URL(TR_DIZIN_ENDPOINT);
  url.searchParams.set("q", "");
  url.searchParams.set("order", order);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(Math.min(100, Math.max(10, limit))));
  url.searchParams.append("facet-documentType", documentType);
  url.searchParams.append("facet-facetAuthorInstitution", INSTITUTION_NAME);
  for (const [key, values] of Object.entries(facets)) for (const value of asArray(values).filter(Boolean)) url.searchParams.append(`facet-${key}`, text(value));
  return url;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "OKU-LEE-DBP/1.3" }, signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`TR Dizin API HTTP ${response.status}: ${text(await response.text()).slice(0, 180)}`);
  return response.json();
}

function aggregationCounts(aggregations, key, labelMap = {}) {
  const node = aggregations?.[key];
  const buckets = asArray(node?.buckets?.length ? node.buckets : node?.values?.buckets);
  return buckets.map((item) => ({ name: labelMap[text(item.key).toUpperCase()] || text(item.key), count: number(item.doc_count) })).filter((item) => item.name && item.count > 0);
}

async function fetchDocumentType(documentType) {
  const firstPayload = await fetchJson(buildQuery({ documentType, page: 1, limit: 100 }));
  const total = number(firstPayload?.hits?.total?.value);
  const records = asArray(firstPayload?.hits?.hits).map((hit) => parseRecord(hit?._source || {})).filter((record) => record.id || record.title);
  const pages = Math.max(1, Math.ceil(total / 100));
  for (let page = 2; page <= pages; page += 1) {
    const payload = await fetchJson(buildQuery({ documentType, page, limit: 100 }));
    records.push(...asArray(payload?.hits?.hits).map((hit) => parseRecord(hit?._source || {})).filter((record) => record.id || record.title));
    await sleep(90);
  }
  return { records: [...new Map(records.map((record) => [record.id || `${record.title}|${record.year}`, record])).values()], total, pages, aggregations: firstPayload?.aggregations || {} };
}

export async function fetchTrDizinRecords() {
  const papers = await fetchDocumentType("PAPER");
  await sleep(120);
  const projects = await fetchDocumentType("PROJECT");
  if (!papers.records.length) throw new Error("TR Dizin OKÜ PAPER sorgusu kayıt döndürmedi.");
  return { papers, projects };
}

export function readTrDizinSnapshot(db) {
  const row = db.prepare("SELECT value FROM metadata WHERE key = ?").get(SNAPSHOT_KEY);
  if (!row?.value) return null;
  try {
    const snapshot = JSON.parse(row.value);
    return number(snapshot?.version) >= 2 ? snapshot : null;
  } catch { return null; }
}

function readStoredRecords(db) {
  const row = db.prepare("SELECT value FROM metadata WHERE key = ?").get(RECORDS_KEY);
  if (!row?.value) return { papers: [], projects: [] };
  try { return JSON.parse(row.value); } catch { return { papers: [], projects: [] }; }
}

function matchedUnit(record, directory) {
  for (const author of record.authors) {
    if (author.institutions.length && !author.institutions.some(isTargetInstitution)) continue;
    const units = directory.get(personSignature(author.name));
    if (units?.size) return [...units][0];
  }
  return "";
}

function buildSnapshot(papers, projects, paperAggregations, projectAggregations, run, instructors = []) {
  const years = {}, citationYears = {}, authors = {}, units = {}, countries = {}, institutions = {}, sdgs = {}, subjects = {}, subjectYears = {};
  const sourceNames = new Set(), authorIds = new Set(), directory = unitDirectory(instructors);
  let totalCitations = 0, maxCitations = 0, unitMatched = 0;
  for (const record of papers) {
    increment(years, String(record.year));
    increment(citationYears, String(record.year), record.citations);
    totalCitations += record.citations;
    maxCitations = Math.max(maxCitations, record.citations);
    if (record.journalName) sourceNames.add(record.journalName);
    const unit = matchedUnit(record, directory);
    if (unit) { increment(units, unit); unitMatched += 1; }
    for (const author of record.authors) {
      if (author.institutions.length && !author.institutions.some(isTargetInstitution)) continue;
      const signature = personSignature(author.name);
      if (!signature || !directory.has(signature)) continue;
      authorIds.add(author.id || signature);
      increment(authors, author.name);
    }
    for (const subject of record.subjects) {
      increment(subjects, subject);
      subjectYears[String(record.year)] ||= {};
      increment(subjectYears[String(record.year)], subject);
    }
    for (const country of record.countries) if (!/^(türkiye|turkey|diğer)$/iu.test(country)) increment(countries, country);
    for (const institution of record.institutions) if (!isTargetInstitution(institution) && !/yabancı kurum|tanımlanmamış kurum/iu.test(institution)) increment(institutions, institution);
    for (const sdg of record.sdgs) increment(sdgs, `${sdg.id}|${sdg.title}`);
  }
  const citations = papers.map((record) => record.citations).sort((a, b) => b - a);
  let hIndex = 0;
  for (let index = 0; index < citations.length; index += 1) if (citations[index] >= index + 1) hIndex = index + 1;
  const paperTotal = papers.length;
  const openAccess = aggregationCounts(paperAggregations, "facet-accessType", accessLabels);
  const publicationTypes = aggregationCounts(paperAggregations, "facet-publicationType", publicationTypeLabels);
  const databases = aggregationCounts(paperAggregations, "facet-database", databaseLabels);
  const subjectFacets = compactSubjectCounts(aggregationCounts(paperAggregations, "facet-subject"));
  const yearFacets = aggregationCounts(paperAggregations, "facet-publication_year").filter((item) => /^\d{4}$/.test(item.name)).sort((a, b) => Number(a.name) - Number(b.name));
  const sdgList = sortedCounts(sdgs).map((item) => { const [id, title] = item.name.split("|"); return { id: number(id), title, count: item.count, share: paperTotal ? Math.round(item.count / paperTotal * 1000) / 10 : 0 }; });
  const generatedAt = new Date().toISOString();
  return {
    version: 2, source: "tr_dizin_api_snapshot", institutionName: INSTITUTION_NAME, generatedAt, lastSuccessfulHarvestAt: generatedAt,
    schedule: TR_DIZIN_SYNC_SCHEDULE, run,
    summary: {
      totalPublications: paperTotal, currentYearPublications: years[String(new Date().getFullYear())] || 0, totalProjects: projects.length,
      hIndex, totalCitations, citationsPerPublication: paperTotal ? Math.round(totalCitations / paperTotal * 100) / 100 : 0, maxCitations,
      openAccessRate: paperTotal ? Math.round((openAccess.find((item) => item.name === "Açık erişim")?.count || 0) / paperTotal * 1000) / 10 : 0,
      authorCount: authorIds.size, sourceCount: sourceNames.size, activeSdgCount: sdgList.length,
      researchArticleCount: publicationTypes.find((item) => item.name === "Araştırma Makalesi")?.count || 0,
    },
    yearlyPublications: yearFacets.length ? yearFacets.map((item) => ({ year: item.name, count: item.count })) : sortedCounts(years).sort((a, b) => Number(a.name) - Number(b.name)).map((item) => ({ year: item.name, count: item.count })),
    yearlyCitations: Object.keys(citationYears).filter((year) => /^\d{4}$/.test(year)).sort().map((year) => ({ year, count: citationYears[year] || 0 })),
    publicationTypes, openAccess, sourceTypes: databases, units: sortedCounts(units), authors: sortedCounts(authors).filter((item) => item.count >= 20),
    subjects: subjectFacets.length ? subjectFacets : sortedCounts(subjects),
    subjectYearly: Object.keys(subjectYears).filter((year) => /^\d{4}$/.test(year)).sort().map((year) => ({ year, values: subjectYears[year] })),
    countries: sortedCounts(countries), nationalInstitutions: sortedCounts(institutions, 10), sdgs: sdgList,
    developingSdgs: sdgRules.map(([id, title]) => ({ id, title, count: sdgList.find((item) => item.id === id)?.count || 0 })).sort((a, b) => a.count - b.count).slice(0, 5),
    strategicGoals: strategyGoals.map((goal) => ({ ...goal, count: goal.sdgs.reduce((sum, id) => sum + (sdgList.find((item) => item.id === id)?.count || 0), 0) })),
    projectGroups: aggregationCounts(projectAggregations, "facet-projectGroup"), projectSubjects: compactSubjectCounts(aggregationCounts(projectAggregations, "facet-subject")),
    filterOptions: {
      years: yearFacets.map((item) => item.name).sort((a, b) => Number(b) - Number(a)),
      publicationTypes: aggregationCounts(paperAggregations, "facet-publicationType").map((item) => ({ value: item.name, label: publicationTypeLabels[item.name] || item.name })),
      journals: aggregationCounts(paperAggregations, "facet-journalName").map((item) => item.name),
      languages: aggregationCounts(paperAggregations, "facet-publicationLanguage").map((item) => ({ value: item.name, label: languageLabels[item.name] || item.name })),
      databases: aggregationCounts(paperAggregations, "facet-database").map((item) => ({ value: item.name, label: databaseLabels[item.name] || item.name })),
      accessTypes: aggregationCounts(paperAggregations, "facet-accessType").map((item) => ({ value: item.name, label: accessLabels[item.name] || item.name })),
      subjects: subjectFacets.map((item) => item.name), projectGroups: aggregationCounts(projectAggregations, "facet-projectGroup").map((item) => item.name),
      projectSubjects: compactSubjectCounts(aggregationCounts(projectAggregations, "facet-subject")).map((item) => item.name),
    },
    quality: {
      unitCoverage: paperTotal ? Math.round(unitMatched / paperTotal * 1000) / 10 : 0,
      unitMethod: "TR Dizin yazar kayıtları ile LEE_DBP akademisyen–ABD/ASD dizininin doğrudan eşlemesi",
      authorCoverage: paperTotal ? Math.round(papers.filter((record) => record.authors.some((author) => directory.has(personSignature(author.name)))).length / paperTotal * 1000) / 10 : 0,
      sdgMethod: "TR Dizin başlık, özet, anahtar kelime, dergi ve konu alanlarında doğrulanabilir terim eşleşmesi",
    },
  };
}

export async function refreshTrDizinSnapshot(db, { actor = "system", instructors = [], mode = "FULL" } = {}) {
  const startedAt = new Date().toISOString();
  const { papers, projects } = await fetchTrDizinRecords();
  const run = { actor, mode, startedAt, finishedAt: new Date().toISOString(), pages: papers.pages + projects.pages, seen: papers.records.length + projects.records.length, paperTotal: papers.total, projectTotal: projects.total };
  const snapshot = buildSnapshot(papers.records, projects.records, papers.aggregations, projects.aggregations, run, instructors);
  snapshot.lastFullHarvestAt = mode === "FULL" ? snapshot.generatedAt : readTrDizinSnapshot(db)?.lastFullHarvestAt || snapshot.generatedAt;
  snapshot.lastCitationRefreshAt = snapshot.generatedAt;
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(RECORDS_KEY, JSON.stringify({ papers: papers.records, projects: projects.records }));
  db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run(SNAPSHOT_KEY, JSON.stringify(snapshot));
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)").run("trdizin.bibliometrics.sync", actor, JSON.stringify(run), snapshot.generatedAt);
  return snapshot;
}

export function queryTrDizinRecords(db, params = {}) {
  const store = readStoredRecords(db);
  const documentType = text(params.documentType).toUpperCase() === "PROJECT" ? "PROJECT" : "PAPER";
  const source = documentType === "PROJECT" ? store.projects : store.papers;
  const search = normalize(params.search);
  const match = (record) => {
    if (search && !normalize([record.title, record.doi, record.journalName, record.projectNumber, ...record.authors.map((item) => item.name)].join(" ")).includes(search)) return false;
    if (params.year && String(record.year) !== String(params.year)) return false;
    if (params.publicationType && record.publicationType !== params.publicationType) return false;
    if (params.journal && record.journalName !== params.journal) return false;
    if (params.language && record.language !== params.language) return false;
    if (params.database && !record.databases.includes(databaseLabels[params.database] || params.database)) return false;
    if (params.accessType && record.accessType !== params.accessType) return false;
    if (params.subject && !record.subjects.includes(params.subject)) return false;
    if (params.projectGroup && record.projectGroup !== params.projectGroup) return false;
    return true;
  };
  const order = text(params.order) || "publicationYear-DESC";
  const filtered = source.filter(match).sort((a, b) => {
    if (order === "publicationYear-ASC") return a.year - b.year || a.title.localeCompare(b.title, "tr");
    if (order === "orderCitationCount-DESC") return b.citations - a.citations || b.year - a.year;
    if (order === "orderCitationCount-ASC") return a.citations - b.citations || b.year - a.year;
    if (order === "title-ASC") return a.title.localeCompare(b.title, "tr");
    if (order === "title-DESC") return b.title.localeCompare(a.title, "tr");
    return b.year - a.year || a.title.localeCompare(b.title, "tr");
  });
  const limit = [10, 20, 50, 100].includes(number(params.limit)) ? number(params.limit) : 20;
  const page = Math.max(1, number(params.page) || 1);
  const start = (page - 1) * limit;
  return { documentType, page, limit, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / limit)), items: filtered.slice(start, start + limit) };
}

export function trDizinRefreshDates(year) {
  const mondayOffset = (day) => (day + 6) % 7;
  const february15 = new Date(Date.UTC(year, 1, 15));
  const februaryMonday = 15 - mondayOffset(february15.getUTCDay());
  const september30 = new Date(Date.UTC(year, 8, 30));
  const septemberMonday = 30 - mondayOffset(september30.getUTCDay());
  return [new Date(Date.UTC(year, 1, februaryMonday - 1, 22)), new Date(Date.UTC(year, 8, septemberMonday - 1, 22))];
}

export function nextTrDizinRefreshDate(now = new Date()) {
  return [now.getUTCFullYear(), now.getUTCFullYear() + 1].flatMap(trDizinRefreshDates).find((date) => date > now);
}

export function latestTrDizinRefreshDate(now = new Date()) {
  return [now.getUTCFullYear() - 1, now.getUTCFullYear()].flatMap(trDizinRefreshDates).filter((date) => date <= now).sort((a, b) => b - a)[0];
}

export function nextTrDizinCitationRefreshDate(now = new Date()) {
  const next = new Date(now);
  const days = (8 - next.getDay()) % 7 || 7;
  next.setDate(next.getDate() + days);
  next.setHours(1, 0, 0, 0);
  return next;
}

export function latestTrDizinCitationRefreshDate(now = new Date()) {
  const latest = new Date(now);
  const days = (latest.getDay() + 6) % 7;
  latest.setDate(latest.getDate() - days);
  latest.setHours(1, 0, 0, 0);
  if (latest > now) latest.setDate(latest.getDate() - 7);
  return latest;
}
