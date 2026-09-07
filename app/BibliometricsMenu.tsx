"use client";

import { BookOpenCheck, ChevronDown, Construction, Database, ScatterChart } from "lucide-react";
import { dbpPath } from "../lib/dbpPath";

type BibliometricsSource = "scopus" | "trdizin" | "doctorate";

export function BibliometricsMenu({ active }: { active?: BibliometricsSource }) {
  return (
    <details className={`bibliometrics-menu${active ? " active" : ""}`}>
      <summary><ScatterChart size={18} /><span>Bibliyometrik Göstergeler</span><ChevronDown className="menu-chevron" size={14} /></summary>
      <div className="bibliometrics-options">
        <a className={active === "scopus" ? "current" : undefined} href={dbpPath("/article")}><Database size={16} /><span><b>SCOPUS Tabanlı</b><small>Uluslararası yayın ve atıf analizi</small></span></a>
        <a className={active === "trdizin" ? "current" : undefined} href={dbpPath("/yayin")}><BookOpenCheck size={16} /><span><b>TR DİZİN Tabanlı</b><small>Ulusal yayın ve proje analizi</small></span></a>
        <a className={active === "doctorate" ? "current" : undefined} href={dbpPath("/article/doktora")}><Construction size={16} /><span><b>Doktora Tabanlı</b><small>Hazırlanıyor</small></span></a>
      </div>
    </details>
  );
}
