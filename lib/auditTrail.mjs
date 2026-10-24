import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { requestSession, sessionCookie } from "./serverSession.mjs";
import { auditActionLabel, auditRoleLabels, auditResultLabels } from "./auditLabels.mjs";

const requests = new AsyncLocalStorage();
const text = (value, max = 1000) => typeof value === "string" ? value.slice(0, max) : "";
const metadataKeys = ["code", "name", "department", "programName", "level", "status", "route", "note", "fileName", "term", "module", "event"];
const searchableDatabases = new WeakSet();
const fold = (value) => String(value || "").toLocaleLowerCase("tr-TR").replaceAll("ı", "i").normalize("NFD").replace(/\p{M}/gu, "");

export function recordAudit(db, action, actor, payload = {}) {
  const context = requests.getStore();
  const session = context?.session;
  if (action === "course.package.status" && context) action = requestAction(context.path, context.method, context.target);
  if (action === "course.package.save" && context?.target.status === "Komisyon Onayı Bekliyor") action = "course.package.submit";
  const details = {
    ...context?.target,
    ...payload,
    _audit: {
      username: session?.username || "",
      displayName: session?.name || "",
      role: session?.role || (context ? "" : "system"),
      department: session?.department || "",
      identitySource: session?.identitySource || (context ? "anonymous" : "system"),
      sessionId: session?.sessionId || "",
      requestId: context?.requestId || "",
      path: context?.path || "",
      method: context?.method || "",
      ip: context?.ip || "",
      userAgent: context?.userAgent || "",
      result: context?.result || "success",
      httpStatus: context?.httpStatus || null,
    },
  };
  const inserted = db.prepare("INSERT INTO audit_logs(action, actor, payload_json, created_at) VALUES (?, ?, ?, ?)")
    .run(action, session?.username || actor || null, JSON.stringify(details), new Date().toISOString());
  if (context) { context.events += 1; context.ids.push(Number(inserted.lastInsertRowid)); }
}

function requestAction(pathname, method, target) {
  if (pathname === "/api/dbp/course-package/status") {
    if (target.force) return "course.package.status.override";
    if (target.status === "Düzeltme İstendi") return "course.package.correction";
    return "course.package.approve";
  }
  if (pathname === "/api/dbp/course-package") return method === "GET" ? "course.package.view" : "course.package.save";
  if (pathname === "/api/dbp/course-pdf") return "course.pdf.download";
  if (pathname === "/api/dbp/admin/audit-logs/export") return "audit.export";
  if (pathname === "/api/dbp/admin/audit-logs") return "audit.view";
  if (pathname === "/api/dbp/admin/export") return "database.export";
  return `${pathname.replace(/^\/api\/dbp\//, "").replaceAll("/", ".")}.${method === "GET" ? "view" : method.toLowerCase()}`;
}

export async function withAuditRequest(request, handler, { getDb, allowUnsignedLocal = false, clientIp = "" } = {}) {
  const pathname = new URL(request.url).pathname.replace(/^\/dbp(?=\/|$)/, "");
  if (!pathname.startsWith("/api/dbp/")) return handler(request);
  const session = requestSession(request, { allowUnsignedLocal });
  const headers = new Headers(request.headers);
  // Every API authorizes the verified identity, never the client-supplied role.
  headers.delete("x-dbp-session");
  if (session) headers.set("x-dbp-session", `uri:${encodeURIComponent(JSON.stringify(session))}`);
  const authorizedRequest = new Request(request, { headers });
  const target = {};
  const url = new URL(request.url);
  for (const key of metadataKeys) if (url.searchParams.has(key)) target[key] = text(url.searchParams.get(key));
  if (pathname.startsWith("/api/dbp/admin/audit-logs")) {
    target.filters = Object.fromEntries(["from", "to", "user", "role", "action", "result", "department", "code", "q", "programName", "level", "asOf"].filter((key) => url.searchParams.get(key)).map((key) => [key, text(url.searchParams.get(key), 200)]));
  }
  if (request.method !== "GET" && request.method !== "HEAD" && !["/api/dbp/admin/import", "/api/dbp/view-stats/import"].includes(pathname)) {
    try {
      const body = await authorizedRequest.clone().json();
      for (const key of metadataKeys) if (typeof body[key] === "string") target[key] = text(body[key], key === "note" ? 2000 : 1000);
      if (body.force === true) target.force = true;
      if (Array.isArray(body.items)) target.itemCount = body.items.length;
    } catch { /* The endpoint reports malformed JSON; do not retain raw bodies. */ }
  }
  const context = {
    session, target, requestId: randomUUID(), path: pathname, method: request.method,
    ip: text(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || clientIp, 100),
    userAgent: text(request.headers.get("user-agent"), 500), events: 0, ids: [],
  };
  return requests.run(context, async () => {
    const db = getDb();
    if (session) {
      const previous = db.prepare("SELECT 1 FROM audit_logs WHERE action = 'session.login' AND json_extract(CASE WHEN json_valid(payload_json) THEN payload_json ELSE '{}' END, '$._audit.sessionId') = ? LIMIT 1").get(session.sessionId);
      if (!previous) recordAudit(db, "session.login", session.username, { expiresAt: session.expiresAt });
    }
    // Login is separate from the requested operation.
    context.events = 0;
    let response;
    try {
      response = await handler(authorizedRequest);
    } catch (error) {
      context.result = "failure";
      context.httpStatus = 500;
      recordAudit(db, "request.failed", session?.username, { operation: requestAction(pathname, request.method, target) });
      throw error;
    }
    if (!response) return response;
    context.httpStatus = response.status;
    const updateStatus = db.prepare("UPDATE audit_logs SET payload_json = json_set(payload_json, '$._audit.httpStatus', ?) WHERE id = ? AND json_extract(payload_json, '$._audit.requestId') = ?");
    for (const id of context.ids) updateStatus.run(response.status, id, context.requestId);
    if (response.status >= 400) {
      context.result = [401, 403].includes(response.status) ? "denied" : "failure";
      let message = "";
      if (response.headers.get("content-type")?.includes("application/json")) {
        try { message = text((await response.clone().json()).message, 500); } catch { /* No diagnostic text available. */ }
      }
      recordAudit(db, context.result === "denied" ? "request.denied" : "request.failed", session?.username, { operation: requestAction(pathname, request.method, target), message });
    } else if (session && !context.events && pathname !== "/api/dbp/health" && pathname !== "/api/dbp/session/events") {
      recordAudit(db, requestAction(pathname, request.method, target), session.username);
    }
    if (session?.identitySource === "sso") {
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Cache-Control", "private, no-store");
      responseHeaders.append("Set-Cookie", sessionCookie(session, request));
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders });
    }
    return response;
  });
}

export function auditNavigation(request, response, { getDb, target = {}, clientIp = "" } = {}) {
  if (request.method !== "GET" || response.status !== 200 || request.headers.get("rsc") === "1" ||
      request.headers.has("next-router-prefetch") || /prefetch|prerender/i.test(request.headers.get("purpose") || request.headers.get("sec-purpose") || "")) return;
  const path = new URL(request.url).pathname;
  if (!path.startsWith("/dbp/")) return;
  const html = response.headers.get("content-type")?.includes("text/html") &&
    (!request.headers.get("sec-fetch-dest") || request.headers.get("sec-fetch-dest") === "document") &&
    !new URL(request.url).searchParams.has("_rsc");
  const file = /\.(pdf|xlsx|csv)$/i.test(path);
  if (!html && !file) return;
  const session = requestSession(request);
  if (!session) return;
  requests.run({
    session, target, path, method: "GET", requestId: randomUUID(), events: 0, ids: [], httpStatus: 200,
    ip: text(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || clientIp, 100),
    userAgent: text(request.headers.get("user-agent"), 500),
  }, () => recordAudit(getDb(), file ? "file.download" : "page.view", session.username, file ? { fileName: path.split("/").pop() } : {}));
}

export function auditRow(row) {
  let payload = {};
  try { payload = JSON.parse(row.payload_json || "{}"); } catch { /* Preserve legacy records without metadata. */ }
  const { _audit, ...details } = payload && typeof payload === "object" ? payload : {};
  const meta = _audit && typeof _audit === "object" ? _audit : {};
  return {
    id: row.id, action: row.action, actor: row.actor || "", createdAt: row.created_at,
    username: meta.username || row.actor || "", displayName: meta.displayName || "", role: meta.role || "",
    result: meta.result || "", identitySource: meta.identitySource || "",
    department: details.department || meta.department || "", programName: details.programName || "",
    code: details.code || "", level: details.level || "", path: meta.path || "", method: meta.method || "",
    httpStatus: meta.httpStatus, ip: meta.ip || "", userAgent: meta.userAgent || "",
    requestId: meta.requestId || "", details,
  };
}

export function queryAudit(db, params, { exportAll = false } = {}) {
  if (!searchableDatabases.has(db)) {
    db.function("audit_fold", { deterministic: true }, fold);
    searchableDatabases.add(db);
  }
  const json = "CASE WHEN json_valid(payload_json) THEN payload_json ELSE '{}' END";
  const conditions = [];
  const values = [];
  const add = (condition, value) => { conditions.push(condition); values.push(value); };
  const snapshotId = params.has("asOf") ? Number(params.get("asOf")) : db.prepare("SELECT COALESCE(MAX(id), 0) AS id FROM audit_logs").get().id;
  if (!Number.isSafeInteger(snapshotId) || snapshotId < 0) throw new Error("Kayıt listesi geçersiz. Listeyi yenileyin.");
  add("id <= ?", snapshotId);
  const literalLike = (value) => `%${fold(value).replace(/[\\%_]/g, "\\$&")}%`;
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const day = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  if ((from && !day(from)) || (to && !day(to)) || (from && to && from > to)) throw new Error("Geçerli bir tarih aralığı seçin.");
  // Date inputs are calendar dates in Turkey, independently of server/browser timezone.
  if (from) add("created_at >= ?", new Date(`${from}T00:00:00+03:00`).toISOString());
  if (to) add("created_at < ?", new Date(Date.parse(`${to}T00:00:00+03:00`) + 86400000).toISOString());
  for (const [key, expression] of [
    ["role", `json_extract(${json}, '$._audit.role')`],
    ["result", `json_extract(${json}, '$._audit.result')`],
    ["action", "action"],
    ["programName", `json_extract(${json}, '$.programName')`],
    ["level", `json_extract(${json}, '$.level')`],
  ]) if (params.get(key)) add(`${expression} = ?`, params.get(key));
  for (const [key, expression] of [
    ["user", `COALESCE(actor, '') || ' ' || COALESCE(json_extract(${json}, '$._audit.username'), '') || ' ' || COALESCE(json_extract(${json}, '$._audit.displayName'), '')`],
    ["code", `COALESCE(json_extract(${json}, '$.code'), '')`],
    ["department", `COALESCE(json_extract(${json}, '$.department'), json_extract(${json}, '$._audit.department'), '')`],
  ]) if (params.get(key)) add(`audit_fold(${expression}) LIKE ? ESCAPE '\\'`, literalLike(params.get(key).slice(0, 200)));
  if (params.get("q")) {
    add(`audit_fold(action || ' ' || COALESCE(actor, '') || ' ' || payload_json) LIKE ? ESCAPE '\\'`, literalLike(params.get("q").slice(0, 200)));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const total = db.prepare(`SELECT COUNT(*) AS count FROM audit_logs ${where}`).get(...values).count;
  const limit = Math.min(100, Math.max(1, Math.floor(Number(params.get("limit")) || 25)));
  const page = Math.min(Math.max(1, Math.ceil(total / limit)), Math.max(1, Math.floor(Number(params.get("page")) || 1)));
  // Never silently truncate a filtered download. Large ranges must be narrowed explicitly.
  if (exportAll && total > 50000) throw new Error("İndirme en fazla 50.000 kayıt içerebilir. Tarih veya kullanıcı filtresini daraltın.");
  const rows = db.prepare(`SELECT * FROM audit_logs ${where} ORDER BY created_at DESC, id DESC ${exportAll ? "" : "LIMIT ? OFFSET ?"}`)
    .all(...values, ...(exportAll ? [] : [limit, (page - 1) * limit])).map(auditRow);
  const actions = db.prepare("SELECT DISTINCT action FROM audit_logs ORDER BY action").all().map((row) => row.action);
  return { rows, total, page, limit, actions, snapshotId };
}

export const auditExportHeaders = ["Tarih (Türkiye)", "Kullanıcı", "Ad Soyad", "Rol", "İşlem", "Sonuç", "ABD / ASD", "Program", "Düzey", "Ders Kodu", "HTTP Durumu", "Yol", "IP", "Kimlik Kaynağı", "İstek Kimliği", "Ayrıntı"];
export function auditExportRows(rows) {
  return rows.map((row) => [
    new Date(row.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }),
    row.username, row.displayName, auditRoleLabels[row.role] || row.role || "Kayıtlı değil", auditActionLabel(row.action), auditResultLabels[row.result] || "Kayıtlı değil",
    row.department, row.programName, row.level, row.code, row.httpStatus || "", row.path, row.ip,
    row.identitySource || "Kayıtlı değil", row.requestId, JSON.stringify(row.details),
  ]);
}

export function auditCsv(rows) {
  const cell = (value) => {
    let valueText = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(valueText)) valueText = `'${valueText}`;
    return `"${valueText.replaceAll('"', '""')}"`;
  };
  return "\uFEFF" + [auditExportHeaders, ...auditExportRows(rows)].map((row) => row.map(cell).join(";")).join("\r\n");
}
