"use client";

import { useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { fetchDbpCourses, type DbpCourse } from "../../lib/data/dbpCourses";

function courseHref(course: DbpCourse) {
  const params = new URLSearchParams({
    ders: course.code,
    ad: course.name,
    tur: course.type,
    t: String(course.theory),
    u: String(course.practice),
    kredi: String(course.credit ?? course.theory + course.practice),
    akts: String(course.ects),
    bolum: course.department,
    program: course.programName,
    duzey: course.level,
  });
  if (course.instructor) params.set("ogretimElemani", course.instructor);
  return dbpPath(`/katalog?${params.toString()}`);
}

export function CatalogCourseList({
  query,
  initialCourses,
  initialTotal,
}: {
  query: string;
  initialCourses: DbpCourse[];
  initialTotal: number;
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [total, setTotal] = useState(initialTotal);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDbpCourses({ q: query, limit: 120 })
      .then((data) => {
        if (cancelled) return;
        setCourses(data.courses);
        setTotal(data.total);
        setDbReady(true);
      })
      .catch(() => {
        if (!cancelled) setDbReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const resultLabel = useMemo(() => total.toLocaleString("tr-TR"), [total]);

  return (
    <>
      <div className="catalog-result-heading">
        <div><b>{resultLabel} sonuç</b>{query && <span>“{query}” araması</span>}</div>
        {total > courses.length && <small>İlk {courses.length} kayıt gösteriliyor. Aramayı daraltabilirsiniz.</small>}
        {!dbReady && <small>Veritabanı yanıtı bekleniyor; ilk katalog görünümü gösteriliyor.</small>}
      </div>
      <section className="catalog-list">
        {courses.map((course, index) => (
          <a className="course-row" href={courseHref(course)} key={`${course.department}-${course.programName}-${course.level}-${course.code}-${index}`}>
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
        {courses.length === 0 && (
          <div className="catalog-empty">
            <h2>Eşleşen ders bulunamadı</h2>
            <p>Farklı bir ders kodu, program adı veya öğretim elemanı yazarak yeniden deneyin.</p>
            <a href={dbpPath("/katalog")}>Tüm dersleri göster</a>
          </div>
        )}
      </section>
    </>
  );
}
