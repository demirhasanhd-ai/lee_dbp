"use client";

import { AlertTriangle, CheckCircle2, ClipboardList, Download, Eye, EyeOff, RefreshCw, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dbpPath } from "../../lib/dbpPath";
import { storedDbpSessionHeader } from "../../lib/dbpSessionHeader";
import { downloadXlsx } from "../../lib/downloadXlsx";
import {
  qualityReportExportRows,
  qualityReportHeaders,
  qualityReportRow,
  qualityReportStatuses,
  type AdminQualityReport,
} from "../../lib/quality/adminQualityReport";
import {
  COURSE_LEARNING_OUTCOME_COUNT,
  COURSE_WEEK_COUNT,
  summarizeQualityByInstructor,
  summarizeQualityByProgram,
  type QualitySeverity,
} from "../../lib/quality/dbpQualityRules";

const severityLabel: Record<QualitySeverity, string> = {
  critical: "Kritik",
  warning: "Uyarı",
  info: "Bilgi",
};

const scoreClass = (score: number) =>
  score >= 85 ? "good" : score >= 65 ? "watch" : "risk";

export function QualityReports() {
  const [report, setReport] = useState<AdminQualityReport | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("timeout"), 45_000);
    fetch(dbpPath("/api/dbp/admin/quality-report"), {
      cache: "no-store",
      headers: { "X-DBP-Session": storedDbpSessionHeader() },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Kalite raporu alınamadı.");
        return data as AdminQualityReport;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setReport(data);
          setLoadStatus("ready");
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted || controller.signal.reason === "timeout") {
          setError(controller.signal.reason === "timeout" ? "Kalite raporu zamanında alınamadı. Tekrar deneyebilirsiniz." : reason instanceof Error ? reason.message : "Kalite raporu alınamadı.");
          setLoadStatus("error");
        }
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [reload]);
  const programSummaries = useMemo(() => summarizeQualityByProgram(report?.courses ?? [], report?.programCatalog ?? []), [report]);
  const instructorSummaries = useMemo(() => summarizeQualityByInstructor(report?.courses ?? []), [report]);
  const activePrograms = programSummaries.filter((summary) => summary.courseCount > 0);
  const criticalTotal = activePrograms.reduce((total, item) => total + item.criticalCount, 0);
  const warningTotal = activePrograms.reduce((total, item) => total + item.warningCount, 0);
  const averageScore = activePrograms.length
    ? Math.round(
        activePrograms.reduce((total, item) => total + item.score, 0) /
          activePrograms.length,
      )
    : 0;
  const departments = [...new Set(activePrograms.map((summary) => summary.mainDepartment))];
  const statuses = report ? qualityReportStatuses(report) : [];
  const headers = qualityReportHeaders(statuses);
  const numberLabel = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  const countCells = (name: string, counts: AdminQualityReport["institute"]) =>
    qualityReportRow(name, counts, statuses).slice(1).map((value, index) => (
      <td key={headers[index + 1]}>{index === 5 ? `%${numberLabel(Number(value))}` : numberLabel(Number(value))}</td>
    ));
  const exportReport = () => {
    if (!report) return;
    const date = new Date(report.generatedAt).toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
    downloadXlsx(qualityReportExportRows(report), `dbp-abd-kalite-raporu-${date}.xlsx`, "ABD Kalite Raporu");
  };

  return (
    <section className="quality-report" aria-busy={loadStatus === "loading"}>
      <div className="panel-intro">
        <div>
          <h2>Kılavuz tabanlı kalite kontrol</h2>
          <p>
            Enstitü genelindeki ders, onay ve atama durumlarını ABD / ASD bazında karşılaştırın.
            Onay ve atama sayıları halka açık kalite göstergeleriyle aynı veri tarihini ve hesaplama yöntemini kullanır.
          </p>
        </div>
        <span>OKÜ DBP Hazırlama Kılavuzu</span>
      </div>
      {loadStatus === "loading" && (
        <div className="public-empty" role="status">
          <h2>Kalite raporu veritabanından yükleniyor</h2>
          <p>Canlı ders kayıtları hazır olduğunda rapor hesaplanacak.</p>
        </div>
      )}
      {loadStatus === "error" && (
        <div className="public-empty" role="alert">
          <h2>Kalite raporu yüklenemedi</h2>
          <p>{error}</p>
          <button className="primary-action" type="button" onClick={() => { setLoadStatus("loading"); setError(""); setReload((value) => value + 1); }}><RefreshCw size={16} /> Tekrar dene</button>
        </div>
      )}

      {loadStatus === "ready" && report && <>
      <p className="quality-report-date">
        Veri tarihi: <time dateTime={report.generatedAt}>{new Date(report.generatedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</time>
        <span>Halka açık kalite göstergeleriyle birlikte günlük güncellenir.</span>
      </p>
      <div className="quality-stats">
        <article>
          <ClipboardList size={18} />
          <b>{numberLabel(report.institute.totalCourses)}</b>
          <span>Toplam ders</span>
        </article>
        <article>
          <EyeOff size={18} />
          <b>{numberLabel(report.institute.inactiveCourses)}</b>
          <span>Pasife alınmış ders</span>
        </article>
        <article>
          <Eye size={18} />
          <b>{numberLabel(report.institute.publicCourses)}</b>
          <span>Halka açık ders</span>
        </article>
        <article>
          <UserRoundCheck size={18} />
          <b>{numberLabel(report.institute.awaitingAssignmentCourses)}</b>
          <span>Hoca ataması bekleyen</span>
        </article>
        <article>
          <CheckCircle2 size={18} />
          <b>{numberLabel(report.institute.approvedCourses)}</b>
          <span>Onaylı / yayımlı ders</span>
        </article>
        <article>
          <ClipboardList size={18} />
          <b>{numberLabel(report.institute.unapprovedCourses)}</b>
          <span>Onaysız / süreçte ders</span>
        </article>
        <article>
          <CheckCircle2 size={18} />
          <b>{averageScore}%</b>
          <span>Ortalama hazırlık puanı</span>
        </article>
        <article>
          <AlertTriangle size={18} />
          <b>{criticalTotal}</b>
          <span>Kritik eksik</span>
        </article>
      </div>

      <section className="quality-panel quality-department-report" aria-labelledby="quality-department-title">
        <header>
          <div>
            <h3 id="quality-department-title">Tüm ABD / ASD’lerin ders ve onay durumları</h3>
            <p id="quality-department-scope">Toplam ders = pasif ders + halka açık ders. Onay ve atama sayıları halka açık dersler içindir.</p>
          </div>
          <button className="primary-action" type="button" onClick={exportReport}><Download size={16} /> Excel indir</button>
        </header>
        <p className="quality-table-caption">{report.departments.length} ABD / ASD · Süreç durumları ayrı kolonlarda gösterilir. Atama bekleyen sayısı onay durumu toplamına ayrıca eklenmez. Diğer kolonlar için tabloyu yatay kaydırabilirsiniz.</p>
        <div className="quality-table-scroll" role="region" aria-label="ABD / ASD ders ve onay tablosu" tabIndex={0}>
          <table className="quality-department-table" aria-describedby="quality-department-scope">
            <thead><tr>{headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
            <tbody>{report.departments.map((department) => (
              <tr key={department.department}>
                <th scope="row">{department.department}</th>
                {countCells(department.department, department)}
              </tr>
            ))}</tbody>
            <tfoot><tr><th scope="row">Enstitü toplamı</th>{countCells("Enstitü toplamı", report.institute)}</tr></tfoot>
          </table>
        </div>
      </section>

      <div className="quality-grid">
        <section className="quality-panel">
          <header>
            <h3>ABD / ASD ve program raporu</h3>
            <small>{warningTotal} uyarı · {activePrograms.length} program düzeyi</small>
          </header>
          <div className="quality-accordion-list">
            {departments.map((department, departmentIndex) => {
              const rows = activePrograms.filter(
                (summary) => summary.mainDepartment === department,
              );
              const departmentCritical = rows.reduce(
                (total, item) => total + item.criticalCount,
                0,
              );
              const departmentWarning = rows.reduce(
                (total, item) => total + item.warningCount,
                0,
              );
              return (
                <details className="quality-department" key={department} open={departmentIndex === 0}>
                  <summary>
                    <b>{department}</b>
                    <span>
                      {rows.length} program · {departmentCritical} kritik · {departmentWarning} uyarı
                    </span>
                  </summary>
                  <div className="quality-program-list">
                    {rows.map((summary) => (
                      <article key={summary.key} className={`quality-row ${scoreClass(summary.score)}`}>
                        <div>
                          <b>{summary.programName}</b>
                          <small>{summary.department} · {summary.level}</small>
                        </div>
                        <p>
                          <span>{summary.courseCount} ders</span>
                          <span>{summary.missingInstructorCount} atama</span>
                          <span>{summary.score}%</span>
                        </p>
                        {summary.sampleIssues.length > 0 && (
                          <ul>
                            {summary.sampleIssues.map((issue, issueIndex) => (
                              <li key={`${summary.key}-${issue.field}-${issueIndex}`}>
                                <i data-severity={issue.severity}>{severityLabel[issue.severity]}</i>
                                {issue.field}: {issue.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section className="quality-panel">
          <header>
            <h3>Hoca / atama raporu</h3>
            <small>En çok uyarı üreten ilk kayıtlar</small>
          </header>
          <div className="quality-instructor-list">
            {instructorSummaries.slice(0, 14).map((item) => (
              <article key={item.instructor}>
                <div>
                  <b>{item.instructor}</b>
                  <small>{item.courseCount} ders</small>
                </div>
                <p>
                  <span>{item.criticalCount} kritik</span>
                  <span>{item.warningCount} uyarı</span>
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="quality-rule-card">
        <h3>Kontrol edilecek kılavuz başlıkları</h3>
        <div>
          <span>En az {COURSE_LEARNING_OUTCOME_COUNT} ÖÇ yazılmalı; tüm çıktılar denetlenir.</span>
          <span>“Bilir, anlar, öğrenir” gibi belirsiz fiiller uyarı üretir; “fark eder” kabul edilir.</span>
          <span>{COURSE_WEEK_COUNT} haftalık ders planı tekrar/anlamsız dolgu açısından denetlenir.</span>
          <span>Değerlendirme yüzdeleri toplamı %100 olmalı.</span>
          <span>AKTS iş yükü ders AKTS’siyle uyumlu olmalı.</span>
          <span>ÖÇ-PÇ matrisi ve kaynakça boş kalmamalı.</span>
        </div>
      </section>
      </>}
    </section>
  );
}
