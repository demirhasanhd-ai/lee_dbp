export function getEEnstituUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_E_ENSTITU_URL?.trim() ||
    process.env.DBP_E_ENSTITU_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080";
    }
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://e-enstitu.osmaniye.edu.tr";
}

export function eEnstituUrl() {
  return `${getEEnstituUrl()}/#`;
}
