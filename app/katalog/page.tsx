import type { Metadata } from "next";
import { DemoCoursePackage } from "./DemoCoursePackage";
import { PackageNavigation } from "./PackageNavigation";
import { dbpPath } from "../../lib/dbpPath";
import { coursePdfHref } from "../../lib/coursePdf";

export const metadata: Metadata = { title: "Ders Kataloğu" };

const courses = [
  ["LEE 501", "Bilimsel Araştırma Yöntemleri ve Etik", "Ortak Zorunlu • 6 AKTS"],
  ["BLM 512", "İleri Algoritma Analizi", "Bilgisayar Mühendisliği • 7,5 AKTS"],
  ["İŞL 603", "Stratejik Yönetim Teorileri", "İşletme Doktora • 7,5 AKTS"],
  ["BYL 524", "Moleküler Biyoloji Teknikleri", "Biyoloji • 6 AKTS"],
];

type CatalogSearchParams = {
  ders?: string;
  ad?: string;
  tur?: string;
  t?: string;
  u?: string;
  kredi?: string;
  akts?: string;
  ogretimElemani?: string;
  sdg?: string;
  pdf?: string;
  program?: string;
};

export default async function Catalog({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;
  if (params.ders) {
    const known = courses.find(([code]) => code === params.ders);
    const courseName = params.ad ?? known?.[1] ?? "Bilimsel Araştırma ve Alan Uygulamaları";
    const pdfHref = coursePdfHref({
      code: params.ders,
      name: courseName,
      program: params.program,
      explicitHref: params.pdf,
    });
    return (
      <div className="package-with-sidebar">
        <PackageNavigation code={params.ders} />
        <DemoCoursePackage
          code={params.ders}
          name={courseName}
          type={params.tur}
          theory={params.t}
          practice={params.u}
          credit={params.kredi}
          ects={params.akts}
          instructor={params.ogretimElemani}
          sdgs={params.sdg}
          pdfHref={pdfHref}
        />
      </div>
    );
  }
  return (
    <main className="simple-page">
      <div className="simple-shell">
        <header className="simple-nav">
          <a className="brand" href={dbpPath("/")}><span className="brand-mark">DBP</span><strong>LEE Ders Bilgi Paketi</strong></a>
          <a className="back-link" href={dbpPath("/")}>← Ana sayfa</a>
        </header>
        <span className="eyebrow">PUBLIC KATALOG</span>
        <h1 className="page-title">Onaylanmış ders bilgi paketleri</h1>
        <section className="catalog-list">
          {courses.map(([code, name, meta]) => (
            <a className="course-row" href={dbpPath(`/katalog?ders=${encodeURIComponent(code)}`)} key={code}>
              <span className="course-code">{code}</span>
              <div><h3>{name}</h3><p>{meta}</p></div>
              <span className="badge">2026–2027</span>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
