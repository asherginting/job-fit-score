"use client";

import { useCallback, useState } from "react";
import { analyzeMatch } from "@/lib/analysis";
import type { AnalysisInput, AnalysisResult } from "@/lib/types";

export type AnalysisStatus = "idle" | "loading" | "done";
export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const analyze = useCallback(async (input: AnalysisInput) => {
    setStatus("loading");
    setResult(null);
    const next = await analyzeMatch(input);
    setResult(next);
    setStatus("done");
  }, []);

  return { status, result, analyze };
}
