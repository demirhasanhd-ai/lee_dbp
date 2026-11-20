"use client";

import { useEffect, useState } from "react";
import { dbpPath } from "../../../lib/dbpPath";

type ProgramRatio = {
  department: string;
  programName: string;
  level: string;
  activeStudents: number | null;
  advisorCount: number | null;
  studentsPerAdvisor: number | null;
  suppressed: boolean;
  statusDataComplete: boolean;
};
type AnnualObservation = { year: number; observedAt: string; method?: string; programs: ProgramRatio[] };
type StatisticsResponse = { message?: string; advisorRatioHistory?: AnnualObservation[] };

function formatRatio(row: ProgramRatio) {
  if (row.studentsPerAdvisor != null) return row.studentsPerAdvisor.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (row.suppressed) return "Gizlilik eşiği";
  if (!row.statusDataComplete) return "Öğrenci verisi eksik";
  if (row.advisorCount === 0) return "Danışman bulunmuyor";
  if (row.advisorCount == null) return "Yıllık danışman verisi eksik";
  return "Veri eksik";
}

export function ProgramAdvisorStatistics({ department, programName, level }: { department: string; programName: string; level: string }) {
  const [history, setHistory] = useState<AnnualObservation[] | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const supported = level === "Tezli Yüksek Lisans" || level === "Doktora";

  useEffect(() => {
    if (!supported) return;
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/student-statistics"), { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as StatisticsResponse;
        if (!response.ok || response.status === 202) throw new Error(payload.message || "Öğrenci ve danışman göstergeleri alınamadı.");
        return payload.advisorRatioHistory ?? [];
      })
      .then((observations) => { if (!controller.signal.aborted) setHistory(observations); })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Göstergeler alınamadı.");
      });
    return () => controller.abort();
  }, [retry, supported]);

  if (!supported) return null;
  const rows = (history ?? []).flatMap((observation) => {
    const program = observation.programs.find((item) => item.department === department && item.programName === programName && item.level === level);
    return program ? [{ ...program, year: observation.year, observedAt: observation.observedAt, method: observation.method }] : [];
  }).sort((left, right) => left.year - right.year);
  const title = level === "Doktora" ? "Öğretim üyesi başına doktora öğrenci sayısı" : "Öğretim üyesi başına tezli yüksek lisans öğrenci sayısı";
  const formatCount = (value: number | null) => value == null ? "—" : value.toLocaleString("tr-TR");

  return <article className="public-profile-card" aria-label="Yıllara göre program istatistikleri">
    <div className="profile-card-heading"><h3>{title}</h3></div>
    <p>Programın aktif öğrenci sayısı / ABD’ye bağlı danışman sayısı</p>
    {error ? <div role="alert"><p>{error}</p><button className="table-action" type="button" onClick={() => { setError(""); setHistory(null); setRetry((value) => value + 1); }}>Yeniden dene</button></div>
      : history == null ? <p role="status">Yıllık göstergeler yükleniyor…</p>
        : !rows.length ? <p>Bu program için yıllık öğrenci ve danışman verisi henüz kaydedilmedi.</p>
          : <>
            <div className="quality-table-scroll"><table className="quality-table">
              <caption>Yıllara göre aktif öğrenci ve ABD danışman sayıları</caption>
              <thead><tr><th scope="col">Yıl</th><th scope="col">Veri tarihi</th><th scope="col">Aktif öğrenci</th><th scope="col">ABD danışmanı</th><th scope="col">Öğrenci / danışman</th></tr></thead>
              <tbody>{rows.map((row) => <tr key={row.year}>
                <th scope="row">{row.year}</th>
                <td>{new Date(row.observedAt).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" })}</td>
                <td>{formatCount(row.activeStudents)}</td>
                <td>{formatCount(row.advisorCount)}</td>
                <td>{formatRatio(row)}</td>
              </tr>)}</tbody>
            </table></div>
            <p className="quality-note">Her satır belirtilen veri tarihindeki durumu gösterir. Oran, aynı yıla ait öğrenci ve danışman sayıları bulunduğunda hesaplanır.</p>
            {rows.some((row) => row.method === "enrollment_intervals") && <p className="quality-note">Geçmiş yıl öğrenci sayıları OBS kayıt ve ayrılış tarihleri arasındaki dönemden yıl sonu itibarıyla hesaplanır. Kaynakta geçmiş kayıt dondurma dönemleri bulunmadığında bu dönemler hesaplamadan çıkarılamaz. Geçmiş ABD danışman sayıları için yıllık kayıt gerekir.</p>}
          </>}
  </article>;
}
