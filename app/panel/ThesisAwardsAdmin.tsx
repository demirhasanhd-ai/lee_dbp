"use client";

import { Award, BookOpenCheck, ChevronRight, ExternalLink, GraduationCap, Medal, RefreshCw, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";

type Session = { name: string; username: string; role: string; department: string; tcKimlik?: string };
type Publication = { title: string; year: number; doi: string; source: string; quartile: string; indexedWos: boolean; indexedScopus: boolean; indexedTrDizin: boolean };
type Candidate = {
  thesisIdentifier: string; thesisTitle: string; studentName: string; advisors: string[]; department: string;
  field: string; degree: "masters" | "doctorate"; thesisYear: number; sourceUrl: string; publicationCount: number;
  publicationYears: number[]; wosCount: number; scopusCount: number; trDizinCount: number; q1Q2Count: number;
  activityCount: number; activityScore: number; juryCount: number; juryScore: number; totalScore: number;
  eligible: boolean; missing: string[]; publications: Publication[]; rank?: number;
};
type Ranking = { field: string; degree: "masters" | "doctorate"; candidates: Candidate[] };
type AwardData = {
  generatedAt: string; scoringNote: string; availableYears: number[]; selectedYear: number;
  summary: { total: number; eligible: number; incomplete: number; publications: number };
  candidates: Candidate[]; rankings: Ranking[];
};

const fieldOptions = ["Fen Bilimleri", "Sosyal Bilimler", "Sağlık Bilimleri", "Genel"];
const degreeOptions = [
  { value: "masters" as const, label: "Tezli Yüksek Lisans" },
  { value: "doctorate" as const, label: "Doktora" },
];
const number = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

export function ThesisAwardsAdmin({ session }: { session: Session }) {
  const [data, setData] = useState<AwardData | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [field, setField] = useState("Fen Bilimleri");
  const [degree, setDegree] = useState<"masters" | "doctorate">("masters");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async (requestedYear?: number | null) => {
    setBusy(true); setMessage("");
    try {
      const query = requestedYear ? `?year=${requestedYear}` : "";
      const response = await fetch(dbpPath(`/api/dbp/admin/thesis-awards${query}`), { headers: { "X-DBP-Session": dbpSessionHeader(session) } });
      const body = await response.json() as AwardData | { message?: string };
      if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Tez ödül verileri alınamadı.");
      const next = body as AwardData;
      setData(next); setYear(next.selectedYear);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Tez ödül verileri alınamadı."); }
    finally { setBusy(false); }
  }, [session]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  const categoryCandidates = useMemo(
    () => (data?.candidates || []).filter((item) => item.degree === degree && (field === "Genel" || item.field === field)),
    [data, field, degree],
  );
  const ranking = useMemo(() => data?.rankings.find((item) => item.field === field && item.degree === degree)?.candidates || [], [data, field, degree]);
  const incomplete = useMemo(() => (data?.candidates || []).filter((item) => !item.eligible && item.degree === degree && (field === "Genel" || item.field === field)), [data, field, degree]);

  if (!data) return <section className="panel-loading">Tez ödül sıralaması hazırlanıyor…{message && <small>{message}</small>}</section>;

  return <section className="thesis-awards">
    <div className="panel-intro thesis-awards-intro"><div><small>ENSTİTÜ · YILLIK DEĞERLENDİRME</small><h2><Trophy size={22} /> Tez Ödül Modülü</h2><p>{data.scoringNote}</p></div><button className="secondary-action" disabled={busy} onClick={() => void load(year)}><RefreshCw size={14} />Puanları yeniden hesapla</button></div>
    {message && <div className="database-message">{message}</div>}

    <div className="award-controls">
      <label><span>Tez yılı</span><select value={year || data.selectedYear} onChange={(event) => void load(Number(event.target.value))}>{data.availableYears.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Bilim alanı</span><select value={field} onChange={(event) => setField(event.target.value)}>{fieldOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Program türü</span><select value={degree} onChange={(event) => setDegree(event.target.value as "masters" | "doctorate")}>{degreeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <div className="award-period"><Award size={18} /><span><small>Değerlendirme anı</small><b>{new Date(data.generatedAt).toLocaleString("tr-TR")}</b></span></div>
    </div>

    <div className="award-summary">
      <article><GraduationCap /><span>Eşleşen tezler</span><b>{data.summary.total}</b></article>
      <article><Medal /><span>Sıralamaya hazır</span><b>{data.summary.eligible}</b></article>
      <article><BookOpenCheck /><span>Eşleşen yayınlar</span><b>{data.summary.publications}</b></article>
      <article><RefreshCw /><span>Eksik değerlendirme</span><b>{data.summary.incomplete}</b></article>
    </div>

    <section className="award-ranking-card">
      <header><div><small>{data.selectedYear} TEZLERİ</small><h3>{field} · {degreeOptions.find((item) => item.value === degree)?.label}</h3></div><b>{categoryCandidates.length} aday · {ranking.length} sıralamaya hazır</b></header>
      {ranking.length === 0 ? <div className="award-empty"><Trophy size={28} /><b>{categoryCandidates.length ? `${categoryCandidates.length} adayın puanlaması henüz tamamlanmadı.` : "Bu kategoride eşleşen aday yok."}</b><span>{categoryCandidates.length ? "Aşağıdaki eksik değerlendirmeler tamamlandığında sıralama otomatik oluşur." : "Seçili tez yılı, bilim alanı ve program türü için tez-yayın eşleşmesi bulunmuyor."}</span></div> : <div className="award-table-wrap"><table className="award-table"><thead><tr><th>Sıra</th><th>Öğrenci ve tez</th><th>Yayınlar</th><th>EK-1</th><th>EK-2 ort.</th><th>Toplam</th></tr></thead><tbody>{ranking.map((item) => <tr key={item.thesisIdentifier}><td><span className={`award-rank rank-${item.rank}`}>{item.rank}</span></td><td><b>{item.studentName || "Öğrenci adı yok"}</b><span>{item.thesisTitle}</span><small>{item.department} · {item.advisors.join(", ")}</small></td><td><b>{item.publicationCount}</b><span>{item.wosCount} WoS · {item.scopusCount} Scopus · {item.trDizinCount} TR Dizin</span><small>Değerlendirme anındaki tüm doğrulanmış yayınlar</small></td><td><b>{number(item.activityScore)}</b><span>{item.activityCount} kabul edilen faaliyet</span></td><td><b>{number(item.juryScore)}</b><span>{item.juryCount} nihai jüri</span></td><td><strong>{number(item.totalScore)}</strong><a href={item.sourceUrl} target="_blank" rel="noreferrer">Tez kaydı <ExternalLink size={12} /></a></td></tr>)}</tbody></table></div>}
    </section>

    <section className="award-incomplete"><header><div><small>TAMAMLANMASI GEREKENLER</small><h3>Değerlendirme eksiği bulunan tezler</h3></div><b>{incomplete.length} kayıt</b></header>{incomplete.length === 0 ? <p>Bu kategoride değerlendirme eksiği bulunmuyor.</p> : <div>{incomplete.map((item) => <details key={item.thesisIdentifier}><summary><span><b>{item.studentName || "Öğrenci adı yok"}</b><small>{item.thesisTitle}</small></span><em>{item.missing.length} eksik <ChevronRight size={14} /></em></summary><ul>{item.missing.map((reason) => <li key={reason}>{reason}</li>)}</ul><p>Mevcut kayıt: {item.publicationCount} yayın · EK-1 {number(item.activityScore)} · EK-2 {number(item.juryScore)}</p></details>)}</div>}</section>
  </section>;
}
