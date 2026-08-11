export function dbpSessionHeader(session: unknown) {
  const raw = typeof session === "string" ? session : JSON.stringify(session ?? {});
  return `uri:${encodeURIComponent(raw)}`;
}

export function storedDbpSessionHeader() {
  if (typeof window === "undefined") return dbpSessionHeader({});
  return dbpSessionHeader(window.localStorage.getItem("lee-dbp-session") || "{}");
}
