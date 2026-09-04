"use client";

import { AlertTriangle, BarChart3, BookOpen, CalendarClock, Database, ExternalLink, MapPinned, Network, PieChart, RefreshCw, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type CountItem = { name: string; count: number };
type SdgItem = { id: number; title: string; count: number; share: number };
type StrategyItem = { id: string; title: string; sdgs: number[]; count: number };
type YearPoint = { year: string; count: number };
type Dashboard = {
  generatedAt: string;
  lastSuccessfulHarvestAt: string;
  lastFullHarvestAt?: string;
  lastCitationRefreshAt?: string;
  nextRefreshAt: string;
  nextCitationRefreshAt: string;
  affiliationId: string;
  run: { mode: string; pages: number; seen: number };
  summary: { totalPublications: number; hIndex: number; totalCitations: number; citationsPerPublication: number; maxCitations: number; openAccessRate: number; authorCount: number; sourceCount: number; activeSdgCount: number; researchArticleCount: number };
  yearlyPublications: YearPoint[];
  yearlyCitations: YearPoint[];
  publicationTypes: CountItem[];
  openAccess: CountItem[];
  sourceTypes: CountItem[];
  units: CountItem[];
  unitYearly: Array<{ year: string; values: Record<string, number> }>;
  authors: CountItem[];
  subjects: CountItem[];
  subjectYearly: Array<{ year: string; values: Record<string, number> }>;
  countries: CountItem[];
  nationalInstitutions: CountItem[];
  sdgs: SdgItem[];
  developingSdgs: Array<{ id: number; title: string; count: number }>;
  strategicGoals: StrategyItem[];
  quality: { unitCoverage: number; unitEstimatedCount?: number; authorCoverage: number; sdgMethod: string; unitMethod?: string };
};

const strategicMatrix = [
  { sdg: 4, goal: "A2 – Eğitim-Öğretim", targets: "H2.1, H2.2, H2.3, H3.5", note: "Eğitim araştırmaları eğitim-öğretim niteliği ve program geliştirme hedeflerini destekler." },
  { sdg: 6, goal: "A3 – Araştırma ve Bilim", targets: "H3.1, H3.2", note: "Su ve çevre yayınları sürdürülebilir araştırma kapasitesiyle ilişkilidir." },
  { sdg: 9, goal: "A1, A3, A5", targets: "H1.3, H3.1, H3.2, H5.5", note: "Mühendislik ve teknoloji yayınları araştırma altyapısı ile sanayi iş birliği hedeflerini destekler." },
  { sdg: 3, goal: "A2, A4", targets: "H2.4, H4.1", note: "Sağlık ve yaşam kalitesi yayınları eğitim ve toplumsal hizmet hedefleriyle ilişkilidir." },
  { sdg: 8, goal: "A3, A5", targets: "H3.2, H5.5", note: "İşletme, iktisat ve finans yayınları kalkınma ve girişimcilik hedefleriyle örtüşür." },
  { sdg: 7, goal: "A5 – Yenilenebilir Enerji", targets: "H5.1, H5.2, H5.3, H5.4, H5.5", note: "Enerji yayınları üniversitenin ihtisaslaşma misyonuyla doğrudan uyumludur." },
  { sdg: 2, goal: "A3 – Araştırma ve Bilim", targets: "H3.1, H3.2", note: "Gıda ve tarım yayınları bölgesel üretim ve araştırma potansiyelini destekler." },
  { sdg: 15, goal: "A3 – Araştırma ve Bilim", targets: "H3.1", note: "Biyoloji ve ekoloji yayınları bölgesel biyoçeşitlilik kapasitesine katkı sağlar." },
  { sdg: 5, goal: "A2, A4", targets: "H2.1, H4.3", note: "Toplumsal cinsiyet yayınları kapsayıcı eğitim ve toplumsal hizmetle ilişkilidir." },
  { sdg: 13, goal: "A5 – Yenilenebilir Enerji", targets: "H5.3, H5.4", note: "İklim ve çevre yayınları sıfır atık ve sürdürülebilirlik hedefleriyle örtüşür." },
];

const tones = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)", "var(--success)", "var(--destructive)"];
const formatNumber = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
const formatDate = (value?: string) => value ? new Date(value).toLocaleString("tr-TR") : "—";

function Empty({ children = "Scopus yanıtında bu kırılım için güvenilir veri bulunamadı." }: { children?: ReactNode }) {
  return <div className="article-empty"><Database size={22} /><span>{children}</span></div>;
}

function Panel({ eyebrow, title, icon, children, className = "" }: { eyebrow: string; title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return <article className={`quality-panel article-panel ${className}`}><header><div><small>{eyebrow}</small><h2>{title}</h2></div>{icon}</header>{children}</article>;
}

function LineChart({ data, color = "var(--chart-1)", label, unit }: { data: YearPoint[]; color?: string; label: string; unit: string }) {
  const points = data.slice(-15);
  if (!points.length) return <Empty />;
  const max = Math.max(1, ...points.map((item) => item.count));
  const ceiling = Math.ceil(max / 4) * 4;
  const left = 62, right = 620, top = 34, bottom = 252;
  const coords = points.map((item, index) => ({ ...item, x: points.length === 1 ? (left + right) / 2 : left + index * ((right - left) / (points.length - 1)), y: bottom - item.count / ceiling * (bottom - top) }));
  const path = coords.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const ticks = Array.from({ length: 5 }, (_, index) => Math.round(ceiling * (4 - index) / 4));
  return <div className="article-line-chart" role="img" aria-label={label}><svg viewBox="0 0 640 300"><title>{label}</title><text className="axis-title" x={left} y="16">{unit}</text>{ticks.map((tick, index) => { const y = top + index * ((bottom - top) / 4); return <g key={tick}><line className="grid-line" x1={left} x2={right} y1={y} y2={y} /><text className="axis-label" x={left - 10} y={y + 4} textAnchor="end">{formatNumber(tick)}</text></g>; })}<line className="axis-line" x1={left} x2={left} y1={top} y2={bottom} /><line className="axis-line" x1={left} x2={right} y1={bottom} y2={bottom} /><path className="area" style={{ color }} d={`${path} L${coords.at(-1)?.x},${bottom} L${coords[0].x},${bottom} Z`} /><path className="line" style={{ color }} d={path} />{coords.map((point) => <g key={point.year}><circle style={{ color }} cx={point.x} cy={point.y} r="4"><title>{point.year}: {formatNumber(point.count)}</title></circle><text className="axis-label" x={point.x} y={bottom + 23} textAnchor="middle">{point.year.slice(-2)}</text></g>)}</svg></div>;
}

function Donut({ data, center, suffix = "" }: { data: CountItem[]; center: string; suffix?: string }) {
  const usable = data.filter((item) => item.count > 0).slice(0, 8);
  const total = usable.reduce((sum, item) => sum + item.count, 0);
  if (!total) return <Empty />;
  const segments = usable.reduce<{ cursor: number; parts: string[] }>((result, item, index) => {
    const nextCursor = result.cursor + item.count / total * 100;
    return { cursor: nextCursor, parts: [...result.parts, `${tones[index % tones.length]} ${result.cursor}% ${nextCursor}%`] };
  }, { cursor: 0, parts: [] }).parts.join(", ");
  return <div className="article-donut-layout"><div className="article-donut" style={{ "--segments": segments } as CSSProperties}><div><strong>{center}</strong><span>{suffix}</span></div></div><ul>{usable.map((item, index) => <li key={item.name}><i style={{ background: tones[index % tones.length] }} /><span title={item.name}>{item.name}</span><b>{formatNumber(item.count)}</b><small>%{formatNumber(item.count / total * 100)}</small></li>)}</ul></div>;
}

function Bars({ data, limit, showShare = false }: { data: CountItem[]; limit?: number; showShare?: boolean }) {
  const rows = typeof limit === "number" ? data.slice(0, limit) : data;
  if (!rows.length) return <Empty />;
  const max = Math.max(1, ...rows.map((item) => item.count));
  const total = rows.reduce((sum, item) => sum + item.count, 0) || 1;
  return <div className="article-bars">{rows.map((item, index) => <div key={`${item.name}-${index}`}><span title={item.name}>{item.name}</span><i><em style={{ width: `${Math.max(2, item.count / max * 100)}%`, background: tones[index % tones.length] }} /></i><b>{formatNumber(item.count)}</b>{showShare && <small>%{formatNumber(item.count / total * 100)}</small>}</div>)}</div>;
}

function SubjectBubbleMatrix({ data, totals }: { data: Dashboard["subjectYearly"]; totals: CountItem[] }) {
  const years = data.slice(-9);
  const subjects = totals.slice(0, 12).map((item) => item.name);
  if (!years.length || !subjects.length) return <Empty>Alanların yıllık Scopus kırılımı sonraki üst veri güncellemesinde hazırlanacak.</Empty>;
  const left = 220, right = 980, top = 24, bottom = 430;
  const x = (index: number) => years.length === 1 ? (left + right) / 2 : left + index * ((right - left) / (years.length - 1));
  const y = (index: number) => top + index * ((bottom - top) / Math.max(1, subjects.length - 1));
  const max = Math.max(1, ...years.flatMap((item) => subjects.map((subject) => item.values[subject] || 0)));
  return <div className="article-bubble-matrix"><svg viewBox="0 0 1100 500" role="img" aria-label="Scopus alan kategorilerinin yıllara göre yayın sayısı balon grafiği"><title>Alan bazlı yıl ve yayın sayısı</title>{subjects.map((subject, subjectIndex) => <g key={subject}><line className="grid-line" x1={left} x2={right} y1={y(subjectIndex)} y2={y(subjectIndex)} /><text className="axis-label subject" x={left - 15} y={y(subjectIndex) + 4} textAnchor="end">{subject}</text></g>)}{years.map((item, yearIndex) => <g key={item.year}><line className="grid-line vertical" x1={x(yearIndex)} x2={x(yearIndex)} y1={top} y2={bottom} /><text className="axis-label" x={x(yearIndex)} y={bottom + 30} textAnchor="middle">{item.year}</text>{subjects.map((subject, subjectIndex) => { const count = item.values[subject] || 0; const radius = count ? 3 + Math.sqrt(count / max) * 22 : 0; return count ? <circle key={subject} cx={x(yearIndex)} cy={y(subjectIndex)} r={radius} style={{ color: tones[subjectIndex % tones.length] }}><title>{subject} · {item.year}: {formatNumber(count)} yayın</title></circle> : null; })}</g>)}<text className="axis-title" x={(left + right) / 2} y="488" textAnchor="middle">Yayın yılı · balon alanı yayın sayısını gösterir</text></svg></div>;
}

const countryAliases: Record<string, string> = {
  "united states of america": "united states", russia: "russian federation", vietnam: "viet nam", czechia: "czech republic",
  "south korea": "south korea", "dem rep congo": "democratic republic of the congo", "dominican rep": "dominican republic",
  "bosnia and herz": "bosnia and herzegovina", "central african rep": "central african republic", "eq guinea": "equatorial guinea",
};
const mapName = (value: string) => value.toLocaleLowerCase("en-US").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\./g, "").trim();

function WorldHeatMap({ data }: { data: CountItem[] }) {
  const topology = worldData as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const countries = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
  const projection = geoNaturalEarth1().fitExtent([[12, 12], [948, 458]], countries);
  const path = geoPath(projection);
  const lookup = new Map(data.map((item) => [mapName(item.name), item]));
  const max = Math.max(1, ...data.map((item) => item.count));
  return <div className="article-world-map"><svg viewBox="0 0 960 480" role="img" aria-label="Uluslararası yayın iş birliklerinin ülkelere göre yoğunluk haritası"><title>Uluslararası iş birliği yoğunluk haritası</title>{countries.features.map((country) => { const sourceName = countryAliases[mapName(country.properties.name)] || mapName(country.properties.name); const item = lookup.get(sourceName); const intensity = item ? .18 + Math.sqrt(item.count / max) * .82 : 0; return <path key={String(country.id)} d={path(country) || undefined} className={item ? "active" : "inactive"} style={item ? { fillOpacity: intensity } : undefined}><title>{country.properties.name}: {item ? `${formatNumber(item.count)} ortak yayın` : "eşleşen yayın yok"}</title></path>; })}</svg><div className="article-map-scale"><span>Düşük</span>{[.2,.4,.6,.8,1].map((opacity) => <i key={opacity} style={{ opacity }} />)}<span>Yüksek</span></div></div>;
}

export default function BibliometricsPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/bibliometrics"), { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as Dashboard | { message?: string };
        if (response.status === 202) { setSyncing(true); throw new Error("İlk Scopus görüntüsü hazırlanıyor. Birkaç dakika sonra yeniden deneyin."); }
        if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Bibliyometrik göstergeler alınamadı.");
        return body as Dashboard;
      })
      .then((next) => { setData(next); setError(""); setSyncing(false); })
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message); });
    return () => controller.abort();
  }, [retry]);

  const kpis = useMemo(() => data ? [
    ["Toplam yayın", data.summary.totalPublications, "Scopus kayıtları"], ["H-index", data.summary.hIndex, "Atıf profili"],
    ["Toplam atıf", data.summary.totalCitations, "Haftalık güncellenir"], ["Atıf / yayın", data.summary.citationsPerPublication, "Ortalama etki"],
    ["En yüksek atıf", data.summary.maxCitations, "Tek yayında"], ["Açık erişim", `%${formatNumber(data.summary.openAccessRate)}`, "Yayınların oranı"],
    ["OKÜ yazar", data.summary.authorCount, `Eşleşme kapsamı %${data.quality.authorCoverage}`], ["Kaynak", data.summary.sourceCount, "Dergi / kitap / seri"],
    ["Aktif eşleşen SKA", data.summary.activeSdgCount, "İçerik eşleşmesi"], ["Araştırma makalesi", data.summary.researchArticleCount, "Toplam"],
  ] : [], [data]);
  const classifiedUnits = data?.units.filter((item) => item.name !== "Birim bilgisi belirtilmemiş") || [];
  const unitTotal = classifiedUnits.reduce((sum, item) => sum + item.count, 0);
  const estimatedUnitCount = data?.quality.unitEstimatedCount || 0;
  const sdgCounts = data?.sdgs.map((item) => ({ name: `SKA ${item.id} · ${item.title}`, count: item.count })) || [];

  return <main className="dbp-page quality-page article-page">
    <PublicSiteHeader active="bibliometrics" />
    <section className="quality-hero article-hero"><div><small>SCOPUS · KURUMSAL ARAŞTIRMA PERFORMANSI</small><h1>Bibliyometrik Göstergeler</h1><p>OKÜ adresli bilimsel yayınların üretim, etki, iş birliği, alan ve sürdürülebilirlik görünümü.</p></div><span><Database size={18} />Scopus kurumsal veri görüntüsü</span></section>

    {error && <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15} />{syncing ? "Durumu kontrol et" : "Yeniden dene"}</button></section>}
    {!data && !error && <section className="quality-loading">Bibliyometrik göstergeler son başarılı Scopus görüntüsünden hazırlanıyor…</section>}

    {data && <>
      <section className="article-source-strip"><span><Database size={16} />Affiliation ID: {data.affiliationId}</span><span><CalendarClock size={16} />Yayın verisi: {formatDate(data.lastFullHarvestAt || data.lastSuccessfulHarvestAt)}</span><span><RefreshCw size={16} />Atıflar: {formatDate(data.lastCitationRefreshAt)}</span><a href="https://www.scopus.com" target="_blank" rel="noreferrer">Veri kaynağı: Scopus <ExternalLink size={14} /></a></section>

      <section className="article-section"><div className="article-section-title"><span>01</span><div><small>GENEL BAKIŞ</small><h2>Kurumsal yayın performansı</h2></div></div><div className="article-kpis">{kpis.map(([label, value, note]) => <article key={String(label)}><span>{label}</span><strong>{typeof value === "number" ? formatNumber(value) : value}</strong><small>{note}</small></article>)}</div></section>

      <section className="article-grid two">
        <Panel eyebrow="ZAMAN SERİSİ" title="Yıllık yayın trendi" icon={<TrendingUp size={20} />}><LineChart data={data.yearlyPublications} label="Yıllık yayın trendi" unit="Yayın sayısı" /></Panel>
        <Panel eyebrow="ATIF ETKİSİ" title="Yayın yılına göre toplam atıf" icon={<BarChart3 size={20} />}><LineChart data={data.yearlyCitations} color="var(--chart-4)" label="Yayın yılına göre alınan toplam atıf" unit="Atıf sayısı" /><p className="quality-note">Değerler, ilgili yılda yayımlanan çalışmaların güncel toplam atıflarıdır.</p></Panel>
      </section>

      <section className="article-grid three">
        <Panel eyebrow="YAYIN BİÇİMİ" title="Yayın türü dağılımı" icon={<PieChart size={20} />}><Donut data={data.publicationTypes} center={formatNumber(data.summary.totalPublications)} suffix="yayın" /></Panel>
        <Panel eyebrow="ERİŞİM" title="Açık erişim durumu" icon={<BookOpen size={20} />}><Donut data={data.openAccess} center={`%${formatNumber(data.summary.openAccessRate)}`} suffix="açık erişim" /></Panel>
        <Panel eyebrow="YAYIN KANALI" title="Kaynak türü" icon={<Database size={20} />}><Donut data={data.sourceTypes} center={formatNumber(data.summary.sourceCount)} suffix="kaynak" /></Panel>
      </section>

      <section className="article-section"><div className="article-section-title"><span>02</span><div><small>AKADEMİK BİRİMLER</small><h2>Birim bazlı yayın dağılımı</h2></div></div><div className="article-grid two embedded"><Panel eyebrow="YAYIN SAYISI" title="Birimlere göre yayınlar"><Bars data={classifiedUnits} limit={14} /></Panel><Panel eyebrow="ORANSAL DAĞILIM" title="Birimlerin yayın payı"><Donut data={classifiedUnits} center={formatNumber(unitTotal)} suffix="yayın" /></Panel></div><p className="quality-note">{data.quality.unitMethod}. %{formatNumber(data.quality.unitCoverage)} doğrudan eşleşme; {formatNumber(estimatedUnitCount)} yayın Scopus alan ağırlıklarıyla dağıtılmıştır. Bu bölüm tahmini kurumsal dağılımdır.</p></section>

      <section className="article-section"><div className="article-section-title"><span>03</span><div><small>ARAŞTIRMACILAR</small><h2>OKÜ akademisyen toplam yayın görünümü</h2></div></div><Panel eyebrow="20 YAYIN VE ÜZERİ" title="Scopus kurumsal adresiyle eşleşen akademisyenler" icon={<Users size={20} />} className="embedded-panel">{data.authors.length ? <Bars data={data.authors} /> : <Empty>Scopus yanıtında kurumsal yazar eşleşmesiyle 20 yayın eşiğini geçen kayıt bulunamadı.</Empty>}</Panel></section>

      <section className="article-section"><div className="article-section-title"><span>04</span><div><small>DİSİPLİN ALANLARI</small><h2>Scopus alan kategorileri</h2></div></div><div className="article-grid two embedded"><Panel eyebrow="ALAN SIRALAMASI" title="Alan kategorileri"><Bars data={data.subjects} limit={18} /></Panel><Panel eyebrow="ALAN PAYLARI" title="Alanların oransal dağılımı"><Donut data={data.subjects} center={formatNumber(data.summary.totalPublications)} suffix="yayın" /></Panel></div></section>
      <Panel eyebrow="YIL × ALAN × YAYIN" title="Alan bazlı yayınların yıllara göre dağılımı" className="article-wide"><SubjectBubbleMatrix data={data.subjectYearly || []} totals={data.subjects} /></Panel>

      <section className="article-section"><div className="article-section-title"><span>05</span><div><small>ORTAK ARAŞTIRMA AĞI</small><h2>Uluslararası ve ulusal iş birliği</h2></div></div><div className="article-grid two embedded article-collaboration-grid"><Panel eyebrow="DÜNYA GÖRÜNÜMÜ" title="Uluslararası iş birliği yoğunluk haritası" icon={<MapPinned size={20} />}><WorldHeatMap data={data.countries} /></Panel><Panel eyebrow="ULUSAL · İLK 10" title="Türkiye’de iş birliği yapılan üniversiteler" icon={<Network size={20} />}><Bars data={data.nationalInstitutions} limit={10} /></Panel></div></section>

      <section className="article-section"><div className="article-section-title"><span>06</span><div><small>SÜRDÜRÜLEBİLİR KALKINMA</small><h2>SKA analizi</h2></div></div><div className="article-grid two embedded"><Panel eyebrow="TOPLAM YAYIN" title="SKA bazlı yayın dağılımı"><Bars data={sdgCounts} showShare /></Panel><Panel eyebrow="ORANSAL GÖRÜNÜM" title="SKA paylarının dağılımı"><Donut data={sdgCounts} center={formatNumber(data.sdgs.reduce((sum, item) => sum + item.count, 0))} suffix="yayın–SKA ilişkisi" /></Panel></div><Panel eyebrow="İYİLEŞTİRME ALANI" title="Geliştirilebilecek SKA hedefleri" icon={<Sparkles size={20} />} className="embedded-panel article-development"><p>En düşük yayın eşleşmesine sahip hedefler, yeni araştırma çağrıları ve disiplinler arası iş birlikleri için izleme alanı olarak listelenir.</p><div>{data.developingSdgs.map((item) => <article key={item.id}><img src={dbpPath(`/sdg/sdg_${item.id}.png`)} alt="" /><span><b>SKA {item.id}</b><small>{item.title}</small></span><strong>{formatNumber(item.count)}</strong></article>)}</div><p className="quality-note">Yöntem: {data.quality.sdgMethod}. Bu gösterge bibliyometrik içerik eşleşmesidir; editoryal SKA sınıflandırması değildir.</p></Panel></section>

      <section className="article-section article-strategy"><div className="article-section-title"><span>07</span><div><small>2025–2029 STRATEJİK PLANI</small><h2>OKÜ stratejik hedefleri bazlı yayın dağılımı</h2></div></div><div>{data.strategicGoals.map((goal, index) => <article key={goal.id}><header><span style={{ background: tones[index % tones.length] }}>{goal.id}</span><div><h3>{goal.title}</h3><small>{goal.sdgs.map((id) => `SKA ${id}`).join(" · ")}</small></div><strong>{formatNumber(goal.count)}</strong></header><i><em style={{ width: `${Math.max(2, goal.count / Math.max(1, ...data.strategicGoals.map((item) => item.count)) * 100)}%`, background: tones[index % tones.length] }} /></i></article>)}</div><Panel eyebrow="STRATEJİK PLAN EŞLEŞMESİ" title="Yayın–SKA Stratejik Plan Uyum Matrisi" icon={<Target size={20} />} className="article-strategy-matrix"><p className="quality-note">Yayın sayıları güncel Scopus görüntüsündeki içerik–SKA eşleşmelerinden hesaplanır; amaç ve hedef bağlantıları 2025–2029 Stratejik Plan referans eşlemesidir.</p><div className="quality-table-scroll"><table className="quality-table"><thead><tr><th>SKA</th><th>Yayın sayısı</th><th>Bağlantılı SP amacı</th><th>Bağlantılı SP hedefleri</th><th>Yorum</th></tr></thead><tbody>{strategicMatrix.map((row) => { const sdg = data.sdgs.find((item) => item.id === row.sdg); return <tr key={row.sdg}><td><span className="article-sdg-label">SKA {row.sdg} – {sdg?.title}</span></td><td><strong>{formatNumber(sdg?.count || 0)}</strong></td><td>{row.goal}</td><td>{row.targets}</td><td>{row.note}</td></tr>; })}</tbody></table></div></Panel></section>

      <section className="article-sync"><div><CalendarClock /><span><b>Sonraki yayın üst verisi güncellemesi</b>{formatDate(data.nextRefreshAt)}</span></div><div><RefreshCw /><span><b>Sonraki atıf güncellemesi</b>{formatDate(data.nextCitationRefreshAt)}</span></div><small>Yayın üst verileri Şubat ve Eylül dönemlerinde; atıf göstergeleri haftalık yenilenir. Başarısız işlemde son başarılı görüntü korunur.</small></section>
    </>}
  </main>;
}
