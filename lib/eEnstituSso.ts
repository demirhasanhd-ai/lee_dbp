export type DbpSsoRole =
  | "akademisyen"
  | "abd_asd_baskani"
  | "abd_sekreteri"
  | "lee_ogrenci_isleri"
  | "enstitu_sekreteri"
  | "enstitu_yoneticisi"
  | "admin";

export type DbpSsoSession = {
  name: string;
  username: string;
  role: DbpSsoRole;
  department: string;
  departmentId: string | null;
  email: string;
  tcKimlik: string;
  readOnly: boolean;
  authProvider: "e-enstitu";
  expiresAt: string;
};

type VerifyResponse = {
  expiresAt: string;
  user: {
    username: string;
    tcKimlik: string;
    displayName: string;
    email: string;
    departmentId: string | null;
    departmentLabel: string;
  };
  dbp: {
    role: DbpSsoRole;
    readOnly: boolean;
  };
  message?: string;
};

function isLocalhostUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
  } catch {
    return false;
  }
}

function pushUnique(values: string[], value?: string) {
  const normalized = value?.trim().replace(/\/$/, "");
  if (normalized && !values.includes(normalized)) values.push(normalized);
}

function apiBaseUrls(fallbackBaseUrl?: string) {
  const configuredUrl =
    process.env.EENSTITU_API_BASE_URL || process.env.NEXT_PUBLIC_EENSTITU_API_BASE_URL || "";
  const internalUrl = process.env.EENSTITU_INTERNAL_API_BASE_URL || "http://e-enstitu:8080";
  const urls: string[] = [];

  if (configuredUrl && (!isLocalhostUrl(configuredUrl) || isLocalhostUrl(fallbackBaseUrl))) {
    pushUnique(urls, configuredUrl);
  }

  if (fallbackBaseUrl && !isLocalhostUrl(fallbackBaseUrl)) {
    pushUnique(urls, internalUrl);
    pushUnique(urls, "http://web:8080");
  }

  pushUnique(urls, fallbackBaseUrl);
  pushUnique(urls, configuredUrl);
  pushUnique(urls, "http://localhost:3001");
  return urls;
}

export async function verifyEEnstituDbpTicket(ticket: string, fallbackBaseUrl?: string) {
  if (!ticket) return { error: "DBP gecis bileti bulunamadi." };
  let lastError = "";

  for (const apiBaseUrl of apiBaseUrls(fallbackBaseUrl)) {
    const verificationUrl = `${apiBaseUrl}/api/auth/dbp-ticket/verify`;
    try {
      const response = await fetch(verificationUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket }),
        cache: "no-store",
      });
      const text = await response.text();
      const payload = (text ? JSON.parse(text) : {}) as VerifyResponse;
      if (!response.ok) {
        return { error: payload.message || "DBP gecis bileti dogrulanamadi." };
      }

      const dbpSessionExpiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
      return {
        session: {
          name: payload.user.displayName,
          username: payload.user.username,
          role: payload.dbp.role,
          department: payload.user.departmentLabel || "LEE",
          departmentId: payload.user.departmentId,
          email: payload.user.email,
          tcKimlik: payload.user.tcKimlik,
          readOnly: payload.dbp.readOnly,
          authProvider: "e-enstitu",
          expiresAt: dbpSessionExpiresAt,
        } satisfies DbpSsoSession,
      };
    } catch (error) {
      lastError = error instanceof Error && error.message ? error.message : "baglanti hatasi";
    }
  }

  return { error: `e-Enstitu kimlik servisine ulasilamadi (${lastError || "baglanti hatasi"}).` };
}
