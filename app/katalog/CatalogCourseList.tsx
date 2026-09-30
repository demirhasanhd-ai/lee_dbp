"use client";

import { useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { fetchDbpCourses, type DbpCourse } from "../../lib/data/dbpCourses";
import { publicCourseHref } from "../../lib/data/publicRoutes";
import {
  fetchProgramVisibility,
  isCoursePublic,
  readProgramVisibility,
  type ProgramVisibilityMap,
} from "../../lib/data/publicVisibility";

function courseHref(course: DbpCourse) {
  const canonical = publicCourseHref(course);
  if (canonical) return dbpPath(canonical);
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
  if (course.updatedAt) params.set("guncelleme", course.updatedAt);
  return dbpPath(`/katalog?${params.toString()}`);
}

export function CatalogCourseList({
  query,
}: {
  query: string;
}) {
  const [courses, setCourses] = useState<DbpCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [visibility, setVisibility] = useState<ProgramVisibilityMap>({});

  useEffect(() => {
    let cancelled = false;
    let finishTimer: number | undefined;
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;
        return Math.min(92, current + 4 + Math.random() * 7);
      });
    }, 260);

    fetchDbpCourses({ q: query, limit: 120, publicVisible: true })
      .then((data) => {
        if (cancelled) return;
        window.clearInterval(progressTimer);
        setProgress(100);
        finishTimer = window.setTimeout(() => {
          if (cancelled) return;
          setCourses(data.courses);
          setTotal(data.total);
          setLoadStatus("ready");
        }, 240);
      })
      .catch(() => {
        if (cancelled) return;
        window.clearInterval(progressTimer);
        setCourses([]);
        setTotal(0);
        setLoadStatus("error");
      });
    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [query]);

  useEffect(() => {
    const sync = () => setVisibility(readProgramVisibility());
    sync();
    fetchProgramVisibility().then((serverVisibility) => {
      setVisibility({ ...serverVisibility, ...readProgramVisibility() });
    });
    window.addEventListener("storage", sync);
    window.addEventListener("lee-dbp-public-visibility-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lee-dbp-public-visibility-change", sync);
    };
  }, []);

  const visibleCourses = useMemo(
    () => courses.filter((course) => isCoursePublic(course, visibility)),
    [courses, visibility],
  );
  const resultLabel = useMemo(() => total.toLocaleString("tr-TR"), [total]);

  return (
    <>
      <div className="catalog-result-heading">
        <div>
          <b>{loadStatus === "ready" ? `${resultLabel} sonuç` : "Ders listesi yükleniyor"}</b>
          {query && <span>“{query}” araması</span>}
        </div>
        {loadStatus === "loading" && <small>Ders listesi veritabanından yükleniyor.</small>}
        {loadStatus === "error" && <small>Ders listesi veritabanından alınamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.</small>}
        {loadStatus === "ready" && total > visibleCourses.length && <small>İlk {visibleCourses.length} kayıt gösteriliyor. Aramayı daraltabilirsiniz.</small>}
      </div>
      <section className="catalog-list">
        {loadStatus === "loading" && (
          <div className="catalog-empty catalog-loading-panel">
            <h2>Ders listesi veritabanından yükleniyor</h2>
            <p>Kayıtlar hazır olduğunda ilk 120 ders burada listelenecek.</p>
            <div className="catalog-progress" role="progressbar" aria-label="Ders listesi yükleme ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <div className="catalog-progress-fill" style={{ width: `${progress}%` }}>
                <span>{Math.floor(progress)}%</span>
              </div>
            </div>
            <small>Veritabanı yanıtı bekleniyor</small>
          </div>
        )}
        {loadStatus === "ready" && visibleCourses.map((course, index) => (
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
        {loadStatus === "ready" && visibleCourses.length === 0 && (
          <div className="catalog-empty">
            <h2>Eşleşen ders bulunamadı</h2>
            <p>Farklı bir ders kodu, program adı veya öğretim elemanı yazarak yeniden deneyin.</p>
            <a href={dbpPath("/katalog")}>Tüm dersleri göster</a>
          </div>
        )}
        {loadStatus === "error" && (
          <div className="catalog-empty">
            <h2>Ders listesi yüklenemedi</h2>
            <p>Veritabanı yanıtı alınamadı. Sayfayı yenileyerek tekrar deneyebilirsiniz.</p>
          </div>
        )}
      </section>
    </>
  );
}
