import { BarChart3, Bell, CircleHelp, Eye, GraduationCap, House, LibraryBig, PieChart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { BibliometricsMenu } from "./BibliometricsMenu";
import { dbpPath } from "../lib/dbpPath";
import { eEnstituUrl } from "../lib/eEnstituUrl";

export function PublicSiteHeader({ active = "home", bibliometricsSource }: { active?: "home" | "catalog" | "quality" | "students" | "thesisSdg" | "bibliometrics" | "viewStats"; bibliometricsSource?: "scopus" | "trdizin" | "doctorate" }) {
  const mobilePriorityClass = "mobile-priority";

  return (
    <header className="oku-header">
      <div className="institution-bar">
        <div className="header-container institution-inner">
          <span />
          <strong>OSMANİYE KORKUT ATA ÜNİVERSİTESİ</strong>
          <div className="header-tools">
            <button type="button">TR / EN</button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="navigation-bar">
        <div className="header-container navigation-inner">
          <a className="oku-brand" href={dbpPath("/")}>
            <span className="logo-box">
              <img src={dbpPath("/oku-logo.png")} alt="OKÜ logosu" />
            </span>
            <span>
              <b>LEE <em>Bilgi Sistemi</em></b>
            </span>
          </a>
          <nav aria-label="Ana menü">
            <a className="return-link" href={eEnstituUrl()}>e-Enstitü</a>
            <a className={active === "home" ? "active" : undefined} href={dbpPath("/")}><House size={18} />Ana Sayfa</a>
            <a className={`nav-two-line${active === "catalog" ? " active" : ""}`} href={dbpPath("/#programlar")}>
              <LibraryBig size={18} />
              <span className="nav-label">Ders<br />Kataloğu</span>
            </a>
            <a className={`nav-two-line ${mobilePriorityClass}${active === "quality" ? " active" : ""}`} href={dbpPath("/kalite")}>
              <BarChart3 size={18} />
              <span className="nav-label">Kalite<br />Göstergeleri</span>
            </a>
            <a className={`nav-two-line${active === "students" ? " active" : ""}`} href={dbpPath("/ogrenci-gostergeleri")}>
              <GraduationCap size={18} />
              <span className="nav-label">Öğrenci<br />Göstergeleri</span>
            </a>
            <a className={`${mobilePriorityClass}${active === "thesisSdg" ? " active" : ""}`} href={dbpPath("/tez-ska")}><PieChart size={18} />TEZ_SKA Analiz</a>
            <BibliometricsMenu active={active === "bibliometrics" ? bibliometricsSource : undefined} />
            <a className={`nav-two-line ${mobilePriorityClass}${active === "viewStats" ? " active" : ""}`} href={dbpPath("/goruntulenme-istatistigi")}>
              <Eye size={18} />
              <span className="nav-label">Görüntülenme<br />İstatistiği</span>
            </a>
            <a href={dbpPath("/#duyurular")}><Bell size={18} />Duyurular</a>
            <a href={dbpPath("/#yardim")}><CircleHelp size={18} />Yardım</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
