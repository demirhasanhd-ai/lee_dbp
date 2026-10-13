import type { Metadata } from "next";
import { DemoCoursePackage } from "./DemoCoursePackage";
import { PackageNavigation } from "./PackageNavigation";
import { CatalogCourseList } from "./CatalogCourseList";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";
import { coursePdfHref } from "../../lib/coursePdf";

export const metadata: Metadata = { title: "Ders Kataloğu" };

type CatalogSearchParams = {
  q?: string;
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
  bolum?: string;
  program?: string;
  duzey?: string;
  guncelleme?: string;
};

export default async function Catalog({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;
  if (params.ders) {
    const courseName = params.ad ?? "Bilimsel Araştırma ve Alan Uygulamaları";
    const pdfHref = coursePdfHref({
      code: params.ders,
      name: courseName,
      program: params.program,
      department: params.bolum,
      level: params.duzey,
      explicitHref: params.pdf,
      version: params.guncelleme,
    });
    return (
      <div className="package-with-sidebar">
        <PackageNavigation
          code={params.ders}
          department={params.bolum}
          programName={params.program}
          level={params.duzey}
        />
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
          department={params.bolum}
          programName={params.program}
          level={params.duzey}
        />
      </div>
    );
  }

  const query = params.q?.trim() ?? "";

  return (
    <main className="dbp-page catalog-page">
      <PublicSiteHeader active="catalog" />
      <section className="catalog-hero">
        <div>
          <span className="eyebrow">CANLI VERİTABANI</span>
          <h1>Ders Kataloğu</h1>
          <p>Lisansüstü dersler canlı katalog veritabanından yüklenir; ders kodu, ders adı, program, ana bilim dalı veya öğretim elemanına göre arayın.</p>
        </div>
        <div className="catalog-total"><strong>Canlı</strong><span>veritabanı</span></div>
      </section>
      <section className="catalog-content">
        <form className="catalog-search" action={dbpPath("/katalog")}>
          <label htmlFor="catalog-query">Ders kataloğunda ara</label>
          <div>
            <input id="catalog-query" name="q" defaultValue={query} placeholder="Ders kodu, ders adı, program veya öğretim elemanı..." />
            <button type="submit">Ara</button>
          </div>
        </form>
        <CatalogCourseList key={query} query={query} />
      </section>
    </main>
  );
}
