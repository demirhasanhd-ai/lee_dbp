"use client";

import { ArrowLeft, BookOpen, Check, ExternalLink, Link2, LoaderCircle, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";
import type { ObsCandidate, ObsDraft, ObsImportSource, ObsProgram, ObsSearchJob } from "./obsCourseTypes";

type Props = {
  course: { code: string; name: string; level: string; department?: string; programName?: string };
  session: { username: string; name: string; role: string };
  onClose: () => void;
  onApply: (draft: ObsDraft, mode: "empty" | "overwrite", source: ObsImportSource) => void;
};

const educationLevel = (level: string) => /doktor/i.test(level) ? "dok" : /yüksek|tezli|tezsiz/i.test(level) ? "yls" : "lis";
const errorText = (error: unknown) => error instanceof Error ? error.message : "ÖBS bilgisi alınamadı.";

async function readResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `ÖBS isteği tamamlanamadı (${response.status}).`);
  return data;
}

function PreviewSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="obs-preview-section"><h3>{title}</h3>{children}</section>;
}

function PreviewText({ value }: { value?: string }) {
  return <p className={value?.trim() ? "obs-preview-text" : "obs-preview-empty"}>{value?.trim() || "ÖBS’de bu alan doldurulmamış."}</p>;
}

export function ObsCourseImport({ course, session, onClose, onApply }: Props) {
  const [tab, setTab] = useState<"search" | "link">("search");
  const [level, setLevel] = useState(educationLevel(course.level));
  const [programs, setPrograms] = useState<ObsProgram[]>([]);
  const [programId, setProgramId] = useState("");
  const [programLoading, setProgramLoading] = useState(true);
  const [programError, setProgramError] = useState("");
  const [programRetry, setProgramRetry] = useState(0);
  const [code, setCode] = useState(course.code);
  const [name, setName] = useState(course.name);
  const [url, setUrl] = useState("");
  const [job, setJob] = useState<ObsSearchJob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ObsDraft | null>(null);
  const [candidate, setCandidate] = useState<ObsCandidate | null>(null);
  const [includeMatrix, setIncludeMatrix] = useState(false);
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const alive = useRef(true);
  const activeJob = useRef("");
  const action = useRef<AbortController | null>(null);
  const sessionValue = dbpSessionHeader(session);

  useLayoutEffect(() => {
    const scroll = dialogRef.current?.querySelector(".obs-browser-scroll");
    if (scroll) scroll.scrollTop = 0;
  }, [draft, tab]);

  useEffect(() => {
    alive.current = true;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const siblings = [...document.body.children].filter((element): element is HTMLElement => element instanceof HTMLElement && !element.contains(dialogRef.current));
    const inertStates = siblings.map((element) => element.inert);
    siblings.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const elements = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]') || [])].filter((element) => element.getClientRects().length);
      const first = elements[0]; const last = elements.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      alive.current = false;
      document.body.style.overflow = overflow;
      siblings.forEach((element, index) => { element.inert = inertStates[index]; });
      document.removeEventListener("keydown", keydown);
      action.current?.abort();
      if (activeJob.current) void fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${activeJob.current}`, { method: "DELETE", headers: { "X-DBP-Session": sessionValue }, keepalive: true }).catch(() => {});
      previous?.focus();
    };
  }, [onClose, sessionValue]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ educationLevel: level, programName: course.programName || "", department: course.department || "", level: course.level });
    fetch(`${dbpPath("/api/dbp/obs-programs")}?${query}`, { headers: { "X-DBP-Session": sessionValue }, signal: controller.signal })
      .then(readResponse).then((data) => {
        if (!controller.signal.aborted) { setPrograms(data.programs); setProgramId(data.suggestedProgramId || ""); setProgramError(""); }
      }).catch((err) => { if (!controller.signal.aborted) setProgramError(errorText(err)); })
      .finally(() => { if (!controller.signal.aborted) setProgramLoading(false); });
    return () => controller.abort();
  }, [level, course.programName, course.department, course.level, sessionValue, programRetry]);

  const runningId = job?.status === "running" ? job.id : "";
  useEffect(() => {
    if (!runningId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;
    const poll = async () => {
      try {
        const response = await fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${runningId}`, {
          headers: { "X-DBP-Session": sessionValue }, cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
        });
        const data = await readResponse(response);
        if (controller.signal.aborted) return;
        failures = 0; setJob(data.job); setError("");
        if (data.job.status === "running") timer = setTimeout(poll, 1000);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(`Tarama durumu alınamadı: ${errorText(err)}`);
        if (++failures < 5) timer = setTimeout(poll, 2000);
        else {
          void fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${runningId}`, { method: "DELETE", headers: { "X-DBP-Session": sessionValue } }).catch(() => {});
          setJob((current) => current ? { ...current, status: "failed", error: "ÖBS taramasıyla bağlantı kesildi. Tekrar deneyin." } : current);
        }
      }
    };
    timer = setTimeout(poll, 500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [runningId, sessionValue]);

  const resetSearch = () => {
    if (activeJob.current) void fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${activeJob.current}`, { method: "DELETE", headers: { "X-DBP-Session": sessionValue } }).catch(() => {});
    activeJob.current = ""; setJob(null); setError("");
  };

  const search = async (refresh = false) => {
    setBusy(true); setError(""); setJob(null);
    try {
      const data = await readResponse(await fetch(dbpPath("/api/dbp/obs-course-search"), {
        method: "POST", headers: { "Content-Type": "application/json", "X-DBP-Session": sessionValue },
        body: JSON.stringify({ code, name, programId, educationLevel: level, level: course.level, programName: course.programName, department: course.department, refresh }),
      }));
      if (!alive.current) {
        void fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${data.job.id}`, { method: "DELETE", headers: { "X-DBP-Session": sessionValue } }).catch(() => {});
        return;
      }
      activeJob.current = data.job.id; setJob(data.job);
    } catch (err) { if (alive.current) setError(errorText(err)); }
    finally { if (alive.current) setBusy(false); }
  };

  const preview = async (sourceUrl: string, selected: ObsCandidate | null = null) => {
    setBusy(true); setError("");
    action.current?.abort(); const controller = new AbortController(); action.current = controller;
    try {
      const data = await readResponse(await fetch(dbpPath("/api/dbp/obs-course-draft"), {
        method: "POST", headers: { "Content-Type": "application/json", "X-DBP-Session": sessionValue },
        body: JSON.stringify({ url: sourceUrl }), signal: controller.signal,
      }));
      if (!controller.signal.aborted) {
        setCandidate(selected); setDraft(data.draft); setIncludeMatrix(false); setOverwriteConfirmed(false);
        dialogRef.current?.focus();
      }
    } catch (err) { if (!controller.signal.aborted) setError(errorText(err)); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  };

  const stop = async () => {
    if (!job) return;
    try {
      const data = await readResponse(await fetch(`${dbpPath("/api/dbp/obs-course-search")}?id=${job.id}`, { method: "DELETE", headers: { "X-DBP-Session": sessionValue } }));
      if (alive.current) setJob(data.job);
    } catch (err) { if (alive.current) setError(errorText(err)); }
  };

  const apply = (mode: "empty" | "overwrite") => {
    if (!draft) return;
    onApply(draft, mode, { url: draft.sourceUrl, obsCourseId: draft.obsCourseId, program: candidate?.program.name || draft.details.program || "",
      curriculum: candidate?.curriculum.name, updatedAt: draft.updatedAt, importedAt: new Date().toISOString(), matrixIncluded: includeMatrix });
  };

  const matrixHeaders = draft ? [...new Set(draft.contributionMatrix.flatMap((row) => Object.keys(row)))].filter((key) => /^P\d+$/.test(key)).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))) : [];
  const matrixFits = Boolean(draft && matrixHeaders.length === 11 && matrixHeaders.every((key, index) => key === `P${index + 1}`) && draft.contributionMatrix.length === draft.outcomes.length);
  const sourceMismatch = Boolean(draft && (draft.code.replace(/\s/g, "").toLocaleUpperCase("tr-TR") !== course.code.replace(/\s/g, "").toLocaleUpperCase("tr-TR") || draft.name.toLocaleLowerCase("tr-TR").trim() !== course.name.toLocaleLowerCase("tr-TR").trim()));
  const progress = job && job.progress.total ? Math.round(job.progress.completed / job.progress.total * 100) : undefined;
  const waiting = busy || job?.status === "running";

  return createPortal(
    <div className="obs-browser-backdrop">
      <section ref={dialogRef} tabIndex={-1} className={`obs-browser ${draft ? "is-preview" : ""}`} role="dialog" aria-modal="true" aria-labelledby="obs-browser-title">
        <header className="obs-browser-header">
          <div><small>ÖBS BOLOGNA</small><h2 id="obs-browser-title">{draft ? "Ders içeriği önizlemesi" : "ÖBS’den ders bilgisi al"}</h2><p>{course.code} · {course.name}</p></div>
          <button type="button" className="obs-icon-button" onClick={onClose} aria-label="ÖBS penceresini kapat"><X size={20} /></button>
        </header>
        {!draft ? <>
          <div className="obs-browser-tabs" role="tablist" aria-label="ÖBS’den getirme yöntemi">
            <button type="button" id="obs-search-tab" role="tab" aria-controls="obs-search-panel" aria-selected={tab === "search"} onClick={() => { setTab("search"); setError(""); }}><Search size={17} />ÖBS’de ara</button>
            <button type="button" id="obs-link-tab" role="tab" aria-controls="obs-link-panel" aria-selected={tab === "link"} onClick={() => { setTab("link"); setError(""); }}><Link2 size={17} />Bağlantıyla getir</button>
          </div>
          <div className="obs-browser-scroll">
            {tab === "search" ? <div id="obs-search-panel" role="tabpanel" aria-labelledby="obs-search-tab">
              <div className="obs-search-intro"><h3>Dersin müfredatlardaki karşılıklarını bulun</h3><p>Ders kodu ve adıyla seçilen programın müfredatları taranır. Bologna sayfasında adınızın geçtiği adaylar öne alınır.</p></div>
              <div className="obs-search-fields">
                <label><span>Öğrenim düzeyi</span><select value={level} disabled={waiting} onChange={(event) => { resetSearch(); setLevel(event.target.value); setProgramId(""); setPrograms([]); setProgramLoading(true); }}><option value="yls">Yüksek lisans</option><option value="dok">Doktora</option><option value="lis">Lisans</option></select></label>
                <label className="obs-program-field"><span>ÖBS programı</span><select value={programId} disabled={programLoading || waiting} onChange={(event) => { resetSearch(); setProgramId(event.target.value); }}><option value="">{programLoading ? "ÖBS programları yükleniyor…" : "Program seçin"}</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}{program.faculty ? ` · ${program.faculty}` : ""}</option>)}</select></label>
                <label><span>Ders kodu</span><input value={code} disabled={waiting} maxLength={80} onChange={(event) => { resetSearch(); setCode(event.target.value); }} /></label>
                <label className="obs-program-field"><span>Ders adı</span><input value={name} disabled={waiting} maxLength={200} onChange={(event) => { resetSearch(); setName(event.target.value); }} /></label>
              </div>
              {programError && <div className="obs-browser-error" role="alert">{programError}<button type="button" onClick={() => { setProgramLoading(true); setProgramRetry((value) => value + 1); }}>Programları yeniden yükle</button></div>}
              {!programLoading && !programError && !programId && <p className="obs-browser-note">Programı otomatik eşleştiremedik. Aranacak ÖBS programını yukarıdan seçin.</p>}
              <div className="obs-search-actions"><button type="button" className="obs-primary" disabled={!programId || (!code.trim() && !name.trim()) || waiting} onClick={() => search()}>{waiting ? <LoaderCircle size={17} className="obs-spin" /> : <Search size={17} />}ÖBS’de Bu Dersi Ara</button>{job && job.status !== "running" && <button type="button" className="obs-secondary" disabled={busy || !programId} onClick={() => search(true)}><RefreshCw size={16} />Yeniden tara</button>}{job?.status === "running" && <button type="button" className="obs-secondary" onClick={stop}>Taramayı durdur</button>}</div>
              {job && <div className="obs-search-progress" role="status" aria-live="polite">{job.status === "running" && <LoaderCircle size={17} className="obs-spin" />}<span>{job.status === "cancelled" ? "Tarama durduruldu. Bulunan adayları inceleyebilirsiniz." : job.status === "failed" ? job.error : job.progress.message}</span>{job.status === "running" && <progress value={progress} max={100} aria-label="Geçerli tarama aşaması" />}</div>}
              {job && job.candidates.length > 0 && <div className="obs-candidate-list"><h3>{job.candidates.length} aday ders{job.status === "running" ? " · tarama sürüyor" : ""}</h3>{job.candidates.map((item) => <article key={item.id} className="obs-candidate">
                <div className="obs-candidate-top"><span>{item.curriculum.name}</span>{item.instructorMatch && <b><Check size={13} />Bologna’da adınız geçiyor</b>}</div>
                <h4>{item.code} · {item.name}</h4><p>{item.program.name}</p><p><strong>Dersi verenler:</strong> {item.instructors || "Belirtilmemiş"}</p>
                <div className="obs-candidate-meta"><span>{item.ects || "—"} AKTS</span><span>{item.summary.outcomes} öğrenme çıktısı</span><span>{item.summary.weeks} hafta</span><span>{item.summary.matrix ? "Katkı matrisi var" : "Katkı matrisi yok"}</span></div>
                <footer><small>{item.matchReason} · Güncelleme: {item.updatedAt || "Belirtilmemiş"}</small><button type="button" className="obs-secondary" disabled={busy} onClick={() => preview(item.sourceUrl, item)}><BookOpen size={16} />İçeriği Önizle</button></footer>
              </article>)}</div>}
              {job?.status === "completed" && job.candidates.length === 0 && <div className="obs-no-results"><BookOpen size={28} /><h3>İçeriği okunabilen aday ders bulunamadı</h3><p>Programı ve ders kodunu kontrol edin. Ders kodu değiştiyse kod alanını boşaltıp ders adıyla arayabilir veya bağlantıyla getirebilirsiniz.</p></div>}
              {!!job?.warnings.length && <details className="obs-search-warnings"><summary>{job.warnings.length} kayıt veya müfredat için tarama notu</summary><ul>{job.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></details>}
              <p className="obs-browser-note">“Bologna’da adınız geçiyor” bilgisi sayfa içeriğine dayanır; dönemlik ders görevlendirmesi anlamına gelmez. Tekrar aramalarını hızlandırmak için sonuçlar kısa süre saklanır; “Yeniden tara” güncel sayfaları okur.</p>
            </div> : <div id="obs-link-panel" role="tabpanel" aria-labelledby="obs-link-tab" className="obs-link-panel">
              <h3>Ders detay bağlantısıyla getir</h3><p>ÖBS’de dersin detay sayfasını açıp sayfanın en altındaki bağlantıyı buraya yapıştırın.</p>
              <a href={dbpPath("/obs-link-guide.jpg")} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Bağlantının yerini göster</a>
              <label><span>ÖBS ders detay bağlantısı</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=…" /></label>
              <button type="button" className="obs-primary" disabled={busy || !url.trim()} onClick={() => preview(url)}>{busy ? <LoaderCircle size={17} className="obs-spin" /> : <BookOpen size={17} />}Dersi Getir ve Önizle</button>
            </div>}
            {error && <p className="obs-browser-error" role="alert">{error}</p>}
            {busy && <p className="obs-browser-note" role="status">ÖBS bilgileri alınıyor…</p>}
          </div>
          <footer className="obs-browser-footer"><span>İçeriği önizlemek ders formunu değiştirmez.</span><button type="button" className="obs-secondary" onClick={onClose}>Kapat</button></footer>
        </> : <>
          <div className="obs-preview-toolbar"><button type="button" className="obs-secondary" onClick={() => { setDraft(null); setCandidate(null); setError(""); }}><ArrowLeft size={16} />{tab === "search" ? "Adaylara dön" : "Bağlantıya dön"}</button><a href={draft.sourceUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />ÖBS’de aç</a></div>
          <div className="obs-browser-scroll obs-preview-body">
            <div className="obs-preview-identity"><small>{candidate?.curriculum.name || "ÖBS ders bilgi paketi"}</small><h3>{draft.code} · {draft.name}</h3><p>{candidate?.program.name || draft.details.program || "Program belirtilmemiş"}</p><div className="obs-candidate-meta"><span>{draft.ects} AKTS</span><span>{draft.theory}+{draft.practice}+{draft.lab} T+U+L</span><span>{draft.credit} kredi</span><span>Güncelleme: {draft.updatedAt || "Belirtilmemiş"}</span></div></div>
            {sourceMismatch && <p className="obs-browser-warning">Kaynak dersin kodu veya adı mevcut dersinizden farklı. Aktarımdan önce içeriğin uygunluğunu kontrol edin. Mevcut dersinizin kodu ve adı korunur.</p>}
            <nav className="obs-preview-nav" aria-label="Önizleme bölümleri">{[["obs-general", "Genel bilgiler"], ["obs-description", "Amaç ve içerik"], ["obs-outcomes", "Öğrenme çıktıları"], ["obs-weeks", "Haftalık plan"], ["obs-assessment", "Değerlendirme"], ["obs-workload", "İş yükü"], ["obs-resources", "Kaynaklar"], ["obs-matrix", "Katkı matrisi"]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); dialogRef.current?.querySelector(`#${id}`)?.scrollIntoView({ block: "start", behavior: "instant" }); }}>{label}</a>)}</nav>
            <PreviewSection id="obs-general" title="Genel bilgiler"><dl className="obs-preview-facts">{[["Düzey", draft.details.level], ["Dersin türü", draft.details.type], ["Dil", draft.details.language], ["Öğretim şekli", draft.details.teachingMode], ["Yarıyıl", draft.semester ? String(draft.semester) : ""], ["Koordinatör", draft.details.coordinator], ["Dersi verenler", draft.details.instructors], ["Yardımcılar", draft.details.assistants]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Belirtilmemiş"}</dd></div>)}</dl></PreviewSection>
            <PreviewSection id="obs-description" title="Amaç, içerik ve yöntem">{[["Dersin amacı", draft.details.purpose], ["Dersin içeriği", draft.details.content], ["Yöntem ve teknikler", draft.details.methods], ["Ön koşullar", draft.details.prerequisites]].map(([title, value]) => <div className="obs-preview-field" key={title}><h4>{title}</h4><PreviewText value={value} /></div>)}</PreviewSection>
            <PreviewSection id="obs-outcomes" title={`Öğrenme çıktıları (${draft.outcomes.length})`}>{draft.outcomes.length ? <ol className="obs-preview-outcomes">{draft.outcomes.map((outcome, index) => <li key={index}><b>ÖÇ{index + 1}</b><p>{outcome}</p></li>)}</ol> : <PreviewText />}</PreviewSection>
            <PreviewSection id="obs-weeks" title="Haftalık ders planı">{Object.keys(draft.weeklyTopics).length ? <div className="obs-preview-table"><table><thead><tr><th>Hafta</th><th>Konu, ön hazırlık ve dokümanlar</th></tr></thead><tbody>{Object.entries(draft.weeklyTopics).sort(([a], [b]) => Number(a) - Number(b)).map(([week, topic]) => <tr key={week}><th scope="row">{week}</th><td className="obs-preview-text">{topic || "Doldurulmamış"}</td></tr>)}</tbody></table></div> : <PreviewText />}</PreviewSection>
            <PreviewSection id="obs-assessment" title="Değerlendirme ölçütleri">{draft.assessments.length ? <div className="obs-preview-table"><table><thead><tr><th>Çalışma / sınav</th><th>Sayı</th><th>Katkı (%)</th></tr></thead><tbody>{draft.assessments.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.count}</td><td>{item.weight}</td></tr>)}</tbody></table></div> : <PreviewText />}</PreviewSection>
            <PreviewSection id="obs-workload" title="AKTS ve iş yükü">{Object.keys(draft.workloads).length ? <div className="obs-preview-table"><table><thead><tr><th>Etkinlik</th><th>Sayı</th><th>Süre (saat)</th><th>Toplam (saat)</th></tr></thead><tbody>{Object.entries(draft.workloads).map(([label, item]) => <tr key={label}><td>{label}</td><td>{item.count}</td><td>{item.hours}</td><td>{item.count * item.hours}</td></tr>)}</tbody><tfoot><tr><th colSpan={3}>Toplam iş yükü</th><td>{draft.totalWorkload}</td></tr></tfoot></table></div> : <PreviewText />}<p className="obs-browser-note">ÖBS’de belirtilen AKTS: {draft.ects}. Ders formunda AKTS mevcut iş yükü hesaplama kuralına göre hesaplanır.</p></PreviewSection>
            <PreviewSection id="obs-resources" title="Kaynaklar ve ders notları"><PreviewText value={draft.resources} /></PreviewSection>
            <PreviewSection id="obs-structure" title="Dersin yapısı">{Object.keys(draft.structures).length ? <dl className="obs-preview-facts">{Object.entries(draft.structures).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>%{value}</dd></div>)}</dl> : <PreviewText />}</PreviewSection>
            <PreviewSection id="obs-matrix" title="Öğrenme çıktıları – program çıktıları katkı matrisi">{draft.contributionMatrix.length ? <><div className="obs-preview-table"><table><thead><tr><th>ÖÇ / PÇ</th>{matrixHeaders.map((key) => <th key={key}>{key}</th>)}</tr></thead><tbody>{draft.contributionMatrix.map((row, index) => <tr key={index}><th scope="row">ÖÇ{index + 1}</th>{matrixHeaders.map((key) => <td key={key}>{row[key] || "—"}</td>)}</tr>)}</tbody></table></div><p className="obs-browser-warning">Kaynak programdaki P1, P2… tanımları mevcut programınızın çıktılarıyla aynı olmayabilir. Katkı matrisi varsayılan olarak aktarılmaz.</p>{matrixFits ? <label className="obs-matrix-consent"><input type="checkbox" checked={includeMatrix} onChange={(event) => setIncludeMatrix(event.target.checked)} /><span>Kaynak ve hedef programın PÇ metinlerini karşılaştırdım; bu katkı matrisini de aktar.</span></label> : <p className="obs-browser-note">Matris boyutu mevcut formdaki 11 program çıktısı veya kaynak öğrenme çıktılarıyla uyuşmuyor. Katkı matrisini ders formunda düzenleyin.</p>}</> : <PreviewText />}</PreviewSection>
            <p className="obs-browser-note">Onayladığınız içerik ders formuna aktarılır. Kalıcı kayıt ve onaya gönderme işlemleri ders formundan yapılır.</p>
          </div>
          <footer className="obs-browser-footer obs-preview-footer"><div><strong>İçeriği inceledikten sonra aktarın</strong><label className="obs-overwrite-consent"><input type="checkbox" checked={overwriteConfirmed} onChange={(event) => setOverwriteConfirmed(event.target.checked)} /><span>Aktarılan bölümlerde mevcut içeriğin değiştirilmesini onaylıyorum.</span></label></div><div className="obs-preview-apply"><button type="button" className="obs-secondary" onClick={() => apply("empty")}>Boş Alanları Doldur</button><button type="button" className="obs-primary" disabled={!overwriteConfirmed} onClick={() => apply("overwrite")}><Check size={16} />Tümünü Değiştir</button></div></footer>
        </>}
      </section>
    </div>, document.body,
  );
}
