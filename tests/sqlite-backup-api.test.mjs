import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createReadStream, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { mkdir, open, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import test from "node:test";
import { recordAudit, withAuditRequest } from "../lib/auditTrail.mjs";
import { signDbpSession } from "../lib/serverSession.mjs";
import { createSqliteBackup, listSqliteBackups, restoreSqliteBackup, sqliteBackupPath, sqliteUploadLimit } from "../lib/sqliteBackups.mjs";

process.env.DBP_SESSION_SECRET = "sqlite-api-tests-only-independent-signing-key";
const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = [...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)].map(([declaration]) => declaration).join("\n");

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "dbp-sqlite-api-"));
  const dbPath = path.join(root, "dbp.sqlite");
  const backupDir = path.join(root, "backups");
  const db = new DatabaseSync(dbPath);
  db.exec(source.match(/db\.exec\(`(\s+PRAGMA journal_mode = WAL;[\s\S]*?)`\);/u)[1]);
  db.exec("INSERT INTO metadata VALUES('test-sentinel', 'snapshot'); CREATE TABLE future_module(note TEXT); INSERT INTO future_module VALUES('all tables');");
  t.after(() => {
    db.close();
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith("dbp-sqlite-api-"));
    rmSync(root, { recursive: true, force: true });
  });
  const context = vm.createContext({
    db, dbPath, backupDir, path, Request, Response, URL, Buffer, randomUUID, createReadStream,
    mkdir, open, readFile, readdir, stat, unlink, writeFile, recordAudit,
    createSqliteBackup, listSqliteBackups, restoreSqliteBackup, sqliteBackupPath, sqliteUploadLimit,
    console: { ...console, error() {} }, basePath: "/dbp",
    homeStatsRefreshPromise: undefined, qualitySnapshotRefreshPromise: undefined, studentStatisticsRefreshPromise: undefined,
    thesisSyncPromise: undefined, scopusSyncPromise: undefined, trDizinSyncPromise: undefined,
    publicCourseRouteIndexCache: "stale", homeStatsCache: "stale", homeStatsCacheCreatedAt: 100,
    qualitySnapshotCache: "stale", studentStatisticsSnapshotCache: "stale", thesisSnapshotCache: "stale",
    scopusSnapshotCache: "stale", trDizinSnapshotCache: "stale",
  });
  vm.runInContext(declarations, context);
  Object.assign(context, {
    ensureDb() {}, upsertSessionUser() {}, queueHomeStatsCacheRefresh() {}, queueQualitySnapshotRefresh() {},
    readStudentStatisticsSnapshot: () => null, readThesisSnapshot: () => null, readScopusSnapshot: () => null, readTrDizinSnapshot: () => null,
  });
  const admin = signDbpSession({ username: "test-admin", name: "Test Admin", role: "admin", expiresAt: new Date(Date.now() + 3600000).toISOString() });
  const run = (endpoint, { method = "GET", body, user = admin, headers = {} } = {}) => {
    const req = new Request(`https://dbp.example/dbp/api/dbp/admin/${endpoint}`, {
      method, headers: {
        "Content-Type": body instanceof Uint8Array ? "application/octet-stream" : "application/json",
        ...(user ? { "X-DBP-Session": `uri:${encodeURIComponent(JSON.stringify(user))}` } : {}), ...headers,
      },
      ...(body === undefined ? {} : { body: body instanceof Uint8Array ? body : JSON.stringify(body) }),
    });
    return withAuditRequest(req, context.handleDbpApi, { getDb: () => db });
  };
  return { db, dbPath, backupDir, context, run };
}

test("SQLite API creates, lists, downloads exact bytes, restores with a safety backup, clears caches and deletes only the selected backup", async (t) => {
  const { db, dbPath, backupDir, context, run } = fixture(t);
  const created = await run("sqlite/backup", { method: "POST" });
  assert.equal(created.status, 200);
  const { backup } = await created.json();
  assert.equal((await (await run("sqlite/backups")).json()).backups.length, 1);
  const original = await readFile(path.join(backupDir, backup.fileName));
  const downloaded = await run(`sqlite/backup/download?${new URLSearchParams({ fileName: backup.fileName })}`);
  assert.equal(downloaded.status, 200);
  assert.match(downloaded.headers.get("Content-Disposition"), /\.sqlite/u);
  assert.match(downloaded.headers.get("Cache-Control"), /no-store/u);
  assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), original);
  db.exec("UPDATE metadata SET value='after' WHERE key='test-sentinel'");
  const restored = await run("sqlite/restore", { method: "POST", body: { fileName: backup.fileName } });
  assert.equal(restored.status, 200);
  const { safetyBackup } = await restored.json();
  assert.equal(db.prepare("SELECT value FROM metadata WHERE key='test-sentinel'").get().value, "snapshot");
  assert.equal(context.homeStatsCache, undefined);
  assert.equal(context.publicCourseRouteIndexCache, undefined);
  assert.equal(context.thesisSnapshotCache, null);
  const safety = new DatabaseSync(path.join(backupDir, safetyBackup.fileName), { readOnly: true });
  assert.equal(safety.prepare("SELECT value FROM metadata WHERE key='test-sentinel'").get().value, "after");
  safety.close();
  const audit = db.prepare("SELECT payload_json FROM audit_logs WHERE action='backup.restore' ORDER BY id DESC LIMIT 1").get();
  assert.equal(JSON.parse(audit.payload_json).format, "sqlite");
  const deleted = await run("sqlite/backup", { method: "DELETE", body: { fileName: backup.fileName } });
  assert.equal(deleted.status, 200);
  assert.deepEqual(listSqliteBackups(backupDir, dbPath).map((item) => item.fileName), [safetyBackup.fileName]);
});

test("SQLite upload restores validated bytes, rejects corrupt/oversized files, and cleans temporary files", async (t) => {
  const { db, backupDir, run } = fixture(t);
  const created = await (await run("sqlite/backup", { method: "POST" })).json();
  const bytes = await readFile(path.join(backupDir, created.backup.fileName));
  db.exec("UPDATE metadata SET value='after' WHERE key='test-sentinel'");
  assert.equal((await run("sqlite/import", { method: "POST", body: bytes })).status, 200);
  assert.equal(db.prepare("SELECT value FROM metadata WHERE key='test-sentinel'").get().value, "snapshot");
  assert.equal((await run("sqlite/import", { method: "POST", body: Buffer.from("bad file") })).status, 400);
  assert.equal((await run("sqlite/import", { method: "POST", body: Buffer.from("x"), headers: { "Content-Length": String(sqliteUploadLimit + 1) } })).status, 413);
  assert.equal((await run("sqlite/import", { method: "POST", body: Buffer.alloc(0) })).status, 400);
  assert.ok((await readdir(backupDir)).every((name) => !name.startsWith(".sqlite-upload-")));
});

test("native endpoints enforce verified administrator access and reject invalid paths and conflicting background work", async (t) => {
  const { context, run } = fixture(t);
  const teacher = signDbpSession({ username: "teacher", name: "Teacher", role: "akademisyen", expiresAt: new Date(Date.now() + 3600000).toISOString() });
  for (const [endpoint, method, body] of [
    ["sqlite/backups", "GET"], ["sqlite/export", "GET"], ["sqlite/backup", "POST"],
    ["sqlite/backup", "DELETE", { fileName: "x.sqlite" }], ["sqlite/backup/download?fileName=x.sqlite", "GET"],
    ["sqlite/restore", "POST", { fileName: "x.sqlite" }], ["sqlite/import", "POST", Buffer.from("binary")],
  ]) {
    for (const user of [null, teacher, { ...teacher, role: "admin" }]) {
      assert.equal((await run(endpoint, { method, body, user })).status, 403, `${method} ${endpoint}`);
    }
  }
  assert.equal((await run("sqlite/backup/download?fileName=..%2Fdbp.sqlite")).status, 400);
  assert.equal((await run("sqlite/backup/download?fileName=missing.sqlite")).status, 404);
  const { backup } = await (await run("sqlite/backup", { method: "POST" })).json();
  context.thesisSyncPromise = Promise.resolve();
  assert.equal((await run("sqlite/restore", { method: "POST", body: { fileName: backup.fileName } })).status, 409);
});

test("JSON list excludes maintenance reports and native export downloads without adding a stored backup", async (t) => {
  const { backupDir, run, context } = fixture(t);
  await mkdir(backupDir);
  await writeFile(path.join(backupDir, "maintenance-report.json"), JSON.stringify({ status: "committed", changes: [] }));
  await writeFile(path.join(backupDir, "dbp-backup.json"), JSON.stringify({ version: 2, exportedAt: "2026-11-26T10:00:00Z", tables: { metadata: [], programs: [], courses: [] } }));
  assert.deepEqual(Array.from(await context.listBackups(), (item) => item.fileName), ["dbp-backup.json"]);
  const exported = await run("sqlite/export");
  assert.equal(exported.status, 200);
  assert.equal(Buffer.from(await exported.arrayBuffer()).subarray(0, 16).toString(), "SQLite format 3\0");
  // Stream close cleanup runs after its final bytes have been consumed.
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.deepEqual((await readdir(backupDir)).sort(), ["dbp-backup.json", "maintenance-report.json"]);
});
