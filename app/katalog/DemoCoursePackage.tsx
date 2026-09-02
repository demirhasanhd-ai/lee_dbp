"use client";
import { useEffect, useState } from "react";
import { PublicSiteHeader } from "../PublicSiteHeader";
import { dbpPath } from "../../lib/dbpPath";
import { SDG_LOGO_SRC, formatSdgGoal, resolveSdgGoals } from "../../lib/sdgGoals";
import { getCoursePackage, type CoursePackage } from "../../lib/data/coursePackages";
import { PrintCourseButton } from "./PrintCourseButton";

type DemoCoursePackageProps = {
  code: string;
  name: string;
  type?: string;
  theory?: string;
  practice?: string;
  credit?: string;
  ects?: string;
  instructor?: string;
  sdgs?: string;
  pdfHref?: string;
  department?: string;
  programName?: string;
  level?: string;
};

type PublicSavedPackage = { package: CoursePackage; name: string };

const outcomes = [
  "Bilimsel araştırma sürecinin temel aşamalarını açıklar.",
  "Uygun araştırma yöntemini seçer ve uygular.",
  "Alan yazınını bilimsel ölçütlerle değerlendirir.",
  "Elde edilen verileri analiz ederek yorumlar.",
  "Araştırma sonuçlarını etik ilkelere uygun raporlar.",
];

const weeks = [
  "Bilim ve bilimsel araştırmanın temelleri",
  "Araştırma problemi ve problem cümlesi",
  "Literatür taraması ve kaynaklara erişim",
  "Araştırma desenleri",
  "Evren ve örneklem",
  "Veri toplama araçları",
  "Ara sınav ve genel değerlendirme",
  "Nicel veri analizi",
  "Nitel veri analizi",
  "Geçerlik ve güvenirlik",
  "Bilimsel araştırma etiği",
  "Bulguların yorumlanması",
  "Akademik yazım kuralları",
  "Araştırma raporunun hazırlanması",
  "Yarıyıl sonu değerlendirmesi",
];

const genericInstructorCourseTerms = [
  "bilimsel araştırma",
  "seminer",
  "bitirme projesi",
  "tez çalışması",
  "uzmanlık alan",
  "danışmanlık dersi",
  "danışmanlık çalışması",
];

const repairText = (value: string) =>
  value
    .replaceAll("Ä°", "İ")
    .replaceAll("Ä±", "ı")
    .replaceAll("ÅŸ", "ş")
    .replaceAll("Åž", "Ş")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Äž", "Ğ")
    .replaceAll("Å", "Ş")
    .replaceAll("Å", "ş")
    .replaceAll("Ä", "Ğ")
    .replaceAll("Ä", "ğ")
    .replaceAll("Ã¼", "ü")
    .replaceAll("Ãœ", "Ü")
    .replaceAll("Ã", "Ü")
    .replaceAll("Ã¶", "ö")
    .replaceAll("Ã–", "Ö")
    .replaceAll("Ã", "Ö")
    .replaceAll("Ã§", "ç")
    .replaceAll("Ã‡", "Ç")
    .replaceAll("Ã", "Ç");

const shouldShowInstructor = (name: string, instructor?: string) => {
  if (!isMeaningfulInstructor(instructor)) return false;
  const normalized = repairText(name).toLocaleLowerCase("tr-TR");
  return !genericInstructorCourseTerms.some((term) => normalized.includes(term));
};

const isMeaningfulInstructor = (value?: string) => {
  const normalized = repairText(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return false;
  return ![
    "atama bekliyor",
    "şimdilik boş / atama bekliyor",
    "öğrencinin danışmanı",
    "öğrencinin proje danışmanı",
    "yok",
    "-",
  ].includes(normalized);
};

const resolveDisplayInstructor = (currentInstructor?: string, packageInstructor?: string) => {
  if (isMeaningfulInstructor(currentInstructor)) return repairText(currentInstructor || "");
  if (isMeaningfulInstructor(packageInstructor)) return repairText(packageInstructor || "");
  return "";
};

export function DemoCoursePackage({
  code,
  name,
  type = "Seçmeli",
  theory = "3",
  practice = "0",
  credit = "3",
  ects = "6",
  instructor,
  sdgs,
  pdfHref,
  department = "",
  programName = "",
  level = "",
}: DemoCoursePackageProps) {
  const displayCode = repairText(code);
  const staticPackage = getCoursePackage(displayCode, department, programName);
  const [saved, setSaved] = useState<PublicSavedPackage | null>(null);
  useEffect(() => {
    const query = new URLSearchParams({ code: displayCode, department, programName, level, public: "1" });
    const controller = new AbortController();
    fetch(`${dbpPath("/api/dbp/course-package")}?${query}`, { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data?.package) return;
        setSaved(toPublicCoursePackage(data.package as Record<string, unknown>, staticPackage, name));
      })
      .catch((error) => { if (error instanceof Error && error.name !== "AbortError") console.error(error); });
    return () => controller.abort();
  }, [department, displayCode, level, name, programName, staticPackage]);
  const displayName = repairText(saved?.name ?? staticPackage?.name ?? name);
  const displayType = repairText(type);
  const coursePackage = saved?.package ?? staticPackage ?? createDefaultCoursePackage({ code: displayCode, name: displayName, theory, practice, credit, ects, instructor, sdgs, level });
  const displayInstructor = resolveDisplayInstructor(instructor, coursePackage?.instructor);
  const showInstructor = shouldShowInstructor(displayName, displayInstructor);
  const packageOutcomes = coursePackage?.outcomes ?? outcomes;
  const packageWeeks = coursePackage?.weeklyTopics ?? weeks;
  const selectedSdgs = resolveSdgGoals(coursePackage?.sdgs ?? sdgs);
  const displayedEcts = Number(coursePackage?.ects ?? ects);
  const displayedTheory = Number(coursePackage?.theory ?? theory);
  const displayedPractice = Number(coursePackage?.practice ?? practice);
  const packageWorkloads = coursePackage?.workloads ?? createDefaultWorkloads(displayedEcts, displayedTheory, displayedPractice);
  const totalWorkload = packageWorkloads.reduce((total, item) => total + item.total, 0);
  return (
    <main className="demo-package-page">
      <PublicSiteHeader />
      <div className="demo-package-shell">
        <div className="package-breadcrumb">
          <a href={dbpPath("/")}>Ana Sayfa</a><span>/</span><a href={dbpPath("/katalog")}>Ders Kataloğu</a><span>/</span><b>{displayCode}</b>
        </div>
        <header className="package-title">
          <div><small>2026–2027 DERS BİLGİ PAKETİ</small><h1>{displayCode} — {displayName}</h1></div>
          {pdfHref && (
            <div className="package-title-actions">
              <PrintCourseButton href={pdfHref} label={`${displayCode} ders bilgi paketi PDF dosyasını aç`} />
            </div>
          )}
        </header>
        {showInstructor && (
          <section className="package-instructor-card" aria-label="Dersi veren öğretim elemanı">
            <span>Dersi Veren Öğretim Elemanı</span>
            <strong>{displayInstructor}</strong>
          </section>
        )}
        <section className="package-card">
          <h2>Ders Genel Bilgileri</h2>
          <div className="package-fields">
            <Field label="Dersin Adı" value={displayName} wide />
            <Field label="Ders Kodu" value={displayCode} />
            <Field label="Öğrenim Dili" value={coursePackage?.language ?? "Türkçe"} />
            {coursePackage && <Field label="Ders Düzeyi" value={coursePackage.level} />}
            {coursePackage && <Field label="Öğretim Şekli" value={coursePackage.teachingMode} />}
            <Field label="Ders Türü" value={displayType} />
            <Field label="Teorik" value={coursePackage?.theory ?? theory} />
            <Field label="Uygulama" value={coursePackage?.practice ?? practice} />
            <Field label="Kredi" value={coursePackage?.credit ?? credit} />
            <Field label="AKTS" value={coursePackage?.ects ?? ects} />
          </div>
        </section>
        <section className="package-card two">
          <TextBlock title="Dersin Amacı" text={coursePackage?.purpose ?? `${displayName} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.`} />
          <TextBlock title="Dersin İçeriği" text={coursePackage?.content ?? "Ders alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir."} />
        </section>
        <section className="package-card two"><TextBlock title="Öğretim Yöntemleri" text={coursePackage?.methods ?? "Anlatım, tartışma, örnek olay incelemesi, uygulama, bireysel çalışma ve proje sunumu."} /><TextBlock title="Kaynaklar" text={coursePackage?.resources ?? "Bilimsel araştırma yöntemleri temel kaynakları, güncel akademik makaleler ve ilgili etik yönergeler."} />{coursePackage && <TextBlock title="Ön Koşullar" text={coursePackage.prerequisites} />}</section>
        <section className="package-card"><h2>Dersin Öğrenme Çıktıları ve Bloom Düzeyleri</h2><div className="package-table-scroll"><table className="package-table outcome-bloom-table"><thead><tr><th>DÖÇ</th><th>Öğrenme Çıktısı</th><th>Bloom Düzeyi</th></tr></thead><tbody>{packageOutcomes.map((item, index) => <tr key={item}><th>DÖÇ{index + 1}</th><td>{item}</td><td>{resolveBloomLevel(item)}</td></tr>)}</tbody></table></div></section>
        <section className="package-card"><h2>Haftalık Ders Planı</h2><div className="week-grid">{packageWeeks.map((week, index) => <div key={`${week}-${index}`}><b>{index + 1}. Hafta</b><span>{week}</span></div>)}</div></section>
        <section className="package-card"><h2>Değerlendirme Sistemi</h2><table className="package-table"><thead><tr><th>Değerlendirme</th><th>Adet</th><th>Katkı</th></tr></thead><tbody>{(coursePackage?.assessments ?? [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }]).map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.count}</td><td>%{item.weight}</td></tr>)}</tbody></table></section>
        <section className="package-card"><h2>AKTS İş Yükü</h2><table className="package-table"><thead><tr><th>Etkinlik</th><th>Adet</th><th>Süre (Saat)</th><th>Toplam (Saat)</th></tr></thead><tbody>{packageWorkloads.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.count}</td><td>{formatWorkloadNumber(item.hours)}</td><td>{formatWorkloadNumber(item.total)}</td></tr>)}</tbody><tfoot><tr><th colSpan={3}>Toplam İş Yükü (Saat)</th><th>{formatWorkloadNumber(totalWorkload)}</th></tr><tr><th colSpan={3}>AKTS</th><th>{displayedEcts}</th></tr></tfoot></table></section>
        {coursePackage && <section className="package-card"><h2>DÖÇ–PÇ Katkı Matrisi</h2><div className="package-table-scroll"><table className="package-table contribution-table"><thead><tr><th>DÖÇ</th>{Array.from({ length: 11 }, (_, index) => <th key={index}>PÇ{index + 1}</th>)}</tr></thead><tbody>{coursePackage.contributionMatrix.map((row) => <tr key={row.outcome}><th>{row.outcome}</th>{row.values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div><small>Ölçek: 1 = Çok Düşük, 2 = Düşük, 3 = Orta, 4 = Yüksek, 5 = Çok Yüksek</small></section>}
        {selectedSdgs.length > 0 && <section className="package-card">
          <div className="sdg-heading">
            <img src={dbpPath(SDG_LOGO_SRC)} alt="" />
            <h2>Sürdürülebilir Kalkınma Amaçları</h2>
          </div>
          <div className="sdg-list">
            {selectedSdgs.map((goal) => (
              <article className="sdg-card" key={goal.id}>
                <img src={dbpPath(goal.imageSrc)} alt={formatSdgGoal(goal)} />
                <span>{formatSdgGoal(goal)}</span>
              </article>
            ))}
          </div>
        </section>}
      </div>
    </main>
  );
}

function toPublicCoursePackage(stored: Record<string, unknown>, fallback: CoursePackage | undefined, fallbackName: string): PublicSavedPackage {
  const identity = stored.identity as Record<string, string> | undefined;
  const details = stored.detailFields as Record<string, string> | undefined;
  const assessments = Array.isArray(stored.assessments) ? stored.assessments as CoursePackage["assessments"] : fallback?.assessments ?? [];
  const workloadRecord = stored.workloads && typeof stored.workloads === "object" ? stored.workloads as Record<string, { count: number; hours: number }> : {};
  const weeklyRecord = stored.weeklyTopics && typeof stored.weeklyTopics === "object" ? stored.weeklyTopics as Record<string, string> : {};
  const matrixRecord = Array.isArray(stored.contributionMatrix) ? stored.contributionMatrix as Record<string, number>[] : [];
  const outcomes = Array.isArray(stored.outcomes) ? stored.outcomes as string[] : fallback?.outcomes ?? [];
  const coursePackage: CoursePackage = {
    code: identity?.code || fallback?.code || "",
    language: identity?.language || fallback?.language || "Türkçe",
    level: identity?.level || fallback?.level || "Doktora",
    teachingMode: fallback?.teachingMode || "Yüz Yüze",
    instructor: details?.instructors || fallback?.instructor,
    theory: Number(identity?.theory ?? fallback?.theory ?? 0),
    practice: Number(identity?.practice ?? fallback?.practice ?? 0),
    credit: Number(identity?.credit ?? fallback?.credit ?? 0),
    ects: Number(stored.ects ?? fallback?.ects ?? 0),
    purpose: details?.purpose || fallback?.purpose || "",
    content: details?.content || fallback?.content || "",
    methods: details?.methods || fallback?.methods || "",
    prerequisites: details?.prerequisites || fallback?.prerequisites || "Yok",
    resources: details?.resources || fallback?.resources || "",
    sdgs: Array.isArray(stored.sdgs) ? stored.sdgs as string[] : fallback?.sdgs ?? [],
    outcomes,
    weeklyTopics: Object.keys(weeklyRecord).length ? Object.entries(weeklyRecord).sort(([a], [b]) => Number(a) - Number(b)).map(([, value]) => value) : fallback?.weeklyTopics ?? [],
    assessments,
    workloads: Object.keys(workloadRecord).length ? Object.entries(workloadRecord).map(([workloadName, row]) => ({ name: workloadName, count: Number(row.count), hours: Number(row.hours), total: Number(row.count) * Number(row.hours) })) : fallback?.workloads ?? [],
    contributionMatrix: matrixRecord.length ? matrixRecord.slice(0, outcomes.length).map((row, index) => ({ outcome: `DÖÇ${index + 1}`, values: Array.from({ length: 11 }, (_, pc) => Number(row[`P${pc + 1}`] ?? 0)) })) : fallback?.contributionMatrix ?? [],
    qualityChecks: Array.isArray(stored.qualityChecks) ? stored.qualityChecks as CoursePackage["qualityChecks"] : fallback?.qualityChecks,
    publicQualityChecklist: Boolean(stored.publicQualityChecklist ?? fallback?.publicQualityChecklist),
  };
  return { package: coursePackage, name: identity?.name || fallbackName };
}

function createDefaultCoursePackage({
  code,
  name,
  theory,
  practice,
  credit,
  ects,
  instructor,
  sdgs,
  level,
}: {
  code: string;
  name: string;
  theory?: string;
  practice?: string;
  credit?: string;
  ects?: string;
  instructor?: string;
  sdgs?: string;
  level?: string;
}): CoursePackage {
  const displayedEcts = Number(ects || 0);
  const displayedTheory = Number(theory || 0);
  const displayedPractice = Number(practice || 0);
  return {
    code,
    language: "Türkçe",
    level: level || "Lisansüstü",
    teachingMode: "Yüz Yüze",
    instructor: instructor ? repairText(instructor) : undefined,
    theory: displayedTheory,
    practice: displayedPractice,
    credit: Number(credit || displayedTheory + displayedPractice),
    ects: displayedEcts,
    purpose: `${name} kapsamında öğrencinin bilimsel araştırma, uygulama ve değerlendirme becerilerini geliştirmesi amaçlanır.`,
    content: "Ders alanına ilişkin kuramsal çerçeve, güncel yaklaşımlar, uygulama örnekleri, veri toplama, analiz ve akademik raporlama konuları işlenir.",
    methods: "Anlatım, tartışma, örnek olay incelemesi, uygulama, bireysel çalışma ve proje sunumu.",
    prerequisites: "Yok",
    resources: "Bilimsel araştırma yöntemleri temel kaynakları, güncel akademik makaleler ve ilgili etik yönergeler.",
    sdgs: sdgs?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    outcomes,
    weeklyTopics: weeks,
    assessments: [{ name: "Ara Sınav", count: 1, weight: 40 }, { name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60 }],
    workloads: createDefaultWorkloads(displayedEcts, displayedTheory, displayedPractice),
    contributionMatrix: createDefaultContributionMatrix(outcomes),
  };
}

function createDefaultContributionMatrix(items: string[]) {
  return items.map((_, outcomeIndex) => ({
    outcome: `DÖÇ${outcomeIndex + 1}`,
    values: Array.from({ length: 11 }, (_, pcIndex) => {
      if (outcomeIndex === pcIndex % Math.max(items.length, 1)) return 4;
      if ((outcomeIndex + pcIndex) % 4 === 0) return 2;
      if ((outcomeIndex + pcIndex) % 3 === 0) return 1;
      return 0;
    }),
  }));
}

function createDefaultWorkloads(ects: number, theory: number, practice: number) {
  const courseHours = 15 * (theory + practice);
  const examHours = 45;
  const outsideHours = Math.max(ects * 30 - courseHours - examHours, 0);
  return [
    { name: "Ders Süresi", count: 15, hours: theory + practice, total: courseHours },
    { name: "Sınıf Dışı Çalışma Süresi", count: 15, hours: outsideHours / 15, total: outsideHours },
    { name: "Ara Sınav Hazırlığı", count: 1, hours: 20, total: 20 },
    { name: "Yarıyıl Sonu Sınavı Hazırlığı", count: 1, hours: 25, total: 25 },
  ];
}

function resolveBloomLevel(outcome: string) {
  const normalized = outcome.toLocaleLowerCase("tr-TR");
  if (/tasarlar|geliştirir|oluşturur|üretir|yapılandırır|dönüştürür|modeller|bütünleştirir|sentezler|önerir|hazırlar/.test(normalized)) return "Yaratma";
  if (/değerlendirir|eleştirir|savunur|gerekçelendirir|yorumlar|seçer|tartışır|önceliklendirir|kanıtlar/.test(normalized)) return "Değerlendirme";
  if (/analiz eder|çözümler|karşılaştırır|ayırt eder|inceler/.test(normalized)) return "Analiz";
  if (/uygular|kullanır|yürütür|hesaplar|planlar|raporlar|sunar|yanıtlar|belirler|görselleştirir|düzenler|ayırır|haritalar|test eder|yapar/.test(normalized)) return "Uygulama";
  if (/açıklar|özetler|sınıflandırır|ilişkilendirir/.test(normalized)) return "Anlama";
  return "Değerlendirme";
}

function formatWorkloadNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <div className={`package-field${wide ? " wide" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return <article className="package-text"><h2>{title}</h2><p>{text}</p></article>;
}
