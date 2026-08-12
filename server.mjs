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
let db;

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

function repairObject(value) {
  if (typeof value === "string") return repairText(value);
  if (Array.isArray(value)) return value.map(repairObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairObject(item)]));
  }
  return value;
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
  if (!code || !name) {
    return jsonResponse({ message: "PDF için ders kodu ve ders adi gerekir." }, { status: 400 });
  }

  await mkdir(pdfCacheDir, { recursive: true });
  const target = pdfCacheFile({ code, program, name });
  let info = null;
  try {
    info = await stat(target);
  } catch {
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
    ]);
    info = await stat(target);
  }

  const headers = {
    "Content-Type": "application/pdf",
    "Content-Length": String(info.size),
    "Cache-Control": "public, max-age=3600",
    "Content-Disposition": `inline; filename="${cacheSlug(code, "ders")}-${cacheSlug(name, "pdf")}.pdf"`,
  };
  return new Response(request.method === "HEAD" ? null : createReadStream(target), { headers });
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
const ybsDefaultDepartment = "Yönetim Bilişim Sistemleri ABD";
const ybsDefaultProgramName = "Yönetim Bilişim Sistemleri";

function canonicalCourseCode(code = "") {
  const normalizedCode = repairText(code).trim().toLocaleUpperCase("tr-TR");
  if (ybsSpecializationCodes.has(normalizedCode)) return "YBS9XX";
  if (ybsThesisCodes.has(normalizedCode)) return "YBS91X";
  if (normalizedCode === "YBS909") return "YBS999";
  if (normalizedCode === "YBS918") return "YBS917";
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
  return [...candidates].filter(Boolean);
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
  if (name.includes("BİLİMSEL ARAŞTIRMA")) return false;
  return ["DANIŞMANLIK", "UZMANLIK ALAN DERSİ", "SEMİNER", "DOKTORA YETERLİK", "DOKTORA TEZİ", "TEZ ÇALIŞMASI"]
    .some((label) => name.includes(label));
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
    const trustedMergedPoolCodes = new Set(["YBS9XX", "YBS91X"]);
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
  };
}

function isStaticSeedPackage(packageJson = "{}") {
  try {
    return Boolean(JSON.parse(packageJson || "{}")?.staticSeed);
  } catch {
    return false;
  }
}

function findSeedPackageForCode(packages, code) {
  const normalizedCode = canonicalCourseCode(code);
  return packages.find((coursePackage) =>
    coursePackage.code === normalizedCode || coursePackage.aliases?.includes(normalizedCode)
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
      const packageSeed = findSeedPackageForCode(packageSeeds, course.code);
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
        instructor = CASE WHEN COALESCE(TRIM(instructor), '') = '' THEN ? ELSE instructor END,
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
      const packageSeed = findSeedPackageForCode(packageSeeds, course.code);
      const seededPackageJson = packageSeed ? JSON.stringify(storedPackageFromSeed(packageSeed, course)) : "{}";
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
          course.instructor || "",
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
        course.instructor || "",
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
        department: ybsDefaultDepartment,
        programName: ybsDefaultProgramName,
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
      if (findExactCourseRow(packageCourse)) continue;
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

      let update = db.prepare(`
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
