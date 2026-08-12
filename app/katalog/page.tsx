import type { Metadata } from "next";
import { DemoCoursePackage } from "./DemoCoursePackage";
import { PackageNavigation } from "./PackageNavigation";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";
import { coursePdfHref } from "../../lib/coursePdf";
import { OFFICIAL_COURSES } from "../../lib/data/courseCatalog";
import type { OfficialCourse } from "../../lib/data/officialCourses";

export const metadata: Metadata = { title: "Ders Kataloğu" };

type CatalogSearchParams = {
  q?: string;
  donem?: string;
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
};

function courseHref(course: OfficialCourse) {
  const params = new URLSearchParams({
    ders: course.code,
    ad: course.name,
    tur: course.type,
    t: String(course.theory),
    u: String(course.practice),
    kredi: String(course.credit),
    akts: String(course.ects),
    bolum: course.department,
    program: course.programName,
    duzey: course.level,
  });
  if (course.instructor) params.set("ogretimElemani", course.instructor);
  return dbpPath(`/katalog?${params.toString()}`);
}

export default async function Catalog({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;
  if (params.ders) {
    const known = OFFICIAL_COURSES.find((course) => course.code === params.ders);
    const courseName = params.ad ?? known?.name ?? "Bilimsel Araştırma ve Alan Uygulamaları";
    const pdfHref = coursePdfHref({
      code: params.ders,
      name: courseName,
      program: params.program,
      explicitHref: params.pdf,
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
          department={params.bolum ?? known?.department}
          programName={params.program ?? known?.programName}
          level={params.duzey ?? known?.level}
        />
      </div>
    );
  }

  const query = params.q?.trim() ?? "";
  const normalizedQuery = query.toLocaleLowerCase("tr-TR");
  const matchingCourses = OFFICIAL_COURSES.filter((course) => {
    if (!normalizedQuery) return true;
    return [
      course.code,
      course.name,
      course.department,
      course.programName,
      course.level,
      course.instructor,
    ].some((value) => value?.toLocaleLowerCase("tr-TR").includes(normalizedQuery));
  });
  const visibleCourses = matchingCourses.slice(0, 120);

  return (
    <main className="dbp-page catalog-page">
      <PublicSiteHeader active="catalog" />
      <section className="catalog-hero">
        <div>
          <span className="eyebrow">RESMİ MÜFREDAT</span>
          <h1>Ders Kataloğu</h1>
          <p>2026–2027 akademik yılına ait lisansüstü dersleri; ders kodu, program, ana bilim dalı veya öğretim elemanına göre arayın.</p>
        </div>
        <div className="catalog-total"><strong>{OFFICIAL_COURSES.length.toLocaleString("tr-TR")}</strong><span>ders kaydı</span></div>
      </section>
      <section className="catalog-content">
        <form className="catalog-search" action={dbpPath("/katalog")}>
          <label htmlFor="catalog-query">Ders kataloğunda ara</label>
          <div>
            <input id="catalog-query" name="q" defaultValue={query} placeholder="Ders kodu, ders adı, program veya öğretim elemanı..." />
            <button type="submit">Ara</button>
          </div>
        </form>
        <div className="catalog-result-heading">
          <div><b>{matchingCourses.length.toLocaleString("tr-TR")} sonuç</b>{query && <span>“{query}” araması</span>}</div>
          {matchingCourses.length > visibleCourses.length && <small>İlk {visibleCourses.length} kayıt gösteriliyor. Aramayı daraltabilirsiniz.</small>}
        </div>
        <section className="catalog-list">
          {visibleCourses.map((course, index) => (
            <a className="course-row" href={courseHref(course)} key={`${course.department}-${course.level}-${course.code}-${index}`}>
              <span className="course-code">{course.code}</span>
              <div>
                <h3>{course.name}</h3>
                <p>{course.programName} · {course.level}</p>
                <small>{course.department}</small>
              </div>
              <div className="catalog-course-meta">
                <span>{course.type}</span>
                <b>{course.ects} AKTS</b>
                <small>{course.term}</small>
              </div>
            </a>
          ))}
          {visibleCourses.length === 0 && (
            <div className="catalog-empty">
              <h2>Eşleşen ders bulunamadı</h2>
              <p>Farklı bir ders kodu, program adı veya öğretim elemanı yazarak yeniden deneyin.</p>
              <a href={dbpPath("/katalog")}>Tüm dersleri göster</a>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
