import type { AnalysisInput, AnalysisResult, VerdictMeta } from "./types";
import { sampleResult } from "./sample-data";

export async function analyzeMatch(
  input: AnalysisInput,
): Promise<AnalysisResult> {
  void input;
  await delay(1500);
  return sampleResult;
}

export function getVerdict(score: number): VerdictMeta {
  if (score >= 80) {
    return {
      level: "ready",
      label: "Ready to apply",
      message: "Your CV is strong for this role.",
    };
  }
  if (score >= 60) {
    return {
      level: "warn",
      label: "Needs work",
      message: "Improve the points below before applying.",
    };
  }
  return {
    level: "stop",
    label: "Not yet",
    message: "The gap is too large for this role right now.",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
