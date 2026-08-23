"use client";

import { Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
};

type InstructorOption = {
  id: string;
  name: string;
  title?: string | null;
  email?: string | null;
  departmentNames?: string[];
  source?: string;
};

const sameText = (left = "", right = "") =>
  left.trim().toLocaleLowerCase("tr-TR") === right.trim().toLocaleLowerCase("tr-TR");

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
  const [mode, setMode] = useState<"create" | "assign">("create");
  const [main, setMain] = useState(MAIN_DEPARTMENTS[0]);
  const [level, setLevel] = useState<ProgramLevel>("Tezli Yüksek Lisans");
  const [selectedProgramKey, setSelectedProgramKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [instructorsBusy, setInstructorsBusy] = useState(false);
  const [instructorsMessage, setInstructorsMessage] = useState("");

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

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (selectedProgram?.department) params.set("department", selectedProgram.department);
    if (selectedProgram?.programName) params.set("programName", selectedProgram.programName);
    setInstructorsBusy(true);
    setInstructorsMessage("");
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
          data.source === "e_enstitu_database"
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
        if (!controller.signal.aborted) setInstructorsBusy(false);
      });
    return () => controller.abort();
  }, [open, selectedProgram?.department, selectedProgram?.programName, session]);

  if (!open) return null;

  return (
    <div className="course-dialog-backdrop" role="presentation">
      <section
        className="course-create-dialog course-management-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-create-title"
      >
        <header>
          <div>
            <small>ENSTİTÜ YETKİLİ İŞLEMİ</small>
            <h2 id="course-create-title">Ders Açma ve Öğretim Elemanı Tanımlama</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat">
            <X size={17} />
          </button>
        </header>

        <div className="course-dialog-tabs" role="tablist" aria-label="Ders yönetimi">
          <button
            type="button"
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Yeni Ders Aç
          </button>
          <button
            type="button"
            className={mode === "assign" ? "active" : ""}
            onClick={() => setMode("assign")}
          >
            Mevcut Derse Hoca Ata
          </button>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!selectedProgram) return;
            setBusy(true);
            setMessage("");
            try {
              const form = new FormData(event.currentTarget);
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
                  instructor: form.get("instructor") === "unassigned" ? "" : form.get("instructor"),
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
          }}
        >
          <div className="create-course-grid">
            <label className="wide">
              <span>Ana ABD / ASD Başkanlığı</span>
              <select
                required
                value={main}
                onChange={(event) => {
                  setMain(event.target.value);
                  setSelectedProgramKey("");
                }}
              >
                {MAIN_DEPARTMENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Program düzeyi</span>
              <select
                required
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value as ProgramLevel);
                  setSelectedProgramKey("");
                }}
              >
                <option>Tezsiz Yüksek Lisans</option>
                <option>Tezli Yüksek Lisans</option>
                <option>Doktora</option>
              </select>
            </label>

            <label className="wide">
              <span>İlgili ABD / ASD ve program</span>
              <select
                required
                value={selectedProgramKey}
                onChange={(event) => setSelectedProgramKey(event.target.value)}
              >
                <option value="" disabled>
                  Programı seçin
                </option>
                {programs.map((item) => (
                  <option
                    key={`${item.department}-${item.programName}`}
                    value={`${item.department}||${item.programName}`}
                  >
                    {item.department} — {item.programName}
                  </option>
                ))}
              </select>
            </label>

            {mode === "assign" ? (
              <label className="wide">
                <span>Müfredattaki ders</span>
                <select required disabled={!selectedProgram} name="code">
                  <option value="">
                    {selectedProgram ? "Dersi seçin" : "Önce program seçin"}
                  </option>
                  {curriculumCourses.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} — {course.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label>
                  <span>Ders kodu</span>
                  <input required name="code" placeholder="Örn. BLM 505" />
                </label>
                <label>
                  <span>Ders adı</span>
                  <input required name="name" placeholder="Ders adını yazın" />
                </label>
                <label>
                  <span>Zorunlu / Seçmeli</span>
                  <select required name="type" defaultValue="Seçmeli">
                    <option>Zorunlu</option>
                    <option>Seçmeli</option>
                  </select>
                </label>
                <label>
                  <span>Teorik</span>
                  <input required name="theory" inputMode="numeric" placeholder="T" />
                </label>
                <label>
                  <span>Uygulama</span>
                  <input required name="practice" inputMode="numeric" placeholder="U" />
                </label>
                <label>
                  <span>Kredi</span>
                  <input required name="credit" inputMode="numeric" placeholder="Kredi" />
                </label>
                <label>
                  <span>AKTS</span>
                  <input required name="ects" inputMode="numeric" placeholder="AKTS" />
                </label>
              </>
            )}

            <label className="wide">
              <span>{mode === "assign" ? "Yeni öğretim elemanı" : "Dersi veren öğretim elemanı"}</span>
              <select required name="instructor" defaultValue="" disabled={instructorsBusy}>
                <option value="" disabled>
                  {instructorsBusy ? "Akademisyenler yükleniyor" : "Akademisyeni seçin"}
                </option>
                <option value="unassigned">Şimdilik boş / atama bekliyor</option>
                {instructors.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                    {item.departmentNames?.length ? ` — ${item.departmentNames.slice(0, 2).join(", ")}` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {programs.length === 0 && (
            <p className="no-program-warning">
              Seçilen ana ABD/ASD için bu düzeyde program bulunmuyor.
            </p>
          )}

          {mode === "assign" && selectedProgram && curriculumCourses.length === 0 && (
            <p className="no-program-warning">
              Bu programda henüz müfredat dersi bulunmuyor; önce Excel importu veya ders açma
              ekranından ders oluşturulmalı.
            </p>
          )}
          {instructorsMessage && <p className="no-program-warning">{instructorsMessage}</p>}
          {message && <p className="no-program-warning">{message}</p>}

          <footer>
            <button type="button" onClick={onClose}>
              Vazgeç
            </button>
            <button
              className="create"
              type="submit"
              disabled={busy || programs.length === 0 || (mode === "assign" && curriculumCourses.length === 0)}
            >
              {mode === "assign" ? <Save size={15} /> : <Plus size={15} />}
              {mode === "assign" ? "Atamayı Kaydet" : "Dersi Oluştur"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
