import type { Metadata } from "next";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ExternalLink,
  PieChart,
  Search,
} from "lucide-react";
import { BibliometricsMenu } from "./BibliometricsMenu";
import { PublicSiteHeader } from "./PublicSiteHeader";
import { ProgramDirectory } from "./ProgramDirectory";
import { HomeLiveStats } from "./HomeLiveStats";
import { dbpPath } from "../lib/dbpPath";
import { APP_VERSION } from "../lib/appVersion";

export const metadata: Metadata = {
  title: { absolute: "LEE Bilgi Sistemi" },
  description: "Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü Ders Bilgi Paketi.",
};

const notices = [
  ["2026–2027 ders bilgi paketi güncelleme takvimi", "16.07.2026"],
  ["Program çıktıları ve ders öğrenme çıktıları eşleştirmeleri", "11.07.2026"],
  ["AKTS iş yükü hesaplamalarında dikkat edilecek hususlar", "04.07.2026"],
];

export default function Home() {
  return (
    <main className="dbp-page">
      <PublicSiteHeader active="home" />

      <section className="top-banner">
        <div className="banner-orbit orbit-one"/><div className="banner-orbit orbit-two"/>
        <div className="banner-content">
          <div className="banner-copy">
            <div className="banner-controls">
              <span className="banner-label">LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ</span>
              <details className="period-menu">
                <summary><span>Güncel Dönem</span><b>2026–2027</b><ChevronDown size={14}/></summary>
                <div className="period-options">
                  <a className="current" href={dbpPath("/katalog?donem=2026-2027")}><span>Güncel dönem</span><b>2026–2027</b></a>
                  <a href={dbpPath("/katalog?donem=2025-2026")}><span>Müfredat bilgileri</span><b>2025–2026</b></a>
                  <a href={dbpPath("/katalog?donem=2024-2025")}><span>Müfredat bilgileri</span><b>2024–2025</b></a>
                  <a href={dbpPath("/katalog?donem=2023-2024")}><span>Müfredat bilgileri</span><b>2023–2024</b></a>
                  <a href={dbpPath("/katalog?donem=2022-2023")}><span>Müfredat bilgileri</span><b>2022–2023</b></a>
                </div>
              </details>
            </div>
            <h1>LEE <span>Ders Bilgi Paketi</span></h1>
            <p>Derslerin Bologna bilgilerine, öğrenme çıktılarına, haftalık içeriklerine ve AKTS iş yüklerine tek noktadan ulaşın.</p>
            <form className="banner-search" action={dbpPath("/katalog")}>
              <Search size={19}/><label className="sr-only" htmlFor="home-search">Ders ara</label>
              <input id="home-search" name="q" placeholder="Ders kodu, ders adı veya program ara..."/>
              <button type="submit">Ders Ara</button>
            </form>
          </div>
          <HomeLiveStats />
        </div>
        <a className="scroll-cue" href="#icerik"><span>Sayfayı keşfet</span><i>↓</i></a>
      </section>

      <div id="icerik" className="scroll-content">
        <section className="content-section" id="programlar">
          <div className="section-title"><div><span className="title-line"/><div><small>AKADEMİK YAPI</small><h2>LEE ABD / ASD ve lisansüstü programları</h2></div></div><a href={dbpPath("/katalog")}>Ders kataloğu →</a></div>
          <ProgramDirectory/>
        </section>

        <section className="content-section two-column" id="duyurular">
          <div>
            <div className="section-title"><div><span className="title-line accent"/><div><small>GÜNCEL BİLGİLER</small><h2>Duyurular</h2></div></div><a href="#duyurular">Tümü →</a></div>
            <div className="notice-list">{notices.map(([title,date],index)=><article key={title} className={index===0?"important":""} aria-disabled="true"><span className="notice-icon">{index===0?<Bell size={18}/>:<BookOpen size={18}/>}</span><div><h3>{title}</h3><p>Ders Bilgi Paketi Koordinatörlüğü</p></div><time>{date}</time></article>)}</div>
          </div>
          <aside className="quick-panel">
            <div className="section-title compact"><div><span className="title-line"/><div><small>İŞLEMLER</small><h2>Hızlı erişim</h2></div></div></div>
            <a href={dbpPath("/katalog")}><Search size={18}/><span><b>Ders bilgi paketi ara</b><small>Public katalogda arama yapın</small></span><i>→</i></a>
            <a href={dbpPath("/kalite")}><BarChart3 size={18}/><span><b>Kalite Göstergeleri</b><small>Ders paketi kalite metriklerini inceleyin</small></span><i>→</i></a>
            <a href={dbpPath("/tez-ska")}><PieChart size={18}/><span><b>TEZ SKA Analizi</b><small>Tezlerin SKA dağılımını görüntüleyin</small></span><i>→</i></a>
            <BibliometricsMenu variant="quick" />
            <a href="https://osmaniye.edu.tr" target="_blank" rel="noopener noreferrer"><ExternalLink size={18}/><span><b>OKÜ ana sayfa</b><small>Üniversite web sitesine gidin</small></span><i>→</i></a>
          </aside>
        </section>

        <section className="process-band" id="yardim">
          <div><small>YAYIN SÜRECİ</small><h2>Akademik bilgi, kontrollü bir süreçle yayımlanır.</h2></div>
          <ol><li><b>01</b><span><strong>Akademisyen hazırlar</strong><small>Ders bilgilerini ve AKTS iş yükünü girer.</small></span></li><li><b>02</b><span><strong>Koordinatör inceler</strong><small>İçerik ve program uyumu kontrol edilir.</small></span></li><li><b>03</b><span><strong>Onaylı sürüm yayımlanır</strong><small>Public katalog herkesin erişimine açılır.</small></span></li></ol>
        </section>
      </div>

      <footer className="oku-footer"><div><span className="footer-logo"><img src={dbpPath("/oku-logo.png")} alt="OKÜ"/></span><div><strong>LEE Bilgi Sistemi</strong><p>Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü</p></div></div><div><a href={dbpPath("/katalog")}>Ders Kataloğu</a><a href="https://e-enstitu.osmaniye.edu.tr/" target="_blank" rel="noopener noreferrer">e-Enstitü</a><a href="https://osmaniye.edu.tr" target="_blank" rel="noopener noreferrer">OKÜ Web Sitesi</a><span className="version-text">Versiyon: {APP_VERSION}</span></div></footer>
    </main>
  );
}
