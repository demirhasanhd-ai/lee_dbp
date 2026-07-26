"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../../lib/dbpPath";
import type { DbpRole } from "../../../lib/auth/roles";

const allowedRoles: DbpRole[] = [
  "akademisyen",
  "abd_asd_baskani",
  "abd_sekreteri",
  "lee_ogrenci_isleri",
  "enstitu_sekreteri",
  "enstitu_yoneticisi",
  "admin",
];

type LocalSessionInput = {
  role: string;
  name: string;
  username: string;
  department: string;
  tcKimlik: string;
  email: string;
};

function sanitizeRole(role: string): DbpRole {
  return allowedRoles.includes(role as DbpRole) ? (role as DbpRole) : "akademisyen";
}

export function LocalDevSsoLanding({ input }: { input: LocalSessionInput }) {
  const [blocked, setBlocked] = useState(false);
  const session = useMemo(() => ({
    name: input.name || "e-Enstitü Kullanıcısı",
    username: input.username || input.tcKimlik || "demo.eenstitu",
    role: sanitizeRole(input.role),
    department: input.department || "LEE",
    tcKimlik: input.tcKimlik || undefined,
    email: input.email || undefined,
    authProvider: "e-enstitu",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }), [input]);

  useEffect(() => {
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (!isLocalHost) {
      setBlocked(true);
      return;
    }

    window.localStorage.setItem("lee-dbp-session", JSON.stringify(session));
    const timer = window.setTimeout(() => {
      window.location.replace(dbpPath("/panel"));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [session]);

  return (
    <main className="management-page sso-page">
      <section className="signin-card sso-card">
        <div className="signin-icon">
          {blocked ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
        </div>
        <span className="eyebrow">Yerel DBP geçişi</span>
        <h2>{blocked ? "Geçiş engellendi" : "Oturum hazırlanıyor"}</h2>
        <p className="signin-note">
          {blocked
            ? "Bu geliştirme geçişi yalnızca localhost üzerinde kullanılabilir."
            : "e-Enstitü demo oturumu DBP paneline aktarılıyor."}
        </p>
      </section>
    </main>
  );
}
