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
