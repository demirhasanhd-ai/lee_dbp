"use client";

import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Plus, Save, Upload, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import {
  LEE_PROGRAMS,
  MAIN_DEPARTMENTS,
  type ProgramLevel,
} from "../../lib/data/programs";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";

type CatalogCourseOption = {
  department?: string;
  programName?: string;
  level: string;
  code: string;
  name: string;
  term?: string;
  instructor?: string;
};

type InstructorOption = {
  id: string;
  name: string;
  title?: string | null;
  email?: string | null;
  departmentNames?: string[];
  source?: string;
};

type ImportInstructorOption = {
  key: string;
  name: string;
  tcKimlik?: string;
  email?: string;
  title?: string;
  rows?: number[];
};

type ImportPreviewItem = {
  id: string;
  rows: number[];
  obsProgram: string;
  level: string;
  code: string;
  name: string;
  action: "assign_empty" | "change_existing" | "same" | "not_found" | "needs_instructor_choice" | "course_ambiguous";
  course: null | {
    id?: number;
    code: string;
    name: string;
    instructor?: string;
    instructorTcKimlik?: string;
    instructorEmail?: string;
  };
  courseCandidates?: CatalogCourseOption[];
  instructorOptions: ImportInstructorOption[];
  selectedInstructorKey?: string;
  multipleInstructors?: boolean;
};

type ImportPreview = {
  rowsRead: number;
  summary: {
    totalGroups: number;
    found: number;
    notFound: number;
    multipleInstructors: number;
    assignEmpty: number;
    changeExisting: number;
    same: number;
    needsChoice: number;
  };
  items: ImportPreviewItem[];
};

type ImportApplyMode = "empty" | "changed" | "both";

type NewCoursePreview = {
  scope: { department: string; programName: string; level: string };
  rowsRead: number;
  summary: { ready: number; existing: number; invalid: number; unassigned: number };
  items: {
    rowNumber: number; code: string; name: string; term: string; type: string;
    theory: number | null; practice: number | null; credit: number | null; ects: number | null;
    instructor: string; instructorTitle: string; instructorEmail: string;
    action: "create" | "existing" | "invalid"; errors: string[];
  }[];
  fileBase64: string;
};

const trustedInstructorSources = new Set(["e_enstitu_api", "e_enstitu_database", "dbp_course_catalog"]);
const unassignedInstructorLabel = "Şimdilik boş / atama bekliyor";

const sameText = (left = "", right = "") =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

const foldTurkishText = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const normalizePersonName = (value = "") =>
  foldTurkishText(value)
    .replace(/\b(prof|doc|dr|ogr|uyesi|gor)\b\.?/gu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeEmail = (value = "") => value.trim().toLocaleLowerCase("tr-TR");
const normalizeTc = (value = "") => value.replace(/\D+/g, "");

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = () => reject(reader.error || new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });

const instructorKey = (option: ImportInstructorOption) =>
  normalizeTc(option.tcKimlik || "") || normalizeEmail(option.email || "") || normalizePersonName(option.name);

const instructorPayload = (option: ImportInstructorOption) => ({
  instructor: option.name,
  instructorTcKimlik: normalizeTc(option.tcKimlik || ""),
  instructorEmail: normalizeEmail(option.email || ""),
  instructorTitle: option.title || "",
  instructorSource: "excel_import",
});

const currentCourseUnassigned = (course: ImportPreviewItem["course"]) => {
  const value = normalizePersonName(course?.instructor || "");
  return !value || ["atama bekliyor", "yok", "simdilik bos atama bekliyor"].includes(value);
};

const sameInstructor = (course: ImportPreviewItem["course"], option: ImportInstructorOption) => {
  const courseName = normalizePersonName(course?.instructor || "");
  const nextName = normalizePersonName(option.name);
  if (courseName && nextName && courseName !== nextName) return false;
  const courseTc = normalizeTc(course?.instructorTcKimlik || "");
  const nextTc = normalizeTc(option.tcKimlik || "");
  if (courseTc && nextTc) return courseTc === nextTc;
  const courseEmail = normalizeEmail(course?.instructorEmail || "");
  const nextEmail = normalizeEmail(option.email || "");
  if (courseEmail && nextEmail) return courseEmail === nextEmail;
  return Boolean(courseName && nextName && courseName === nextName);
};

const actionForSelection = (item: ImportPreviewItem, option: ImportInstructorOption | null) => {
  if (!item.course) return item.action;
  if (!option) return "needs_instructor_choice";
  if (currentCourseUnassigned(item.course)) return "assign_empty";
  if (sameInstructor(item.course, option)) return "same";
  return "change_existing";
};

const actionLabel = (action: ImportPreviewItem["action"]) => {
  if (action === "assign_empty") return "Boş derse atanacak";
  if (action === "change_existing") return "Mevcut hoca değişecek";
  if (action === "same") return "Aynı hoca";
  if (action === "not_found") return "Ders bulunamadı";
  if (action === "course_ambiguous") return "Ders eşleşmesi belirsiz";
  return "Hoca seçimi gerekli";
};

export function CourseCreateDialog({
  open,
  onClose,
  onCreated,
  session,
  catalogCourses = [],
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  session: { username: string; name: string; role: string; department: string };
  catalogCourses?: CatalogCourseOption[];
}) {
  const [mode, setMode] = useState<"create" | "assign" | "bulk">("create");
  const [main, setMain] = useState(MAIN_DEPARTMENTS[0]);
  const [level, setLevel] = useState<ProgramLevel>("Tezli Yüksek Lisans");
  const [selectedProgramKey, setSelectedProgramKey] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [instructorsBusy, setInstructorsBusy] = useState(false);
  const [instructorsMessage, setInstructorsMessage] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importMode, setImportMode] = useState<ImportApplyMode>("empty");
  const [importSelections, setImportSelections] = useState<Record<string, string>>({});
  const [newCourseFile, setNewCourseFile] = useState<File | null>(null);
  const [newCoursePreview, setNewCoursePreview] = useState<NewCoursePreview | null>(null);
  const [newCourseMessage, setNewCourseMessage] = useState("");
  const instructorListId = useId();

  const programs = useMemo(
    () =>
      LEE_PROGRAMS.filter(
        (item) => item.mainDepartment === main && item.levels.includes(level),
      ),
    [main, level],
  );

  const selectedProgram = useMemo(
    () =>
      programs.find(
        (item) => `${item.department}||${item.programName}` === selectedProgramKey,
      ) ?? null,
    [programs, selectedProgramKey],
  );

  const curriculumCourses = selectedProgram
    ? catalogCourses.filter((course) =>
        sameText(course.department, selectedProgram.department) &&
        sameText(course.programName, selectedProgram.programName) &&
        sameText(course.level, level),
      )
    : [];
  const selectedCourse = curriculumCourses.find((course) => course.code === selectedCourseCode);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let active = true;
    const loadingTimer = window.setTimeout(() => {
      if (!active) return;
      setInstructorsBusy(true);
      setInstructorsMessage("");
    }, 0);
    const params = new URLSearchParams();
    if (selectedProgram?.department) params.set("department", selectedProgram.department);
    if (selectedProgram?.programName) params.set("programName", selectedProgram.programName);
    fetch(dbpPath(`/api/dbp/instructors?${params.toString()}`), {
      headers: { "X-DBP-Session": dbpSessionHeader(session) },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Akademisyen listesi alınamadı.");
        return data as { instructors?: InstructorOption[]; source?: string };
      })
      .then((data) => {
        setInstructors(Array.isArray(data.instructors) ? data.instructors : []);
        setInstructorsMessage(
          data.source && trustedInstructorSources.has(data.source)
            ? ""
            : "e-Enstitü veritabanına ulaşılamadığı için yedek akademisyen kaynağı kullanılıyor.",
        );
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setInstructors([]);
        setInstructorsMessage(error instanceof Error ? error.message : "Akademisyen listesi alınamadı.");
      })
      .finally(() => {
        active = false;
        window.clearTimeout(loadingTimer);
        if (!controller.signal.aborted) setInstructorsBusy(false);
      });
    return () => {
      active = false;
      window.clearTimeout(loadingTimer);
      controller.abort();
    };
  }, [open, selectedProgram?.department, selectedProgram?.programName, session]);

  const selectedImportRows = useMemo(() => {
    if (!importPreview) return [];
    return importPreview.items.flatMap((item) => {
      const selectedKey = importSelections[item.id] || item.selectedInstructorKey || "";
      const option = item.instructorOptions.find((candidate) => instructorKey(candidate) === selectedKey) || null;
      const action = actionForSelection(item, option);
      const eligible =
        (importMode === "empty" && action === "assign_empty") ||
        (importMode === "changed" && action === "change_existing") ||
        (importMode === "both" && ["assign_empty", "change_existing"].includes(action));
      return eligible && item.course && option
        ? [{ item, action, instructor: instructorPayload(option) }]
        : [];
    });
  }, [importMode, importPreview, importSelections]);

  if (!open) return null;

  const clearNewCoursePreview = () => { setNewCoursePreview(null); setNewCourseMessage(""); };
  const previewNewCourses = async () => {
    if (!newCourseFile || !selectedProgram) return;
    setBusy(true);
    clearNewCoursePreview();
    try {
      if (!newCourseFile.name.toLowerCase().endsWith(".xlsx") || newCourseFile.size > 5_000_000) {
        throw new Error("En fazla 5 MB boyutunda bir .xlsx dosyası seçin.");
      }
      const fileBase64 = await fileToBase64(newCourseFile);
      const response = await fetch(dbpPath("/api/dbp/course-create-import/preview"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({ department: selectedProgram.department, programName: selectedProgram.programName, level, fileBase64 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Excel önizlemesi oluşturulamadı.");
      setNewCoursePreview({ ...data.preview, fileBase64 });
    } catch (error) {
      setNewCourseMessage(error instanceof Error ? error.message : "Excel okunamadı.");
    } finally { setBusy(false); }
  };
  const applyNewCourses = async () => {
    if (!newCoursePreview?.summary.ready) return;
    setBusy(true);
    setNewCourseMessage("");
    try {
      const response = await fetch(dbpPath("/api/dbp/course-create-import/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({ ...newCoursePreview.scope, fileBase64: newCoursePreview.fileBase64 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Dersler eklenemedi.");
      setNewCourseMessage(`${data.result.created} yeni ders eklendi. ${data.result.existing} mevcut ders ve ${data.result.invalid} hatalı satır atlandı. ${data.result.unassigned} ders atama bekliyor.`);
      setNewCoursePreview(null);
      onCreated();
    } catch (error) {
      setNewCourseMessage(error instanceof Error ? error.message : "Dersler eklenemedi.");
    } finally { setBusy(false); }
  };

  const runImportPreview = async () => {
    if (!importFile) {
      setMessage("Önizleme için Excel dosyası seçin.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const fileBase64 = await fileToBase64(importFile);
      const response = await fetch(dbpPath("/api/dbp/course-assignment-import/preview"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({ fileName: importFile.name, fileBase64 }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Önizleme oluşturulamadı.");
      const preview = data.preview as ImportPreview;
      setImportPreview(preview);
      setImportSelections(
        Object.fromEntries(preview.items.map((item) => [item.id, item.selectedInstructorKey || ""])),
      );
    } catch (error) {
      setImportPreview(null);
      setMessage(error instanceof Error ? error.message : "Önizleme oluşturulamadı.");
    } finally {
      setBusy(false);
    }
  };

  const applyImport = async () => {
    if (!selectedImportRows.length) {
      setMessage("Uygulanacak atama bulunamadı. Filtreleri veya çoklu hoca seçimlerini kontrol edin.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(dbpPath("/api/dbp/course-assignment-import/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({
          items: selectedImportRows.map(({ item, instructor }) => ({
            courseId: item.course?.id,
            instructor,
          })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Atamalar uygulanamadı.");
      setMessage(`${data.result?.changed || 0} ders için öğretim elemanı ataması güncellendi.`);
      onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Atamalar uygulanamadı.");
    } finally {
      setBusy(false);
    }
  };

  const downloadImportTemplate = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(dbpPath("/api/dbp/course-assignment-import/template"), {
        headers: { "X-DBP-Session": dbpSessionHeader(session) },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Şablon indirilemedi.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ders-hoca-atama-sablonu.xlsx";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Şablon indirilemedi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="course-dialog-backdrop" role="presentation">
      <section className="course-create-dialog course-management-dialog" role="dialog" aria-modal="true" aria-labelledby="course-create-title">
        <header>
          <div>
            <small>ENSTİTÜ YETKİLİ İŞLEMİ</small>
            <h2 id="course-create-title">Ders Düzenleme</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat">
            <X size={17} />
          </button>
        </header>

        <div className="course-dialog-tabs" role="tablist" aria-label="Ders yönetimi">
          <button type="button" disabled={busy} className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setMessage(""); }}>Yeni Ders</button>
          <button type="button" disabled={busy} className={mode === "assign" ? "active" : ""} onClick={() => { setMode("assign"); setMessage(""); }}>Mevcut Ders</button>
          <button type="button" disabled={busy} className={mode === "bulk" ? "active" : ""} onClick={() => setMode("bulk")}>Liste ile Atama Yap</button>
        </div>

        {mode === "bulk" ? (
          <div className="bulk-assignment-panel">
            <div className="bulk-import-controls">
              <label className="bulk-file-picker">
                <span>Excel listesi</span>
                <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => {
                  setImportFile(event.currentTarget.files?.[0] || null);
                  setImportPreview(null);
                  setMessage("");
                }} />
              </label>
              <button type="button" className="bulk-template-button" onClick={downloadImportTemplate} disabled={busy}>
                <Download size={15} />
                Boş Şablon
              </button>
              <button type="button" className="bulk-preview-button" onClick={runImportPreview} disabled={busy || !importFile}>
                <FileSpreadsheet size={15} />
                Önizle
              </button>
            </div>

            {importPreview && (
              <>
                <div className="bulk-summary-grid">
                  <b>{importPreview.rowsRead} satır okundu</b>
                  <b>{importPreview.summary.found} ders eşleşti</b>
                  <b>{importPreview.summary.assignEmpty} boş ders</b>
                  <b>{importPreview.summary.changeExisting} farklı hoca</b>
                  <b>{importPreview.summary.multipleInstructors} çoklu hoca</b>
                  <b>{importPreview.summary.notFound} bulunamadı</b>
                </div>

                <div className="bulk-mode-options" role="radiogroup" aria-label="Atama kapsamı">
                  <label><input type="radio" checked={importMode === "empty"} onChange={() => setImportMode("empty")} />Atama yapılmamış derslere ata</label>
                  <label><input type="radio" checked={importMode === "changed"} onChange={() => setImportMode("changed")} />Hoca farklıysa güncelle</label>
                  <label><input type="radio" checked={importMode === "both"} onChange={() => setImportMode("both")} />Boşları ata ve farklıları güncelle</label>
                </div>

                <div className="bulk-table-wrap">
                  <table className="bulk-assignment-table">
                    <thead><tr><th>Ders</th><th>Program</th><th>Mevcut</th><th>Excel</th><th>Durum</th></tr></thead>
                    <tbody>
                      {importPreview.items.map((item) => {
                        const selectedKey = importSelections[item.id] || item.selectedInstructorKey || "";
                        const selectedOption = item.instructorOptions.find((option) => instructorKey(option) === selectedKey) || null;
                        const action = actionForSelection(item, selectedOption);
                        const warning = item.multipleInstructors || action === "not_found" || action === "course_ambiguous";
                        return (
                          <tr key={item.id} className={warning ? "needs-review" : ""}>
                            <td><b>{item.code}</b><span>{item.name}</span><small>Excel satırı: {item.rows.join(", ")}</small></td>
                            <td><span>{item.obsProgram}</span><small>{item.level}</small></td>
                            <td>{item.course?.instructor?.trim() || "Atama bekliyor"}</td>
                            <td>
                              {item.instructorOptions.length > 1 ? (
                                <select value={selectedKey} onChange={(event) => setImportSelections((current) => ({ ...current, [item.id]: event.target.value }))}>
                                  <option value="">Sorumlu hocayı seçin</option>
                                  {item.instructorOptions.map((option) => (
                                    <option key={option.key} value={instructorKey(option)}>{option.name}{option.email ? ` — ${option.email}` : ""}</option>
                                  ))}
                                </select>
                              ) : (
                                <span>{item.instructorOptions[0]?.name || "Seçim bekliyor"}</span>
                              )}
                            </td>
                            <td><span className={`bulk-status ${action}`}>{warning ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}{actionLabel(action)}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <footer>
                  <button type="button" onClick={onClose}>Vazgeç</button>
                  <button className="create" type="button" onClick={applyImport} disabled={busy || selectedImportRows.length === 0}>
                    <Upload size={15} />
                    {selectedImportRows.length} Atamayı Onayla
                  </button>
                </footer>
              </>
            )}

            {message && <p className="no-program-warning">{message}</p>}
          </div>
        ) : (
          <form onSubmit={async (event) => {
            event.preventDefault();
            if (!selectedProgram) return;
            setBusy(true);
            setMessage("");
            try {
              const form = new FormData(event.currentTarget);
              const instructor = String(form.get("instructor") || "").trim();
              const instructorChanged = form.has("instructor") && (mode === "create" || instructor !== (selectedCourse?.instructor || "").trim());
              const selectedInstructor = instructors.find((item) => normalizePersonName(item.name) === normalizePersonName(instructor));
              const response = await fetch(dbpPath("/api/dbp/course-management"), {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
                body: JSON.stringify({
                  action: mode,
                  department: selectedProgram.department,
                  programName: selectedProgram.programName,
                  level,
                  code: form.get("code"),
                  name: form.get("name"),
                  type: form.get("type"),
                  theory: Number(form.get("theory") || 0),
                  practice: Number(form.get("practice") || 0),
                  credit: Number(form.get("credit") || 0),
                  ects: Number(form.get("ects") || 0),
                  term: form.get("term"),
                  ...(instructorChanged ? {
                    instructor: instructor === "unassigned" || instructor === unassignedInstructorLabel ? "" : instructor,
                    instructorTcKimlik: selectedInstructor && /^\d{11}$/.test(selectedInstructor.id) ? selectedInstructor.id : "",
                    instructorEmail: selectedInstructor?.email || "",
                    instructorTitle: selectedInstructor?.title || "",
                    instructorSource: selectedInstructor?.source || "",
                  } : {}),
                }),
              });
              const data = await response.json().catch(() => ({}));
              if (!response.ok) throw new Error(data.message || "İşlem kaydedilemedi.");
              onCreated();
              onClose();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "İşlem kaydedilemedi.");
            } finally {
              setBusy(false);
            }
          }}>
            <div className="create-course-grid">
              <label className="wide">
                <span>Ana ABD / ASD Başkanlığı</span>
                <select required disabled={busy} value={main} onChange={(event) => { setMain(event.target.value); setSelectedProgramKey(""); setSelectedCourseCode(""); clearNewCoursePreview(); }}>
                  {MAIN_DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                <span>Program düzeyi</span>
                <select required disabled={busy} value={level} onChange={(event) => { setLevel(event.target.value as ProgramLevel); setSelectedProgramKey(""); setSelectedCourseCode(""); clearNewCoursePreview(); }}>
                  <option>Tezsiz Yüksek Lisans</option>
                  <option>Tezli Yüksek Lisans</option>
                  <option>Doktora</option>
                </select>
              </label>

              <label className="wide">
                <span>İlgili ABD / ASD ve program</span>
                <select required disabled={busy} value={selectedProgramKey} onChange={(event) => { setSelectedProgramKey(event.target.value); setSelectedCourseCode(""); clearNewCoursePreview(); }}>
                  <option value="" disabled>Programı seçin</option>
                  {programs.map((item) => (
                    <option key={`${item.department}-${item.programName}`} value={`${item.department}||${item.programName}`}>{item.department} — {item.programName}</option>
                  ))}
                </select>
              </label>

              {mode === "create" && (
                <section className="new-course-import-panel" aria-label="Excel ile toplu yeni ders">
                  <h3>Excel ile Toplu Yeni Ders</h3>
                  <p>Önce yukarıdan program ve düzey seçin. Her ders için bir satır doldurun; dönem ve ders bilgileri zorunludur. Danışman bilgileri boşsa sorumlu öğretim elemanı “Atama bekliyor” görünür. En fazla 1000 ders ve 5 MB dosya yükleyebilirsiniz.</p>
                  <div className="bulk-import-controls">
                    <label className="bulk-file-picker">
                      <span>Yeni ders Excel dosyası</span>
                      <input type="file" disabled={busy} accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => {
                        setNewCourseFile(event.currentTarget.files?.[0] || null);
                        clearNewCoursePreview();
                      }} />
                    </label>
                    <a className="bulk-template-button" href={dbpPath("/yeni-ders-sablonu.xlsx")} download><Download size={15} />Boş Şablon</a>
                    <button className="bulk-preview-button" type="button" onClick={previewNewCourses} disabled={busy || !newCourseFile || !selectedProgram}><FileSpreadsheet size={15} />Önizle</button>
                  </div>
                  {newCoursePreview && (
                    <>
                      <p><b>{newCoursePreview.scope.programName} — {newCoursePreview.scope.level}</b>: {newCoursePreview.rowsRead} satır okundu. Mevcut dersler değiştirilmez; yalnızca geçerli yeni dersler eklenir.</p>
                      <div className="bulk-summary-grid">
                        <b>{newCoursePreview.summary.ready} yeni ders</b><b>{newCoursePreview.summary.existing} mevcut / atlanacak</b><b>{newCoursePreview.summary.invalid} hatalı / atlanacak</b><b>{newCoursePreview.summary.unassigned} atama bekliyor</b>
                      </div>
                      <div className="bulk-table-wrap">
                        <table className="bulk-assignment-table">
                          <thead><tr><th>Satır / Ders</th><th>Dönem / Tür</th><th>T / U / Kredi / AKTS</th><th>Sorumlu öğretim elemanı</th><th>Durum</th></tr></thead>
                          <tbody>{newCoursePreview.items.map((item) => (
                            <tr key={item.rowNumber} className={item.action === "invalid" ? "needs-review" : ""}>
                              <td><b>{item.code || "Kod eksik"}</b><span>{item.name}</span><small>Excel satırı: {item.rowNumber}</small></td>
                              <td>{item.term || "Dönem eksik"}<small>{item.type}</small></td>
                              <td>{[item.theory, item.practice, item.credit, item.ects].map((value) => value ?? "—").join(" / ")}</td>
                              <td>{item.instructor || "Atama bekliyor"}<small>{item.instructorTitle}</small><small>{item.instructorEmail}</small></td>
                              <td><b>{item.action === "create" ? "Eklenecek" : item.action === "existing" ? "Zaten kayıtlı / Atlanacak" : "Hatalı / Atlanacak"}</b><small>{item.errors.join(" ")}</small></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                      <footer><button className="create" type="button" onClick={applyNewCourses} disabled={busy || !newCoursePreview.summary.ready}><Upload size={15} />{newCoursePreview.summary.ready} Yeni Dersi Ekle</button></footer>
                    </>
                  )}
                  {newCourseMessage && <p className="no-program-warning" role="status">{newCourseMessage}</p>}
                </section>
              )}

              {mode === "assign" ? (
                <label className="wide">
                  <span>Müfredattaki ders</span>
                  <select required disabled={!selectedProgram} name="code" value={selectedCourseCode} onChange={(event) => setSelectedCourseCode(event.target.value)}>
                    <option value="">{selectedProgram ? "Dersi seçin" : "Önce program seçin"}</option>
                    {curriculumCourses.map((course) => <option key={course.code} value={course.code}>{course.code} — {course.name}</option>)}
                  </select>
                </label>
              ) : (
                <>
                  <label><span>Ders kodu</span><input required name="code" placeholder="Örn. BLM 505" /></label>
                  <label><span>Ders adı</span><input required name="name" placeholder="Ders adını yazın" /></label>
                  <label><span>Zorunlu / Seçmeli</span><select required name="type" defaultValue="Seçmeli"><option>Zorunlu</option><option>Seçmeli</option></select></label>
                  <label><span>Teorik</span><input required name="theory" inputMode="numeric" placeholder="T" /></label>
                  <label><span>Uygulama</span><input required name="practice" inputMode="numeric" placeholder="U" /></label>
                  <label><span>Kredi</span><input required name="credit" inputMode="numeric" placeholder="Kredi" /></label>
                  <label><span>AKTS</span><input required name="ects" inputMode="numeric" placeholder="AKTS" /></label>
                </>
              )}

              <label key={`term-${mode}-${selectedProgramKey}-${level}-${selectedCourseCode}`}>
                <span>Dersin dönemi</span>
                <select required name="term" defaultValue={mode === "assign" ? selectedCourse?.term || "" : ""} disabled={mode === "assign" && !selectedCourse}>
                  <option value="" disabled>Dönemi seçin</option>
                  <option>Güz</option>
                  <option>Bahar</option>
                  <option>Güz ve Bahar</option>
                </select>
              </label>

              <label className="wide" key={`instructor-${mode}-${selectedProgramKey}-${level}-${selectedCourseCode}`}>
                <span>Dersi veren öğretim elemanı</span>
                <input required={mode === "create"} name="instructor" defaultValue={mode === "assign" ? selectedCourse?.instructor || "" : ""} list={instructorListId} disabled={instructorsBusy || (mode === "assign" && !selectedCourse)} placeholder={instructorsBusy ? "Akademisyenler yükleniyor" : "İsim yazın veya listeden seçin"} autoComplete="off" />
                <datalist id={instructorListId}>
                  <option value={unassignedInstructorLabel} />
                  {instructors.map((item) => <option key={item.id} value={item.name} label={item.departmentNames?.length ? item.departmentNames.slice(0, 2).join(", ") : undefined} />)}
                </datalist>
              </label>
            </div>

            {programs.length === 0 && <p className="no-program-warning">Seçilen ana ABD/ASD için bu düzeyde program bulunmuyor.</p>}
            {mode === "assign" && selectedProgram && curriculumCourses.length === 0 && <p className="no-program-warning">Bu programda henüz müfredat dersi bulunmuyor; önce Excel importu veya ders açma ekranından ders oluşturulmalı.</p>}
            {instructorsMessage && <p className="no-program-warning">{instructorsMessage}</p>}
            {message && <p className="no-program-warning">{message}</p>}

            <footer>
              <button type="button" onClick={onClose}>Vazgeç</button>
              <button className="create" type="submit" disabled={busy || programs.length === 0 || (mode === "create" && instructorsBusy) || (mode === "assign" && !selectedCourse)}>
                {mode === "assign" ? <Save size={15} /> : <Plus size={15} />}
                {mode === "assign" ? "Değişiklikleri Kaydet" : "Dersi Oluştur"}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}
