export type VerdictLevel = "ready" | "warn" | "stop";

export interface VerdictMeta {
  level: VerdictLevel;
  label: string;
  message: string;
}

export interface Suggestion {
  title: string;
  detail: string;
}

export interface AnalysisInput {
  cvText: string;
  cvFile: File | null;
  jobDescription: string;
}

export interface AnalysisResult {
  score: number;
  missing: string[];
  matched: string[];
  suggestions: Suggestion[];
}
