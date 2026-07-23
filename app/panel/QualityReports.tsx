"use client";

import { AlertTriangle, CheckCircle2, ClipboardList, UserRoundCheck } from "lucide-react";
import { OFFICIAL_COURSES } from "../../lib/data/officialCourses";
import { LEE_PROGRAMS } from "../../lib/data/programs";
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
  const programSummaries = summarizeQualityByProgram(OFFICIAL_COURSES, LEE_PROGRAMS);
  const instructorSummaries = summarizeQualityByInstructor(OFFICIAL_COURSES);
  const activePrograms = programSummaries.filter((summary) => summary.courseCount > 0);
  const criticalTotal = activePrograms.reduce((total, item) => total + item.criticalCount, 0);
  const warningTotal = activePrograms.reduce((total, item) => total + item.warningCount, 0);
  const missingInstructorTotal = activePrograms.reduce(
    (total, item) => total + item.missingInstructorCount,
    0,
  );
  const averageScore = activePrograms.length
    ? Math.round(
        activePrograms.reduce((total, item) => total + item.score, 0) /
          activePrograms.length,
      )
    : 0;
  const departments = [...new Set(activePrograms.map((summary) => summary.mainDepartment))];

  return (
    <section className="quality-report">
      <div className="panel-intro">
        <div>
          <h2>Kılavuz tabanlı kalite kontrol</h2>
          <p>
            Bu ekran yalnız Enstitü Yöneticisi ve Admin tarafından görülür; ABD,
            program, ders ve hoca bazında eksik/veri kalitesi risklerini raporlar.
          </p>
        </div>
        <span>OKÜ DBP Hazırlama Kılavuzu</span>
      </div>

      <div className="quality-stats">
        <article>
          <ClipboardList size={18} />
          <b>{OFFICIAL_COURSES.length.toLocaleString("tr-TR")}</b>
          <span>Ders kaydı</span>
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
        <article>
          <UserRoundCheck size={18} />
          <b>{missingInstructorTotal}</b>
          <span>Hoca ataması bekleyen</span>
        </article>
      </div>

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
          <span>ÖÇ sayısı {COURSE_LEARNING_OUTCOME_COUNT} maddede sabit tutulmalı.</span>
          <span>“Bilir, anlar, fark eder” gibi belirsiz fiiller uyarı üretir.</span>
          <span>{COURSE_WEEK_COUNT} haftalık ders planı tekrar/anlamsız dolgu açısından denetlenir.</span>
          <span>Değerlendirme yüzdeleri toplamı %100 olmalı.</span>
          <span>AKTS iş yükü ders AKTS’siyle uyumlu olmalı.</span>
          <span>ÖÇ-PÇ matrisi ve kaynakça boş kalmamalı.</span>
        </div>
      </section>
    </section>
  );
}
