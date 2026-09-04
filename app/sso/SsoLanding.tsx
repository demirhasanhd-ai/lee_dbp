"use client";

import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { getEEnstituUrl } from "../../lib/eEnstituUrl";
import type { DbpSsoSession } from "../../lib/eEnstituSso";

function safeScriptString(value: string) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export function SsoLanding({
  session,
  error,
  eEnstituUrl,
}: {
  session?: DbpSsoSession;
  error?: string;
  eEnstituUrl?: string;
}) {
  const retryHref = `${(eEnstituUrl || getEEnstituUrl()).replace(/\/$/, "")}/#/modul/ders-bilgi-paketi`;
  const panelHref = dbpPath("/panel");
  const sessionScript = session
    ? `
(() => {
  try {
    window.localStorage.setItem("lee-dbp-session", ${safeScriptString(JSON.stringify(session))});
  } catch {}
  window.setTimeout(() => {
    window.location.replace(${safeScriptString(panelHref)});
  }, 50);
})();
`
    : "";

  useEffect(() => {
    if (!session) return;
    try {
      window.localStorage.setItem("lee-dbp-session", JSON.stringify(session));
    } catch {
      // The inline redirect below still moves the user forward if storage is temporarily blocked.
    }
    const timer = window.setTimeout(() => {
      window.location.replace(panelHref);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [panelHref, session]);

  return (
    <main className="management-page sso-page">
      {session && <script dangerouslySetInnerHTML={{ __html: sessionScript }} />}
      <section className="signin-card sso-card">
        <div className="signin-icon">
          {session ? <CheckCircle2 size={22} /> : <ShieldAlert size={22} />}
        </div>
        <span className="eyebrow">e-Enstitu DBP gecisi</span>
        <h2>{session ? "Oturum dogrulandi" : "Gecis tamamlanamadi"}</h2>
        <p className="signin-note">
          {session
            ? "DBP paneli e-Enstitu oturumunuzla aciliyor."
            : error || "DBP gecis bileti dogrulanamadi."}
        </p>
        {session ? (
          <>
            <div className="sso-loading">
              <Loader2 size={16} />
              Panel hazirlaniyor...
            </div>
            <a className="sso-action" href={panelHref}>
              Paneli ac
            </a>
          </>
        ) : (
          <a className="sso-action" href={retryHref}>
            Tekrar dene
          </a>
        )}
      </section>
    </main>
  );
}
