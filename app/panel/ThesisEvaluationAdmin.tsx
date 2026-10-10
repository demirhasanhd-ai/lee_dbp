"use client";

import { BookOpenCheck, ClipboardList, ExternalLink, GraduationCap, Plus, Save, Search, ShieldCheck } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";

type Session = { name: string; username: string; role: string; department: string; departmentId?: string | null; email?: string; tcKimlik?: string; readOnly?: boolean };
type Thesis = { identifier: string; title: string; author: string; advisors: string[]; department: string; degreeType: string; cohortYear: number; sourceUrl: string };
type Publication = { id: number; thesis_identifier: string; publication_title: string; publication_year: number; publication_type: string; doi: string; source: string; relation_status: string; funding_type: string; sdgs: string[] };
type Activity = { id: number; thesis_identifier: string; activity_code: string; activity_title: string; relation_type: string; base_score: number; contribution_coefficient: number; calculated_score: number; status: string; evidence_note: string };
type JuryEvaluation = { id: number; thesis_identifier: string; jury_name: string; jury_title: string; scores: Record<string, number>; rubric_score: number; activity_score: number; general_total: number; evaluation_status: string; evaluated_at?: string };
type Rule = { code: string; label: string; baseScore: number; relationType: string; maxQuantity: number | null; supportsAuthorContribution: boolean };
type Criterion = { no: number; section: string; sectionTitle: string; label: string };
type Data = { theses: Thesis[]; publications: Publication[]; activities: Activity[]; juryEvaluations: JuryEvaluation[]; activityRules: Rule[]; juryCriteria: Criterion[]; limits: { evaluationYears: number[]; rubricMaximum: number; maximumSdgSelections: number } };

const statusLabels: Record<string, string> = { under_review: "İncelemede", verified: "Doğrulandı", accepted: "Kabul edildi", rejected: "Reddedildi", needs_evidence: "Kanıt gerekli", draft: "Taslak", final: "Nihai" };
const fundingLabels: Record<string, string> = { unknown: "Bilinmiyor", none: "Destek yok", bap: "BAP", tubitak: "TÜBİTAK", tuseb: "TÜSEB", eu: "AB/Horizon/COST", other: "Diğer" };
const number = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

export function ThesisEvaluationAdmin({ session }: { session: Session }) {
  const [data, setData] = useState<Data | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activityCode, setActivityCode] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(dbpPath("/api/dbp/admin/thesis-evaluations"), { headers: { "X-DBP-Session": dbpSessionHeader(session) } });
    const body = await response.json() as Data | { message?: string };
    if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Tez değerlendirme verileri alınamadı.");
    setData(body as Data);
  }, [session]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Veriler alınamadı."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filteredTheses = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    return (data?.theses || []).filter((item) => !needle || `${item.title} ${item.author} ${item.department} ${item.cohortYear}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [data?.theses, query]);
  const thesis = data?.theses.find((item) => item.identifier === selectedId) || null;
  const publications = (data?.publications || []).filter((item) => item.thesis_identifier === selectedId);
  const activities = (data?.activities || []).filter((item) => item.thesis_identifier === selectedId);
  const juries = (data?.juryEvaluations || []).filter((item) => item.thesis_identifier === selectedId);
  const acceptedActivityScore = activities.filter((item) => item.status === "accepted").reduce((sum, item) => sum + Number(item.calculated_score || 0), 0);
  const rubricScore = (data?.juryCriteria || []).reduce((sum, item) => sum + Number(scores[String(item.no)] || 0), 0);
  const selectedC = (data?.juryCriteria || []).filter((item) => item.section === "C" && Number(scores[String(item.no)] || 0) > 0).length;
  const selectedRule = data?.activityRules.find((item) => item.code === activityCode) || data?.activityRules[0];

  const post = async (path: string, payload: Record<string, unknown>) => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(dbpPath(path), { method: "POST", headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) }, body: JSON.stringify(payload) });
      const body = await response.json() as { message?: string; data?: Data };
      if (!response.ok) throw new Error(body.message || "Kayıt tamamlanamadı.");
      if (body.data) setData(body.data);
      setMessage("Kayıt denetim iziyle birlikte saklandı.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Kayıt tamamlanamadı."); }
    finally { setBusy(false); }
  };

  const submitPublication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!thesis) return;
    const form = new FormData(event.currentTarget);
    void post("/api/dbp/admin/thesis-publications", {
      thesisIdentifier: thesis.identifier,
      publicationTitle: form.get("publicationTitle"), publicationYear: Number(form.get("publicationYear")), publicationType: form.get("publicationType"), doi: form.get("doi"), source: form.get("source"),
      indexedScopus: form.get("indexedScopus") === "on", indexedTrdizin: form.get("indexedTrdizin") === "on", indexedWos: form.get("indexedWos") === "on", quartile: form.get("quartile"), sdgs: form.get("sdgs"), fundingType: form.get("fundingType"), fundingDetail: form.get("fundingDetail"), relationStatus: form.get("relationStatus"), evidenceNote: form.get("evidenceNote"),
    });
  };

  const submitActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!thesis) return;
    const form = new FormData(event.currentTarget);
    void post("/api/dbp/admin/thesis-activities", { thesisIdentifier: thesis.identifier, activityCode: form.get("activityCode"), authorCount: Number(form.get("authorCount")), authorPosition: Number(form.get("authorPosition")), quantity: Number(form.get("quantity")), applyAuthorContribution: selectedRule?.supportsAuthorContribution ? form.get("applyAuthorContribution") === "on" : false, status: form.get("status"), evidenceNote: form.get("evidenceNote") });
  };

  const submitJury = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!thesis) return;
    const form = new FormData(event.currentTarget);
    void post("/api/dbp/admin/thesis-jury", { thesisIdentifier: thesis.identifier, juryName: form.get("juryName"), juryTitle: form.get("juryTitle"), evaluationStatus: form.get("evaluationStatus"), scores });
  };

  if (!data) return <section className="panel-loading">Tez değerlendirme alanı hazırlanıyor…</section>;

  return <section className="thesis-admin">
    <div className="panel-intro"><div><h2>Tez akademik ve jüri değerlendirmesi</h2><p>2023-2025 tezlerinin EK-1 akademik faaliyet puanlarını ve EK-2 jüri rubriğini yalnızca admin yetkisiyle kaydedin. Kamu sayfasında sadece doğrulanmış tez-yayın istatistikleri gösterilir.</p></div><span>Admin · {data.theses.length} tez</span></div>
    {message && <div className="database-message">{message}</div>}
    <div className="thesis-admin-layout">
      <aside className="thesis-admin-picker"><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tez, yazar veya ABD ara" /></label><div>{filteredTheses.map((item) => <button type="button" key={item.identifier} className={selectedId === item.identifier ? "active" : ""} onClick={() => { setSelectedId(item.identifier); setScores({}); }}><span><b>{item.title}</b><small>{item.author} · {item.department}</small></span><em>{item.cohortYear}</em></button>)}</div></aside>
      <div className="thesis-admin-content">
        {!thesis && <div className="thesis-admin-placeholder"><GraduationCap size={30} /><b>Değerlendirmek istediğiniz tezi seçin.</b><span>Liste yalnızca 2023, 2024 ve 2025 DSpace tezlerinden oluşur.</span></div>}
        {thesis && <>
          <section className="thesis-admin-summary"><div><small>{thesis.cohortYear} · {thesis.degreeType}</small><h3>{thesis.title}</h3><p>{thesis.author} · {thesis.department}</p></div><a href={thesis.sourceUrl} target="_blank" rel="noreferrer">DSpace kaydı <ExternalLink size={13} /></a></section>

          <section className="thesis-admin-card"><header><div><small>KAMU GÖSTERGELERİNİN KAYNAĞI</small><h3><BookOpenCheck size={18} /> Tezden üretilen yayın</h3></div><b>{publications.length} kayıt</b></header><form onSubmit={submitPublication} className="thesis-admin-form publication-form"><label className="wide"><span>Yayın başlığı</span><input name="publicationTitle" required /></label><label><span>Yayın yılı</span><select name="publicationYear" defaultValue="2026">{[2023, 2024, 2025, 2026].map((year) => <option key={year}>{year}</option>)}</select></label><label><span>Yayın türü</span><input name="publicationType" placeholder="Makale, bildiri, kitap…" /></label><label><span>DOI</span><input name="doi" /></label><label><span>Kaynak</span><input name="source" placeholder="Scopus, TR Dizin…" /></label><label><span>Q değeri</span><select name="quartile"><option value="">Belirsiz</option>{["Q1", "Q2", "Q3", "Q4"].map((q) => <option key={q}>{q}</option>)}</select></label><label><span>SKA numaraları</span><input name="sdgs" placeholder="3, 7, 9" /></label><label><span>Finansman</span><select name="fundingType" defaultValue="unknown">{Object.entries(fundingLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Destek ayrıntısı</span><input name="fundingDetail" placeholder="Proje numarası / program" /></label><label><span>Bağlantı durumu</span><select name="relationStatus" defaultValue="under_review"><option value="under_review">İncelemede</option><option value="verified">Doğrulandı</option><option value="needs_evidence">Kanıt gerekli</option><option value="rejected">Reddedildi</option></select></label><label className="wide"><span>Tez-yayın ilişkisi kanıtı</span><textarea name="evidenceNote" required placeholder="DOI, tezdeki yayın listesi, açık beyan veya kurumsal doğrulama" /></label><div className="check-row"><label><input type="checkbox" name="indexedScopus" />Scopus</label><label><input type="checkbox" name="indexedTrdizin" />TR Dizin</label><label><input type="checkbox" name="indexedWos" />WoS</label></div><button disabled={busy}><Plus size={14} />Yayın kaydı ekle</button></form>{publications.length > 0 && <div className="thesis-admin-records">{publications.map((item) => <article key={item.id}><span><b>{item.publication_title}</b><small>{item.publication_year} · {item.publication_type || "Tür belirtilmedi"} · {fundingLabels[item.funding_type]}</small></span><em className={`record-${item.relation_status}`}>{statusLabels[item.relation_status]}</em></article>)}</div>}</section>

          <section className="thesis-admin-card"><header><div><small>EK-1</small><h3><ClipboardList size={18} /> Akademik faaliyet ve etkinlik puanı</h3></div><b>Kabul edilen toplam: {number(acceptedActivityScore)}</b></header><form onSubmit={submitActivity} className="thesis-admin-form activity-form"><label className="wide"><span>Faaliyet</span><select name="activityCode" required value={activityCode || data.activityRules[0]?.code || ""} onChange={(event) => setActivityCode(event.target.value)}>{data.activityRules.map((rule) => <option key={rule.code} value={rule.code}>{rule.code} · {rule.label} ({rule.baseScore} puan)</option>)}</select></label><label><span>Yazar sayısı</span><input name="authorCount" type="number" min="1" defaultValue="1" disabled={!selectedRule?.supportsAuthorContribution} /></label><label><span>Yazar sırası</span><input name="authorPosition" type="number" min="1" defaultValue="1" disabled={!selectedRule?.supportsAuthorContribution} /></label><label><span>Adet{selectedRule?.maxQuantity ? ` (en çok ${selectedRule.maxQuantity})` : ""}</span><input name="quantity" type="number" min="1" max={selectedRule?.maxQuantity || undefined} defaultValue="1" /></label><label><span>Durum</span><select name="status" defaultValue="under_review"><option value="under_review">İncelemede</option><option value="accepted">Kabul edildi</option><option value="needs_evidence">Kanıt gerekli</option><option value="rejected">Reddedildi</option></select></label><label className="wide"><span>Kanıt</span><textarea name="evidenceNote" required /></label><label className="inline-check"><input type="checkbox" name="applyAuthorContribution" defaultChecked disabled={!selectedRule?.supportsAuthorContribution} />Yazar katkı katsayısını uygula{!selectedRule?.supportsAuthorContribution ? " (bu faaliyet türünde uygulanmaz)" : ""}</label><button disabled={busy}><Plus size={14} />Faaliyeti hesapla ve ekle</button></form>{activities.length > 0 && <div className="thesis-admin-records">{activities.map((item) => <article key={item.id}><span><b>{item.activity_code} · {item.activity_title}</b><small>{item.base_score} × {number(item.contribution_coefficient)} = {number(item.calculated_score)}</small></span><em className={`record-${item.status}`}>{statusLabels[item.status]}</em></article>)}</div>}</section>

          <section className="thesis-admin-card jury-card"><header><div><small>EK-2</small><h3><ShieldCheck size={18} /> Jüri nihai değerlendirme rubriği</h3></div><b>{rubricScore} / {data.limits.rubricMaximum} · Genel {number(rubricScore + acceptedActivityScore)}</b></header><form onSubmit={submitJury}><div className="jury-identity"><label><span>Jüri üyesi</span><input name="juryName" required /></label><label><span>Ünvanı</span><input name="juryTitle" /></label><label><span>Kayıt durumu</span><select name="evaluationStatus"><option value="draft">Taslak</option><option value="final">Nihai ve kilitli</option></select></label></div><p className={selectedC > 4 ? "jury-warning" : "jury-help"}>A ve B ölçütleri 0-5 puanlanır. C bölümünde en fazla 4 SKA puanlanabilir. Seçilen C ölçütü: {selectedC}/4.</p><div className="jury-rubric">{data.juryCriteria.map((item) => <label key={item.no} className={`rubric-${item.section}`}><b>{item.no}</b><span><small>{item.section} · {item.sectionTitle}</small>{item.label}</span><select aria-label={`${item.no}. ölçüt puanı`} value={scores[String(item.no)] || 0} onChange={(event) => setScores((current) => ({ ...current, [String(item.no)]: Number(event.target.value) }))}>{[0, 1, 2, 3, 4, 5].map((score) => <option key={score}>{score}</option>)}</select></label>)}</div><div className="jury-total"><span>EK-2 rubrik</span><b>{rubricScore}</b><span>EK-1 kabul edilen faaliyet</span><b>{number(acceptedActivityScore)}</b><strong>GENEL TOPLAM</strong><strong>{number(rubricScore + acceptedActivityScore)}</strong></div><button className="primary-action" disabled={busy || selectedC > 4}><Save size={14} />Jüri değerlendirmesini kaydet</button></form>{juries.length > 0 && <div className="thesis-admin-records">{juries.map((item) => <article key={item.id}><span><b>{item.jury_title} {item.jury_name}</b><small>EK-2 {number(item.rubric_score)} + EK-1 {number(item.activity_score)} = {number(item.general_total)}</small></span><em className={`record-${item.evaluation_status}`}>{statusLabels[item.evaluation_status]}</em></article>)}</div>}</section>
        </>}
      </div>
    </div>
  </section>;
}
