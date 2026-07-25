function isLocalhostUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
  } catch {
    return false;
  }
}

function liveOrigin() {
  if (typeof window === "undefined") return "";
  const origin = window.location.origin;
  return isLocalhostUrl(origin) ? "" : origin;
}

export function getEEnstituUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_EENSTITU_URL || "";
  if (configuredUrl && !isLocalhostUrl(configuredUrl)) return configuredUrl.replace(/\/$/, "");
  return (liveOrigin() || configuredUrl || "http://localhost:8080").replace(/\/$/, "");
}
