"use client";

import { AlertTriangle, BarChart3, CalendarClock, GraduationCap, Layers3, RefreshCw, ShieldCheck, UserCheck, UserRoundX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";

type CountItem = { label: string; count: number | null; suppressed?: boolean };
type StudentStatusKey = "active" | "graduate" | "registration_deleted" | "max_duration" | "other_separation";
type StatusCountItem = CountItem & { key: StudentStatusKey };
type StatusYearItem = { year: string; statuses: StatusCountItem[] };
type LevelStatusItem = { level: string; statuses: StatusCountItem[] };
type DepartmentItem = { departmentId: string; department: string; count: number | null; suppressed: boolean; levels: CountItem[] };
type ProgramItem = { departmentId: string; department: string; programName: string; level: string; count: number | null; suppressed: boolean; years: CountItem[]; statuses: CountItem[] };
type GraduateProgramItem = {
  departmentId: string; department: string; programName: string; level: string;
  historical?: boolean;
  total: number | null; graduates: number | null; otherSeparations: number | null; suppressed: boolean;
  graduationYears: CountItem[]; separationReasons: CountItem[]; statusCounts?: StatusCountItem[]; statusYears?: StatusYearItem[]; levelStatusCounts?: LevelStatusItem[];
};
type GraduateDepartmentItem = {
  departmentId: string; department: string; total: number | null; graduates: number | null; otherSeparations: number | null; suppressed: boolean;
  levels: CountItem[]; graduationYears: CountItem[]; separationReasons: CountItem[];
  statusCounts?: StatusCountItem[]; statusYears?: StatusYearItem[]; levelStatusCounts?: LevelStatusItem[];
};
type GraduateSnapshot = {
  totalRecords: number; totalGraduates: number; totalOtherSeparations: number; ignoredSourceProgramCount?: number;
  levels: CountItem[]; graduationYears: CountItem[]; separationReasons: CountItem[];
  statusCounts?: StatusCountItem[]; statusYears?: StatusYearItem[]; levelStatusCounts?: LevelStatusItem[];
  departments: GraduateDepartmentItem[]; programs: GraduateProgramItem[];
  quality: { lastImportedAt?: string; unmatchedProgramCount?: number; missingDateCount?: number; facultyCodes?: CountItem[] };
};
type StudentSnapshot = {
  status?: string; message?: string; generatedAt: string; nextRefreshAt: string; privacyThreshold: number;
  graduateDataAvailable: boolean; graduateDataNote: string; schedule: string[];
  catalogSource?: string; catalogProgramCount?: number; ignoredSourceProgramCount?: number;
  institute: { totalStudents: number; levels: CountItem[]; registrationYears: CountItem[]; statuses: CountItem[] };
  departments: DepartmentItem[]; programs: ProgramItem[]; graduates?: GraduateSnapshot;
};
type UnifiedProgram = ProgramItem & { historical?: boolean; statusCounts: Record<StudentStatusKey, CountItem>; statusYears: StatusYearItem[]; separationReasons: CountItem[] };

const statusOrder: StudentStatusKey[] = ["active", "graduate", "registration_deleted", "max_duration", "other_separation"];
const chartStatusOrder: StudentStatusKey[] = ["active", "graduate"];
const statusLabels: Record<StudentStatusKey, string> = {
  active: "Aktif",
  graduate: "Mezun",
  registration_deleted: "Kayıt sildiren",
  max_duration: "Azami süreden kaydı silinen",
  other_separation: "Diğer ayrılan",
};

const isVisibleCount = (item: CountItem) => !item.suppressed && item.count != null && item.count > 0;
const showCount = (count: number | null, suppressed = false) => suppressed || count == null ? "" : count.toLocaleString("tr-TR");
const percent = (count: number | null, total: number) => count == null || !total ? 0 : Math.round(count / total * 1000) / 10;

function aggregateCounts(items: CountItem[]): CountItem {
  const suppressed = items.some((item) => item.suppressed || item.count == null);
  return { label: "Toplam", count: suppressed ? null : items.reduce((sum, item) => sum + (item.count || 0), 0), suppressed };
}

function groupCounts(items: CountItem[]) {
  const groups = new Map<string, CountItem[]>();
  for (const item of items) groups.set(item.label, [...(groups.get(item.label) || []), item]);
  return [...groups.entries()].map(([label, values]) => ({ ...aggregateCounts(values), label }));
}

function emptyCount(label: string): CountItem { return { label, count: 0, suppressed: false }; }
function programKey(program: { departmentId: string; programName: string; level: string }) { return `${program.departmentId}|${program.programName}|${program.level}`; }

function graduateStatus(program: GraduateProgramItem | undefined, key: StudentStatusKey): CountItem {
  const current = program?.statusCounts?.find((item) => item.key === key);
  if (current) return current;
  if (key === "graduate") return { label: statusLabels[key], count: program?.graduates || 0, suppressed: Boolean(program?.suppressed && program?.graduates == null) };
  if (key === "other_separation") return { label: statusLabels[key], count: program?.otherSeparations || 0, suppressed: Boolean(program?.suppressed && program?.otherSeparations == null) };
  return emptyCount(statusLabels[key]);
}

function mergePrograms(activePrograms: ProgramItem[], graduatePrograms: GraduateProgramItem[]): UnifiedProgram[] {
  const graduates = new Map(graduatePrograms.map((program) => [programKey(program), program]));
  const currentPrograms = activePrograms.map((program) => {
    const graduate = graduates.get(programKey(program));
    const statusCounts = Object.fromEntries(statusOrder.map((key) => [key, key === "active"
      ? { label: statusLabels.active, count: program.count, suppressed: program.suppressed }
      : graduateStatus(graduate, key)])) as Record<StudentStatusKey, CountItem>;
    return { ...program, historical: false, statusCounts, statusYears: graduate?.statusYears || [], separationReasons: graduate?.separationReasons || [] };
  });
  const currentKeys = new Set(activePrograms.map(programKey));
  const historicalPrograms = graduatePrograms
    .filter((program) => program.historical && !currentKeys.has(programKey(program)))
    .map((program): UnifiedProgram => ({
      departmentId: program.departmentId,
      department: program.department,
      programName: program.programName,
      level: program.level,
      count: 0,
      suppressed: false,
      years: [],
      statuses: [],
      historical: true,
      statusCounts: Object.fromEntries(statusOrder.map((key) => [key, key === "active" ? emptyCount(statusLabels.active) : graduateStatus(program, key)])) as Record<StudentStatusKey, CountItem>,
      statusYears: program.statusYears || [],
      separationReasons: program.separationReasons || [],
    }));
  return [...currentPrograms, ...historicalPrograms];
}

function aggregateStatus(programs: UnifiedProgram[], key: StudentStatusKey) { return aggregateCounts(programs.map((program) => program.statusCounts[key])); }
function yearsForStatus(programs: UnifiedProgram[], key: StudentStatusKey) {
  if (key === "active") return groupCounts(programs.flatMap((program) => program.years));
  return groupCounts(programs.flatMap((program) => program.statusYears.flatMap((year) => {
    const item = year.statuses.find((status) => status.key === key);
    return item ? [{ label: year.year, count: item.count, suppressed: item.suppressed }] : [];
  })));
}

function itemForStatus(items: StatusCountItem[] | undefined, key: StudentStatusKey) {
  const item = items?.find((candidate) => candidate.key === key);
  return item ? { label: item.label, count: item.count, suppressed: item.suppressed } : null;
}

function exactScopedStatus(snapshot: StudentSnapshot, departmentId: string, level: string, key: StudentStatusKey, fallback: CountItem): CountItem {
  if (key === "active") {
    const source = departmentId === "all"
      ? level === "all" ? { label: statusLabels.active, count: snapshot.institute.totalStudents, suppressed: false } : snapshot.institute.levels.find((item) => item.label === level)
      : level === "all" ? snapshot.departments.find((item) => item.departmentId === departmentId) : snapshot.departments.find((item) => item.departmentId === departmentId)?.levels.find((item) => item.label === level);
    return source ? { label: statusLabels.active, count: source.count, suppressed: source.suppressed } : fallback;
  }
  const graduateSource = departmentId === "all" ? snapshot.graduates : snapshot.graduates?.departments.find((item) => item.departmentId === departmentId);
  const items = level === "all" ? graduateSource?.statusCounts : graduateSource?.levelStatusCounts?.find((item) => item.level === level)?.statuses;
  return itemForStatus(items, key) || fallback;
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
        if (response.status === 202 || payload.status === "syncing") { poll = window.setTimeout(() => setRetry((value) => value + 1), 4_000); return null; }
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

  const allPrograms = useMemo(() => mergePrograms(snapshot?.programs || [], snapshot?.graduates?.programs || []), [snapshot]);
  const departments = useMemo(() => (snapshot?.departments || []).map((item) => ({ id: item.departmentId, name: item.department }))
    .sort((a, b) => a.name.localeCompare(b.name, "tr")), [snapshot]);
  const availableLevels = useMemo(() => [...new Set(allPrograms.filter((program) => departmentId === "all" || program.departmentId === departmentId).map((program) => program.level))].sort((a, b) => a.localeCompare(b, "tr")), [allPrograms, departmentId]);

  useEffect(() => { if (level !== "all" && !availableLevels.includes(level)) setLevel("all"); }, [availableLevels, level]);

  const programs = useMemo(() => allPrograms.filter((program) => (departmentId === "all" || program.departmentId === departmentId) && (level === "all" || program.level === level)), [allPrograms, departmentId, level]);
  const scopeStatuses = useMemo(() => Object.fromEntries(statusOrder.map((key) => {
    const fallback = aggregateStatus(programs, key);
    return [key, snapshot ? exactScopedStatus(snapshot, departmentId, level, key, fallback) : fallback];
  })) as Record<StudentStatusKey, CountItem>, [departmentId, level, programs, snapshot]);
  const scopeDepartmentCount = departmentId === "all" ? departments.length : departments.some((item) => item.id === departmentId) ? 1 : 0;
  const scopeLevels = useMemo(() => availableLevels.filter((item) => level === "all" || item === level).map((item) => ({ level: item, programs: programs.filter((program) => program.level === item) })), [availableLevels, level, programs]);
  const yearSeries = useMemo(() => chartStatusOrder
    .map((key) => ({ key, items: yearsForStatus(programs, key).filter((item) => item.label !== "Belirtilmemiş" && isVisibleCount(item)) }))
    .filter((series) => series.items.length > 0), [programs]);
  const programComparison = useMemo(() => programs
    .filter((program) => chartStatusOrder.some((key) => isVisibleCount(program.statusCounts[key])))
    .sort((left, right) => chartStatusOrder.reduce((sum, key) => sum + (right.statusCounts[key].count || 0) - (left.statusCounts[key].count || 0), 0))
    .slice(0, 10), [programs]);
  const separationReasons = useMemo(() => {
    const exact = departmentId === "all" && level === "all"
      ? snapshot?.graduates?.separationReasons
      : departmentId !== "all" && level === "all"
        ? snapshot?.graduates?.departments.find((item) => item.departmentId === departmentId)?.separationReasons
        : null;
    return (exact || groupCounts(programs.flatMap((program) => program.separationReasons)))
      .filter((item) => normalizedLabel(item.label) !== "mezun" && isVisibleCount(item))
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 10);
  }, [departmentId, level, programs, snapshot]);

  return <main className="dbp-page quality-page student-indicators-page">
    <PublicSiteHeader active="students" />
    <section className="quality-hero student-hero"><div><small>KVKK UYUMLU · TOPLULAŞTIRILMIŞ VERİ</small><h1>Lisansüstü Öğrenci Göstergeleri</h1><p>Aktif ve mezun öğrenci sayılarını ABD/ASD ve program düzeyinde kimlik verisi göstermeden karşılaştırın.</p></div><span><GraduationCap size={18}/>e-Enstitü öğrenci görüntüsü</span></section>
    {!snapshot && !error && <section className="quality-loading">Öğrenci göstergeleri son başarılı görüntüden hazırlanıyor…</section>}
    {error && <section className="quality-error"><AlertTriangle size={18}/><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15}/>Yeniden dene</button></section>}

    {snapshot && <div className="student-content">
      <section className="quality-scope student-filter-panel">
        <label><span>ABD / ASD</span><select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}><option value="all">Tüm ABD / ASD</option>{departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span>Program türü</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">Tüm program türleri</option>{availableLevels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div><span>Son veri yenileme</span><strong>{new Date(snapshot.generatedAt).toLocaleString("tr-TR")}</strong></div>
        <div><span>Sonraki otomatik yenileme</span><strong>{snapshot.nextRefreshAt ? new Date(snapshot.nextRefreshAt).toLocaleString("tr-TR") : "Plan kapalı"}</strong></div>
      </section>

      <section className="student-kpis">
        <article className="kpi-active"><UserCheck/><span>Aktif öğrenci</span><strong className={isVisibleCount(scopeStatuses.active) ? undefined : "pending-value"}>{isVisibleCount(scopeStatuses.active) ? showCount(scopeStatuses.active.count) : "Veri bekleniyor"}</strong><small>{isVisibleCount(scopeStatuses.active) ? "e-Enstitüde aktif öğrenci profili bulunan kayıtlar" : "Canlı e-Enstitü öğrenci verisi henüz yenilenmedi."}</small></article>
        <article className="kpi-graduate"><GraduationCap/><span>Mezun</span><strong className={isVisibleCount(scopeStatuses.graduate) ? undefined : "pending-value"}>{isVisibleCount(scopeStatuses.graduate) ? showCount(scopeStatuses.graduate.count) : "Veri bekleniyor"}</strong><small>{isVisibleCount(scopeStatuses.graduate) ? "OBS durumunda “Mezun Oldu” olarak sınıflananlar" : "OBS mezun verisi henüz yenilenmedi."}</small></article>
        <article className="kpi-department"><Layers3/><span>ABD / ASD</span><strong>{scopeDepartmentCount}</strong><small>Seçili kapsamdaki resmî akademik birim</small></article>
      </section>

      <section className="quality-panel student-section-panel">
        <header><div><small>SEÇİLİ KAPSAM</small><h2>Program türüne göre öğrenci sayıları</h2></div><BarChart3 size={20}/></header>
        <div className="status-legend">{chartStatusOrder.map((key) => <span key={key} className={`status-${key}`}><i/>{statusLabels[key]}</span>)}</div>
        <div className="level-status-grid">{scopeLevels.map((item) => <StatusDistribution key={item.level} label={item.level} values={Object.fromEntries(chartStatusOrder.map((key) => [key, snapshot ? exactScopedStatus(snapshot, departmentId, item.level, key, aggregateStatus(item.programs, key)) : aggregateStatus(item.programs, key)])) as Record<StudentStatusKey, CountItem>}/>).filter(Boolean)}</div>
      </section>

      {yearSeries.length > 0 && <section className="quality-panel student-section-panel year-section">
        <header><div><small>YIL BAZLI DAĞILIM</small><h2>Öğrenci durumlarının yıllara göre görünümü</h2></div><CalendarClock size={20}/></header>
        <div className="year-small-multiples">{yearSeries.map((series) => <YearStatusChart key={series.key} statusKey={series.key} items={series.items}/>)}</div>
      </section>}

      <section className="quality-panel student-section-panel program-status-section">
        <header><div><small>PROGRAM KARŞILAŞTIRMA</small><h2>Öğrenci sayısı en yüksek 10 program</h2></div><BarChart3 size={20}/></header>
        <div className="status-legend">{chartStatusOrder.map((key) => <span key={key} className={`status-${key}`}><i/>{statusLabels[key]}</span>)}</div>
        <div className="program-status-list">{programComparison.map((program) => <ProgramStatusBar key={programKey(program)} program={program}/>)}</div>
      </section>

      <section className="quality-panel student-section-panel separation-section">
        <header><div><small>AYRILMA NEDENLERİ</small><h2>İlişiği veya kaydı silinen öğrencilerin ayrılma nedenleri</h2></div><UserRoundX size={20}/></header>
        <p className="section-intro">OBS durum açıklamasına göre en sık görülen mezuniyet dışı ayrılma nedenleri gösterilir.</p>
        {separationReasons.length > 0
          ? <div className="reason-grid">{separationReasons.map((item, index) => <div key={item.label} className={`reason-item reason-color-${index % 5}`}><p><span>{item.label}</span><b>{showCount(item.count)}</b></p><i><span style={{ width: `${Math.max(3, percent(item.count, Math.max(...separationReasons.map((row) => row.count || 0), 1)))}%` }}/></i></div>)}</div>
          : <div className="reason-awaiting" role="status"><div><b>OBS ayrılma nedeni verisi bekleniyor</b><span>Veri yenilendiğinde nedenler çoktan aza doğru bu yatay çubuklarda gösterilecek.</span></div><div className="reason-preview" aria-hidden="true"><i><span/></i><i><span/></i><i><span/></i></div></div>}
      </section>

      <section className="student-notes"><ShieldCheck size={18}/><div><b>KVKK ve veri kapsamı</b><p>Programlar LEE_DBP’deki resmî katalogdan; toplulaştırılmış öğrenci durumları e-Enstitü ve OBS kaynaklarından alınır. Katalog dışında kalan kaynak adları yeni program olarak yayımlanmaz.</p><p>Kişi adı, öğrenci numarası, T.C. kimlik numarası ve tekil kayıt yayımlanmaz. Sayısal olarak açıklanamayacak kadar küçük gruplar ekranda gösterilmez.</p><p>{snapshot.graduateDataNote}</p></div></section>
      <footer className="quality-meta"><CalendarClock size={13}/> Takvim: {snapshot.schedule.join(" · ")}.</footer>
    </div>}
  </main>;
}

function StatusDistribution({ label, values: sourceValues }: { label: string; values: Record<StudentStatusKey, CountItem> }) {
  const values = chartStatusOrder.map((key) => ({ key, ...sourceValues[key] })).filter(isVisibleCount);
  if (values.length === 0) return null;
  const total = values.reduce((sum, item) => sum + (item.count || 0), 0);
  return <article className="level-status-card"><div className="level-status-title"><h3>{label}</h3></div><div className="stacked-status-bar">{values.map((item) => <span key={item.key} className={`status-${item.key}`} style={{ width: `${Math.max(2, percent(item.count, total))}%` }} title={`${statusLabels[item.key]}: ${showCount(item.count)}`}/>)}</div><div className="level-status-values">{values.map((item) => <span key={item.key} className={`status-${item.key}`}><b>{showCount(item.count)}</b><small>{statusLabels[item.key]}</small></span>)}</div></article>;
}

function YearStatusChart({ statusKey, items }: { statusKey: StudentStatusKey; items: CountItem[] }) {
  const visible = items.filter((item) => item.label !== "Belirtilmemiş" && isVisibleCount(item)).sort((a, b) => a.label.localeCompare(b.label));
  const max = Math.max(...visible.map((item) => item.count || 0), 1);
  const yearLabel = statusKey === "active" ? "Kayıt yılı" : statusKey === "graduate" ? "Mezuniyet yılı" : "Ayrılma yılı";
  return <article className={`year-status-card status-${statusKey}`}><div className="year-card-heading"><div><small>{yearLabel}</small><h3>{statusLabels[statusKey]}</h3></div></div><div className="year-bars">{visible.map((item) => <div key={item.label}><b>{showCount(item.count)}</b><span><i style={{ height: `${Math.max(8, percent(item.count, max))}%` }}/></span><small>{item.label}</small></div>)}</div></article>;
}

function ProgramStatusBar({ program }: { program: UnifiedProgram }) {
  const values = chartStatusOrder.map((key) => ({ key, ...program.statusCounts[key] })).filter(isVisibleCount);
  const total = values.reduce((sum, item) => sum + (item.count || 0), 0);
  return <article className="program-status-row"><div className="program-status-name"><b>{program.programName}{program.historical && <em>Kapatılmış program</em>}</b><span>{program.department} · {program.level}</span></div><div className="program-status-visual"><div className="stacked-status-bar">{values.map((item) => <span key={item.key} className={`status-${item.key}`} style={{ width: `${Math.max(2, percent(item.count, total))}%` }} title={`${statusLabels[item.key]}: ${showCount(item.count)}`}/>)}</div><div className="program-status-values">{values.map((item) => <span key={item.key} className={`status-${item.key}`}>{statusLabels[item.key]}: {showCount(item.count)}</span>)}</div></div></article>;
}

function normalizedLabel(value: string) {
  return value.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").trim();
}
