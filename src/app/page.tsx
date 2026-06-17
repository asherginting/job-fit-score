"use client";

import { useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { AnalysisForm } from "@/components/analysis-form";
import { AnalysisResultCard } from "@/components/analysis-result";
import { useAnalysis } from "@/hooks/use-analysis";

export default function Home() {
  const { status, result, analyze } = useAnalysis();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <Header />

      <div className="mt-12">
        <AnalysisForm loading={status === "loading"} onAnalyze={analyze} />
      </div>

      <div ref={resultRef} className="scroll-mt-8">
        {result && (
          <section className="mt-14">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-2xl font-light tracking-[-0.01em] text-ink">
                Your result
              </h2>
              <span className="h-px flex-1 bg-hairline" />
            </div>
            <AnalysisResultCard result={result} />
          </section>
        )}
      </div>

      <footer className="mt-20 border-t border-hairline pt-6 text-center text-xs text-ink-muted">
        Job Fit Score · Preview build with sample analysis data.
      </footer>
    </main>
  );
}
