"use client";

import { useEffect, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";

type ProgramScope = { department: string; programName: string; level: string };
type WorkloadResponse = {
  generatedAt: string;
  summary: { activeStudents: number; advisorCount: number; studentsPerAdvisor: number | null };
};

export function QualityAdvisorStatistics({ program }: { program?: ProgramScope }) {
  const department = program?.department ?? "";
  const programName = program?.programName ?? "";
  const level = program?.level ?? "";
  const scope = JSON.stringify([department, programName, level]);
  const [loaded, setLoaded] = useState<{ scope: string; data: WorkloadResponse } | null>(null);
  const [error, setError] = useState<{ scope: string; message: string } | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("timeout"), 12_000);
    const query = new URLSearchParams();
    if (programName) {
      query.set("department", department);
      query.set("programName", programName);
      query.set("level", level);
    }
    fetch(dbpPath("/api/dbp/advisor-workload" + (query.size ? "?" + query : "")), { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Öğrenci ve danışman özeti alınamadı.");
        return payload as WorkloadResponse;
      })
      .then((data) => { if (!controller.signal.aborted) { setError(null); setLoaded({ scope, data }); } })
      .catch((caught: unknown) => {
        if (controller.signal.reason === "timeout") setError({ scope, message: "Öğrenci ve danışman özeti zamanında yüklenemedi. Yeniden deneyin." });
        else if (!controller.signal.aborted) setError({ scope, message: caught instanceof Error ? caught.message : "Özet alınamadı." });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [department, programName, level, scope, retry]);

  const data = loaded?.scope === scope ? loaded.data : null;
  const message = error?.scope === scope ? error.message : "";
  return <section className="quality-panel advisor-panel" aria-label="Güncel öğrenci ve danışman istatistikleri">
    <header><div><small>ÖĞRENCİ VE DANIŞMAN GÖSTERGELERİ</small><h2>Güncel öğrenci ve danışman özeti</h2></div></header>
    <p className="quality-note">{program ? program.programName + " · " + program.level : "Lisansüstü Eğitim Enstitüsü · Tüm programlar"}</p>
    {message ? <div role="alert"><p>{message}</p><button className="table-action" type="button" onClick={() => { setError(null); setLoaded(null); setRetry((value) => value + 1); }}>Yeniden dene</button></div>
      : !data ? <p role="status">Öğrenci ve danışman özeti yükleniyor…</p>
        : <>
          <div className="course-status-summary">
            <article><span>Danışmana bağlı aktif öğrenci</span><b>{data.summary.activeStudents.toLocaleString("tr-TR")}</b></article>
            <article><span>Aktif öğrencisi bulunan danışman</span><b>{data.summary.advisorCount.toLocaleString("tr-TR")}</b></article>
            <article><span>Danışman başına aktif öğrenci</span><b>{data.summary.studentsPerAdvisor == null ? "—" : data.summary.studentsPerAdvisor.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></article>
          </div>
          {data.summary.advisorCount === 0 && <p>Bu kapsamda aktif öğrencisi bulunan danışman yok.</p>}
          <p className="quality-note">Veri tarihi: {new Date(data.generatedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
        </>}
    <p className="quality-note">e-Enstitü’deki aktif danışmanlık atamaları esas alınır. Yalnız seçilen kapsamda en az bir aktif öğrencisi bulunan danışmanlar hesaba katılır. Aynı danışman kapsam içinde bir kez sayılır. Danışman ve öğrenci isimleri gösterilmez.</p>
  </section>;
}
