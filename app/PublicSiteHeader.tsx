import { BarChart3, Bell, CircleHelp, House, LibraryBig, PieChart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { dbpPath } from "../lib/dbpPath";
import { eEnstituUrl } from "../lib/eEnstituUrl";

export function PublicSiteHeader({ active = "home" }: { active?: "home" | "catalog" | "quality" | "thesisSdg" }) {
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
              <b>LEE <em>Ders Bilgi Paketi</em></b>
              <small>BOLOGNA BİLGİ SİSTEMİ</small>
            </span>
          </a>
          <nav aria-label="Ana menü">
            <a className="return-link" href={eEnstituUrl()}>e-Enstitü</a>
            <a className={active === "home" ? "active" : undefined} href={dbpPath("/")}><House size={18} />Ana Sayfa</a>
            <a className={active === "catalog" ? "active" : undefined} href={dbpPath("/#programlar")}><LibraryBig size={18} />Ders Kataloğu</a>
            <a className={active === "quality" ? "active" : undefined} href={dbpPath("/kalite")}><BarChart3 size={18} />Kalite Göstergeleri</a>
            <a className={active === "thesisSdg" ? "active" : undefined} href={dbpPath("/tez-ska")}><PieChart size={18} />TEZ_SKA Analiz</a>
            <a href={dbpPath("/#duyurular")}><Bell size={18} />Duyurular</a>
            <a href={dbpPath("/#yardim")}><CircleHelp size={18} />Yardım</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
