import type { Metadata } from "next";
import { DemoCoursePackage } from "./DemoCoursePackage";
import { PackageNavigation } from "./PackageNavigation";

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
};

export default async function Catalog({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;
  if (params.ders) {
    const known = courses.find(([code]) => code === params.ders);
    return (
      <div className="package-with-sidebar">
        <PackageNavigation code={params.ders} />
        <DemoCoursePackage
          code={params.ders}
          name={params.ad ?? known?.[1] ?? "Bilimsel Araştırma ve Alan Uygulamaları"}
          type={params.tur}
          theory={params.t}
          practice={params.u}
          credit={params.kredi}
          ects={params.akts}
          instructor={params.ogretimElemani}
        />
      </div>
    );
  }
  return (
    <main className="simple-page">
      <div className="simple-shell">
        <header className="simple-nav">
          <a className="brand" href="/"><span className="brand-mark">DBP</span><strong>LEE Ders Bilgi Paketi</strong></a>
          <a className="back-link" href="/">← Ana sayfa</a>
        </header>
        <span className="eyebrow">PUBLIC KATALOG</span>
        <h1 className="page-title">Onaylanmış ders bilgi paketleri</h1>
        <section className="catalog-list">
          {courses.map(([code, name, meta]) => (
            <a className="course-row" href={`/katalog?ders=${encodeURIComponent(code)}`} key={code}>
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
