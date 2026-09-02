"use client";

import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Layers3,
  Scale,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type TitleLoad = {
  title: string;
  academics: number;
  assignedCourses: number;
  theory: number;
  practice: number;
  weeklyHours: number;
  ects: number;
};
type QualityWarning = {
  code: string;
  name: string;
  department: string;
  programName: string;
  level: string;
  status: string;
  issues: string[];
};
type SdgGoal = { id: string; title: string; count: number };
type QualityStats = {
  totalCourses: number;
  packagedCourses: number;
  completePackages: number;
  workloadConsistent: number;
  matrixComplete: number;
  weeklyPlanComplete: number;
  outcomesComplete: number;
  assessmentComplete: number;
  resourcesComplete: number;
  sdgCoverageCourses: number;
  sdgLinks: number;
  assignedCourses: number;
  processCourses: number;
  processResponsible: number;
  termCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  levelCounts: Record<string, number>;
  sdgGoals: SdgGoal[];
  titleLoads: TitleLoad[];
  warnings: QualityWarning[];
};
type ProgramSnapshot = {
  key: string;
  department: string;
  programName: string;
  level: string;
  label: string;
  stats: QualityStats;
};
type QualitySnapshot = {
  generatedAt: string;
  nextRefreshAt: string;
  source: "database_snapshot";
  instructorSource: string;
  schedule: string[];
  institute: QualityStats;
  programs: ProgramSnapshot[];
};

const ratio = (value: number, total: number) => total ? Math.round((value / total) * 1000) / 10 : 0;

export default function QualityIndicatorsPage() {
  const [snapshot, setSnapshot] = useState<QualitySnapshot | null>(null);
  const [selectedKey, setSelectedKey] = useState("institute");
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("timeout"), 12_000);
    setError("");
    fetch(dbpPath("/api/dbp/quality-stats"), { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Kalite göstergeleri veritabanından alınamadı.");
        return response.json() as Promise<QualitySnapshot>;
      })
      .then(setSnapshot)
      .catch((reason: unknown) => {
        if (controller.signal.reason === "timeout") {
          setError("Kalite göstergeleri zamanında yüklenemedi. Sunucu bağlantısını kontrol edip yeniden deneyin.");
        } else if (reason instanceof Error && reason.name !== "AbortError") {
          setError(reason.message);
        }
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [retryKey]);

  const selectedProgram = useMemo(
    () => snapshot?.programs.find((program) => program.key === selectedKey),
    [selectedKey, snapshot],
  );
  const stats = selectedProgram?.stats ?? snapshot?.institute;
  const isInstitute = !selectedProgram;

  return (
    <main className="dbp-page quality-page">
      <PublicSiteHeader active="quality" />
      <section className="quality-hero">
        <div>
          <small>YÖKAK · BİDR · PROGRAM AKREDİTASYONU · SKA</small>
          <h1>Ders Bilgi Paketi Kalite Göstergeleri</h1>
          <p>Enstitü geneli ile ABD/ASD ve program düzeylerini aynı kanıt seti üzerinden karşılaştırın.</p>
        </div>
        <span><BarChart3 size={18} />Canlı LEE_DBP anlık görüntüsü</span>
      </section>

      {snapshot && (
        <section className="quality-scope quality-scope-selector">
          <label>
            <span>Rapor kapsamı</span>
            <select value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)}>
              <option value="institute">Lisansüstü Eğitim Enstitüsü · Tüm programlar</option>
              {snapshot.programs.map((program) => <option key={program.key} value={program.key}>{program.label}</option>)}
            </select>
          </label>
          <div><span>Görünüm</span><strong>{isInstitute ? "Enstitü geneli" : `${selectedProgram.department} / ${selectedProgram.level}`}</strong></div>
          <div><span>Son veri yenileme</span><strong>{new Date(snapshot.generatedAt).toLocaleString("tr-TR")}</strong></div>
          <div><span>Sonraki otomatik yenileme</span><strong>{new Date(snapshot.nextRefreshAt).toLocaleString("tr-TR")}</strong></div>
        </section>
      )}

      {!snapshot && !error && <section className="quality-loading">Kalite ve SKA göstergeleri hazırlanıyor…</section>}
      {error && <section className="quality-error"><AlertTriangle size={18} /><span>{error}</span><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Yeniden dene</button></section>}
      {snapshot && stats && <>
        <section className="quality-context-banner">
          <div><Layers3 size={18} /><span>{isInstitute ? "Tüm programlar" : selectedProgram.programName}</span></div>
          <p>{stats.totalCourses.toLocaleString("tr-TR")} ders · {stats.packagedCourses.toLocaleString("tr-TR")} bilgi paketi · {stats.sdgLinks.toLocaleString("tr-TR")} SKA ilişkisi</p>
        </section>

        <section className="quality-kpis quality-kpis-six">
          <Kpi icon={<BookOpenCheck />} label="Paket tamamlama" percent={ratio(stats.completePackages, stats.totalCourses)} detail={`${stats.completePackages}/${stats.totalCourses} ders`} tone={1} />
          <Kpi icon={<Scale />} label="AKTS–iş yükü" percent={ratio(stats.workloadConsistent, stats.packagedCourses)} detail={`${stats.workloadConsistent}/${stats.packagedCourses} paket`} tone={3} />
          <Kpi icon={<CheckCircle2 />} label="DÖÇ–PÇ matrisi" percent={ratio(stats.matrixComplete, stats.packagedCourses)} detail={`${stats.matrixComplete}/${stats.packagedCourses} paket`} tone={5} />
          <Kpi icon={<CalendarDays />} label="15 haftalık plan" percent={ratio(stats.weeklyPlanComplete, stats.packagedCourses)} detail={`${stats.weeklyPlanComplete}/${stats.packagedCourses} paket`} tone={2} />
          <Kpi icon={<ShieldCheck />} label="Ölçme–değerlendirme" percent={ratio(stats.assessmentComplete, stats.packagedCourses)} detail={`${stats.assessmentComplete}/${stats.packagedCourses} paket`} tone={4} />
          <Kpi icon={<Target />} label="SKA kapsamı" percent={ratio(stats.sdgCoverageCourses, stats.packagedCourses)} detail={`${stats.sdgCoverageCourses}/${stats.packagedCourses} paket`} tone={1} />
        </section>

        <section className="quality-grid quality-overview-grid">
          <article className="quality-panel">
            <header><div><small>DERS YAPISI</small><h2>Dönem, düzey ve ders türü dağılımı</h2></div><CalendarDays size={20} /></header>
            <div className="donut-trio">
              <DonutChart title="Dönem" values={stats.termCounts} total={stats.totalCourses} />
              <DonutChart title="Program düzeyi" values={stats.levelCounts} total={stats.totalCourses} />
              <DonutChart title="Ders türü" values={stats.typeCounts} total={stats.totalCourses} />
            </div>
          </article>
          <article className="quality-panel">
            <header><div><small>SÜREÇ DERSLERİ</small><h2>Danışman ve sorumlu tanımları</h2></div><Users size={20} /></header>
            <div className="process-radial" style={{ "--progress": `${ratio(stats.processResponsible, stats.processCourses)}%` } as CSSProperties}><div><strong>%{ratio(stats.processResponsible, stats.processCourses)}</strong><span>{stats.processResponsible}/{stats.processCourses} süreç dersi</span></div></div>
            <p><b>{stats.processCourses}</b> ortak / süreç dersi içinde sorumluluk tanımı</p>
            <small>Danışmanlık, uzmanlık alanı, seminer, yeterlik, tez ve bitirme projesi kayıtları akademik derslerden ayrı izlenir.</small>
          </article>
        </section>

        <section className="quality-panel evidence-panel">
          <header><div><small>YÖKAK KANIT SETİ</small><h2>Ders bilgi paketi içerik bütünlüğü</h2></div><ShieldCheck size={20} /></header>
          <div className="evidence-bars">
            <EvidenceBar label="Ders amacı, içerik, yöntem ve kaynaklar" value={stats.completePackages} total={stats.totalCourses} tone={1} />
            <EvidenceBar label="Ölçülebilir ders öğrenme çıktıları" value={stats.outcomesComplete} total={stats.packagedCourses} tone={2} />
            <EvidenceBar label="15 haftalık konu planı" value={stats.weeklyPlanComplete} total={stats.packagedCourses} tone={3} />
            <EvidenceBar label="AKTS–iş yükü (30 saat/AKTS)" value={stats.workloadConsistent} total={stats.packagedCourses} tone={4} />
            <EvidenceBar label="DÖÇ–PÇ katkı matrisi (1–5)" value={stats.matrixComplete} total={stats.packagedCourses} tone={5} />
            <EvidenceBar label="Kaynakça ve öğrenme materyali" value={stats.resourcesComplete} total={stats.packagedCourses} tone={1} />
          </div>
        </section>

        <section className="quality-panel sdg-panel">
          <header><div><small>SÜRDÜRÜLEBİLİR KALKINMA AMAÇLARI</small><h2>SKA kapsam ve yoğunluk analizi</h2></div><span>{stats.sdgLinks} ders–SKA ilişkisi</span></header>
          <div className="sdg-overview">
            <SdgCoverage goals={stats.sdgGoals} coveredCourses={stats.sdgCoverageCourses} totalCourses={stats.packagedCourses} />
            <SdgBars goals={stats.sdgGoals} />
          </div>
          <div className="sdg-goal-grid">
            {stats.sdgGoals.map((goal, index) => (
              <article key={goal.id} className={`tone-${(index % 5) + 1}`}>
                <img src={dbpPath(`/sdg/sdg_${goal.id}.png`)} alt={`SKA ${goal.id}`} />
                <div><b>SKA {goal.id}</b><span>{goal.title}</span></div>
                <strong>{goal.count}</strong>
              </article>
            ))}
          </div>
          <p className="quality-note">Analiz, ders paketlerinde kayıtlı SKA ilişkilerini sayar; içerikten otomatik veya tahmine dayalı SKA üretmez.</p>
        </section>

        {isInstitute && <section className="quality-panel instructor-panel">
          <header><div><small>KVKK UYUMLU GENEL DERS YÜKÜ</small><h2>Akademik unvana göre ders ve haftalık saat dağılımı</h2></div><span>{stats.titleLoads.reduce((sum, row) => sum + row.academics, 0)} akademisyen</span></header>
          <TitleLoadChart values={stats.titleLoads} />
          <div className="quality-table-scroll"><table className="quality-table"><thead><tr><th>Akademik unvan</th><th>Akademisyen</th><th>Ders görevlendirmesi</th><th>Teorik saat</th><th>Uygulama</th><th>Toplam haftalık saat</th></tr></thead><tbody>{stats.titleLoads.map((item) => <tr key={item.title}><td>{item.title}</td><td>{item.academics}</td><td>{item.assignedCourses}</td><td>{item.theory}</td><td>{item.practice}</td><td><b>{item.weeklyHours}</b></td></tr>)}</tbody></table></div>
          <p className="quality-note">Kişi adı, e-posta veya özlük verisi gösterilmez. Akademisyen sayısı mevcut akademisyen kaynağından; ders ve saatler LEE_DBP görevlendirmelerinden unvan bazında gruplanır.</p>
        </section>}

        <section className="quality-panel warning-panel">
          <header><div><small>İYİLEŞTİRME GÜNDEMİ</small><h2>Öncelikli incelenecek dersler</h2></div><span className={stats.warnings.length ? "warning-count" : "success-count"}>{stats.warnings.length}</span></header>
          {stats.warnings.length ? <div className="warning-list">{stats.warnings.map((item) => <article key={`${item.department}-${item.programName}-${item.level}-${item.code}`}><b>{item.code}</b><span>{item.name}</span><small>{item.department} · {item.programName} · {item.level}{item.status ? ` · ${item.status}` : ""}</small><p>{item.issues.join(" · ")}</p></article>)}</div> : <div className="quality-success"><CheckCircle2 size={20} />Tanımlı kalite kontrollerinde eksik kayıt bulunmadı.</div>}
        </section>
        <footer className="quality-meta"><CalendarClock size={13} /> Son hesaplama: {new Date(snapshot.generatedAt).toLocaleString("tr-TR")} · Takvim: {snapshot.schedule.join(" ve ")} · Admin istediği zaman yenileyebilir.</footer>
      </>}
    </main>
  );
}

function Kpi({ icon, label, percent, detail, tone }: { icon: ReactNode; label: string; percent: number; detail: string; tone: number }) {
  return <article><div className={`kpi-radial tone-${tone}`} style={{ "--progress": `${percent}%` } as CSSProperties}><span className="kpi-icon">{icon}</span></div><div><small>{label}</small><strong>%{percent}</strong><p>{detail}</p></div></article>;
}

function DonutChart({ title, values, total }: { title: string; values: Record<string, number>; total: number }) {
  const entries = Object.entries(values).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  let cursor = 0;
  const stops = entries.map(([, value], index) => { const start = cursor; cursor += ratio(value, total); return `var(--chart-${(index % 5) + 1}) ${start}% ${cursor}%`; }).join(", ");
  return <figure className="donut-chart"><figcaption>{title}</figcaption><div className="donut-visual" style={{ background: `conic-gradient(${stops || "var(--muted) 0 100%"})` }} role="img" aria-label={`${title} dağılımı, toplam ${total} ders`}><span><b>{total}</b><small>ders</small></span></div><ul>{entries.slice(0, 5).map(([label, value], index) => <li key={label}><i className={`tone-${(index % 5) + 1}`} /><span>{label}</span><b>{value}</b><small>%{ratio(value, total)}</small></li>)}</ul></figure>;
}

function EvidenceBar({ label, value, total, tone }: { label: string; value: number; total: number; tone: number }) {
  const percent = ratio(value, total);
  return <article className={`tone-${tone}`}><div><span>{label}</span><b>{value}/{total}</b><strong>%{percent}</strong></div><div className="evidence-track"><i style={{ width: `${percent}%` }} /></div></article>;
}

function SdgCoverage({ goals, coveredCourses, totalCourses }: { goals: SdgGoal[]; coveredCourses: number; totalCourses: number }) {
  const active = goals.filter((goal) => goal.count > 0).length;
  const progress = ratio(active, goals.length);
  return <article className="sdg-coverage-card"><div className="sdg-radial" style={{ "--progress": `${progress}%` } as CSSProperties}><span><b>{active}/17</b><small>aktif SKA</small></span></div><div><small>DERS PAKETİ SKA KAPSAMI</small><strong>%{ratio(coveredCourses, totalCourses)}</strong><p>{coveredCourses}/{totalCourses} bilgi paketi en az bir SKA ile ilişkilendirilmiş.</p></div></article>;
}

function SdgBars({ goals }: { goals: SdgGoal[] }) {
  const sorted = [...goals].sort((a, b) => b.count - a.count || Number(a.id) - Number(b.id));
  const maximum = Math.max(...sorted.map((goal) => goal.count), 1);
  return <figure className="sdg-bars"><figcaption>SKA yoğunluğu · ilk 8</figcaption>{sorted.slice(0, 8).map((goal, index) => <article key={goal.id} className={`tone-${(index % 5) + 1}`}><span>SKA {goal.id}</span><div><i style={{ width: `${(goal.count / maximum) * 100}%` }} /></div><b>{goal.count}</b></article>)}</figure>;
}

function TitleLoadChart({ values }: { values: TitleLoad[] }) {
  const maximum = Math.max(...values.map((item) => item.weeklyHours), 1);
  return <figure className="load-chart title-load-chart"><figcaption>Unvan gruplarının toplam haftalık ders saati</figcaption><div>{values.map((item, index) => <article key={item.title}><span>{item.title}</span><div className="lollipop-track"><i className={`tone-${(index % 5) + 1}`} style={{ width: `${(item.weeklyHours / maximum) * 100}%` }}><b>{item.weeklyHours}</b></i></div><small>{item.assignedCourses} ders</small></article>)}</div></figure>;
}
