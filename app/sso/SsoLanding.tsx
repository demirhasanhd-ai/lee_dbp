"use client";

import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { getEEnstituUrl } from "../../lib/eEnstituUrl";
import type { DbpSsoSession } from "../../lib/eEnstituSso";

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

  useEffect(() => {
    if (!session) return;
    window.localStorage.setItem("lee-dbp-session", JSON.stringify(session));
    const timer = window.setTimeout(() => {
      window.location.replace(dbpPath("/panel"));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [session]);

  return (
    <main className="management-page sso-page">
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
          <div className="sso-loading">
            <Loader2 size={16} />
            Panel hazirlaniyor...
          </div>
        ) : (
          <a className="sso-action" href={retryHref}>
            Tekrar dene
          </a>
        )}
      </section>
    </main>
  );
}
