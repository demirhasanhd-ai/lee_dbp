"use client";

import { AlertTriangle, BarChart3, BookOpen, BriefcaseBusiness, CalendarClock, Database, GraduationCap, PieChart, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type SdgGoal = { id: string; title: string; count: number };
type Dashboard = {
  generatedAt: string; lastSuccessfulHarvestAt: string; nextRefreshAt: string; source: string;
  run: { mode: string; seen: number; added: number; updated: number; unchanged: number; deleted: number };
  filters: { years: number[]; departments: string[]; degrees: string[] };
  summary: { total: number; masters: number; doctorates: number; sdgLinked: number };
  degreeCounts: Record<string, number>; yearCounts: Record<string, number>; sdgGoals: SdgGoal[];
  departmentCounts: Array<{ name: string; count: number }>;
};

const strategicGoals = [
  { id: "A1", title: "Kurumsal Kapasite", description: "Fiziki ve sosyal altyapıyı güçlendirmek; akademik ve idari personel kalitesini artırmak; tanınırlık ve teknoloji kullanımını geliştirmek.", sdgs: [4, 9] },
  { id: "A2", title: "Eğitim-Öğretim", description: "Eğitim-öğretimi akredite edilebilir düzeye getirmek; mesleki yeterlilik sahibi mezunlar yetiştirmek; öğrenci sayısını artırmak.", sdgs: [4, 3, 5] },
  { id: "A3", title: "Araştırma ve Bilim", description: "Bilimsel araştırma faaliyetlerini geliştirmek; yayın sayısını artırmak; araştırma merkezleri ve laboratuvarları güçlendirmek.", sdgs: [9, 7, 15] },
  { id: "A4", title: "Toplumsal Hizmet", description: "Paydaşlarla iş birliği yapmak; dezavantajlı bireylerin sosyal entegrasyonunu ve bilimsel-kültürel faaliyetleri desteklemek.", sdgs: [3, 10, 11] },
  { id: "A5", title: "Yenilenebilir Enerji ve Sürdürülebilirlik", description: "Yenilenebilir enerji ve batarya teknolojilerinde ihtisaslaşmayı; sıfır atık kampüsü, enerji verimliliğini ve sanayi-üniversite iş birliğini geliştirmek.", sdgs: [7, 13, 6, 12] },
];

const strategicMatrix = [
  { sdg: 4, goal: "A2 – Eğitim-Öğretim", targets: "H2.1, H2.2, H2.3, H3.5", note: "Lisansüstü program üretimi doğrudan eğitim-öğretim hedeflerini destekler." },
  { sdg: 6, goal: "A3 – Araştırma ve Bilim", targets: "H3.1, H3.2", note: "Su, çevre, kimya ve biyoloji araştırmaları sürdürülebilir çevre yaklaşımıyla ilişkilidir." },
  { sdg: 9, goal: "A1, A3, A5", targets: "H1.3, H3.1, H3.2, H5.5", note: "Mühendislik ve teknoloji tezleri sanayi-üniversite iş birliği hedeflerini destekler." },
  { sdg: 3, goal: "A2, A4", targets: "H2.4, H4.1", note: "Sağlık ve yaşam kalitesi araştırmaları eğitim ve toplumsal hizmet hedefleriyle ilişkilidir." },
  { sdg: 8, goal: "A3, A5", targets: "H3.2, H5.5", note: "İşletme, iktisat ve finans araştırmaları kalkınma ve girişimcilik hedefleriyle örtüşür." },
  { sdg: 7, goal: "A5 – Yenilenebilir Enerji", targets: "H5.1, H5.2, H5.3, H5.4, H5.5", note: "Üniversitenin enerji ihtisaslaşmasıyla doğrudan uyumludur." },
  { sdg: 2, goal: "A3 – Araştırma ve Bilim", targets: "H3.1, H3.2", note: "Gıda ve tarım araştırmaları bölgesel üretim potansiyelini destekler." },
  { sdg: 15, goal: "A3 – Araştırma ve Bilim", targets: "H3.1", note: "Biyoloji ve ekoloji araştırmaları bölgesel biyoçeşitliliğe katkı sağlar." },
  { sdg: 5, goal: "A2, A4", targets: "H2.1, H4.3", note: "Toplumsal cinsiyet araştırmaları kapsayıcı eğitim ve toplumsal hizmetle ilişkilidir." },
  { sdg: 13, goal: "A5 – Yenilenebilir Enerji", targets: "H5.3, H5.4", note: "İklim ve çevre araştırmaları sıfır atık ve sürdürülebilirlik hedefleriyle örtüşür." },
];

const number = (value: number) => value.toLocaleString("tr-TR");
const dateTime = (value: string) => value ? new Date(value).toLocaleString("tr-TR") : "—";

export default function ThesisSdgAnalysisPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [filters, setFilters] = useState({ year: "", degree: "", department: "", sdg: "" });
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    fetch(`${dbpPath("/api/dbp/thesis-ska")}?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as Dashboard | { message?: string };
        if (response.status === 202) throw new Error("İlk DSpace senkronizasyonu sürüyor. Kısa süre sonra yeniden deneyin.");
        if (!response.ok) throw new Error("Tez analiz verileri alınamadı.");
        return body as Dashboard;
      })
      .then((nextData) => { setData(nextData); setError(""); })
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message); });
    return () => controller.abort();
  }, [filters, retry]);

  const maximumYear = Math.max(1, ...Object.values(data?.yearCounts || {}));
  const maximumDepartment = Math.max(1, ...(data?.departmentCounts || []).map((item) => item.count));
  const maximumSdg = Math.max(1, ...(data?.sdgGoals || []).map((item) => item.count));
  const linkedRatio = data?.summary.total ? Math.round((data.summary.sdgLinked / data.summary.total) * 1000) / 10 : 0;
  const degreeGradient = useMemo(() => {
    const entries = Object.entries(data?.degreeCounts || {});
    const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
    let cursor = 0;
    const colors = ["var(--chart-1)", "var(--chart-4)", "var(--chart-3)"];
    return entries.map(([, value], index) => { const start = cursor; cursor += (value / total) * 100; return `${colors[index % colors.length]} ${start}% ${cursor}%`; }).join(", ");
  }, [data]);

  return (
    <main className="dbp-page quality-page thesis-sdg-page">
      <PublicSiteHeader active="thesisSdg" />
      <section className="quality-hero"><div><small>LİSANSÜSTÜ TEZLER · SÜRDÜRÜLEBİLİR KALKINMA AMAÇLARI</small><h1>TEZ_SKA Analiz</h1><p>DSpace açık arşivindeki tezleri yıl, tez türü, ABD/ASD ve SKA ilişkisine göre inceleyin.</p></div><span><Database size={18} />Canlı DSpace OAI-PMH verisi</span></section>

      {error && <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}>Yeniden dene</button></section>}
      {!data && !error && <section className="quality-loading">Tez ve SKA analizleri yerel anlık görüntüden hazırlanıyor…</section>}

      {data && <>
        <section className="thesis-filter-panel" aria-label="Tez analizi filtreleri">
          <label><span>Yıl</span><select value={filters.year} onChange={(event) => setFilters((value) => ({ ...value, year: event.target.value }))}><option value="">Tüm yıllar</option>{data.filters.years.map((year) => <option key={year}>{year}</option>)}</select></label>
          <label><span>Tez türü</span><select value={filters.degree} onChange={(event) => setFilters((value) => ({ ...value, degree: event.target.value }))}><option value="">Tüm tez türleri</option>{data.filters.degrees.map((degree) => <option key={degree}>{degree}</option>)}</select></label>
          <label><span>ABD / ASD</span><select value={filters.department} onChange={(event) => setFilters((value) => ({ ...value, department: event.target.value }))}><option value="">Tüm birimler</option>{data.filters.departments.map((department) => <option key={department}>{department}</option>)}</select></label>
          <label><span>SKA</span><select value={filters.sdg} onChange={(event) => setFilters((value) => ({ ...value, sdg: event.target.value }))}><option value="">Tüm SKA&apos;lar</option>{data.sdgGoals.map((goal) => <option key={goal.id} value={goal.id}>SKA {goal.id} · {goal.title}</option>)}</select></label>
        </section>

        <section className="thesis-kpis">
          <article><BookOpen /><span>Toplam tez</span><strong>{number(data.summary.total)}</strong></article>
          <article><GraduationCap /><span>Yüksek lisans</span><strong>{number(data.summary.masters)}</strong></article>
          <article><Target /><span>Doktora</span><strong>{number(data.summary.doctorates)}</strong></article>
          <article><PieChart /><span>SKA ilişkili tez</span><strong>{number(data.summary.sdgLinked)}</strong><small>%{linkedRatio}</small></article>
        </section>

        <section className="thesis-chart-grid">
          <article className="quality-panel thesis-year-panel"><header><div><small>ZAMAN SERİSİ</small><h2>Yıllara göre tez sayısı</h2></div><BarChart3 size={20} /></header><div className="thesis-bar-chart">{Object.entries(data.yearCounts).sort((a, b) => Number(a[0]) - Number(b[0])).map(([year, count]) => <div key={year}><span style={{ height: `${Math.max(6, (count / maximumYear) * 100)}%` }}><b>{count}</b></span><small>{year}</small></div>)}</div></article>
          <article className="quality-panel thesis-degree-panel"><header><div><small>TEZ TÜRÜ</small><h2>Program düzeyi dağılımı</h2></div><PieChart size={20} /></header><div className="thesis-donut" style={{ "--segments": degreeGradient || "var(--muted) 0 100%" } as CSSProperties}><div><strong>{number(data.summary.total)}</strong><span>tez</span></div></div><ul>{Object.entries(data.degreeCounts).map(([label, count], index) => <li key={label}><i className={`tone-${index + 1}`} /><span>{label}</span><b>{count}</b></li>)}</ul></article>
        </section>

        <section className="quality-panel thesis-sdg-panel"><header><div><small>SKA 1–17</small><h2>Tezlerin sürdürülebilir kalkınma amaçları dağılımı</h2></div><span>{number(data.sdgGoals.reduce((sum, goal) => sum + goal.count, 0))} tez–SKA ilişkisi</span></header><div className="thesis-sdg-bars">{data.sdgGoals.map((goal) => <button type="button" key={goal.id} onClick={() => setFilters((value) => ({ ...value, sdg: value.sdg === goal.id ? "" : goal.id }))} className={filters.sdg === goal.id ? "selected" : ""}><img src={dbpPath(`/sdg/sdg_${goal.id}.png`)} alt="" /><span><b>SKA {goal.id}</b><small>{goal.title}</small></span><i><em style={{ width: `${(goal.count / maximumSdg) * 100}%` }} /></i><strong>{goal.count}</strong></button>)}</div><p className="quality-note">SKA ilişkileri tez başlığı, özet ve anahtar kelimelerdeki doğrulanabilir terim eşleşmeleriyle üretilir; sonuçlar akademik içerik analizi göstergesidir ve kesin sınıflandırma iddiası taşımaz.</p></section>

        <section className="thesis-chart-grid">
          <article className="quality-panel thesis-department-panel"><header><div><small>AKADEMİK BİRİMLER</small><h2>En çok tez üreten ABD / ASD&apos;ler</h2></div><GraduationCap size={20} /></header><div>{data.departmentCounts.map((item) => <button type="button" key={item.name} onClick={() => setFilters((value) => ({ ...value, department: item.name }))}><span>{item.name}</span><i><em style={{ width: `${(item.count / maximumDepartment) * 100}%` }} /></i><b>{item.count}</b></button>)}</div></article>
          <article className="quality-panel thesis-sync-panel"><header><div><small>VERİ KAYNAĞI</small><h2>DSpace senkronizasyon durumu</h2></div><CalendarClock size={20} /></header><dl><div><dt>Son başarılı güncelleme</dt><dd>{dateTime(data.lastSuccessfulHarvestAt)}</dd></div><div><dt>Sonraki planlı güncelleme</dt><dd>{dateTime(data.nextRefreshAt)}</dd></div><div><dt>Son işlem</dt><dd>{data.run.mode} · {data.run.seen} kayıt</dd></div><div><dt>Değişiklikler</dt><dd>{data.run.added} yeni · {data.run.updated} güncel · {data.run.deleted} silinmiş</dd></div></dl></article>
        </section>

        <section className="quality-panel thesis-strategy-panel">
          <header><div><small>2025–2029 STRATEJİK PLANI</small><h2><BriefcaseBusiness size={20} /> Amaç ve hedefler</h2></div></header>
          <p className="thesis-strategy-intro">Tezlerin SKA dağılımı, üniversitenin beş stratejik amacıyla aynı canlı filtre kapsamı üzerinden ilişkilendirilir.</p>
          <div className="thesis-strategy-cards">{strategicGoals.map((goal, index) => <article key={goal.id} className={`strategy-tone-${index + 1}`}><h3>{goal.id} – {goal.title}</h3><p>{goal.description}</p><div>{goal.sdgs.map((sdg) => <button type="button" key={sdg} onClick={() => setFilters((value) => ({ ...value, sdg: String(sdg) }))}>SKA {sdg} – {data.sdgGoals.find((item) => item.id === String(sdg))?.title}</button>)}</div></article>)}</div>
        </section>

        <section className="quality-panel thesis-matrix-panel">
          <header><div><small>CANLI UYUM GÖRÜNÜMÜ</small><h2><Target size={20} /> SKA–Stratejik Plan Uyum Matrisi</h2></div></header>
          <p className="thesis-strategy-intro">Tez sayıları seçili yıl, tez türü ve ABD/ASD filtrelerine göre anlık görüntüden hesaplanır; amaç ve hedef bağlantıları 2025–2029 Stratejik Planı referans eşlemesidir.</p>
          <div className="quality-table-scroll"><table className="quality-table thesis-strategy-table"><thead><tr><th>SKA</th><th>Tez sayısı</th><th>Bağlantılı SP amacı</th><th>Bağlantılı SP hedefleri</th><th>Yorum</th></tr></thead><tbody>{strategicMatrix.map((row) => { const goal = data.sdgGoals.find((item) => item.id === String(row.sdg)); return <tr key={row.sdg}><td><button type="button" onClick={() => setFilters((value) => ({ ...value, sdg: String(row.sdg) }))}>SKA {row.sdg} – {goal?.title}</button></td><td><strong>{number(goal?.count || 0)}</strong></td><td>{row.goal}</td><td>{row.targets}</td><td>{row.note}</td></tr>; })}</tbody></table></div>
          <p className="quality-note">Bu matris istatistiksel bir izleme aracıdır. SKA eşleşmeleri tez başlığı, özet ve anahtar kelimelerdeki terimlere; stratejik plan bağlantıları ise tanımlı kurumsal amaç-hedef referanslarına dayanır.</p>
        </section>
      </>}
    </main>
  );
}
