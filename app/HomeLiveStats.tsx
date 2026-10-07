"use client";

import { useEffect, useMemo, useState } from "react";
import { COURSE_STATS, type CourseStats } from "../lib/data/courseStats";
import { LEE_PROGRAMS, MAIN_DEPARTMENTS } from "../lib/data/programs";
import {
  DEFAULT_HIDDEN_PROGRAM_KEYS,
  fetchProgramVisibility,
  programVisibilityKey,
  publicLevelsForProgram,
  readProgramVisibility,
  type ProgramVisibilityMap,
} from "../lib/data/publicVisibility";
import { dbpPath } from "../lib/dbpPath";

type LiveCourseStats = CourseStats & {
  source?: "database";
  instructorSource?: string;
  generatedAt?: string;
};

export function HomeLiveStats() {
  const [stats, setStats] = useState<LiveCourseStats>(COURSE_STATS);
  const [visibility, setVisibility] = useState<ProgramVisibilityMap>({});

  const visibleMainDepartments = useMemo(() => {
    const publicPrograms = LEE_PROGRAMS.filter((item) =>
      !DEFAULT_HIDDEN_PROGRAM_KEYS.has(programVisibilityKey(item)) &&
      publicLevelsForProgram(item, visibility).length > 0,
    );
    return MAIN_DEPARTMENTS.filter((main) =>
      publicPrograms.some((item) => item.mainDepartment === main),
    ).length;
  }, [visibility]);

  useEffect(() => {
    const controller = new AbortController();
    const loadStats = () => {
      fetch(dbpPath("/api/dbp/home-stats"), { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("Ana sayfa istatistikleri alınamadı.");
          return response.json() as Promise<LiveCourseStats>;
        })
        .then(setStats)
        .catch((reason: unknown) => {
          if (reason instanceof Error && reason.name !== "AbortError") console.warn(reason.message);
        });
    };
    loadStats();
    return () => {
      controller.abort();
    };
  }, []);

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

  return (
    <>
      <div className="banner-board" data-stats-source={stats.source || "initial"}>
        <div className="board-heading"><div><small>{stats.academicYear} AKADEMİK YILI</small><strong>Ders Kataloğu</strong></div><span>{stats.source === "database" ? "Canlı müfredat" : "Resmi müfredat"}</span></div>
        <div className="board-main"><strong>{stats.totalCourses.toLocaleString("tr-TR")}</strong><span>{stats.academicYear} müfredatı ders sayısı</span></div>
        <div className="board-stats"><div><b>{stats.totalPrograms}</b><span>Program paketi</span></div><div><b>{stats.assignmentRate}%</b><span>Akademisyen atama oranı</span></div><div><b>{stats.instructors.toLocaleString("tr-TR")}</b><span>Akademisyen</span></div></div>
        <a href={dbpPath("/katalog")}>Kataloğu inceleyin <span>→</span></a>
      </div>
      <div className="hero-stats" aria-label={`${stats.academicYear} canlı müfredat istatistikleri`}>
        <article><small>Ders havuzu</small><strong>{stats.totalCourses.toLocaleString("tr-TR")}</strong><span>{visibleMainDepartments || stats.mainDepartments} Ana ABD / ASD</span></article>
        <article><small>Program düzeyi</small><strong>{stats.totalPrograms}</strong><span>{stats.levels.tezsiz} tezsiz · {stats.levels.tezli} tezli · {stats.levels.doktora} doktora</span></article>
        <article><small>Ders türü</small><strong>{stats.electiveCourses.toLocaleString("tr-TR")}</strong><span>{stats.compulsoryCourses.toLocaleString("tr-TR")} zorunlu · {stats.electiveCourses.toLocaleString("tr-TR")} seçmeli</span></article>
        <article><small>Yarıyıl</small><strong>{stats.fallCourses.toLocaleString("tr-TR")}</strong><span>{stats.fallCourses.toLocaleString("tr-TR")} güz · {stats.springCourses.toLocaleString("tr-TR")} bahar</span></article>
        <article><small>Öğretim elemanı</small><strong>{stats.instructors.toLocaleString("tr-TR")}</strong><span>{stats.unassignedCourses.toLocaleString("tr-TR")} atama bekliyor</span></article>
      </div>
    </>
  );
}
