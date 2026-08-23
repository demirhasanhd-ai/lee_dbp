import { createReadStream, existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";
import { DatabaseSync } from "node:sqlite";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.join(__dirname, "dist", "client");
const serverEntry = path.join(__dirname, "dist", "server", "index.js");
const basePath = "/dbp";
const port = Number(process.env.PORT || 8081);
const host = process.env.HOST || "0.0.0.0";
const dataDir = process.env.DBP_DATA_DIR || path.join(__dirname, "data");
const dbPath = process.env.DBP_SQLITE_PATH || path.join(dataDir, "dbp.sqlite");
const backupDir = process.env.DBP_BACKUP_DIR || path.join(dataDir, "backups");
const bundledSeedFile = path.join(__dirname, "seed", "program-data-local.js");
const localPreviewSeedFile = path.join(__dirname, "local-preview", "program-data-local.js");
const seedFile = process.env.DBP_SEED_FILE || (existsSync(bundledSeedFile) ? bundledSeedFile : localPreviewSeedFile);
const programProfilesSeedFile = process.env.DBP_PROGRAM_PROFILES_SEED_FILE || path.join(__dirname, "seed", "program-profiles.json");
const coursePackagesSeedFile = process.env.DBP_COURSE_PACKAGES_SEED_FILE || path.join(__dirname, "seed", "course-packages.json");
const pdfCacheDir = process.env.DBP_PDF_CACHE_DIR || path.join(dataDir, "generated-pdfs");
const pdfScript = process.env.DBP_PDF_SCRIPT || path.join(__dirname, "scripts", "generate_public_course_pdfs.py");

function resolveEEnstituRoot() {
  const configured = process.env.EENSTITU_ROOT || process.env.E_ENSTITU_ROOT;
  const candidates = [
    configured,
    path.resolve(__dirname, "..", "E_Enstitu"),
    path.resolve(__dirname, "..", "..", "E_Enstitu"),
    "F:\\WEB_PROJELER\\E_Enstitu",
    "C:\\WEB_PROJELER\\E_Enstitu",
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, "E_Enstitu") : "",
  ].filter(Boolean);
  return candidates.find((candidate) =>
    existsSync(path.join(candidate, "server", ".env")) ||
    existsSync(path.join(candidate, "src", "data", "demo-users.json"))
  ) || candidates[0] || path.resolve(__dirname, "..", "E_Enstitu");
}

const eEnstituRoot = resolveEEnstituRoot();
const eEnstituDemoUsersFile = process.env.EENSTITU_DEMO_USERS_FILE || path.join(eEnstituRoot, "src", "data", "demo-users.json");
let db;
let eEnstituPgPool;

function openBrowser(url) {
  const child =
    process.platform === "win32"
      ? spawn("cmd.exe", ["/d", "/s", "/c", "start", "", url], {
          detached: true,
          stdio: "ignore",
          windowsHide: true,
        })
      : process.platform === "darwin"
        ? spawn("open", [url], { detached: true, stdio: "ignore" })
        : spawn("xdg-open", [url], { detached: true, stdio: "ignore" });
  child.unref();
}

const dbpRoles = [
  "akademisyen",
  "abd_asd_baskani",
  "abd_sekreteri",
  "lee_ogrenci_isleri",
  "enstitu_sekreteri",
  "enstitu_yoneticisi",
  "admin",
];

const dbpModules = [
  "my_courses",
  "program_profile",
  "review_queue",
  "publish_control",
  "quality_reports",
  "database_admin",
  "user_roles",
  "permission_matrix",
];

const defaultRoleAccess = {
  akademisyen: ["my_courses"],
  abd_asd_baskani: ["my_courses", "program_profile", "review_queue"],
  abd_sekreteri: ["review_queue"],
  lee_ogrenci_isleri: ["my_courses", "program_profile"],
  enstitu_sekreteri: ["my_courses", "program_profile", "review_queue", "quality_reports"],
  enstitu_yoneticisi: ["my_courses", "program_profile", "review_queue", "publish_control", "quality_reports"],
  admin: ["my_courses", "database_admin", "program_profile", "review_queue", "publish_control", "quality_reports", "user_roles", "permission_matrix"],
};

const testProgramSeed = {
  mainDepartment: "Test ABD",
  department: "Test ABD",
  programName: "Test Programı",
  flags: "TTD",
  levels: ["Tezsiz YL", "Tezli YL", "Doktora"],
  visibilityKey: "test-abd-test-programi",
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const worker = (await import(`${pathToFileURL(serverEntry).href}?t=${Date.now()}`)).default;

const textRepairPairs = [
  ["\u00c3\u201e\u00c2\u00b0", "\u0130"], ["\u00c3\u201e\u00c2\u00b1", "\u0131"],
  ["\u00c3\u2026\u00c5\u00b8", "\u015f"], ["\u00c3\u2026\u00c2\u0178", "\u015f"],
  ["\u00c3\u2026\u00c5\u00be", "\u015e"], ["\u00c3\u2026\u00c2\u017d", "\u015e"],
  ["\u00c3\u201e\u00c5\u00b8", "\u011f"], ["\u00c3\u201e\u00c2\u0178", "\u011f"],
  ["\u00c3\u201e\u00c5\u00be", "\u011e"], ["\u00c3\u201e\u00c2\u017d", "\u011e"],
  ["\u00c3\u0192\u00c2\u00bc", "\u00fc"], ["\u00c3\u0192\u00c5\u201c", "\u00dc"],
  ["\u00c3\u0192\u00c2\u0152", "\u00dc"], ["\u00c3\u0192\u00c2\u00b6", "\u00f6"],
  ["\u00c3\u0192\u00e2\u20ac\u201c", "\u00d6"], ["\u00c3\u0192\u00c2\u2013", "\u00d6"],
  ["\u00c3\u0192\u00c2\u00a7", "\u00e7"], ["\u00c3\u0192\u00e2\u20ac\u00a1", "\u00c7"],
  ["\u00c3\u0192\u00c2\u2021", "\u00c7"],
  ["\u00c4\u00b0", "\u0130"], ["\u00c4\u00b1", "\u0131"], ["\u00c5\u0178", "\u015f"],
  ["\u00c5\u009f", "\u015f"], ["\u00c5\u017d", "\u015e"], ["\u00c5\u009e", "\u015e"],
  ["\u00c4\u0178", "\u011f"], ["\u00c4\u009f", "\u011f"], ["\u00c4\u017d", "\u011e"],
  ["\u00c4\u009e", "\u011e"], ["\u00c3\u00bc", "\u00fc"], ["\u00c3\u0153", "\u00dc"],
  ["\u00c3\u009c", "\u00dc"], ["\u00c3\u00b6", "\u00f6"], ["\u00c3\u2013", "\u00d6"],
  ["\u00c3\u0096", "\u00d6"], ["\u00c3\u00a7", "\u00e7"], ["\u00c3\u2021", "\u00c7"],
  ["\u00c3\u0087", "\u00c7"], ["\u00e2\u20ac\u201c", "\u2013"],
  ["\u00e2\u20ac\u201d", "\u2014"], ["\u00e2\u2020\u2019", "\u2192"],
  ["\u00e2\u2020\u0090", "\u2190"], ["\u00e2\u2014\u2030", "\u25c9"],
  ["\u00e2\u2014\u0152", "\u25cb"], ["\u00c2\u00b7", "\u00b7"], ["\u00c2", ""],
];

function repairText(value) {
  let text = String(value ?? "");
  for (const [from, to] of textRepairPairs) text = text.split(from).join(to);
  return text;
}

function sanitizeInstructorName(value) {
  return repairText(value || "")
    .replace(/\bDoc\.?\s*Dr\.?/giu, "Doç. Dr.")
    .replace(/\bDr\.?\s*Ogr\.?\s*Uyesi/giu, "Dr. Öğr. Üyesi")
    .replace(/\bOgr\.?\s*Gor\.?/giu, "Öğr. Gör.")
    .replace(/\bYrd\.?\s*Doç\.?\s*Dr\.?/giu, "Dr. Öğr. Üyesi")
    .replace(/(?:https?:\/\/|www\.)\S+/giu, " ")
    .replace(/\b(?:akbis\.)?osmaniye\.edu\.tr\/\S+/giu, " ")
    .replace(/\b\S+@\S+\b/giu, " ")
    .replace(/\s+\b(?:yok|null|undefined)\b\s*$/giu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function repairObject(value, fieldName = "") {
  if (typeof value === "string") {
    const repaired = repairText(value);
    return fieldName === "instructor" ? sanitizeInstructorName(repaired) : repaired;
  }
  if (Array.isArray(value)) return value.map((item) => repairObject(item, fieldName));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairObject(item, key)]));
  }
  return value;
}

function readEnvValue(file, key) {
  try {
    if (!existsSync(file)) return "";
    const prefix = `${key}=`;
    for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.startsWith(prefix)) continue;
      return line.slice(prefix.length).replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    return "";
  }
  return "";
}

function eEnstituDatabaseUrl() {
  return process.env.EENSTITU_DATABASE_URL ||
    process.env.E_ENSTITU_DATABASE_URL ||
    "";
}

function eEnstituSearchPath() {
  return process.env.EENSTITU_DB_SEARCH_PATH || process.env.E_ENSTITU_DB_SEARCH_PATH || "live, shared, public";
}

function eEnstituDbTimeoutMs() {
  const value = Number(process.env.EENSTITU_DB_TIMEOUT_MS || process.env.E_ENSTITU_DB_TIMEOUT_MS || 1500);
  return Number.isFinite(value) && value > 0 ? value : 1500;
}

function withTimeout(promise, ms, message) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
}

async function eEnstituPool() {
  const connectionString = eEnstituDatabaseUrl();
  if (!connectionString) return null;
  if (!eEnstituPgPool) {
    const timeout = eEnstituDbTimeoutMs();
    const { Pool } = await import("pg");
    eEnstituPgPool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: timeout,
      query_timeout: timeout,
      statement_timeout: timeout,
    });
  }
  return eEnstituPgPool;
}

function normalizeInstructorScope(value = "") {
  return repairText(value)
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replace(/\b(anabilim dali|anasanat dali)\b/giu, "")
    .replace(/\b(abd|asd)\b/giu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function departmentMatchesInstructorScope(option, filters = {}) {
  const requested = [filters.department, filters.programName]
    .filter(Boolean)
    .map(normalizeInstructorScope)
    .filter(Boolean);
  if (!requested.length) return true;
  const scopes = [
    ...(option.departmentNames || []),
    ...(option.departmentIds || []),
  ].map(normalizeInstructorScope).filter(Boolean);
  if (!scopes.length) return false;
  return requested.some((item) =>
    scopes.some((scope) => scope === item || scope.includes(item) || item.includes(scope))
  );
}

function sortInstructorOptions(options, filters = {}) {
  return [...options].sort((left, right) => {
    const leftScoped = departmentMatchesInstructorScope(left, filters);
    const rightScoped = departmentMatchesInstructorScope(right, filters);
    if (leftScoped !== rightScoped) return leftScoped ? -1 : 1;
    return left.name.localeCompare(right.name, "tr-TR");
  });
}

function normalizeInstructorOption(value) {
  const title = sanitizeInstructorName(value.title || "");
  const rawName = sanitizeInstructorName(value.name || value.displayName || "");
  const name = rawName || sanitizeInstructorName(`${title} ${value.firstName || ""} ${value.lastName || ""}`);
  if (!name) return null;
  const departmentNames = [...new Set((value.departmentNames || []).map(repairText).filter(Boolean))];
  const departmentIds = [...new Set((value.departmentIds || []).map(repairText).filter(Boolean))];
  return {
    id: String(value.id || value.tcKimlik || name),
    name,
    title: title || null,
    email: value.email || null,
    role: value.role || "danisman",
    departmentNames,
    departmentIds,
    source: value.source || "e_enstitu",
  };
}

async function loadEEnstituInstructorOptions(filters = {}) {
  const fallback = () => {
    const catalog = loadCourseCatalogInstructorOptions(filters);
    return catalog.instructors.length ? catalog : loadEEnstituInstructorOptionsFromDemo(filters);
  };
  let client;
  try {
    const pool = await eEnstituPool();
    if (!pool) return fallback();
    const timeout = eEnstituDbTimeoutMs();
    client = await withTimeout(pool.connect(), timeout, "e-Enstitu veritabani baglanti zaman asimi");
    await withTimeout(
      client.query("select set_config($1, $2, false)", ["search_path", eEnstituSearchPath()]),
      timeout,
      "e-Enstitu veritabani arama yolu zaman asimi",
    );
    const result = await withTimeout(client.query(`
      SELECT
        u.tc_kimlik,
        u.display_name,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.extra_roles,
        u.title,
        coalesce(u.profile_metadata->'ldap'->>'accountType', u.profile_metadata->'ldapProfileCompletion'->>'accountType') AS ldap_account_type,
        coalesce((u.profile_metadata->'ldapProfileCompletion'->>'completed')::boolean, false) AS ldap_profile_completed,
        array_remove(array_agg(DISTINCT coalesce(ad.name, pd.name)), NULL) AS department_names,
        array_remove(array_agg(DISTINCT coalesce(aa.department_id, u.department_id)), NULL) AS department_ids
      FROM directory_users u
      LEFT JOIN advisor_affiliations aa
        ON aa.advisor_tc_kimlik = u.tc_kimlik
       AND aa.is_active = true
       AND aa.role IN ('danisman', 'abd_baskani')
      LEFT JOIN admin_setting_departments ad ON ad.id = aa.department_id
      LEFT JOIN admin_setting_departments pd ON pd.id = u.department_id
      WHERE u.is_active = true
        AND (
          u.role IN ('danisman', 'abd_baskani')
          OR u.extra_roles && ARRAY['danisman', 'abd_baskani']::text[]
          OR aa.id IS NOT NULL
          OR (
            u.auth_source = 'ldap'
            AND coalesce(u.profile_metadata->'ldap'->>'accountType', u.profile_metadata->'ldapProfileCompletion'->>'accountType') = 'academic'
            AND coalesce((u.profile_metadata->'ldapProfileCompletion'->>'completed')::boolean, false) = true
          )
        )
      GROUP BY u.tc_kimlik
      ORDER BY u.display_name ASC
    `), timeout, "e-Enstitu akademisyen sorgusu zaman asimi");
    const all = result.rows
      .map((row) => normalizeInstructorOption({
        id: row.tc_kimlik,
        name: row.display_name,
        firstName: row.first_name,
        lastName: row.last_name,
        title: row.title,
        email: row.email,
        role: row.ldap_account_type === "academic" ? "danisman" : row.role,
        departmentNames: row.department_names || [],
        departmentIds: row.department_ids || [],
        source: "e_enstitu_database",
      }))
      .filter(Boolean);
    const scoped = all.filter((item) => departmentMatchesInstructorScope(item, filters));
    return {
      instructors: sortInstructorOptions(all, filters),
      source: "e_enstitu_database",
      scopeApplied: Boolean(scoped.length && scoped.length !== all.length),
    };
  } catch (error) {
    console.warn(`[dbp] e-Enstitu akademisyen listesi okunamadi: ${error instanceof Error ? error.message : error}`);
    if (!client && eEnstituPgPool) {
      const pool = eEnstituPgPool;
      eEnstituPgPool = null;
      void pool.end().catch(() => {});
    }
    return fallback();
  } finally {
    client?.release();
  }
}

function loadEEnstituInstructorOptionsFromDemo(filters = {}) {
  try {
    const raw = JSON.parse(readFileSync(eEnstituDemoUsersFile, "utf8"));
    const all = (Array.isArray(raw) ? raw : [])
      .filter((user) => ["danisman", "abd_baskani"].includes(user?.rol))
      .map((user) => normalizeInstructorOption({
        id: user.tcKimlik,
        name: `${user.unvan ? `${user.unvan} ` : ""}${user.ad || ""} ${user.soyad || ""}`,
        title: user.unvan || "",
        email: user.email || "",
        role: user.rol || "danisman",
        departmentNames: [user.anabilimDali, user.program].filter(Boolean),
        departmentIds: [user.departmentId].filter(Boolean),
        source: "e_enstitu_demo_file",
      }))
      .filter(Boolean);
    const scoped = all.filter((item) => departmentMatchesInstructorScope(item, filters));
    return {
      instructors: scoped.length ? scoped : all,
      source: "e_enstitu_demo_file",
      scopeApplied: Boolean(scoped.length && scoped.length !== all.length),
    };
  } catch {
    return { instructors: [], source: "unavailable", scopeApplied: false };
  }
}

function loadCourseCatalogInstructorOptions(filters = {}) {
  try {
    if (!db) return { instructors: [], source: "dbp_course_catalog", scopeApplied: false };
    const rows = db.prepare(`
      SELECT department, program_name, instructor
      FROM courses
      WHERE instructor IS NOT NULL AND TRIM(instructor) <> ''
      ORDER BY department, program_name, instructor
    `).all();
    const requested = [filters.department, filters.programName]
      .filter(Boolean)
      .map(normalizeInstructorScope)
      .filter(Boolean);
    const rowMatchesScope = (row) => {
      if (!requested.length) return true;
      const scopes = [row.department, row.program_name].map(normalizeInstructorScope).filter(Boolean);
      return requested.some((item) =>
        scopes.some((scope) => scope === item || scope.includes(item) || item.includes(scope))
      );
    };
    const scopedRows = rows.filter(rowMatchesScope);
    const courses = rows;
    const byName = new Map();
    const ignoredInstructorKeys = new Set([
      normalizeInstructorScope("Öğrencinin Danışmanı"),
      normalizeInstructorScope("Atama Bekliyor"),
      normalizeInstructorScope("Yok"),
      "",
    ]);

    for (const course of courses) {
      const name = sanitizeInstructorName(course.instructor || "");
      const key = normalizeInstructorScope(name);
      if (ignoredInstructorKeys.has(key)) continue;
      const existing = byName.get(key) || {
        id: `course-catalog:${key}`,
        name,
        title: null,
        email: null,
        role: "danisman",
        departmentNames: [],
        departmentIds: [],
        source: "dbp_course_catalog",
      };
      for (const departmentName of [course.department, course.program_name].filter(Boolean).map(repairText)) {
        if (!existing.departmentNames.includes(departmentName)) existing.departmentNames.push(departmentName);
      }
      byName.set(key, existing);
    }

    const instructors = sortInstructorOptions([...byName.values()], filters);
    return {
      instructors,
      source: "dbp_course_catalog",
      scopeApplied: Boolean(scopedRows.length && scopedRows.length !== rows.length),
    };
  } catch (error) {
    console.warn(`[dbp] DBP ders kataloğundan akademisyen listesi okunamadi: ${error instanceof Error ? error.message : error}`);
    return { instructors: [], source: "dbp_course_catalog", scopeApplied: false };
  }
}

function levelsFromFlags(flags) {
  const levels = [];
  if (flags?.[0] === "T") levels.push("Tezsiz YL");
  if (flags?.[1] === "T") levels.push("Tezli YL");
  if (flags?.[2] === "D") levels.push("Doktora");
  return levels.length ? levels : ["Tezli YL"];
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

function cacheSlug(value, fallback = "ders") {
  const text = repairText(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return text || fallback;
}

function pdfCacheFile({ code, program, name }) {
  const parts = [cacheSlug(code, "kod")];
  if (program) parts.push(cacheSlug(program, "program"));
  parts.push(cacheSlug(name, "ders"));
  return path.join(pdfCacheDir, `${parts.join("-")}.pdf`);
}

const pdfSlugMap = new Map([
  ["\u00e7", "c"], ["\u00c7", "C"],
  ["\u011f", "g"], ["\u011e", "G"],
  ["\u0131", "i"], ["\u0130", "I"],
  ["\u00f6", "o"], ["\u00d6", "O"],
  ["\u015f", "s"], ["\u015e", "S"],
  ["\u00fc", "u"], ["\u00dc", "U"],
]);

function pdfSlug(value, fallback = "ders") {
  const translated = Array.from(repairText(value || ""))
    .map((char) => pdfSlugMap.get(char) ?? char)
    .join("");
  const text = translated
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return text || fallback;
}

async function findStaticPdf({ code, program, name }) {
  if (!program) return null;
  const file = path.join(
    clientRoot,
    "pdf",
    "dbp",
    `${pdfSlug(code, "kod")}-${pdfSlug(program, "program")}-${pdfSlug(name, "ders")}.pdf`,
  );
  try {
    const info = await stat(file);
    return info.isFile() ? { file, info } : null;
  } catch {
    return null;
  }
}

function pdfResponseFromFile(request, file, info) {
  const headers = {
    "Content-Type": "application/pdf",
    "Content-Length": String(info.size),
    "Cache-Control": "public, max-age=3600",
    "Content-Disposition": `inline; filename="${pdfSlug(path.basename(file, ".pdf"), "ders")}.pdf"`,
  };
  return new Response(request.method === "HEAD" ? null : createReadStream(file), { headers });
}

function coursePackageFallback(url, { code, name, program }) {
  const params = new URLSearchParams({ ders: code, ad: name });
  if (program) params.set("program", program);
  const pathname = url.pathname.startsWith(basePath) ? `${basePath}/katalog` : "/katalog";
  return `${pathname}?${params.toString()}`;
}

function coursePackagePdfPayload({ code, name, department, programName, level }) {
  const rows = courseRowsForIdentity({ code, department, programName, level });
  const row = rows.find((item) =>
    ["YayÄ±mlandÄ±", "YayÄ±nlandÄ±", "Public"].includes(repairText(item.status || "")) &&
    item.package_json && item.package_json !== "{}"
  ) || rows.find((item) => item.package_json && item.package_json !== "{}");
  if (!row) {
    const seedPackage = findSeedPackageForCode(readCoursePackageSeeds(), code);
    if (!seedPackage) return null;
    const courseRow = rows[0] || {};
    const course = {
      academicYear: courseRow.academic_year || "2026-2027",
      department: courseRow.department || department || "",
      programName: courseRow.program_name || programName || "",
      level: displayLevel(courseRow.level || level || seedPackage.level || ""),
      code: courseRow.code || code,
      name: courseRow.name || name || packageSeedCourseName(seedPackage),
      type: courseRow.type || "SeÃ§meli",
      credit: Number(courseRow.credit ?? seedPackage.credit ?? 0),
      ects: Number(courseRow.ects ?? seedPackage.ects ?? 0),
      theory: Number(courseRow.theory ?? seedPackage.theory ?? 0),
      practice: Number(courseRow.practice ?? seedPackage.practice ?? 0),
      term: courseRow.term || "",
      status: courseRow.status || "Public",
      instructor: courseRow.instructor || seedPackage.instructor || "",
      updatedAt: courseRow.updated_at || "",
    };
    return repairObject({ course, package: storedPackageFromSeed(seedPackage, course) });
  }
  return repairObject({
    course: {
      academicYear: row.academic_year || "2026-2027",
      department: row.department || department || "",
      programName: row.program_name || programName || "",
      level: displayLevel(row.level || level || ""),
      code: row.code || code,
      name: row.name || name,
      type: row.type || "",
      credit: Number(row.credit || 0),
      ects: Number(row.ects || 0),
      theory: Number(row.theory || 0),
      practice: Number(row.practice || 0),
      term: row.term || "",
      status: row.status || "",
      instructor: row.instructor || "",
      updatedAt: row.updated_at || "",
    },
    package: JSON.parse(row.package_json || "{}"),
  });
}

function pythonCandidates() {
  if (process.env.DBP_PYTHON) return [process.env.DBP_PYTHON];
  return process.platform === "win32" ? ["python", "py"] : ["python3", "python"];
}

function spawnToCompletion(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: __dirname });
    let stderr = "";
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with code ${code}: ${stderr.trim()}`));
      }
    });
  });
}

async function runPdfGenerator(args) {
  const failures = [];
  for (const command of pythonCandidates()) {
    try {
      await spawnToCompletion(command, args);
      return;
    } catch (error) {
      failures.push(error.message);
    }
  }
  throw new Error(failures.join("\n"));
}

async function coursePdfResponse(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const code = url.searchParams.get("code")?.trim() || "";
  const name = url.searchParams.get("name")?.trim() || "";
  const program = url.searchParams.get("program")?.trim() || "";
  const department = (url.searchParams.get("department") || url.searchParams.get("bolum") || "").trim();
  const level = (url.searchParams.get("level") || url.searchParams.get("duzey") || "").trim();
  if (!code || !name) {
    return jsonResponse({ message: "PDF için ders kodu ve ders adi gerekir." }, { status: 400 });
  }

  const staticPdf = await findStaticPdf({ code, program, name });
  if (staticPdf) return pdfResponseFromFile(request, staticPdf.file, staticPdf.info);

  await mkdir(pdfCacheDir, { recursive: true });
  const target = pdfCacheFile({ code, program, name });
  const packagePayload = coursePackagePdfPayload({ code, name, department, programName: program, level });
  const packageJsonPath = packagePayload ? `${target}.json` : "";
  let info = null;
  if (!packagePayload) {
    try {
      info = await stat(target);
    } catch {
      info = null;
    }
  }
  if (!info) {
    try {
      if (packagePayload) {
        await writeFile(packageJsonPath, JSON.stringify(packagePayload), "utf8");
      }
      await runPdfGenerator([
        pdfScript,
        "--single",
        "--code",
        code,
        "--name",
        name,
        "--output",
        target,
        ...(program ? ["--program", program] : []),
        ...(department ? ["--department", department] : []),
        ...(level ? ["--level", level] : []),
        ...(packageJsonPath ? ["--package-json", packageJsonPath] : []),
      ]);
      info = await stat(target);
    } catch (error) {
      console.error("[dbp] PDF generation failed:", error);
      return new Response(null, {
        status: 302,
        headers: { Location: coursePackageFallback(url, { code, name, program }) },
      });
    }
  }

  return pdfResponseFromFile(request, target, info);
}

async function readJsonBody(request) {
  const text = await request.text();
  if (!text.trim()) return {};
  return JSON.parse(text);
}

function parseSession(request) {
  const raw = request.headers.get("x-dbp-session") || "";
  if (!raw) return null;
  try {
    const text = raw.startsWith("uri:") ? decodeURIComponent(raw.slice(4)) : raw;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function requireAdmin(request) {
  const session = parseSession(request);
  if (session?.role !== "admin") {
    return { error: jsonResponse({ message: "Bu işlem için admin rolü gerekir." }, { status: 403 }) };
  }
  return { session };
}

function requireDbpSession(request, options = {}) {
  const session = parseSession(request);
  if (!session?.role) {
    return { error: jsonResponse({ message: "DBP oturumu bulunamadi." }, { status: 401 }) };
  }
  if (options.write && (session.readOnly || session.role === "abd_sekreteri")) {
    return { error: jsonResponse({ message: "Bu rol veri kaydi yapamaz." }, { status: 403 }) };
  }
  return { session };
}

function normalizeLevel(value = "") {
  if (value.includes("Tezsiz")) return "Tezsiz YL";
  if (value.includes("Tezli")) return "Tezli YL";
  if (value.includes("Doktora")) return "Doktora";
  return value || "Tezli YL";
}

function levelKey(value = "") {
  return normalizeLevel(repairText(value)).toLocaleLowerCase("tr-TR");
}

function displayLevel(value = "") {
  const normalized = normalizeLevel(repairText(value));
  if (normalized === "Tezsiz YL") return "Tezsiz Yüksek Lisans";
  if (normalized === "Tezli YL") return "Tezli Yüksek Lisans";
  return normalized || "Tezli Yüksek Lisans";
}

const ybsSpecializationCodes = new Set(["YBS901", "YBS902", "YBS903", "YBS904", "YBS905", "YBS906", "YBS907", "YBS908"]);
const ybsThesisCodes = new Set(["YBS911", "YBS912", "YBS913", "YBS914", "YBS915", "YBS916"]);
const makineYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const makineYlSpecializationCodes = new Set(["MMB801", "MMB802", "MMB803", "MMB804"]);
const makineYlSeminarCodes = new Set(["MMB805", "MMB806"]);
const makineYlThesisCodes = new Set(["MMB807", "MMB808"]);
const aileYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const aileYlSpecializationCodes = new Set(["ADE801", "ADE802", "ADE803", "ADE804"]);
const aileYlSeminarCodes = new Set(["ADE805", "ADE806"]);
const aileYlThesisCodes = new Set(["ADE807", "ADE808"]);
const arkeolojiYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const arkeolojiYlSpecializationCodes = new Set(["ARK801", "ARK802", "ARK803", "ARK804"]);
const arkeolojiYlSeminarCodes = new Set(["ARK805", "ARK806"]);
const arkeolojiYlThesisCodes = new Set(["ARK807", "ARK808"]);
const bataryaYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const bataryaYlSpecializationCodes = new Set(["BHT801", "BHT802", "BHT803", "BHT804"]);
const bataryaYlSeminarCodes = new Set(["BHT805", "BHT806"]);
const bataryaYlResearchCodes = new Set(["BHT830", "BHT831"]);
const bataryaYlThesisCodes = new Set(["BHT807", "BHT808"]);
const bedenYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const bedenYlSpecializationCodes = new Set(["BES801", "BES802", "BES803", "BES804"]);
const bedenYlSeminarCodes = new Set(["BES805", "BES806"]);
const bedenYlResearchCodes = new Set(["BEF801", "BEF802"]);
const bedenYlThesisCodes = new Set(["BES807", "BES808"]);
const biyolojiYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const biyolojiYlSpecializationCodes = new Set(["BİO801", "BİO802", "BİO803", "BİO804"]);
const biyolojiYlSeminarCodes = new Set(["BİO805", "BİO806"]);
const biyolojiYlResearchCodes = new Set(["BİO809", "BİO810"]);
const biyolojiYlThesisCodes = new Set(["BİO807", "BİO808"]);
const biyolojiDrAdvisoryCodes = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const biyolojiDrSpecializationCodes = new Set(["BİO901", "BİO902", "BİO903", "BİO904", "BİO905", "BİO906", "BİO907", "BİO908"]);
const biyolojiDrSeminarCodes = new Set(["BİO909", "BİO910"]);
const biyolojiDrQualifyingCodes = new Set(["BİO917", "BİO918"]);
const biyolojiDrThesisCodes = new Set(["BİO912", "BİO913", "BİO914", "BİO915", "BİO916"]);
const ebelikYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const ebelikYlSpecializationCodes = new Set(["EBE801", "EBE802", "EBE803", "EBE804"]);
const ebelikYlSeminarCodes = new Set(["EBE805", "EBE806"]);
const ebelikYlResearchCodes = new Set(["EBE809", "EBE810"]);
const ebelikYlThesisCodes = new Set(["EBE807", "EBE808"]);
const ekoturizmYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const ekoturizmYlSpecializationCodes = new Set(["ETR801", "ETR802", "ETR803", "ETR804"]);
const ekoturizmYlSeminarCodes = new Set(["ETR805", "ETR806"]);
const ekoturizmYlResearchCodes = new Set(["ETR855", "ETR856", "BES802"]);
const ekoturizmYlThesisCodes = new Set(["ETR807", "ETR808"]);
const elektrikYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const elektrikYlSpecializationCodes = new Set(["EEM801", "EEM802", "EEM803", "EEM804"]);
const elektrikYlSeminarCodes = new Set(["EEM805", "EEM806"]);
const elektrikYlThesisCodes = new Set(["EEM807", "EEM808"]);
const enerjiYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const enerjiYlSpecializationCodes = new Set(["EMB801", "EMB802", "EMB803", "EMB804"]);
const enerjiYlSeminarCodes = new Set(["EMB805", "EMB806"]);
const enerjiYlResearchCodes = new Set(["EMB829", "EMB834"]);
const enerjiYlThesisCodes = new Set(["EMB807", "EMB808"]);
const enerjiDrAdvisoryCodes = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const enerjiDrSpecializationCodes = new Set(["EMB901", "EMB902", "EMB903", "EMB904", "EMB905", "EMB906", "EMB907", "EMB908"]);
const enerjiDrSeminarCodes = new Set(["EMB909", "EMB910"]);
const enerjiDrQualifyingCodes = new Set(["EMB917", "EMB918"]);
const enerjiDrThesisCodes = new Set(["EMB912", "EMB913", "EMB914", "EMB915", "EMB916"]);
const felsefeDinYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const felsefeDinYlSpecializationCodes = new Set(["FDB801", "FDB802", "FDB803", "FDB804"]);
const felsefeDinYlSeminarCodes = new Set(["FDB805", "FDB806"]);
const felsefeDinYlResearchCodes = new Set(["BES801", "BES802"]);
const felsefeDinYlThesisCodes = new Set(["FDB807", "FDB808"]);
const fizikYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const fizikYlSpecializationCodes = new Set(["FZK801", "FZK802", "FZK803", "FZK804"]);
const fizikYlSeminarCodes = new Set(["FZK805", "FZK806"]);
const fizikYlResearchCodes = new Set(["FZK898", "FZK899"]);
const fizikYlThesisCodes = new Set(["FZK807", "FZK808"]);
const fizikDrAdvisoryCodes = new Set(["DAN901", "DAN902", "DAN903", "DAN904", "DAN905", "DAN906", "DAN907", "DAN908"]);
const fizikDrSpecializationCodes = new Set(["FZK901", "FZK902", "FZK903", "FZK904", "FZK905", "FZK906", "FZK907", "FZK908"]);
const fizikDrSeminarCodes = new Set(["FZK909", "FZK910"]);
const fizikDrQualifyingCodes = new Set(["FZK917", "FZK918"]);
const fizikDrThesisCodes = new Set(["FZK912", "FZK913", "FZK914", "FZK915", "FZK916"]);
const gastronomiYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const gastronomiYlSpecializationCodes = new Set(["GMS801", "GMS802", "GMS803", "GMS804"]);
const gastronomiYlSeminarCodes = new Set(["GMS805", "GMS806"]);
const gastronomiYlResearchCodes = new Set(["GMS851", "GMS852"]);
const gastronomiYlThesisCodes = new Set(["GMS807", "GMS808"]);
const gidaMuhendisligiYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const gidaMuhendisligiYlSpecializationCodes = new Set(["GMB801", "GMB802", "GMB803", "GMB804"]);
const gidaMuhendisligiYlSeminarCodes = new Set(["GMB805", "GMB806"]);
const gidaMuhendisligiYlResearchCodes = new Set(["GMB853", "GMB856"]);
const gidaMuhendisligiYlThesisCodes = new Set(["GMB807", "GMB808"]);
const gidaTeknolojisiYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const gidaTeknolojisiYlSpecializationCodes = new Set(["GTB801", "GTB802", "GTB803", "GTB804"]);
const gidaTeknolojisiYlSeminarCodes = new Set(["GTB805", "GTB806"]);
const gidaTeknolojisiYlResearchCodes = new Set(["GTB828", "GTB829"]);
const gidaTeknolojisiYlThesisCodes = new Set(["GTB807", "GTB808"]);
const haritaYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const haritaYlSpecializationCodes = new Set(["HRM801", "HRM802", "HRM803", "HRM804"]);
const haritaYlSeminarCodes = new Set(["HRM805", "HRM806"]);
const haritaYlThesisCodes = new Set(["HRM807", "HRM808"]);
const icHastaliklariYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const icHastaliklariYlSpecializationCodes = new Set(["İHH801", "İHH802", "İHH803", "İHH804"]);
const icHastaliklariYlSeminarCodes = new Set(["İHH805", "İHH806"]);
const icHastaliklariYlResearchCodes = new Set(["İHH809", "İHH810"]);
const icHastaliklariYlThesisCodes = new Set(["İHH807", "İHH808"]);
const iktisatYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const iktisatYlSpecializationCodes = new Set(["İKT801", "İKT802", "İKT803", "İKT804"]);
const iktisatYlSeminarCodes = new Set(["İKT805", "İKT806"]);
const iktisatYlResearchCodes = new Set(["İKT897", "İKT898"]);
const iktisatYlThesisCodes = new Set(["İKT807", "İKT808"]);
const insaatYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const insaatYlSpecializationCodes = new Set(["İNŞ801", "İNŞ802", "İNŞ803", "İNŞ804"]);
const insaatYlSeminarCodes = new Set(["İNŞ805", "İNŞ806"]);
const insaatYlResearchCodes = new Set(["İNŞ897", "İNŞ898"]);
const insaatYlThesisCodes = new Set(["İNŞ807", "İNŞ808"]);
const isletmeYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const isletmeYlSpecializationCodes = new Set(["ISL801", "ISL802", "ISL803", "ISL804"]);
const isletmeYlSeminarCodes = new Set(["ISL805", "ISL806"]);
const isletmeYlResearchCodes = new Set(["ISL885", "ISL888"]);
const isletmeYlThesisCodes = new Set(["ISL807", "ISL808"]);
const kimyaYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const kimyaYlSpecializationCodes = new Set(["KİM801", "KİM802", "KİM803", "KİM804"]);
const kimyaYlSeminarCodes = new Set(["KİM805", "KİM806"]);
const kimyaYlResearchCodes = new Set(["KİM839", "KİM840"]);
const kimyaYlThesisCodes = new Set(["KİM807", "KİM808"]);
const matematikYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const matematikYlSpecializationCodes = new Set(["MAT801", "MAT802", "MAT803", "MAT804"]);
const matematikYlSeminarCodes = new Set(["MAT805", "MAT806"]);
const matematikYlResearchCodes = new Set(["MAT862", "MAT863"]);
const matematikYlThesisCodes = new Set(["MAT807", "MAT808"]);
const muhasebeFinansmanYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const muhasebeFinansmanYlSpecializationCodes = new Set(["MUF801", "MUF802", "MUF803", "MUF804"]);
const muhasebeFinansmanYlSeminarCodes = new Set(["MUF805", "MUF806"]);
const muhasebeFinansmanYlResearchCodes = new Set(["MUF849", "MUF852"]);
const muhasebeFinansmanYlThesisCodes = new Set(["MUF807", "MUF808"]);
const organikTarimYlAdvisoryCodes = new Set(["DAN801", "DAN802", "DAN803", "DAN804"]);
const organikTarimYlSpecializationCodes = new Set(["OTİ801", "OTİ802", "OTİ803", "OTİ804"]);
const organikTarimYlSeminarCodes = new Set(["OTİ805", "OTİ806"]);
const organikTarimYlResearchCodes = new Set(["OTİ841", "OTİ844"]);
const organikTarimYlThesisCodes = new Set(["OTİ807", "OTİ808"]);
const resimYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const resimYlSpecializationCodes = new Set(["RES801", "RES802", "RES803", "RES804"]);
const resimYlSeminarCodes = new Set(["RES805", "RES806"]);
const resimYlResearchCodes = new Set(["RES881", "RES882"]);
const resimYlThesisCodes = new Set(["RES807", "RES808"]);
const siyasetKamuYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const siyasetKamuYlSpecializationCodes = new Set(["SKY801", "SKY802", "SKY803", "SKY804"]);
const siyasetKamuYlSeminarCodes = new Set(["SKY805", "SKY806"]);
const siyasetKamuYlResearchCodes = new Set(["SKY898", "SKY899"]);
const siyasetKamuYlThesisCodes = new Set(["SKY807", "SKY808"]);
const tarihYlResearchCodes = new Set(["BES801", "BES802"]);
const tarihYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const tarihYlSpecializationCodes = new Set(["TTZ801", "TTZ802", "TTZ803", "TTZ804", "TTZ897"]);
const tarihYlSeminarCodes = new Set(["TTZ805", "TTZ806"]);
const tarihYlThesisCodes = new Set(["TTZ807", "TTZ808"]);
const temelIslamYlResearchCodes = new Set(["TİB879"]);
const temelIslamYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const temelIslamYlSpecializationCodes = new Set(["TİB801", "TİB802", "TİB803", "TİB804"]);
const temelIslamYlSeminarCodes = new Set(["TİB805", "TİB806"]);
const temelIslamYlThesisCodes = new Set(["TİB807", "TİB808"]);
const tdeYlResearchCodes = new Set(["BES801"]);
const tdeYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const tdeYlSpecializationCodes = new Set(["TDE801", "TDE802", "TDE803", "TDE804"]);
const tdeYlSeminarCodes = new Set(["TDE805", "TDE806"]);
const tdeYlThesisCodes = new Set(["TDE807", "TDE808"]);
const ybsYlResearchCodes = new Set(["BES801", "BES802"]);
const ybsYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const ybsYlSpecializationCodes = new Set(["YBS801", "YBS802", "YBS803", "YBS804"]);
const ybsYlSeminarCodes = new Set(["YBS805", "YBS806"]);
const ybsYlThesisCodes = new Set(["YBS807", "YBS808"]);
const yonetimOrganizasyonYlResearchCodes = new Set(["YON841", "BES802"]);
const yonetimOrganizasyonYlAdvisoryCodes = new Set(["DAN801", "DAN802"]);
const yonetimOrganizasyonYlSpecializationCodes = new Set(["YON801", "YON802", "YON803", "YON804"]);
const yonetimOrganizasyonYlSeminarCodes = new Set(["YON805", "YON806"]);
const yonetimOrganizasyonYlThesisCodes = new Set(["YON807", "YON808"]);
const ybsDefaultDepartment = "Yönetim Bilişim Sistemleri ABD";
const ybsDefaultProgramName = "Yönetim Bilişim Sistemleri";

function canonicalCourseCode(code = "") {
  const normalizedCode = repairText(code).trim().toLocaleUpperCase("tr-TR");
  if (ybsSpecializationCodes.has(normalizedCode)) return "YBS9XX";
  if (ybsThesisCodes.has(normalizedCode)) return "YBS91X";
  if (normalizedCode === "YBS909") return "YBS999";
  if (normalizedCode === "YBS918") return "YBS917";
  if (aileYlSpecializationCodes.has(normalizedCode)) return "ADE8XX";
  if (aileYlSeminarCodes.has(normalizedCode)) return "ADE806";
  if (aileYlThesisCodes.has(normalizedCode)) return "ADE81X";
  if (arkeolojiYlSpecializationCodes.has(normalizedCode)) return "ARK8XX";
  if (arkeolojiYlSeminarCodes.has(normalizedCode)) return "ARK806";
  if (arkeolojiYlThesisCodes.has(normalizedCode)) return "ARK81X";
  if (bataryaYlSpecializationCodes.has(normalizedCode)) return "BHT8XX";
  if (bataryaYlSeminarCodes.has(normalizedCode)) return "BHT806";
  if (bataryaYlResearchCodes.has(normalizedCode)) return "BHT831";
  if (bataryaYlThesisCodes.has(normalizedCode)) return "BHT81X";
  if (ebelikYlSpecializationCodes.has(normalizedCode)) return "EBE8XX";
  if (ebelikYlSeminarCodes.has(normalizedCode)) return "EBE806";
  if (ebelikYlResearchCodes.has(normalizedCode)) return "EBE809";
  if (ebelikYlThesisCodes.has(normalizedCode)) return "EBE81X";
  if (ekoturizmYlSpecializationCodes.has(normalizedCode)) return "ETR8XX";
  if (ekoturizmYlSeminarCodes.has(normalizedCode)) return "ETR806";
  if (ekoturizmYlResearchCodes.has(normalizedCode)) return "ETR855";
  if (ekoturizmYlThesisCodes.has(normalizedCode)) return "ETR81X";
  if (elektrikYlSpecializationCodes.has(normalizedCode)) return "EEM8XX";
  if (elektrikYlSeminarCodes.has(normalizedCode)) return "EEM806";
  if (elektrikYlThesisCodes.has(normalizedCode)) return "EEM81X";
  if (enerjiYlSpecializationCodes.has(normalizedCode)) return "EMB8XX";
  if (enerjiYlSeminarCodes.has(normalizedCode)) return "EMB806";
  if (enerjiYlResearchCodes.has(normalizedCode)) return "EMB829";
  if (enerjiYlThesisCodes.has(normalizedCode)) return "EMB81X";
  if (felsefeDinYlSpecializationCodes.has(normalizedCode)) return "FDB8XX";
  if (felsefeDinYlSeminarCodes.has(normalizedCode)) return "FDB806";
  if (felsefeDinYlThesisCodes.has(normalizedCode)) return "FDB81X";
  if (fizikYlSpecializationCodes.has(normalizedCode)) return "FZK8XX";
  if (fizikYlSeminarCodes.has(normalizedCode)) return "FZK806";
  if (fizikYlResearchCodes.has(normalizedCode)) return "FZK899";
  if (fizikYlThesisCodes.has(normalizedCode)) return "FZK81X";
  if (gastronomiYlSpecializationCodes.has(normalizedCode)) return "GMS8XX";
  if (gastronomiYlSeminarCodes.has(normalizedCode)) return "GMS806";
  if (gastronomiYlResearchCodes.has(normalizedCode)) return "GMS85X";
  if (gastronomiYlThesisCodes.has(normalizedCode)) return "GMS81X";
  if (gidaMuhendisligiYlSpecializationCodes.has(normalizedCode)) return "GMB8XX";
  if (gidaMuhendisligiYlSeminarCodes.has(normalizedCode)) return "GMB806";
  if (gidaMuhendisligiYlResearchCodes.has(normalizedCode)) return "GMB85X";
  if (gidaMuhendisligiYlThesisCodes.has(normalizedCode)) return "GMB81X";
  if (gidaTeknolojisiYlSpecializationCodes.has(normalizedCode)) return "GTB8XX";
  if (gidaTeknolojisiYlSeminarCodes.has(normalizedCode)) return "GTB806";
  if (gidaTeknolojisiYlResearchCodes.has(normalizedCode)) return "GTB82X";
  if (gidaTeknolojisiYlThesisCodes.has(normalizedCode)) return "GTB81X";
  if (haritaYlSpecializationCodes.has(normalizedCode)) return "HRM8XX";
  if (haritaYlSeminarCodes.has(normalizedCode)) return "HRM806";
  if (haritaYlThesisCodes.has(normalizedCode)) return "HRM81X";
  if (icHastaliklariYlSpecializationCodes.has(normalizedCode)) return "İHH8XX";
  if (icHastaliklariYlSeminarCodes.has(normalizedCode)) return "İHH806";
  if (icHastaliklariYlResearchCodes.has(normalizedCode)) return "İHH809";
  if (icHastaliklariYlThesisCodes.has(normalizedCode)) return "İHH81X";
  if (iktisatYlSpecializationCodes.has(normalizedCode)) return "İKT8XX";
  if (iktisatYlSeminarCodes.has(normalizedCode)) return "İKT806";
  if (iktisatYlResearchCodes.has(normalizedCode)) return "İKT897";
  if (iktisatYlThesisCodes.has(normalizedCode)) return "İKT81X";
  if (insaatYlSpecializationCodes.has(normalizedCode)) return "İNŞ8XX";
  if (insaatYlSeminarCodes.has(normalizedCode)) return "İNŞ806";
  if (insaatYlResearchCodes.has(normalizedCode)) return "İNŞ897";
  if (insaatYlThesisCodes.has(normalizedCode)) return "İNŞ81X";
  if (isletmeYlSpecializationCodes.has(normalizedCode)) return "ISL8XX";
  if (isletmeYlSeminarCodes.has(normalizedCode)) return "ISL806";
  if (isletmeYlResearchCodes.has(normalizedCode)) return "ISL885";
  if (isletmeYlThesisCodes.has(normalizedCode)) return "ISL81X";
  if (kimyaYlSpecializationCodes.has(normalizedCode)) return "KİM8XX";
  if (kimyaYlSeminarCodes.has(normalizedCode)) return "KİM806";
  if (kimyaYlResearchCodes.has(normalizedCode)) return "KİM839";
  if (kimyaYlThesisCodes.has(normalizedCode)) return "KİM81X";
  if (matematikYlSpecializationCodes.has(normalizedCode)) return "MAT8XX";
  if (matematikYlSeminarCodes.has(normalizedCode)) return "MAT805";
  if (matematikYlResearchCodes.has(normalizedCode)) return "MAT863";
  if (matematikYlThesisCodes.has(normalizedCode)) return "MAT81X";
  if (muhasebeFinansmanYlSpecializationCodes.has(normalizedCode)) return "MUF8XX";
  if (muhasebeFinansmanYlSeminarCodes.has(normalizedCode)) return "MUF805";
  if (muhasebeFinansmanYlResearchCodes.has(normalizedCode)) return "MUF849";
  if (muhasebeFinansmanYlThesisCodes.has(normalizedCode)) return "MUF81X";
  if (organikTarimYlSpecializationCodes.has(normalizedCode)) return "OTİ8XX";
  if (organikTarimYlSeminarCodes.has(normalizedCode)) return "OTİ805";
  if (organikTarimYlResearchCodes.has(normalizedCode)) return "OTİ841";
  if (organikTarimYlThesisCodes.has(normalizedCode)) return "OTİ81X";
  if (resimYlSpecializationCodes.has(normalizedCode)) return "RES8XX";
  if (resimYlSeminarCodes.has(normalizedCode)) return "RES805";
  if (resimYlResearchCodes.has(normalizedCode)) return "RES881";
  if (resimYlThesisCodes.has(normalizedCode)) return "RES81X";
  if (siyasetKamuYlSpecializationCodes.has(normalizedCode)) return "SKY8XX";
  if (siyasetKamuYlSeminarCodes.has(normalizedCode)) return "SKY805";
  if (siyasetKamuYlResearchCodes.has(normalizedCode)) return "SKY899";
  if (siyasetKamuYlThesisCodes.has(normalizedCode)) return "SKY81X";
  if (tarihYlSpecializationCodes.has(normalizedCode)) return "TTZ8XX";
  if (tarihYlSeminarCodes.has(normalizedCode)) return "TTZ805";
  if (tarihYlThesisCodes.has(normalizedCode)) return "TTZ81X";
  if (temelIslamYlSpecializationCodes.has(normalizedCode)) return "TİB8XX";
  if (temelIslamYlSeminarCodes.has(normalizedCode)) return "TİB805";
  if (temelIslamYlThesisCodes.has(normalizedCode)) return "TİB81X";
  if (tdeYlSpecializationCodes.has(normalizedCode)) return "TDE8XX";
  if (tdeYlSeminarCodes.has(normalizedCode)) return "TDE805";
  if (tdeYlThesisCodes.has(normalizedCode)) return "TDE81X";
  if (ybsYlSpecializationCodes.has(normalizedCode)) return "YBS8XX";
  if (ybsYlSeminarCodes.has(normalizedCode)) return "YBS805";
  if (ybsYlThesisCodes.has(normalizedCode)) return "YBS81X";
  if (yonetimOrganizasyonYlSpecializationCodes.has(normalizedCode)) return "YON8XX";
  if (yonetimOrganizasyonYlSeminarCodes.has(normalizedCode)) return "YON805";
  if (yonetimOrganizasyonYlResearchCodes.has(normalizedCode)) return "YON841";
  if (yonetimOrganizasyonYlThesisCodes.has(normalizedCode)) return "YON81X";
  return normalizedCode;
}

function courseCodeCandidates(code = "") {
  const normalizedCode = repairText(code).trim().toLocaleUpperCase("tr-TR");
  const canonical = canonicalCourseCode(normalizedCode);
  const candidates = new Set([normalizedCode, canonical]);
  if (canonical === "YBS9XX") for (const alias of ybsSpecializationCodes) candidates.add(alias);
  if (canonical === "YBS91X") for (const alias of ybsThesisCodes) candidates.add(alias);
  if (canonical === "YBS999") candidates.add("YBS909");
  if (canonical === "YBS917") candidates.add("YBS918");
  if (canonical === "DAN8XX") for (const alias of makineYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "MMB8XX") for (const alias of makineYlSpecializationCodes) candidates.add(alias);
  if (canonical === "MMB806") for (const alias of makineYlSeminarCodes) candidates.add(alias);
  if (canonical === "MMB81X") for (const alias of makineYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of aileYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "ADE8XX") for (const alias of aileYlSpecializationCodes) candidates.add(alias);
  if (canonical === "ADE806") for (const alias of aileYlSeminarCodes) candidates.add(alias);
  if (canonical === "ADE81X") for (const alias of aileYlThesisCodes) candidates.add(alias);
  if (canonical === "ARK8XX") for (const alias of arkeolojiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "ARK806") for (const alias of arkeolojiYlSeminarCodes) candidates.add(alias);
  if (canonical === "ARK81X") for (const alias of arkeolojiYlThesisCodes) candidates.add(alias);
  if (canonical === "BHT8XX") for (const alias of bataryaYlSpecializationCodes) candidates.add(alias);
  if (canonical === "BHT806") for (const alias of bataryaYlSeminarCodes) candidates.add(alias);
  if (canonical === "BHT831") for (const alias of bataryaYlResearchCodes) candidates.add(alias);
  if (canonical === "BHT81X") for (const alias of bataryaYlThesisCodes) candidates.add(alias);
  if (canonical === "BES8XX") for (const alias of bedenYlSpecializationCodes) candidates.add(alias);
  if (canonical === "BES806") for (const alias of bedenYlSeminarCodes) candidates.add(alias);
  if (canonical === "BEF801") for (const alias of bedenYlResearchCodes) candidates.add(alias);
  if (canonical === "BES81X") for (const alias of bedenYlThesisCodes) candidates.add(alias);
  if (canonical === "BİO8XX") for (const alias of biyolojiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "BİO806") for (const alias of biyolojiYlSeminarCodes) candidates.add(alias);
  if (canonical === "BİO809") for (const alias of biyolojiYlResearchCodes) candidates.add(alias);
  if (canonical === "BİO81X") for (const alias of biyolojiYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN9XX") for (const alias of biyolojiDrAdvisoryCodes) candidates.add(alias);
  if (canonical === "BİO9XX") for (const alias of biyolojiDrSpecializationCodes) candidates.add(alias);
  if (canonical === "BİO909") for (const alias of biyolojiDrSeminarCodes) candidates.add(alias);
  if (canonical === "BİO917") for (const alias of biyolojiDrQualifyingCodes) candidates.add(alias);
  if (canonical === "BİO91X") for (const alias of biyolojiDrThesisCodes) candidates.add(alias);
  if (canonical === "EBE8XX") for (const alias of ebelikYlSpecializationCodes) candidates.add(alias);
  if (canonical === "EBE806") for (const alias of ebelikYlSeminarCodes) candidates.add(alias);
  if (canonical === "EBE809") for (const alias of ebelikYlResearchCodes) candidates.add(alias);
  if (canonical === "EBE81X") for (const alias of ebelikYlThesisCodes) candidates.add(alias);
  if (canonical === "ETR8XX") for (const alias of ekoturizmYlSpecializationCodes) candidates.add(alias);
  if (canonical === "ETR806") for (const alias of ekoturizmYlSeminarCodes) candidates.add(alias);
  if (canonical === "ETR855") for (const alias of ekoturizmYlResearchCodes) candidates.add(alias);
  if (canonical === "ETR81X") for (const alias of ekoturizmYlThesisCodes) candidates.add(alias);
  if (canonical === "EEM8XX") for (const alias of elektrikYlSpecializationCodes) candidates.add(alias);
  if (canonical === "EEM806") for (const alias of elektrikYlSeminarCodes) candidates.add(alias);
  if (canonical === "EEM81X") for (const alias of elektrikYlThesisCodes) candidates.add(alias);
  if (canonical === "EMB8XX") for (const alias of enerjiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "EMB806") for (const alias of enerjiYlSeminarCodes) candidates.add(alias);
  if (canonical === "EMB829") for (const alias of enerjiYlResearchCodes) candidates.add(alias);
  if (canonical === "EMB81X") for (const alias of enerjiYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN9XX") for (const alias of enerjiDrAdvisoryCodes) candidates.add(alias);
  if (canonical === "EMB9XX") for (const alias of enerjiDrSpecializationCodes) candidates.add(alias);
  if (canonical === "EMB909") for (const alias of enerjiDrSeminarCodes) candidates.add(alias);
  if (canonical === "EMB917") for (const alias of enerjiDrQualifyingCodes) candidates.add(alias);
  if (canonical === "EMB91X") for (const alias of enerjiDrThesisCodes) candidates.add(alias);
  if (canonical === "FDB8XX") for (const alias of felsefeDinYlSpecializationCodes) candidates.add(alias);
  if (canonical === "FDB806") for (const alias of felsefeDinYlSeminarCodes) candidates.add(alias);
  if (canonical === "FDB81X") for (const alias of felsefeDinYlThesisCodes) candidates.add(alias);
  if (canonical === "FZK8XX") for (const alias of fizikYlSpecializationCodes) candidates.add(alias);
  if (canonical === "FZK806") for (const alias of fizikYlSeminarCodes) candidates.add(alias);
  if (canonical === "FZK899") for (const alias of fizikYlResearchCodes) candidates.add(alias);
  if (canonical === "FZK81X") for (const alias of fizikYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN9XX") for (const alias of fizikDrAdvisoryCodes) candidates.add(alias);
  if (canonical === "FZK9XX") for (const alias of fizikDrSpecializationCodes) candidates.add(alias);
  if (canonical === "FZK909") for (const alias of fizikDrSeminarCodes) candidates.add(alias);
  if (canonical === "FZK917") for (const alias of fizikDrQualifyingCodes) candidates.add(alias);
  if (canonical === "FZK91X") for (const alias of fizikDrThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of gastronomiYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "GMS8XX") for (const alias of gastronomiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "GMS806") for (const alias of gastronomiYlSeminarCodes) candidates.add(alias);
  if (canonical === "GMS85X") for (const alias of gastronomiYlResearchCodes) candidates.add(alias);
  if (canonical === "GMS81X") for (const alias of gastronomiYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of gidaMuhendisligiYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "GMB8XX") for (const alias of gidaMuhendisligiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "GMB806") for (const alias of gidaMuhendisligiYlSeminarCodes) candidates.add(alias);
  if (canonical === "GMB85X") for (const alias of gidaMuhendisligiYlResearchCodes) candidates.add(alias);
  if (canonical === "GMB81X") for (const alias of gidaMuhendisligiYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of gidaTeknolojisiYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "GTB8XX") for (const alias of gidaTeknolojisiYlSpecializationCodes) candidates.add(alias);
  if (canonical === "GTB806") for (const alias of gidaTeknolojisiYlSeminarCodes) candidates.add(alias);
  if (canonical === "GTB82X") for (const alias of gidaTeknolojisiYlResearchCodes) candidates.add(alias);
  if (canonical === "GTB81X") for (const alias of gidaTeknolojisiYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of haritaYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "HRM8XX") for (const alias of haritaYlSpecializationCodes) candidates.add(alias);
  if (canonical === "HRM806") for (const alias of haritaYlSeminarCodes) candidates.add(alias);
  if (canonical === "HRM81X") for (const alias of haritaYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of icHastaliklariYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "İHH8XX") for (const alias of icHastaliklariYlSpecializationCodes) candidates.add(alias);
  if (canonical === "İHH806") for (const alias of icHastaliklariYlSeminarCodes) candidates.add(alias);
  if (canonical === "İHH809") for (const alias of icHastaliklariYlResearchCodes) candidates.add(alias);
  if (canonical === "İHH81X") for (const alias of icHastaliklariYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of iktisatYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "İKT8XX") for (const alias of iktisatYlSpecializationCodes) candidates.add(alias);
  if (canonical === "İKT806") for (const alias of iktisatYlSeminarCodes) candidates.add(alias);
  if (canonical === "İKT897") for (const alias of iktisatYlResearchCodes) candidates.add(alias);
  if (canonical === "İKT81X") for (const alias of iktisatYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of insaatYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "İNŞ8XX") for (const alias of insaatYlSpecializationCodes) candidates.add(alias);
  if (canonical === "İNŞ806") for (const alias of insaatYlSeminarCodes) candidates.add(alias);
  if (canonical === "İNŞ897") for (const alias of insaatYlResearchCodes) candidates.add(alias);
  if (canonical === "İNŞ81X") for (const alias of insaatYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of isletmeYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "ISL8XX") for (const alias of isletmeYlSpecializationCodes) candidates.add(alias);
  if (canonical === "ISL806") for (const alias of isletmeYlSeminarCodes) candidates.add(alias);
  if (canonical === "ISL885") for (const alias of isletmeYlResearchCodes) candidates.add(alias);
  if (canonical === "ISL81X") for (const alias of isletmeYlThesisCodes) candidates.add(alias);
  if (canonical === "DAN8XX") for (const alias of kimyaYlAdvisoryCodes) candidates.add(alias);
  if (canonical === "KİM8XX") for (const alias of kimyaYlSpecializationCodes) candidates.add(alias);
  if (canonical === "KİM806") for (const alias of kimyaYlSeminarCodes) candidates.add(alias);
  if (canonical === "KİM839") for (const alias of kimyaYlResearchCodes) candidates.add(alias);
  if (canonical === "KİM81X") for (const alias of kimyaYlThesisCodes) candidates.add(alias);
  if (canonical === "MAT8XX") for (const alias of matematikYlSpecializationCodes) candidates.add(alias);
  if (canonical === "MAT805") for (const alias of matematikYlSeminarCodes) candidates.add(alias);
  if (canonical === "MAT863") for (const alias of matematikYlResearchCodes) candidates.add(alias);
  if (canonical === "MAT81X") for (const alias of matematikYlThesisCodes) candidates.add(alias);
  if (canonical === "MUF8XX") for (const alias of muhasebeFinansmanYlSpecializationCodes) candidates.add(alias);
  if (canonical === "MUF805") for (const alias of muhasebeFinansmanYlSeminarCodes) candidates.add(alias);
  if (canonical === "MUF849") for (const alias of muhasebeFinansmanYlResearchCodes) candidates.add(alias);
  if (canonical === "MUF81X") for (const alias of muhasebeFinansmanYlThesisCodes) candidates.add(alias);
  if (canonical === "OTİ8XX") for (const alias of organikTarimYlSpecializationCodes) candidates.add(alias);
  if (canonical === "OTİ805") for (const alias of organikTarimYlSeminarCodes) candidates.add(alias);
  if (canonical === "OTİ841") for (const alias of organikTarimYlResearchCodes) candidates.add(alias);
  if (canonical === "OTİ81X") for (const alias of organikTarimYlThesisCodes) candidates.add(alias);
  if (canonical === "RES8XX") for (const alias of resimYlSpecializationCodes) candidates.add(alias);
  if (canonical === "RES805") for (const alias of resimYlSeminarCodes) candidates.add(alias);
  if (canonical === "RES881") for (const alias of resimYlResearchCodes) candidates.add(alias);
  if (canonical === "RES81X") for (const alias of resimYlThesisCodes) candidates.add(alias);
  if (canonical === "SKY8XX") for (const alias of siyasetKamuYlSpecializationCodes) candidates.add(alias);
  if (canonical === "SKY805") for (const alias of siyasetKamuYlSeminarCodes) candidates.add(alias);
  if (canonical === "SKY899") for (const alias of siyasetKamuYlResearchCodes) candidates.add(alias);
  if (canonical === "SKY81X") for (const alias of siyasetKamuYlThesisCodes) candidates.add(alias);
  if (canonical === "TTZ8XX") for (const alias of tarihYlSpecializationCodes) candidates.add(alias);
  if (canonical === "TTZ805") for (const alias of tarihYlSeminarCodes) candidates.add(alias);
  if (canonical === "TTZ81X") for (const alias of tarihYlThesisCodes) candidates.add(alias);
  if (canonical === "TİB8XX") for (const alias of temelIslamYlSpecializationCodes) candidates.add(alias);
  if (canonical === "TİB805") for (const alias of temelIslamYlSeminarCodes) candidates.add(alias);
  if (canonical === "TİB81X") for (const alias of temelIslamYlThesisCodes) candidates.add(alias);
  if (canonical === "TDE8XX") for (const alias of tdeYlSpecializationCodes) candidates.add(alias);
  if (canonical === "TDE805") for (const alias of tdeYlSeminarCodes) candidates.add(alias);
  if (canonical === "TDE81X") for (const alias of tdeYlThesisCodes) candidates.add(alias);
  if (canonical === "YBS8XX") for (const alias of ybsYlSpecializationCodes) candidates.add(alias);
  if (canonical === "YBS805") for (const alias of ybsYlSeminarCodes) candidates.add(alias);
  if (canonical === "YBS81X") for (const alias of ybsYlThesisCodes) candidates.add(alias);
  if (canonical === "YON8XX") for (const alias of yonetimOrganizasyonYlSpecializationCodes) candidates.add(alias);
  if (canonical === "YON805") for (const alias of yonetimOrganizasyonYlSeminarCodes) candidates.add(alias);
  if (canonical === "YON841") for (const alias of yonetimOrganizasyonYlResearchCodes) candidates.add(alias);
  if (canonical === "YON81X") for (const alias of yonetimOrganizasyonYlThesisCodes) candidates.add(alias);
  return [...candidates].filter(Boolean);
}

function isMakineTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" &&
    normalizeScope(course.department || "") === normalizeScope("Makine Mühendisliği ABD") &&
    normalizeScope(course.programName || course.program_name || "") === normalizeScope("Makine Mühendisliği");
}

function normalizeMakineTezliCourse(course = {}) {
  if (!isMakineTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (makineYlAdvisoryCodes.has(code)) {
    if (code !== "DAN801") return null;
    return { ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1, instructor: "Öğrencinin Danışmanı" };
  }
  if (makineYlSpecializationCodes.has(code)) {
    if (code !== "MMB801") return null;
    return { ...course, code: "MMB8XX", name: "UZMANLIK ALAN DERSİ", ects: 5, instructor: "Öğrencinin Danışmanı" };
  }
  if (makineYlSeminarCodes.has(code)) {
    if (code !== "MMB806") return null;
    return { ...course, code: "MMB806", name: "SEMİNER", ects: 6, instructor: "Öğrencinin Danışmanı" };
  }
  if (makineYlThesisCodes.has(code)) {
    if (code !== "MMB807") return null;
    return { ...course, code: "MMB81X", name: "TEZ ÇALIŞMASI", ects: 24, instructor: "Öğrencinin Danışmanı" };
  }
  return course;
}

function isAileTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" &&
    normalizeScope(course.department || "") === normalizeScope("Aile Danışmanlığı ve Eğitimi ABD") &&
    normalizeScope(course.programName || course.program_name || "") === normalizeScope("Aile Danışmanlığı ve Eğitimi");
}

function normalizeAileTezliCourse(course = {}) {
  if (!isAileTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (aileYlAdvisoryCodes.has(code)) {
    if (code !== "DAN801") return null;
    return { ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1, instructor: "Öğrencinin Danışmanı" };
  }
  if (aileYlSpecializationCodes.has(code)) {
    if (code !== "ADE801") return null;
    return { ...course, code: "ADE8XX", name: "UZMANLIK ALAN DERSİ", ects: 5, instructor: "Öğrencinin Danışmanı" };
  }
  if (aileYlSeminarCodes.has(code)) {
    if (code !== "ADE806") return null;
    return { ...course, code: "ADE806", name: "SEMİNER", ects: 6, instructor: "Öğrencinin Danışmanı" };
  }
  if (aileYlThesisCodes.has(code)) {
    if (code !== "ADE807") return null;
    return { ...course, code: "ADE81X", name: "TEZ ÇALIŞMASI", ects: 24, instructor: "Öğrencinin Danışmanı" };
  }
  return course;
}

function isArkeolojiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" &&
    normalizeScope(course.department || "") === normalizeScope("Arkeoloji ABD") &&
    normalizeScope(course.programName || course.program_name || "") === normalizeScope("Arkeoloji");
}

function normalizeArkeolojiTezliCourse(course = {}) {
  if (!isArkeolojiTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (arkeolojiYlAdvisoryCodes.has(code)) {
    if (code !== "DAN801") return null;
    return { ...course, code: "DAN8XX", name: "DANIŞMANLIK", ects: 1, instructor: "Öğrencinin Danışmanı" };
  }
  if (arkeolojiYlSpecializationCodes.has(code)) {
    if (code !== "ARK801") return null;
    return { ...course, code: "ARK8XX", name: "UZMANLIK ALAN DERSİ", ects: 5, instructor: "Öğrencinin Danışmanı" };
  }
  if (arkeolojiYlSeminarCodes.has(code)) {
    if (code !== "ARK806") return null;
    return { ...course, code: "ARK806", name: "YÜKSEK LİSANS SEMİNER", ects: 6, instructor: "Öğrencinin Danışmanı" };
  }
  if (arkeolojiYlThesisCodes.has(code)) {
    if (code !== "ARK807") return null;
    return { ...course, code: "ARK81X", name: "TEZ ÇALIŞMASI", ects: 24, instructor: "Öğrencinin Danışmanı" };
  }
  return course;
}

function isBataryaTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" &&
    normalizeScope(course.department || "") === normalizeScope("Batarya Sistemleri ve Hidrojen Teknolojileri ABD") &&
    normalizeScope(course.programName || course.program_name || "") === normalizeScope("Batarya Sistemleri ve Hidrojen Teknolojileri");
}

function normalizeBataryaTezliCourse(course = {}) {
  if (!isBataryaTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (bataryaYlAdvisoryCodes.has(code)) return code === "DAN801" ? { ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1, instructor:"Öğrencinin Danışmanı" } : null;
  if (bataryaYlSpecializationCodes.has(code)) return code === "BHT801" ? { ...course, code:"BHT8XX", name:"UZMANLIK ALAN DERSİ", ects:5, instructor:"Öğrencinin Danışmanı" } : null;
  if (bataryaYlSeminarCodes.has(code)) return code === "BHT806" ? { ...course, code:"BHT806", name:"SEMİNER", ects:6, instructor:"Öğrencinin Danışmanı" } : null;
  if (bataryaYlResearchCodes.has(code)) return code === "BHT831" ? { ...course, code:"BHT831", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (bataryaYlThesisCodes.has(code)) return code === "BHT807" ? { ...course, code:"BHT81X", name:"TEZ ÇALIŞMASI", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  return course;
}

function isBedenTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Beden Eğitimi ve Spor ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Beden Eğitimi ve Spor");
}

function normalizeBedenTezliCourse(course = {}) {
  if (!isBedenTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (bedenYlAdvisoryCodes.has(code)) return code === "DAN801" ? { ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1, instructor:"Öğrencinin Danışmanı" } : null;
  if (bedenYlSpecializationCodes.has(code)) return code === "BES801" ? { ...course, code:"BES8XX", name:"UZMANLIK ALAN DERSİ", ects:5, instructor:"Öğrencinin Danışmanı" } : null;
  if (bedenYlSeminarCodes.has(code)) return code === "BES806" ? { ...course, code:"BES806", name:"SEMİNER", ects:6, instructor:"Öğrencinin Danışmanı" } : null;
  if (bedenYlResearchCodes.has(code)) return code === "BEF801" ? { ...course, code:"BEF801", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (bedenYlThesisCodes.has(code)) return code === "BES807" ? { ...course, code:"BES81X", name:"TEZ ÇALIŞMASI", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  return course;
}

function isBiyolojiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Biyoloji ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Biyoloji");
}

function normalizeBiyolojiTezliCourse(course = {}) {
  if (!isBiyolojiTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (biyolojiYlAdvisoryCodes.has(code)) return code === "DAN801" ? { ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiYlSpecializationCodes.has(code)) return code === "BİO801" ? { ...course, code:"BİO8XX", name:"UZMANLIK ALAN DERSİ", ects:5, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiYlSeminarCodes.has(code)) return code === "BİO806" ? { ...course, code:"BİO806", name:"SEMİNER", ects:6, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiYlResearchCodes.has(code)) return code === "BİO809" ? { ...course, code:"BİO809", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (biyolojiYlThesisCodes.has(code)) return code === "BİO807" ? { ...course, code:"BİO81X", name:"TEZ ÇALIŞMASI", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  return course;
}

function isBiyolojiDoktoraCourse(course = {}) {
  return levelKey(course.level) === "doktora" && normalizeScope(course.department || "") === normalizeScope("Biyoloji ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Biyoloji");
}

function normalizeBiyolojiDoktoraCourse(course = {}) {
  if (!isBiyolojiDoktoraCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (biyolojiDrAdvisoryCodes.has(code)) return code === "DAN901" ? { ...course, code:"DAN9XX", name:"DANIŞMANLIK", ects:1, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiDrSpecializationCodes.has(code)) return code === "BİO901" ? { ...course, code:"BİO9XX", name:"UZMANLIK ALAN DERSİ", ects:5, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiDrSeminarCodes.has(code)) return code === "BİO909" ? { ...course, code:"BİO909", name:"SEMİNER", ects:6, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiDrQualifyingCodes.has(code)) return code === "BİO917" ? { ...course, code:"BİO917", name:"DOKTORA YETERLİK", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  if (biyolojiDrThesisCodes.has(code)) return code === "BİO912" ? { ...course, code:"BİO91X", name:"TEZ ÇALIŞMASI", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  return course;
}

function isEbelikTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Ebelik ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Ebelik");
}

function normalizeEbelikTezliCourse(course = {}) {
  if (!isEbelikTezliCourse(course)) return course;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  if (ebelikYlAdvisoryCodes.has(code)) return code === "DAN801" ? { ...course, code:"DAN8XX", name:"DANIŞMANLIK", ects:1, instructor:"Öğrencinin Danışmanı" } : null;
  if (ebelikYlSpecializationCodes.has(code)) return code === "EBE801" ? { ...course, code:"EBE8XX", name:"UZMANLIK ALAN DERSİ", ects:5, instructor:"Öğrencinin Danışmanı" } : null;
  if (ebelikYlSeminarCodes.has(code)) return code === "EBE806" ? { ...course, code:"EBE806", name:"SEMİNER", ects:6, instructor:"Öğrencinin Danışmanı" } : null;
  if (ebelikYlResearchCodes.has(code)) return code === "EBE809" ? { ...course, code:"EBE809", name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ", ects:6 } : null;
  if (ebelikYlThesisCodes.has(code)) return code === "EBE807" ? { ...course, code:"EBE81X", name:"TEZ ÇALIŞMASI", ects:24, instructor:"Öğrencinin Danışmanı" } : null;
  return course;
}

function isEkoturizmTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Ekoturizm Rehberliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Ekoturizm Rehberliği");
}

function normalizeEkoturizmTezliCourse(course = {}) {
  if (!isEkoturizmTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(code==="EKOTURİZM SEÇ-2")return null;
  if(ekoturizmYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(ekoturizmYlSpecializationCodes.has(code))return code==="ETR801"?{...course,code:"ETR8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(ekoturizmYlSeminarCodes.has(code))return code==="ETR806"?{...course,code:"ETR806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(ekoturizmYlResearchCodes.has(code))return code==="ETR855"?{...course,code:"ETR855",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(ekoturizmYlThesisCodes.has(code))return code==="ETR807"?{...course,code:"ETR81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isElektrikTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Elektrik Elektronik Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Elektrik Elektronik Mühendisliği");
}

function normalizeElektrikTezliCourse(course = {}) {
  if (!isElektrikTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(elektrikYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(elektrikYlSpecializationCodes.has(code))return code==="EEM801"?{...course,code:"EEM8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(elektrikYlSeminarCodes.has(code))return code==="EEM806"?{...course,code:"EEM806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(elektrikYlThesisCodes.has(code))return code==="EEM807"?{...course,code:"EEM81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isEnerjiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Enerji Sistemleri Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Enerji Sistemleri Mühendisliği");
}

function normalizeEnerjiTezliCourse(course = {}) {
  if (!isEnerjiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(enerjiYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiYlSpecializationCodes.has(code))return code==="EMB801"?{...course,code:"EMB8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiYlSeminarCodes.has(code))return code==="EMB806"?{...course,code:"EMB806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiYlResearchCodes.has(code))return code==="EMB829"?{...course,code:"EMB829",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(enerjiYlThesisCodes.has(code))return code==="EMB807"?{...course,code:"EMB81X",name:"YÜKSEK LİSANS TEZİ",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function normalizeEnerjiDoktoraCourse(course = {}) {
  const applies = levelKey(course.level) === "doktora" && normalizeScope(course.department || "") === normalizeScope("Enerji Sistemleri Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Enerji Sistemleri Mühendisliği");
  if (!applies) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(enerjiDrAdvisoryCodes.has(code))return code==="DAN901"?{...course,code:"DAN9XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiDrSpecializationCodes.has(code))return code==="EMB901"?{...course,code:"EMB9XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiDrSeminarCodes.has(code))return code==="EMB909"?{...course,code:"EMB909",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiDrQualifyingCodes.has(code))return code==="EMB917"?{...course,code:"EMB917",name:"DOKTORA YETERLİK",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  if(enerjiDrThesisCodes.has(code))return code==="EMB912"?{...course,code:"EMB91X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isFelsefeDinTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Felsefe ve Din Bilimleri ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Felsefe ve Din Bilimleri");
}

function normalizeFelsefeDinTezliCourse(course = {}) {
  if (!isFelsefeDinTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(felsefeDinYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(felsefeDinYlSpecializationCodes.has(code))return code==="FDB801"?{...course,code:"FDB8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(felsefeDinYlSeminarCodes.has(code))return code==="FDB806"?{...course,code:"FDB806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(felsefeDinYlResearchCodes.has(code))return code==="BES801"?{...course,code:"BES801",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(felsefeDinYlThesisCodes.has(code))return code==="FDB807"?{...course,code:"FDB81X",name:"YÜKSEK LİSANS TEZİ",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isFizikTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Fizik ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Fizik");
}

function normalizeFizikTezliCourse(course = {}) {
  if (!isFizikTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(fizikYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikYlSpecializationCodes.has(code))return code==="FZK801"?{...course,code:"FZK8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikYlSeminarCodes.has(code))return code==="FZK806"?{...course,code:"FZK806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikYlResearchCodes.has(code))return code==="FZK899"?{...course,code:"FZK899",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(fizikYlThesisCodes.has(code))return code==="FZK807"?{...course,code:"FZK81X",name:"YÜKSEK LİSANS TEZİ",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function normalizeFizikDoktoraCourse(course = {}) {
  const applies = levelKey(course.level) === "doktora" && normalizeScope(course.department || "") === normalizeScope("Fizik ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Fizik");
  if (!applies) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(fizikDrAdvisoryCodes.has(code))return code==="DAN901"?{...course,code:"DAN9XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikDrSpecializationCodes.has(code))return code==="FZK901"?{...course,code:"FZK9XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikDrSeminarCodes.has(code))return code==="FZK909"?{...course,code:"FZK909",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikDrQualifyingCodes.has(code))return code==="FZK917"?{...course,code:"FZK917",name:"DOKTORA YETERLİK",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  if(fizikDrThesisCodes.has(code))return code==="FZK912"?{...course,code:"FZK91X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isGastronomiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Gastronomi ve Mutfak Sanatları ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Gastronomi ve Mutfak Sanatları");
}

function normalizeGastronomiTezliCourse(course = {}) {
  if (!isGastronomiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(gastronomiYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(gastronomiYlSpecializationCodes.has(code))return code==="GMS801"?{...course,code:"GMS8XX",name:"UZMANLIK ALAN DERSİ",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(gastronomiYlSeminarCodes.has(code))return code==="GMS805"?{...course,code:"GMS806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(gastronomiYlResearchCodes.has(code))return code==="GMS851"?{...course,code:"GMS85X",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(gastronomiYlThesisCodes.has(code))return code==="GMS807"?{...course,code:"GMS81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isGidaMuhendisligiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Gıda Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Gıda Mühendisliği");
}

function normalizeGidaMuhendisligiTezliCourse(course = {}) {
  if (!isGidaMuhendisligiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(gidaMuhendisligiYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaMuhendisligiYlSpecializationCodes.has(code))return code==="GMB801"?{...course,code:"GMB8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaMuhendisligiYlSeminarCodes.has(code))return code==="GMB805"?{...course,code:"GMB806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaMuhendisligiYlResearchCodes.has(code))return code==="GMB853"?{...course,code:"GMB85X",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(gidaMuhendisligiYlThesisCodes.has(code))return code==="GMB807"?{...course,code:"GMB81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isGidaTeknolojisiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Gıda Teknolojisi ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Gıda Teknolojisi");
}

function normalizeGidaTeknolojisiTezliCourse(course = {}) {
  if (!isGidaTeknolojisiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(gidaTeknolojisiYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaTeknolojisiYlSpecializationCodes.has(code))return code==="GTB801"?{...course,code:"GTB8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaTeknolojisiYlSeminarCodes.has(code))return code==="GTB805"?{...course,code:"GTB806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(gidaTeknolojisiYlResearchCodes.has(code))return code==="GTB829"?{...course,code:"GTB82X",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(gidaTeknolojisiYlThesisCodes.has(code))return code==="GTB807"?{...course,code:"GTB81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isHaritaTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Harita Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Harita Mühendisliği");
}

function normalizeHaritaTezliCourse(course = {}) {
  if (!isHaritaTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(haritaYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(haritaYlSpecializationCodes.has(code))return code==="HRM801"?{...course,code:"HRM8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(haritaYlSeminarCodes.has(code))return code==="HRM805"?{...course,code:"HRM806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(haritaYlThesisCodes.has(code))return code==="HRM807"?{...course,code:"HRM81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isIcHastaliklariTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Hemşirelik ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("İç Hastalıkları Hemşireliği");
}

function normalizeIcHastaliklariTezliCourse(course = {}) {
  if (!isIcHastaliklariTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(icHastaliklariYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(icHastaliklariYlSpecializationCodes.has(code))return code==="İHH801"?{...course,code:"İHH8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(icHastaliklariYlSeminarCodes.has(code))return code==="İHH805"?{...course,code:"İHH806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(icHastaliklariYlResearchCodes.has(code))return code==="İHH809"?{...course,code:"İHH809",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(icHastaliklariYlThesisCodes.has(code))return code==="İHH807"?{...course,code:"İHH81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isIktisatTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("İktisat ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("İktisat");
}

function normalizeIktisatTezliCourse(course = {}) {
  if (!isIktisatTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(iktisatYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(iktisatYlSpecializationCodes.has(code))return code==="İKT801"?{...course,code:"İKT8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(iktisatYlSeminarCodes.has(code))return code==="İKT805"?{...course,code:"İKT806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(iktisatYlResearchCodes.has(code))return code==="İKT897"?{...course,code:"İKT897",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(iktisatYlThesisCodes.has(code))return code==="İKT807"?{...course,code:"İKT81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isInsaatTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("İnşaat Mühendisliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("İnşaat Mühendisliği");
}

function normalizeInsaatTezliCourse(course = {}) {
  if (!isInsaatTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(insaatYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(insaatYlSpecializationCodes.has(code))return code==="İNŞ801"?{...course,code:"İNŞ8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(insaatYlSeminarCodes.has(code))return code==="İNŞ805"?{...course,code:"İNŞ806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(insaatYlResearchCodes.has(code))return code==="İNŞ897"?{...course,code:"İNŞ897",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(insaatYlThesisCodes.has(code))return code==="İNŞ807"?{...course,code:"İNŞ81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isIsletmeTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("İşletme") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("İşletme");
}

function normalizeIsletmeTezliCourse(course = {}) {
  if (!isIsletmeTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(isletmeYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(isletmeYlSpecializationCodes.has(code))return code==="ISL801"?{...course,code:"ISL8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(isletmeYlSeminarCodes.has(code))return code==="ISL805"?{...course,code:"ISL806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(isletmeYlResearchCodes.has(code))return code==="ISL885"?{...course,code:"ISL885",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(isletmeYlThesisCodes.has(code))return code==="ISL807"?{...course,code:"ISL81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isKimyaTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Kimya ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Kimya");
}

function normalizeKimyaTezliCourse(course = {}) {
  if (!isKimyaTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(kimyaYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(kimyaYlSpecializationCodes.has(code))return code==="KİM801"?{...course,code:"KİM8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(kimyaYlSeminarCodes.has(code))return code==="KİM805"?{...course,code:"KİM806",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(kimyaYlResearchCodes.has(code))return code==="KİM839"?{...course,code:"KİM839",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(kimyaYlThesisCodes.has(code))return code==="KİM807"?{...course,code:"KİM81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isMatematikTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Matematik ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Matematik");
}

function normalizeMatematikTezliCourse(course = {}) {
  if (!isMatematikTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(matematikYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(matematikYlSpecializationCodes.has(code))return code==="MAT801"?{...course,code:"MAT8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(matematikYlSeminarCodes.has(code))return code==="MAT805"?{...course,code:"MAT805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(matematikYlResearchCodes.has(code))return code==="MAT863"?{...course,code:"MAT863",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(matematikYlThesisCodes.has(code))return code==="MAT807"?{...course,code:"MAT81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isMuhasebeFinansmanTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Muhasebe ve Finansman") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Muhasebe ve Finansman");
}

function normalizeMuhasebeFinansmanTezliCourse(course = {}) {
  if (!isMuhasebeFinansmanTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(muhasebeFinansmanYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(muhasebeFinansmanYlSpecializationCodes.has(code))return code==="MUF801"?{...course,code:"MUF8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(muhasebeFinansmanYlSeminarCodes.has(code))return code==="MUF805"?{...course,code:"MUF805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(muhasebeFinansmanYlResearchCodes.has(code))return code==="MUF849"?{...course,code:"MUF849",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(muhasebeFinansmanYlThesisCodes.has(code))return code==="MUF807"?{...course,code:"MUF81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isOrganikTarimTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Organik Tarım İşletmeciliği ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Organik Tarım İşletmeciliği");
}

function normalizeOrganikTarimTezliCourse(course = {}) {
  if (!isOrganikTarimTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(organikTarimYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(organikTarimYlSpecializationCodes.has(code))return code==="OTİ801"?{...course,code:"OTİ8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(organikTarimYlSeminarCodes.has(code))return code==="OTİ805"?{...course,code:"OTİ805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(organikTarimYlResearchCodes.has(code))return code==="OTİ841"?{...course,code:"OTİ841",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(organikTarimYlThesisCodes.has(code))return code==="OTİ807"?{...course,code:"OTİ81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isResimTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Resim ASD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Resim");
}

function normalizeResimTezliCourse(course = {}) {
  if (!isResimTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(resimYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(resimYlSpecializationCodes.has(code))return code==="RES801"?{...course,code:"RES8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(resimYlSeminarCodes.has(code))return code==="RES805"?{...course,code:"RES805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(resimYlResearchCodes.has(code))return code==="RES881"?{...course,code:"RES881",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(resimYlThesisCodes.has(code))return code==="RES807"?{...course,code:"RES81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isSiyasetKamuYonetimiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Siyaset Bilimi ve Kamu Yönetimi ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Siyaset Bilimi ve Kamu Yönetimi");
}

function normalizeSiyasetKamuYonetimiTezliCourse(course = {}) {
  if (!isSiyasetKamuYonetimiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(siyasetKamuYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(siyasetKamuYlSpecializationCodes.has(code))return code==="SKY801"?{...course,code:"SKY8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(siyasetKamuYlSeminarCodes.has(code))return code==="SKY805"?{...course,code:"SKY805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(siyasetKamuYlResearchCodes.has(code))return code==="SKY899"?{...course,code:"SKY899",name:"BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ",ects:6}:null;
  if(siyasetKamuYlThesisCodes.has(code))return code==="SKY807"?{...course,code:"SKY81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isTarihTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Tarih ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Tarih");
}

function normalizeTarihTezliCourse(course = {}) {
  if (!isTarihTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(tarihYlResearchCodes.has(code))return code==="BES801"?{...course,code:"BES801",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(tarihYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(tarihYlSpecializationCodes.has(code))return code==="TTZ801"?{...course,code:"TTZ8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(tarihYlSeminarCodes.has(code))return code==="TTZ805"?{...course,code:"TTZ805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(tarihYlThesisCodes.has(code))return code==="TTZ807"?{...course,code:"TTZ81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isTemelIslamTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Temel İslam Bilimleri ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Temel İslam Bilimleri");
}

function normalizeTemelIslamTezliCourse(course = {}) {
  if (!isTemelIslamTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(temelIslamYlResearchCodes.has(code))return {...course,code:"TİB879",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6};
  if(temelIslamYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(temelIslamYlSpecializationCodes.has(code))return code==="TİB801"?{...course,code:"TİB8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(temelIslamYlSeminarCodes.has(code))return code==="TİB805"?{...course,code:"TİB805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(temelIslamYlThesisCodes.has(code))return code==="TİB807"?{...course,code:"TİB81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isTurkDiliEdebiyatiTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Türk Dili ve Edebiyatı ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Türk Dili ve Edebiyatı");
}

function normalizeTurkDiliEdebiyatiTezliCourse(course = {}) {
  if (!isTurkDiliEdebiyatiTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(tdeYlResearchCodes.has(code))return {...course,code:"BES801",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6};
  if(tdeYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(tdeYlSpecializationCodes.has(code))return code==="TDE801"?{...course,code:"TDE8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(tdeYlSeminarCodes.has(code))return code==="TDE805"?{...course,code:"TDE805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(tdeYlThesisCodes.has(code))return code==="TDE807"?{...course,code:"TDE81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isYbsTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Yönetim Bilişim Sistemleri ABD") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Yönetim Bilişim Sistemleri");
}

function normalizeYbsTezliCourse(course = {}) {
  if (!isYbsTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(ybsYlResearchCodes.has(code))return code==="BES801"?{...course,code:"BES801",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(ybsYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(ybsYlSpecializationCodes.has(code))return code==="YBS801"?{...course,code:"YBS8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(ybsYlSeminarCodes.has(code))return code==="YBS805"?{...course,code:"YBS805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(ybsYlThesisCodes.has(code))return code==="YBS807"?{...course,code:"YBS81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isYonetimOrganizasyonTezliCourse(course = {}) {
  return levelKey(course.level) === "tezli yl" && normalizeScope(course.department || "") === normalizeScope("Yönetim Organizasyon") && normalizeScope(course.programName || course.program_name || "") === normalizeScope("Yönetim Organizasyon");
}

function normalizeYonetimOrganizasyonTezliCourse(course = {}) {
  if (!isYonetimOrganizasyonTezliCourse(course)) return course;
  const code=repairText(course.code||"").trim().toLocaleUpperCase("tr-TR");
  if(yonetimOrganizasyonYlResearchCodes.has(code))return code==="YON841"?{...course,code:"YON841",name:"BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",ects:6}:null;
  if(yonetimOrganizasyonYlAdvisoryCodes.has(code))return code==="DAN801"?{...course,code:"DAN8XX",name:"DANIŞMANLIK",ects:1,instructor:"Öğrencinin Danışmanı"}:null;
  if(yonetimOrganizasyonYlSpecializationCodes.has(code))return code==="YON801"?{...course,code:"YON8XX",name:"UZMANLIK ALAN DERSİ",ects:5,instructor:"Öğrencinin Danışmanı"}:null;
  if(yonetimOrganizasyonYlSeminarCodes.has(code))return code==="YON805"?{...course,code:"YON805",name:"SEMİNER",ects:6,instructor:"Öğrencinin Danışmanı"}:null;
  if(yonetimOrganizasyonYlThesisCodes.has(code))return code==="YON807"?{...course,code:"YON81X",name:"TEZ ÇALIŞMASI",ects:24,instructor:"Öğrencinin Danışmanı"}:null;
  return course;
}

function isYbsDoctorateCourse(course = {}) {
  if (levelKey(course.level) !== "doktora") return false;
  const code = repairText(course.code || "").trim().toLocaleUpperCase("tr-TR");
  const programName = repairText(course.programName || course.program_name || "");
  return code.startsWith("YBS") ||
    (code === "DAN902" && programName.toLocaleLowerCase("tr-TR").includes("yönetim bilişim"));
}

function normalizeSeedCourse(course = {}) {
  const repaired = repairObject(course);
  const makineCourse = normalizeMakineTezliCourse(repaired);
  if (!makineCourse) return null;
  if (makineCourse !== repaired) return makineCourse;
  const aileCourse = normalizeAileTezliCourse(repaired);
  if (!aileCourse) return null;
  if (aileCourse !== repaired) return aileCourse;
  const arkeolojiCourse = normalizeArkeolojiTezliCourse(repaired);
  if (!arkeolojiCourse) return null;
  if (arkeolojiCourse !== repaired) return arkeolojiCourse;
  const bataryaCourse = normalizeBataryaTezliCourse(repaired);
  if (!bataryaCourse) return null;
  if (bataryaCourse !== repaired) return bataryaCourse;
  const bedenCourse = normalizeBedenTezliCourse(repaired);
  if (!bedenCourse) return null;
  if (bedenCourse !== repaired) return bedenCourse;
  const biyolojiCourse = normalizeBiyolojiTezliCourse(repaired);
  if (!biyolojiCourse) return null;
  if (biyolojiCourse !== repaired) return biyolojiCourse;
  const biyolojiDoktoraCourse = normalizeBiyolojiDoktoraCourse(repaired);
  if (!biyolojiDoktoraCourse) return null;
  if (biyolojiDoktoraCourse !== repaired) return biyolojiDoktoraCourse;
  const ebelikCourse = normalizeEbelikTezliCourse(repaired);
  if (!ebelikCourse) return null;
  if (ebelikCourse !== repaired) return ebelikCourse;
  const ekoturizmCourse = normalizeEkoturizmTezliCourse(repaired);
  if (!ekoturizmCourse) return null;
  if (ekoturizmCourse !== repaired) return ekoturizmCourse;
  const elektrikCourse = normalizeElektrikTezliCourse(repaired);
  if (!elektrikCourse) return null;
  if (elektrikCourse !== repaired) return elektrikCourse;
  const enerjiCourse = normalizeEnerjiTezliCourse(repaired);
  if (!enerjiCourse) return null;
  if (enerjiCourse !== repaired) return enerjiCourse;
  const enerjiDoktoraCourse = normalizeEnerjiDoktoraCourse(repaired);
  if (!enerjiDoktoraCourse) return null;
  if (enerjiDoktoraCourse !== repaired) return enerjiDoktoraCourse;
  const felsefeDinCourse = normalizeFelsefeDinTezliCourse(repaired);
  if (!felsefeDinCourse) return null;
  if (felsefeDinCourse !== repaired) return felsefeDinCourse;
  const fizikCourse = normalizeFizikTezliCourse(repaired);
  if (!fizikCourse) return null;
  if (fizikCourse !== repaired) return fizikCourse;
  const fizikDoktoraCourse = normalizeFizikDoktoraCourse(repaired);
  if (!fizikDoktoraCourse) return null;
  if (fizikDoktoraCourse !== repaired) return fizikDoktoraCourse;
  const gastronomiCourse = normalizeGastronomiTezliCourse(repaired);
  if (!gastronomiCourse) return null;
  if (gastronomiCourse !== repaired) return gastronomiCourse;
  const gidaMuhendisligiCourse = normalizeGidaMuhendisligiTezliCourse(repaired);
  if (!gidaMuhendisligiCourse) return null;
  if (gidaMuhendisligiCourse !== repaired) return gidaMuhendisligiCourse;
  const gidaTeknolojisiCourse = normalizeGidaTeknolojisiTezliCourse(repaired);
  if (!gidaTeknolojisiCourse) return null;
  if (gidaTeknolojisiCourse !== repaired) return gidaTeknolojisiCourse;
  const haritaCourse = normalizeHaritaTezliCourse(repaired);
  if (!haritaCourse) return null;
  if (haritaCourse !== repaired) return haritaCourse;
  const icHastaliklariCourse = normalizeIcHastaliklariTezliCourse(repaired);
  if (!icHastaliklariCourse) return null;
  if (icHastaliklariCourse !== repaired) return icHastaliklariCourse;
  const iktisatCourse = normalizeIktisatTezliCourse(repaired);
  if (!iktisatCourse) return null;
  if (iktisatCourse !== repaired) return iktisatCourse;
  const insaatCourse = normalizeInsaatTezliCourse(repaired);
  if (!insaatCourse) return null;
  if (insaatCourse !== repaired) return insaatCourse;
  const isletmeCourse = normalizeIsletmeTezliCourse(repaired);
  if (!isletmeCourse) return null;
  if (isletmeCourse !== repaired) return isletmeCourse;
  const kimyaCourse = normalizeKimyaTezliCourse(repaired);
  if (!kimyaCourse) return null;
  if (kimyaCourse !== repaired) return kimyaCourse;
  const matematikCourse = normalizeMatematikTezliCourse(repaired);
  if (!matematikCourse) return null;
  if (matematikCourse !== repaired) return matematikCourse;
  const muhasebeFinansmanCourse = normalizeMuhasebeFinansmanTezliCourse(repaired);
  if (!muhasebeFinansmanCourse) return null;
  if (muhasebeFinansmanCourse !== repaired) return muhasebeFinansmanCourse;
  const organikTarimCourse = normalizeOrganikTarimTezliCourse(repaired);
  if (!organikTarimCourse) return null;
  if (organikTarimCourse !== repaired) return organikTarimCourse;
  const resimCourse = normalizeResimTezliCourse(repaired);
  if (!resimCourse) return null;
  if (resimCourse !== repaired) return resimCourse;
  const siyasetKamuCourse = normalizeSiyasetKamuYonetimiTezliCourse(repaired);
  if (!siyasetKamuCourse) return null;
  if (siyasetKamuCourse !== repaired) return siyasetKamuCourse;
  const tarihCourse = normalizeTarihTezliCourse(repaired);
  if (!tarihCourse) return null;
  if (tarihCourse !== repaired) return tarihCourse;
  const temelIslamCourse = normalizeTemelIslamTezliCourse(repaired);
  if (!temelIslamCourse) return null;
  if (temelIslamCourse !== repaired) return temelIslamCourse;
  const turkDiliEdebiyatiCourse = normalizeTurkDiliEdebiyatiTezliCourse(repaired);
  if (!turkDiliEdebiyatiCourse) return null;
  if (turkDiliEdebiyatiCourse !== repaired) return turkDiliEdebiyatiCourse;
  const ybsTezliCourse = normalizeYbsTezliCourse(repaired);
  if (!ybsTezliCourse) return null;
  if (ybsTezliCourse !== repaired) return ybsTezliCourse;
  const yonetimOrganizasyonCourse = normalizeYonetimOrganizasyonTezliCourse(repaired);
  if (!yonetimOrganizasyonCourse) return null;
  if (yonetimOrganizasyonCourse !== repaired) return yonetimOrganizasyonCourse;
  if (!isYbsDoctorateCourse(repaired)) return repaired;
  const code = repairText(repaired.code || "").trim().toLocaleUpperCase("tr-TR");
  if (code === "YBS925") return { ...repaired, instructor: "Doç. Dr. Emre YAKUT", status: "İncelemede" };
  if (ybsSpecializationCodes.has(code)) {
    if (code !== "YBS901") return null;
    return { ...repaired, code: "YBS9XX", name: "UZMANLIK ALAN DERSİ", ects: 5, instructor: "Öğrencinin Danışmanı" };
  }
  if (ybsThesisCodes.has(code)) {
    if (code !== "YBS911") return null;
    return { ...repaired, code: "YBS91X", name: "DOKTORA TEZİ", ects: 24, instructor: "Öğrencinin Danışmanı" };
  }
  if (code === "DAN902") return { ...repaired, ects: 1, instructor: "Öğrencinin Danışmanı" };
  if (code === "YBS909") return null;
  if (code === "YBS910") return { ...repaired, ects: 6, instructor: "Öğrencinin Danışmanı" };
  if (code === "YBS917") return { ...repaired, ects: 6, instructor: "Öğrencinin Danışmanı" };
  if (code === "YBS918") return null;
  return repaired;
}

function normalizeSeedCourses(courses = []) {
  const byKey = new Map();
  for (const course of courses) {
    const normalized = normalizeSeedCourse(course);
    if (!normalized) continue;
    const key = [
      normalizeScope(normalized.department || ""),
      normalizeScope(normalized.programName || normalized.program_name || ""),
      levelKey(normalized.level),
      repairText(normalized.code || "").trim().toLocaleUpperCase("tr-TR"),
    ].join("|");
    if (!byKey.has(key)) byKey.set(key, normalized);
  }
  return [...byKey.values()];
}

function normalizeScope(value = "") {
  return repairText(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/\b(abd|asd|anabilim dalı|anasanat dalı)\b/gu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePerson(value = "") {
  return repairText(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/\b(prof|doç|doc|dr|öğr|ogr|üyesi|uyesi|gör|gor)\b\.?/gu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDepartmentPoolCourseRecord(course = {}) {
  const name = repairText(course.name || "").toLocaleUpperCase("tr-TR");
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "BHT831") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "BEF801") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "BİO809") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "EEM885") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "EMB829") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "FZK899") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "GMB85X") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "GTB82X") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "HRM809") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "İHH809") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "İKT897") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "İNŞ897") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "ISL885") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "KİM839") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "MAT863") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "MUF849") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "OTİ841") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "RES881") return true;
  if (repairText(course.code || "").toLocaleUpperCase("tr-TR") === "SKY899") return true;
  if (normalizeScope(course.department || "") === normalizeScope("Tarih ABD") && repairText(course.code || "").toLocaleUpperCase("tr-TR") === "BES801") return true;
  if (normalizeScope(course.department || "") === normalizeScope("Temel İslam Bilimleri ABD") && repairText(course.code || "").toLocaleUpperCase("tr-TR") === "TİB879") return true;
  if (normalizeScope(course.department || "") === normalizeScope("Türk Dili ve Edebiyatı ABD") && repairText(course.code || "").toLocaleUpperCase("tr-TR") === "BES801") return true;
  if (name.includes("BİLİMSEL ARAŞTIRMA")) return false;
  return /^(?:DANIŞMANLIK|UZMANLIK ALAN DERSİ|(?:YÜKSEK LİSANS |DOKTORA )?SEMİNER|DOKTORA YETERLİK|DOKTORA TEZİ|TEZ ÇALIŞMASI)$/u.test(name);
}

function courseRowsForIdentity({ code = "", department = "", programName = "", level = "" }) {
  const candidates = courseCodeCandidates(code);
  if (!candidates.length) return [];
  const placeholders = candidates.map(() => "?").join(", ");
  const rows = db.prepare(`
    SELECT * FROM courses
    WHERE code IN (${placeholders})
    ORDER BY updated_at DESC, id DESC
  `).all(...candidates);
  const departmentScope = normalizeScope(department);
  const programScope = normalizeScope(programName);
  return rows.filter((row) =>
    (!level || levelKey(row.level) === levelKey(level)) &&
    (!departmentScope || normalizeScope(row.department) === departmentScope) &&
    (!programScope || normalizeScope(row.program_name) === programScope)
  );
}

function canEditCoursePackage(session, body, rows) {
  if (session.role === "admin") return true;
  const sessionDepartment = normalizeScope(session.department || "");
  const requestedDepartment = normalizeScope(body.department || "");
  const departmentMatches = Boolean(sessionDepartment && requestedDepartment && sessionDepartment === requestedDepartment);
  const sessionPerson = normalizePerson(session.name || "");
  const trustedInstructorOverrides = { YBS925: "Doç. Dr. Emre YAKUT" };
  const assignedToUser = rows.some((row) => {
    const instructor = normalizePerson(row.instructor || trustedInstructorOverrides[row.code] || "");
    return Boolean(sessionPerson && instructor && (sessionPerson === instructor || sessionPerson.includes(instructor) || instructor.includes(sessionPerson)));
  });

  if (session.role === "akademisyen") return assignedToUser;
  if (session.role === "abd_asd_baskani") {
    const trustedMergedPoolCodes = new Set(["YBS9XX", "YBS91X", "DAN8XX", "MMB8XX", "MMB806", "MMB81X", "ADE8XX", "ADE806", "ADE81X", "ARK8XX", "ARK806", "ARK81X", "BHT8XX", "BHT806", "BHT831", "BHT81X", "BES8XX", "BES806", "BEF801", "BES81X", "BİO8XX", "BİO806", "BİO809", "BİO81X", "EBE8XX", "EBE806", "EBE809", "EBE81X", "ETR8XX", "ETR806", "ETR855", "ETR81X", "EEM8XX", "EEM806", "EEM885", "EEM81X", "EMB8XX", "EMB806", "EMB829", "EMB81X", "FDB8XX", "FDB806", "FDB81X", "FZK8XX", "FZK806", "FZK899", "FZK81X", "GMS8XX", "GMS806", "GMS85X", "GMS81X", "GMB8XX", "GMB806", "GMB85X", "GMB81X", "GTB8XX", "GTB806", "GTB82X", "GTB81X", "HRM8XX", "HRM806", "HRM809", "HRM81X", "İHH8XX", "İHH806", "İHH809", "İHH81X", "İKT8XX", "İKT806", "İKT897", "İKT81X", "İNŞ8XX", "İNŞ806", "İNŞ897", "İNŞ81X", "ISL8XX", "ISL806", "ISL885", "ISL81X", "KİM8XX", "KİM806", "KİM839", "KİM81X", "MAT8XX", "MAT805", "MAT863", "MAT81X", "MUF8XX", "MUF805", "MUF849", "MUF81X", "OTİ8XX", "OTİ805", "OTİ841", "OTİ81X", "RES8XX", "RES805", "RES881", "RES81X", "SKY8XX", "SKY805", "SKY899", "SKY81X", "TTZ8XX", "TTZ805", "BES801", "TTZ81X", "TİB8XX", "TİB805", "TİB879", "TİB81X"]);
    for (const code of ["DAN9XX", "BİO9XX", "BİO909", "BİO917", "BİO91X", "EMB9XX", "EMB909", "EMB917", "EMB91X", "FZK9XX", "FZK909", "FZK917", "FZK91X"]) trustedMergedPoolCodes.add(code);
    for (const code of ["TDE8XX", "TDE805", "TDE81X", "YBS8XX", "YBS805", "YBS81X", "YON8XX", "YON805", "YON841", "YON81X"]) trustedMergedPoolCodes.add(code);
    const poolCourse = rows.some(isDepartmentPoolCourseRecord) ||
      (trustedMergedPoolCodes.has(body.code) && isDepartmentPoolCourseRecord(body));
    return assignedToUser || (departmentMatches && poolCourse);
  }
  return false;
}

function canReadCoursePackage(session, body) {
  if (["admin", "lee_ogrenci_isleri", "enstitu_sekreteri", "enstitu_yoneticisi"].includes(session.role)) return true;
  if (session.role === "abd_sekreteri") {
    return normalizeScope(session.department || "") === normalizeScope(body.department || "");
  }
  return false;
}

function canApproveCoursePackage(session, body) {
  if (["admin", "enstitu_yoneticisi"].includes(session.role)) return true;
  return session.role === "abd_asd_baskani" &&
    normalizeScope(session.department || "") === normalizeScope(body.department || "");
}

async function ensureDb() {
  if (db) return db;
  await mkdir(dataDir, { recursive: true });
  await mkdir(backupDir, { recursive: true });
  db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      email TEXT,
      department TEXT,
      department_id TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_external_id ON users(external_id);
    CREATE TABLE IF NOT EXISTS user_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      department_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_scope ON user_roles(user_id, role, department_id);
    CREATE TABLE IF NOT EXISTS role_module_access (
      role TEXT NOT NULL,
      module TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      updated_by TEXT,
      PRIMARY KEY (role, module)
    );
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      main_department TEXT NOT NULL,
      department TEXT NOT NULL,
      program_name TEXT NOT NULL,
      flags TEXT NOT NULL DEFAULT '',
      levels_json TEXT NOT NULL,
      profile_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS program_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_name TEXT NOT NULL,
      level TEXT NOT NULL,
      degree TEXT NOT NULL DEFAULT '',
      manager TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'Türkçe',
      qualification_rules TEXT NOT NULL DEFAULT '',
      sections_json TEXT NOT NULL DEFAULT '[]',
      outcomes_json TEXT NOT NULL DEFAULT '[]',
      tyyc_rows_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT,
      UNIQUE(program_name, level)
    );
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      academic_year TEXT,
      program_code TEXT,
      department TEXT NOT NULL,
      program_name TEXT NOT NULL,
      level TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      credit REAL,
      ects REAL,
      theory REAL,
      practice REAL,
      term TEXT,
      status TEXT,
      instructor TEXT,
      source TEXT,
      package_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_courses_program ON courses(department, program_name, level);
    CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
    CREATE TABLE IF NOT EXISTS public_visibility (
      key TEXT PRIMARY KEY,
      visible INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workflow_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL,
      target TEXT NOT NULL,
      route TEXT,
      note TEXT,
      status TEXT NOT NULL,
      created_by TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      file_name TEXT NOT NULL,
      path TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT,
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
  `);
  seedInitialData();
  syncCourseCatalogFromSeed();
  migrateBataryaTezliPackagesFromSeed();
  migrateBedenTezliPackagesFromSeed();
  migrateBiyolojiTezliPackagesFromSeed();
  migrateBiyolojiDoktoraPackagesFromSeed();
  migrateEbelikTezliPackagesFromSeed();
  migrateEkoturizmTezliPackagesFromSeed();
  migrateElektrikTezliPackagesFromSeed();
  migrateEnerjiTezliPackagesFromSeed();
  migrateEnerjiDoktoraPackagesFromSeed();
  migrateFelsefeDinTezliPackagesFromSeed();
  migrateFizikTezliPackagesFromSeed();
  migrateFizikDoktoraPackagesFromSeed();
  migrateGastronomiTezliPackagesFromSeed();
  migrateGidaMuhendisligiTezliPackagesFromSeed();
  migrateGidaTeknolojisiTezliPackagesFromSeed();
  migrateHaritaTezliPackagesFromSeed();
  migrateIcHastaliklariHemsireligiTezliPackagesFromSeed();
  migrateIktisatTezliPackagesFromSeed();
  migrateInsaatMuhendisligiTezliPackagesFromSeed();
  migrateIsletmeTezliPackagesFromSeed();
  migrateKimyaTezliPackagesFromSeed();
  migrateMatematikTezliPackagesFromSeed();
  migrateMuhasebeFinansmanTezliPackagesFromSeed();
  migrateOrganikTarimTezliPackagesFromSeed();
  migrateResimTezliPackagesFromSeed();
  migrateSiyasetKamuYonetimiTezliPackagesFromSeed();
  migrateTarihTezliPackagesFromSeed();
  migrateTemelIslamTezliPackagesFromSeed();
  migrateTurkDiliEdebiyatiTezliPackagesFromSeed();
  migrateYbsTezliPackagesFromSeed();
  migrateYonetimOrganizasyonTezliPackagesFromSeed();
  migrateYbsDoctorateContributionScale();
  seedProgramProfiles();
  ensureTestProgramData();
  seedDefaultRoleAccess();
  return db;
}

function countRows(table) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
}

function audit(action, actor, payload = {}) {
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)")
    .run(action, actor || null, JSON.stringify(payload), new Date().toISOString());
}

function isKnownRole(role) {
  return dbpRoles.includes(role);
}

function isKnownModule(module) {
  return dbpModules.includes(module);
}

function seedDefaultRoleAccess() {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO role_module_access(role, module, enabled, updated_at, updated_by)
    VALUES (?, ?, ?, ?, 'system')
  `);
  const syncSystemDefault = db.prepare(`
    UPDATE role_module_access
    SET enabled = ?, updated_at = ?
    WHERE role = ? AND module = ? AND updated_by = 'system'
  `);
  db.exec("BEGIN");
  try {
    for (const role of dbpRoles) {
      for (const module of dbpModules) {
        insert.run(role, module, defaultRoleAccess[role]?.includes(module) ? 1 : 0, now);
        syncSystemDefault.run(defaultRoleAccess[role]?.includes(module) ? 1 : 0, now, role, module);
      }
    }
    db.prepare(`
      UPDATE role_module_access
      SET enabled = 1, updated_at = ?, updated_by = 'system'
      WHERE role = 'abd_asd_baskani'
        AND module = 'my_courses'
        AND updated_by = 'system'
    `).run(now);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function roleAccessMap() {
  seedDefaultRoleAccess();
  const enabledByRole = Object.fromEntries(dbpRoles.map((role) => [role, new Set()]));
  const rows = db.prepare(`
    SELECT role, module, enabled
    FROM role_module_access
  `).all();
  for (const row of rows) {
    if (row.enabled && isKnownRole(row.role) && isKnownModule(row.module)) {
      enabledByRole[row.role].add(row.module);
    }
  }
  return Object.fromEntries(
    dbpRoles.map((role) => [
      role,
      dbpModules.filter((module) => enabledByRole[role].has(module)),
    ]),
  );
}

function modulesForRole(role) {
  const access = roleAccessMap();
  return access[role] || [];
}

function normalizeRoleAccessPayload(payload) {
  const source = payload?.access;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("Gecersiz yetki matrisi.");
  }
  const normalized = {};
  for (const role of dbpRoles) {
    const modules = Array.isArray(source[role]) ? source[role] : [];
    normalized[role] = [...new Set(modules.filter(isKnownModule))];
  }
  return normalized;
}

function replaceRoleAccess(access, actor) {
  const now = new Date().toISOString();
  const upsert = db.prepare(`
    INSERT INTO role_module_access(role, module, enabled, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(role, module) DO UPDATE SET
      enabled = excluded.enabled,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `);
  db.exec("BEGIN");
  try {
    for (const role of dbpRoles) {
      const enabledModules = new Set(access[role] || []);
      for (const module of dbpModules) {
        upsert.run(role, module, enabledModules.has(module) ? 1 : 0, now, actor || "admin");
      }
    }
    audit("role_module_access.update", actor, { access });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function upsertSessionUser(session) {
  if (!session?.username || !session?.role || !isKnownRole(session.role)) return null;
  const now = new Date().toISOString();
  const externalId = session.tcKimlik || session.externalId || null;
  const displayName = session.name || session.username;
  const email = session.email || null;
  const department = session.department || "";
  const departmentId = session.departmentId || "";
  const existing = externalId
    ? db.prepare("SELECT id FROM users WHERE external_id = ?").get(externalId)
    : db.prepare("SELECT id FROM users WHERE username = ?").get(session.username);
  if (existing?.id) {
    db.prepare(`
      UPDATE users
      SET username = ?,
        external_id = COALESCE(?, external_id),
        display_name = ?,
        email = ?,
        department = ?,
        department_id = ?,
        is_active = 1,
        updated_at = ?
      WHERE id = ?
    `).run(session.username, externalId, displayName, email, department, departmentId, now, existing.id);
  } else {
    db.prepare(`
      INSERT INTO users(external_id, username, display_name, email, department, department_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(username) DO UPDATE SET
        external_id = COALESCE(excluded.external_id, users.external_id),
        display_name = excluded.display_name,
        email = excluded.email,
        department = excluded.department,
        department_id = excluded.department_id,
        is_active = 1,
        updated_at = excluded.updated_at
    `).run(externalId, session.username, displayName, email, department, departmentId, now, now);
  }
  const user = externalId
    ? db.prepare("SELECT id FROM users WHERE external_id = ?").get(externalId)
    : db.prepare("SELECT id FROM users WHERE username = ?").get(session.username);
  if (!user?.id) return null;
  db.prepare(`
    INSERT OR IGNORE INTO user_roles(user_id, role, department_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(user.id, session.role, session.departmentId || "", now);
  return user.id;
}

function readInitialSeedData() {
  let source;
  try {
    source = readFileSync(seedFile, "utf8");
  } catch {
    return { programRows: [], officialCourses: [] };
  }
  const sandbox = { window: {}, localStorage: { getItem: () => "{}", setItem: () => {} } };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: seedFile });
  return {
    programRows: repairObject(sandbox.window.LEE_DBP_PROGRAM_ROWS || []),
    officialCourses: normalizeSeedCourses(repairObject(sandbox.window.LEE_DBP_OFFICIAL_COURSES || [])),
  };
}

function readCoursePackageSeeds() {
  try {
    const packages = JSON.parse(readFileSync(coursePackagesSeedFile, "utf8"));
    return Array.isArray(packages) ? repairObject(packages) : [];
  } catch {
    return [];
  }
}

function workloadRecord(workloads = []) {
  return Object.fromEntries((Array.isArray(workloads) ? workloads : []).map((item) => [
    item.name,
    { count: Number(item.count || 0), hours: Number(item.hours || 0) },
  ]));
}

function weeklyTopicRecord(weeklyTopics = []) {
  return Object.fromEntries((Array.isArray(weeklyTopics) ? weeklyTopics : []).map((item, index) => [index + 1, item]));
}

function contributionRecord(matrix = []) {
  return (Array.isArray(matrix) ? matrix : []).map((row) =>
    Object.fromEntries((row.values || []).map((score, index) => [`P${index + 1}`, Number(score || 0)]))
  );
}

function storedPackageFromSeed(coursePackage, course = {}) {
  return {
    staticSeed: true,
    seededAt: new Date().toISOString(),
    identity: {
      name: course.name || coursePackage.name || "",
      code: coursePackage.code,
      theory: String(coursePackage.theory ?? 0),
      practice: String(coursePackage.practice ?? 0),
      credit: String(coursePackage.credit ?? 0),
      level: displayLevel(coursePackage.level),
      type: course.type || "Zorunlu",
      language: coursePackage.language || "Türkçe",
    },
    detailFields: {
      purpose: coursePackage.purpose || "",
      content: coursePackage.content || "",
      methods: coursePackage.methods || "",
      prerequisites: coursePackage.prerequisites || "Yok",
      coordinator: coursePackage.instructor || "Öğrencinin Danışmanı",
      instructors: coursePackage.instructor || "Öğrencinin Danışmanı",
      assistants: "Yok",
      resources: coursePackage.resources || "",
    },
    outcomes: coursePackage.outcomes || [],
    assessments: (coursePackage.assessments || []).map((item, index) => ({ ...item, id: index + 1, fixed: index < 2 })),
    workloads: workloadRecord(coursePackage.workloads),
    weeklyTopics: weeklyTopicRecord(coursePackage.weeklyTopics),
    structureValues: {},
    contributionMatrix: contributionRecord(coursePackage.contributionMatrix),
    sdgs: coursePackage.sdgs || [],
    ects: Number(coursePackage.ects || 0),
    qualityChecks: coursePackage.qualityChecks || [],
    publicQualityChecklist: Boolean(coursePackage.publicQualityChecklist),
  };
}

function isStaticSeedPackage(packageJson = "{}") {
  try {
    return Boolean(JSON.parse(packageJson || "{}")?.staticSeed);
  } catch {
    return false;
  }
}

function findSeedPackageForCode(packages, code, course = {}) {
  const normalizedCode = repairText(code).trim().toLocaleUpperCase("tr-TR");
  return packages.find((coursePackage) =>
    (coursePackage.code === normalizedCode || coursePackage.aliases?.includes(normalizedCode)) &&
    (!coursePackage.department || normalizeScope(coursePackage.department) === normalizeScope(course.department || "")) &&
    (!coursePackage.programName || normalizeScope(coursePackage.programName) === normalizeScope(course.programName || course.program_name || ""))
  );
}

function packageSeedCourseName(coursePackage) {
  const knownNames = {
    YBS999: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE ETİK",
    YBS9XX: "UZMANLIK ALAN DERSİ",
    YBS91X: "DOKTORA TEZİ",
    DAN902: "DANIŞMANLIK",
    YBS910: "SEMİNER",
    YBS917: "DOKTORA YETERLİK",
    DAN8XX: "DANIŞMANLIK",
    DAN9XX: "DANIŞMANLIK",
    BİO9XX: "UZMANLIK ALAN DERSİ",
    BİO909: "SEMİNER",
    BİO917: "DOKTORA YETERLİK",
    BİO91X: "TEZ ÇALIŞMASI",
    EMB9XX: "UZMANLIK ALAN DERSİ",
    EMB909: "SEMİNER",
    EMB917: "DOKTORA YETERLİK",
    EMB91X: "TEZ ÇALIŞMASI",
    MMB8XX: "UZMANLIK ALAN DERSİ",
    MMB806: "SEMİNER",
    MMB81X: "TEZ ÇALIŞMASI",
    ADE8XX: "UZMANLIK ALAN DERSİ",
    ADE806: "SEMİNER",
    ADE81X: "TEZ ÇALIŞMASI",
    ARK8XX: "UZMANLIK ALAN DERSİ",
    ARK806: "YÜKSEK LİSANS SEMİNER",
    ARK81X: "TEZ ÇALIŞMASI",
    BES801: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    BES8XX: "UZMANLIK ALAN DERSİ",
    BES806: "SEMİNER",
    BEF801: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    BES81X: "TEZ ÇALIŞMASI",
    BİO8XX: "UZMANLIK ALAN DERSİ",
    EBE8XX: "UZMANLIK ALAN DERSİ",
    EBE806: "SEMİNER",
    EBE809: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    EBE81X: "TEZ ÇALIŞMASI",
    ETR8XX: "UZMANLIK ALAN DERSİ",
    ETR806: "SEMİNER",
    ETR855: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    ETR81X: "TEZ ÇALIŞMASI",
    EEM8XX: "UZMANLIK ALAN DERSİ",
    EEM806: "SEMİNER",
    EEM885: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    EEM81X: "TEZ ÇALIŞMASI",
    EMB8XX: "UZMANLIK ALAN DERSİ",
    EMB806: "SEMİNER",
    EMB829: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    EMB81X: "YÜKSEK LİSANS TEZİ",
    FDB8XX: "UZMANLIK ALAN DERSİ",
    FDB806: "SEMİNER",
    FDB81X: "YÜKSEK LİSANS TEZİ",
    FZK8XX: "UZMANLIK ALAN DERSİ",
    FZK9XX: "UZMANLIK ALAN DERSİ",
    FZK909: "SEMİNER",
    FZK917: "DOKTORA YETERLİK",
    FZK91X: "TEZ ÇALIŞMASI",
    GMS8XX: "UZMANLIK ALAN DERSİ",
    GMS806: "SEMİNER",
    GMS85X: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    GMS81X: "TEZ ÇALIŞMASI",
    GMB8XX: "UZMANLIK ALAN DERSİ",
    GMB806: "SEMİNER",
    GMB85X: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    GMB81X: "TEZ ÇALIŞMASI",
    GTB8XX: "UZMANLIK ALAN DERSİ",
    GTB806: "SEMİNER",
    GTB82X: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    GTB81X: "TEZ ÇALIŞMASI",
    HRM8XX: "UZMANLIK ALAN DERSİ",
    HRM806: "SEMİNER",
    HRM809: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    HRM81X: "TEZ ÇALIŞMASI",
    İHH8XX: "UZMANLIK ALAN DERSİ",
    İHH806: "SEMİNER",
    İHH809: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    İHH81X: "TEZ ÇALIŞMASI",
    İKT8XX: "UZMANLIK ALAN DERSİ",
    İKT806: "SEMİNER",
    İKT897: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    İKT81X: "TEZ ÇALIŞMASI",
    İNŞ8XX: "UZMANLIK ALAN DERSİ",
    İNŞ806: "SEMİNER",
    İNŞ897: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    İNŞ81X: "TEZ ÇALIŞMASI",
    ISL8XX: "UZMANLIK ALAN DERSİ",
    ISL806: "SEMİNER",
    ISL885: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    ISL81X: "TEZ ÇALIŞMASI",
    KİM8XX: "UZMANLIK ALAN DERSİ",
    KİM806: "SEMİNER",
    KİM839: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    KİM81X: "TEZ ÇALIŞMASI",
    MAT8XX: "UZMANLIK ALAN DERSİ",
    MAT805: "SEMİNER",
    MAT863: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    MAT81X: "TEZ ÇALIŞMASI",
    MUF8XX: "UZMANLIK ALAN DERSİ",
    MUF805: "SEMİNER",
    MUF849: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    MUF81X: "TEZ ÇALIŞMASI",
    OTİ8XX: "UZMANLIK ALAN DERSİ",
    OTİ805: "SEMİNER",
    OTİ841: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    OTİ81X: "TEZ ÇALIŞMASI",
    RES8XX: "UZMANLIK ALAN DERSİ",
    RES805: "SEMİNER",
    RES881: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    RES81X: "TEZ ÇALIŞMASI",
    SKY8XX: "UZMANLIK ALAN DERSİ",
    SKY805: "SEMİNER",
    SKY899: "BİLİMSEL ARAŞTIRMA VE YAYIN ETİĞİ",
    SKY81X: "TEZ ÇALIŞMASI",
    TTZ8XX: "UZMANLIK ALAN DERSİ",
    TTZ805: "SEMİNER",
    BES801: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    TTZ81X: "TEZ ÇALIŞMASI",
    FZK806: "SEMİNER",
    FZK899: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    FZK81X: "YÜKSEK LİSANS TEZİ",
    BİO806: "SEMİNER",
    BİO809: "BİLİMSEL ARAŞTIRMA YÖNTEMLERİ VE YAYIN ETİĞİ",
    BİO81X: "TEZ ÇALIŞMASI",
  };
  return knownNames[coursePackage.code] || coursePackage.name || coursePackage.code;
}

function seedInitialData(force = false) {
  const seeded = db.prepare("SELECT value FROM metadata WHERE key = ?").get("seeded_from_current_data")?.value;
  const programCount = countRows("programs");
  const courseCount = countRows("courses");
  if (!force && seeded === "1" && (programCount > 0 || courseCount > 0)) return;
  if (!force && (programCount > 0 || courseCount > 0)) {
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "1");
    return;
  }
  const { programRows, officialCourses } = readInitialSeedData();
  if (!programRows.length && !officialCourses.length) {
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "1");
    return;
  }
  const packageSeeds = readCoursePackageSeeds();
  const now = new Date().toISOString();
  const insertProgram = db.prepare(`
    INSERT INTO programs(main_department, department, program_name, flags, levels_json, profile_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, '{}', ?, ?)
  `);
  const insertCourse = db.prepare(`
    INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec("BEGIN");
  try {
    if (force) {
      for (const table of ["programs", "courses", "public_visibility", "workflow_requests", "attachments", "audit_logs"]) {
        db.exec(`DELETE FROM ${table}`);
      }
    }
    for (const row of programRows) {
      insertProgram.run(row[0], row[1], row[2], row[3] || "", JSON.stringify(levelsFromFlags(row[3])), now, now);
    }
    for (const course of officialCourses) {
      const packageSeed = findSeedPackageForCode(packageSeeds, course.code, course);
      insertCourse.run(
        course.academicYear || "",
        course.programCode || "",
        course.department || "",
        course.programName || "",
        course.level || "Tezli YL",
        course.code || "",
        course.name || "",
        course.type || "",
        Number(course.credit || 0),
        Number(course.ects || 0),
        Number(course.theory || 0),
        Number(course.practice || 0),
        course.term || "",
        course.status || "İncelemede",
        course.instructor || "",
        course.source || "seed",
        packageSeed ? JSON.stringify(storedPackageFromSeed(packageSeed, course)) : "{}",
        now,
        now,
      );
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "1");
    audit(force ? "seed.force" : "seed.initial", "system", { programs: programRows.length, courses: officialCourses.length });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function courseFromRow(row) {
  return repairObject({
    id: row.id,
    academicYear: row.academic_year || "",
    programCode: row.program_code || "",
    department: row.department || "",
    programName: row.program_name || "",
    level: displayLevel(row.level || ""),
    code: row.code || "",
    name: row.name || "",
    type: row.type || "",
    credit: Number(row.credit || 0),
    ects: Number(row.ects || 0),
    theory: Number(row.theory || 0),
    practice: Number(row.practice || 0),
    term: row.term || "",
    status: row.status || "",
    instructor: row.instructor || "",
    source: row.source || "",
    hasPackage: Boolean(row.package_json && row.package_json !== "{}"),
    updatedAt: row.updated_at || "",
  });
}

function normalizeDbCourseForList(course = {}) {
  const repaired = repairObject(course);
  const makineCourse = normalizeMakineTezliCourse(repaired);
  if (!makineCourse) return null;
  if (makineCourse !== repaired) return makineCourse;
  const aileCourse = normalizeAileTezliCourse(repaired);
  if (!aileCourse) return null;
  if (aileCourse !== repaired) return aileCourse;
  const arkeolojiCourse = normalizeArkeolojiTezliCourse(repaired);
  if (!arkeolojiCourse) return null;
  if (arkeolojiCourse !== repaired) return arkeolojiCourse;
  const bataryaCourse = normalizeBataryaTezliCourse(repaired);
  if (!bataryaCourse) return null;
  if (bataryaCourse !== repaired) return bataryaCourse;
  const bedenCourse = normalizeBedenTezliCourse(repaired);
  if (!bedenCourse) return null;
  if (bedenCourse !== repaired) return bedenCourse;
  const biyolojiCourse = normalizeBiyolojiTezliCourse(repaired);
  if (!biyolojiCourse) return null;
  if (biyolojiCourse !== repaired) return biyolojiCourse;
  const biyolojiDoktoraCourse = normalizeBiyolojiDoktoraCourse(repaired);
  if (!biyolojiDoktoraCourse) return null;
  if (biyolojiDoktoraCourse !== repaired) return biyolojiDoktoraCourse;
  const ebelikCourse = normalizeEbelikTezliCourse(repaired);
  if (!ebelikCourse) return null;
  if (ebelikCourse !== repaired) return ebelikCourse;
  const ekoturizmCourse = normalizeEkoturizmTezliCourse(repaired);
  if (!ekoturizmCourse) return null;
  if (ekoturizmCourse !== repaired) return ekoturizmCourse;
  const elektrikCourse = normalizeElektrikTezliCourse(repaired);
  if (!elektrikCourse) return null;
  if (elektrikCourse !== repaired) return elektrikCourse;
  const enerjiCourse = normalizeEnerjiTezliCourse(repaired);
  if (!enerjiCourse) return null;
  if (enerjiCourse !== repaired) return enerjiCourse;
  const enerjiDoktoraCourse = normalizeEnerjiDoktoraCourse(repaired);
  if (!enerjiDoktoraCourse) return null;
  if (enerjiDoktoraCourse !== repaired) return enerjiDoktoraCourse;
  const felsefeDinCourse = normalizeFelsefeDinTezliCourse(repaired);
  if (!felsefeDinCourse) return null;
  if (felsefeDinCourse !== repaired) return felsefeDinCourse;
  const fizikCourse = normalizeFizikTezliCourse(repaired);
  if (!fizikCourse) return null;
  if (fizikCourse !== repaired) return fizikCourse;
  const fizikDoktoraCourse = normalizeFizikDoktoraCourse(repaired);
  if (!fizikDoktoraCourse) return null;
  if (fizikDoktoraCourse !== repaired) return fizikDoktoraCourse;
  const gastronomiCourse = normalizeGastronomiTezliCourse(repaired);
  if (!gastronomiCourse) return null;
  if (gastronomiCourse !== repaired) return gastronomiCourse;
  const gidaMuhendisligiCourse = normalizeGidaMuhendisligiTezliCourse(repaired);
  if (!gidaMuhendisligiCourse) return null;
  if (gidaMuhendisligiCourse !== repaired) return gidaMuhendisligiCourse;
  const gidaTeknolojisiCourse = normalizeGidaTeknolojisiTezliCourse(repaired);
  if (!gidaTeknolojisiCourse) return null;
  if (gidaTeknolojisiCourse !== repaired) return gidaTeknolojisiCourse;
  const haritaCourse = normalizeHaritaTezliCourse(repaired);
  if (!haritaCourse) return null;
  if (haritaCourse !== repaired) return haritaCourse;
  const icHastaliklariCourse = normalizeIcHastaliklariTezliCourse(repaired);
  if (!icHastaliklariCourse) return null;
  if (icHastaliklariCourse !== repaired) return icHastaliklariCourse;
  const iktisatCourse = normalizeIktisatTezliCourse(repaired);
  if (!iktisatCourse) return null;
  if (iktisatCourse !== repaired) return iktisatCourse;
  const insaatCourse = normalizeInsaatTezliCourse(repaired);
  if (!insaatCourse) return null;
  if (insaatCourse !== repaired) return insaatCourse;
  const isletmeCourse = normalizeIsletmeTezliCourse(repaired);
  if (!isletmeCourse) return null;
  if (isletmeCourse !== repaired) return isletmeCourse;
  const kimyaCourse = normalizeKimyaTezliCourse(repaired);
  if (!kimyaCourse) return null;
  if (kimyaCourse !== repaired) return kimyaCourse;
  const matematikCourse = normalizeMatematikTezliCourse(repaired);
  if (!matematikCourse) return null;
  if (matematikCourse !== repaired) return matematikCourse;
  const muhasebeFinansmanCourse = normalizeMuhasebeFinansmanTezliCourse(repaired);
  if (!muhasebeFinansmanCourse) return null;
  if (muhasebeFinansmanCourse !== repaired) return muhasebeFinansmanCourse;
  const organikTarimCourse = normalizeOrganikTarimTezliCourse(repaired);
  if (!organikTarimCourse) return null;
  if (organikTarimCourse !== repaired) return organikTarimCourse;
  const resimCourse = normalizeResimTezliCourse(repaired);
  if (!resimCourse) return null;
  if (resimCourse !== repaired) return resimCourse;
  const siyasetKamuCourse = normalizeSiyasetKamuYonetimiTezliCourse(repaired);
  if (!siyasetKamuCourse) return null;
  if (siyasetKamuCourse !== repaired) return siyasetKamuCourse;
  const tarihCourse = normalizeTarihTezliCourse(repaired);
  if (!tarihCourse) return null;
  if (tarihCourse !== repaired) return tarihCourse;
  const temelIslamCourse = normalizeTemelIslamTezliCourse(repaired);
  if (!temelIslamCourse) return null;
  if (temelIslamCourse !== repaired) return temelIslamCourse;
  const turkDiliEdebiyatiCourse = normalizeTurkDiliEdebiyatiTezliCourse(repaired);
  if (!turkDiliEdebiyatiCourse) return null;
  if (turkDiliEdebiyatiCourse !== repaired) return turkDiliEdebiyatiCourse;
  const ybsTezliCourse = normalizeYbsTezliCourse(repaired);
  if (!ybsTezliCourse) return null;
  if (ybsTezliCourse !== repaired) return ybsTezliCourse;
  const yonetimOrganizasyonCourse = normalizeYonetimOrganizasyonTezliCourse(repaired);
  if (!yonetimOrganizasyonCourse) return null;
  if (yonetimOrganizasyonCourse !== repaired) return yonetimOrganizasyonCourse;
  if (!isYbsDoctorateCourse(repaired)) return repaired;
  const code = repairText(repaired.code || "").trim().toLocaleUpperCase("tr-TR");
  if (ybsSpecializationCodes.has(code)) {
    if (code !== "YBS901") return null;
    return { ...repaired, code: "YBS9XX", name: "UZMANLIK ALAN DERSİ", ects: 5 };
  }
  if (ybsThesisCodes.has(code)) {
    if (code !== "YBS911") return null;
    return { ...repaired, code: "YBS91X", name: "DOKTORA TEZİ", ects: 24 };
  }
  if (code === "YBS909") return null;
  if (code === "YBS918") return null;
  return repaired;
}

function courseListKey(course) {
  return [
    normalizeScope(course.department || ""),
    normalizeScope(course.programName || ""),
    levelKey(course.level || ""),
    repairText(course.code || "").trim().toLocaleUpperCase("tr-TR"),
  ].join("|");
}

function courseMatchesFilters(course, filters = {}) {
  if (filters.department && normalizeScope(course.department) !== normalizeScope(filters.department)) return false;
  if (filters.programName && normalizeScope(course.programName) !== normalizeScope(filters.programName)) return false;
  if (filters.level && levelKey(course.level) !== levelKey(filters.level)) return false;
  if (filters.instructor) {
    const instructor = normalizePerson(course.instructor || "");
    const requested = normalizePerson(filters.instructor);
    if (!instructor || !requested || !(instructor === requested || instructor.includes(requested) || requested.includes(instructor))) return false;
  }
  if (filters.q) {
    const query = repairText(filters.q).toLocaleLowerCase("tr-TR");
    const haystack = [
      course.code,
      course.name,
      course.department,
      course.programName,
      course.level,
      course.instructor,
      course.status,
    ].join(" ").toLocaleLowerCase("tr-TR");
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function dbCourseList(filters = {}) {
  const rows = db.prepare(`
    SELECT id, academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, updated_at
    FROM courses
    ORDER BY department, program_name, level, code, id
  `).all();
  const byKey = new Map();
  for (const row of rows) {
    const normalized = normalizeDbCourseForList(courseFromRow(row));
    if (!normalized) continue;
    const key = courseListKey(normalized);
    const current = byKey.get(key);
    const canonicalExact = row.code === normalized.code;
    const currentScore = current ? Number(current.code === normalized.code) + Number(current.hasPackage) : -1;
    const nextScore = Number(canonicalExact) + Number(normalized.hasPackage);
    if (!current || nextScore >= currentScore) byKey.set(key, normalized);
  }
  return [...byKey.values()]
    .filter((course) => courseMatchesFilters(course, filters))
    .sort((left, right) =>
      `${left.department}|${left.programName}|${left.level}|${left.code}`.localeCompare(
        `${right.department}|${right.programName}|${right.level}|${right.code}`,
        "tr-TR",
      )
    );
}

function findExactCourseRow(course) {
  const rows = db.prepare(`
    SELECT * FROM courses
    WHERE code = ?
    ORDER BY updated_at DESC, id DESC
  `).all(course.code || "");
  return rows.find((row) =>
    normalizeScope(row.department) === normalizeScope(course.department || "") &&
    normalizeScope(row.program_name) === normalizeScope(course.programName || "") &&
    levelKey(row.level) === levelKey(course.level || "")
  );
}

function syncCourseCatalogFromSeed() {
  const { officialCourses } = readInitialSeedData();
  if (!officialCourses.length) return;
  const packageSeeds = readCoursePackageSeeds();
  const now = new Date().toISOString();
  const insertCourse = db.prepare(`
    INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updateCourse = db.prepare(`
    UPDATE courses
    SET academic_year = ?,
        program_code = ?,
        name = ?,
        type = ?,
        credit = ?,
        ects = ?,
        theory = ?,
        practice = ?,
        term = ?,
        status = CASE WHEN COALESCE(TRIM(status), '') = '' THEN ? ELSE status END,
        instructor = ?,
        source = CASE WHEN COALESCE(TRIM(source), '') = '' THEN ? ELSE source END,
        package_json = ?,
        updated_at = ?
    WHERE id = ?
  `);
  let inserted = 0;
  let updated = 0;
  db.exec("BEGIN");
  try {
    for (const course of officialCourses) {
      const packageSeed = findSeedPackageForCode(packageSeeds, course.code, course);
      const seededPackageJson = packageSeed ? JSON.stringify(storedPackageFromSeed(packageSeed, course)) : "{}";
      const seededInstructor = sanitizeInstructorName(course.instructor || packageSeed?.instructor || "");
      const existing = findExactCourseRow(course);
      if (!existing) {
        insertCourse.run(
          course.academicYear || "",
          course.programCode || "",
          course.department || "",
          course.programName || "",
          course.level || "Tezli Yüksek Lisans",
          course.code || "",
          course.name || "",
          course.type || "",
          Number(course.credit || 0),
          Number(course.ects || 0),
          Number(course.theory || 0),
          Number(course.practice || 0),
          course.term || "",
          course.status || "İncelemede",
          seededInstructor,
          course.source || "course_catalog_sync",
          seededPackageJson,
          now,
          now,
        );
        inserted += 1;
        continue;
      }
      const currentPackageJson = existing.package_json || "{}";
      const nextPackageJson =
        seededPackageJson !== "{}" && (currentPackageJson === "{}" || isStaticSeedPackage(currentPackageJson))
          ? seededPackageJson
          : currentPackageJson;
      updateCourse.run(
        course.academicYear || existing.academic_year || "",
        course.programCode || existing.program_code || "",
        course.name || existing.name || "",
        course.type || existing.type || "",
        Number(course.credit ?? existing.credit ?? 0),
        Number(course.ects ?? existing.ects ?? 0),
        Number(course.theory ?? existing.theory ?? 0),
        Number(course.practice ?? existing.practice ?? 0),
        course.term || existing.term || "",
        course.status || "İncelemede",
        seededInstructor,
        course.source || "course_catalog_sync",
        nextPackageJson,
        now,
        existing.id,
      );
      updated += 1;
    }
    for (const packageSeed of packageSeeds) {
      const packageCourse = {
        academicYear: "2026-2027",
        programCode: "",
        department: packageSeed.department || ybsDefaultDepartment,
        programName: packageSeed.programName || ybsDefaultProgramName,
        level: displayLevel(packageSeed.level),
        code: packageSeed.code,
        name: packageSeedCourseName(packageSeed),
        type: "Zorunlu",
        credit: Number(packageSeed.credit || 0),
        ects: Number(packageSeed.ects || 0),
        theory: Number(packageSeed.theory || 0),
        practice: Number(packageSeed.practice || 0),
        term: "Güz",
        status: "Public",
        instructor: packageSeed.instructor || "",
        source: "course_package_seed",
      };
      const existingPackageCourse = findExactCourseRow(packageCourse);
      if (existingPackageCourse) {
        if (
          existingPackageCourse.source === "course_package_seed" &&
          existingPackageCourse.name === existingPackageCourse.code &&
          packageCourse.name !== packageCourse.code
        ) {
          db.prepare("UPDATE courses SET name = ?, updated_at = ? WHERE id = ?")
            .run(packageCourse.name, now, existingPackageCourse.id);
          updated += 1;
        }
        continue;
      }
      insertCourse.run(
        packageCourse.academicYear,
        packageCourse.programCode,
        packageCourse.department,
        packageCourse.programName,
        packageCourse.level,
        packageCourse.code,
        packageCourse.name,
        packageCourse.type,
        packageCourse.credit,
        packageCourse.ects,
        packageCourse.theory,
        packageCourse.practice,
        packageCourse.term,
        packageCourse.status,
        packageCourse.instructor,
        packageCourse.source,
        JSON.stringify(storedPackageFromSeed(packageSeed, packageCourse)),
        now,
        now,
      );
      inserted += 1;
    }
    db.prepare(`
      UPDATE courses
      SET status = 'Public', updated_at = ?
      WHERE package_json LIKE '%"staticSeed":true%'
        AND (status IS NULL OR TRIM(status) = '' OR status LIKE '%ncelemede%' OR status LIKE '%Atama%')
    `).run(now);
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("course_catalog_synced_at", now);
    audit("course_catalog.sync", "system", { inserted, updated, packages: packageSeeds.length });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateBataryaTezliPackagesFromSeed() {
  const revision = "2026-08-18-batarya-tezli-v1";
  if (db.prepare("SELECT value FROM metadata WHERE key = ?").get("batarya_tezli_packages_revision")?.value === revision) return;
  const packages = readCoursePackageSeeds().filter((item) =>
    normalizeScope(item.department || "") === normalizeScope("Batarya Sistemleri ve Hidrojen Teknolojileri ABD") &&
    normalizeScope(item.programName || "") === normalizeScope("Batarya Sistemleri ve Hidrojen Teknolojileri") &&
    levelKey(item.level || "") === "tezli yl"
  );
  const now = new Date().toISOString();
  const update = db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);
  let changed = 0;
  db.exec("BEGIN");
  try {
    for (const packageSeed of packages) {
      const course = findExactCourseRow({ department: packageSeed.department, programName: packageSeed.programName, level: packageSeed.level, code: packageSeed.code });
      if (!course) continue;
      const courseView = { ...course, programName: course.program_name };
      update.run(course.name || packageSeed.name, Number(packageSeed.credit || 0), Number(packageSeed.ects || 0), Number(packageSeed.theory || 0), Number(packageSeed.practice || 0), JSON.stringify(storedPackageFromSeed(packageSeed, courseView)), now, course.id);
      changed += 1;
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("batarya_tezli_packages_revision", revision);
    audit("course.package.migrate", "system", { scope: "Batarya Sistemleri ve Hidrojen Teknolojileri Tezli YL", revision, changed });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateBedenTezliPackagesFromSeed() {
  const revision = "2026-08-18-beden-tezli-v1";
  if (db.prepare("SELECT value FROM metadata WHERE key = ?").get("beden_tezli_packages_revision")?.value === revision) return;
  const packages = readCoursePackageSeeds().filter((item) => normalizeScope(item.department || "") === normalizeScope("Beden Eğitimi ve Spor ABD") && normalizeScope(item.programName || "") === normalizeScope("Beden Eğitimi ve Spor") && levelKey(item.level || "") === "tezli yl");
  const now = new Date().toISOString();
  const update = db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);
  let changed = 0;
  db.exec("BEGIN");
  try {
    for (const packageSeed of packages) {
      const course = findExactCourseRow({ department:packageSeed.department, programName:packageSeed.programName, level:packageSeed.level, code:packageSeed.code });
      if (!course) continue;
      update.run(course.name || packageSeed.name, Number(packageSeed.credit || 0), Number(packageSeed.ects || 0), Number(packageSeed.theory || 0), Number(packageSeed.practice || 0), JSON.stringify(storedPackageFromSeed(packageSeed, { ...course, programName:course.program_name })), now, course.id);
      changed += 1;
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("beden_tezli_packages_revision", revision);
    audit("course.package.migrate", "system", { scope:"Beden Eğitimi ve Spor Tezli YL", revision, changed });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateBiyolojiTezliPackagesFromSeed() {
  const revision = "2026-08-18-biyoloji-tezli-v3-natural-prose";
  if (db.prepare("SELECT value FROM metadata WHERE key = ?").get("biyoloji_tezli_packages_revision")?.value === revision) return;
  const packages = readCoursePackageSeeds().filter((item) => normalizeScope(item.department || "") === normalizeScope("Biyoloji ABD") && normalizeScope(item.programName || "") === normalizeScope("Biyoloji") && levelKey(item.level || "") === "tezli yl");
  const now = new Date().toISOString();
  const update = db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);
  let changed = 0;
  db.exec("BEGIN");
  try {
    for (const packageSeed of packages) {
      const course = findExactCourseRow({ department:packageSeed.department, programName:packageSeed.programName, level:packageSeed.level, code:packageSeed.code });
      if (!course) continue;
      update.run(course.name || packageSeed.name, Number(packageSeed.credit || 0), Number(packageSeed.ects || 0), Number(packageSeed.theory || 0), Number(packageSeed.practice || 0), JSON.stringify(storedPackageFromSeed(packageSeed, { ...course, programName:course.program_name })), now, course.id);
      changed += 1;
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("biyoloji_tezli_packages_revision", revision);
    audit("course.package.migrate", "system", { scope:"Biyoloji Tezli YL", revision, changed });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateBiyolojiDoktoraPackagesFromSeed() {
  const revision = "2026-08-20-biyoloji-doktora-v1";
  if (db.prepare("SELECT value FROM metadata WHERE key = ?").get("biyoloji_doktora_packages_revision")?.value === revision) return;
  const packages = readCoursePackageSeeds().filter((item) => normalizeScope(item.department || "") === normalizeScope("Biyoloji ABD") && normalizeScope(item.programName || "") === normalizeScope("Biyoloji") && levelKey(item.level || "") === "doktora");
  const now = new Date().toISOString();
  const update = db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);
  let changed = 0;
  db.exec("BEGIN");
  try {
    for (const packageSeed of packages) {
      const course = findExactCourseRow({ department:packageSeed.department, programName:packageSeed.programName, level:packageSeed.level, code:packageSeed.code });
      if (!course) continue;
      update.run(course.name || packageSeed.name, Number(packageSeed.credit || 0), Number(packageSeed.ects || 0), Number(packageSeed.theory || 0), Number(packageSeed.practice || 0), JSON.stringify(storedPackageFromSeed(packageSeed, { ...course, programName:course.program_name })), now, course.id);
      changed += 1;
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("biyoloji_doktora_packages_revision", revision);
    audit("course.package.migrate", "system", { scope:"Biyoloji Doktora", revision, changed });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateEbelikTezliPackagesFromSeed() {
  const revision = "2026-08-18-ebelik-tezli-v1";
  if (db.prepare("SELECT value FROM metadata WHERE key = ?").get("ebelik_tezli_packages_revision")?.value === revision) return;
  const packages = readCoursePackageSeeds().filter((item) => normalizeScope(item.department || "") === normalizeScope("Ebelik ABD") && normalizeScope(item.programName || "") === normalizeScope("Ebelik") && levelKey(item.level || "") === "tezli yl");
  const now = new Date().toISOString();
  const update = db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);
  let changed = 0;
  db.exec("BEGIN");
  try {
    for (const packageSeed of packages) {
      const course = findExactCourseRow({ department:packageSeed.department, programName:packageSeed.programName, level:packageSeed.level, code:packageSeed.code });
      if (!course) continue;
      update.run(course.name || packageSeed.name, Number(packageSeed.credit || 0), Number(packageSeed.ects || 0), Number(packageSeed.theory || 0), Number(packageSeed.practice || 0), JSON.stringify(storedPackageFromSeed(packageSeed, { ...course, programName:course.program_name })), now, course.id);
      changed += 1;
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("ebelik_tezli_packages_revision", revision);
    audit("course.package.migrate", "system", { scope:"Ebelik Tezli YL", revision, changed });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateEkoturizmTezliPackagesFromSeed() {
  const revision="2026-08-18-ekoturizm-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("ekoturizm_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Ekoturizm Rehberliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Ekoturizm Rehberliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const c=findExactCourseRow({department:p.department,programName:p.programName,level:p.level,code:p.code});if(!c)continue;update.run(c.name||p.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("ekoturizm_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Ekoturizm Rehberliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateElektrikTezliPackagesFromSeed() {
  const revision="2026-08-18-elektrik-elektronik-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("elektrik_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Elektrik Elektronik Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Elektrik Elektronik Mühendisliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const c=findExactCourseRow({department:p.department,programName:p.programName,level:p.level,code:p.code});if(!c)continue;update.run(c.name||p.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("elektrik_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Elektrik Elektronik Mühendisliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateEnerjiTezliPackagesFromSeed() {
  const revision="2026-08-18-enerji-sistemleri-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("enerji_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Enerji Sistemleri Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Enerji Sistemleri Mühendisliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const c=findExactCourseRow({department:p.department,programName:p.programName,level:p.level,code:p.code});if(!c)continue;update.run(c.name||p.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("enerji_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Enerji Sistemleri Mühendisliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateEnerjiDoktoraPackagesFromSeed() {
  const revision="2026-08-20-enerji-sistemleri-doktora-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("enerji_doktora_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Enerji Sistemleri Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Enerji Sistemleri Mühendisliği")&&levelKey(x.level||"")==="doktora");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("enerji_doktora_packages_revision",revision);audit("course.package.migrate","system",{scope:"Enerji Sistemleri Mühendisliği Doktora",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateFelsefeDinTezliPackagesFromSeed() {
  const revision="2026-08-18-felsefe-din-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("felsefe_din_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Felsefe ve Din Bilimleri ABD")&&normalizeScope(x.programName||"")===normalizeScope("Felsefe ve Din Bilimleri")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const c=findExactCourseRow({department:p.department,programName:p.programName,level:p.level,code:p.code});if(!c)continue;update.run(c.name||p.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("felsefe_din_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Felsefe ve Din Bilimleri Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateFizikTezliPackagesFromSeed() {
  const revision="2026-08-20-fizik-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("fizik_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Fizik ABD")&&normalizeScope(x.programName||"")===normalizeScope("Fizik")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const c=findExactCourseRow({department:p.department,programName:p.programName,level:p.level,code:p.code});if(!c)continue;update.run(c.name||p.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("fizik_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Fizik Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateFizikDoktoraPackagesFromSeed() {
  const revision="2026-08-20-fizik-doktora-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("fizik_doktora_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Fizik ABD")&&normalizeScope(x.programName||"")===normalizeScope("Fizik")&&levelKey(x.level||"")==="doktora");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("fizik_doktora_packages_revision",revision);audit("course.package.migrate","system",{scope:"Fizik Doktora",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateGastronomiTezliPackagesFromSeed() {
  const revision="2026-08-20-gastronomi-tezli-v3";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("gastronomi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Gastronomi ve Mutfak Sanatları ABD")&&normalizeScope(x.programName||"")===normalizeScope("Gastronomi ve Mutfak Sanatları")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("gastronomi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Gastronomi ve Mutfak Sanatları Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateGidaMuhendisligiTezliPackagesFromSeed() {
  const revision="2026-08-20-gida-muhendisligi-tezli-v2";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("gida_muhendisligi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Gıda Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Gıda Mühendisliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("gida_muhendisligi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Gıda Mühendisliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateGidaTeknolojisiTezliPackagesFromSeed() {
  const revision="2026-08-20-gida-teknolojisi-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("gida_teknolojisi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Gıda Teknolojisi ABD")&&normalizeScope(x.programName||"")===normalizeScope("Gıda Teknolojisi")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("gida_teknolojisi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Gıda Teknolojisi Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateHaritaTezliPackagesFromSeed() {
  const revision="2026-08-20-harita-tezli-v2";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("harita_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Harita Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Harita Mühendisliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("harita_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Harita Mühendisliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateIcHastaliklariHemsireligiTezliPackagesFromSeed() {
  const revision="2026-08-20-ic-hastaliklari-hemsireligi-tezli-v2";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("ic_hastaliklari_hemsireligi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Hemşirelik ABD")&&normalizeScope(x.programName||"")===normalizeScope("İç Hastalıkları Hemşireliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("ic_hastaliklari_hemsireligi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"İç Hastalıkları Hemşireliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateIktisatTezliPackagesFromSeed() {
  const revision="2026-08-20-iktisat-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("iktisat_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("İktisat ABD")&&normalizeScope(x.programName||"")===normalizeScope("İktisat")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("iktisat_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"İktisat Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateInsaatMuhendisligiTezliPackagesFromSeed() {
  const revision="2026-08-20-insaat-muhendisligi-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("insaat_muhendisligi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("İnşaat Mühendisliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("İnşaat Mühendisliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("insaat_muhendisligi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"İnşaat Mühendisliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateIsletmeTezliPackagesFromSeed() {
  const revision="2026-08-20-isletme-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("isletme_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("İşletme")&&normalizeScope(x.programName||"")===normalizeScope("İşletme")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("isletme_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"İşletme Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateKimyaTezliPackagesFromSeed() {
  const revision="2026-08-20-kimya-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("kimya_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Kimya ABD")&&normalizeScope(x.programName||"")===normalizeScope("Kimya")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("kimya_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Kimya Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateMatematikTezliPackagesFromSeed() {
  const revision="2026-08-20-matematik-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("matematik_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Matematik ABD")&&normalizeScope(x.programName||"")===normalizeScope("Matematik")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("matematik_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Matematik Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateMuhasebeFinansmanTezliPackagesFromSeed() {
  const revision="2026-08-20-muhasebe-finansman-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("muhasebe_finansman_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Muhasebe ve Finansman")&&normalizeScope(x.programName||"")===normalizeScope("Muhasebe ve Finansman")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("muhasebe_finansman_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Muhasebe ve Finansman Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateOrganikTarimTezliPackagesFromSeed() {
  const revision="2026-08-20-organik-tarim-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("organik_tarim_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Organik Tarım İşletmeciliği ABD")&&normalizeScope(x.programName||"")===normalizeScope("Organik Tarım İşletmeciliği")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("organik_tarim_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Organik Tarım İşletmeciliği Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateResimTezliPackagesFromSeed() {
  const revision="2026-08-20-resim-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("resim_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Resim ASD")&&normalizeScope(x.programName||"")===normalizeScope("Resim")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("resim_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Resim Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateSiyasetKamuYonetimiTezliPackagesFromSeed() {
  const revision="2026-08-20-siyaset-kamu-yonetimi-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("siyaset_kamu_yonetimi_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Siyaset Bilimi ve Kamu Yönetimi ABD")&&normalizeScope(x.programName||"")===normalizeScope("Siyaset Bilimi ve Kamu Yönetimi")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("siyaset_kamu_yonetimi_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Siyaset Bilimi ve Kamu Yönetimi Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateTarihTezliPackagesFromSeed() {
  const revision="2026-08-20-tarih-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("tarih_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Tarih ABD")&&normalizeScope(x.programName||"")===normalizeScope("Tarih")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("tarih_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Tarih Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateTemelIslamTezliPackagesFromSeed() {
  const revision="2026-08-20-temel-islam-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("temel_islam_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Temel İslam Bilimleri ABD")&&normalizeScope(x.programName||"")===normalizeScope("Temel İslam Bilimleri")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("temel_islam_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Temel İslam Bilimleri Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateTurkDiliEdebiyatiTezliPackagesFromSeed() {
  const revision="2026-08-20-turk-dili-edebiyati-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("turk_dili_edebiyati_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Türk Dili ve Edebiyatı ABD")&&normalizeScope(x.programName||"")===normalizeScope("Türk Dili ve Edebiyatı")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("turk_dili_edebiyati_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Türk Dili ve Edebiyatı Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateYbsTezliPackagesFromSeed() {
  const revision="2026-08-20-ybs-tezli-v3";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("ybs_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Yönetim Bilişim Sistemleri ABD")&&normalizeScope(x.programName||"")===normalizeScope("Yönetim Bilişim Sistemleri")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("ybs_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Yönetim Bilişim Sistemleri Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function migrateYonetimOrganizasyonTezliPackagesFromSeed() {
  const revision="2026-08-20-yonetim-organizasyon-tezli-v1";if(db.prepare("SELECT value FROM metadata WHERE key = ?").get("yonetim_organizasyon_tezli_packages_revision")?.value===revision)return;
  const packages=readCoursePackageSeeds().filter((x)=>normalizeScope(x.department||"")===normalizeScope("Yönetim Organizasyon")&&normalizeScope(x.programName||"")===normalizeScope("Yönetim Organizasyon")&&levelKey(x.level||"")==="tezli yl");const now=new Date().toISOString();const update=db.prepare(`UPDATE courses SET name = ?, credit = ?, ects = ?, theory = ?, practice = ?, status = 'Public', package_json = ?, updated_at = ? WHERE id = ?`);let changed=0;db.exec("BEGIN");try{for(const p of packages){const rows=courseRowsForIdentity({department:p.department,programName:p.programName,level:p.level,code:p.code});for(const c of rows){update.run(p.name||c.name,Number(p.credit||0),Number(p.ects||0),Number(p.theory||0),Number(p.practice||0),JSON.stringify(storedPackageFromSeed(p,{...c,programName:c.program_name})),now,c.id);changed+=1}}db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("yonetim_organizasyon_tezli_packages_revision",revision);audit("course.package.migrate","system",{scope:"Yönetim Organizasyon Tezli YL",revision,changed});db.exec("COMMIT")}catch(error){db.exec("ROLLBACK");throw error}
}

function qualityStats(filters = {}) {
  const courses = dbCourseList(filters);
  const instructorLoads = new Map();
  const termCounts = {};
  const typeCounts = {};
  const warnings = [];
  let completePackages = 0;
  let packagedCourses = 0;
  let workloadConsistent = 0;
  let matrixComplete = 0;
  let assignedCourses = 0;
  let processCourses = 0;
  let processResponsible = 0;

  for (const course of courses) {
    const row = findExactCourseRow(course);
    const hasPackage = Boolean(row?.package_json && row.package_json !== "{}");
    const packageData = parseJsonField(row?.package_json, {});
    if (hasPackage) packagedCourses += 1;
    const details = packageData.detailFields || {};
    const outcomes = Array.isArray(packageData.outcomes) ? packageData.outcomes : [];
    const weeks = packageData.weeklyTopics && typeof packageData.weeklyTopics === "object"
      ? Object.values(packageData.weeklyTopics).filter((value) => String(value || "").trim())
      : [];
    const matrix = Array.isArray(packageData.contributionMatrix) ? packageData.contributionMatrix : [];
    const workloads = packageData.workloads && typeof packageData.workloads === "object"
      ? Object.values(packageData.workloads)
      : [];
    const workloadTotal = workloads.reduce((sum, item) => sum + Number(item?.count || 0) * Number(item?.hours || 0), 0);
    const ects = Number(packageData.ects ?? course.ects ?? 0);
    const matrixOk = outcomes.length > 0 && matrix.length >= outcomes.length && matrix.slice(0, outcomes.length).every((matrixRow) =>
      Array.from({ length: 11 }, (_, index) => Number(matrixRow?.[`P${index + 1}`])).every((value) => value >= 1 && value <= 5)
    );
    const workloadOk = ects > 0 && Math.abs(workloadTotal - ects * 30) < 0.01;
    const packageOk = Boolean(
      String(details.purpose || "").trim() && String(details.content || "").trim() &&
      String(details.methods || "").trim() && String(details.resources || "").trim() &&
      outcomes.length > 0 && weeks.length === 15 && matrixOk && workloadOk &&
      Array.isArray(packageData.assessments) && packageData.assessments.length > 0
    );
    if (hasPackage && matrixOk) matrixComplete += 1;
    if (hasPackage && workloadOk) workloadConsistent += 1;
    if (packageOk) completePackages += 1;

    const normalizedName = normalizeScope(course.name || "");
    const processCourse = ["danismanlik", "uzmanlik alan", "tez calismasi", "doktora tezi", "doktora yeterlik", "seminer"]
      .some((label) => normalizedName.includes(label));
    const responsible = repairText(course.instructor || details.instructors || "").trim();
    if (processCourse) {
      processCourses += 1;
      if (responsible) processResponsible += 1;
    }
    if (responsible) assignedCourses += 1;
    if (responsible && normalizeScope(responsible) !== "ogrencinin danismani") {
      const current = instructorLoads.get(responsible) || { instructor: responsible, courses: 0, theory: 0, practice: 0, ects: 0 };
      current.courses += 1;
      current.theory += Number(course.theory || 0);
      current.practice += Number(course.practice || 0);
      current.ects += Number(course.ects || 0);
      instructorLoads.set(responsible, current);
    }
    const term = repairText(course.term || "Belirtilmemiş");
    const type = repairText(course.type || "Belirtilmemiş");
    termCounts[term] = (termCounts[term] || 0) + 1;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    const issues = [];
    if (!responsible) issues.push("Sorumlu atanmamış");
    if (!hasPackage) {
      issues.push("Ders bilgi paketi oluşturulmamış");
    } else {
      if (weeks.length !== 15) issues.push("15 haftalık plan eksik");
      if (!workloadOk) issues.push("AKTS–iş yükü tutarsız");
      if (!matrixOk) issues.push("DÖÇ–PÇ matrisi eksik");
      if (!packageOk && !issues.length) issues.push("Paket içeriği eksik");
    }
    if (issues.length) warnings.push({ code: course.code, name: course.name, issues });
  }
  return {
    scope: filters,
    generatedAt: new Date().toISOString(),
    totalCourses: courses.length,
    packagedCourses,
    completePackages,
    workloadConsistent,
    matrixComplete,
    assignedCourses,
    processCourses,
    processResponsible,
    termCounts,
    typeCounts,
    instructorLoads: [...instructorLoads.values()].sort((a, b) => b.courses - a.courses || a.instructor.localeCompare(b.instructor, "tr-TR")),
    warnings,
  };
}

function migrateYbsDoctorateContributionScale() {
  const rows = db.prepare(`
    SELECT id, department, level, package_json FROM courses
    WHERE package_json <> '{}'
  `).all().filter((row) =>
    normalizeScope(row.department || "").includes("yonetim bilisim sistemleri") &&
    levelKey(row.level || "") === "doktora"
  );
  const update = db.prepare("UPDATE courses SET package_json = ?, updated_at = ? WHERE id = ?");
  const now = new Date().toISOString();
  let changed = 0;
  for (const row of rows) {
    try {
      const packageData = JSON.parse(row.package_json || "{}");
      if (!Array.isArray(packageData.contributionMatrix)) continue;
      let rowChanged = false;
      packageData.contributionMatrix = packageData.contributionMatrix.map((matrixRow) => {
        if (!matrixRow || typeof matrixRow !== "object") return matrixRow;
        return Object.fromEntries(Object.entries(matrixRow).map(([key, value]) => {
          if (/^P\d+$/.test(key) && Number(value) === 0) {
            rowChanged = true;
            return [key, 1];
          }
          return [key, value];
        }));
      });
      if (rowChanged) {
        update.run(JSON.stringify(packageData), now, row.id);
        changed += 1;
      }
    } catch {
      // Geçersiz paket JSON'u bu hedefli migrasyonda değiştirilmez.
    }
  }
  if (changed) audit("course.matrix.scale.migrate", "system", { scope: "YBS Doktora", changed, scale: "1-5" });
}

function parseJsonField(value, fallback) {
  try {
    return repairObject(JSON.parse(value || JSON.stringify(fallback)));
  } catch {
    return fallback;
  }
}

function normalizeProfileLevel(value = "") {
  const text = repairText(value);
  if (text.includes("Tezsiz")) return "Tezsiz Yüksek Lisans";
  if (text.includes("Tezli")) return "Tezli Yüksek Lisans";
  if (text.includes("Doktora")) return "Doktora";
  return text || "Tezli Yüksek Lisans";
}

function normalizeProgramProfilePayload(profile = {}) {
  return {
    programName: repairText(profile.programName || "").trim(),
    level: normalizeProfileLevel(profile.level),
    degree: repairText(profile.degree || ""),
    manager: repairText(profile.manager || ""),
    language: repairText(profile.language || "Türkçe"),
    qualificationRules: repairText(profile.qualificationRules || ""),
    sections: Array.isArray(profile.sections)
      ? profile.sections.map((section) => ({
          title: repairText(section?.title || ""),
          text: repairText(section?.text || ""),
        }))
      : [],
    outcomes: Array.isArray(profile.outcomes) ? profile.outcomes.map((outcome) => repairText(outcome || "")) : [],
    tyycRows: Array.isArray(profile.tyycRows)
      ? profile.tyycRows.map((row) => ({
          code: repairText(row?.code || ""),
          title: repairText(row?.title || ""),
          values: Array.isArray(row?.values) ? row.values.map((value) => Number(value) || 0) : [],
        }))
      : [],
  };
}

function programProfileFromRow(row) {
  if (!row) return null;
  return {
    programName: repairText(row.program_name),
    level: normalizeProfileLevel(row.level),
    degree: repairText(row.degree),
    manager: repairText(row.manager),
    language: repairText(row.language || "Türkçe"),
    qualificationRules: repairText(row.qualification_rules),
    sections: parseJsonField(row.sections_json, []),
    outcomes: parseJsonField(row.outcomes_json, []),
    tyycRows: parseJsonField(row.tyyc_rows_json, []),
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function seedProgramProfiles(force = false) {
  let profiles = [];
  try {
    profiles = JSON.parse(readFileSync(programProfilesSeedFile, "utf8"));
  } catch {
    return;
  }
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO program_profiles(program_name, level, degree, manager, language, qualification_rules, sections_json, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'seed')
  `);
  let inserted = 0;
  db.exec("BEGIN");
  try {
    if (force) db.exec("DELETE FROM program_profiles");
    for (const rawProfile of profiles) {
      const profile = normalizeProgramProfilePayload(rawProfile);
      if (!profile.programName || !profile.level) continue;
      const result = insert.run(
        profile.programName,
        profile.level,
        profile.degree,
        profile.manager,
        profile.language,
        profile.qualificationRules,
        JSON.stringify(profile.sections),
        JSON.stringify(profile.outcomes),
        JSON.stringify(profile.tyycRows),
        now,
        now,
      );
      inserted += result.changes || 0;
    }
    if (inserted || force) {
      db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_program_profiles", "1");
      audit(force ? "program_profiles.seed.force" : "program_profiles.seed", "system", { profiles: profiles.length, inserted });
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function ensureTestProgramData() {
  const now = new Date().toISOString();
  const existing = db.prepare("SELECT id FROM programs WHERE department = ? AND program_name = ?").get(
    testProgramSeed.department,
    testProgramSeed.programName,
  );

  if (existing?.id) {
    db.prepare(`
      UPDATE programs
      SET main_department = ?, flags = ?, levels_json = ?, updated_at = ?
      WHERE id = ?
    `).run(
      testProgramSeed.mainDepartment,
      testProgramSeed.flags,
      JSON.stringify(testProgramSeed.levels),
      now,
      existing.id,
    );
  } else {
    db.prepare(`
      INSERT INTO programs(main_department, department, program_name, flags, levels_json, profile_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, '{}', ?, ?)
    `).run(
      testProgramSeed.mainDepartment,
      testProgramSeed.department,
      testProgramSeed.programName,
      testProgramSeed.flags,
      JSON.stringify(testProgramSeed.levels),
      now,
      now,
    );
  }

  db.prepare("INSERT OR IGNORE INTO public_visibility(key, visible, updated_at) VALUES (?, 0, ?)")
    .run(testProgramSeed.visibilityKey, now);
}

function getPublicVisibilityMap() {
  return Object.fromEntries(
    db.prepare("SELECT key, visible FROM public_visibility").all()
      .map((row) => [row.key, Boolean(row.visible)]),
  );
}

function canManagePublicVisibility(session) {
  return ["admin", "enstitu_yoneticisi"].includes(session?.role);
}

function upsertPublicVisibilityMap(visibility, actor) {
  const now = new Date().toISOString();
  const upsert = db.prepare(`
    INSERT INTO public_visibility(key, visible, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      visible = excluded.visible,
      updated_at = excluded.updated_at
  `);
  db.exec("BEGIN");
  try {
    for (const [key, visible] of Object.entries(visibility || {})) {
      if (!key || typeof visible !== "boolean") continue;
      upsert.run(key, visible ? 1 : 0, now);
    }
    audit("public_visibility.save", actor, { keys: Object.keys(visibility || {}).length });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function getProgramProfile(programName, level) {
  const row = db.prepare(`
    SELECT *
    FROM program_profiles
    WHERE program_name = ? AND level = ?
  `).get(repairText(programName || "").trim(), normalizeProfileLevel(level));
  return programProfileFromRow(row);
}

function upsertProgramProfile(profile, actor) {
  const normalized = normalizeProgramProfilePayload(profile);
  if (!normalized.programName || !normalized.level) {
    throw new Error("Program adı ve düzeyi zorunludur.");
  }
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO program_profiles(program_name, level, degree, manager, language, qualification_rules, sections_json, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(program_name, level) DO UPDATE SET
      degree = excluded.degree,
      manager = excluded.manager,
      language = excluded.language,
      qualification_rules = excluded.qualification_rules,
      sections_json = excluded.sections_json,
      outcomes_json = excluded.outcomes_json,
      tyyc_rows_json = excluded.tyyc_rows_json,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `).run(
    normalized.programName,
    normalized.level,
    normalized.degree,
    normalized.manager,
    normalized.language,
    normalized.qualificationRules,
    JSON.stringify(normalized.sections),
    JSON.stringify(normalized.outcomes),
    JSON.stringify(normalized.tyycRows),
    now,
    now,
    actor || "dbp-user",
  );
  audit("program_profile.save", actor, { programName: normalized.programName, level: normalized.level });
  return getProgramProfile(normalized.programName, normalized.level);
}

async function listBackups() {
  await mkdir(backupDir, { recursive: true });
  const names = await readdir(backupDir);
  const backups = [];
  for (const name of names.filter((item) => item.endsWith(".json"))) {
    const file = path.join(backupDir, name);
    const info = await stat(file);
    backups.push({ fileName: name, size: info.size, createdAt: info.mtime.toISOString() });
  }
  return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function tableRows(table) {
  return db.prepare(`SELECT * FROM ${table}`).all();
}

function exportData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tables: {
      metadata: tableRows("metadata"),
      users: tableRows("users"),
      user_roles: tableRows("user_roles"),
      role_module_access: tableRows("role_module_access"),
      programs: tableRows("programs"),
      program_profiles: tableRows("program_profiles"),
      courses: tableRows("courses"),
      public_visibility: tableRows("public_visibility"),
      workflow_requests: tableRows("workflow_requests"),
      attachments: tableRows("attachments"),
      audit_logs: tableRows("audit_logs"),
    },
  };
}

function replaceFromExport(payload, actor = "admin") {
  if (!payload?.tables || !Array.isArray(payload.tables.programs) || !Array.isArray(payload.tables.courses)) {
    throw new Error("Geçersiz DBP yedek dosyası.");
  }
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    for (const table of ["metadata", "user_roles", "users", "role_module_access", "programs", "program_profiles", "courses", "public_visibility", "workflow_requests", "attachments", "audit_logs"]) {
      db.exec(`DELETE FROM ${table}`);
    }
    const insertMetadata = db.prepare("INSERT INTO metadata(key, value) VALUES (?, ?)");
    for (const row of payload.tables.metadata || []) insertMetadata.run(row.key, String(row.value ?? ""));
    const insertUser = db.prepare(`
      INSERT INTO users(id, external_id, username, display_name, email, department, department_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of payload.tables.users || []) {
      insertUser.run(row.id || null, row.external_id || null, row.username, row.display_name || row.username, row.email || null, row.department || "", row.department_id || "", row.is_active ?? 1, row.created_at || now, row.updated_at || now);
    }
    const insertUserRole = db.prepare("INSERT INTO user_roles(id, user_id, role, department_id, created_at) VALUES (?, ?, ?, ?, ?)");
    for (const row of payload.tables.user_roles || []) {
      if (isKnownRole(row.role)) insertUserRole.run(row.id || null, row.user_id, row.role, row.department_id || "", row.created_at || now);
    }
    const insertRoleAccess = db.prepare("INSERT INTO role_module_access(role, module, enabled, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)");
    for (const row of payload.tables.role_module_access || []) {
      if (isKnownRole(row.role) && isKnownModule(row.module)) insertRoleAccess.run(row.role, row.module, row.enabled ? 1 : 0, row.updated_at || now, row.updated_by || "import");
    }
    const insertProgram = db.prepare(`
      INSERT INTO programs(id, main_department, department, program_name, flags, levels_json, profile_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of payload.tables.programs) {
      insertProgram.run(row.id || null, row.main_department, row.department, row.program_name, row.flags || "", row.levels_json || "[]", row.profile_json || "{}", row.created_at || now, row.updated_at || now);
    }
    const insertProgramProfile = db.prepare(`
      INSERT INTO program_profiles(id, program_name, level, degree, manager, language, qualification_rules, sections_json, outcomes_json, tyyc_rows_json, created_at, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of payload.tables.program_profiles || []) {
      insertProgramProfile.run(row.id || null, row.program_name, normalizeProfileLevel(row.level), row.degree || "", row.manager || "", row.language || "Türkçe", row.qualification_rules || "", row.sections_json || "[]", row.outcomes_json || "[]", row.tyyc_rows_json || "[]", row.created_at || now, row.updated_at || now, row.updated_by || "import");
    }
    const insertCourse = db.prepare(`
      INSERT INTO courses(id, academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of payload.tables.courses) {
      insertCourse.run(row.id || null, row.academic_year || "", row.program_code || "", row.department, row.program_name, row.level, row.code, row.name, row.type || "", row.credit || 0, row.ects || 0, row.theory || 0, row.practice || 0, row.term || "", row.status || "", row.instructor || "", row.source || "", row.package_json || "{}", row.created_at || now, row.updated_at || now);
    }
    const insertVisibility = db.prepare("INSERT INTO public_visibility(key, visible, updated_at) VALUES (?, ?, ?)");
    for (const row of payload.tables.public_visibility || []) insertVisibility.run(row.key, row.visible ? 1 : 0, row.updated_at || now);
    const insertWorkflow = db.prepare("INSERT INTO workflow_requests(id, kind, target, route, note, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    for (const row of payload.tables.workflow_requests || []) insertWorkflow.run(row.id || null, row.kind, row.target, row.route || "", row.note || "", row.status || "", row.created_by || "", row.created_at || now);
    const insertAttachment = db.prepare("INSERT INTO attachments(id, entity_type, entity_id, file_name, path, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    for (const row of payload.tables.attachments || []) insertAttachment.run(row.id || null, row.entity_type, row.entity_id || null, row.file_name, row.path, row.mime_type || "", row.size || 0, row.created_at || now);
    const insertAudit = db.prepare("INSERT INTO audit_logs(id, action, actor, payload_json, created_at) VALUES (?, ?, ?, ?, ?)");
    for (const row of payload.tables.audit_logs || []) insertAudit.run(row.id || null, row.action, row.actor || "", row.payload_json || "{}", row.created_at || now);
    audit("import.replace", actor, { programs: payload.tables.programs.length, courses: payload.tables.courses.length });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  seedDefaultRoleAccess();
  ensureTestProgramData();
}

function resetDatabase(actor) {
  db.exec("BEGIN");
  try {
    for (const table of ["programs", "program_profiles", "courses", "public_visibility", "workflow_requests", "attachments", "audit_logs"]) {
      db.exec(`DELETE FROM ${table}`);
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "reset_empty");
    audit("reset.empty", actor, {});
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  ensureTestProgramData();
}

async function databaseSize() {
  try {
    return (await stat(dbPath)).size;
  } catch {
    return 0;
  }
}

async function adminSummary() {
  await ensureDb();
  const latestCourses = db.prepare(`
    SELECT id, code, name, department, program_name, level, status, instructor, updated_at
    FROM courses
    ORDER BY id DESC
    LIMIT 12
  `).all();
  const latestPrograms = db.prepare(`
    SELECT id, main_department, department, program_name, levels_json, updated_at
    FROM programs
    ORDER BY id DESC
    LIMIT 12
  `).all().map((row) => ({ ...row, levels: JSON.parse(row.levels_json || "[]") }));
  const statusRows = db.prepare(`
    SELECT COALESCE(status, 'Belirsiz') AS status, COUNT(*) AS count
    FROM courses
    GROUP BY COALESCE(status, 'Belirsiz')
    ORDER BY count DESC
  `).all();
  return {
    dbPath,
    dataDir,
    backupDir,
    size: await databaseSize(),
    counts: {
      users: countRows("users"),
      userRoles: countRows("user_roles"),
      roleModuleAccess: countRows("role_module_access"),
      programs: countRows("programs"),
      programProfiles: countRows("program_profiles"),
      courses: countRows("courses"),
      publicVisibility: countRows("public_visibility"),
      workflowRequests: countRows("workflow_requests"),
      attachments: countRows("attachments"),
      auditLogs: countRows("audit_logs"),
      backups: (await listBackups()).length,
    },
    statusRows,
    latestCourses,
    latestPrograms,
    backups: await listBackups(),
  };
}

async function writeBackup(actor) {
  await ensureDb();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `dbp-backup-${stamp}.json`;
  const file = path.join(backupDir, fileName);
  const payload = exportData();
  await writeFile(file, JSON.stringify(payload, null, 2), "utf8");
  audit("backup.create", actor, { fileName });
  return { fileName, size: (await stat(file)).size, createdAt: new Date().toISOString() };
}

async function restoreBackup(fileName, actor) {
  if (!fileName || path.basename(fileName) !== fileName || !fileName.endsWith(".json")) {
    throw new Error("Geçersiz yedek dosyası adı.");
  }
  const file = path.join(backupDir, fileName);
  const payload = JSON.parse(await readFile(file, "utf8"));
  replaceFromExport(payload, actor);
  audit("backup.restore", actor, { fileName });
}

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

function normalizeObsText(value = "") {
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

function normalizeObsUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || "").trim());
  } catch {
    throw new Error("Geçerli bir OBS ders linki girin.");
  }
  if (url.hostname !== obsCourseHost || url.pathname !== obsCoursePath || !url.searchParams.get("curCourse")) {
    throw new Error("Yalnızca OBS ders detay linki kullanılabilir.");
  }
  url.protocol = "https:";
  url.searchParams.set("lang", url.searchParams.get("lang") || "tr");
  return url;
}

async function fetchObsHtml(rawUrl) {
  const url = normalizeObsUrl(rawUrl);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "LEE-DBP/1.0 (course-package draft import)",
      "Accept-Language": "tr-TR,tr;q=0.9",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`OBS sayfasına ulaşılamadı (${response.status}).`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const charset = response.headers.get("content-type")?.match(/charset=([^;\s]+)/i)?.[1] || "utf-8";
  try {
    return { html: new TextDecoder(charset).decode(buffer), url: url.toString() };
  } catch {
    return { html: new TextDecoder("utf-8").decode(buffer), url: url.toString() };
  }
}

function obsRowsFromTable($, table) {
  return $(table)
    .find("tr")
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

function parseObsCourseDraft(html, sourceUrl) {
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
  const outcomesTable = findObsTable(tables, (row) =>
    normalizeObsText(row[0]).includes("sira no") && normalizeObsText(row[1]).includes("aciklama"),
  );
  const outcomes = outcomesTable.slice(1).filter((row) => /^\d+$/.test(row[0] || "") && row[1]).map((row) => row[1]);
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

async function handleDbpApi(request) {
  const url = new URL(request.url);
  const pathname = stripBasePath(url.pathname);
  if (!pathname.startsWith("/api/dbp/")) return null;
  await ensureDb();

  try {
    if (pathname === "/api/dbp/health" && request.method === "GET") {
      return jsonResponse({ ok: true, dbPath, size: await databaseSize() });
    }

    if (pathname === "/api/dbp/course-pdf") {
      return await coursePdfResponse(request, url);
    }

    if (pathname === "/api/dbp/access" && request.method === "GET") {
      const auth = requireDbpSession(request);
      if (auth.error) return auth.error;
      upsertSessionUser(auth.session);
      return jsonResponse({
        role: auth.session.role,
        modules: modulesForRole(auth.session.role),
      });
    }

    if (pathname === "/api/dbp/obs-course-draft" && request.method === "POST") {
      const auth = requireDbpSession(request);
      if (auth.error) return auth.error;
      upsertSessionUser(auth.session);
      const body = await readJsonBody(request);
      const { html, url: sourceUrl } = await fetchObsHtml(body.url);
      const draft = parseObsCourseDraft(html, sourceUrl);
      if (!draft.code || !draft.name) {
        return jsonResponse({ message: "OBS ders bilgileri okunamadı. Linkin ders detay sayfası olduğundan emin olun." }, { status: 422 });
      }
      audit("course.obs.fetch", auth.session?.username || auth.session?.name || "dbp-user", {
        code: draft.code,
        obsCourseId: draft.obsCourseId,
      });
      return jsonResponse({ ok: true, draft });
    }

    if (pathname === "/api/dbp/courses" && request.method === "GET") {
      const filters = {
        q: url.searchParams.get("q") || "",
        department: url.searchParams.get("department") || "",
        programName: url.searchParams.get("programName") || "",
        level: url.searchParams.get("level") || "",
        instructor: url.searchParams.get("instructor") || "",
      };
      const limit = Math.max(0, Number(url.searchParams.get("limit") || 0));
      const courses = dbCourseList(filters);
      return jsonResponse({
        courses: limit ? courses.slice(0, limit) : courses,
        total: courses.length,
        source: "database",
      });
    }

    if (pathname === "/api/dbp/instructors" && request.method === "GET") {
      const auth = requireDbpSession(request);
      if (auth.error) return auth.error;
      const filters = {
        department: url.searchParams.get("department") || "",
        programName: url.searchParams.get("programName") || "",
      };
      const result = await loadEEnstituInstructorOptions(filters);
      return jsonResponse({
        instructors: result.instructors,
        total: result.instructors.length,
        source: result.source,
        scopeApplied: result.scopeApplied,
      });
    }

    if (pathname === "/api/dbp/quality-stats" && request.method === "GET") {
      const filters = {
        department: url.searchParams.get("department") || "Yönetim Bilişim Sistemleri ABD",
        programName: url.searchParams.get("programName") || "Yönetim Bilişim Sistemleri",
        level: url.searchParams.get("level") || "Doktora",
      };
      return jsonResponse({ ...qualityStats(filters), source: "database" });
    }

    if (pathname === "/api/dbp/course-management" && request.method === "POST") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      if (!["lee_ogrenci_isleri", "admin"].includes(auth.session.role)) {
        return jsonResponse({ message: "Ders açma ve öğretim elemanı atama yetkisi LEE Öğrenci İşleri rolündedir." }, { status: 403 });
      }
      const body = await readJsonBody(request);
      const actor = auth.session.username || auth.session.name || "dbp-user";
      const now = new Date().toISOString();
      const level = displayLevel(body.level);
      const code = repairText(String(body.code || "")).trim();
      if (!code || !body.department || !body.programName) {
        return jsonResponse({ message: "Ders kodu, ABD/ASD ve program zorunludur." }, { status: 400 });
      }
      if (body.action === "assign") {
        const result = db.prepare(`
          UPDATE courses SET instructor = ?, updated_at = ?
          WHERE code = ? AND department = ? AND program_name = ? AND level = ?
        `).run(body.instructor || "", now, code, body.department, body.programName, level);
        if (!result.changes) return jsonResponse({ message: "Atama yapılacak ders kaydı bulunamadı." }, { status: 404 });
        audit("course.assignment.update", actor, { code, department: body.department, programName: body.programName, level });
        return jsonResponse({ ok: true, changed: result.changes });
      }
      const existing = db.prepare(`SELECT id FROM courses WHERE code = ? AND department = ? AND program_name = ? AND level = ?`)
        .get(code, body.department, body.programName, level);
      if (existing) return jsonResponse({ message: "Bu ders kodu seçilen program ve düzeyde zaten bulunuyor." }, { status: 409 });
      db.prepare(`
        INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
        VALUES (?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 'Taslak', ?, 'lee_ogrenci_isleri', '{}', ?, ?)
      `).run(body.academicYear || "2026-2027", body.department, body.programName, level, code, repairText(String(body.name || "")).trim(), body.type || "Seçmeli", Number(body.credit || 0), Number(body.ects || 0), Number(body.theory || 0), Number(body.practice || 0), body.instructor || "", now, now);
      audit("course.create", actor, { code, department: body.department, programName: body.programName, level });
      return jsonResponse({ ok: true });
    }

    if (pathname === "/api/dbp/course-package" && request.method === "GET") {
      const query = {
        code: url.searchParams.get("code") || "",
        department: url.searchParams.get("department") || "",
        programName: url.searchParams.get("programName") || "",
        level: url.searchParams.get("level") || "",
      };
      if (!query.code || !query.level) return jsonResponse({ message: "Ders kodu ve düzeyi zorunludur." }, { status: 400 });
      const rows = courseRowsForIdentity(query);
      const publicOnly = url.searchParams.get("public") === "1";
      if (!publicOnly) {
        const auth = requireDbpSession(request);
        if (auth.error) return auth.error;
        if (!canEditCoursePackage(auth.session, query, rows) && !canReadCoursePackage(auth.session, query)) {
          return jsonResponse({ message: "Bu ders paketini görüntüleme veya güncelleme yetkiniz yok." }, { status: 403 });
        }
      }
      const row = rows.find((item) => {
        if (!publicOnly) return item.package_json && item.package_json !== "{}";
        return ["Yayımlandı", "Yayınlandı", "Public"].includes(repairText(item.status || "")) && item.package_json && item.package_json !== "{}";
      });
      if (!row) return jsonResponse({ package: null, status: "" });
      return jsonResponse({
        package: repairObject(JSON.parse(row.package_json || "{}")),
        status: repairText(row.status || ""),
        updatedAt: row.updated_at,
      });
    }

    if (pathname === "/api/dbp/course-package" && request.method === "POST") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      upsertSessionUser(auth.session);
      const body = await readJsonBody(request);
      const now = new Date().toISOString();
      const level = displayLevel(body.level);
      const actor = auth.session?.username || auth.session?.name || "dbp-user";
      if (!body.code || !body.name) {
        return jsonResponse({ message: "Ders kodu ve adi zorunludur." }, { status: 400 });
      }
      const matchingRows = courseRowsForIdentity(body);
      if (!canEditCoursePackage(auth.session, body, matchingRows)) {
        return jsonResponse({ message: "Bu ders paketi üzerinde kayıt yetkiniz yok." }, { status: 403 });
      }

      let update = { changes: 0 };
      if (matchingRows.length) {
        const updateById = db.prepare(`
          UPDATE courses
          SET status = ?, package_json = ?, updated_at = ?
          WHERE id = ?
        `);
        let changes = 0;
        for (const row of matchingRows) {
          changes += updateById.run(body.status || "Taslak", JSON.stringify(body.package || {}), now, row.id).changes;
        }
        update = { changes };
      }

      if (!update.changes) update = db.prepare(`
        UPDATE courses
        SET name = ?, status = ?, package_json = ?, updated_at = ?
        WHERE code = ?
          AND (? = '' OR department = ?)
          AND (? = '' OR program_name = ?)
          AND level = ?
      `).run(
        body.name,
        body.status || "Taslak",
        JSON.stringify(body.package || {}),
        now,
        body.code,
        body.department || "",
        body.department || "",
        body.programName || "",
        body.programName || "",
        level,
      );

      if (!update.changes) {
        const codeLevelMatches = db.prepare("SELECT id FROM courses WHERE code = ? AND level = ?").all(body.code, level);
        if (codeLevelMatches.length === 1) {
          update = db.prepare(`
            UPDATE courses
            SET name = ?, status = ?, package_json = ?, updated_at = ?
            WHERE id = ?
          `).run(
            body.name,
            body.status || "Taslak",
            JSON.stringify(body.package || {}),
            now,
            codeLevelMatches[0].id,
          );
        }
      }

      if (!update.changes) {
        db.prepare(`
          INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
          VALUES (?, '', ?, ?, ?, ?, ?, '', 0, 0, 0, 0, '', ?, ?, 'panel', ?, ?, ?)
        `).run(
          body.academicYear || "2026-2027",
          body.department || "",
          body.programName || "",
          level,
          body.code,
          body.name,
          body.status || "Taslak",
          actor,
          JSON.stringify(body.package || {}),
          now,
          now,
        );
      }
      audit("course.package.save", actor, { code: body.code, department: body.department || "", level });
      return jsonResponse({ ok: true, summary: { courses: countRows("courses") } });
    }

    if (pathname === "/api/dbp/course-package/status" && request.method === "POST") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      const body = await readJsonBody(request);
      if (!canApproveCoursePackage(auth.session, body)) {
        return jsonResponse({ message: "Bu ders paketini onaylama yetkiniz yok." }, { status: 403 });
      }
      const rows = courseRowsForIdentity(body).filter((row) => row.package_json && row.package_json !== "{}");
      if (!rows.length) return jsonResponse({ message: "Onaylanacak kayıtlı ders paketi bulunamadı." }, { status: 404 });
      const now = new Date().toISOString();
      const status = body.status || "Yayımlandı";
      const statement = db.prepare("UPDATE courses SET status = ?, updated_at = ? WHERE id = ?");
      for (const row of rows) statement.run(status, now, row.id);
      audit("course.package.status", auth.session.username || auth.session.name || "dbp-user", { code: body.code, status });
      return jsonResponse({ ok: true, status });
    }

    if (pathname === "/api/dbp/program-profile" && request.method === "GET") {
      const programName = url.searchParams.get("programName") || "";
      const level = url.searchParams.get("level") || "";
      return jsonResponse({ profile: getProgramProfile(programName, level) });
    }

    if (pathname === "/api/dbp/public-visibility" && request.method === "GET") {
      return jsonResponse({ visibility: getPublicVisibilityMap() });
    }

    if (pathname === "/api/dbp/public-visibility" && request.method === "PUT") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      if (!canManagePublicVisibility(auth.session)) {
        return jsonResponse({ message: "Public program gorunurlugunu yalnizca yetkili Enstitu rolleri kaydedebilir." }, { status: 403 });
      }
      upsertSessionUser(auth.session);
      const body = await readJsonBody(request);
      const actor = auth.session?.username || auth.session?.name || "dbp-user";
      upsertPublicVisibilityMap(body.visibility || {}, actor);
      return jsonResponse({ ok: true, visibility: getPublicVisibilityMap() });
    }

    if (pathname === "/api/dbp/program-profile" && request.method === "PUT") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      if (!["admin", "abd_asd_baskani"].includes(auth.session.role)) {
        return jsonResponse({ message: "Program bilgilerini yalnizca Admin veya ABD/ASD Baskani kaydedebilir." }, { status: 403 });
      }
      upsertSessionUser(auth.session);
      const body = await readJsonBody(request);
      const actor = auth.session?.username || auth.session?.name || "dbp-user";
      return jsonResponse({ ok: true, profile: upsertProgramProfile(body.profile || body, actor) });
    }

    if (!pathname.startsWith("/api/dbp/admin/")) {
      return jsonResponse({ message: "DBP API endpoint bulunamadı." }, { status: 404 });
    }

    const admin = requireAdmin(request);
    if (admin.error) return admin.error;
    upsertSessionUser(admin.session);
    const actor = admin.session?.username || admin.session?.name || "admin";

    if (pathname === "/api/dbp/admin/summary" && request.method === "GET") {
      return jsonResponse(await adminSummary());
    }

    if (pathname === "/api/dbp/admin/role-module-access" && request.method === "GET") {
      return jsonResponse({ access: roleAccessMap() });
    }

    if (pathname === "/api/dbp/admin/role-module-access" && request.method === "PUT") {
      const body = await readJsonBody(request);
      const access = normalizeRoleAccessPayload(body);
      replaceRoleAccess(access, actor);
      return jsonResponse({ ok: true, access: roleAccessMap() });
    }

    if (pathname === "/api/dbp/admin/export" && request.method === "GET") {
      const payload = JSON.stringify(exportData(), null, 2);
      return new Response(payload, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="dbp-export-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    if (pathname === "/api/dbp/admin/backups" && request.method === "GET") {
      return jsonResponse({ backups: await listBackups() });
    }

    if (pathname === "/api/dbp/admin/backup" && request.method === "POST") {
      return jsonResponse({ backup: await writeBackup(actor), backups: await listBackups() });
    }

    if (pathname === "/api/dbp/admin/restore" && request.method === "POST") {
      const body = await readJsonBody(request);
      await restoreBackup(body.fileName, actor);
      return jsonResponse({ ok: true, summary: await adminSummary() });
    }

    if (pathname === "/api/dbp/admin/import" && request.method === "POST") {
      const payload = await readJsonBody(request);
      await writeBackup(actor);
      replaceFromExport(payload, actor);
      return jsonResponse({ ok: true, summary: await adminSummary() });
    }

    if (pathname === "/api/dbp/admin/reset" && request.method === "POST") {
      const body = await readJsonBody(request);
      if (body.confirm !== "DBP_RESET") {
        return jsonResponse({ message: "Reset için DBP_RESET onayı gerekir." }, { status: 400 });
      }
      await writeBackup(actor);
      resetDatabase(actor);
      return jsonResponse({ ok: true, summary: await adminSummary() });
    }

    if (pathname === "/api/dbp/admin/seed" && request.method === "POST") {
      await writeBackup(actor);
      seedInitialData(true);
      syncCourseCatalogFromSeed();
      seedProgramProfiles(true);
      ensureTestProgramData();
      return jsonResponse({ ok: true, summary: await adminSummary() });
    }

    return jsonResponse({ message: "DBP API endpoint bulunamadı." }, { status: 404 });
  } catch (error) {
    console.error("[dbp] API error:", error);
    return jsonResponse({ message: error instanceof Error ? error.message : "DBP API hatası." }, { status: 500 });
  }
}

function stripBasePath(pathname) {
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);
  return pathname;
}

function shouldRedirectToBasePath(pathname) {
  if (pathname === "/" || pathname === basePath || pathname.startsWith(`${basePath}/`)) return false;
  if (pathname.startsWith("/api/")) return false;
  const publicRootPaths = new Set(["/sso", "/panel", "/yonetim", "/katalog"]);
  if (publicRootPaths.has(pathname)) return true;
  return pathname.startsWith("/sso/") ||
    pathname.startsWith("/panel/") ||
    pathname.startsWith("/yonetim/") ||
    pathname.startsWith("/katalog/") ||
    pathname.startsWith("/programlar/");
}

function safeClientFile(pathname) {
  const cleanPath = decodeURIComponent(stripBasePath(pathname)).replaceAll("\\", "/");
  const resolved = path.resolve(clientRoot, `.${cleanPath}`);
  if (!resolved.startsWith(`${clientRoot}${path.sep}`) && resolved !== clientRoot) {
    return null;
  }
  return resolved;
}

async function findClientFile(pathname) {
  const file = safeClientFile(pathname);
  if (!file) return null;

  try {
    const info = await stat(file);
    return info.isFile() ? { file, info } : null;
  } catch {
    return null;
  }
}

function staticHeaders(file, info) {
  const ext = path.extname(file).toLowerCase();
  const pathname = file.slice(clientRoot.length).replaceAll(path.sep, "/");
  return {
    "Content-Type": contentTypes[ext] || "application/octet-stream",
    "Content-Length": String(info.size),
    "Cache-Control": pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
  };
}

async function sendStaticFile(req, res, pathname) {
  const found = await findClientFile(pathname);
  if (!found) return false;

  res.writeHead(200, staticHeaders(found.file, found.info));
  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(found.file).pipe(res);
  return true;
}

async function fetchAsset(request) {
  const url = new URL(request.url);
  const found = await findClientFile(url.pathname);
  if (!found) return new Response("Not found", { status: 404 });

  return new Response(createReadStream(found.file), {
    headers: staticHeaders(found.file, found.info),
  });
}

function nodeRequestToWeb(req) {
  const origin = `http://${req.headers.host || `localhost:${port}`}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  return new Request(new URL(req.url || "/", origin), {
    method,
    headers,
    body: hasBody ? req : undefined,
    duplex: hasBody ? "half" : undefined,
  });
}

async function sendWebResponse(res, response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  res.writeHead(response.status, headers);
  if (!response.body) {
    res.end();
    return;
  }

  for await (const chunk of response.body) {
    res.write(chunk);
  }
  res.end();
}

const env = {
  ASSETS: { fetch: fetchAsset },
  IMAGES: {
    input() {
      return {
        transform() {
          return {
            async output() {
              return {
                response() {
                  return new Response("Image transform is not available.", { status: 501 });
                },
              };
            },
          };
        },
      };
    },
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `localhost:${port}`}`);

    if (url.pathname === basePath) {
      res.writeHead(308, { Location: `${basePath}/` });
      res.end();
      return;
    }

    if (shouldRedirectToBasePath(url.pathname)) {
      res.writeHead(308, { Location: `${basePath}${url.pathname}${url.search}` });
      res.end();
      return;
    }

    const apiResponse = await handleDbpApi(nodeRequestToWeb(req));
    if (apiResponse) {
      await sendWebResponse(res, apiResponse);
      return;
    }

    if (await sendStaticFile(req, res, url.pathname)) return;

    const response = await worker.fetch(nodeRequestToWeb(req), env, ctx);
    await sendWebResponse(res, response);
  } catch (error) {
    console.error("[dbp] Server error:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("Internal Server Error");
  }
}).listen(port, host, () => {
  const localUrl = `http://localhost:${port}${basePath}/`;
  console.log(`[dbp] Production server running at http://${host}:${port}${basePath}/`);
  console.log(`[dbp] Browser URL: ${localUrl}`);
  if (process.env.DBP_OPEN_BROWSER === "1") {
    console.log("[dbp] Browser aciliyor...");
    openBrowser(localUrl);
  }
});
