import type { AnalysisInput, AnalysisResult, VerdictMeta } from "./types";

export async function analyzeMatch(
  input: AnalysisInput,
): Promise<AnalysisResult> {
  let response: Response;

  try {
    if (input.cvFile) {
      const form = new FormData();
      form.append("cvFile", input.cvFile);
      form.append("jobDescription", input.jobDescription);
      response = await fetch("/api/analyze", { method: "POST", body: form });
    } else {
      response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: input.cvText,
          jobDescription: input.jobDescription,
        }),
      });
    }
  } catch {
    throw new Error(
      "Couldn't reach the server. Check your connection and try again.",
    );
  }

  const data = (await response.json().catch(() => null)) as {
    result?: AnalysisResult;
    error?: string;
  } | null;

  if (!response.ok || !data?.result) {
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }

  return data.result;
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
