import type { Assessment, Workload } from "./courseAssessmentWorkload";

export type ObsDraft = {
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
    program?: string;
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
  totalWorkload: number;
};

export type ObsProgram = { id: string; name: string; faculty: string; facultyId: string };
export type ObsCandidate = {
  id: string;
  sourceUrl: string;
  obsCourseId: string;
  code: string;
  name: string;
  program: ObsProgram;
  curriculum: { value: string; name: string; year: number; current: boolean };
  updatedAt: string;
  ects: number;
  instructors: string;
  instructorMatch: boolean;
  matchReason: string;
  matchScore: number;
  summary: { outcomes: number; weeks: number; matrix: boolean; assessments: number; workloads: number; purpose: boolean; content: boolean };
};
export type ObsSearchJob = {
  id: string;
  status: "running" | "completed" | "failed" | "cancelled";
  progress: { phase: string; message: string; completed: number; total: number };
  candidates: ObsCandidate[];
  warnings: string[];
  error: string;
  program: ObsProgram;
  scannedAt: string;
};

export type ObsImportSource = {
  url: string;
  obsCourseId: string;
  program: string;
  curriculum?: string;
  updatedAt: string;
  importedAt: string;
  matrixIncluded: boolean;
};
