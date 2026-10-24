import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const roles = new Set(["akademisyen", "abd_asd_baskani", "abd_sekreteri", "lee_ogrenci_isleri", "enstitu_sekreteri", "enstitu_yoneticisi", "admin"]);
export const sessionCookieName = "lee_dbp_session";
const keyCache = new Map();

// Kept in the persistent data volume so renderer and API processes share the key.
// This file is deliberately separate from exported application data.
function signingKey() {
  if (process.env.DBP_SESSION_SECRET) return process.env.DBP_SESSION_SECRET;
  const directory = process.env.DBP_DATA_DIR || path.join(process.cwd(), "data");
  const file = path.join(directory, ".session-secret");
  if (keyCache.has(file)) return keyCache.get(file);
  mkdirSync(directory, { recursive: true });
  try {
    writeFileSync(file, randomBytes(48).toString("hex"), { flag: "wx", mode: 0o600 });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const key = readFileSync(file, "utf8").trim();
  keyCache.set(file, key);
  return key;
}

function signature(session) {
  const payload = { ...session };
  delete payload.proof;
  const ordered = Object.fromEntries(Object.keys(payload).sort().map((key) => [key, payload[key]]));
  return createHmac("sha256", signingKey()).update(JSON.stringify(ordered)).digest("hex");
}

export function signDbpSession(session) {
  const payload = { ...session, sessionId: randomUUID() };
  return { ...payload, proof: signature(payload) };
}

export function verifyDbpSession(session) {
  if (!session || !session.username || !roles.has(session.role) || !session.sessionId ||
      !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now() ||
      !/^[a-f0-9]{64}$/.test(session.proof || "")) return null;
  const expected = Buffer.from(signature(session), "hex");
  const actual = Buffer.from(session.proof, "hex");
  return timingSafeEqual(expected, actual) ? session : null;
}

export function requestSession(request, { allowUnsignedLocal = false } = {}) {
  try {
    const header = request.headers.get("x-dbp-session");
    const cookie = (request.headers.get("cookie") || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookieName}=`));
    const session = header
      ? JSON.parse(header.startsWith("uri:") ? decodeURIComponent(header.slice(4)) : header)
      : cookie ? JSON.parse(Buffer.from(cookie.slice(sessionCookieName.length + 1), "base64url").toString("utf8")) : null;
    const verified = verifyDbpSession(session);
    if (verified) return { ...verified, identitySource: "sso" };
    if (allowUnsignedLocal && header && session?.username && roles.has(session.role) &&
        Date.parse(session.expiresAt) > Date.now()) {
      return { ...session, identitySource: "local", sessionId: session.sessionId || `local:${session.username}:${session.role}:${session.expiresAt}` };
    }
  } catch { /* Malformed or expired sessions are unauthenticated. */ }
  return null;
}

export function sessionCookie(session, request) {
  const payload = { ...session };
  delete payload.identitySource;
  const secure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto")?.split(",")[0].trim() === "https";
  return `${sessionCookieName}=${Buffer.from(JSON.stringify(payload)).toString("base64url")}; Path=/dbp; HttpOnly; SameSite=Lax; Max-Age=${Math.max(0, Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000))}${secure ? "; Secure" : ""}`;
}
