import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, lstatSync, mkdirSync, openSync, readSync, readdirSync, realpathSync, renameSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const copyScript = fileURLToPath(new URL("./sqliteBackupCopy.mjs", import.meta.url));
export const sqliteUploadLimit = 512 * 1024 * 1024;
const sqliteHeader = Buffer.from("SQLite format 3\0");

function failure(message, statusCode = 400) {
  return Object.assign(new Error(message), { statusCode });
}

export function isSqliteFile(file) {
  const descriptor = openSync(file, "r");
  try {
    const header = Buffer.alloc(sqliteHeader.length);
    return readSync(descriptor, header, 0, header.length, 0) === header.length && header.equals(sqliteHeader);
  } finally { closeSync(descriptor); }
}

export function sqliteBackupPath(directory, fileName, livePath) {
  if (typeof fileName !== "string" || path.basename(fileName) !== fileName ||
      /[\\/\x00-\x1f]/u.test(fileName) || !fileName.endsWith(".sqlite") || fileName.startsWith(".")) {
    throw failure("Geçersiz SQLite yedek dosyası adı.");
  }
  const file = path.join(directory, fileName);
  let info;
  try { info = lstatSync(file); }
  catch (error) {
    if (error.code === "ENOENT") throw failure("SQLite yedek dosyası bulunamadı. Listeyi yenileyin.", 404);
    throw error;
  }
  if (!info.isFile() || info.isSymbolicLink() || path.dirname(realpathSync(file)) !== realpathSync(directory)) {
    throw failure("Geçersiz SQLite yedek dosyası.");
  }
  const liveInfo = statSync(livePath);
  if (realpathSync(file) === realpathSync(livePath) || (info.dev === liveInfo.dev && info.ino === liveInfo.ino)) {
    throw failure("Aktif veritabanı bir yedek dosyası olarak kullanılamaz.");
  }
  return file;
}

export function listSqliteBackups(directory, livePath) {
  mkdirSync(directory, { recursive: true });
  return readdirSync(directory).filter((name) => name.endsWith(".sqlite") && !name.startsWith(".")).flatMap((fileName) => {
    try {
      const file = sqliteBackupPath(directory, fileName, livePath);
      if (!isSqliteFile(file)) return [];
      const info = statSync(file);
      return [{ fileName, size: info.size, createdAt: info.mtime.toISOString() }];
    } catch (error) {
      if (error.statusCode) return [];
      throw error;
    }
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function copySqliteSync(source, destination, standalone = false) {
  const result = spawnSync(process.execPath, [copyScript, source, destination, standalone ? "standalone" : "live"], {
    windowsHide: true, encoding: "utf8", timeout: 60_000, maxBuffer: 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw failure("SQLite kopyası oluşturulamadı. Veritabanının başka bir işlem tarafından kilitlenmediğini ve disk alanını kontrol edin.", 503);
  }
}

export function createSqliteBackup(directory, livePath, { beforeRestore = false, temporary: transient = false } = {}) {
  mkdirSync(directory, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const fileName = `${transient ? "." : ""}dbp-${transient ? "export" : beforeRestore ? "before-restore" : "backup"}-${stamp}-${randomUUID().slice(0, 8)}.sqlite`;
  const temporary = path.join(directory, `.${fileName}.partial`);
  const file = path.join(directory, fileName);
  try {
    copySqliteSync(livePath, temporary, true);
    renameSync(temporary, file);
    const info = statSync(file);
    return { fileName, size: info.size, createdAt: info.mtime.toISOString() };
  } finally {
    for (const suffix of ["", "-wal", "-shm", "-journal"]) {
      try { unlinkSync(`${temporary}${suffix}`); } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
  }
}

export function validateSqliteBackup(file, liveDb) {
  let candidate;
  try {
    if (!isSqliteFile(file)) throw failure("Geçerli bir SQLite yedek dosyası seçin.");
    candidate = new DatabaseSync(file, { readOnly: true });
    candidate.exec("PRAGMA trusted_schema = OFF; PRAGMA query_only = ON;");
    const integrity = candidate.prepare("PRAGMA integrity_check").all();
    if (integrity.length !== 1 || Object.values(integrity[0])[0] !== "ok" || candidate.prepare("PRAGMA foreign_key_check").all().length) {
      throw failure("SQLite yedeğinin bütünlük kontrolü başarısız. Mevcut veritabanı değiştirilmedi.");
    }
    if (candidate.prepare("PRAGMA page_size").get().page_size !== liveDb.prepare("PRAGMA page_size").get().page_size) {
      throw failure("SQLite yedeğinin sayfa boyutu mevcut veritabanıyla uyumlu değil.");
    }
    // Preserve every current schema object, including constraints and indexes
    // used by upserts. Native backups retain their original CREATE statements.
    // Backups with an older/incompatible schema must be migrated separately.
    const required = liveDb.prepare("SELECT type, name, sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' AND sql IS NOT NULL").all();
    const findObject = candidate.prepare("SELECT sql FROM sqlite_schema WHERE type = ? AND name = ?");
    for (const { type, name, sql } of required) {
      if (findObject.get(type, name)?.sql !== sql) {
        throw failure(`SQLite yedeği bu uygulama sürümüyle uyumlu değil (${name}). Mevcut veritabanı değiştirilmedi.`);
      }
    }
  } catch (error) {
    if (error.statusCode) throw error;
    throw failure("SQLite dosyası okunamadı veya bu uygulamayla uyumlu değil. Mevcut veritabanı değiştirilmedi.");
  } finally { candidate?.close(); }
}

export function restoreSqliteBackup(file, liveDb, directory, livePath) {
  validateSqliteBackup(file, liveDb);
  if (liveDb.isTransaction) throw failure("Devam eden veritabanı işlemi var. Lütfen tekrar deneyin.", 409);
  // No await between safety backup and restore: requests and scheduled writers
  // cannot run between them. The native backup API commits the replacement in
  // one destination transaction; the server's existing connection stays valid.
  const safetyBackup = createSqliteBackup(directory, livePath, { beforeRestore: true });
  copySqliteSync(file, livePath);
  return safetyBackup;
}
