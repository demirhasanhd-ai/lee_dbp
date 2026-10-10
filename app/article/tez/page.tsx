"use client";

import { AlertTriangle, BookOpenCheck, CalendarClock, Database, ExternalLink, GraduationCap, Landmark, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicSiteHeader } from "../../PublicSiteHeader";
import { dbpPath } from "../../../lib/dbpPath";

type YearRow = { year: number; masters: number; doctorates: number; total: number; cumulative: number };
type PublicData = {
  generatedAt: string;
  range: { fromYear: number; toYear: number };
  filters: { fields: string[]; degrees: string[] };
  summary: { uniquePublications: number; thesisPublicationLinks: number; masters: number; doctorates: number };
  indexSummary: { total: number; scopus: number; trdizin: number; wosSciScie: number; quartileAssigned: number };
  fieldBreakdown: Array<{ field: string; total: number; masters: number; doctorates: number; scopus: number; trdizin: number }>;
  yearly: YearRow[];
  sdgs: Array<{ id: string; count: number }>;
  funding: Array<{ type: string; count: number }>;
  quartiles: Array<{ quartile: string; count: number }>;
  scimago: { loaded: boolean; journalCount: number; files: string[]; years: number[] };
  publications: Array<{ id: number; title: string; year: number; publicationType: string; degree: string; field: string; doi: string; source: string; fundingType: string; fundingDetail: string; quartile: string; indexedScopus: boolean; indexedTrdizin: boolean; indexedWos: boolean; sdgs: string[] }>;
};

const fundingLabels: Record<string, string> = {
  bap: "OKÜ BAP / Diğer BAP",
  tubitak: "TÜBİTAK",
  tuseb: "TÜSEB",
  eu: "AB / Horizon / COST",
  other: "Diğer destek",
  none: "Destek bulunmadığı doğrulandı",
  unknown: "Finansman bilgisi henüz doğrulanmadı",
};

const degreeLabels: Record<string, string> = { masters: "Tezli Yüksek Lisans", doctorate: "Doktora" };
const number = (value: number) => value.toLocaleString("tr-TR");
const dateTime = (value: string) => value ? new Date(value).toLocaleString("tr-TR") : "Henüz doğrulanmış kayıt yok";

export default function ThesisBibliometricsPage() {
  const [data, setData] = useState<PublicData | null>(null);
  const [filters, setFilters] = useState({ field: "", degree: "" });
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    fetch(`${dbpPath("/api/dbp/thesis-bibliometrics")}?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as PublicData | { message?: string };
        if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Tez tabanlı bibliyometrik veriler alınamadı.");
        return body as PublicData;
      })
      .then((body) => { setData(body); setError(""); })
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message); });
    return () => controller.abort();
  }, [filters, retry]);

  const maximumYear = Math.max(1, ...(data?.yearly || []).map((item) => Math.max(item.masters, item.doctorates)));
  const maximumField = Math.max(1, ...(data?.fieldBreakdown || []).map((item) => item.total));
  const maximumSdg = Math.max(1, ...(data?.sdgs || []).map((item) => item.count));
  const maximumQuartile = Math.max(1, ...(data?.quartiles || []).map((item) => item.count));
  const supported = useMemo(() => (data?.funding || []).filter((item) => !["none", "unknown"].includes(item.type)).reduce((sum, item) => sum + item.count, 0), [data]);
  const verifiedFunding = useMemo(() => (data?.funding || []).filter((item) => !["none", "unknown"].includes(item.type)), [data]);
  const supportName = (item: PublicData["publications"][number]) => item.fundingDetail || (item.fundingType !== "unknown" ? fundingLabels[item.fundingType] || item.fundingType : "Destek bilgisi kaynakta belirtilmemiş");

  return <main className="dbp-page quality-page article-page thesis-bibliometrics-page">
    <PublicSiteHeader active="bibliometrics" bibliometricsSource="thesis" />
    <section className="quality-hero article-hero"><div><small>LİSANSÜSTÜ TEZLERDEN ÜRETİLEN YAYINLAR</small><h1>Lisansüstü Tez Tabanlı Göstergeler</h1></div></section>

    {error && <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}>Yeniden dene</button></section>}
    {!data && !error && <section className="quality-loading">Tezden üretilen yayın göstergeleri hazırlanıyor…</section>}

    {data && <>
      <section className="thesis-public-filter" aria-label="Tez yayını filtreleri">
        <label><span>Bilim alanı</span><select value={filters.field} onChange={(event) => setFilters((current) => ({ ...current, field: event.target.value }))}><option value="">Tüm bilim alanları</option>{data.filters.fields.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Program türü</span><select value={filters.degree} onChange={(event) => setFilters((current) => ({ ...current, degree: event.target.value }))}><option value="">Tezli YL ve Doktora</option><option value="masters">Tezli Yüksek Lisans</option><option value="doctorate">Doktora</option></select></label>
        <div><CalendarClock size={17} /><span>Son doğrulama</span><strong>{dateTime(data.generatedAt)}</strong></div>
      </section>

      <section className="article-section">
        <div className="thesis-public-kpis">
          <article><BookOpenCheck /><span>Tekil doğrulanmış yayın</span><strong>{number(data.summary.uniquePublications)}</strong><small>{number(data.summary.thesisPublicationLinks)} tez-yayın bağlantısı</small></article>
          <article><GraduationCap /><span>Tezli YL kaynaklı</span><strong>{number(data.summary.masters)}</strong><small>Tekil yayın</small></article>
          <article><Target /><span>Doktora kaynaklı</span><strong>{number(data.summary.doctorates)}</strong><small>Tekil yayın</small></article>
          <article><Landmark /><span>Doğrulanmış destekli</span><strong>{number(supported)}</strong><small>BAP, TÜBİTAK ve diğer destekler</small></article>
        </div>
      </section>

      <section className="article-section"><div className="article-section-title"><span>01</span><div><small>{data.range.fromYear}-{data.range.toYear}</small><h2>Yıllara göre yayınlar</h2></div></div>
        {data.summary.uniquePublications === 0 ? <div className="quality-panel thesis-public-empty"><BookOpenCheck size={24} /><b>Doğrulanmış tez-yayın kaydı henüz bulunmuyor.</b><span>Yayınlar yönetim alanında kanıtıyla doğrulandığında bu sayfada görünecek.</span></div> : <div className="thesis-chart-panel"><div className="thesis-chart-legend"><span><i className="master" />Tezli Yüksek Lisans</span><span><i className="doctorate" />Doktora</span></div><div className="thesis-year-chart">{data.yearly.map((item) => <article key={item.year}><strong>{item.total}</strong><div className="year-column-bars"><i className="master" style={{ height: item.masters ? `${Math.max(5, item.masters / maximumYear * 100)}%` : "0%" }}><em>{item.masters || ""}</em></i><i className="doctorate" style={{ height: item.doctorates ? `${Math.max(5, item.doctorates / maximumYear * 100)}%` : "0%" }}><em>{item.doctorates || ""}</em></i></div><b>{item.year}</b></article>)}</div></div>}
      </section>

      <section className="article-section"><div className="article-section-title"><span>02</span><div><small>BİLİM ALANLARI</small><h2>Bilim alanlarına göre yayın dağılımı</h2></div></div><div className="thesis-field-chart"><div className="thesis-chart-legend"><span><i className="total" />Toplam</span><span><i className="master" />Tezli YL</span><span><i className="doctorate" />Doktora</span><span><i className="scopus" />Scopus</span><span><i className="trdizin" />TR Dizin</span></div>{data.fieldBreakdown.map((item) => <article key={item.field}><header><b>{item.field}</b><strong>{number(item.total)}</strong></header><div className="field-metrics">{([['total', 'Toplam', item.total], ['master', 'Tezli YL', item.masters], ['doctorate', 'Doktora', item.doctorates], ['scopus', 'Scopus', item.scopus], ['trdizin', 'TR Dizin', item.trdizin]] as Array<[string, string, number]>).map(([kind, label, value]) => <div className="field-metric" key={kind}><span>{label}</span><i><em className={kind} style={{ width: `${value / maximumField * 100}%` }} /></i><strong>{number(value)}</strong></div>)}</div></article>)}</div></section>

      <section className="article-section"><div className="article-section-title"><span>03</span><div><small>YAYIN KAPSAMI VE SCIMAGO{data.scimago.years.length ? ` · ${data.scimago.years.join(", ")}` : ""}</small><h2>Tarama kapsamı ve quartile dağılımı</h2></div></div><div className="thesis-index-summary"><article><span>Toplam yayın</span><strong>{number(data.indexSummary.total)}</strong></article><article><span>Scopus</span><strong>{number(data.indexSummary.scopus)}</strong></article><article><span>TR Dizin</span><strong>{number(data.indexSummary.trdizin)}</strong></article><article><span>WoS / SCI-SCIE doğrulanan</span><strong>{number(data.indexSummary.wosSciScie)}</strong></article><article><span>SCImago quartile atanan</span><strong>{number(data.indexSummary.quartileAssigned)}</strong></article></div>{data.scimago.loaded ? <div className="thesis-quartile-chart">{data.quartiles.map((item) => <article key={item.quartile}><span>{item.quartile}</span><i><em style={{ width: `${item.count / maximumQuartile * 100}%` }} /></i><strong>{number(item.count)}</strong></article>)}</div> : <div className="quality-panel thesis-public-empty"><Database size={24} /><b>SCImago yıllık veri seti bekleniyor.</b></div>}</section>

      <section className="article-section"><div className="article-section-title"><span>04</span><div><small>FİNANSMAN</small><h2>BAP, TÜBİTAK ve diğer destekler</h2></div></div>{verifiedFunding.length ? <div className="thesis-funding-grid">{verifiedFunding.map((item) => <article key={item.type}><Landmark /><span>{fundingLabels[item.type] || item.type}</span><strong>{number(item.count)}</strong></article>)}</div> : <div className="quality-panel thesis-public-empty"><Landmark size={24} /><b>Yayın kaynaklarında doğrulanmış destek adı bulunmuyor.</b><span>Scopus veya TR Dizin kaydında destekçi kurum ve proje numarası yayımlandığında burada adıyla gösterilecek.</span></div>}</section>

      <section className="article-section"><div className="article-section-title"><span>05</span><div><small>YAYIN İÇERİĞİ</small><h2>Tezden üretilen yayınların SKA dağılımı</h2></div></div>{data.sdgs.length ? <div className="thesis-public-sdgs">{data.sdgs.map((item) => <article key={item.id}><img src={dbpPath(`/sdg/sdg_${item.id}.png`)} alt="" /><span><b>SKA {item.id}</b><i><em style={{ width: `${item.count / maximumSdg * 100}%` }} /></i></span><strong>{item.count}</strong></article>)}</div> : <div className="quality-panel thesis-public-empty"><Target size={24} /><b>Yayın-SKA eşleşmesi henüz bulunmuyor.</b></div>}</section>

      {data.publications.length > 0 && <section className="article-section thesis-publication-list"><div className="article-section-title"><span>06</span><div><small>SON DOĞRULANAN KAYITLARDAN SEÇKİ</small><h2>Yayın ve destek bilgileri</h2></div></div><div className="thesis-publication-highlights">{data.publications.map((item) => <article key={item.id}><header><span>{item.year}</span><span>{degreeLabels[item.degree]}</span><span>{item.field}</span></header><h3>{item.title}</h3><div className="publication-badges">{item.indexedScopus && <span>Scopus</span>}{item.indexedTrdizin && <span>TR Dizin</span>}{item.indexedWos && <span>WoS / SCI-SCIE</span>}{item.quartile && <span>{item.quartile}</span>}</div><p><Landmark size={15} /><span><small>Destek</small><b>{supportName(item)}</b></span></p><footer><span>{item.source || "Kurumsal doğrulama"}</span>{item.doi && <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer">DOI <ExternalLink size={12} /></a>}</footer></article>)}</div></section>}
    </>}
  </main>;
}
