"use client";

import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import type { AnalysisResult, VerdictLevel, VerdictMeta } from "@/lib/types";
import { getVerdict } from "@/lib/analysis";
import { ScoreRing } from "./score-ring";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const VERDICT_STYLES: Record<VerdictLevel, { dot: string; badge: string }> = {
  ready: {
    dot: "bg-ready",
    badge: "bg-ready-tint text-ready-ink border-ready/20",
  },
  warn: { dot: "bg-warn", badge: "bg-warn-tint text-warn-ink border-warn/20" },
  stop: { dot: "bg-stop", badge: "bg-stop-tint text-stop-ink border-stop/20" },
};

function Verdict({ verdict }: { verdict: VerdictMeta }) {
  const s = VERDICT_STYLES[verdict.level];
  return (
    <div className="flex flex-col gap-3">
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${s.badge}`}
      >
        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
        {verdict.label}
      </span>
      <p className="font-display text-2xl font-light leading-snug tracking-[-0.01em] text-ink">
        {verdict.message}
      </p>
    </div>
  );
}

function Keywords({
  missing,
  matched,
}: {
  missing: string[];
  matched: string[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-stop" />
          What&apos;s missing
          <span className="text-ink-muted tabular-nums">
            ({missing.length})
          </span>
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          In the job description, absent from your CV.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {missing.map((k) => (
            <li
              key={k}
              className="rounded-lg border border-stop/20 bg-stop-tint/60 px-2.5 py-1.5 text-sm font-medium text-stop-ink"
            >
              {k}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-ready" />
          Already matched
          <span className="text-ink-muted tabular-nums">
            ({matched.length})
          </span>
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          Strong keywords found in both.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {matched.map((k) => (
            <li
              key={k}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ready/20 bg-ready-tint/60 px-2.5 py-1.5 text-sm font-medium text-ready-ink"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5 6.5 12 13 4" />
              </svg>
              {k}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Suggestions({ items }: { items: AnalysisResult["suggestions"] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Suggestions
        <span className="text-ink-muted tabular-nums">({items.length})</span>
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Concrete edits to close the gap before you apply.
      </p>
      <ol className="mt-4 flex flex-col divide-y divide-hairline border-t border-hairline">
        {items.map((s, i) => (
          <li key={s.title} className="group flex gap-4 py-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-tint font-display text-sm font-medium text-accent tabular-nums transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-[0.92rem] leading-relaxed text-ink-soft">
                {s.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AnalysisResultCard({ result }: { result: AnalysisResult }) {
  const verdict = getVerdict(result.score);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-3xl border border-hairline bg-card shadow-lift"
    >
      <motion.div
        variants={item}
        className="flex flex-col items-center gap-8 border-b border-hairline bg-paper/40 p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10"
      >
        <ScoreRing score={result.score} level={verdict.level} />
        <div className="flex-1 text-center sm:text-left">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            The verdict
          </span>
          <div className="mt-3 flex flex-col items-center sm:items-start">
            <Verdict verdict={verdict} />
          </div>
        </div>
      </motion.div>
      <div className="flex flex-col gap-9 p-8 sm:p-10">
        <motion.div variants={item}>
          <Keywords missing={result.missing} matched={result.matched} />
        </motion.div>
        <motion.div variants={item} className="border-t border-hairline pt-9">
          <Suggestions items={result.suggestions} />
        </motion.div>
      </div>
    </motion.div>
  );
}
