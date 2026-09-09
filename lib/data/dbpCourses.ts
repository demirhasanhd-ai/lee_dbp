import { dbpPath } from "../dbpPath";

export type DbpCourse = {
  id?: number;
  academicYear?: string;
  programCode?: string;
  department: string;
  programName: string;
  level: string;
  code: string;
  name: string;
  type: string;
  credit?: number;
  ects: number;
  theory: number;
  practice: number;
  term?: string;
  status: string;
  instructor?: string;
  source?: string;
  hasPackage?: boolean;
  updatedAt?: string;
  workflow?: {
    committeeSkipped?: boolean;
    latestSubmit?: {
      route?: string;
      status?: string;
      actor?: string;
      createdAt?: string;
    } | null;
  };
};

export type DbpCourseFilters = {
  q?: string;
  department?: string;
  programName?: string;
  level?: string;
  instructor?: string;
  limit?: number;
};

export type DbpCoursesResponse = {
  courses: DbpCourse[];
  total: number;
  source: "database";
};

export type PublicDbpCourseResponse = {
  course: DbpCourse;
  package: Record<string, unknown> | null;
  status: string;
  updatedAt?: string;
  packagePending?: boolean;
};

export function courseQuery(filters: DbpCourseFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && String(value).trim()) {
      params.set(key, String(value));
    }
  }
  return params;
}

export async function fetchDbpCourses(filters: DbpCourseFilters = {}, init?: RequestInit) {
  const params = courseQuery(filters);
  const response = await fetch(dbpPath(`/api/dbp/courses${params.size ? `?${params}` : ""}`), init);
  if (!response.ok) throw new Error("Ders katalog verisi veritabanından alınamadı.");
  return response.json() as Promise<DbpCoursesResponse>;
}

export async function fetchPublicDbpCourse(
  identity: Pick<DbpCourse, "department" | "programName" | "level" | "code">,
  init?: RequestInit,
) {
  const params = new URLSearchParams({
    code: identity.code,
    department: identity.department,
    programName: identity.programName,
    level: identity.level,
  });
  const response = await fetch(dbpPath(`/api/dbp/public-course?${params}`), init);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Yayımlanmış ders bilgi paketi alınamadı.");
  return response.json() as Promise<PublicDbpCourseResponse>;
}
