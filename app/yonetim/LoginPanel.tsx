"use client";

import { KeyRound, Landmark, ShieldCheck } from "lucide-react";

const EENSTITU_URL = process.env.NEXT_PUBLIC_EENSTITU_URL || "/";

export function LoginPanel() {
  return (
    <div className="role-login-layout">
      <section className="role-selector" aria-label="DBP giris bilgisi">
        <span className="eyebrow">TEK OTURUM</span>
        <h1>DBP girisi e-Enstitu uzerinden yapilir</h1>
        <p>
          Ders bilgi paketi yonetim alani artik e-Enstitu oturumu, LDAP ve
          tanimli rollerinizle acilir. DBP tarafinda ayri kullanici adi veya
          parola tutulmaz.
        </p>
        <div className="role-grid">
          <article className="role-option selected">
            <span><Landmark size={18} /></span>
            <div>
              <b>Kurumsal LDAP</b>
              <small>Gercek personel ve demo LDAP kullanicilari e-Enstitu tarafinda dogrulanir.</small>
            </div>
          </article>
          <article className="role-option selected">
            <span><ShieldCheck size={18} /></span>
            <div>
              <b>Rol tabanli DBP erisimi</b>
              <small>Danisman, ABD baskani, enstitu rolleri ve admin yetkileri DBP'ye aktarilir.</small>
            </div>
          </article>
        </div>
      </section>
      <section className="signin-card">
        <div className="signin-icon"><KeyRound size={22} /></div>
        <span className="eyebrow">LEE DBP YONETIM ALANI</span>
        <h2>e-Enstitu ile devam et</h2>
        <p className="signin-note">
          Oturumunuz yoksa once e-Enstitu'ye giris yapin. Gecis, e-Enstitu
          icindeki Ders Bilgi Paketi modulunden guvenli olarak baslatilir.
        </p>
        <a className="sso-action" href={EENSTITU_URL}>
          <KeyRound size={16} />
          e-Enstitu girisine git
        </a>
      </section>
    </div>
  );
}
