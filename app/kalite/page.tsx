"use client";

import { AlertTriangle, BarChart3, BookOpenCheck, CalendarDays, CheckCircle2, Scale, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type InstructorLoad = { instructor: string; courses: number; theory: number; practice: number; ects: number };
type QualityWarning = { code: string; name: string; issues: string[] };
type QualityStats = {
  totalCourses: number;
  packagedCourses: number;
  completePackages: number;
  workloadConsistent: number;
  matrixComplete: number;
  assignedCourses: number;
  processCourses: number;
  processResponsible: number;
  termCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  instructorLoads: InstructorLoad[];
  warnings: QualityWarning[];
  generatedAt: string;
  source: "database";
};

const ratio = (value: number, total: number) => total ? Math.round((value / total) * 1000) / 10 : 0;

export default function QualityIndicatorsPage() {
  const [stats, setStats] = useState<QualityStats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/quality-stats"), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Kalite göstergeleri veritabanından alınamadı.");
        return response.json() as Promise<QualityStats>;
      })
      .then(setStats)
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="dbp-page quality-page">
      <PublicSiteHeader active="quality" />
      <section className="quality-hero">
        <div>
          <small>YÖKAK · BİDR · PROGRAM AKREDİTASYONU İÇİN KANIT ODAKLI İZLEME</small>
          <h1>Ders Bilgi Paketi Kalite Göstergeleri</h1>
          <p>Dersler, öğretim elemanı yükleri ve bilgi paketi içeriklerinin ölçülebilir kalite görünümü.</p>
        </div>
        <span><BarChart3 size={18} />Veri kaynağı: LEE_DBP</span>
      </section>

      <section className="quality-scope">
        <div><span>Pilot program</span><strong>Yönetim Bilişim Sistemleri ABD</strong></div>
        <div><span>Program düzeyi</span><strong>Doktora</strong></div>
        <div><span>Akademik yıl</span><strong>2026–2027</strong></div>
        <div><span>Kaynak</span><strong>Canlı veritabanı</strong></div>
      </section>

      {!stats && !error && <section className="quality-loading">Kalite göstergeleri hazırlanıyor…</section>}
      {error && <section className="quality-error"><AlertTriangle size={18} />{error}</section>}
      {stats && <>
        <section className="quality-kpis">
          <Kpi icon={<BookOpenCheck />} label="Paket tamamlama" percent={ratio(stats.completePackages, stats.totalCourses)} detail={`${stats.completePackages}/${stats.totalCourses} ders`} tone={1} />
          <Kpi icon={<Scale />} label="AKTS–iş yükü tutarlılığı" percent={ratio(stats.workloadConsistent, stats.packagedCourses)} detail={`${stats.workloadConsistent}/${stats.packagedCourses} bilgi paketi`} tone={3} />
          <Kpi icon={<CheckCircle2 />} label="DÖÇ–PÇ matris tamlığı" percent={ratio(stats.matrixComplete, stats.packagedCourses)} detail={`${stats.matrixComplete}/${stats.packagedCourses} paket · 1–5 ölçeği`} tone={5} />
          <Kpi icon={<Users />} label="Sorumlu atama oranı" percent={ratio(stats.assignedCourses, stats.totalCourses)} detail={`${stats.assignedCourses}/${stats.totalCourses} kayıt`} tone={4} />
        </section>

        <section className="quality-grid">
          <article className="quality-panel">
            <header><div><small>DERS YAPISI</small><h2>Dönem ve ders türü dağılımı</h2></div><CalendarDays size={20} /></header>
            <div className="donut-pair"><DonutChart title="Dönem" values={stats.termCounts} total={stats.totalCourses} /><DonutChart title="Ders türü" values={stats.typeCounts} total={stats.totalCourses} /></div>
          </article>
          <article className="quality-panel">
            <header><div><small>SÜREÇ DERSLERİ</small><h2>Danışman ve sorumlu tanımları</h2></div><Users size={20} /></header>
            <div className="process-radial" style={{ "--progress": `${ratio(stats.processResponsible, stats.processCourses)}%` } as CSSProperties}><div><strong>%{ratio(stats.processResponsible, stats.processCourses)}</strong><span>{stats.processResponsible}/{stats.processCourses} süreç dersi</span></div></div>
            <p><b>{stats.processCourses}</b> ortak / süreç dersi içinde sorumluluk tanımı</p>
            <small>Danışmanlık, uzmanlık alanı, seminer, yeterlik ve tez süreçleri akademik derslerden ayrı izlenir.</small>
          </article>
        </section>

        <section className="quality-panel instructor-panel">
          <header><div><small>ÖĞRETİM ELEMANI DERS YÜKÜ</small><h2>Ders ve haftalık saat dağılımı</h2></div><span>{stats.instructorLoads.length} öğretim elemanı</span></header>
          <LoadChart values={stats.instructorLoads} />
          <div className="quality-table-scroll"><table className="quality-table"><thead><tr><th>Öğretim elemanı</th><th>Ders kaydı</th><th>Teorik saat</th><th>Uygulama</th><th>Toplam saat</th><th>AKTS sorumluluğu</th></tr></thead><tbody>{stats.instructorLoads.map((item) => <tr key={item.instructor}><td>{item.instructor}</td><td>{item.courses}</td><td>{item.theory}</td><td>{item.practice}</td><td><b>{item.theory + item.practice}</b></td><td>{item.ects}</td></tr>)}</tbody></table></div>
          <p className="quality-note">Bu tablo öğrenci, başvuru veya personel özlük verisi içermez; yalnız LEE_DBP ders görevlendirme kayıtlarından hesaplanır.</p>
        </section>

        <section className="quality-panel warning-panel">
          <header><div><small>KONTROL LİSTESİ</small><h2>İncelenmesi gereken dersler</h2></div><span className={stats.warnings.length ? "warning-count" : "success-count"}>{stats.warnings.length}</span></header>
          {stats.warnings.length ? <div className="warning-list">{stats.warnings.map((item) => <article key={`${item.code}-${item.name}`}><b>{item.code}</b><span>{item.name}</span><p>{item.issues.join(" · ")}</p></article>)}</div> : <div className="quality-success"><CheckCircle2 size={20} />Tanımlı kalite kontrollerinde eksik kayıt bulunmadı.</div>}
        </section>
        <footer className="quality-meta">Son hesaplama: {new Date(stats.generatedAt).toLocaleString("tr-TR")} · Göstergeler veritabanından canlı hesaplanmıştır.</footer>
      </>}
    </main>
  );
}

function Kpi({ icon, label, percent, detail, tone }: { icon: ReactNode; label: string; percent: number; detail: string; tone: number }) {
  return <article><div className={`kpi-radial tone-${tone}`} style={{ "--progress": `${percent}%` } as CSSProperties}><span className="kpi-icon">{icon}</span></div><div><small>{label}</small><strong>%{percent}</strong><p>{detail}</p></div></article>;
}

function DonutChart({ title, values, total }: { title: string; values: Record<string, number>; total: number }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]);
  let cursor = 0;
  const stops = entries.map(([, value], index) => {
    const start = cursor;
    cursor += ratio(value, total);
    return `var(--chart-${(index % 5) + 1}) ${start}% ${cursor}%`;
  }).join(", ");
  return <figure className="donut-chart"><figcaption>{title}</figcaption><div className="donut-visual" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label={`${title} dağılımı, toplam ${total} ders`}><span><b>{total}</b><small>ders</small></span></div><ul>{entries.map(([label, value], index) => <li key={label}><i className={`chart-color tone-${(index % 5) + 1}`} /><span>{label}</span><b>{value}</b><small>%{ratio(value, total)}</small></li>)}</ul></figure>;
}

function LoadChart({ values }: { values: InstructorLoad[] }) {
  const top = values.slice(0, 10);
  const maximum = Math.max(...top.map((item) => item.theory + item.practice), 1);
  return <figure className="load-chart"><figcaption>En yüksek haftalık ders saatleri</figcaption><div>{top.map((item, index) => { const hours = item.theory + item.practice; return <article key={item.instructor}><span>{item.instructor}</span><div className="lollipop-track"><i className={`tone-${(index % 5) + 1}`} style={{ width: `${(hours / maximum) * 100}%` }}><b>{hours}</b></i></div><small>{item.courses} ders</small></article>; })}</div></figure>;
}
