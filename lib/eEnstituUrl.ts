export function getEEnstituUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_E_ENSTITU_URL?.trim() ||
    process.env.DBP_E_ENSTITU_URL?.trim();
  const normalizedConfiguredUrl = configuredUrl?.replace(/\/+$/, "");

  if (normalizedConfiguredUrl) {
    try {
      const url = new URL(normalizedConfiguredUrl);
      const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
      if (!(process.env.NODE_ENV === "production" && isLocalhost)) return normalizedConfiguredUrl;
    } catch {
      return normalizedConfiguredUrl;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return "https://e-enstitu.osmaniye.edu.tr";
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080";
    }
  }

  return "http://localhost:8080";
}

export function eEnstituUrl() {
  return `${getEEnstituUrl()}/#`;
}
