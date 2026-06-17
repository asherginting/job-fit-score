"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { analyzeMatch } from "@/lib/analysis";
import type { AnalysisInput, AnalysisResult } from "@/lib/types";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (input: AnalysisInput) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error(
        "You're offline. An internet connection is required to analyze.",
      );
      return;
    }

    setStatus("loading");
    setResult(null);
    try {
      const next = await analyzeMatch(input);
      setResult(next);
      setStatus("done");
      toast.success("Analysis complete. Scroll down for your result.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setStatus("error");
      toast.error(message);
    }
  }, []);

  return { status, result, analyze };
}
