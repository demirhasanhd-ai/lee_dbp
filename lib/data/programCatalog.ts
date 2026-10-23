import { dbpPath } from "../dbpPath";
import type { LeeProgram } from "./programs";

export async function fetchDbpPrograms(init?: RequestInit): Promise<LeeProgram[]> {
  const response = await fetch(dbpPath("/api/dbp/programs"), { ...init, cache: "no-store" });
  if (!response.ok) throw new Error("Program kataloğu veritabanından alınamadı.");
  const data = await response.json() as { programs: LeeProgram[] };
  return data.programs;
}
