"use client";

import { useEffect, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";

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
type ProgramScope = Pick<ProgramRatio, "department" | "programName" | "level">;

const researchLevels = new Set(["Tezli Yüksek Lisans", "Doktora"]);

function formatRatio(row: ProgramRatio) {
  if (row.studentsPerAdvisor != null) return row.studentsPerAdvisor.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (row.suppressed) return "Gizlilik eşiği";
  if (!row.statusDataComplete) return "Öğrenci verisi eksik";
  if (row.advisorCount === 0) return "Danışman bulunmuyor";
  if (row.advisorCount == null) return "Yıllık danışman verisi eksik";
  return "Veri eksik";
}

export function QualityAdvisorStatistics({ program }: { program?: ProgramScope }) {
  const [history, setHistory] = useState<AnnualObservation[] | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const supported = !program || researchLevels.has(program.level);
  const isInstitute = !program;

  useEffect(() => {
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
  }, [retry]);

  const rows = (history ?? []).flatMap((observation) => observation.programs
    .filter((item) => researchLevels.has(item.level) && (!program || (
      item.department === program.department && item.programName === program.programName && item.level === program.level
    )))
    .map((item) => ({ ...item, year: observation.year, observedAt: observation.observedAt, method: observation.method })))
    .sort((left, right) => left.year - right.year
      || left.department.localeCompare(right.department, "tr-TR")
      || left.programName.localeCompare(right.programName, "tr-TR")
      || left.level.localeCompare(right.level, "tr-TR"));
  const title = isInstitute ? "Yıllara göre öğrenci ve danışman dağılımı"
    : program.level === "Doktora" ? "Öğretim üyesi başına doktora öğrenci sayısı"
      : program.level === "Tezli Yüksek Lisans" ? "Öğretim üyesi başına tezli yüksek lisans öğrenci sayısı"
        : "Yıllık öğrenci ve danışman göstergeleri";
  const formatCount = (value: number | null) => value == null ? "—" : value.toLocaleString("tr-TR");

  return <section className="quality-panel advisor-panel" aria-label="Yıllara göre öğrenci ve danışman istatistikleri">
    <header><div><small>ÖĞRENCİ VE DANIŞMAN GÖSTERGELERİ</small><h2>{title}</h2></div></header>
    <p className="quality-note">{isInstitute
      ? "Enstitünün tezli yüksek lisans ve doktora programları birlikte gösterilir. Rapor kapsamından bir program seçerek yıllık verilerini inceleyebilirsiniz."
      : `${program.programName} · ${program.level}`}</p>
    {!supported ? <p>Bu gösterge yalnız tezli yüksek lisans ve doktora programları için hesaplanır.</p>
      : error ? <div role="alert"><p>{error}</p><button className="table-action" type="button" onClick={() => { setError(""); setHistory(null); setRetry((value) => value + 1); }}>Yeniden dene</button></div>
      : history == null ? <p role="status">Yıllık göstergeler yükleniyor…</p>
        : !rows.length ? <p>{isInstitute ? "Enstitü için" : "Bu program için"} yıllık öğrenci ve danışman verisi henüz kaydedilmedi.</p>
          : <>
            <div className="quality-table-scroll"><table className="quality-table">
              <caption>Yıllara göre aktif öğrenci ve ABD danışman sayıları</caption>
              <thead><tr><th scope="col">Yıl</th><th scope="col">Veri tarihi</th>{isInstitute && <><th scope="col">ABD / ASD</th><th scope="col">Program</th><th scope="col">Düzey</th></>}<th scope="col">Aktif öğrenci</th><th scope="col">ABD danışmanı</th><th scope="col">Öğrenci / danışman</th></tr></thead>
              <tbody>{rows.map((row) => <tr key={JSON.stringify([row.year, row.department, row.programName, row.level])}>
                <th scope="row">{row.year}</th>
                <td>{new Date(row.observedAt).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" })}</td>
                {isInstitute && <><td>{row.department}</td><td>{row.programName}</td><td>{row.level}</td></>}
                <td>{formatCount(row.activeStudents)}</td>
                <td>{formatCount(row.advisorCount)}</td>
                <td>{formatRatio(row)}</td>
              </tr>)}</tbody>
            </table></div>
            <p className="quality-note">Her satır belirtilen veri tarihindeki durumu gösterir. Oran, programın aktif öğrenci sayısının ABD’ye bağlı danışman sayısına bölünmesiyle, aynı yıla ait iki veri bulunduğunda hesaplanır. Aynı ABD’nin danışman sayısı birden fazla programda yer alabilir; satırlar toplanarak tekil enstitü danışman sayısı elde edilemez.</p>
            {rows.some((row) => row.method === "enrollment_intervals") && <p className="quality-note">Geçmiş yıl öğrenci sayıları OBS kayıt ve ayrılış tarihleri arasındaki dönemden yıl sonu itibarıyla hesaplanır. Kaynakta geçmiş kayıt dondurma dönemleri bulunmadığında bu dönemler hesaplamadan çıkarılamaz. Geçmiş ABD danışman sayıları için yıllık kayıt gerekir.</p>}
          </>}
  </section>;
}
