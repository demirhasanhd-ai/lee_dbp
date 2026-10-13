"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseStats } from "../lib/data/courseStats";
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
  const [stats, setStats] = useState<LiveCourseStats | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
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
        .then((nextStats) => {
          setStats(nextStats);
          setLoadStatus("ready");
        })
        .catch((reason: unknown) => {
          if (reason instanceof Error && reason.name !== "AbortError") console.warn(reason.message);
          if (!(reason instanceof Error) || reason.name !== "AbortError") setLoadStatus("error");
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

  const levels = stats?.levels ?? { tezsiz: 0, tezli: 0, doktora: 0 };
  const numberLabel = (value?: number) =>
    loadStatus === "ready" && typeof value === "number" ? value.toLocaleString("tr-TR") : "—";
  const percentLabel = (value?: number) =>
    loadStatus === "ready" && typeof value === "number" ? `${value}%` : "—";

  return (
    <>
      <div className="banner-board" data-stats-source={stats?.source || loadStatus}>
        <div className="board-heading"><div><small>CANLI KATALOG</small><strong>Ders Kataloğu</strong></div><span>{loadStatus === "error" ? "Veritabanı bekleniyor" : "Yayımdaki katalog"}</span></div>
        <div className="board-main"><strong>{numberLabel(stats?.totalCourses)}</strong><span>Ders kataloğundaki toplam ders</span></div>
        <div className="board-stats"><div><b>{numberLabel(stats?.totalPrograms)}</b><span>Program paketi</span></div><div><b>{percentLabel(stats?.assignmentRate)}</b><span>Akademisyen atama oranı</span></div><div><b>{numberLabel(stats?.instructors)}</b><span>Akademisyen</span></div></div>
        <a href={dbpPath("/katalog")}>Kataloğu inceleyin <span>→</span></a>
      </div>
      <div className="hero-stats" aria-label="Canlı ders kataloğu istatistikleri">
        <article><small>Ders havuzu</small><strong>{numberLabel(stats?.totalCourses)}</strong><span>{numberLabel(visibleMainDepartments || stats?.mainDepartments)} Ana ABD / ASD</span></article>
        <article><small>Program düzeyi</small><strong>{numberLabel(stats?.totalPrograms)}</strong><span>{levels.tezsiz} tezsiz · {levels.tezli} tezli · {levels.doktora} doktora</span></article>
        <article><small>Ders türü</small><strong>{numberLabel(stats?.electiveCourses)}</strong><span>{numberLabel(stats?.compulsoryCourses)} zorunlu · {numberLabel(stats?.electiveCourses)} seçmeli</span></article>
        <article><small>Yarıyıl</small><strong>{numberLabel(stats?.fallCourses)}</strong><span>{numberLabel(stats?.fallCourses)} güz · {numberLabel(stats?.springCourses)} bahar</span></article>
        <article><small>Öğretim elemanı</small><strong>{numberLabel(stats?.instructors)}</strong><span>{numberLabel(stats?.unassignedCourses)} atama bekliyor</span></article>
      </div>
    </>
  );
}
