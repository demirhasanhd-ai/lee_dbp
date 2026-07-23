"use client";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  LogOut,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  DBP_MODULES,
  DEFAULT_ROLE_ACCESS,
  type DbpModule,
} from "../../lib/auth/access";
import { DBP_ROLES, DBP_ROLE_KEYS, type DbpRole } from "../../lib/auth/roles";
import { ProgramProfileEditor } from "./ProgramProfileEditor";
import { CourseBolognaEditor } from "./CourseBolognaEditor";
import { CourseCreateDialog } from "./CourseCreateDialog";
import { ProgramPublishControl } from "./ProgramPublishControl";
import { QualityReports } from "./QualityReports";
import { ReviewQueue } from "./ReviewQueue";
import { LEE_PROGRAMS, type LeeProgram } from "../../lib/data/programs";
import { officialCoursesForProgram } from "../../lib/data/officialCourses";
type Session = {
  name: string;
  username: string;
  role: DbpRole;
  department: string;
};
type Course = {
  code: string;
  name: string;
  status: string;
  level: "Tezsiz Yüksek Lisans" | "Tezli Yüksek Lisans" | "Doktora";
};
const courses: Course[] = [
  {
    code: "BLM 501",
    name: "Bilimsel Araştırma Yöntemleri",
    status: "Taslak",
    level: "Tezli Yüksek Lisans",
  },
  {
    code: "BLM 512",
    name: "İleri Algoritma Analizi",
    status: "Düzeltme İstendi",
    level: "Doktora",
  },
  {
    code: "BLM 598",
    name: "Yüksek Lisans Semineri",
    status: "Onaylandı",
    level: "Tezsiz Yüksek Lisans",
  },
];
const levels: Course["level"][] = [
  "Tezsiz Yüksek Lisans",
  "Tezli Yüksek Lisans",
  "Doktora",
];
const centralRoles: DbpRole[] = [
  "lee_ogrenci_isleri",
  "enstitu_sekreteri",
  "enstitu_yoneticisi",
  "admin",
];
const shortLevel = (level: Course["level"]) =>
  level === "Tezsiz Yüksek Lisans"
    ? "Tezsiz YL"
    : level === "Tezli Yüksek Lisans"
      ? "Tezli YL"
      : "Doktora";
const normalizeText = (value: string) => value.toLocaleLowerCase("tr-TR");
const coursePrefix = (programName: string) =>
  programName
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
const demoCoursesForProgram = (program: LeeProgram): Course[] => {
  const prefix = coursePrefix(program.programName);
  return program.levels.flatMap((level, levelIndex) => [
    {
      code: `${prefix} ${501 + levelIndex * 100}`,
      name: `${program.programName} Bilimsel Araştırma`,
      status: "İncelemede",
      level,
    },
    {
      code: `${prefix} ${503 + levelIndex * 100}`,
      name: `${program.programName} Kuramları`,
      status: "Taslak",
      level,
    },
    {
      code: `${prefix} ${590 + levelIndex * 100}`,
      name: "Seminer",
      status: "Onaylandı",
      level,
    },
  ]);
};
const roleByUsername: Record<string, DbpRole> = {
  "demo.akademisyen": "akademisyen",
  "demo.abd.baskani": "abd_asd_baskani",
  "demo.ogrenci.isleri": "lee_ogrenci_isleri",
  "demo.enstitu.sekreteri": "enstitu_sekreteri",
  "demo.enstitu.yoneticisi": "enstitu_yoneticisi",
  "demo.admin": "admin",
};
const repairText = (value: string) =>
  value
    .replaceAll("Ä°", "İ")
    .replaceAll("Ä±", "ı")
    .replaceAll("ÅŸ", "ş")
    .replaceAll("Åž", "Ş")
    .replaceAll("ÄŸ", "ğ")
    .replaceAll("Äž", "Ğ")
    .replaceAll("Ã¼", "ü")
    .replaceAll("Ãœ", "Ü")
    .replaceAll("Ã¶", "ö")
    .replaceAll("Ã–", "Ö")
    .replaceAll("Ã§", "ç")
    .replaceAll("Ã‡", "Ç");
const normalizeSessionRole = (value: Session): DbpRole => {
  if (value.role && DEFAULT_ROLE_ACCESS[value.role]) return value.role;
  const byUsername = roleByUsername[value.username];
  if (byUsername) return byUsername;
  const hint = repairText(`${value.name} ${value.department}`).toLocaleLowerCase("tr-TR");
  if (
    hint.includes("abd") ||
    hint.includes("asd") ||
    hint.includes("başkan") ||
    hint.includes("baskan")
  )
    return "abd_asd_baskani";
  if (hint.includes("öğrenci") || hint.includes("ogrenci"))
    return "lee_ogrenci_isleri";
  if (hint.includes("sekreter")) return "enstitu_sekreteri";
  if (hint.includes("admin") || hint.includes("sistem")) return "admin";
  if (hint.includes("yönetici") || hint.includes("yonetici"))
    return "enstitu_yoneticisi";
  return "akademisyen";
};

export function RoleDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [active, setActive] = useState<DbpModule>("my_courses");
  const [saved, setSaved] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<LeeProgram | null>(null);
  const [showCourseCreate, setShowCourseCreate] = useState(false);
  const [showProgramCreate, setShowProgramCreate] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem("lee-dbp-session");
    if (!raw) {
      location.href = "/yonetim";
      return;
    }
    try {
      const value = JSON.parse(raw) as Session;
      const repairedValue = {
        ...value,
        name: repairText(value.name || value.username || "Kullanıcı"),
        department: repairText(value.department || "LEE"),
      };
      const normalizedValue = { ...repairedValue, role: normalizeSessionRole(repairedValue) };
      setSession(normalizedValue);
      setActive(DEFAULT_ROLE_ACCESS[normalizedValue.role][0]);
    } catch {
      location.href = "/yonetim";
    }
  }, []);
  if (!session)
    return <main className="panel-loading">Panel hazırlanıyor…</main>;
  const modules = DEFAULT_ROLE_ACCESS[session.role];
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const canCreateCourse = [
    "lee_ogrenci_isleri",
    "enstitu_sekreteri",
    "enstitu_yoneticisi",
    "admin",
  ].includes(session.role);
  const isCentralRole = centralRoles.includes(session.role);
  const scopedPrograms = isCentralRole
    ? LEE_PROGRAMS
    : LEE_PROGRAMS.filter((program) => {
        const scope = normalizeText(session.department).replace(/\sabd|\sasd/g, "").trim();
        const department = normalizeText(program.department).replace(/\sabd|\sasd/g, "").trim();
        const programName = normalizeText(program.programName).replace(/\sabd|\sasd/g, "").trim();
        return department === scope || programName === scope;
      });
  const activeCourses = selectedProgram
    ? officialCoursesForProgram(selectedProgram).length
      ? officialCoursesForProgram(selectedProgram)
      : demoCoursesForProgram(selectedProgram)
    : courses;
  const pickerDepartments = [...new Set(scopedPrograms.map((program) => program.mainDepartment))];
  const changeModule = (module: DbpModule) => {
    setActive(module);
    setSelectedCourse(null);
    setSelectedProgram(null);
  };
  const programPicker = (actionLabel: string) => (
    <section>
      <div className="panel-intro">
        <div>
          <h2>ABD / ASD programları</h2>
          <p>
            Yetkiniz dahilindeki programı seçerek ders, program bilgisi veya
            kontrol ekranına geçin.
          </p>
        </div>
        <span>{scopedPrograms.length} program</span>
      </div>
      <div className="publish-department-list">
        {pickerDepartments.map((department, departmentIndex) => {
          const programs = scopedPrograms.filter((program) => program.mainDepartment === department);
          return (
          <details
            className="publish-department"
            key={department}
            open={departmentIndex === 0}
          >
            <summary>
              <span className="department-icon"><Building2 size={17} /></span>
              <b>{department}</b>
              <ChevronDown size={17} />
            </summary>
            <div>
              {programs.map((program) => (
              <article
                key={`${program.department}-${program.programName}`}
                role="button"
                tabIndex={0}
                aria-label={`${actionLabel}: ${program.programName}`}
                onClick={() => setSelectedProgram(program)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedProgram(program);
                  }
                }}
              >
                <div>
                  <b>{program.department}</b>
                  {program.department !== program.programName && (
                    <small>{program.programName}</small>
                  )}
                  <p>
                    {program.levels.map((level) => (
                      <span key={level}>{shortLevel(level)}</span>
                    ))}
                  </p>
                </div>
              </article>
              ))}
            </div>
          </details>
          );
        })}
      </div>
    </section>
  );
  return (
    <main className="role-dashboard">
      <aside className="panel-sidebar">
        <a className="panel-brand" href="/">
          <img src="/oku-logo.png" alt="OKÜ" />
          <span>
            <b>LEE DBP</b>
            <small>YÖNETİM PANELİ</small>
          </span>
        </a>
        <nav>
          {modules.map((module) => (
            <Fragment key={module}>
              <button
                className={active === module ? "active" : ""}
                onClick={() => changeModule(module)}
              >
                {module === "my_courses" ? (
                  <BookOpen size={16} />
                ) : module === "program_profile" ? (
                  <ClipboardCheck size={16} />
                ) : module === "permission_matrix" ? (
                  <Settings size={16} />
                ) : module === "user_roles" ? (
                  <Users size={16} />
                ) : module === "quality_reports" ? (
                  <ShieldCheck size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                <span>{DBP_MODULES[module]}</span>
              </button>
              {module === "review_queue" && canCreateCourse && (
                <button
                  className="sidebar-course-create"
                  onClick={() => setShowCourseCreate(true)}
                >
                  <Plus size={15} />
                  <span>ABD / ASD Ders Ekle</span>
                </button>
              )}
            </Fragment>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("lee-dbp-session");
            location.href = "/yonetim";
          }}
        >
          <LogOut size={15} />
          Çıkış Yap
        </button>
      </aside>
      <section className="panel-main">
        <header className="panel-header">
          <div>
            <small>{session.department}</small>
            <h1>
              {selectedCourse
                ? `${selectedCourse.code} Ders Bilgi Girişi`
                : selectedProgram
                  ? selectedProgram.programName
                : DBP_MODULES[active]}
            </h1>
          </div>
          <div className="panel-user">
            <span>{session.name.slice(0, 2).toUpperCase()}</span>
            <div>
              <b>{session.name}</b>
              <small>{DBP_ROLES[session.role].label}</small>
            </div>
          </div>
        </header>
        {saved && (
          <div className="save-toast">
            <CheckCircle2 size={16} />
            Değişiklikler kaydedildi.
          </div>
        )}
        <CourseCreateDialog
          open={showCourseCreate}
          onClose={() => setShowCourseCreate(false)}
          onCreated={save}
        />
        {showProgramCreate && (
          <div className="course-dialog-backdrop" role="presentation">
            <section className="course-create-dialog" role="dialog" aria-modal="true" aria-labelledby="program-create-title">
              <header>
                <div>
                  <small>PROGRAM YÖNETİMİ</small>
                  <h2 id="program-create-title">ABD / ASD veya Yeni Program Ekle</h2>
                </div>
                <button type="button" onClick={() => setShowProgramCreate(false)} aria-label="Kapat">×</button>
              </header>
              <form onSubmit={(event)=>{event.preventDefault();setShowProgramCreate(false);save();}}>
                <div className="create-course-grid">
                  <label className="wide"><span>Ana ABD / ASD Başkanlığı</span><select required><option value="">Seçiniz</option>{pickerDepartments.map((item)=><option key={item}>{item}</option>)}<option>Yeni Ana ABD / ASD</option></select></label>
                  <label><span>ABD / ASD adı</span><input required placeholder="Örn. Enerji Sistemleri Mühendisliği ABD"/></label>
                  <label><span>Program adı</span><input required placeholder="Örn. Enerji Sistemleri Mühendisliği"/></label>
                  <label><span>Program düzeyi</span><select><option>Tezsiz YL</option><option>Tezli YL</option><option>Doktora</option></select></label>
                  <label><span>Public başlangıç durumu</span><select><option>Enstitü onayından sonra görünsün</option><option>Şimdilik gizli kalsın</option></select></label>
                </div>
                <footer>
                  <button type="button" onClick={() => setShowProgramCreate(false)}>Vazgeç</button>
                  <button className="create" type="submit">Programı Oluştur</button>
                </footer>
              </form>
            </section>
          </div>
        )}
        {active === "my_courses" && isCentralRole && !selectedProgram && (
          programPicker("Dersleri Aç")
        )}
        {active === "my_courses" && isCentralRole && selectedProgram && !selectedCourse && (
          <section>
            <button className="back-to-courses" onClick={() => setSelectedProgram(null)}>
              <ArrowLeft size={15} />
              Programlara Dön
            </button>
            <div className="panel-intro">
              <div>
                <h2>{selectedProgram.programName} Dersleri</h2>
                <p>
                  {selectedProgram.department} altındaki ders bilgi paketlerini
                  görüntüleyin ve gerekiyorsa güncelleyin.
                </p>
              </div>
            </div>
            <div className="course-program-columns">
              {selectedProgram.levels.map((level, index) => (
                <section
                  className={`program-column tone-${index + 1}`}
                  key={level}
                >
                  <header>
                    <h3>{shortLevel(level)}</h3>
                  </header>
                  <div className="program-course-list">
                    {activeCourses
                      .filter((course) => course.level === level)
                      .map((course) => (
                        <article key={course.code}>
                          <span className="course-code">{course.code}</span>
                          <div>
                            <b>{course.name}</b>
                            <small>{course.status}</small>
                          </div>
                          <p className="course-row-actions">
                            <button onClick={() => setSelectedCourse(course)}>
                              Güncelle
                            </button>
                            <button type="button" onClick={save}>
                              Düzeltme İste
                            </button>
                          </p>
                        </article>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}
        {active === "my_courses" && !isCentralRole && !selectedCourse && (
          <section>
            <div className="panel-intro">
              <div>
                <h2>Derslerim</h2>
                <p>
                  Görevlendirildiğiniz dersleri program düzeylerine göre
                  görüntüleyin.
                </p>
              </div>
            </div>
            <div className="course-program-columns">
              {levels.map((level, index) => (
                <section
                  className={`program-column tone-${index + 1}`}
                  key={level}
                >
                  <header>
                    <h3>
                      {level === "Tezsiz Yüksek Lisans"
                        ? "Tezsiz YL"
                        : level === "Tezli Yüksek Lisans"
                          ? "Tezli YL"
                          : "Doktora"}
                    </h3>
                  </header>
                  <div className="program-course-list">
                    {courses
                      .filter((course) => course.level === level)
                      .map((course) => (
                        <article key={course.code}>
                          <span className="course-code">{course.code}</span>
                          <div>
                            <b>{course.name}</b>
                            <small>{course.status}</small>
                          </div>
                          <button onClick={() => setSelectedCourse(course)}>
                            Güncelle
                          </button>
                        </article>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}
        {active === "my_courses" && selectedCourse && (
          <section className="course-editor-page">
            <button
              className="back-to-courses"
              onClick={() => setSelectedCourse(null)}
            >
              <ArrowLeft size={15} />
              {isCentralRole ? "Ders Listesine Dön" : "Derslerime Dön"}
            </button>
            <CourseBolognaEditor onSave={save} onPublish={() => { localStorage.setItem("lee-dbp-review-queue", JSON.stringify({ code: selectedCourse.code, status: "ABD Onayı Bekliyor", public: false })); save(); }} />
          </section>
        )}
        {active === "program_profile" && isCentralRole && !selectedProgram && (
          <section>
            <div className="institute-course-action">
              <button type="button" onClick={() => setShowProgramCreate(true)}>
                <Plus size={15} />
                ABD / ASD veya Program Ekle
              </button>
            </div>
            {programPicker("Programı Aç")}
          </section>
        )}
        {active === "program_profile" && (!isCentralRole || selectedProgram) && (
          <section>
            {isCentralRole && (
              <button className="back-to-courses" onClick={() => setSelectedProgram(null)}>
                <ArrowLeft size={15} />
                Programlara Dön
              </button>
            )}
            <ProgramProfileEditor
              department={
                selectedProgram
                  ? `${selectedProgram.department} / ${selectedProgram.programName}`
                  : session.department
              }
              programName={selectedProgram?.programName}
              initialLevel={selectedProgram?.levels[0]}
              availableLevels={selectedProgram?.levels}
              mode={session.role === "admin" ? "admin" : session.role === "abd_asd_baskani" ? "edit" : "review"}
              onSave={save}
            />
          </section>
        )}
        {active === "review_queue" && isCentralRole && !selectedProgram && (
          programPicker("İncele")
        )}
        {active === "review_queue" && (!isCentralRole || selectedProgram) && (
          <section>
            {isCentralRole && (
              <button className="back-to-courses" onClick={() => setSelectedProgram(null)}>
                <ArrowLeft size={15} />
                Programlara Dön
              </button>
            )}
            <ReviewQueue
              courses={selectedProgram ? activeCourses : courses}
              role={session.role}
              onAction={save}
            />
          </section>
        )}
        {active === "publish_control" && <ProgramPublishControl onSave={save} />}
        {active === "quality_reports" && <QualityReports />}
        {(active === "permission_matrix" || active === "user_roles") && (
          <section>
            <div className="panel-intro">
              <div>
                <h2>Rol ve yetki dağılımı</h2>
                <p>
                  Modül erişimlerini rol bazında kontrol edin ve düzenleyin.
                </p>
              </div>
              <button className="primary-action" onClick={save}>
                <Save size={14} />
                Değişiklikleri Kaydet
              </button>
            </div>
            <div className="permission-table">
              <div className="permission-head">
                <span>Rol</span>
                {Object.values(DBP_MODULES).map((label) => (
                  <small key={label}>{label}</small>
                ))}
              </div>
              {DBP_ROLE_KEYS.map((role) => (
                <div className="permission-row" key={role}>
                  <b>{DBP_ROLES[role].label}</b>
                  {(Object.keys(DBP_MODULES) as DbpModule[]).map((module) => (
                    <label key={module}>
                      <input
                        type="checkbox"
                        defaultChecked={DEFAULT_ROLE_ACCESS[role].includes(
                          module,
                        )}
                      />
                      <span />
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
