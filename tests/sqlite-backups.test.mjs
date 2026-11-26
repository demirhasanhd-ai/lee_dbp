import assert from "node:assert/strict";
import { linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { createSqliteBackup, listSqliteBackups, restoreSqliteBackup, sqliteBackupPath, validateSqliteBackup } from "../lib/sqliteBackups.mjs";

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "dbp-sqlite-backup-"));
  const livePath = path.join(root, "dbp.sqlite");
  const directory = path.join(root, "backups");
  mkdirSync(directory);
  const db = new DatabaseSync(livePath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; PRAGMA foreign_keys=ON;
    CREATE TABLE programs(id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE courses(id INTEGER PRIMARY KEY, program_id INTEGER REFERENCES programs(id), name TEXT);
    CREATE TABLE future_module(id INTEGER PRIMARY KEY, note TEXT);
    CREATE INDEX future_note ON future_module(note);
    CREATE TRIGGER future_insert AFTER INSERT ON programs BEGIN INSERT INTO future_module(note) VALUES(new.name); END;
    INSERT INTO programs VALUES(1, 'İlk program');
    INSERT INTO courses VALUES(1, 1, 'Güncel WAL verisi');`);
  t.after(() => {
    db.close();
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith("dbp-sqlite-backup-"));
    rmSync(root, { recursive: true, force: true });
  });
  return { root, livePath, directory, db };
}

test("native backup includes WAL data, future tables, indexes and triggers; restore keeps the live connection usable", (t) => {
  const { livePath, directory, db } = fixture(t);
  const backup = createSqliteBackup(directory, livePath);
  const file = sqliteBackupPath(directory, backup.fileName, livePath);
  const saved = new DatabaseSync(file, { readOnly: true });
  assert.equal(saved.prepare("SELECT name FROM courses").get().name, "Güncel WAL verisi");
  assert.equal(saved.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
  assert.equal(saved.prepare("SELECT count(*) AS n FROM future_module").get().n, 1);
  assert.equal(saved.prepare("SELECT count(*) AS n FROM sqlite_schema WHERE name IN ('future_note', 'future_insert')").get().n, 2);
  saved.close();

  const prepared = db.prepare("SELECT name FROM courses WHERE id=1");
  db.prepare("UPDATE courses SET name=?").run("Yedek sonrası değişiklik");
  const safety = restoreSqliteBackup(file, db, directory, livePath);
  assert.equal(prepared.get().name, "Güncel WAL verisi");
  assert.equal(db.prepare("PRAGMA journal_mode").get().journal_mode, "wal");
  db.exec("INSERT INTO programs VALUES(2, 'Geri yükleme sonrası')");
  assert.equal(db.prepare("SELECT count(*) AS n FROM future_module").get().n, 2);
  const safetyDb = new DatabaseSync(path.join(directory, safety.fileName), { readOnly: true });
  assert.equal(safetyDb.prepare("SELECT name FROM courses").get().name, "Yedek sonrası değişiklik");
  safetyDb.close();
  assert.equal(listSqliteBackups(directory, livePath).length, 2);
  const observer = new DatabaseSync(livePath, { readOnly: true });
  assert.equal(observer.prepare("SELECT count(*) AS n FROM programs").get().n, 2);
  observer.close();
});

test("corrupt, foreign and incompatible databases are rejected before changing data or making a safety backup", (t) => {
  const { root, livePath, directory, db } = fixture(t);
  const invalid = path.join(root, "invalid.sqlite");
  writeFileSync(invalid, "not a database");
  assert.throws(() => restoreSqliteBackup(invalid, db, directory, livePath), /SQLite/u);
  const foreign = path.join(root, "foreign.sqlite");
  const foreignDb = new DatabaseSync(foreign);
  foreignDb.exec("CREATE TABLE unrelated(id INTEGER)");
  foreignDb.close();
  assert.throws(() => restoreSqliteBackup(foreign, db, directory, livePath), /uyumlu değil/u);
  const backup = createSqliteBackup(directory, livePath);
  const candidate = path.join(directory, backup.fileName);
  const candidateDb = new DatabaseSync(candidate);
  candidateDb.exec("PRAGMA foreign_keys=OFF; INSERT INTO courses VALUES(99, 999, 'Orphan')");
  candidateDb.close();
  assert.throws(() => validateSqliteBackup(candidate, db), /bütünlük/u);
  const missingIndexDb = new DatabaseSync(candidate);
  missingIndexDb.exec("DELETE FROM courses WHERE id=99; DROP INDEX future_note;");
  missingIndexDb.close();
  assert.throws(() => validateSqliteBackup(candidate, db), /future_note/u);
  assert.equal(db.prepare("SELECT name FROM courses").get().name, "Güncel WAL verisi");
  assert.equal(listSqliteBackups(directory, livePath).length, 1);
});

test("SQLite file operations reject traversal, JSON files, live files and hard links to the live database", (t) => {
  const { root, directory, livePath } = fixture(t);
  for (const name of ["../dbp.sqlite", "..\\dbp.sqlite", "report.json", ".private.sqlite", "a\n.sqlite", null]) {
    assert.throws(() => sqliteBackupPath(directory, name, livePath), /Geçersiz/u);
  }
  assert.throws(() => sqliteBackupPath(directory, "missing.sqlite", livePath), (error) => error.statusCode === 404);
  assert.throws(() => sqliteBackupPath(root, "dbp.sqlite", livePath), /Aktif/u);
  const hardLink = path.join(directory, "live-link.sqlite");
  linkSync(livePath, hardLink);
  assert.throws(() => sqliteBackupPath(directory, "live-link.sqlite", livePath), /Aktif/u);
  writeFileSync(path.join(directory, "fake.sqlite"), "garbage");
  mkdirSync(path.join(directory, "folder.sqlite"));
  writeFileSync(path.join(directory, "report.json"), "{}");
  assert.deepEqual(listSqliteBackups(directory, livePath), []);
});

test("direct export is hidden from stored backups and an active transaction blocks restore", (t) => {
  const { directory, livePath, db } = fixture(t);
  const exported = createSqliteBackup(directory, livePath, { temporary: true });
  assert.equal(readFileSync(path.join(directory, exported.fileName)).subarray(0, 16).toString(), "SQLite format 3\0");
  assert.deepEqual(listSqliteBackups(directory, livePath), []);
  db.exec("BEGIN");
  try {
    assert.throws(() => restoreSqliteBackup(path.join(directory, exported.fileName), db, directory, livePath), (error) => error.statusCode === 409);
  } finally { db.exec("ROLLBACK"); }
  unlinkSync(path.join(directory, exported.fileName));
  assert.deepEqual(readdirSync(directory), []);
});
