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
  const mainDepartments = visibleMainDepartments || stats?.mainDepartments;
  const electiveRate = stats ? (stats.totalCourses > 0 ? (stats.electiveCourses / stats.totalCourses) * 100 : 0) : undefined;
  const numberLabel = (value?: number) =>
    loadStatus === "ready" && typeof value === "number" ? value.toLocaleString("tr-TR") : "—";
  const percentLabel = (value?: number) =>
    loadStatus === "ready" && typeof value === "number"
      ? (value / 100).toLocaleString("tr-TR", { style: "percent", maximumFractionDigits: 1 })
      : "—";

  return (
    <>
      <div className="banner-board" data-stats-source={stats?.source || loadStatus}>
        <div className="board-heading"><div><small>CANLI KATALOG</small><strong>Ders Kataloğu</strong></div><span>{loadStatus === "error" ? "Veritabanı bekleniyor" : "Yayımdaki katalog"}</span></div>
        <div className="board-main"><strong>{numberLabel(stats?.totalCourses)}</strong><span>Ders kataloğundaki toplam ders</span></div>
        <div className="board-stats"><div><b>{numberLabel(mainDepartments)}</b><span>ABD/ASD</span></div><div><b>{numberLabel(stats?.totalPrograms)}</b><span>Program</span></div><div><b>{numberLabel(stats?.instructors)}</b><span>Akademisyen</span></div></div>
        <a href={dbpPath("/katalog")}>Kataloğu inceleyin <span>→</span></a>
      </div>
      <div className="hero-stats" aria-label="Canlı ders kataloğu istatistikleri">
        <article><small>Toplam ders</small><strong>{numberLabel(stats?.totalCourses)}</strong><span>{numberLabel(mainDepartments)} Ana ABD / ASD</span></article>
        <article><small>Lisansüstü program</small><strong>{numberLabel(stats?.totalPrograms)}</strong><span>{numberLabel(levels.tezsiz)} tezsiz YL · {numberLabel(levels.tezli)} tezli YL · {numberLabel(levels.doktora)} doktora</span></article>
        <article><small>Seçmeli ders oranı</small><strong>{percentLabel(electiveRate)}</strong><span>{numberLabel(stats?.compulsoryCourses)} zorunlu · {numberLabel(stats?.electiveCourses)} seçmeli</span></article>
        <article><small>Yarıyıl dağılımı</small><div className="hero-term-stats" title="Güz ve Bahar yarıyıllarında yer alan dersler her iki yarıyılın sayısına dahildir."><div><strong>{numberLabel(stats?.fallCourses)}</strong><span>Güz</span></div><div><strong>{numberLabel(stats?.springCourses)}</strong><span>Bahar</span></div></div></article>
        <article><small>Öğretim elemanı</small><strong>{numberLabel(stats?.instructors)}</strong><span>Ders Atanma Oranı {percentLabel(stats?.assignmentRate)}</span></article>
      </div>
    </>
  );
}
