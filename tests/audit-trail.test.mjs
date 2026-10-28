import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import vm from "node:vm";
import { recordAudit, withAuditRequest, auditNavigation, queryAudit, auditCsv, auditExportHeaders, auditExportRows } from "../lib/auditTrail.mjs";
import { requestSession, signDbpSession, verifyDbpSession } from "../lib/serverSession.mjs";

// No live server, environment file, database, signing file or external identity service.
process.env.DBP_SESSION_SECRET = "audit-tests-only-independent-signing-key";
const source = readFileSync(new URL("../server.mjs", import.meta.url), "utf8");
const declarations = [...source.matchAll(/^(?:async )?function (\w+)\([^\n]*\) \{[\s\S]*?^\}/gm)];
const unsigned = (username = "teacher", role = "akademisyen") => ({ username, name: `Kullanıcı ${username}`, role, department: "İşletme ABD", expiresAt: new Date(Date.now() + 3600000).toISOString() });
const session = (username, role) => signDbpSession(unsigned(username, role));
const request = (endpoint, user, body) => new Request(`https://dbp.example/dbp/api/dbp/${endpoint}`, {
  method: body === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json", ...(user ? { "X-DBP-Session": `uri:${encodeURIComponent(JSON.stringify(user))}` } : {}) },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

function fixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(source.match(/db\.exec\(`(\s+PRAGMA journal_mode = WAL;[\s\S]*?)`\);/)[1]);
  const context = vm.createContext({ db, Request, Response, URL, console, recordAudit, queryAudit, auditCsv, auditExportHeaders, auditExportRows, basePath: "/dbp" });
  vm.runInContext(declarations.map(([declaration]) => declaration).join("\n"), context);
  Object.assign(context, {
    ensureDb() {}, upsertSessionUser() {}, seedDefaultRoleAccess() {}, ensureTestProgramData() {},
    modulesForRole: (role) => role === "admin" ? ["audit_logs", "my_courses"] : ["my_courses"],
    isKnownModule: (module) => ["audit_logs", "my_courses", "commission_review"].includes(module),
    committeeMembershipsForSession: () => [],
  });
  const run = (req, handler = context.handleDbpApi, options = {}) => withAuditRequest(req, handler, { getDb: () => db, ...options });
  return { db, context, run };
}

test("signed sessions reject role/name tampering, expiry and unsigned production claims", () => {
  const user = session("chair", "abd_asd_baskani");
  assert.equal(verifyDbpSession(user)?.role, "abd_asd_baskani");
  assert.equal(verifyDbpSession({ ...user, role: "admin" }), null);
  assert.equal(verifyDbpSession({ ...user, name: "Someone else" }), null);
  assert.equal(verifyDbpSession(signDbpSession({ ...unsigned(), expiresAt: "2000-01-01T00:00:00Z" })), null);
  assert.equal(requestSession(request("admin/audit-logs", unsigned("impostor", "admin"))), null);
  assert.equal(requestSession(request("access", unsigned()), { allowUnsignedLocal: true })?.identitySource, "local");
});

test("audit list and both export formats require a verified admin, regardless of module grants", async (t) => {
  const { db, run } = fixture(t);
  for (const endpoint of ["admin/audit-logs", "admin/audit-logs/export", "admin/audit-logs/export?format=xlsx"]) {
    assert.equal((await run(request(endpoint, session("teacher", "akademisyen")))).status, 403);
    assert.equal((await run(request(endpoint, unsigned("impostor", "admin")))).status, 403);
  }
  const denied = queryAudit(db, new URLSearchParams({ action: "request.denied", user: "teacher" })).rows;
  assert.equal(denied.length, 3);
  assert.ok(denied.every((row) => row.role === "akademisyen" && row.httpStatus === 403));
  assert.equal(queryAudit(db, new URLSearchParams({ user: "impostor" })).total, 0, "unverified identity must not be attributed as fact");
  const response = await run(request("admin/audit-logs", session("admin", "admin")));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /HttpOnly; SameSite=Lax/);
});

test("successful writes retain authenticated role, scope and operation but never course content", async (t) => {
  const { db, run } = fixture(t);
  const user = session("chair", "abd_asd_baskani");
  const handler = async () => {
    recordAudit(db, "course.package.status", "forged actor", { code: "İŞL801", status: "Yayımlandı" });
    return Response.json({ ok: true });
  };
  await run(request("course-package/status", user, { code: "İŞL801", department: "İşletme ABD", programName: "İşletme", level: "Tezli Yüksek Lisans", status: "Yayımlandı", note: "Uygundur", package: { content: "PRIVATE-CONTENT" }, tcKimlik: "PRIVATE-ID" }), handler);
  const rows = queryAudit(db, new URLSearchParams({ action: "course.package.approve" })).rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].actor, "chair");
  assert.equal(rows[0].role, "abd_asd_baskani");
  assert.equal(rows[0].programName, "İşletme");
  assert.equal(rows[0].details.note, "Uygundur");
  assert.equal(rows[0].httpStatus, 200);
  assert.doesNotMatch(JSON.stringify(db.prepare("SELECT * FROM audit_logs").all()), /PRIVATE-CONTENT|PRIVATE-ID|forged actor|proof/);
  await run(request("course-package/status", user, { code: "İŞL801", status: "Düzeltme İstendi", note: "Düzeltin" }), handler);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "course.package.correction" })).total, 1);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "session.login" })).total, 1, "same session is logged once");
});

test("simultaneous users cannot overwrite each other's audit identity", async (t) => {
  const { db, run } = fixture(t);
  const gate = Promise.withResolvers();
  let entered = 0;
  const handler = async () => {
    if (++entered === 2) gate.resolve();
    await gate.promise;
    recordAudit(db, "course.assignment.update", "ignored", {});
    return Response.json({ ok: true });
  };
  await Promise.all([
    run(request("assignment", session("alice", "admin"), { code: "A801" }), handler),
    run(request("assignment", session("bob", "abd_asd_baskani"), { code: "B801" }), handler),
  ]);
  const rows = queryAudit(db, new URLSearchParams({ action: "course.assignment.update" })).rows;
  assert.deepEqual(rows.map((row) => [row.username, row.role, row.code]).sort(), [["alice", "admin", "A801"], ["bob", "abd_asd_baskani", "B801"]]);
});

test("reads, denied operations, malformed requests and module visits have meaningful results", async (t) => {
  const { db, run } = fixture(t);
  const user = session("reader", "akademisyen");
  await run(request("course-package?code=MAT801&level=Doktora", user), () => Response.json({ package: {} }));
  await run(request("course-package/status", user, { code: "MAT801" }), () => Response.json({ message: "Yetki yok" }, { status: 403 }));
  await run(request("course-package", user, { code: "MAT801", package: { content: "SECRET-CONTENT" } }), () => Response.json({ message: "Geçersiz bilgi" }, { status: 422 }));
  assert.equal((await run(request("session/events", user, { event: "module.view", module: "my_courses" }))).status, 200);
  assert.equal((await run(request("session/events", user, { event: "module.view", module: "audit_logs" }))).status, 403);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "course.package.view" })).total, 1);
  assert.equal(queryAudit(db, new URLSearchParams({ result: "denied" })).total, 2);
  assert.equal(queryAudit(db, new URLSearchParams({ result: "failure" })).rows[0].httpStatus, 422);
  assert.doesNotMatch(JSON.stringify(queryAudit(db, new URLSearchParams()).rows), /SECRET-CONTENT/);
});

test("filters use Turkey calendar boundaries, literal search, stable pages and compatible legacy rows", (t) => {
  const { db } = fixture(t);
  const insert = db.prepare("INSERT INTO audit_logs(action,actor,payload_json,created_at) VALUES (?,?,?,?)");
  for (const [time, code] of [["2026-10-22T20:59:59.999Z", "BEFORE"], ["2026-10-22T21:00:00.000Z", "FIRST"], ["2026-10-23T20:59:59.999Z", "LAST"], ["2026-10-23T21:00:00.000Z", "AFTER"]]) {
    insert.run("course.package.save", "a%_b", JSON.stringify({ code, department: "İşletme ABD", _audit: { username: "a%_b", role: "admin", result: "success" } }), time);
  }
  insert.run("legacy.event", "legacy", "broken json", "2026-10-23T08:00:00.000Z");
  const filters = new URLSearchParams({ from: "2026-10-23", to: "2026-10-23", user: "%_", role: "admin", limit: "1" });
  const first = queryAudit(db, filters);
  assert.equal(first.total, 2);
  assert.equal(first.rows[0].code, "LAST");
  filters.set("page", "2");
  assert.equal(queryAudit(db, filters).rows[0].code, "FIRST");
  assert.equal(queryAudit(db, filters, { exportAll: true }).rows.length, 2);
  assert.equal(queryAudit(db, new URLSearchParams({ user: "' OR 1=1 --" })).total, 0);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "legacy.event" })).rows[0].role, "");
  assert.equal(queryAudit(db, new URLSearchParams({ department: "isletme" })).total, 4, "Turkish names are searchable without case or diacritics");
  assert.throws(() => queryAudit(db, new URLSearchParams({ from: "2026-02-30" })), /tarih/);
});

test("verified browser navigation and file downloads are attributed through the HttpOnly cookie; prefetch is ignored", async (t) => {
  const { db, run } = fixture(t);
  const established = await run(request("access", session("teacher", "akademisyen")), () => Response.json({ ok: true }));
  const cookie = established.headers.get("set-cookie").split(";")[0];
  const browserRequest = (path, headers = {}) => new Request(`https://dbp.example/dbp/${path}`, { headers: { cookie, ...headers } });
  auditNavigation(browserRequest("katalog?ders=MAT801"), new Response("page", { headers: { "Content-Type": "text/html" } }), { getDb: () => db, target: { code: "MAT801" } });
  auditNavigation(browserRequest("guide.pdf"), new Response("pdf", { headers: { "Content-Type": "application/pdf" } }), { getDb: () => db });
  auditNavigation(browserRequest("katalog", { purpose: "prefetch" }), new Response("page", { headers: { "Content-Type": "text/html" } }), { getDb: () => db });
  assert.equal(queryAudit(db, new URLSearchParams({ action: "page.view", role: "akademisyen" })).total, 1);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "file.download", user: "teacher" })).total, 1);
});

test("pagination and download keep the displayed snapshot while other users and audit views create new events", (t) => {
  const { db } = fixture(t);
  for (let i = 0; i < 30; i++) recordAudit(db, "sample.event", "original", { code: "MAT801" });
  const first = queryAudit(db, new URLSearchParams());
  recordAudit(db, "audit.view", "admin");
  recordAudit(db, "sample.event", "new user", { code: "MAT801" });
  const second = queryAudit(db, new URLSearchParams({ page: "2", asOf: String(first.snapshotId) }));
  assert.equal(second.total, 30);
  assert.equal(second.rows.length, 5);
  assert.equal(new Set([...first.rows, ...second.rows].map((row) => row.id)).size, 30);
  const exported = queryAudit(db, new URLSearchParams({ asOf: String(first.snapshotId) }), { exportAll: true });
  assert.equal(exported.rows.length, 30);
  assert.ok(exported.rows.every((row) => row.actor === "original"));
  assert.equal(queryAudit(db, new URLSearchParams()).total, 32, "refresh includes newly created events");
});

test("filtered CSV/Excel exports include all matching pages and downloads are themselves audited", async (t) => {
  const { db, run } = fixture(t);
  for (let i = 0; i < 31; i++) recordAudit(db, "sample.event", "=FORMULA", { code: "MAT801", note: 'Türkçe; "açıklama"' });
  recordAudit(db, "other.event", "excluded", {});
  const admin = session("admin", "admin");
  const csvResponse = await run(request("admin/audit-logs/export?action=sample.event", admin));
  assert.equal(csvResponse.status, 200);
  const csv = await csvResponse.text();
  assert.equal(csv.split("\r\n").length, 32);
  assert.ok(csv.includes("'=FORMULA"), "CSV formula injection is neutralized");
  assert.ok(csv.includes("Türkçe"));
  assert.ok(!csv.includes("excluded"));
  const excel = await (await run(request("admin/audit-logs/export?action=sample.event&format=xlsx", admin))).json();
  assert.equal(excel.rows.length, 31);
  assert.deepEqual(excel.headers, auditExportHeaders);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "audit.export", role: "admin" })).total, 2);
});

test("existing JSON backup roundtrip preserves new metadata and reset still clears all previous records", (t) => {
  const { db, context } = fixture(t);
  context.ensureCourseInstructorIdentityColumns();
  context.ensureThesisModuleColumns();
  recordAudit(db, "sample.event", "system", { code: "MAT801", note: "Yedekle koru" });
  const original = db.prepare("SELECT * FROM audit_logs").all();
  const identityEdits = { 1: { id: 1, department: "Matematik ABD", programName: "Matematik", level: "Tezli Yüksek Lisans", code: "MAT868", name: "İdari Ders", workflowCode: "MAT864", aliases: ["MAT864", "MAT868"] } };
  db.prepare("INSERT INTO metadata(key, value) VALUES (?, ?)").run("course_identity_edits_v1", JSON.stringify(identityEdits));
  assert.equal(context.courseIdentityEdits()[1].code, "MAT868");
  const payload = JSON.parse(JSON.stringify(context.exportData()));
  context.resetDatabase("admin");
  assert.equal(Object.keys(context.courseIdentityEdits()).length, 0);
  assert.equal(queryAudit(db, new URLSearchParams({ action: "sample.event" })).total, 0);
  assert.equal(queryAudit(db, new URLSearchParams()).total, 1);
  context.replaceFromExport(payload, "admin");
  assert.equal(JSON.stringify(context.courseIdentityEdits()), JSON.stringify(identityEdits));
  assert.deepEqual(db.prepare("SELECT * FROM audit_logs WHERE action = 'sample.event'").all(), original);
});
