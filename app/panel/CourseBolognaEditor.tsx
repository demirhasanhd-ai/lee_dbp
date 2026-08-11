"use client";
import { DownloadCloud, ExternalLink, Link2, Plus, Save, Send, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { evaluateOutcomeQuality, OutcomeQualityHint } from "./outcomeQuality";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";
import { SDG_GOALS, findSdgGoal, formatSdgGoal } from "../../lib/sdgGoals";

type Assessment = {
  id: number;
  name: string;
  count: number;
  weight: number;
  fixed?: boolean;
};
type Workload = { count: number; hours: number };
type CourseIdentity = {
  code: string;
  name: string;
  status: string;
  level: string;
  department?: string;
  programName?: string;
};
type SessionIdentity = {
  username: string;
  name: string;
  role: string;
  readOnly?: boolean;
};
type ObsDraft = {
  sourceUrl: string;
  obsCourseId: string;
  code: string;
  name: string;
  semester: number;
  theory: number;
  practice: number;
  lab: number;
  credit: number;
  ects: number;
  updatedAt: string;
  details: {
    language?: string;
    level?: string;
    type?: string;
    teachingMode?: string;
    purpose?: string;
    content?: string;
    methods?: string;
    prerequisites?: string;
    coordinator?: string;
    instructors?: string;
    assistants?: string;
  };
  resources?: string;
  structures: Record<string, number>;
  assessments: Assessment[];
  workloads: Record<string, Workload>;
  outcomes: string[];
  weeklyTopics: Record<string, string>;
  contributionMatrix: Record<string, number>[];
};

const weeks = Array.from({ length: 15 }, (_, index) => index + 1);
const fixedOutcomeCount = 5;
const defaultAssessments: Assessment[] = [
  { id: 1, name: "Ara Sınav", count: 1, weight: 40, fixed: true },
  { id: 2, name: "Yarıyıl Sonu Sınavı", count: 1, weight: 60, fixed: true },
];
const defaultWorkloads: Record<string, Workload> = {
  "Ders Süresi": { count: 15, hours: 3 },
  "Sınıf Dışı Çalışma": { count: 15, hours: 2 },
  "Ara Sınav": { count: 1, hours: 2 },
  "Yarıyıl Sonu Sınavı": { count: 1, hours: 2 },
};
const structures = [
  "Matematik ve Temel Bilimler",
  "Mühendislik Bilimleri",
  "Mühendislik Tasarımı",
  "Sosyal Bilimler",
  "Eğitim Bilimleri",
  "Fen Bilimleri",
  "Sağlık Bilimleri",
  "Alan Bilgisi",
];
const longFields = [
  ["purpose", "Dersin Amacı", "Bilimsel araştırma sürecinin temel kavramlarını kazandırmak."],
  ["content", "Dersin İçeriği", "Araştırma problemi, literatür taraması, yöntem, analiz ve etik."],
  ["methods", "Dersin Yöntem ve Teknikleri", "Anlatım, tartışma, örnek olay, uygulama ve proje."],
  ["prerequisites", "Ön Koşulları", "Yok"],
  ["coordinator", "Dersin Koordinatörü", "Dr. Öğr. Üyesi Ayşe Yılmaz"],
  ["instructors", "Dersi Veren Öğretim Elemanı / Elemanları", "Dr. Öğr. Üyesi Ayşe Yılmaz"],
  ["assistants", "Dersin Yardımcıları", "Yok"],
  ["resources", "Ders Kaynakları", "Temel ve yardımcı kaynakları girin."],
] as const;

function sessionHeader(session: SessionIdentity) {
  return dbpSessionHeader(session);
}

function serializeForm(form: HTMLFormElement) {
  const fields: Record<string, string | boolean> = {};
  Array.from(form.querySelectorAll("input, textarea, select")).forEach((control, index) => {
    if (
      !(control instanceof HTMLInputElement) &&
      !(control instanceof HTMLTextAreaElement) &&
      !(control instanceof HTMLSelectElement)
    ) return;
    if (control instanceof HTMLInputElement && ["button", "submit", "reset"].includes(control.type)) return;
    const label = control.closest("label")?.querySelector("span")?.textContent?.trim();
    const key = control.getAttribute("name") || control.getAttribute("aria-label") || label || `field_${index + 1}`;
    fields[key] = control instanceof HTMLInputElement && control.type === "checkbox" ? control.checked : control.value;
  });
  return fields;
}

const emptyOutcomes = () => Array.from({ length: fixedOutcomeCount }, () => "");
const emptyWeeklyTopics = () => Object.fromEntries(weeks.map((week) => [week, ""])) as Record<number, string>;
const emptyStructures = () => Object.fromEntries(structures.map((item) => [item, 0])) as Record<string, number>;
const defaultDetailFields = () => Object.fromEntries(longFields.map(([key, , value]) => [key, value])) as Record<string, string>;
const emptySdgs = () => ["", "", ""];

function defaultIdentity(course: CourseIdentity) {
  return {
    name: course.name,
    code: course.code,
    theory: "3",
    practice: "0",
    credit: "3",
    level: course.level.includes("Doktora") ? "Doktora" : course.level.includes("Tezsiz") ? "Tezsiz Yüksek Lisans" : "Yüksek Lisans",
    type: "Zorunlu",
    language: "Türkçe",
  };
}

function shouldFill(current: string | number, initial: string | number, mode: "empty" | "overwrite") {
  return mode === "overwrite" || String(current ?? "").trim() === "" || String(current) === String(initial);
}

function isMeaningfulText(value: string, minimumWords = 4, minimumLength = 20) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").filter((word) => /[\p{L}\p{N}]/u.test(word));
  return normalized.length >= minimumLength && words.length >= minimumWords;
}

export function CourseBolognaEditor({
  course,
  session,
  onSave,
  onPublish,
}: {
  course: CourseIdentity;
  session: SessionIdentity;
  onSave: () => void;
  onPublish: () => void;
}) {
  const [workflowStatus, setWorkflowStatus] = useState("Taslak");
  const [identity, setIdentity] = useState(() => defaultIdentity(course));
  const [detailFields, setDetailFields] = useState(defaultDetailFields);
  const [outcomes, setOutcomes] = useState(emptyOutcomes);
  const [assessments, setAssessments] = useState<Assessment[]>(defaultAssessments);
  const [nextAssessment, setNextAssessment] = useState(3);
  const [workloads, setWorkloads] = useState<Record<string, Workload>>(defaultWorkloads);
  const [weeklyTopics, setWeeklyTopics] = useState<Record<number, string>>(emptyWeeklyTopics);
  const [structureValues, setStructureValues] = useState<Record<string, number>>(emptyStructures);
  const [contributionMatrix, setContributionMatrix] = useState<Record<string, number>[]>([]);
  const [sdgs, setSdgs] = useState(emptySdgs);
  const [obsOpen, setObsOpen] = useState(false);
  const [obsUrl, setObsUrl] = useState("");
  const [obsDraft, setObsDraft] = useState<ObsDraft | null>(null);
  const [obsBusy, setObsBusy] = useState(false);
  const [obsMessage, setObsMessage] = useState("");

  useEffect(() => {
    setIdentity(defaultIdentity(course));
    setDetailFields(defaultDetailFields());
    setOutcomes(emptyOutcomes());
    setAssessments(defaultAssessments);
    setWorkloads(defaultWorkloads);
    setWeeklyTopics(emptyWeeklyTopics());
    setStructureValues(emptyStructures());
    setContributionMatrix([]);
    setSdgs(emptySdgs());
    setNextAssessment(3);
    setWorkflowStatus("Taslak");
  }, [course.code, course.name, course.level]);

  const workloadNames = useMemo(
    () => [
      "Ders Süresi",
      "Sınıf Dışı Çalışma",
      ...assessments.map((item) => item.name),
    ],
    [assessments],
  );
  const totalWorkload = workloadNames.reduce((total, name) => {
    const row = workloads[name] ?? { count: 0, hours: 0 };
    return total + row.count * row.hours;
  }, 0);
  const ects = (totalWorkload / 30).toFixed(1);
  const publishIssues = useMemo(() => {
    const issues: string[] = [];
    if (!identity.code.trim() || !identity.name.trim()) {
      issues.push("Ders adı ve ders kodu doldurulmalıdır.");
    }

    const narrativeFields = [
      ["purpose", "Dersin amacı"],
      ["content", "Dersin içeriği"],
      ["methods", "Dersin yöntem ve teknikleri"],
      ["resources", "Ders kaynakları"],
    ] as const;
    for (const [key, label] of narrativeFields) {
      if (!isMeaningfulText(detailFields[key] ?? "")) {
        issues.push(`${label} en az dört kelimelik anlamlı bir açıklama içermelidir.`);
      }
    }
    if (!detailFields.coordinator?.trim() || !detailFields.instructors?.trim()) {
      issues.push("Ders koordinatörü ve dersi veren öğretim elemanı belirtilmelidir.");
    }
    if (!detailFields.prerequisites?.trim() || !detailFields.assistants?.trim()) {
      issues.push("Ön koşul ve ders yardımcısı yoksa ilgili alanlara “Yok” yazılmalıdır.");
    }

    const requiredOutcomes = outcomes.slice(0, fixedOutcomeCount);
    if (
      requiredOutcomes.length < fixedOutcomeCount ||
      requiredOutcomes.some((outcome) => evaluateOutcomeQuality(outcome, "course").status !== "good")
    ) {
      issues.push("En az beş öğrenme çıktısı açık, ölçülebilir ve öğrenci odaklı cümlelerle yazılmalıdır.");
    }

    if (weeks.some((week) => !isMeaningfulText(weeklyTopics[week] ?? "", 3, 12))) {
      issues.push("15 haftanın her biri en az üç kelimelik anlamlı bir konu açıklaması içermelidir.");
    }

    const assessmentTotal = assessments.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    if (assessmentTotal !== 100) {
      issues.push(`Değerlendirme katkılarının toplamı %100 olmalıdır (mevcut: %${assessmentTotal}).`);
    }

    const structureTotal = Object.values(structureValues).reduce((sum, value) => sum + Number(value || 0), 0);
    if (structureTotal !== 100) {
      issues.push(`Ders yapısı oranlarının toplamı %100 olmalıdır (mevcut: %${structureTotal}).`);
    }

    if (
      requiredOutcomes.some((_, outcomeIndex) =>
        !Object.values(contributionMatrix[outcomeIndex] ?? {}).some((value) => Number(value) > 0),
      )
    ) {
      issues.push("Her öğrenme çıktısı en az bir program çıktısıyla 1–5 düzeyinde eşleştirilmelidir.");
    }

    if (totalWorkload <= 0 || Number(ects) <= 0) {
      issues.push("AKTS iş yükü tablosunda geçerli etkinlik süreleri bulunmalıdır.");
    }
    return issues;
  }, [
    assessments,
    contributionMatrix,
    detailFields,
    ects,
    identity.code,
    identity.name,
    outcomes,
    structureValues,
    totalWorkload,
    weeklyTopics,
  ]);
  const updateWorkload = (name: string, key: keyof Workload, value: number) =>
    setWorkloads((current) => ({
      ...current,
      [name]: { ...(current[name] ?? { count: 0, hours: 0 }), [key]: value },
    }));
  const addAssessment = () => {
    const name = `Yeni Değerlendirme ${nextAssessment - 2}`;
    setAssessments((current) => [
      ...current,
      { id: nextAssessment, name, count: 1, weight: 0 },
    ]);
    setWorkloads((current) => ({ ...current, [name]: { count: 1, hours: 1 } }));
    setNextAssessment((value) => value + 1);
  };
  const removeAssessment = (item: Assessment) => {
    if (item.fixed) return;
    setAssessments((current) => current.filter((row) => row.id !== item.id));
    setWorkloads((current) => {
      const copy = { ...current };
      delete copy[item.name];
      return copy;
    });
  };
  const fetchObsDraft = async () => {
    setObsBusy(true);
    setObsMessage("");
    setObsDraft(null);
    try {
      const response = await fetch(dbpPath("/api/dbp/obs-course-draft"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DBP-Session": sessionHeader(session),
        },
        body: JSON.stringify({ url: obsUrl }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "OBS ders bilgisi alınamadı.");
      setObsDraft(data.draft);
      setObsMessage(`${data.draft.code} - ${data.draft.name} bulundu.`);
    } catch (error) {
      setObsMessage(error instanceof Error ? error.message : "OBS ders bilgisi alınamadı.");
    } finally {
      setObsBusy(false);
    }
  };
  const applyObsDraft = (mode: "empty" | "overwrite") => {
    if (!obsDraft) return;
    const initialIdentity = defaultIdentity(course);
    const initialDetails = defaultDetailFields();
    setIdentity((current) => ({
      name: shouldFill(current.name, initialIdentity.name, mode) ? obsDraft.name || current.name : current.name,
      code: shouldFill(current.code, initialIdentity.code, mode) ? obsDraft.code || current.code : current.code,
      theory: shouldFill(current.theory, initialIdentity.theory, mode) ? String(obsDraft.theory || current.theory) : current.theory,
      practice: shouldFill(current.practice, initialIdentity.practice, mode) ? String(obsDraft.practice || current.practice) : current.practice,
      credit: shouldFill(current.credit, initialIdentity.credit, mode) ? String(obsDraft.credit || current.credit) : current.credit,
      level: shouldFill(current.level, initialIdentity.level, mode) ? obsDraft.details.level || current.level : current.level,
      type: shouldFill(current.type, initialIdentity.type, mode) ? obsDraft.details.type || current.type : current.type,
      language: shouldFill(current.language, initialIdentity.language, mode) ? obsDraft.details.language || current.language : current.language,
    }));
    setDetailFields((current) => {
      const next = { ...current };
      const incoming: Record<string, string> = {
        purpose: obsDraft.details.purpose || "",
        content: obsDraft.details.content || "",
        methods: obsDraft.details.methods || "",
        prerequisites: obsDraft.details.prerequisites || "",
        coordinator: obsDraft.details.coordinator || "",
        instructors: obsDraft.details.instructors || "",
        assistants: obsDraft.details.assistants || "",
        resources: obsDraft.resources || "",
      };
      for (const key of Object.keys(incoming)) {
        if (incoming[key] && shouldFill(next[key], initialDetails[key], mode)) next[key] = incoming[key];
      }
      return next;
    });
    if (mode === "overwrite" || outcomes.every((item) => !item.trim())) {
      const imported = obsDraft.outcomes.length ? obsDraft.outcomes : [];
      setOutcomes([...imported, ...Array.from({ length: Math.max(0, fixedOutcomeCount - imported.length) }, () => "")]);
    }
    if (obsDraft.assessments.length && (mode === "overwrite" || JSON.stringify(assessments) === JSON.stringify(defaultAssessments))) {
      setAssessments(obsDraft.assessments.map((item, index) => ({ ...item, id: index + 1 })));
      setNextAssessment(obsDraft.assessments.length + 1);
    }
    if (Object.keys(obsDraft.workloads).length && (mode === "overwrite" || JSON.stringify(workloads) === JSON.stringify(defaultWorkloads))) {
      setWorkloads(obsDraft.workloads);
    }
    if (Object.keys(obsDraft.weeklyTopics).length && (mode === "overwrite" || Object.values(weeklyTopics).every((item) => !item.trim()))) {
      setWeeklyTopics((current) => ({ ...current, ...obsDraft.weeklyTopics }));
    }
    if (Object.keys(obsDraft.structures).length && (mode === "overwrite" || Object.values(structureValues).every((item) => Number(item) === 0))) {
      setStructureValues((current) => ({ ...current, ...obsDraft.structures }));
    }
    if (obsDraft.contributionMatrix.length && (mode === "overwrite" || contributionMatrix.length === 0)) {
      setContributionMatrix(obsDraft.contributionMatrix);
    }
    setObsOpen(false);
  };
  const persistPackage = async (form: HTMLFormElement, status: string) => {
    const response = await fetch(dbpPath("/api/dbp/course-package"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DBP-Session": sessionHeader(session),
      },
      body: JSON.stringify({
        code: identity.code,
        name: identity.name,
        department: course.department || "",
        programName: course.programName || "",
        level: course.level,
        status,
        package: {
          fields: serializeForm(form),
          identity,
          outcomes,
          assessments,
          workloads,
          weeklyTopics,
          structureValues,
          contributionMatrix,
          sdgs,
          ects,
          obsSourceUrl: obsDraft?.sourceUrl || "",
          savedAt: new Date().toISOString(),
        },
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ders paketi kaydedilemedi." }));
      throw new Error(error.message || "Ders paketi kaydedilemedi.");
    }
  };
  return (
    <form
      className="course-bologna-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (publishIssues.length > 0) return;
        await persistPackage(event.currentTarget, "ABD Onayı Bekliyor");
        setWorkflowStatus("ABD Onayı Bekliyor");
        localStorage.setItem("lee-dbp-course-status", "abd_onayi_bekliyor");
        onPublish();
      }}
    >
      <section className="course-form-card">
        <header>
          <div>
            <small>{identity.code}</small>
            <h2>{identity.name}</h2>
          </div>
          <div className="course-header-actions">
            <button type="button" className="obs-import-button" onClick={() => setObsOpen(true)}>
              <DownloadCloud size={15} /> OBS'den Doldur
            </button>
            <span>{workflowStatus}</span>
          </div>
        </header>
        <h3>Ders Genel Bilgileri</h3>
        <div className="course-general-grid">
          <label className="name">
            <span>Dersin Adı</span>
            <input name="Dersin Adı" value={identity.name} onChange={(event) => setIdentity((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label>
            <span>Kodu</span>
            <input name="Kodu" value={identity.code} onChange={(event) => setIdentity((current) => ({ ...current, code: event.target.value }))} />
          </label>
          <label>
            <span>Teorik saat</span>
            <input name="Teorik saat" type="number" value={identity.theory} onChange={(event) => setIdentity((current) => ({ ...current, theory: event.target.value }))} />
          </label>
          <label>
            <span>Uygulama saat</span>
            <input name="Uygulama saat" type="number" value={identity.practice} onChange={(event) => setIdentity((current) => ({ ...current, practice: event.target.value }))} />
          </label>
          <label>
            <span>Kredi</span>
            <input name="Kredi" type="number" value={identity.credit} onChange={(event) => setIdentity((current) => ({ ...current, credit: event.target.value }))} />
          </label>
          <label>
            <span>AKTS</span>
            <input name="AKTS" value={ects} readOnly />
          </label>
        </div>
      </section>
      <section className="course-form-card">
        <h3>Ders Bilgileri</h3>
        <div className="course-info-grid">
          <label>
            <span>Dersin seviyesi</span>
            <select name="Dersin seviyesi" value={identity.level} onChange={(event) => setIdentity((current) => ({ ...current, level: event.target.value }))}>
              <option>Yüksek Lisans</option>
              <option>Doktora</option>
              <option>Tezsiz Yüksek Lisans</option>
            </select>
          </label>
          <label>
            <span>Dersin türü</span>
            <select name="Dersin türü" value={identity.type} onChange={(event) => setIdentity((current) => ({ ...current, type: event.target.value }))}>
              <option>Zorunlu</option>
              <option>Seçmeli</option>
            </select>
          </label>
          <label>
            <span>Öğrenim dili</span>
            <select name="Öğrenim dili" value={identity.language} onChange={(event) => setIdentity((current) => ({ ...current, language: event.target.value }))}>
              <option>Türkçe</option>
              <option>İngilizce</option>
            </select>
          </label>
        </div>
        {longFields.map(([key, label]) => (
          <label className="long-field" key={key}>
            <span>{label}</span>
            <textarea name={label} value={detailFields[key]} onChange={(event) => setDetailFields((current) => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Dersin Öğrenme Çıktıları</h3>
          <button type="button" onClick={() => setOutcomes((current) => [...current, ""])}>
            <Plus size={14} /> ÖÇ Ekle
          </button>
        </div>
        <div className="learning-outcomes">
          {outcomes.map((value, index) => (
            <div key={index}>
              <span>ÖÇ{index + 1}</span>
              <div className="outcome-input-wrap">
                <textarea
                  name={`ÖÇ${index + 1}`}
                  value={value}
                  onChange={(event) => setOutcomes((current) => current.map((item, i) => i === index ? event.target.value : item))}
                  placeholder="Öğrenme çıktısını yazın"
                />
                <OutcomeQualityHint text={value} kind="course" />
              </div>
              <button
                type="button"
                aria-label={`ÖÇ ${index + 1} sil`}
                disabled={outcomes.length <= fixedOutcomeCount}
                title="LEE DBP standardında ders öğrenme çıktısı en az 5 maddede tutulur."
                onClick={() => setOutcomes((current) => current.length <= fixedOutcomeCount ? current : current.filter((_, i) => i !== index))}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>Ders Yapısı</h3>
        <div className="structure-grid">
          {structures.map((item) => (
            <label key={item}>
              <span>{item}</span>
              <div>
                <input name={item} type="number" min="0" max="100" value={structureValues[item] ?? 0} onChange={(event) => setStructureValues((current) => ({ ...current, [item]: Number(event.target.value) }))} />
                <b>%</b>
              </div>
            </label>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Değerlendirme Sistemi</h3>
          <button type="button" onClick={addAssessment}>
            <Plus size={14} /> Değerlendirme Ekle
          </button>
        </div>
        <div className="data-table assessment-table">
          <div className="table-head">
            <span>Değerlendirme türü</span>
            <span>Sayısı</span>
            <span>Katkı (%)</span>
            <span />
          </div>
          {assessments.map((item) => (
            <div key={item.id}>
              <input name={`Değerlendirme ${item.id}`} value={item.name} readOnly={item.fixed} onChange={(event) => setAssessments((current) => current.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} />
              <input type="number" min="0" value={item.count} onChange={(event) => {
                const count = Number(event.target.value);
                setAssessments((current) => current.map((row) => row.id === item.id ? { ...row, count } : row));
                updateWorkload(item.name, "count", count);
              }} />
              <input type="number" min="0" max="100" value={item.weight} onChange={(event) => setAssessments((current) => current.map((row) => row.id === item.id ? { ...row, weight: Number(event.target.value) } : row))} />
              {!item.fixed ? (
                <button type="button" onClick={() => removeAssessment(item)}>
                  <Trash2 size={14} />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>Haftalık Konu Programı</h3>
        <div className="weekly-grid">
          <div className="table-head">
            <span>Hafta</span>
            <span>Haftalık konu</span>
          </div>
          {weeks.map((week) => (
            <div key={week}>
              <b>{week}</b>
              <textarea name={`${week}. hafta konusu`} aria-label={`${week}. hafta konusu`} value={weeklyTopics[week] ?? ""} onChange={(event) => setWeeklyTopics((current) => ({ ...current, [week]: event.target.value }))} />
            </div>
          ))}
        </div>
      </section>
      <section className="course-form-card">
        <h3>AKTS / İş Yükü Tablosu</h3>
        <div className="data-table workload-table">
          <div className="table-head">
            <span>Etkinlik</span>
            <span>Sayısı</span>
            <span>Süresi (Saat)</span>
            <span>Toplam İş Yükü</span>
          </div>
          {workloadNames.map((name) => {
            const row = workloads[name] ?? { count: 0, hours: 0 };
            return (
              <div key={name}>
                <b>{name}</b>
                <input type="number" min="0" value={row.count} onChange={(event) => updateWorkload(name, "count", Number(event.target.value))} />
                <input type="number" min="0" value={row.hours} onChange={(event) => updateWorkload(name, "hours", Number(event.target.value))} />
                <input value={row.count * row.hours} readOnly />
              </div>
            );
          })}
          <div className="total-row">
            <b>Toplam İş Yükü / AKTS Kredisi</b>
            <span />
            <span />
            <strong>{totalWorkload} saat / {ects} AKTS</strong>
          </div>
        </div>
      </section>
      <section className="course-form-card">
        <h3>Dersin Program Çıktılarına Katkısı</h3>
        <p className="form-help">Her öğrenme çıktısının P1-P13 program çıktılarına katkısını 0-5 arasında belirtin.</p>
        <div className="contribution-wrap">
          <table>
            <thead>
              <tr>
                <th>ÖÇ / PÇ</th>
                {Array.from({ length: 13 }, (_, i) => <th key={i}>P{i + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {outcomes.map((_, outcome) => (
                <tr key={outcome}>
                  <th>ÖÇ{outcome + 1}</th>
                  {Array.from({ length: 13 }, (_, i) => {
                    const key = `P${i + 1}`;
                    return (
                      <td key={i}>
                        <select
                          aria-label={`ÖÇ${outcome + 1} P${i + 1} katkısı`}
                          value={String(contributionMatrix[outcome]?.[key] ?? 0)}
                          onChange={(event) => setContributionMatrix((current) => {
                            const next = [...current];
                            next[outcome] = { ...(next[outcome] || {}), [key]: Number(event.target.value) };
                            return next;
                          })}
                        >
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="course-form-card">
        <div className="section-title">
          <h3>Sürdürülebilir Kalkınma Amaçları</h3>
          <button type="button" onClick={() => setSdgs((current) => [...current, ""])}>
            <Plus size={14} /> SKA Ekle
          </button>
        </div>
        {sdgs.map((value, index) => (
          <label className="sdg-row" key={index}>
            <span>{index + 1}</span>
            <div className="sdg-preview" aria-hidden="true">
              {findSdgGoal(value) ? <img src={dbpPath(findSdgGoal(value)!.imageSrc)} alt="" /> : <b>SKA</b>}
            </div>
            <select
              name={`Sürdürülebilir Kalkınma Amacı ${index + 1}`}
              value={value}
              onChange={(event) => setSdgs((current) => current.map((item, i) => i === index ? event.target.value : item))}
              aria-label={`${index + 1}. Sürdürülebilir Kalkınma Amacı`}
            >
              <option value="">Amaç seçin</option>
              {SDG_GOALS.map((goal) => (
                <option
                  value={goal.id}
                  disabled={sdgs.some((item, itemIndex) => itemIndex !== index && item === goal.id)}
                  key={goal.id}
                >
                  {formatSdgGoal(goal)}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setSdgs((current) => current.filter((_, i) => i !== index))}>
              <Trash2 size={14} />
            </button>
          </label>
        ))}
      </section>
      <div className="course-save-bar">
        <div className="course-publish-status">
          <span>{workflowStatus === "Taslak" ? "Çalışmanızı taslak olarak kaydedebilir veya ABD/ASD onayına gönderebilirsiniz." : "Paket ABD/ASD başkanının onayını bekliyor; onaylanmadan public görünmez."}</span>
          {publishIssues.length > 0 && (
            <details className="publish-validation">
              <summary>Yayın için {publishIssues.length} eksik veya hatalı bölüm var</summary>
              <ul>{publishIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
            </details>
          )}
        </div>
        <div className="course-submit-actions">
          <button type="button" className="draft" onClick={async (event) => { const form = event.currentTarget.form; if (!form) return; await persistPackage(form, "Taslak"); setWorkflowStatus("Taslak"); localStorage.setItem("lee-dbp-course-status", "taslak"); onSave(); }}><Save size={15} />Taslağı Kaydet</button>
          <button type="submit" className="publish" disabled={publishIssues.length > 0} title={publishIssues[0] ?? "ABD/ASD onayına gönder"}><Send size={15} />Yayınla</button>
        </div>
      </div>
      {obsOpen && (
        <div className="obs-import-backdrop" role="presentation">
          <section className="obs-import-dialog" role="dialog" aria-modal="true" aria-labelledby="obs-import-title">
            <header>
              <div>
                <small>CANLI OBS</small>
                <h3 id="obs-import-title">OBS'den Ders Bilgisi Al</h3>
              </div>
              <button type="button" onClick={() => setObsOpen(false)} aria-label="Kapat"><X size={16} /></button>
            </header>
            <div className="obs-guide">
              <p>OBS'den çağırılmak istenen ders seçildikten sonra açılan sayfanın en altında bulunan linki kopyalayın.</p>
              <a className="obs-guide-link" href={dbpPath("/obs-link-guide.jpg")} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} />
                Görsel için tıklayınız
              </a>
            </div>
            <label>
              <span>OBS ders detay linki</span>
              <div className="obs-url-row">
                <Link2 size={15} />
                <input value={obsUrl} onChange={(event) => setObsUrl(event.target.value)} placeholder="https://obs.osmaniye.edu.tr/oibs/bologna/progCourseDetails.aspx?curCourse=..." />
              </div>
            </label>
            <button type="button" className="obs-fetch" disabled={obsBusy || !obsUrl.trim()} onClick={fetchObsDraft}>
              {obsBusy ? "Getiriliyor..." : "Dersi Getir"}
            </button>
            {obsMessage && <p className={obsDraft ? "obs-success" : "obs-error"}>{obsMessage}</p>}
            {obsDraft && (
              <div className="obs-found">
                <b>{obsDraft.code} - {obsDraft.name}</b>
                <span>{obsDraft.details.level || "Ders bilgi paketi"} · {obsDraft.ects || "-"} AKTS · {obsDraft.updatedAt || "Güncelleme tarihi yok"}</span>
                <footer>
                  <button type="button" onClick={() => applyObsDraft("empty")}>Boş Alanları Doldur</button>
                  <button type="button" className="primary" onClick={() => applyObsDraft("overwrite")}>Tümünü Değiştir</button>
                </footer>
              </div>
            )}
          </section>
        </div>
      )}
    </form>
  );
}
