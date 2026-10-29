import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

const obsCourseHost = "obs.osmaniye.edu.tr";
const obsCoursePath = "/oibs/bologna/progCourseDetails.aspx";
const obsStructureLabels = [
  "Matematik ve Temel Bilimler",
  "Mühendislik Bilimleri",
  "Mühendislik Tasarımı",
  "Sosyal Bilimler",
  "Eğitim Bilimleri",
  "Fen Bilimleri",
  "Sağlık Bilimleri",
  "Alan Bilgisi",
];

function cleanObsText(value = "") {
  return String(value).replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeObsText(value = "") {
  return cleanObsText(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

function obsNumber(value) {
  const match = cleanObsText(value).replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function obsPercent(value) {
  return Math.max(0, Math.min(100, obsNumber(value)));
}

export function normalizeObsUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || "").trim());
  } catch {
    throw new Error("Geçerli bir OBS ders linki girin.");
  }
  if (url.hostname !== obsCourseHost || url.pathname !== obsCoursePath || !/^\d+$/.test(url.searchParams.get("curCourse") || "") || url.port || url.username || url.password || !["https:", "http:"].includes(url.protocol)) {
    throw new Error("Yalnızca OBS ders detay linki kullanılabilir.");
  }
  url.protocol = "https:";
  url.search = new URLSearchParams({ curCourse: url.searchParams.get("curCourse"), lang: "tr" }).toString();
  url.hash = "";
  return url;
}


function obsRowsFromTable($, table) {
  return $(table)
    .find("tr").filter((_, row) => $(row).closest("table")[0] === table)
    .get()
    .map((row) => $(row).children("th,td").get().map((cell) => cleanObsText($(cell).text())))
    .filter((row) => row.some(Boolean));
}

function obsTables(html) {
  const $ = cheerio.load(html);
  return $("table").get().map((table) => obsRowsFromTable($, table)).filter((rows) => rows.length);
}

function findObsTable(tables, predicate) {
  return tables.find((rows) => rows.some(predicate)) || [];
}

function findObsValue(tables, label) {
  const target = normalizeObsText(label);
  for (const rows of tables) {
    for (const row of rows) {
      if (normalizeObsText(row[0]) === target) return row[1] || "";
    }
  }
  return "";
}

function normalizeObsAssessmentName(value) {
  const normalized = normalizeObsText(value);
  if (normalized.includes("ara sinav")) return "Ara Sınav";
  if (normalized.includes("yariyil sonu") || normalized.includes("final")) return "Yarıyıl Sonu Sınavı";
  return cleanObsText(value);
}

function normalizeObsWorkloadName(value) {
  const normalized = normalizeObsText(value);
  if (normalized.includes("ders suresi")) return "Ders Süresi";
  if (normalized.includes("sinif disi")) return "Sınıf Dışı Çalışma";
  if (normalized.includes("ara sinav")) return "Ara Sınav";
  if (normalized.includes("yariyil sonu") || normalized.includes("final")) return "Yarıyıl Sonu Sınavı";
  return cleanObsText(value);
}

export function parseObsCourseDraft(html, sourceUrl) {
  const tables = obsTables(html);
  const detailTable = findObsTable(tables, (row) =>
    row.some((cell) => normalizeObsText(cell) === "kodu") &&
    row.some((cell) => normalizeObsText(cell).includes("akts")),
  );
  const detailHeader = detailTable[0] || [];
  const detailValues = detailTable.find((row, index) => index > 0 && row.some(Boolean)) || [];
  const detail = Object.fromEntries(detailHeader.map((key, index) => [cleanObsText(key), detailValues[index] || ""]));
  const [theory = 0, practice = 0, lab = 0] = cleanObsText(detail["T+U+L"]).split("+").map(obsNumber);
  const details = {
    language: findObsValue(tables, "Dersin Dili"),
    level: findObsValue(tables, "Dersin Düzeyi"),
    program: findObsValue(tables, "Bölümü / Programı"),
    type: findObsValue(tables, "Dersin Türü"),
    teachingMode: findObsValue(tables, "Dersin Öğretim Şekli"),
    purpose: findObsValue(tables, "Dersin Amacı"),
    content: findObsValue(tables, "Dersin İçeriği"),
    methods: findObsValue(tables, "Dersin Yöntem ve Teknikleri"),
    prerequisites: findObsValue(tables, "Ön Koşulları"),
    coordinator: findObsValue(tables, "Dersin Koordinatörü"),
    instructors: findObsValue(tables, "Dersi Verenler"),
    assistants: findObsValue(tables, "Dersin Yardımcıları"),
  };
  const resourceParts = [findObsValue(tables, "Kaynaklar"), findObsValue(tables, "Ders Notları")].filter(Boolean);
  const structures = {};
  for (const rows of tables) {
    for (const row of rows) {
      const label = obsStructureLabels.find((item) => normalizeObsText(item) === normalizeObsText(row[0]));
      if (label) structures[label] = obsPercent(row[1]);
    }
  }
  const assessmentTable = findObsTable(tables, (row) => normalizeObsText(row[0]).includes("yariyil calismalari"));
  const assessments = assessmentTable
    .slice(1)
    .filter((row) => row[0] && !normalizeObsText(row[0]).includes("toplam"))
    .map((row, index) => {
      const name = normalizeObsAssessmentName(row[0]);
      return { id: index + 1, name, count: obsNumber(row[1]), weight: obsPercent(row[2]), fixed: ["Ara Sınav", "Yarıyıl Sonu Sınavı"].includes(name) };
    });
  const workloadTable = findObsTable(tables, (row) => normalizeObsText(row[0]) === "is yuku");
  const workloads = {};
  for (const row of workloadTable.slice(1)) {
    if (!row[0] || normalizeObsText(row[0]).includes("toplam")) continue;
    workloads[normalizeObsWorkloadName(row[0])] = { count: obsNumber(row[1]), hours: obsNumber(row[2]) };
  }
  const outcomeTables = tables.filter((rows) => rows.some((row) =>
    normalizeObsText(row[0]).includes("sira no") && normalizeObsText(row[1]).includes("aciklama")));
  const outcomes = outcomeTables.flatMap((rows) => rows.filter((row) => /^\d+$/.test(row[0] || "") && row[1]).map((row) => row[1]));
  const weeklyTable = findObsTable(tables, (row) =>
    normalizeObsText(row[0]) === "hafta" && normalizeObsText(row[1]) === "konu",
  );
  const weeklyTopics = {};
  for (const row of weeklyTable.slice(1)) {
    const week = obsNumber(row[0]);
    if (!week) continue;
    const extra = [row[2] ? `Ön Hazırlık: ${row[2]}` : "", row[3] ? `Dokümanlar: ${row[3]}` : ""].filter(Boolean);
    weeklyTopics[week] = [row[1] || "", ...extra].filter(Boolean).join("\n");
  }
  const contributionTable = findObsTable(tables, (row) => row.some((cell) => /^P\d+$/i.test(cleanObsText(cell))));
  const contributionHeaders = contributionTable[0] || [];
  const contributionMatrix = contributionTable
    .slice(1)
    .filter((row) => /^Ö?\d+$/i.test(cleanObsText(row[0])) || /^O?\d+$/i.test(cleanObsText(row[0])))
    .map((row) => Object.fromEntries(contributionHeaders.slice(1).map((header, index) => [header, obsNumber(row[index + 1])])));
  const totalWorkload = Object.values(workloads).reduce((sum, row) => sum + row.count * row.hours, 0);
  const url = new URL(sourceUrl);
  return {
    sourceUrl,
    obsCourseId: url.searchParams.get("curCourse") || "",
    code: detail["Kodu"] || "",
    name: detail["Adı"] || "",
    semester: obsNumber(detail["Yarıyıl"]),
    theory,
    practice,
    lab,
    credit: obsNumber(detail["Kredi"]),
    ects: obsNumber(detail["AKTS"]),
    updatedAt: detail["Son Güncelleme Tarihi"] || "",
    details,
    resources: resourceParts.join("\n\n"),
    structures,
    assessments,
    workloads,
    outcomes,
    weeklyTopics,
    contributionMatrix,
    totalWorkload,
  };
}

const obsBase = `https://${obsCourseHost}/oibs/bologna/`;
const CACHE_MS = 30 * 60_000;
const MAX_CANDIDATES = 60;
const MAX_CURRICULA = 40;

export function obsEducationLevel(level = "") {
  const value = normalizeObsText(level);
  return value.includes("doktor") ? "dok" : value.includes("lisans") && !value.includes("yuksek") && !value.includes("tezli") && !value.includes("tezsiz") ? "lis" : "yls";
}

export function parseObsPrograms(html) {
  const $ = cheerio.load(html);
  const programs = new Map();
  $('a[href*="curSunit="]').each((_, node) => {
    const a = $(node);
    const url = new URL(a.attr("href"), obsBase);
    const id = url.searchParams.get("curSunit");
    const facultyId = url.searchParams.get("curUnit") || "";
    if (!/^\d+$/.test(id || "") || !cleanObsText(a.text())) return;
    const panel = a.closest('[id^="x"]');
    const faculty = panel.length ? cleanObsText($(`a[href="#${panel.attr("id")}"]`).first().text()) : "";
    programs.set(id, { id, name: cleanObsText(a.text()), facultyId, faculty });
  });
  return [...programs.values()];
}

const programCore = (value) => normalizeObsText(value)
  .replace(/\b(tezli|tezsiz|yuksek|lisans|doktora|abd|asd|anabilim|anasanat|dali|ogretim|ikinci|io|i o)\b/g, " ")
  .replace(/\s+/g, " ").trim();

export function suggestObsProgram(programs, target = {}) {
  const name = programCore(target.programName || target.department || "");
  if (!name) return "";
  const targetNonThesis = normalizeObsText(target.level).includes("tezsiz");
  const matches = programs.filter((program) => programCore(program.name) === name &&
    (obsEducationLevel(target.level) !== "yls" || normalizeObsText(program.name).includes("tezsiz") === targetNonThesis));
  return matches.length === 1 ? matches[0].id : "";
}

export function parseObsCurriculumPage(html) {
  const $ = cheerio.load(html);
  const select = $('select[name="cmbYillar"]').first().length ? $('select[name="cmbYillar"]').first() : $('select').filter((_, node) => $(node).find("option").length > 1).first();
  const curricula = select.find("option").map((_, node) => ({
    value: $(node).attr("value") || "",
    name: cleanObsText($(node).text()),
    year: Number(cleanObsText($(node).text()).match(/\b(?:19|20)\d{2}\b/)?.[0]) || 0,
    current: $(node).is(":selected"),
  })).get().filter((item) => item.value && item.value !== "0" && item.value !== "-1");
  const hidden = {};
  $('input[type="hidden"][name]').each((_, node) => { hidden[$(node).attr("name")] = $(node).attr("value") || ""; });
  const courses = [];
  $('#grdBolognaDersler tr').each((_, node) => {
    const row = $(node);
    const codeLink = row.find('a[id*="btnDersKod"]').first();
    if (!codeLink.length) return;
    const detailLink = row.find('a[id*="btnDersAyrinti"]').first();
    const cells = row.children("td").map((__, cell) => cleanObsText($(cell).text())).get();
    const click = detailLink.attr("onclick") || codeLink.attr("onclick") || "";
    const id = click.match(/prolizOpenCourseDetails\(\s*['"]?(\d+)/)?.[1];
    let sourceUrl = id ? `${obsBase}progCourseDetails.aspx?curCourse=${id}&lang=tr` : "";
    const href = detailLink.attr("href") || codeLink.attr("href") || "";
    if (!sourceUrl && href.includes("progCourseDetails.aspx")) {
      try { sourceUrl = normalizeObsUrl(new URL(href, obsBase).href).href; } catch { /* Invalid external links are ignored. */ }
    }
    courses.push({ code: cleanObsText(codeLink.text()), name: cleanObsText(row.find('[id*="lblDersAd"]').first().text()) || cells[2] || "", sourceUrl,
      eventTarget: href.match(/__doPostBack\('([^']+)'/)?.[1] || "" });
  });
  return { curricula, courses, hidden, selectName: select.attr("name") || "" };
}

export function obsCourseMatch(course, target) {
  const code = (value) => normalizeObsText(value).replace(/\s/g, "");
  if (target.code && code(course.code) === code(target.code)) return { score: 100, reason: "Ders kodu eşleşiyor" };
  const name = normalizeObsText(target.name);
  const other = normalizeObsText(course.name);
  if (name && name === other) return { score: 70, reason: "Ders adı eşleşiyor" };
  // Roman numerals and numbers distinguish Matematik I/II and similar course series.
  const series = (value) => value.split(" ").filter((part) => /^(?:\d+|i{1,3}|iv|v|vi{1,3}|ix|x)$/.test(part)).join(" ");
  if (name.length >= 10 && series(name) === series(other)) {
    const a = new Set(name.split(" ")); const b = new Set(other.split(" "));
    const common = [...a].filter((part) => b.has(part)).length;
    if (common / new Set([...a, ...b]).size >= 0.8) return { score: 40, reason: "Ders adı benzer; kontrol edin" };
  }
  return null;
}

export function obsInstructorMatches(instructors, name) {
  const strip = (value) => normalizeObsText(value).replace(/\b(prof|dr|doc|ogr|uyesi|ogretim|gorevlisi|ars|gor)\b/g, " ").replace(/\s+/g, " ").trim();
  const person = strip(name);
  return person.split(" ").length >= 2 && (` ${strip(instructors)} `).includes(` ${person} `);
}

function contentSummary(draft) {
  return { outcomes: draft.outcomes.length, weeks: Object.values(draft.weeklyTopics).filter(Boolean).length,
    matrix: draft.contributionMatrix.length > 0, assessments: draft.assessments.length, workloads: Object.keys(draft.workloads).length,
    purpose: Boolean(draft.details.purpose), content: Boolean(draft.details.content) };
}

export function compareObsCandidates(a, b) {
  const date = (value) => { const parts = (value || "").match(/(\d{2})\.(\d{2})\.(\d{4})/); return parts ? Number(parts[3] + parts[2] + parts[1]) : 0; };
  return b.matchScore - a.matchScore || Number(b.instructorMatch) - Number(a.instructorMatch) ||
    b.curriculum.year - a.curriculum.year || date(b.updatedAt) - date(a.updatedAt) || a.code.localeCompare(b.code, "tr");
}

class ObsHttpClient {
  constructor(fetcher, signal, requestDelayMs = 350) { this.fetcher = fetcher; this.signal = signal; this.cookies = new Map(); this.lastRequest = 0; this.requestDelayMs = requestDelayMs; }
  async request(rawUrl, init = {}, redirects = 0) {
    const url = new URL(rawUrl);
    if (url.origin !== new URL(obsBase).origin || !url.pathname.startsWith("/oibs/bologna/") || url.username || url.password) throw new Error("Geçersiz ÖBS adresi.");
    this.signal?.throwIfAborted();
    const remaining = this.requestDelayMs - (Date.now() - this.lastRequest);
    if (remaining > 0) await delay(remaining, undefined, { signal: this.signal });
    const response = await this.fetcher(url.href, { ...init, redirect: "manual", headers: {
      "User-Agent": "LEE-DBP/1.0 (public Bologna course discovery)", "Accept-Language": "tr-TR,tr;q=0.9",
      ...(this.cookies.size ? { Cookie: [...this.cookies].map(([key, value]) => `${key}=${value}`).join("; ") } : {}), ...init.headers,
    }, signal: this.signal ? AbortSignal.any([this.signal, AbortSignal.timeout(20_000)]) : AbortSignal.timeout(20_000) });
    this.lastRequest = Date.now();
    for (const raw of response.headers.getSetCookie?.() || []) {
      const pair = raw.split(";")[0]; const at = pair.indexOf("=");
      if (at > 0) this.cookies.set(pair.slice(0, at), pair.slice(at + 1));
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirects >= 4) throw new Error("ÖBS yönlendirmesi çözülemedi.");
      const next = new URL(location, url).href;
      return this.request(next, response.status === 307 || response.status === 308 ? init : {}, redirects + 1);
    }
    if (!response.ok) throw new Error(`ÖBS sayfasına ulaşılamadı (${response.status}).`);
    const buffer = await response.arrayBuffer();
    const charset = response.headers.get("content-type")?.match(/charset=([^;\s]+)/i)?.[1] || "utf-8";
    let html;
    try { html = new TextDecoder(charset).decode(buffer); } catch { html = new TextDecoder().decode(buffer); }
    return { html, url: response.url || url.href };
  }
}

export function createObsSearchService({ fetcher = (...args) => fetch(...args), requestDelayMs = 350, cacheMs = CACHE_MS } = {}) {
  const cache = new Map(); const jobs = new Map();
  function prune() {
    for (const [key, value] of cache) if (value.expires < Date.now()) cache.delete(key);
    for (const [key, job] of jobs) if (job.expires < Date.now()) { job.controller.abort(); jobs.delete(key); }
    while (cache.size > 400) cache.delete(cache.keys().next().value);
  }
  async function cached(key, loader, refresh = false) {
    prune(); const hit = cache.get(key);
    if (!refresh && hit) return hit.value;
    const value = await loader();
    cache.set(key, { value, expires: Date.now() + cacheMs });
    return value;
  }
  async function programs(level = "yls", target = {}, signal) {
    const type = ["yls", "dok", "lis"].includes(level) ? level : obsEducationLevel(level);
    const items = await cached(`programs:${type}`, async () => {
      const client = new ObsHttpClient(fetcher, signal, requestDelayMs);
      const { html } = await client.request(`${obsBase}unitSelection.aspx?type=${type}&lang=tr`);
      const parsed = parseObsPrograms(html);
      if (!parsed.length) throw new Error("ÖBS program listesi okunamadı. Bağlantıyla getirme seçeneğini kullanabilirsiniz.");
      return parsed;
    });
    return { programs: items, suggestedProgramId: suggestObsProgram(items, target) };
  }
  async function draft(rawUrl, { signal, refresh = false, client } = {}) {
    const url = normalizeObsUrl(rawUrl).href;
    return cached(`draft:${url}`, async () => {
      const result = await (client || new ObsHttpClient(fetcher, signal, requestDelayMs)).request(url);
      const value = parseObsCourseDraft(result.html, url);
      if (!value.code || !value.name) throw new Error("ÖBS ders detayında kayıt bulunamadı veya ders bilgileri okunamadı.");
      return value;
    }, refresh);
  }
  const snapshot = (job) => ({ id: job.id, status: job.status, progress: job.progress, candidates: [...job.candidates].sort(compareObsCandidates),
    warnings: job.warnings, error: job.error, program: job.program, scannedAt: job.scannedAt });
  function get(id, owner) {
    prune(); const job = jobs.get(id);
    return job && job.owner === owner ? snapshot(job) : null;
  }
  function cancel(id, owner) {
    const job = jobs.get(id);
    if (!job || job.owner !== owner) return null;
    if (job.status === "running") { job.status = "cancelled"; job.controller.abort(); }
    return snapshot(job);
  }
  async function run(job, target) {
    const signal = job.controller.signal;
    const client = new ObsHttpClient(fetcher, signal, requestDelayMs);
    const refresh = Boolean(target.refresh);
    const pageUrl = `${obsBase}progCourses.aspx?lang=tr&curSunit=${job.program.id}`;
    try {
      const index = await cached(`curricula:${job.program.id}`, async () => {
        const first = await client.request(pageUrl);
        let page = parseObsCurriculumPage(first.html);
        const curricula = page.curricula.length ? page.curricula : [{ value: "current", name: "Güncel müfredat", year: 0, current: true }];
        if (!page.courses.length && !page.curricula.length) throw new Error("ÖBS müfredat ve ders listesi okunamadı.");
        const entries = []; const warnings = [];
        for (const curriculum of curricula.slice(0, MAX_CURRICULA)) {
          signal.throwIfAborted();
          job.progress = { phase: "curricula", message: `${curriculum.name} müfredatının dersleri okunuyor…`, completed: entries.length, total: Math.min(curricula.length, MAX_CURRICULA) };
          try {
            if (page.selectName && page.curricula.find((item) => item.current)?.value !== curriculum.value) {
              const form = new URLSearchParams({ ...page.hidden, [page.selectName]: curriculum.value, __EVENTTARGET: page.selectName, __EVENTARGUMENT: "" });
              page = parseObsCurriculumPage((await client.request(pageUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: pageUrl }, body: form })).html);
              if (!page.curricula.some((item) => item.value === curriculum.value && item.current)) throw new Error("Müfredat seçimi ÖBS tarafından uygulanmadı.");
            }
            entries.push({ curriculum, courses: page.courses });
          } catch (error) {
            signal.throwIfAborted(); warnings.push(`${curriculum.name}: ${error.message}`);
            // A fresh viewstate avoids contaminating the next curriculum after a failed postback.
            page = parseObsCurriculumPage((await client.request(pageUrl)).html);
          }
        }
        if (curricula.length > MAX_CURRICULA) warnings.push(`İlk ${MAX_CURRICULA} müfredat tarandı. Bazı müfredatlar bu aramaya dahil edilemedi.`);
        return { entries, warnings };
      }, refresh);
      job.warnings.push(...index.warnings);
      const matches = index.entries.flatMap(({ curriculum, courses }) => courses.flatMap((course) => {
        const match = obsCourseMatch(course, target); return match ? [{ curriculum, course, match }] : [];
      })).sort((a, b) => b.match.score - a.match.score || b.curriculum.year - a.curriculum.year);
      if (matches.length > MAX_CANDIDATES) job.warnings.push(`İlk ${MAX_CANDIDATES} aday incelendi. Aramanızı ders koduyla daraltabilirsiniz.`);
      const seen = new Set();
      const loadedDrafts = new Map();
      for (const [index, item] of matches.slice(0, MAX_CANDIDATES).entries()) {
        signal.throwIfAborted();
        job.progress = { phase: "details", message: `${item.curriculum.name} · ${item.course.code} içeriği kontrol ediliyor…`, completed: index, total: Math.min(matches.length, MAX_CANDIDATES) };
        try {
          let sourceUrl = item.course.sourceUrl;
          if (!sourceUrl && item.course.eventTarget) {
            // Compatibility with older Proliz versions that redirect after a postback.
            let page = parseObsCurriculumPage((await client.request(pageUrl)).html);
            if (page.selectName && item.curriculum.value !== "current" && page.curricula.find((entry) => entry.current)?.value !== item.curriculum.value) {
              const form = new URLSearchParams({ ...page.hidden, [page.selectName]: item.curriculum.value, __EVENTTARGET: page.selectName, __EVENTARGUMENT: "" });
              page = parseObsCurriculumPage((await client.request(pageUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form })).html);
            }
            const course = page.courses.find((entry) => entry.code === item.course.code && entry.name === item.course.name);
            if (!course?.eventTarget) throw new Error("Ders detay bağlantısı çözülemedi.");
            const form = new URLSearchParams({ ...page.hidden, ...(page.selectName ? { [page.selectName]: item.curriculum.value } : {}), __EVENTTARGET: course.eventTarget, __EVENTARGUMENT: "" });
            const result = await client.request(pageUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: pageUrl }, body: form });
            sourceUrl = normalizeObsUrl(result.url).href;
          }
          if (!sourceUrl) throw new Error("Ders detay bağlantısı bulunamadı.");
          const value = loadedDrafts.get(sourceUrl) || await draft(sourceUrl, { signal, refresh, client });
          loadedDrafts.set(sourceUrl, value);
          if (normalizeObsText(value.code).replace(/\s/g, "") !== normalizeObsText(item.course.code).replace(/\s/g, "")) throw new Error("Ders detayındaki kimlik, listedeki dersle eşleşmiyor.");
          const key = `${job.program.id}:${item.curriculum.value}:${value.obsCourseId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          job.candidates.push({ id: key, sourceUrl: value.sourceUrl, obsCourseId: value.obsCourseId, code: value.code, name: value.name,
            program: job.program, curriculum: item.curriculum, updatedAt: value.updatedAt, ects: value.ects, instructors: value.details.instructors,
            instructorMatch: obsInstructorMatches(value.details.instructors, target.instructorName), matchScore: item.match.score, matchReason: item.match.reason, summary: contentSummary(value) });
        } catch (error) {
          signal.throwIfAborted(); job.warnings.push(`${item.curriculum.name} · ${item.course.code}: ${error.message}`);
        }
      }
      signal.throwIfAborted();
      job.status = "completed"; job.scannedAt = new Date().toISOString();
      job.progress = { phase: "done", message: `${job.candidates.length} aday ders bulundu.`, completed: matches.length, total: matches.length };
    } catch (error) {
      if (job.status === "cancelled") return;
      job.status = "failed";
      job.error = signal.aborted ? "ÖBS taraması zaman aşımına uğradı. Tekrar deneyebilir veya bağlantıyla getirebilirsiniz." : error.message;
    }
  }
  async function start(target, owner) {
    prune();
    if (!target.code?.trim() && !target.name?.trim()) throw new Error("Arama için ders kodu veya ders adı gerekli.");
    const { programs: items } = await programs(target.educationLevel || obsEducationLevel(target.level));
    const program = items.find((item) => item.id === target.programId);
    if (!program) throw new Error("Aranacak ÖBS programını seçin.");
    for (const job of jobs.values()) if (job.owner === owner && job.status === "running") cancel(job.id, owner);
    if ([...jobs.values()].filter((job) => job.status === "running").length >= 4 || jobs.size >= 100) throw new Error("ÖBS taraması şu anda yoğun. Kısa bir süre sonra tekrar deneyin.");
    const controller = new AbortController();
    const job = { id: randomUUID(), owner, program, status: "running", controller, expires: Date.now() + 15 * 60_000,
      candidates: [], warnings: [], error: "", scannedAt: "", progress: { phase: "starting", message: "Programın müfredatları hazırlanıyor…", completed: 0, total: 0 } };
    jobs.set(job.id, job);
    const timeout = setTimeout(() => controller.abort(), 5 * 60_000); timeout.unref?.();
    void run(job, target).finally(() => clearTimeout(timeout));
    return snapshot(job);
  }
  return { programs, draft, start, get, cancel };
}

export const obsSearchService = createObsSearchService();
export const fetchObsCourseDraft = (url) => obsSearchService.draft(url);
