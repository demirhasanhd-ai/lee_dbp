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

function apiBaseUrl(fallbackBaseUrl?: string) {
  return (
    process.env.EENSTITU_API_BASE_URL ||
    process.env.NEXT_PUBLIC_EENSTITU_API_BASE_URL ||
    fallbackBaseUrl ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

export async function verifyEEnstituDbpTicket(ticket: string, fallbackBaseUrl?: string) {
  if (!ticket) return { error: "DBP gecis bileti bulunamadi." };

  try {
    const response = await fetch(`${apiBaseUrl(fallbackBaseUrl)}/api/auth/dbp-ticket/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket }),
      cache: "no-store",
    });
    const payload = (await response.json()) as VerifyResponse;
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
  } catch {
    return { error: "e-Enstitu kimlik servisine ulasilamadi." };
  }
}
