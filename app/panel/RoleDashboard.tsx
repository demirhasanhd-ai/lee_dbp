"use client";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  HardDrive,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  UserCog,
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
import { DatabaseAdminPanel } from "./DatabaseAdminPanel";
import { CommitteeManagement } from "./CommitteeManagement";
import { ThemeToggle } from "../ThemeToggle";
import { LEE_PROGRAMS, type LeeProgram } from "../../lib/data/programs";
import { isDepartmentPoolCourse } from "../../lib/data/courseCatalog";
import { fetchDbpCourses, type DbpCourse } from "../../lib/data/dbpCourses";
import { dbpPath } from "../../lib/dbpPath";
import { dbpSessionHeader } from "../../lib/dbpSessionHeader";
import { getEEnstituUrl } from "../../lib/eEnstituUrl";
type Session = {
  name: string;
  username: string;
  role: DbpRole;
  department: string;
  departmentId?: string | null;
  email?: string;
  tcKimlik?: string;
  readOnly?: boolean;
  authProvider?: "e-enstitu";
  expiresAt?: string;
};
type Course = {
  code: string;
  name: string;
  status: string;
  instructor?: string;
  level: "Tezsiz Yüksek Lisans" | "Tezli Yüksek Lisans" | "Doktora";
  department?: string;
  programName?: string;
};
type InstructorOption = {
  id: string;
  name: string;
  email?: string | null;
  departmentNames?: string[];
};
type CommitteeMembership = {
  departmentScope: string;
  department: string;
  programName?: string;
};
type RoleAccess = Record<DbpRole, DbpModule[]>;
const moduleKeys = Object.keys(DBP_MODULES) as DbpModule[];
const cloneDefaultRoleAccess = (): RoleAccess =>
  Object.fromEntries(
    DBP_ROLE_KEYS.map((role) => [role, [...DEFAULT_ROLE_ACCESS[role]]]),
  ) as RoleAccess;
const normalizeRoleAccessPayload = (value: unknown): RoleAccess => {
  const fallback = cloneDefaultRoleAccess();
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const source = value as Partial<Record<DbpRole, unknown>>;
  for (const role of DBP_ROLE_KEYS) {
    const modules = Array.isArray(source[role]) ? source[role] : fallback[role];
    fallback[role] = [...new Set(modules.filter((module): module is DbpModule =>
      typeof module === "string" && moduleKeys.includes(module as DbpModule),
    ))];
  }
  return fallback;
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
const orderedLevelsForProgram = (
  programLevels: readonly Course["level"][],
  programCourses: readonly Course[] = [],
) => {
  const availableLevels = new Set<Course["level"]>([
    ...programLevels,
    ...programCourses.map((course) => course.level),
  ]);
  return levels.filter((level) => availableLevels.has(level));
};
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
const normalizeText = (value: string) => foldTurkishText(repairText(value).toLocaleLowerCase("tr-TR"));
const normalizeProgramScope = (value: string) =>
  normalizeText(value)
    .replace(/\b(abd|asd|anabilim dali|anasanat dali)\b/gu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normalizePersonName = (value: string) =>
  normalizeText(value)
    .replace(/\b(prof|doc|dr|ogr|uyesi|gor)\b\.?/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
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
const panelLevel = (level: string): Course["level"] => {
  const text = repairText(level);
  if (text.includes("Tezsiz")) return levels[0];
  if (text.includes("Tezli")) return levels[1];
  return levels[2];
};
const toPanelCourse = (course: DbpCourse): Course => ({
  code: course.code,
  name: course.name,
  status: course.status,
  instructor: course.instructor,
  level: panelLevel(course.level),
  department: course.department,
  programName: course.programName,
});
const roleByUsername: Record<string, DbpRole> = {
  "demo.akademisyen": "akademisyen",
  "demo.abd.baskani": "abd_asd_baskani",
  "demo.abd.sekreteri": "abd_sekreteri",
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
    (hint.includes("abd") || hint.includes("asd")) &&
    (hint.includes("sekreter") || hint.includes("secretary"))
  )
    return "abd_sekreteri";
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
const isLocalDevelopmentHost = () => {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
};
const createLocalDevelopmentSession = (): Session => ({
  name: "LEE Öğrenci İşleri",
  username: "demo.ogrenci.isleri",
  role: "lee_ogrenci_isleri",
  department: "LEE",
  authProvider: "e-enstitu",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
});
const catalogKeyForSession = (value: Session) =>
  `${value.username}|${value.role}|${value.department}`;

export function RoleDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [active, setActive] = useState<DbpModule>("my_courses");
  const [roleAccess, setRoleAccess] = useState<RoleAccess>(() => cloneDefaultRoleAccess());
  const [permissionDraft, setPermissionDraft] = useState<RoleAccess>(() => cloneDefaultRoleAccess());
  const [permissionsBusy, setPermissionsBusy] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Değişiklikler kaydedildi.");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<LeeProgram | null>(null);
  const [showCourseCreate, setShowCourseCreate] = useState(false);
  const [showProgramCreate, setShowProgramCreate] = useState(false);
  const [assignCourse, setAssignCourse] = useState<Course | null>(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [catalogCourses, setCatalogCourses] = useState<Course[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogMessage, setCatalogMessage] = useState("");
  const [catalogSessionKey, setCatalogSessionKey] = useState("");
  const [instructorOptions, setInstructorOptions] = useState<InstructorOption[]>([]);
  const [committeeMemberships, setCommitteeMemberships] = useState<CommitteeMembership[]>([]);
  const eEnstituDbpUrl = `${getEEnstituUrl()}/#/modul/ders-bilgi-paketi`;
  useEffect(() => {
    let cancelled = false;
    let raw = localStorage.getItem("lee-dbp-session");
    if (!raw) {
      if (!isLocalDevelopmentHost()) {
        location.replace(eEnstituDbpUrl);
        return;
      }
      const localSession = createLocalDevelopmentSession();
      raw = JSON.stringify(localSession);
      localStorage.setItem("lee-dbp-session", raw);
    }
    try {
      const value = JSON.parse(raw) as Session;
      if (value.expiresAt && Date.parse(value.expiresAt) <= Date.now()) {
        localStorage.removeItem("lee-dbp-session");
        if (!isLocalDevelopmentHost()) {
          location.replace(eEnstituDbpUrl);
          return;
        }
        const localSession = createLocalDevelopmentSession();
        localStorage.setItem("lee-dbp-session", JSON.stringify(localSession));
        location.replace(dbpPath("/panel"));
        return;
      }
      const repairedValue = {
        ...value,
        name: repairText(value.name || value.username || "Kullanıcı"),
        department: repairText(value.department || "LEE"),
      };
      const normalizedValue = { ...repairedValue, role: normalizeSessionRole(repairedValue) };
      setSession(normalizedValue);
      const fallbackAccess = cloneDefaultRoleAccess();
      setRoleAccess(fallbackAccess);
      setPermissionDraft(fallbackAccess);
      setActive(fallbackAccess[normalizedValue.role][0] || "my_courses");
      const accessEndpoint =
        normalizedValue.role === "admin"
          ? "/api/dbp/admin/role-module-access"
          : "/api/dbp/access";
      fetch(dbpPath(accessEndpoint), {
        headers: { "X-DBP-Session": dbpSessionHeader(normalizedValue) },
      })
        .then(async (response) => {
          if (!response.ok) throw new Error("Yetki bilgisi alinamadi.");
          return response.json();
        })
        .then((data) => {
          if (cancelled) return;
          if (data.access) {
            const normalizedAccess = normalizeRoleAccessPayload(data.access);
            setRoleAccess(normalizedAccess);
            setPermissionDraft(normalizedAccess);
            setActive((current) =>
              normalizedAccess[normalizedValue.role].includes(current)
                ? current
                : normalizedAccess[normalizedValue.role][0] || current,
            );
            return;
          }
          if (Array.isArray(data.modules)) {
            const normalizedModules = data.modules.filter((module: unknown): module is DbpModule =>
              typeof module === "string" && moduleKeys.includes(module as DbpModule),
            );
            setRoleAccess((current) => ({ ...current, [normalizedValue.role]: normalizedModules }));
            setActive((current) =>
              normalizedModules.includes(current) ? current : normalizedModules[0] || current,
            );
          }
        })
        .catch(() => {
          if (!cancelled) setPermissionMessage("Yetki bilgisi varsayilan ayarlarla acildi.");
        });
    } catch {
      localStorage.removeItem("lee-dbp-session");
      if (!isLocalDevelopmentHost()) {
        location.replace(eEnstituDbpUrl);
        return;
      }
      const localSession = createLocalDevelopmentSession();
      localStorage.setItem("lee-dbp-session", JSON.stringify(localSession));
      location.replace(dbpPath("/panel"));
    }
    return () => {
      cancelled = true;
    };
  }, [eEnstituDbpUrl]);
  const refreshCatalogCourses = async () => {
    if (!session) return;
    const requestKey = catalogKeyForSession(session);
    setCatalogLoading(true);
    setCatalogMessage("");
    try {
      const data = await fetchDbpCourses({ limit: 5000 }, {
        headers: { "X-DBP-Session": dbpSessionHeader(session) },
      });
      setCatalogCourses(data.courses.map(toPanelCourse));
      setCatalogSessionKey(requestKey);
      setCatalogMessage("");
    } catch {
      setCatalogMessage("Ders kataloğu veritabanından alınamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
      setCatalogCourses([]);
      setCatalogSessionKey(requestKey);
    } finally {
      setCatalogLoading(false);
    }
  };
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const requestKey = catalogKeyForSession(session);
    const loadCatalogCourses = async () => {
      try {
        const data = await fetchDbpCourses({ limit: 5000 }, {
          headers: { "X-DBP-Session": dbpSessionHeader(session) },
        });
        if (cancelled) return;
        setCatalogCourses(data.courses.map(toPanelCourse));
        setCatalogSessionKey(requestKey);
        setCatalogMessage("");
      } catch {
        if (cancelled) return;
        setCatalogMessage("Ders kataloğu veritabanından alınamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
        setCatalogCourses([]);
        setCatalogSessionKey(requestKey);
      }
    };
    void loadCatalogCourses();
    return () => {
      cancelled = true;
    };
  }, [session?.username, session?.role, session?.department]);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/instructors"), {
      headers: { "X-DBP-Session": dbpSessionHeader(session) },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Akademisyen listesi alınamadı.");
        setInstructorOptions(Array.isArray(data.instructors) ? data.instructors : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setInstructorOptions([]);
      });
    return () => controller.abort();
  }, [session?.username, session?.role, session?.department]);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    fetch(dbpPath("/api/dbp/committee/memberships"), {
      headers: { "X-DBP-Session": dbpSessionHeader(session) },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Komisyon üyeliği alınamadı.");
        setCommitteeMemberships(Array.isArray(data.memberships) ? data.memberships : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setCommitteeMemberships([]);
      });
    return () => controller.abort();
  }, [session?.username, session?.role, session?.department]);
  if (!session)
    return <main className="panel-loading">Panel hazırlanıyor…</main>;
  const currentCatalogKey = catalogKeyForSession(session);
  const catalogIsCurrent = catalogSessionKey === currentCatalogKey;
  const displayedCatalogCourses = catalogIsCurrent ? catalogCourses : [];
  const catalogBusy = catalogLoading || !catalogIsCurrent;
  const baseModules = roleAccess[session.role] ?? DEFAULT_ROLE_ACCESS[session.role];
  const modules = committeeMemberships.length > 0 && !baseModules.includes("commission_review")
    ? [...baseModules, "commission_review" as DbpModule]
    : baseModules;
  const save = (message = "Değişiklikler kaydedildi.") => {
    setSaveMessage(message);
    setSaved(true);
    void refreshCatalogCourses();
    setTimeout(() => setSaved(false), 1800);
  };
  const toggleRoleAccess = (role: DbpRole, module: DbpModule, checked: boolean) => {
    setPermissionDraft((current) => {
      const modulesForRole = new Set(current[role]);
      if (checked) modulesForRole.add(module);
      else modulesForRole.delete(module);
      return { ...current, [role]: moduleKeys.filter((item) => modulesForRole.has(item)) };
    });
  };
  const saveRoleAccess = async () => {
    setPermissionsBusy(true);
    setPermissionMessage("");
    try {
      const response = await fetch(dbpPath("/api/dbp/admin/role-module-access"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-DBP-Session": dbpSessionHeader(session),
        },
        body: JSON.stringify({ access: permissionDraft }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Yetki matrisi kaydedilemedi.");
      const normalizedAccess = normalizeRoleAccessPayload(data.access);
      setRoleAccess(normalizedAccess);
      setPermissionDraft(normalizedAccess);
      setPermissionMessage("Yetki dagilimi veri tabanina kaydedildi.");
      save();
    } catch (error) {
      setPermissionMessage(error instanceof Error ? error.message : "Yetki matrisi kaydedilemedi.");
    } finally {
      setPermissionsBusy(false);
    }
  };
  const canCreateCourse = ["lee_ogrenci_isleri", "admin"].includes(session.role);
  const canEditAcademicContent = session.role === "admin";
  const isCentralRole = centralRoles.includes(session.role);
  const useDemoFallback = !catalogBusy && displayedCatalogCourses.length === 0 && isLocalDevelopmentHost();
  const scopedPrograms = isCentralRole
    ? LEE_PROGRAMS
    : LEE_PROGRAMS.filter((program) => {
        const scope = normalizeProgramScope(session.department);
        const department = normalizeProgramScope(program.department);
        const programName = normalizeProgramScope(program.programName);
        return department === scope || programName === scope;
      });
  const activeProfileProgram =
    selectedProgram ?? (!isCentralRole && scopedPrograms.length === 1 ? scopedPrograms[0] : null);
  const scopedDefaultProgram = activeProfileProgram;
  const sessionPersonName = normalizePersonName(session.name);
  const coursesForProgram = (program: LeeProgram) =>
    displayedCatalogCourses.filter((course) =>
      normalizeProgramScope(course.department || "") === normalizeProgramScope(program.department) &&
      normalizeProgramScope(course.programName || "") === normalizeProgramScope(program.programName),
    );
  const assignedOfficialCourses: Course[] = displayedCatalogCourses
    .filter((course) => {
      const instructorName = normalizePersonName(course.instructor ?? "");
      return Boolean(
        sessionPersonName &&
        instructorName &&
        (instructorName === sessionPersonName ||
          instructorName.includes(sessionPersonName) ||
          sessionPersonName.includes(instructorName)),
      );
    });
  const scopedProgramCourses = scopedPrograms.flatMap(coursesForProgram);
  const sessionProgramScope = normalizeProgramScope(session.department);
  const departmentPoolCourses: Course[] = displayedCatalogCourses.filter((course) => {
    const belongsToStaticScope = scopedProgramCourses.some((candidate) =>
      candidate.code === course.code &&
      candidate.level === course.level &&
      normalizeProgramScope(candidate.department || "") === normalizeProgramScope(course.department || "") &&
      normalizeProgramScope(candidate.programName || "") === normalizeProgramScope(course.programName || ""),
    );
    const belongsToSessionScope = Boolean(
      sessionProgramScope &&
      [course.department, course.programName]
        .filter((value): value is string => Boolean(value))
        .some((value) => normalizeProgramScope(value) === sessionProgramScope),
    );
    return (belongsToStaticScope || belongsToSessionScope) && isDepartmentPoolCourse(course);
  });
  const myAssignedCourses = assignedOfficialCourses.length > 0
    ? assignedOfficialCourses
    : session.role === "abd_asd_baskani" || !useDemoFallback
      ? []
      : courses;
  const roleCourseSections = session.role === "abd_asd_baskani"
    ? [
        {
          key: "instructor",
          title: "Verdiğim Dersler",
          description: "Öğretim üyesi sıfatıyla üzerinize atanmış akademik ders bilgi paketleri.",
          courses: myAssignedCourses,
        },
        {
          key: "department-pool",
          title: "ABD Ortak Ders Havuzu",
          description: "Yalnızca kendi ABD kapsamınızdaki ortak süreç dersleri. Bilimsel Araştırma Yöntemleri ve Etik, ders sorumlusunun havuzunda tutulur.",
          courses: departmentPoolCourses,
        },
      ]
    : [{
        key: "instructor",
        title: "Derslerim",
        description: "Görevlendirildiğiniz dersleri program düzeylerine göre görüntüleyin.",
        courses: myAssignedCourses,
      }];
  const selectedProgramCourses = selectedProgram ? coursesForProgram(selectedProgram) : [];
  const activeCourses = selectedProgram
    ? selectedProgramCourses.length
      ? selectedProgramCourses
      : useDemoFallback
        ? demoCoursesForProgram(selectedProgram)
        : []
    : useDemoFallback
      ? courses
      : [];
  const activeProgramLevels = selectedProgram
    ? orderedLevelsForProgram(selectedProgram.levels, activeCourses)
    : levels;
  const committeeScopeSet = new Set(committeeMemberships.map((item) => normalizeProgramScope(item.department)));
  const committeeCourses = session.role === "admin"
    ? displayedCatalogCourses
    : displayedCatalogCourses.filter((course) =>
        committeeScopeSet.has(normalizeProgramScope(course.department || "")) ||
        committeeScopeSet.has(normalizeProgramScope(course.programName || "")),
      );
  const committeeProgram = activeProfileProgram ?? scopedPrograms[0] ?? null;
  const committeeDepartment = committeeProgram?.department ?? session.department;
  const committeeProgramName = committeeProgram?.programName ?? session.department;
  const allReviewCourses = selectedProgram
    ? activeCourses
    : session.role === "abd_asd_baskani"
      ? scopedPrograms.flatMap((program) => coursesForProgram(program))
      : displayedCatalogCourses.length ? displayedCatalogCourses : useDemoFallback ? courses : [];
  const reviewCourses = session.role === "enstitu_sekreteri" ? [] : allReviewCourses;
  const pickerDepartments = [...new Set(scopedPrograms.map((program) => program.mainDepartment))];
  const changeModule = (module: DbpModule) => {
    setActive(module);
    setSelectedCourse(null);
    setSelectedProgram(null);
    setAssignCourse(null);
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
                    {orderedLevelsForProgram(program.levels).map((level) => (
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
        <a className="panel-brand" href={dbpPath("/")}>
          <img src={dbpPath("/oku-logo.png")} alt="OKÜ" />
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
                ) : module === "committee_management" ? (
                  <UserCog size={16} />
                ) : module === "commission_review" ? (
                  <ClipboardList size={16} />
                ) : module === "permission_matrix" ? (
                  <Settings size={16} />
                ) : module === "user_roles" ? (
                  <Users size={16} />
                ) : module === "quality_reports" ? (
                  <ShieldCheck size={16} />
                ) : module === "database_admin" ? (
                  <HardDrive size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                <span>{DBP_MODULES[module]}</span>
              </button>
              {module === "my_courses" && canCreateCourse && (
                <button
                  className="sidebar-course-create"
                  onClick={() => setShowCourseCreate(true)}
                >
                  <Plus size={15} />
                  <span>Ders / Hoca Atama</span>
                </button>
              )}
            </Fragment>
          ))}
        </nav>
        <a className="logout return-to-eenstitu" href={eEnstituDbpUrl}>
          <ArrowLeft size={15} />
          e-Enstitüye Dön
        </a>
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
          <div className="panel-header-actions">
            <ThemeToggle />
            <div className="panel-user">
              <span>{session.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <b>{session.name}</b>
                <small>{DBP_ROLES[session.role].label}</small>
              </div>
            </div>
          </div>
        </header>
        {saved && (
          <div className="save-toast">
            <CheckCircle2 size={16} />
            {saveMessage}
          </div>
        )}
        {catalogMessage && <div className="database-message">{catalogMessage}</div>}
        <CourseCreateDialog
          open={showCourseCreate}
          onClose={() => setShowCourseCreate(false)}
          onCreated={save}
          session={session}
          catalogCourses={displayedCatalogCourses}
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
        {assignCourse && (
          <div className="course-dialog-backdrop" role="presentation">
            <section
              className="course-create-dialog course-assignment-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="course-assignment-title"
            >
              <header>
                <div>
                  <small>ÖĞRETİM ELEMANI ATAMA</small>
                  <h2 id="course-assignment-title">Derse Hoca Ata / Güncelle</h2>
                </div>
                <button type="button" onClick={() => setAssignCourse(null)} aria-label="Kapat">
                  ×
                </button>
              </header>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setAssignmentMessage(
                    `${assignCourse.code} dersi için öğretim elemanı atama taslağı kaydedildi.`,
                  );
                  setAssignCourse(null);
                  save();
                }}
              >
                <div className="create-course-grid">
                  <label className="wide">
                    <span>Ders</span>
                    <input readOnly value={`${assignCourse.code} — ${assignCourse.name}`} />
                  </label>
                  <label>
                    <span>Mevcut öğretim elemanı</span>
                    <input readOnly value={assignCourse.instructor?.trim() || "Atama bekliyor"} />
                  </label>
                  <label>
                    <span>Yeni öğretim elemanı</span>
                    <select required defaultValue="">
                      <option value="" disabled>
                        Akademisyeni seçin
                      </option>
                      {instructorOptions.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                          {item.departmentNames?.length ? ` — ${item.departmentNames.slice(0, 2).join(", ")}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="wide">
                    <span>Atama notu</span>
                    <input placeholder="Örn. ders sorumlusu güncellendi" />
                  </label>
                </div>
                <footer>
                  <button type="button" onClick={() => setAssignCourse(null)}>
                    Vazgeç
                  </button>
                  <button className="create" type="submit">
                    Atamayı Kaydet
                  </button>
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
                  görüntüleyin; akademik içerik değişiklikleri ders sorumlusu ve ABD başkanı tarafından yapılır.
                </p>
              </div>
              {canCreateCourse && (
                <button
                  className="primary-action"
                  type="button"
                  onClick={() => setShowCourseCreate(true)}
                >
                  <Plus size={15} />
                  Ders / Hoca Atama
                </button>
              )}
            </div>
            {assignmentMessage && (
              <div className="assignment-message">{assignmentMessage}</div>
            )}
            {catalogBusy ? (
              <div className="course-loading-state" role="status">Dersler yükleniyor…</div>
            ) : activeCourses.length === 0 ? (
              <div className="course-loading-state">Bu program için veritabanında ders bulunamadı.</div>
            ) : (
              <div className="course-program-columns">
                {activeProgramLevels.map((level, index) => (
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
                              <small className="course-instructor-line">
                                Öğretim elemanı: {course.instructor?.trim() || "Atama bekliyor"}
                              </small>
                            </div>
                            <p className="course-row-actions">
                              <button onClick={() => setSelectedCourse(course)}>
                                {canEditAcademicContent ? "Güncelle" : "Görüntüle"}
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
            )}
          </section>
        )}
        {active === "my_courses" && !isCentralRole && !selectedCourse && (
          <div className="role-course-sections">
            {roleCourseSections.map((section) => (
              <section key={section.key}>
                <div className="panel-intro">
                  <div><h2>{section.title}</h2><p>{section.description}</p></div>
                  <span>{catalogBusy ? "Yükleniyor" : `${section.courses.length} ders`}</span>
                </div>
                {catalogBusy ? (
                  <div className="course-loading-state" role="status">Dersler yükleniyor…</div>
                ) : section.courses.length === 0 ? (
                  <div className="course-loading-state">Üzerinize atanmış ders bulunamadı.</div>
                ) : (
                  <div className="course-program-columns">
                    {levels.map((level, index) => (
                      <section className={`program-column tone-${index + 1}`} key={level}>
                        <header><h3>{level === "Tezsiz Yüksek Lisans" ? "Tezsiz YL" : level === "Tezli Yüksek Lisans" ? "Tezli YL" : "Doktora"}</h3></header>
                        <div className="program-course-list">
                          {section.courses.filter((course) => course.level === level).map((course) => (
                            <article key={`${section.key}-${course.code}-${course.level}`}>
                              <span className="course-code">{course.code}</span>
                              <div><b>{course.name}</b><small>{course.status}</small></div>
                              <button onClick={() => setSelectedCourse(course)}>Güncelle</button>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
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
            <CourseBolognaEditor
              course={{
                ...selectedCourse,
                department: selectedCourse.department ?? selectedProgram?.department ?? session.department,
                programName: selectedCourse.programName ?? selectedProgram?.programName ?? session.department,
              }}
              session={session}
              readOnly={isCentralRole && !canEditAcademicContent}
              onSave={save}
              onPublish={(status) => { localStorage.setItem("lee-dbp-review-queue", JSON.stringify({ code: selectedCourse.code, status, public: false })); save("Ders onaya gönderildi."); }}
            />
          </section>
        )}
        {active === "committee_management" && (
          <CommitteeManagement
            session={session}
            department={committeeDepartment}
            programName={committeeProgramName}
            onSave={save}
          />
        )}
        {active === "commission_review" && (
          <ReviewQueue
            courses={committeeCourses}
            role={session.role}
            session={session}
            department={committeeMemberships[0]?.department ?? session.department}
            programName={committeeMemberships[0]?.programName || committeeMemberships[0]?.department || session.department}
            mode="committee"
            onAction={save}
          />
        )}
        {active === "program_profile" && isCentralRole && !selectedProgram && (
          <section>
            {(["lee_ogrenci_isleri", "admin"] as DbpRole[]).includes(session.role) && <div className="institute-course-action">
              <button type="button" onClick={() => setShowProgramCreate(true)}>
                <Plus size={15} />
                ABD / ASD veya Program Ekle
              </button>
            </div>}
            {programPicker("Programı Aç")}
          </section>
        )}
        {active === "program_profile" && !isCentralRole && !activeProfileProgram && (
          programPicker("ProgramÄ± AÃ§")
        )}
        {active === "program_profile" && (isCentralRole ? selectedProgram : activeProfileProgram) && (
          <section>
            {(isCentralRole || scopedPrograms.length > 1) && (
              <button className="back-to-courses" onClick={() => setSelectedProgram(null)}>
                <ArrowLeft size={15} />
                Programlara Dön
              </button>
            )}
            {selectedProgram || scopedDefaultProgram ? (
              <ProgramProfileEditor
                department={`${(selectedProgram ?? scopedDefaultProgram)!.department} / ${(selectedProgram ?? scopedDefaultProgram)!.programName}`}
                programName={(selectedProgram ?? scopedDefaultProgram)!.programName}
                initialLevel={(selectedProgram ?? scopedDefaultProgram)!.levels[0]}
                availableLevels={(selectedProgram ?? scopedDefaultProgram)!.levels}
                mode={session.role === "admin" ? "admin" : session.role === "abd_asd_baskani" ? "edit" : "review"}
                onSave={save}
              />
            ) : (
              <section className="empty-state">
                <h2>Yetkinize bağlı program bulunamadı</h2>
                <p>{session.department} kapsamı için DBP program listesinde eşleşen program yok.</p>
              </section>
            )}
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
              courses={reviewCourses}
              role={session.role}
              session={session}
              department={(selectedProgram ?? scopedDefaultProgram)?.department ?? session.department}
              programName={(selectedProgram ?? scopedDefaultProgram)?.programName ?? session.department}
              mode={session.role === "abd_asd_baskani" ? "chair" : "institute"}
              onAction={save}
            />
          </section>
        )}
        {active === "publish_control" && <ProgramPublishControl onSave={save} session={session} />}
        {active === "quality_reports" && <QualityReports />}
        {active === "database_admin" && <DatabaseAdminPanel />}
        {(active === "permission_matrix" || active === "user_roles") && (
          <section>
            <div className="panel-intro">
              <div>
                <h2>Rol ve yetki dağılımı</h2>
                <p>
                  Modül erişimlerini rol bazında kontrol edin ve düzenleyin.
                </p>
              </div>
              <button className="primary-action" onClick={saveRoleAccess} disabled={permissionsBusy}>
                <Save size={14} />
                {permissionsBusy ? "Kaydediliyor" : "Değişiklikleri Kaydet"}
              </button>
            </div>
            {permissionMessage && <div className="database-message">{permissionMessage}</div>}
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
                  {moduleKeys.map((module) => (
                    <label key={module}>
                      <input
                        type="checkbox"
                        checked={permissionDraft[role].includes(module)}
                        onChange={(event) => toggleRoleAccess(role, module, event.currentTarget.checked)}
                        disabled={permissionsBusy}
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
