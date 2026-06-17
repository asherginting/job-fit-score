"use client";

import { useEffect } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as motion from "motion/react-client";
import type { VerdictLevel } from "@/lib/types";

const STROKE: Record<VerdictLevel, string> = {
  ready: "var(--color-ready)",
  warn: "var(--color-warn)",
  stop: "var(--color-stop)",
};

export function ScoreRing({
  score,
  level,
  size = 200,
}: {
  score: number;
  level: VerdictLevel;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;

  const progress = useMotionValue(0);
  const offset = useTransform(progress, (p) => c - (c * p) / 100);
  const display = useTransform(progress, (p) => Math.round(p));

  useEffect(() => {
    if (reduce) {
      progress.set(score);
      return;
    }
    const controls = animate(progress, score, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [score, reduce, progress]);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-hairline-strong)"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKE[level]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="flex items-start font-display text-[3.6rem] font-light leading-none tracking-[-0.03em] text-ink tnum">
          <motion.span>{display}</motion.span>
          <span className="mt-2 text-2xl text-ink-muted">%</span>
        </span>
        <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Match
        </span>
      </div>
    </div>
  );
}
