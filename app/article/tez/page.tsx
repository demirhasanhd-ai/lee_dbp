"use client";

import { AlertTriangle, BookOpenCheck, Database, GraduationCap, Landmark, Network, Quote, Target, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PublicSiteHeader } from "../../PublicSiteHeader";
import { dbpPath } from "../../../lib/dbpPath";

type Metric = { total: number; masters: number; doctorates: number };
type CohortWindow = { eligible: boolean; converted: number | null; rate: number | null };
type CitationMetric = { publications: number; totalCitations: number; citationsPerPublication: number; citedPublications: number; citedRate: number };
type PublicData = {
  generatedAt: string;
  range: { fromYear: number; toYear: number };
  scope: { label: string; relationStatuses: string[] };
  filters: { fields: string[]; departments: string[]; years: number[]; degrees: string[] };
  summary: { completedTheses: number; completedMasters: number; completedDoctorates: number; thesesWithPublication: number; conversionRate: number; uniquePublications: number; thesisPublicationLinks: number; qualifiedPublications: number; qualifiedPublicationRate: number; masters: number; doctorates: number };
  yearly: Array<{ year: number; totalTheses: number; convertedTheses: number; conversionRate: number; masters: { theses: number; converted: number; rate: number }; doctorates: { theses: number; converted: number; rate: number } }>;
  fieldBreakdown: Array<{ field: string; theses: number; convertedTheses: number; conversionRate: number; publications: number; masters: number; doctorates: number; mastersPerformance: { theses: number; converted: number; rate: number }; doctoratePerformance: { theses: number; converted: number; rate: number }; scopus: number; trdizin: number }>;
  departmentBreakdown: Array<{ department: string; field: string; theses: number; convertedTheses: number; conversionRate: number; publications: number }>;
  yearlyPublications: Array<{ year: number; total: number; masters: number; doctorates: number }>;
  indexDistribution: Array<{ index: string } & Metric>;
  quartiles: Array<{ quartile: string; count: number }>;
  publicationTypes: Array<{ type: string; count: number }>;
  timeToPublication: Array<{ difference: number; label: string; count: number }>;
  citationPerformance: { total: CitationMetric; masters: CitationMetric; doctorates: CitationMetric };
  yearlyCitations: Array<{ year: number; masters: number; doctorates: number }>;
  funding: Array<{ type: string; count: number }>;
  international: { total: number; rate: number; masters: number; doctorates: number };
  sdgs: Array<{ id: string; count: number }>;
  strategicPriorities: Array<{ area: string; count: number }>;
  cohorts: Array<{ year: number; theses: number; month12: CohortWindow; month24: CohortWindow; month36: CohortWindow }>;
  scimago: { loaded: boolean; journalCount: number; files: string[]; years: number[] };
};

const fundingLabels: Record<string, string> = { bap: "BAP", tubitak: "TÜBİTAK", tuseb: "TÜSEB", eu: "AB / Horizon / COST", other: "Diğer destek", none: "Desteksiz", unknown: "Bilgi yok" };
const number = (value: number) => value.toLocaleString("tr-TR");
const percent = (value: number | null) => value == null ? "Süre dolmadı" : `%${value.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`;
const dateTime = (value: string) => value ? new Date(value).toLocaleString("tr-TR") : "Henüz veri yok";

function SectionTitle({ no, eyebrow, title }: { no: string; eyebrow: string; title: string }) {
  return <div className="article-section-title"><span>{no}</span><div><small>{eyebrow}</small><h2>{title}</h2></div></div>;
}

function Bars({ rows, maximum }: { rows: Array<{ label: string; value: number; detail?: string; tone?: string }>; maximum?: number }) {
  const max = maximum || Math.max(1, ...rows.map((item) => item.value));
  return <div className="thesis-metric-bars">{rows.map((item) => <article key={item.label}><header><b>{item.label}</b><strong>{number(item.value)}</strong></header><i><em className={item.tone || "primary"} style={{ width: `${item.value / max * 100}%` }} /></i>{item.detail && <small>{item.detail}</small>}</article>)}</div>;
}

function CitationCard({ label, metric }: { label: string; metric: CitationMetric }) {
  return <article><Quote /><span>{label}</span><strong>{number(metric.totalCitations)} atıf</strong><small>{metric.citationsPerPublication.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} yayın başına · {percent(metric.citedRate)} atıf alan yayın</small></article>;
}

function GroupedBarChart({ rows, percentScale = false }: { rows: Array<{ label: string; masters: number; doctorates: number; detail?: string }>; percentScale?: boolean }) {
  const maximum = percentScale ? 100 : Math.max(1, ...rows.flatMap((item) => [item.masters, item.doctorates]));
  return <div className="thesis-grouped-chart"><div className="thesis-chart-legend"><span><i className="master" />Tezli YL</span><span><i className="doctorate" />Doktora</span></div><div className="thesis-grouped-plot">{rows.map((item) => <article key={item.label}><div className="thesis-grouped-bars"><i className="master" style={{ height: `${Math.max(item.masters > 0 ? 3 : 0, item.masters / maximum * 100)}%` }}><em>{percentScale ? percent(item.masters) : number(item.masters)}</em></i><i className="doctorate" style={{ height: `${Math.max(item.doctorates > 0 ? 3 : 0, item.doctorates / maximum * 100)}%` }}><em>{percentScale ? percent(item.doctorates) : number(item.doctorates)}</em></i></div><b>{item.label}</b>{item.detail && <small>{item.detail}</small>}</article>)}</div></div>;
}

function ConversionLineChart({ rows }: { rows: PublicData["yearly"] }) {
  const width = Math.max(820, rows.length * 72);
  const height = 330;
  const left = 54;
  const right = 24;
  const top = 24;
  const bottom = 46;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index: number) => left + (rows.length <= 1 ? plotWidth / 2 : index / (rows.length - 1) * plotWidth);
  const y = (value: number) => top + (100 - Math.max(0, Math.min(100, value))) / 100 * plotHeight;
  const points = (key: "masters" | "doctorates") => rows.map((item, index) => `${x(index)},${y(item[key].rate)}`).join(" ");
  return <div className="thesis-line-chart"><div className="thesis-chart-legend"><span><i className="master" />Tezli YL</span><span><i className="doctorate" />Doktora</span></div><div className="thesis-line-scroll"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Yıllara göre tezlerin yayına dönüşüm oranı">{[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} className="grid" /><text x={left - 10} y={y(tick) + 4} textAnchor="end">%{tick}</text></g>)}<polyline points={points("masters")} className="master-line" /><polyline points={points("doctorates")} className="doctorate-line" />{rows.map((item, index) => <g key={item.year}><circle cx={x(index)} cy={y(item.masters.rate)} r="5" className="master-dot" /><circle cx={x(index)} cy={y(item.doctorates.rate)} r="5" className="doctorate-dot" /><text x={x(index)} y={height - 15} textAnchor="middle">{item.year}</text></g>)}</svg></div></div>;
}

function QuartileDonut({ rows }: { rows: PublicData["quartiles"] }) {
  const verified = rows.filter((item) => /^Q[1-4]$/u.test(item.quartile));
  const total = verified.reduce((sum, item) => sum + item.count, 0);
  const missing = rows.find((item) => item.quartile === "Bilgi yok")?.count || 0;
  let offset = 0;
  const colors = ["var(--thesis-series-master)", "var(--thesis-series-doctorate)", "var(--chart-2)", "var(--thesis-quartile-four)"];
  const segments = verified.map((item, index) => {
    const start = total ? offset / total * 100 : 0;
    offset += item.count;
    const end = total ? offset / total * 100 : 0;
    return `${colors[index]} ${start}% ${end}%`;
  });
  const style = { background: total ? `conic-gradient(${segments.join(",")})` : "var(--muted)" } as CSSProperties;
  return <div className="thesis-donut-panel"><div className="thesis-donut" style={style}><span><b>{number(total)}</b>quartile bilgili yayın</span></div><div className="thesis-donut-legend">{verified.map((item, index) => <span key={item.quartile}><i style={{ background: colors[index] }} /><b>{item.quartile}</b>{number(item.count)}</span>)}<small>{number(missing)} yayında quartile bilgisi yok</small></div></div>;
}

export default function ThesisBibliometricsPage() {
  const [data, setData] = useState<PublicData | null>(null);
  const [filters, setFilters] = useState({ yearFrom: "", yearTo: "", degree: "", field: "", department: "" });
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    fetch(`${dbpPath("/api/dbp/thesis-bibliometrics")}?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as PublicData | { message?: string };
        if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Tez tabanlı göstergeler alınamadı.");
        return body as PublicData;
      })
      .then((body) => { setData(body); setError(""); })
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message); });
    return () => controller.abort();
  }, [filters, retry]);

  const supportedFunding = useMemo(() => (data?.funding || []).filter((item) => !["none", "unknown"].includes(item.type)), [data]);
  const maxDepartment = Math.max(1, ...(data?.departmentBreakdown || []).map((item) => item.publications));
  const maxSdg = Math.max(1, ...(data?.sdgs || []).map((item) => item.count));

  return <main className="dbp-page quality-page article-page thesis-bibliometrics-page">
    <PublicSiteHeader active="bibliometrics" bibliometricsSource="thesis" />
    <section className="quality-hero article-hero"><div><small>TEZ KAYNAKLI YAYIN PERFORMANSI</small><h1>Lisansüstü Tez Tabanlı Göstergeler</h1><p>Tez, öğrenci ve danışman ortaklığı ile konu benzerliği kurallarından geçen yayın adaylarının performans görünümü.</p></div></section>

    {error && <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}>Yeniden dene</button></section>}
    {!data && !error && <section className="quality-loading">Tez kaynaklı yayın göstergeleri hazırlanıyor…</section>}

    {data && <>
      <section className="thesis-candidate-note"><Database size={18} /><div><b>{data.scope.label}</b><span>Değerler danışman onayı beklenmeden, LEE_DBP eşleştirme kurallarıyla belirlenen yayın adaylarından hesaplanır.</span></div><small>Son güncelleme {dateTime(data.generatedAt)}</small></section>

      <section className="thesis-public-filter thesis-performance-filter" aria-label="Tez performansı filtreleri">
        <label><span>Mezuniyet yılı başlangıcı</span><select value={filters.yearFrom} onChange={(event) => setFilters((current) => ({ ...current, yearFrom: event.target.value }))}><option value="">İlk yıldan</option>{data.filters.years.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label><span>Mezuniyet yılı bitişi</span><select value={filters.yearTo} onChange={(event) => setFilters((current) => ({ ...current, yearTo: event.target.value }))}><option value="">Son yıla</option>{data.filters.years.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label><span>Program düzeyi</span><select value={filters.degree} onChange={(event) => setFilters((current) => ({ ...current, degree: event.target.value }))}><option value="">Tezli YL ve Doktora</option><option value="masters">Tezli Yüksek Lisans</option><option value="doctorate">Doktora</option></select></label>
        <label><span>Bilim alanı</span><select value={filters.field} onChange={(event) => setFilters((current) => ({ ...current, field: event.target.value, department: "" }))}><option value="">Tüm bilim alanları</option>{data.filters.fields.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>ABD / ASD</span><select value={filters.department} onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}><option value="">Tüm ABD / ASD</option>{data.filters.departments.map((item) => <option key={item}>{item}</option>)}</select></label>
      </section>

      <section className="article-section"><SectionTitle no="01" eyebrow="GENEL PERFORMANS" title="Temel göstergeler" /><div className="thesis-public-kpis">
        <article><GraduationCap /><span>Tamamlanan tez</span><strong>{number(data.summary.completedTheses)}</strong><small>{number(data.summary.completedMasters)} tezli YL · {number(data.summary.completedDoctorates)} doktora</small></article>
        <article><TrendingUp /><span>Yayına dönüşüm oranı</span><strong>{percent(data.summary.conversionRate)}</strong><small>{number(data.summary.thesesWithPublication)} tez en az bir yayın adayı üretti</small></article>
        <article><BookOpenCheck /><span>Tez kaynaklı yayın</span><strong>{number(data.summary.uniquePublications)}</strong><small>{number(data.summary.thesisPublicationLinks)} tez-yayın bağlantısından tekilleştirildi</small></article>
        <article><Target /><span>Nitelikli yayın oranı</span><strong>{percent(data.summary.qualifiedPublicationRate)}</strong><small>{number(data.summary.qualifiedPublications)} SCI/SCIE, TR Dizin veya quartile atanmış Scopus yayını</small></article>
      </div></section>

      <section className="article-section"><SectionTitle no="02" eyebrow="YAYIN EĞİLİMİ" title="Yıllara göre tez kaynaklı yayınlar" /><GroupedBarChart rows={data.yearlyPublications.map((item) => ({ label: String(item.year), masters: item.masters, doctorates: item.doctorates, detail: `${item.total} tekil yayın` }))} /></section>

      <section className="article-section"><SectionTitle no="03" eyebrow="YAYINA DÖNÜŞÜM" title="Yıllara göre tezlerin yayına dönüşüm oranı" /><ConversionLineChart rows={data.yearly} /></section>

      <section className="article-section"><SectionTitle no="04" eyebrow="BİLİM ALANLARI" title="Fen, Sosyal ve Sağlık Bilimleri yayın sayıları" /><GroupedBarChart rows={data.fieldBreakdown.map((item) => ({ label: item.field.replace(/ Bilimleri?$/u, ""), masters: item.masters, doctorates: item.doctorates, detail: `${item.publications} tekil tez kaynaklı yayın` }))} /></section>

      <section className="article-section thesis-two-column"><div><SectionTitle no="05" eyebrow="YAYIN KAPSAMI" title="İndekslere göre dağılım" /><GroupedBarChart rows={data.indexDistribution.map((item) => ({ label: item.index, masters: item.masters, doctorates: item.doctorates, detail: `${item.total} tekil yayın` }))} /></div><div><SectionTitle no="06" eyebrow={`SCIMAGO ${data.scimago.years.join(", ") || ""}`} title="Quartile dağılımı" /><QuartileDonut rows={data.quartiles} /></div></section>

      <section className="article-section"><SectionTitle no="07" eyebrow="PROGRAM PERFORMANSI" title="ABD / ASD bazında tez kaynaklı yayın sayısı" /><div className="thesis-department-chart">{data.departmentBreakdown.map((item) => <article key={item.department}><div><b>{item.department}</b><small>{item.field} · {item.convertedTheses} yayın üreten tez / {item.theses} tamamlanan tez</small></div><i><em style={{ width: `${item.publications / maxDepartment * 100}%` }} /></i><strong>{number(item.publications)}</strong></article>)}</div></section>

      <section className="article-section thesis-two-column"><div><SectionTitle no="08" eyebrow="ÇIKTI TÜRLERİ" title="Yayın türü dağılımı" /><Bars rows={data.publicationTypes.map((item) => ({ label: item.type, value: item.count }))} /></div><div><SectionTitle no="09" eyebrow="YAYIN ZAMANLAMASI" title="Tez yılına göre yayın zamanı" /><Bars rows={data.timeToPublication.map((item) => ({ label: item.label, value: item.count }))} /><p className="thesis-method-note">DSpace kaydında mezuniyet ayı bulunmadığı için süreler yıl farkı üzerinden hesaplanır.</p></div></section>

      <section className="article-section"><SectionTitle no="10" eyebrow="ATIF PERFORMANSI" title="Tezli YL ve doktora yayınlarının yıllara göre atıfları" /><div className="thesis-public-kpis thesis-citation-kpis"><CitationCard label="Tüm yayınlar" metric={data.citationPerformance.total} /><CitationCard label="Tezli Yüksek Lisans" metric={data.citationPerformance.masters} /><CitationCard label="Doktora" metric={data.citationPerformance.doctorates} /></div><GroupedBarChart rows={data.yearlyCitations.map((item) => ({ label: String(item.year), masters: item.masters, doctorates: item.doctorates, detail: `${number(item.masters + item.doctorates)} atıf` }))} /></section>

      <section className="article-section thesis-two-column"><div><SectionTitle no="11" eyebrow="PROJE DESTEKLERİ" title="BAP, TÜBİTAK ve diğer destekler" />{supportedFunding.length ? <div className="thesis-funding-grid">{supportedFunding.map((item) => <article key={item.type}><Landmark /><span>{fundingLabels[item.type] || item.type}</span><strong>{number(item.count)}</strong></article>)}</div> : <div className="quality-panel thesis-public-empty"><Landmark /><b>Kaynaklarda proje desteği bulunamadı.</b></div>}</div><div><SectionTitle no="12" eyebrow="İŞ BİRLİĞİ" title="Uluslararası ortak yazarlık" /><div className="thesis-collaboration-card"><Network /><strong>{number(data.international.total)}</strong><span>uluslararası ortak yazarlı yayın</span><b>{percent(data.international.rate)}</b><small>{data.international.masters} tezli YL · {data.international.doctorates} doktora</small></div></div></section>

      <section className="article-section thesis-two-column"><div><SectionTitle no="13" eyebrow="TOPLUMSAL KATKI" title="Tezden üretilen yayınların SKA dağılımı" /><div className="thesis-public-sdgs">{data.sdgs.map((item) => <article key={item.id}><img src={dbpPath(`/sdg/sdg_${item.id}.png`)} alt="" /><span><b>SKA {item.id}</b><i><em style={{ width: `${item.count / maxSdg * 100}%` }} /></i></span><strong>{item.count}</strong></article>)}</div></div><div><SectionTitle no="14" eyebrow="STRATEJİK ÖNCELİKLER" title="Öncelikli araştırma alanları" /><Bars rows={data.strategicPriorities.map((item) => ({ label: item.area, value: item.count }))} /></div></section>

      <section className="article-section thesis-cohort-section"><SectionTitle no="15" eyebrow="MEZUNİYET KOHORTLARI" title="12, 24 ve 36 ay içinde yayına dönüşüm" /><div className="thesis-cohort-table"><table><thead><tr><th>Mezuniyet yılı</th><th>Tamamlanan tez</th><th>12 ay</th><th>24 ay</th><th>36 ay</th></tr></thead><tbody>{data.cohorts.map((item) => <tr key={item.year}><th>{item.year}</th><td>{item.theses}</td>{[item.month12, item.month24, item.month36].map((window, index) => <td key={index} className={!window.eligible ? "pending" : undefined}>{window.eligible ? <><b>{percent(window.rate)}</b><small>{window.converted}/{item.theses} tez</small></> : "Süre dolmadı"}</td>)}</tr>)}</tbody></table></div><p className="thesis-method-note">Mezuniyet ayı DSpace kaydında bulunmadığından 12/24/36 aylık kohortlar tez ve yayın yılı farkına göre yaklaşık hesaplanır.</p></section>
    </>}
  </main>;
}
