import type { Metadata } from "next";
import { DemoCoursePackage } from "./DemoCoursePackage";
import { PackageNavigation } from "./PackageNavigation";
import { CatalogCourseList } from "./CatalogCourseList";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";
import { coursePdfHref } from "../../lib/coursePdf";
import { OFFICIAL_COURSES } from "../../lib/data/courseCatalog";
import type { OfficialCourse } from "../../lib/data/officialCourses";
import type { DbpCourse } from "../../lib/data/dbpCourses";

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

function toDbpCourse(course: OfficialCourse): DbpCourse {
  return {
    academicYear: course.academicYear,
    programCode: course.programCode,
    department: course.department,
    programName: course.programName,
    level: course.level,
    code: course.code,
    name: course.name,
    type: course.type,
    credit: course.credit,
    ects: course.ects,
    theory: course.theory,
    practice: course.practice,
    term: course.term,
    status: course.status,
    instructor: course.instructor,
    source: course.source,
  };
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
  const initialCourses = matchingCourses.slice(0, 120).map(toDbpCourse);

  return (
    <main className="dbp-page catalog-page">
      <PublicSiteHeader active="catalog" />
      <section className="catalog-hero">
        <div>
          <span className="eyebrow">RESMİ MÜFREDAT</span>
          <h1>Ders Kataloğu</h1>
          <p>2026-2027 akademik yılına ait lisansüstü dersleri; ders kodu, program, ana bilim dalı veya öğretim elemanına göre arayın.</p>
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
        <CatalogCourseList query={query} initialCourses={initialCourses} initialTotal={matchingCourses.length} />
      </section>
    </main>
  );
}
