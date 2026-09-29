"use client";

import { AlertTriangle, BarChart3, CalendarClock, GraduationCap, Layers3, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type CountItem = { label: string; count: number | null; suppressed?: boolean };
type DepartmentItem = { departmentId: string; department: string; count: number | null; suppressed: boolean; levels: CountItem[] };
type ProgramItem = { departmentId: string; department: string; programName: string; level: string; count: number | null; suppressed: boolean; years: CountItem[]; statuses: CountItem[] };
type StudentSnapshot = {
  status?: string; message?: string; generatedAt: string; nextRefreshAt: string; privacyThreshold: number;
  graduateDataAvailable: boolean; graduateDataNote: string; schedule: string[];
  catalogSource?: string; catalogProgramCount?: number; ignoredSourceProgramCount?: number;
  institute: { totalStudents: number; levels: CountItem[]; registrationYears: CountItem[]; statuses: CountItem[] };
  departments: DepartmentItem[]; programs: ProgramItem[];
};

const showCount = (count: number | null, suppressed = false) => suppressed || count == null ? "<5" : count.toLocaleString("tr-TR");
const percent = (count: number | null, total: number) => count == null || !total ? 0 : Math.round(count / total * 1000) / 10;

function aggregateCounts(items: CountItem[]): CountItem {
  const suppressed = items.some((item) => item.suppressed || item.count == null);
  return {
    label: "Toplam",
    count: suppressed ? null : items.reduce((sum, item) => sum + (item.count || 0), 0),
    suppressed,
  };
}

function groupCounts(items: CountItem[]) {
  const groups = new Map<string, CountItem[]>();
  for (const item of items) groups.set(item.label, [...(groups.get(item.label) || []), item]);
  return [...groups.entries()].map(([label, values]) => ({ ...aggregateCounts(values), label }));
}

export default function StudentIndicatorsPage() {
  const [snapshot, setSnapshot] = useState<StudentSnapshot | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [departmentId, setDepartmentId] = useState("all");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("timeout"), 12_000);
    let poll: number | undefined;
    fetch(dbpPath("/api/dbp/student-statistics"), { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        setError("");
        const payload = await response.json() as StudentSnapshot;
        if (response.status === 202 || payload.status === "syncing") {
          poll = window.setTimeout(() => setRetry((value) => value + 1), 4_000);
          return null;
        }
        if (!response.ok) throw new Error(payload.message || "Öğrenci göstergeleri alınamadı.");
        return payload;
      })
      .then((payload) => { if (payload) setSnapshot(payload); })
      .catch((reason: unknown) => {
        if (controller.signal.reason === "timeout") setError("Öğrenci göstergeleri zamanında yüklenemedi.");
        else if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); if (poll) window.clearTimeout(poll); controller.abort(); };
  }, [retry]);

  const programs = useMemo(() => (snapshot?.programs || []).filter((program) =>
    (departmentId === "all" || program.departmentId === departmentId) && (level === "all" || program.level === level)
  ), [departmentId, level, snapshot]);
  const departments = snapshot?.departments || [];
  const levels = [...new Set((snapshot?.programs || []).map((program) => program.level))].sort((a, b) => a.localeCompare(b, "tr"));
  const isInstituteScope = departmentId === "all" && level === "all";
  const scopeCount = useMemo(() => isInstituteScope && snapshot
    ? { label: "Toplam", count: snapshot.institute.totalStudents, suppressed: false }
    : aggregateCounts(programs.map((program) => ({ label: program.programName, count: program.count, suppressed: program.suppressed }))),
  [isInstituteScope, programs, snapshot]);
  const scopeLevels = useMemo(() => isInstituteScope && snapshot
    ? snapshot.institute.levels
    : groupCounts(programs.map((program) => ({ label: program.level, count: program.count, suppressed: program.suppressed }))),
  [isInstituteScope, programs, snapshot]);
  const scopeYears = useMemo(() => isInstituteScope && snapshot
    ? snapshot.institute.registrationYears
    : groupCounts(programs.flatMap((program) => program.years)),
  [isInstituteScope, programs, snapshot]);
  const scopeDepartmentCount = new Set(programs.map((program) => program.departmentId)).size;
  const numericScopeTotal = scopeCount.count || 0;

  return <main className="dbp-page quality-page student-indicators-page">
    <PublicSiteHeader active="students" />
    <section className="quality-hero student-hero"><div><small>KVKK UYUMLU · TOPLULAŞTIRILMIŞ VERİ</small><h1>Lisansüstü Öğrenci Göstergeleri</h1><p>Enstitü, ABD/ASD ve program düzeyinde öğrenci dağılımlarını kimlik verisi göstermeden karşılaştırın.</p></div><span><GraduationCap size={18}/>e-Enstitü öğrenci görüntüsü</span></section>

    {!snapshot && !error && <section className="quality-loading">Öğrenci göstergeleri son başarılı görüntüden hazırlanıyor…</section>}
    {error && <section className="quality-error"><AlertTriangle size={18}/><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15}/>Yeniden dene</button></section>}

    {snapshot && <>
      <section className="quality-scope student-filter-panel">
        <label><span>ABD / ASD</span><select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}><option value="all">Tüm ABD / ASD</option>{departments.map((item) => <option key={item.departmentId} value={item.departmentId}>{item.department}</option>)}</select></label>
        <label><span>Program türü</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">Tüm program türleri</option>{levels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div><span>Son veri yenileme</span><strong>{new Date(snapshot.generatedAt).toLocaleString("tr-TR")}</strong></div>
        <div><span>Sonraki otomatik yenileme</span><strong>{snapshot.nextRefreshAt ? new Date(snapshot.nextRefreshAt).toLocaleString("tr-TR") : "Plan kapalı"}</strong></div>
      </section>

      <section className="student-kpis">
        <article><UsersRound/><span>Toplam öğrenci</span><strong>{showCount(scopeCount.count, scopeCount.suppressed)}</strong><small>Seçili kapsamdaki aktif öğrenci profilleri</small></article>
        <article><Layers3/><span>ABD / ASD</span><strong>{scopeDepartmentCount}</strong><small>Seçili kapsamdaki akademik birim</small></article>
        <article><GraduationCap/><span>Program</span><strong>{programs.length}</strong><small>Seçili kapsamdaki resmî lisansüstü program</small></article>
        <article><ShieldCheck/><span>Gizlilik eşiği</span><strong>{snapshot.privacyThreshold}</strong><small>1–4 kişilik gruplar “&lt;5” gösterilir</small></article>
      </section>

      <section className="student-overview-grid">
        <article className="quality-panel student-level-panel"><header><div><small>SEÇİLİ KAPSAM</small><h2>Program türüne göre öğrenci dağılımı</h2></div><BarChart3 size={20}/></header><div className="student-bars">{[...scopeLevels].sort((a, b) => (b.count || 0) - (a.count || 0)).map((item) => <div key={item.label}><p><span>{item.label}</span><b>{showCount(item.count, item.suppressed)} {numericScopeTotal > 0 && item.count != null && <small>%{percent(item.count, numericScopeTotal)}</small>}</b></p><i><span style={{ width: `${item.suppressed ? 8 : percent(item.count, numericScopeTotal)}%` }}/></i></div>)}</div></article>
        <article className="quality-panel student-year-panel"><header><div><small>SEÇİLİ KAPSAM · KAYIT YILI</small><h2>Öğrenci kayıt yılı dağılımı</h2></div><CalendarClock size={20}/></header><div className="student-year-chart">{scopeYears.filter((item) => item.label !== "Belirtilmemiş").sort((a, b) => a.label.localeCompare(b.label)).map((item) => <div key={item.label}><span style={{ height: `${item.suppressed ? 8 : Math.max(8, percent(item.count, Math.max(...scopeYears.map((row) => row.count || 0), 1)))}%` }}/><b>{showCount(item.count, item.suppressed)}</b><small>{item.label}</small></div>)}</div></article>
      </section>

      <section className="student-notes"><ShieldCheck size={18}/><div><b>KVKK ve veri kapsamı</b><p>Program ve program türleri LEE_DBP veritabanındaki resmî program kataloğundan; öğrenci sayıları canlı e-Enstitü kaynağından alınır. Katalogda bulunmayan kaynak adları yeni bir program olarak yayımlanmaz.</p><p>Kişi adı, öğrenci numarası, T.C. kimlik numarası ve tekil kayıt yayımlanmaz. {snapshot.privacyThreshold} kişiden küçük program grupları sayısal olarak açıklanmaz.</p><p>{snapshot.graduateDataNote}</p></div></section>
      <footer className="quality-meta"><CalendarClock size={13}/> Takvim: {snapshot.schedule.join(" · ")}.</footer>
    </>}
  </main>;
}
