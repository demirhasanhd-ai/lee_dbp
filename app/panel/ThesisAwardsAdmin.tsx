"use client";

import { Award, BookOpenCheck, ChevronRight, ExternalLink, GraduationCap, Medal, Printer, RefreshCw, Trophy } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";

type Session = { name: string; username: string; role: string; department: string; tcKimlik?: string };
type Publication = { title: string; year: number; doi: string; source: string; quartile: string; indexedWos: boolean; indexedScopus: boolean; indexedTrDizin: boolean };
type AutomaticActivityItem = {
  publicationTitle: string; activityCode: string; activityLabel: string; baseScore: number; authorCount: number;
  authorPosition: number; contributionCoefficient: number; publicationScore: number; citationCount: number;
  citationActivityCode: string; citationUnitScore: number; citationScore: number; score: number;
};
type ManualActivityItem = {
  activityCode: string; activityTitle: string; relationType: string; baseScore: number; authorCount: number;
  authorPosition: number; quantity: number; contributionCoefficient: number; calculatedScore: number; evidenceNote: string;
};
type JuryEvaluation = { juryName: string; juryTitle: string; rubricScore: number; scores: Record<string, number>; evaluatedAt: string };
type JuryCriterion = { no: number; section: string; sectionTitle: string; label: string };
type AutomaticJuryItem = JuryCriterion & { score: number; evidence: string; assessmentMode: "automatic" | "manual_required" };
type AutomaticJuryEvaluation = { rubricScore: number; selectedC: number; scores: Record<string, number>; items: AutomaticJuryItem[]; isApplied: boolean };
type Candidate = {
  thesisIdentifier: string; thesisTitle: string; studentName: string; advisors: string[]; department: string;
  field: string; degree: "masters" | "doctorate"; thesisYear: number; sourceUrl: string; publicationCount: number;
  publicationYears: number[]; wosCount: number; scopusCount: number; trDizinCount: number; q1Q2Count: number;
  activityCount: number; automaticActivityCount: number; automaticActivityScore: number; automaticPublicationScore: number;
  automaticCitationScore: number; manualActivityCount: number; manualActivityScore: number;
  activityScore: number; juryCount: number; juryScore: number; totalScore: number;
  eligible: boolean; provisional: boolean; missing: string[]; warnings: string[]; publications: Publication[];
  automaticActivityItems: AutomaticActivityItem[]; manualActivityItems: ManualActivityItem[];
  juryEvaluations: JuryEvaluation[]; automaticJuryEvaluation: AutomaticJuryEvaluation; rank?: number;
};
type Ranking = { field: string; degree: "masters" | "doctorate"; candidates: Candidate[] };
type AwardData = {
  generatedAt: string; scoringNote: string; availableYears: number[]; selectedYear: number;
  summary: { total: number; eligible: number; incomplete: number; publications: number };
  candidates: Candidate[]; rankings: Ranking[]; juryCriteria: JuryCriterion[];
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
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedThesis, setExpandedThesis] = useState("");

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
  const incomplete = useMemo(() => (data?.candidates || []).filter((item) => (item.provisional || !item.eligible) && item.degree === degree && (field === "Genel" || item.field === field)), [data, field, degree]);

  const printTopFive = useCallback(async () => {
    if (!year) return;
    setPrinting(true); setMessage("");
    try {
      const query = new URLSearchParams({ year: String(year), field, degree });
      const response = await fetch(dbpPath(`/api/dbp/admin/thesis-awards/pdf?${query}`), {
        headers: { "X-DBP-Session": dbpSessionHeader(session) },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message || "İlk 5 aday PDF dosyası oluşturulamadı.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${year}-${field}-${degree === "doctorate" ? "doktora" : "tezli-yl"}-ilk-5.pdf`
        .toLocaleLowerCase("tr-TR").replace(/[^a-z0-9çğıöşü.-]+/giu, "-");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setMessage(error instanceof Error ? error.message : "İlk 5 aday PDF dosyası oluşturulamadı."); }
    finally { setPrinting(false); }
  }, [degree, field, session, year]);

  if (!data) return <section className="panel-loading">Tez ödül sıralaması hazırlanıyor…{message && <small>{message}</small>}</section>;

  return <section className="thesis-awards">
    <div className="panel-intro thesis-awards-intro"><div><small>ENSTİTÜ · YILLIK DEĞERLENDİRME</small><h2><Trophy size={22} /> Tez Ödül Modülü</h2><p>{data.scoringNote}</p></div><div className="award-intro-actions"><button className="secondary-action" disabled={printing || ranking.length === 0} onClick={() => void printTopFive()}><Printer size={14} />{printing ? "PDF hazırlanıyor…" : "İlk 5 Listeyi Yazdır"}</button><button className="secondary-action" disabled={busy} onClick={() => void load(year)}><RefreshCw size={14} />Puanları yeniden hesapla</button></div></div>
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
      <article><RefreshCw /><span>EK-2 bekleyen / eksik</span><b>{data.summary.incomplete}</b></article>
    </div>

    <section className="award-ranking-card">
      <header><div><small>{data.selectedYear} TEZLERİ</small><h3>{field} · {degreeOptions.find((item) => item.value === degree)?.label}</h3></div><b>{categoryCandidates.length} aday · {ranking.length} sıralamaya hazır</b></header>
      {ranking.length === 0 ? <div className="award-empty"><Trophy size={28} /><b>{categoryCandidates.length ? `${categoryCandidates.length} aday için puanlanabilir veri bulunamadı.` : "Bu kategoride eşleşen aday yok."}</b><span>{categoryCandidates.length ? "Aşağıdaki veri eksikleri tamamlandığında sıralama otomatik oluşur." : "Seçili tez yılı, bilim alanı ve program türü için tez-yayın eşleşmesi bulunmuyor."}</span></div> : <div className="award-table-wrap"><table className="award-table"><thead><tr><th>Sıra</th><th>Öğrenci ve tez</th><th>Yayınlar</th><th>EK-1</th><th>EK-2 ort.</th><th>Toplam</th></tr></thead><tbody>{ranking.map((item) => {
        const expanded = expandedThesis === item.thesisIdentifier;
        return <Fragment key={item.thesisIdentifier}>
          <tr className="award-candidate-row" aria-expanded={expanded} onClick={() => setExpandedThesis(expanded ? "" : item.thesisIdentifier)}>
            <td><span className={`award-rank rank-${item.rank}`}>{item.rank}</span></td>
            <td><button type="button" className="award-candidate-toggle"><ChevronRight className={expanded ? "expanded" : ""} size={14} /><span><b>{item.studentName || "Öğrenci adı yok"}</b><span>{item.thesisTitle}</span><small>{item.department} · {item.advisors.join(", ")}</small></span></button></td>
            <td><b>{item.publicationCount}</b><span>{item.wosCount} WoS · {item.scopusCount} Scopus · {item.trDizinCount} TR Dizin</span><small>Tekilleştirilmiş doğrulanmış yayın adedi</small></td>
            <td><b>{number(item.activityScore)}</b><span>{number(item.automaticPublicationScore)} yayın puanı · {number(item.automaticCitationScore)} atıf puanı</span><small>{item.manualActivityCount ? `${item.manualActivityCount} kabul edilmiş ek faaliyet: ${number(item.manualActivityScore)} puan` : "Otomatik bibliyometrik hesap"}</small></td>
            <td><b>{number(item.juryScore)}</b><span>Otomatik EK-2 · {item.automaticJuryEvaluation.selectedC} SKA</span><small>Kanıta dayalı geçmiş yıl rubriği</small></td>
            <td><strong>{number(item.totalScore)}</strong><small>EK-1 + otomatik EK-2</small><a href={item.sourceUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Tez kaydı <ExternalLink size={12} /></a></td>
          </tr>
          {expanded && <tr className="award-detail-row"><td colSpan={6}><div className="award-score-details">
            <section><header><div><small>EK-1 AYRINTISI</small><h4>Akademik faaliyet puanlaması</h4></div><b>{number(item.activityScore)} puan</b></header>
              <div className="award-detail-table-wrap"><table className="award-detail-table"><thead><tr><th>Yayın / faaliyet</th><th>Kural</th><th>Temel puan</th><th>Yazar katkısı</th><th>Yayın puanı</th><th>Atıf hesabı</th><th>Toplam</th></tr></thead><tbody>
                {item.automaticActivityItems.map((activity, index) => <tr key={`${activity.publicationTitle}-${index}`}><td>{activity.publicationTitle}</td><td><b>{activity.activityCode}</b><span>{activity.activityLabel}</span></td><td>{number(activity.baseScore)}</td><td>{activity.authorPosition}/{activity.authorCount} · %{number(activity.contributionCoefficient * 100)}</td><td>{number(activity.publicationScore)}</td><td>{activity.citationCount} × {number(activity.citationUnitScore)} ({activity.citationActivityCode}) = {number(activity.citationScore)}</td><td><strong>{number(activity.score)}</strong></td></tr>)}
                {item.manualActivityItems.map((activity, index) => <tr key={`manual-${activity.activityCode}-${index}`}><td>{activity.activityTitle}<small>{activity.evidenceNote}</small></td><td><b>{activity.activityCode}</b><span>{activity.relationType}</span></td><td>{number(activity.baseScore)}</td><td>{activity.authorPosition}/{activity.authorCount} · %{number(activity.contributionCoefficient * 100)}</td><td>{number(activity.calculatedScore)}</td><td>Manuel kabul edilmiş faaliyet · {activity.quantity} adet</td><td><strong>{number(activity.calculatedScore)}</strong></td></tr>)}
              </tbody></table></div>
            </section>
            <section><header><div><small>EK-2 AYRINTISI</small><h4>SKA, stratejik hedef ve yayın kanıtlı rubrik</h4></div><b>{number(item.automaticJuryEvaluation.rubricScore)} puan</b></header>
              <p className="award-jury-empty">2023–2025 geçmiş yıl değerlendirmesinde manuel jüri beklenmez. Tez içeriğinin okunmasını gerektiren maddeler kapsam dışında sıfır bırakılır; C bölümünde en güçlü en fazla dört SKA eşleşmesi kullanılır.</p>
              <div className="award-detail-table-wrap"><table className="award-detail-table jury automatic rubric-matrix"><thead><tr><th>No</th><th>Ölçütler</th>{[0, 1, 2, 3, 4, 5].map((score) => <th className="rubric-score-heading" key={score}>{score}</th>)}<th>Kanıt</th></tr></thead><tbody>{item.automaticJuryEvaluation.items.map((criterion, index, criteria) => <Fragment key={criterion.no}>{(index === 0 || criteria[index - 1].section !== criterion.section) && <tr className="rubric-section-row"><th colSpan={9}>{criterion.section} – {criterion.sectionTitle}</th></tr>}<tr className={criterion.score > 0 ? "rubric-scored" : "rubric-zero"}><td>{criterion.no}</td><td>{criterion.label}</td>{[0, 1, 2, 3, 4, 5].map((score) => { const selected = criterion.score === score; return <td key={score} className={`rubric-score-cell${selected ? " selected" : ""}`} aria-label={`${criterion.no}. ölçüt: ${score} puan${selected ? " seçildi" : ""}`}>{selected ? <span aria-hidden="true">✓</span> : ""}</td>; })}<td className="rubric-evidence" title={criterion.score > 0 ? criterion.evidence : ""}>{criterion.score > 0 ? criterion.evidence : ""}</td></tr></Fragment>)}</tbody><tfoot><tr><td colSpan={2}>A, B ve C kısımlarından alınan toplam puan (EK-2)</td><td colSpan={6}><strong>{number(item.automaticJuryEvaluation.rubricScore)}</strong></td><td>{item.automaticJuryEvaluation.selectedC} C/SKA maddesi puanlandı</td></tr></tfoot></table></div>
            </section>
          </div></td></tr>}
        </Fragment>;
      })}</tbody></table></div>}
    </section>

    <section className="award-incomplete"><header><div><small>TAMAMLANMASI GEREKENLER</small><h3>Veri durumu</h3></div><b>{incomplete.length} kayıt</b></header>{incomplete.length === 0 ? <p>Bu kategoride değerlendirme eksiği bulunmuyor.</p> : <div>{incomplete.map((item) => { const notices = [...item.missing, ...item.warnings]; return <details key={item.thesisIdentifier}><summary><span><b>{item.studentName || "Öğrenci adı yok"}</b><small>{item.thesisTitle}</small></span><em>{notices.length} bildirim <ChevronRight size={14} /></em></summary><ul>{notices.map((reason) => <li key={reason}>{reason}</li>)}</ul><p>Mevcut kayıt: {item.publicationCount} yayın · EK-1 {number(item.activityScore)} · otomatik EK-2 {number(item.juryScore)}</p></details>; })}</div>}</section>
  </section>;
}
