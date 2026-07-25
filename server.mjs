import { createReadStream, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";
import { DatabaseSync } from "node:sqlite";

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
const seedFile = process.env.DBP_SEED_FILE || path.join(__dirname, "seed", "program-data-local.js");
let db;

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

async function readJsonBody(request) {
  const text = await request.text();
  if (!text.trim()) return {};
  return JSON.parse(text);
}

function parseSession(request) {
  const raw = request.headers.get("x-dbp-session") || "";
  if (!raw) return null;
  try {
    return JSON.parse(raw);
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
  return db;
}

function countRows(table) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
}

function audit(action, actor, payload = {}) {
  db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)")
    .run(action, actor || null, JSON.stringify(payload), new Date().toISOString());
}

function seedInitialData(force = false) {
  const seeded = db.prepare("SELECT value FROM metadata WHERE key = ?").get("seeded_from_current_data")?.value;
  if (!force && seeded === "1") return;
  if (!force && (countRows("programs") > 0 || countRows("courses") > 0)) {
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "1");
    return;
  }
  let source;
  try {
    source = readFileSync(seedFile, "utf8");
  } catch {
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "1");
    return;
  }
  const sandbox = { window: {}, localStorage: { getItem: () => "{}", setItem: () => {} } };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: seedFile });
  const programRows = repairObject(sandbox.window.LEE_DBP_PROGRAM_ROWS || []);
  const officialCourses = repairObject(sandbox.window.LEE_DBP_OFFICIAL_COURSES || []);
  const now = new Date().toISOString();
  const insertProgram = db.prepare(`
    INSERT INTO programs(main_department, department, program_name, flags, levels_json, profile_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, '{}', ?, ?)
  `);
  const insertCourse = db.prepare(`
    INSERT INTO courses(academic_year, program_code, department, program_name, level, code, name, type, credit, ects, theory, practice, term, status, instructor, source, package_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '{}', ?, ?)
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
      programs: tableRows("programs"),
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
    for (const table of ["metadata", "programs", "courses", "public_visibility", "workflow_requests", "attachments", "audit_logs"]) {
      db.exec(`DELETE FROM ${table}`);
    }
    const insertMetadata = db.prepare("INSERT INTO metadata(key, value) VALUES (?, ?)");
    for (const row of payload.tables.metadata || []) insertMetadata.run(row.key, String(row.value ?? ""));
    const insertProgram = db.prepare(`
      INSERT INTO programs(id, main_department, department, program_name, flags, levels_json, profile_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of payload.tables.programs) {
      insertProgram.run(row.id || null, row.main_department, row.department, row.program_name, row.flags || "", row.levels_json || "[]", row.profile_json || "{}", row.created_at || now, row.updated_at || now);
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
}

function resetDatabase(actor) {
  db.exec("BEGIN");
  try {
    for (const table of ["programs", "courses", "public_visibility", "workflow_requests", "attachments", "audit_logs"]) {
      db.exec(`DELETE FROM ${table}`);
    }
    db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES (?, ?)").run("seeded_from_current_data", "reset_empty");
    audit("reset.empty", actor, {});
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
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
      programs: countRows("programs"),
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

async function handleDbpApi(request) {
  const url = new URL(request.url);
  const pathname = stripBasePath(url.pathname);
  if (!pathname.startsWith("/api/dbp/")) return null;
  await ensureDb();

  try {
    if (pathname === "/api/dbp/health" && request.method === "GET") {
      return jsonResponse({ ok: true, dbPath, size: await databaseSize() });
    }

    if (pathname === "/api/dbp/course-package" && request.method === "POST") {
      const auth = requireDbpSession(request, { write: true });
      if (auth.error) return auth.error;
      const body = await readJsonBody(request);
      const now = new Date().toISOString();
      const level = normalizeLevel(body.level);
      const actor = auth.session?.username || auth.session?.name || "dbp-user";
      if (!body.code || !body.name) {
        return jsonResponse({ message: "Ders kodu ve adi zorunludur." }, { status: 400 });
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

    if (!pathname.startsWith("/api/dbp/admin/")) {
      return jsonResponse({ message: "DBP API endpoint bulunamadı." }, { status: 404 });
    }

    const admin = requireAdmin(request);
    if (admin.error) return admin.error;
    const actor = admin.session?.username || admin.session?.name || "admin";

    if (pathname === "/api/dbp/admin/summary" && request.method === "GET") {
      return jsonResponse(await adminSummary());
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
  console.log(`[dbp] Production server running at http://${host}:${port}${basePath}/`);
});
