"use client";
import { CheckCircle2, Eye, Filter, MessageSquareWarning, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { DbpRole } from "../../lib/auth/roles";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";
import { findSdgGoal, formatSdgGoal } from "../../lib/sdgGoals";
import { PrintCourseButton } from "../katalog/PrintCourseButton";

type ReviewCourse = { code: string; name: string; status: string; level?: string; department?: string; programName?: string };
type ReviewSession = { username: string; name: string; role: string; department: string };
type ReviewMode = "committee" | "chair" | "institute";
type StatusFilter = "pending" | "approved" | "all";
type StoredWorkload = { count?: number; hours?: number; custom?: boolean };
type StoredAssessment = { id?: number; name?: string; count?: number; weight?: number };
type StoredCoursePackage = {
  identity?: Record<string, string | number>;
  detailFields?: Record<string, string>;
  outcomes?: string[];
  assessments?: StoredAssessment[];
  workloads?: Record<string, StoredWorkload> | Array<StoredWorkload & { name?: string }>;
  weeklyTopics?: Record<string, string> | string[];
  structureValues?: Record<string, number>;
  contributionMatrix?: Record<string, number>[];
  sdgs?: string[];
  ects?: string | number;
  savedAt?: string;
  obsSourceUrl?: string;
};

const workflowSteps = [
  "Akademisyen Gönderdi",
  "Komisyon İncelemesi",
  "ABD/ASD Son Onayı",
  "Enstitü Onayı",
  "Yayımlandı",
];

const foldTurkishText = (value: string) =>
  value
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replaceAll("â", "a")
    .replaceAll("î", "i")
    .replaceAll("û", "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const normalizeStatus = (value: string) => foldTurkishText(value.toLocaleLowerCase("tr-TR")).trim();
const isPublishedStatus = (status: string) => ["public", normalizeStatus("Yayımlandı"), normalizeStatus("Yayınlandı")].includes(normalizeStatus(status));
const statusStage = (status: string) => {
  const value = normalizeStatus(status);
  if (value.includes("duzeltme")) return 1;
  if (value.includes("komisyon")) return 1;
  if (value.includes("abd son") || value === normalizeStatus("ABD Onayı Bekliyor")) return 2;
  if (value.includes("enstitu")) return 3;
  if (isPublishedStatus(status) || value.includes("onaylandi")) return 4;
  return 0;
};
const pendingForMode = (course: ReviewCourse, mode: ReviewMode) => {
  const status = normalizeStatus(course.status || "");
  if (mode === "committee") return status === normalizeStatus("Komisyon Onayı Bekliyor");
  if (mode === "chair") return status === normalizeStatus("ABD Son Onayı Bekliyor") || status === normalizeStatus("ABD Onayı Bekliyor");
  return status === normalizeStatus("Enstitü Onayı Bekliyor");
};
const approvedForMode = (course: ReviewCourse, mode: ReviewMode) => {
  const stage = statusStage(course.status || "");
  if (mode === "committee") return stage >= 2;
  if (mode === "chair") return stage >= 3;
  return stage >= 4;
};
const nextStatusForMode = (role: DbpRole, mode: ReviewMode) => {
  if (mode === "committee") return "ABD Son Onayı Bekliyor";
  if (mode === "chair") return "Enstitü Onayı Bekliyor";
  return role === "abd_asd_baskani" ? "Enstitü Onayı Bekliyor" : "Yayımlandı";
};
const approvalLabelForMode = (mode: ReviewMode) =>
  mode === "committee" ? "Komisyon Onayı" : mode === "chair" ? "ABD Son Onayı" : "Onayla ve Yayınla";
const detailLabels: Array<[string, string]> = [
  ["purpose", "Dersin Amacı"],
  ["content", "Dersin İçeriği"],
  ["methods", "Dersin Yöntem ve Teknikleri"],
  ["prerequisites", "Ön Koşulları"],
  ["coordinator", "Dersin Koordinatörü"],
  ["instructors", "Dersi Veren Öğretim Elemanı / Elemanları"],
  ["assistants", "Dersin Yardımcıları"],
  ["resources", "Ders Kaynakları"],
];
const contributionColumns = Array.from({ length: 11 }, (_, index) => `P${index + 1}`);

function workloadEntries(workloads: StoredCoursePackage["workloads"]) {
  if (!workloads) return [];
  if (Array.isArray(workloads)) return workloads.map((row) => ({ name: row.name || "İş yükü", count: Number(row.count || 0), hours: Number(row.hours || 0) }));
  return Object.entries(workloads).map(([name, row]) => ({ name, count: Number(row.count || 0), hours: Number(row.hours || 0) }));
}

function weeklyEntries(weeklyTopics: StoredCoursePackage["weeklyTopics"]) {
  if (!weeklyTopics) return [];
  if (Array.isArray(weeklyTopics)) return weeklyTopics.map((topic, index) => [index + 1, topic] as const);
  return Object.entries(weeklyTopics)
    .sort(([first], [second]) => Number(first) - Number(second))
    .map(([week, topic]) => [Number(week), topic] as const);
}

function sdgLabel(value: string) {
  const goal = findSdgGoal(value);
  return goal ? formatSdgGoal(goal) : value;
}

function WorkflowStepper({ status }: { status: string }) {
  const activeStage = statusStage(status);
  return (
    <div className="dbp-workflow-stepper" aria-label="Ders bilgi paketi onay süreci">
      {workflowSteps.map((step, index) => (
        <span
          key={step}
          className={index < activeStage ? "done" : index === activeStage ? "current" : "waiting"}
        >
          <i>{index < activeStage ? <CheckCircle2 size={13} /> : index + 1}</i>
          <b>{step}</b>
        </span>
      ))}
    </div>
  );
}

function StoredPackagePreview({
  course,
  packageData,
  loading,
  message,
}: {
  course: ReviewCourse;
  packageData: StoredCoursePackage | null;
  loading: boolean;
  message: string;
}) {
  const identity = packageData?.identity || {};
  const details = packageData?.detailFields || {};
  const workloads = workloadEntries(packageData?.workloads);
  const workloadTotal = workloads.reduce((total, row) => total + row.count * row.hours, 0);
  const weekly = weeklyEntries(packageData?.weeklyTopics);
  const assessments = packageData?.assessments || [];
  const structureRows = Object.entries(packageData?.structureValues || {}).filter(([, value]) => Number(value) > 0);
  const matrix = packageData?.contributionMatrix || [];
  const sdgs = (packageData?.sdgs || []).filter(Boolean);
  if (loading) return <div className="review-empty-state">Kayıtlı ders bilgi paketi yükleniyor...</div>;
  if (message) return <div className="database-message">{message}</div>;
  if (!packageData) return <div className="review-empty-state">Bu ders için kayıtlı ders bilgi paketi bulunamadı.</div>;
  return (
    <div className="preview-summary preview-summary-full">
      <article className="wide"><span>Onay süreci</span><WorkflowStepper status={course.status || ""} /></article>
      <article className="wide">
        <span>Genel bilgiler</span>
        <div className="preview-field-grid">
          <p><b>Ders kodu</b>{String(identity.code || course.code)}</p>
          <p><b>Ders adı</b>{String(identity.name || course.name)}</p>
          <p><b>Düzey</b>{String(identity.level || course.level || "-")}</p>
          <p><b>Ders türü</b>{String(identity.type || "-")}</p>
          <p><b>Öğrenim dili</b>{String(identity.language || "-")}</p>
          <p><b>Teorik/Uygulama</b>{String(identity.theory || "0")} / {String(identity.practice || "0")}</p>
          <p><b>Kredi</b>{String(identity.credit || "-")}</p>
          <p><b>AKTS</b>{String(packageData.ects || identity.ects || "-")}</p>
        </div>
      </article>
      {detailLabels.map(([key, label]) => (
        <article className={["purpose", "content", "methods", "resources"].includes(key) ? "wide" : ""} key={key}>
          <span>{label}</span>
          <p>{details[key] || "-"}</p>
        </article>
      ))}
      <article className="wide">
        <span>Öğrenme çıktıları</span>
        {(packageData.outcomes || []).length ? (
          <ol>{(packageData.outcomes || []).map((outcome, index) => <li key={`${index}-${outcome}`}>{outcome || "-"}</li>)}</ol>
        ) : <p>-</p>}
      </article>
      <article className="wide">
        <span>Değerlendirme sistemi</span>
        {assessments.length ? (
          <table className="preview-data-table"><thead><tr><th>Tür</th><th>Sayı</th><th>Katkı</th></tr></thead><tbody>
            {assessments.map((item, index) => <tr key={`${index}-${item.name}`}><td>{item.name || "-"}</td><td>{item.count ?? 0}</td><td>%{item.weight ?? 0}</td></tr>)}
          </tbody></table>
        ) : <p>-</p>}
      </article>
      <article className="wide">
        <span>Haftalık konu programı</span>
        {weekly.length ? (
          <table className="preview-data-table"><thead><tr><th>Hafta</th><th>Konu</th></tr></thead><tbody>
            {weekly.map(([week, topic]) => <tr key={week}><td>{week}</td><td>{topic || "-"}</td></tr>)}
          </tbody></table>
        ) : <p>-</p>}
      </article>
      <article className="wide">
        <span>AKTS / İş yükü</span>
        {workloads.length ? (
          <table className="preview-data-table"><thead><tr><th>Etkinlik</th><th>Sayı</th><th>Süre</th><th>Toplam</th></tr></thead><tbody>
            {workloads.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.count}</td><td>{row.hours}</td><td>{row.count * row.hours}</td></tr>)}
            <tr><td><b>Toplam</b></td><td /><td /><td><b>{workloadTotal} saat</b></td></tr>
          </tbody></table>
        ) : <p>-</p>}
      </article>
      <article className="wide">
        <span>Dersin yapısı</span>
        {structureRows.length ? <p>{structureRows.map(([name, value]) => `${name} %${value}`).join(" · ")}</p> : <p>-</p>}
      </article>
      <article className="wide">
        <span>DÖÇ-PÇ katkı matrisi</span>
        {matrix.length ? (
          <table className="preview-data-table contribution-preview-table"><thead><tr><th>DÖÇ / PÇ</th>{contributionColumns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>
            {matrix.map((row, index) => <tr key={index}><td>DÖÇ{index + 1}</td>{contributionColumns.map((column) => <td key={column}>{row[column] || "-"}</td>)}</tr>)}
          </tbody></table>
        ) : <p>-</p>}
      </article>
      <article className="wide">
        <span>Sürdürülebilir Kalkınma Amaçları</span>
        {sdgs.length ? <p>{sdgs.map(sdgLabel).join(" · ")}</p> : <p>-</p>}
      </article>
    </div>
  );
}

export function ReviewQueue({
  courses,
  role,
  session,
  department,
  programName,
  mode,
  onAction,
}: {
  courses: ReviewCourse[];
  role: DbpRole;
  session: ReviewSession;
  department: string;
  programName: string;
  mode?: ReviewMode;
  onAction: () => void;
}) {
  const [preview, setPreview] = useState<ReviewCourse | null>(null);
  const [previewPackage, setPreviewPackage] = useState<StoredCoursePackage | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [correction, setCorrection] = useState<ReviewCourse | null>(null);
  const [note, setNote] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [query, setQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const reviewMode: ReviewMode = mode ?? (role === "abd_asd_baskani" ? "chair" : "institute");
  const canRequestCorrection = role !== "abd_sekreteri";
  const canApproveCourse = (course: ReviewCourse) => pendingForMode(course, reviewMode) &&
    (reviewMode === "committee" || ["abd_asd_baskani", "enstitu_yoneticisi", "admin"].includes(role));
  const canRequestCorrectionCourse = (course: ReviewCourse) => canRequestCorrection && pendingForMode(course, reviewMode);
  const approvalLabel = approvalLabelForMode(reviewMode);
  const courseSearchParams = (course: ReviewCourse) => new URLSearchParams({
    code: course.code,
    name: course.name,
    department: course.department || department,
    program: course.programName || programName,
    programName: course.programName || programName,
    level: course.level || "Doktora",
  });
  const coursePdfHref = (course: ReviewCourse) => `${dbpPath("/api/dbp/course-pdf")}?${courseSearchParams(course)}`;
  const filteredCourses = useMemo(() => {
    const queryText = normalizeStatus(query);
    return courses.filter((course) => {
      if (statusFilter === "pending" && !pendingForMode(course, reviewMode)) return false;
      if (statusFilter === "approved" && !approvedForMode(course, reviewMode)) return false;
      if (!queryText) return true;
      const haystack = normalizeStatus(`${course.code} ${course.name} ${course.department || ""} ${course.programName || ""}`);
      return haystack.includes(queryText);
    });
  }, [courses, query, reviewMode, statusFilter]);
  const openPreview = async (course: ReviewCourse) => {
    setPreview(course);
    setPreviewPackage(null);
    setPreviewMessage("");
    setPreviewLoading(true);
    try {
      const response = await fetch(`${dbpPath("/api/dbp/course-package")}?${courseSearchParams(course)}`, {
        headers: { "X-DBP-Session": dbpSessionHeader(session) },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Ders bilgi paketi alınamadı.");
      setPreviewPackage(data.package || null);
      if (!data.package) setPreviewMessage("Bu ders için kayıtlı ders bilgi paketi bulunamadı.");
    } catch (error) {
      setPreviewMessage(error instanceof Error ? error.message : "Ders bilgi paketi alınamadı.");
    } finally {
      setPreviewLoading(false);
    }
  };
  const approveCourse = async (course: ReviewCourse) => {
    const nextStatus = nextStatusForMode(role, reviewMode);
    try {
      setActionMessage("");
      const response = await fetch(dbpPath("/api/dbp/course-package/status"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({ code: course.code, department: course.department || department, programName: course.programName || programName, level: course.level || "Doktora", status: nextStatus, expectedStatus: course.status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Ders paketi onaylanamadı.");
      const finalPublication = isPublishedStatus(nextStatus);
      localStorage.setItem("lee-dbp-course-status", finalPublication ? "public" : normalizeStatus(nextStatus).replace(/\s+/g, "_"));
      localStorage.setItem("lee-dbp-review-queue", JSON.stringify({ code: course.code, status: nextStatus, public: finalPublication }));
      onAction();
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Ders paketi onaylanamadı.");
    }
  };
  const confirmAndApprove = (course: ReviewCourse) => {
    if (!window.confirm(`${course.code} ders bilgi paketini onaylamak istediğinize emin misiniz?`)) return false;
    void approveCourse(course);
    return true;
  };
  const requestCorrection = async (course: ReviewCourse) => {
    try {
      setActionMessage("");
      const response = await fetch(dbpPath("/api/dbp/course-package/status"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DBP-Session": dbpSessionHeader(session) },
        body: JSON.stringify({
          code: course.code,
          department: course.department || department,
          programName: course.programName || programName,
          level: course.level || "Doktora",
          status: "Düzeltme İstendi",
          expectedStatus: course.status,
          note,
          route: reviewMode === "committee" ? "DBP Komisyonu -> Akademisyen" : role === "abd_asd_baskani" ? "ABD/ASD Başkanı -> Akademisyen" : "Enstitü rolü -> ABD/ASD Başkanı -> Akademisyen",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Düzeltme talebi kaydedilemedi.");
      const notifications = JSON.parse(localStorage.getItem("lee-dbp-notifications") || "[]") as Array<Record<string, string>>;
      notifications.unshift({
        kind: "Ders bilgi paketi",
        target: `${course.code} ${course.name}`,
        route: reviewMode === "committee" ? "DBP Komisyonu -> Akademisyen" : role === "abd_asd_baskani" ? "ABD/ASD Başkanı -> Akademisyen" : "Enstitü rolü -> ABD/ASD Başkanı -> Akademisyen",
        note,
        date: new Date().toISOString(),
        status: "Düzeltme istendi",
      });
      localStorage.setItem("lee-dbp-notifications", JSON.stringify(notifications));
      onAction();
      setCorrection(null);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Düzeltme talebi kaydedilemedi.");
    }
  };
  return (
    <section>
      <div className="panel-intro">
        <div>
          <h2>{reviewMode === "committee" ? "Komisyon inceleme ekranı" : "İnceleme kuyruğu"}</h2>
          <p>Ders paketini ön izleyin; gerekiyorsa açıklama yazarak düzeltme isteyin veya bir sonraki onay aşamasına taşıyın.</p>
        </div>
        <span>{filteredCourses.length} / {courses.length} kayıt</span>
      </div>
      <div className="review-filters">
        <label>
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Ders adı, kodu veya program ara" />
        </label>
        <div>
          <Filter size={15} />
          <button className={statusFilter === "pending" ? "active" : ""} type="button" onClick={() => setStatusFilter("pending")}>Onay bekleyenler</button>
          <button className={statusFilter === "approved" ? "active" : ""} type="button" onClick={() => setStatusFilter("approved")}>Onaylananlar</button>
          <button className={statusFilter === "all" ? "active" : ""} type="button" onClick={() => setStatusFilter("all")}>Tümü</button>
        </div>
      </div>
      {actionMessage && <div className="database-message">{actionMessage}</div>}
      <div className="review-table">
        <div className="review-head review-head-v2">
          <span>Kayıt</span>
          <span>Süreç</span>
          <span>Durum</span>
          <span>İşlem</span>
        </div>
        {filteredCourses.length === 0 ? (
          <div className="review-empty-state">Seçili filtrelerle eşleşen ders bilgi paketi bulunamadı.</div>
        ) : filteredCourses.map((course) => (
          <div className="review-row review-row-v2" key={`${course.department || department}-${course.programName || programName}-${course.level || ""}-${course.code}`}>
            <span>
              <b>{course.code}</b>
              <small>{course.name}</small>
              <small>{course.programName || programName}</small>
            </span>
            <WorkflowStepper status={course.status || ""} />
            <span className="status-pill">{course.status || "İncelemede"}</span>
            <span className="review-actions">
              <button onClick={() => void openPreview(course)}>
                <Eye size={14} />
                Ön İzleme
              </button>
              <button style={{ display: canRequestCorrectionCourse(course) ? undefined : "none" }}
                onClick={() => {
                  if (!canRequestCorrectionCourse(course)) return;
                  setCorrection(course);
                  setNote("");
                }}
              >
                <MessageSquareWarning size={14} />
                Düzeltme İste
              </button>
              {canApproveCourse(course) && (
                <button className="approve" onClick={() => confirmAndApprove(course)}>
                  <CheckCircle2 size={14} />
                  {approvalLabel}
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
      {preview && (
        <div className="review-modal-backdrop">
          <section className="review-preview-modal">
            <header>
              <div>
                <small>DERS BİLGİ PAKETİ ÖN İZLEME</small>
                <h2>{preview.code} - {preview.name}</h2>
              </div>
              <button onClick={() => setPreview(null)} aria-label="Kapat">
                <X size={17} />
              </button>
            </header>
            <StoredPackagePreview course={preview} packageData={previewPackage} loading={previewLoading} message={previewMessage} />
            <footer>
              <PrintCourseButton href={coursePdfHref(preview)} label={`${preview.code} ders bilgi paketi PDF dosyasını aç`} />
              <button style={{ display: canRequestCorrectionCourse(preview) ? undefined : "none" }}
                onClick={() => {
                  setPreview(null);
                  if (!canRequestCorrectionCourse(preview)) return;
                  setCorrection(preview);
                }}
              >
                <MessageSquareWarning size={14} />
                Düzeltme İste
              </button>
              {canApproveCourse(preview) && (
                <button
                  className="approve"
                  onClick={() => {
                    if (confirmAndApprove(preview)) setPreview(null);
                  }}
                >
                  <CheckCircle2 size={14} />
                  {approvalLabel}
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
      {correction && (
        <div className="review-modal-backdrop">
          <section className="correction-modal">
            <header>
              <div>
                <small>DÜZELTME TALEBİ</small>
                <h2>{correction.code} - {correction.name}</h2>
              </div>
              <button onClick={() => setCorrection(null)} aria-label="Kapat">
                <X size={17} />
              </button>
            </header>
            <div className="correction-package-preview"><b>İncelenen ders paketinin tamamı</b><span>Genel bilgiler · amaç ve içerik · öğretim yöntemleri · öğrenme çıktıları · ders yapısı · değerlendirme sistemi · 15 haftalık plan · AKTS/iş yükü · ÖÇ-PÇ matrisi · SKA</span></div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void requestCorrection(correction);
              }}
            >
              <label>
                <span>Düzeltilecek alan ve açıklama</span>
                <textarea
                  required
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Örn. 6. haftanın konusu ile ÖÇ3 arasındaki ilişkiyi açıklayın; AKTS iş yükü toplamını kontrol edin."
                />
              </label>
              <small>Bu açıklama dersin akademisyenine düzeltme notu olarak iletilecektir.</small>
              <footer>
                <button type="button" onClick={() => setCorrection(null)}>
                  Vazgeç
                </button>
                <button className="request" type="submit">
                  <MessageSquareWarning size={14} />
                  Düzeltme Talebini Gönder
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
