import type { Metadata } from "next";
import { LoginPanel } from "./LoginPanel";
import { ThemeToggle } from "../ThemeToggle";

export const metadata: Metadata = { title: "Giriş Yap" };

export default function Management() {
  return <main className="management-page"><header className="management-header"><a className="oku-brand" href="/"><span className="logo-box"><img src="/oku-logo.png" alt="OKÜ logosu"/></span><span><b>LEE <em>Ders Bilgi Paketi</em></b><small>BOLOGNA BİLGİ SİSTEMİ</small></span></a><div className="management-actions"><ThemeToggle/><a className="back-link" href="/">← Ders Kataloğuna dön</a></div></header><LoginPanel/></main>;
}
