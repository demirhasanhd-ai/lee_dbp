"use client";

import { Plus, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  LEE_PROGRAMS,
  MAIN_DEPARTMENTS,
  type ProgramLevel,
} from "../../lib/data/programs";
import { officialCoursesForProgram } from "../../lib/data/officialCourses";

const instructors = [
  "Dr. Öğr. Üyesi Ayşe Yılmaz",
  "Prof. Dr. Mehmet Kaya",
  "Doç. Dr. Elif Arslan",
  "Dr. Öğr. Üyesi Ali Çelik",
  "Dr. Öğr. Üyesi Fatma Demir",
];

export function CourseCreateDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [mode, setMode] = useState<"create" | "assign">("create");
  const [main, setMain] = useState(MAIN_DEPARTMENTS[0]);
  const [level, setLevel] = useState<ProgramLevel>("Tezli Yüksek Lisans");
  const [selectedProgramKey, setSelectedProgramKey] = useState("");

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
    ? officialCoursesForProgram(selectedProgram).filter((course) => course.level === level)
    : [];

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
          onSubmit={(event) => {
            event.preventDefault();
            onCreated();
            onClose();
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
                <select required disabled={!selectedProgram}>
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
                  <input required placeholder="Örn. BLM 505" />
                </label>
                <label>
                  <span>Ders adı</span>
                  <input required placeholder="Ders adını yazın" />
                </label>
                <label>
                  <span>Zorunlu / Seçmeli</span>
                  <select required defaultValue="Seçmeli">
                    <option>Zorunlu</option>
                    <option>Seçmeli</option>
                  </select>
                </label>
                <label>
                  <span>Teorik</span>
                  <input required inputMode="numeric" placeholder="T" />
                </label>
                <label>
                  <span>Uygulama</span>
                  <input required inputMode="numeric" placeholder="U" />
                </label>
                <label>
                  <span>Kredi</span>
                  <input required inputMode="numeric" placeholder="Kredi" />
                </label>
                <label>
                  <span>AKTS</span>
                  <input required inputMode="numeric" placeholder="AKTS" />
                </label>
              </>
            )}

            <label className="wide">
              <span>{mode === "assign" ? "Yeni öğretim elemanı" : "Dersi veren öğretim elemanı"}</span>
              <select required defaultValue="">
                <option value="" disabled>
                  Akademisyeni seçin
                </option>
                <option value="unassigned">Şimdilik boş / atama bekliyor</option>
                {instructors.map((item) => (
                  <option key={item}>{item}</option>
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

          <footer>
            <button type="button" onClick={onClose}>
              Vazgeç
            </button>
            <button
              className="create"
              type="submit"
              disabled={programs.length === 0 || (mode === "assign" && curriculumCourses.length === 0)}
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
