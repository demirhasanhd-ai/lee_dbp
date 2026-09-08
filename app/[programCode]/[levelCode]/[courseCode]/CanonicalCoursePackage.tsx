"use client";

import { useEffect, useState } from "react";
import { fetchPublicDbpCourse, type DbpCourse } from "../../../../lib/data/dbpCourses";
import { coursePdfHref } from "../../../../lib/coursePdf";
import { DemoCoursePackage } from "../../../katalog/DemoCoursePackage";
import { PackageNavigation } from "../../../katalog/PackageNavigation";
import { PublicSiteHeader } from "../../../PublicSiteHeader";
import { dbpPath } from "../../../../lib/dbpPath";

export function CanonicalCoursePackage({
  department,
  programName,
  level,
  courseCode,
}: {
  department: string;
  programName: string;
  level: string;
  courseCode: string;
}) {
  const [course, setCourse] = useState<DbpCourse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicDbpCourse({ department, programName, level, code: courseCode })
      .then((data) => {
        if (cancelled) return;
        setCourse(data?.course ?? null);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [courseCode, department, level, programName]);

  if (!loaded) {
    return <main className="dbp-page"><PublicSiteHeader/><section className="public-empty"><h1>Ders bilgi paketi hazırlanıyor…</h1></section></main>;
  }
  if (!course) {
    return <main className="dbp-page"><PublicSiteHeader/><section className="public-empty"><h1>Ders bulunamadı</h1><p>Bu ders kodu seçilen programın müfredatında yer almıyor.</p><a href={dbpPath("/katalog")}>Ders kataloğuna dönün</a></section></main>;
  }

  const pdfHref = coursePdfHref({
    code: course.code,
    name: course.name,
    program: programName,
    department,
    level,
    version: course.updatedAt,
  });
  return <div className="package-with-sidebar">
    <PackageNavigation code={course.code} department={department} programName={programName} level={level}/>
    <DemoCoursePackage
      code={course.code}
      name={course.name}
      type={course.type}
      theory={String(course.theory)}
      practice={String(course.practice)}
      credit={String(course.credit ?? course.theory + course.practice)}
      ects={String(course.ects)}
      instructor={course.instructor}
      pdfHref={pdfHref}
      department={department}
      programName={programName}
      level={level}
    />
  </div>;
}
