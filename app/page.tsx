import type { Metadata } from "next";
import {
  Bell,
  BellRing,
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileCheck,
  CircleHelp,
  DoorOpen,
  House,
  LibraryBig,
  School,
  Search,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ProgramDirectory } from "./ProgramDirectory";
import { COURSE_STATS } from "../lib/data/courseStats";

export const metadata: Metadata = {
  title: "LEE Ders Bilgi Paketi",
  description: "Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü Ders Bilgi Paketi.",
};

const notices = [
  ["2026–2027 ders bilgi paketi güncelleme takvimi", "16.07.2026"],
  ["Program çıktıları ve ders öğrenme çıktıları eşleştirmeleri", "11.07.2026"],
  ["AKTS iş yükü hesaplamalarında dikkat edilecek hususlar", "04.07.2026"],
];

export default function Home() {
  const stats = COURSE_STATS;

  return (
    <main className="dbp-page">
      <header className="oku-header">
        <div className="institution-bar">
          <div className="header-container institution-inner">
            <span />
            <strong>OSMANİYE KORKUT ATA ÜNİVERSİTESİ</strong>
            <div className="header-tools"><button type="button">TR / EN</button><ThemeToggle /></div>
          </div>
        </div>
        <div className="navigation-bar">
          <div className="header-container navigation-inner">
            <a className="oku-brand" href="/">
              <span className="logo-box"><img src="/oku-logo.png" alt="Osmaniye Korkut Ata Üniversitesi logosu" /></span>
              <span><b>LEE <em>Ders Bilgi Paketi</em></b><small>BOLOGNA BİLGİ SİSTEMİ</small></span>
            </a>
            <nav aria-label="Ana menü">
              <a className="active" href="/"><House size={18}/>Ana Sayfa</a>
              <a href="/katalog"><LibraryBig size={18}/>Ders Kataloğu</a>
              <a href="#programlar"><School size={18}/>Programlar<ChevronDown size={14}/></a>
              <a href="#duyurular"><BellRing size={18}/>Duyurular</a>
              <a href="#yardim"><CircleHelp size={18}/>Yardım</a>
            </nav>
            <a className="login-button" href="/yonetim"><DoorOpen size={19}/>Giriş Yap</a>
          </div>
        </div>
      </header>

      <section className="top-banner">
        <div className="banner-orbit orbit-one"/><div className="banner-orbit orbit-two"/>
        <div className="banner-content">
          <div className="banner-copy">
            <div className="banner-controls">
              <span className="banner-label">LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ</span>
              <details className="period-menu">
                <summary><span>Güncel Dönem</span><b>2026–2027</b><ChevronDown size={14}/></summary>
                <div className="period-options">
                  <a className="current" href="/katalog?donem=2026-2027"><span>Güncel dönem</span><b>2026–2027</b></a>
                  <a href="/katalog?donem=2025-2026"><span>Müfredat bilgileri</span><b>2025–2026</b></a>
                  <a href="/katalog?donem=2024-2025"><span>Müfredat bilgileri</span><b>2024–2025</b></a>
                  <a href="/katalog?donem=2023-2024"><span>Müfredat bilgileri</span><b>2023–2024</b></a>
                  <a href="/katalog?donem=2022-2023"><span>Müfredat bilgileri</span><b>2022–2023</b></a>
                </div>
              </details>
            </div>
            <h1>LEE <span>Ders Bilgi Paketi</span></h1>
            <p>Derslerin Bologna bilgilerine, öğrenme çıktılarına, haftalık içeriklerine ve AKTS iş yüklerine tek noktadan ulaşın.</p>
            <form className="banner-search" action="/katalog">
              <Search size={19}/><label className="sr-only" htmlFor="home-search">Ders ara</label>
              <input id="home-search" name="q" placeholder="Ders kodu, ders adı veya program ara..."/>
              <button type="submit">Ders Ara</button>
            </form>
          </div>
          <div className="banner-board">
            <div className="board-heading"><div><small>{stats.academicYear} AKADEMİK YILI</small><strong>Ders Kataloğu</strong></div><span>Resmi müfredat</span></div>
            <div className="board-main"><strong>{stats.totalCourses.toLocaleString("tr-TR")}</strong><span>Excel importlarından gelen ders kaydı</span></div>
            <div className="board-stats"><div><b>{stats.totalPrograms}</b><span>Program paketi</span></div><div><b>{stats.assignmentRate}%</b><span>Hoca atama oranı</span></div><div><b>{stats.instructors}</b><span>Akademisyen</span></div></div>
            <a href="/katalog">Kataloğu inceleyin <span>→</span></a>
          </div>
          <div className="hero-stats" aria-label="2026–2027 müfredat istatistikleri">
            <article><small>Ders havuzu</small><strong>{stats.totalCourses.toLocaleString("tr-TR")}</strong><span>{stats.mainDepartments} ABD / ASD</span></article>
            <article><small>Program düzeyi</small><strong>{stats.totalPrograms}</strong><span>{stats.levels.tezsiz} tezsiz · {stats.levels.tezli} tezli · {stats.levels.doktora} doktora</span></article>
            <article><small>Ders türü</small><strong>{stats.electiveCourses.toLocaleString("tr-TR")}</strong><span>{stats.compulsoryCourses.toLocaleString("tr-TR")} zorunlu · {stats.electiveCourses.toLocaleString("tr-TR")} seçmeli</span></article>
            <article><small>Yarıyıl</small><strong>{stats.fallCourses.toLocaleString("tr-TR")}</strong><span>{stats.fallCourses.toLocaleString("tr-TR")} güz · {stats.springCourses.toLocaleString("tr-TR")} bahar</span></article>
            <article><small>Öğretim elemanı</small><strong>{stats.instructors.toLocaleString("tr-TR")}</strong><span>{stats.unassignedCourses.toLocaleString("tr-TR")} atama bekliyor</span></article>
          </div>
        </div>
        <a className="scroll-cue" href="#icerik"><span>Sayfayı keşfet</span><i>↓</i></a>
      </section>

      <div id="icerik" className="scroll-content">
        <section className="content-section" id="programlar">
          <div className="section-title"><div><span className="title-line"/><div><small>AKADEMİK YAPI</small><h2>LEE ABD / ASD ve lisansüstü programları</h2></div></div><a href="/katalog">Ders kataloğu →</a></div>
          <ProgramDirectory/>
        </section>

        <section className="content-section two-column" id="duyurular">
          <div>
            <div className="section-title"><div><span className="title-line accent"/><div><small>GÜNCEL BİLGİLER</small><h2>Duyurular</h2></div></div><a href="#duyurular">Tümü →</a></div>
            <div className="notice-list">{notices.map(([title,date],index)=><article key={title} className={index===0?"important":""}><span className="notice-icon">{index===0?<Bell size={18}/>:<BookOpen size={18}/>}</span><div><h3>{title}</h3><p>Ders Bilgi Paketi Koordinatörlüğü</p></div><time>{date}</time></article>)}</div>
          </div>
          <aside className="quick-panel">
            <div className="section-title compact"><div><span className="title-line"/><div><small>İŞLEMLER</small><h2>Hızlı erişim</h2></div></div></div>
            <a href="/katalog"><Search size={18}/><span><b>Ders bilgi paketi ara</b><small>Public katalogda arama yapın</small></span><i>→</i></a>
            <a href="/yonetim"><FileCheck size={18}/><span><b>Bologna bilgisi girişi</b><small>Yetkili derslerinizi düzenleyin</small></span><i>→</i></a>
            <a href="https://osmaniye.edu.tr"><ExternalLink size={18}/><span><b>OKÜ ana sayfa</b><small>Üniversite web sitesine gidin</small></span><i>→</i></a>
          </aside>
        </section>

        <section className="process-band" id="yardim">
          <div><small>YAYIN SÜRECİ</small><h2>Akademik bilgi, kontrollü bir süreçle yayımlanır.</h2></div>
          <ol><li><b>01</b><span><strong>Akademisyen hazırlar</strong><small>Ders bilgilerini ve AKTS iş yükünü girer.</small></span></li><li><b>02</b><span><strong>Koordinatör inceler</strong><small>İçerik ve program uyumu kontrol edilir.</small></span></li><li><b>03</b><span><strong>Onaylı sürüm yayımlanır</strong><small>Public katalog herkesin erişimine açılır.</small></span></li></ol>
        </section>
      </div>

      <footer className="oku-footer"><div><span className="footer-logo"><img src="/oku-logo.png" alt="OKÜ"/></span><div><strong>LEE Ders Bilgi Paketi</strong><p>Osmaniye Korkut Ata Üniversitesi Lisansüstü Eğitim Enstitüsü</p></div></div><div><a href="/katalog">Ders Kataloğu</a><a href="/yonetim">Yönetim Alanı</a><a href="https://osmaniye.edu.tr">OKÜ Web Sitesi</a></div></footer>
    </main>
  );
}
