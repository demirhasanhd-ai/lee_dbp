"use client";

import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Eye, EyeOff, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LEE_PROGRAMS, MAIN_DEPARTMENTS, type LeeProgram } from "../../lib/data/programs";
import { isProcessCourse } from "../../lib/courseProcess.mjs";
import { fetchDbpCourses, type DbpCourse } from "../../lib/data/dbpCourses";
import {
  courseVisibilityKey,
  courseContentVisibilityKey,
  fetchProgramVisibility,
  isCourseContentPublicOverride,
  isCoursePublic,
  isProgramLevelPublic,
  programLevelVisibilityKey,
  programVisibilityKey,
  readProgramVisibility,
  saveProgramVisibility,
  writeProgramVisibility,
  type ProgramVisibilityMap,
} from "../../lib/data/publicVisibility";

type PublishSession = {
  username?: string;
  name?: string;
  role?: string;
  department?: string;
  departmentId?: string | null;
  tcKimlik?: string;
};

type SelectedProgramLevel = {
  programKey: string;
  level: string;
};

type ConfirmAction =
  | { kind: "program"; program: LeeProgram; level: string; currentlyPublic: boolean }
  | { kind: "course"; course: DbpCourse; manuallyPublic: boolean }
  | { kind: "course-content"; course: DbpCourse; contentPublic: boolean };

const publicStatuses = new Set(["Yayımlandı", "Yayınlandı", "Public"]);
const isApprovedForPublicPackage = (course: DbpCourse) =>
  publicStatuses.has(course.status) && Boolean(course.hasPackage);

const firstProgramLevel = (): SelectedProgramLevel => ({
  programKey: programVisibilityKey(LEE_PROGRAMS[0]),
  level: LEE_PROGRAMS[0].levels[0],
});

const findSelectedProgram = (selected: SelectedProgramLevel) =>
  LEE_PROGRAMS.find((program) => programVisibilityKey(program) === selected.programKey) ?? LEE_PROGRAMS[0];

const coursePublicLabel = (course: DbpCourse, effectivePublic: boolean, programPublic: boolean, manuallyPublic: boolean) => {
  if (!programPublic) return "Program gizli";
  if (!manuallyPublic) return "Ders gizli";
  if (!effectivePublic) return "Katalogda gizli";
  return isApprovedForPublicPackage(course) ? "Katalogda görünür" : "İçeriği onaya hazırlanıyor";
};

export function ProgramPublishControl({ onSave, session }: { onSave: () => void; session: PublishSession }) {
  const [visibility, setVisibility] = useState<ProgramVisibilityMap>(() => readProgramVisibility());
  const [query, setQuery] = useState("");
  const [saveError, setSaveError] = useState("");
  const [selected, setSelected] = useState<SelectedProgramLevel>(() => firstProgramLevel());
  const [detailOpen, setDetailOpen] = useState(false);
  const [courses, setCourses] = useState<DbpCourse[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    fetchProgramVisibility().then((serverVisibility) => {
      setVisibility({ ...serverVisibility, ...readProgramVisibility() });
    });
  }, []);

  const selectedProgram = findSelectedProgram(selected);
  const selectedProgramPublic = isProgramLevelPublic(selectedProgram, selected.level, visibility);

  useEffect(() => {
    if (!detailOpen) return;
    let cancelled = false;
    fetchDbpCourses({
      department: selectedProgram.department,
      programName: selectedProgram.programName,
      level: selected.level,
    })
      .then((data) => {
        if (!cancelled) setCourses(data.courses);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [detailOpen, selected.level, selectedProgram.department, selectedProgram.programName]);

  const totalLevelCount = LEE_PROGRAMS.reduce((total, program) => total + program.levels.length, 0);
  const visibleCount = LEE_PROGRAMS.reduce(
    (total, program) =>
      total + program.levels.filter((level) => isProgramLevelPublic(program, level, visibility)).length,
    0,
  );
  const effectiveVisibleCourseCount = courses.filter((course) => isCoursePublic(course, visibility)).length;
  const manuallyHiddenCourseCount = courses.filter((course) => visibility[courseVisibilityKey(course)] === false).length;

  const filteredDepartments = useMemo(() => {
    const q = query.toLocaleLowerCase("tr-TR");
    return MAIN_DEPARTMENTS.filter((department) => {
      if (!q) return true;
      return department.toLocaleLowerCase("tr-TR").includes(q) || LEE_PROGRAMS.some((program) =>
        program.mainDepartment === department &&
        `${program.department} ${program.programName} ${program.levels.join(" ")}`.toLocaleLowerCase("tr-TR").includes(q),
      );
    });
  }, [query]);

  const toggleLevel = (program: LeeProgram, level: string) => {
    setVisibility((current) => ({
      ...current,
      [programLevelVisibilityKey(program, level)]: !isProgramLevelPublic(program, level, current),
    }));
  };

  const toggleCourse = (course: DbpCourse) => {
    const key = courseVisibilityKey(course);
    const manuallyPublic = visibility[key] !== false;
    setVisibility((current) => ({
      ...current,
      [key]: !manuallyPublic,
    }));
  };

  const toggleCourseContent = (course: DbpCourse) => {
    const key = courseContentVisibilityKey(course);
    const contentPublic = isCourseContentPublicOverride(course, visibility);
    setVisibility((current) => ({
      ...current,
      [key]: !contentPublic,
    }));
  };

  const selectProgramLevel = (program: LeeProgram, level: string) => {
    setSelected({ programKey: programVisibilityKey(program), level });
    setDetailOpen(true);
  };

  const requestLevelToggle = (program: LeeProgram, level: string) => {
    setConfirmAction({
      kind: "program",
      program,
      level,
      currentlyPublic: isProgramLevelPublic(program, level, visibility),
    });
  };

  const requestCourseToggle = (course: DbpCourse) => {
    setConfirmAction({
      kind: "course",
      course,
      manuallyPublic: visibility[courseVisibilityKey(course)] !== false,
    });
  };

  const requestCourseContentToggle = (course: DbpCourse) => {
    setConfirmAction({
      kind: "course-content",
      course,
      contentPublic: isCourseContentPublicOverride(course, visibility),
    });
  };

  const confirmTitle = confirmAction?.kind === "program"
    ? confirmAction.currentlyPublic
      ? "Programı publicten gizle"
      : "Programı publicte yayınla"
    : confirmAction?.kind === "course"
      ? confirmAction.manuallyPublic
        ? "Dersi publicten gizle"
        : "Dersi publicte yayınla"
      : confirmAction?.contentPublic
        ? "Ders içeriğini publicte gizle"
        : "Ders içeriğini publicte göster";
  const confirmBody = confirmAction?.kind === "program"
    ? confirmAction.currentlyPublic
      ? "Bu program ve bu programa bağlı dersler public katalogda görünmez. Derslerin kendi ayarı korunur."
      : "Program tekrar public olur. Dersler kendi görünürlük ayarına ve onay durumuna göre eski davranışına döner."
    : confirmAction?.kind === "course"
      ? confirmAction.manuallyPublic
        ? "Bu ders onaylı olsa bile public katalogda görünmez hale gelir."
        : "Dersin manuel gizleme kilidi kaldırılır. Ders onaylıysa katalogda görünür, onaylı değilse eski onay süreci mesajı devam eder."
      : confirmAction?.contentPublic
        ? "Bu ortak / süreç dersi onay sürecini tamamlamadıysa publicte tekrar onay süreci mesajı gösterilir."
        : "Bu ortak / süreç dersinin kayıtlı bilgi paketi, onay süreci tamamlanmamış olsa bile publicte gösterilir.";
  const confirmButtonLabel = confirmAction?.kind === "program"
    ? confirmAction.currentlyPublic
      ? "Evet, programı gizle"
      : "Evet, programı yayınla"
    : confirmAction?.kind === "course"
      ? confirmAction.manuallyPublic
        ? "Evet, dersi gizle"
        : "Evet, dersi yayınla"
      : confirmAction?.contentPublic
        ? "Evet, içeriği gizle"
        : "Evet, içeriği göster";

  const confirmVisibilityAction = () => {
    if (!confirmAction) return;
    if (confirmAction.kind === "program") {
      toggleLevel(confirmAction.program, confirmAction.level);
    } else if (confirmAction.kind === "course") {
      toggleCourse(confirmAction.course);
    } else {
      toggleCourseContent(confirmAction.course);
    }
    setConfirmAction(null);
  };

  const save = async () => {
    try {
      writeProgramVisibility(visibility);
      await saveProgramVisibility(visibility, session);
      setSaveError("");
      onSave();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Program görünürlüğü kaydedilemedi.");
    }
  };

  return (
    <section className="publish-control">
      <div className="panel-intro">
        <div>
          <h2>Public yayın kontrolü</h2>
          <p>Programları ve program içindeki dersleri kamuya açık katalogdan bağımsız olarak gizleyip yeniden yayınlayın.</p>
        </div>
        <button className="primary-action" onClick={save}>
          <Save size={14} />
          Görünürlüğü Kaydet
        </button>
      </div>
      {saveError && <p className="form-error">{saveError}</p>}
      {detailOpen ? (
        <div className="publish-detail-page">
          <button className="secondary-action" onClick={() => setDetailOpen(false)} type="button">
            <ArrowLeft size={15} />
            Program listesine dön
          </button>
          <section className="publish-detail">
          <header>
            <div>
              <small>SEÇİLİ PROGRAM</small>
              <h3>{selectedProgram.programName}</h3>
              <p>{selectedProgram.department} · {selected.level}</p>
            </div>
            <button className={selectedProgramPublic ? "danger-action" : "primary-action"} onClick={() => requestLevelToggle(selectedProgram, selected.level)} type="button">
              {selectedProgramPublic ? <EyeOff size={15}/> : <Eye size={15}/>}
              {selectedProgramPublic ? "Programı Publicten Gizle" : "Programı Publicte Yayınla"}
            </button>
          </header>
          <div className="publish-detail-stats">
            <div><b>{courses.length}</b><span>Ders</span></div>
            <div><b>{effectiveVisibleCourseCount}</b><span>Publicte Etkin</span></div>
            <div><b>{manuallyHiddenCourseCount}</b><span>Ders Bazlı Gizli</span></div>
          </div>
          <div className="publish-course-list">
            {courses.map((course) => {
              const key = courseVisibilityKey(course);
              const manuallyPublic = visibility[key] !== false;
              const effectivePublic = isCoursePublic(course, visibility);
              const processCourse = isProcessCourse(course);
              const contentPublic = isCourseContentPublicOverride(course, visibility);
              const label = coursePublicLabel(course, effectivePublic, selectedProgramPublic, manuallyPublic);
              const canOverrideContent = processCourse && course.hasPackage && (!isApprovedForPublicPackage(course) || contentPublic);
              return (
                <article className={effectivePublic ? "is-public" : "is-hidden"} key={key}>
                  <div>
                    <span className="course-code">{course.code}</span>
                    <b>{course.name}</b>
                    <small>{course.status || "Durum yok"} · {label}</small>
                  </div>
                  <div className="publish-course-actions">
                    <button onClick={() => requestCourseToggle(course)} type="button">
                      {manuallyPublic ? <EyeOff size={15}/> : <Eye size={15}/>}
                      {manuallyPublic ? "Dersi Publicten Gizle" : "Dersi Publicte Yayınla"}
                    </button>
                    {canOverrideContent && (
                      <button className={contentPublic ? "danger-action" : "content-action"} onClick={() => requestCourseContentToggle(course)} type="button">
                        {contentPublic ? <EyeOff size={15}/> : <Eye size={15}/>}
                        {contentPublic ? "Publicte İçeriği Gizle" : "Publicte İçeriği Göster"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {courses.length === 0 && (
              <div className="publish-course-empty">
                <BookOpen size={20}/>
                Bu program ve düzey için ders kaydı bulunamadı.
              </div>
            )}
          </div>
          </section>
        </div>
      ) : (
        <>
          <div className="publish-summary">
            <div><b>{visibleCount}</b><span>Publicte Görünen Düzey</span></div>
            <div><b>{totalLevelCount - visibleCount}</b><span>Gizlenen Düzey</span></div>
            <label><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ABD, program veya düzey ara..."/></label>
          </div>
          <div className="publish-department-list">
            {filteredDepartments.map((department) => {
              const programs = LEE_PROGRAMS.filter((program) => program.mainDepartment === department);
              return (
                <section className="publish-department" key={department}>
                  <header>
                    <b>{department}</b>
                    <span>
                      {programs.reduce(
                        (total, program) =>
                          total + program.levels.filter((level) => isProgramLevelPublic(program, level, visibility)).length,
                        0,
                      )}
                      /{programs.reduce((total, program) => total + program.levels.length, 0)} public
                    </span>
                  </header>
                  <div>
                    {programs.flatMap((program) => program.levels.map((level) => {
                      const key = programLevelVisibilityKey(program, level);
                      const publicVisible = isProgramLevelPublic(program, level, visibility);
                      return (
                        <article
                          className={publicVisible ? "is-public" : "is-hidden"}
                          key={key}
                          onClick={() => selectProgramLevel(program, level)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") selectProgramLevel(program, level);
                          }}
                        >
                          <div>
                            <b>{program.department}</b>
                            {program.department !== program.programName && <small>{program.programName}</small>}
                            <p><span>{level}</span></p>
                          </div>
                          <ChevronRight size={16} />
                        </article>
                      );
                    }))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
      {confirmAction && (
        <div className="publish-confirm-backdrop" role="presentation">
          <section className="publish-confirm" role="dialog" aria-modal="true" aria-labelledby="publish-confirm-title">
            <span><AlertTriangle size={19} /></span>
            <h3 id="publish-confirm-title">{confirmTitle}</h3>
            <p>{confirmBody}</p>
            <div>
              <button className="secondary-action" onClick={() => setConfirmAction(null)} type="button">Vazgeç</button>
              <button className={confirmAction.kind === "program" && confirmAction.currentlyPublic || confirmAction.kind === "course" && confirmAction.manuallyPublic || confirmAction.kind === "course-content" && confirmAction.contentPublic ? "danger-action" : "primary-action"} onClick={confirmVisibilityAction} type="button">
                {confirmButtonLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
