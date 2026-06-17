"use client";

import { useRef, useState } from "react";
import type { AnalysisInput } from "@/lib/types";

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-display text-xl font-light text-accent tabular-nums">
        {index}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {title}
      </h2>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type CvMode = "upload" | "paste";

export interface CvValue {
  mode: CvMode;
  file: File | null;
  text: string;
}

function CvField({
  value,
  onChange,
}: {
  value: CvValue;
  onChange: (next: CvValue) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mode, file, text } = value;
  const setMode = (mode: CvMode) => onChange({ ...value, mode });
  const setFile = (file: File | null) => onChange({ ...value, file });
  const setText = (text: string) => onChange({ ...value, text });

  function pickFile(f: File | null | undefined) {
    if (f && f.type === "application/pdf") setFile(f);
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel index="01" title="Your CV" />
        <div className="flex rounded-full border border-hairline bg-paper-deep/50 p-0.5 text-xs font-medium">
          {(["upload", "paste"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 capitalize transition-colors duration-200 ${
                mode === m
                  ? "bg-card text-ink shadow-soft"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              {m === "upload" ? "Upload PDF" : "Paste text"}
            </button>
          ))}
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`group relative flex min-h-62 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ${
            dragging
              ? "border-accent bg-accent-tint/60 scale-[0.99]"
              : "border-hairline-strong bg-card hover:border-accent/50 hover:bg-accent-tint/25"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />

          {file ? (
            <div className="flex w-full max-w-sm items-center gap-3.5 rounded-xl border border-hairline bg-paper/70 px-4 py-3.5 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-[0.6rem] font-bold tracking-wider text-white">
                PDF
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {file.name}
                </span>
                <span className="text-xs text-ink-muted tabular-nums">
                  {formatSize(file.size)} · ready
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-stop-tint hover:text-stop-ink"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-tint text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                  <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              </span>
              <div>
                <p className="text-base font-semibold text-ink">
                  Drop your CV here
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  or{" "}
                  <span className="font-medium text-accent underline decoration-accent/30 underline-offset-2">
                    browse files
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full text of your CV here…"
          className="min-h-62 w-full resize-none rounded-2xl border border-hairline bg-card p-5 text-[0.95rem] leading-relaxed text-ink placeholder:text-ink-muted/70 shadow-soft outline-none transition-colors focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
      )}

      <p className="text-xs text-ink-muted">
        PDF only, up to 5&nbsp;MB. Your file never leaves your browser in this
        preview.
      </p>
    </section>
  );
}

const JD_MAX = 8000;

function JobField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const pct = Math.min(100, (value.length / JD_MAX) * 100);

  return (
    <section className="flex flex-col gap-5">
      <SectionLabel index="02" title="Job Description" />
      <div className="relative flex-1">
        <textarea
          value={value}
          maxLength={JD_MAX}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full job description — responsibilities, required skills, qualifications…"
          className="min-h-62 w-full resize-none rounded-2xl border border-hairline bg-card p-5 pb-10 text-[0.95rem] leading-relaxed text-ink placeholder:text-ink-muted/70 shadow-soft outline-none transition-colors focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
        <div className="pointer-events-none absolute inset-x-5 bottom-3.5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-ink-muted">
            {value.length.toLocaleString()} / {JD_MAX.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-xs text-ink-muted">
        The more complete the description, the sharper your match score.
      </p>
    </section>
  );
}

export function AnalysisForm({
  loading,
  onAnalyze,
}: {
  loading: boolean;
  onAnalyze: (input: AnalysisInput) => void;
}) {
  const [cv, setCv] = useState<CvValue>({
    mode: "upload",
    file: null,
    text: "",
  });
  const [jobDescription, setJobDescription] = useState("");

  function handleSubmit() {
    onAnalyze({
      cvText: cv.mode === "paste" ? cv.text : "",
      cvFileName: cv.mode === "upload" ? (cv.file?.name ?? null) : null,
      jobDescription,
    });
  }

  return (
    <div className="rounded-3xl border border-hairline bg-card/70 p-6 shadow-soft backdrop-blur-sm sm:p-8">
      <div className="grid gap-9 lg:grid-cols-2 lg:gap-10">
        <CvField value={cv} onChange={setCv} />
        <div className="relative">
          <div className="absolute -left-5 top-1 hidden h-full w-px bg-hairline lg:block" />
          <JobField value={jobDescription} onChange={setJobDescription} />
        </div>
      </div>
      <div className="mt-9 flex flex-col items-center gap-3 border-t border-hairline pt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="group relative inline-flex h-14 min-w-56 items-center justify-center gap-3 rounded-full bg-accent px-9 text-base font-semibold text-white shadow-lift transition-all duration-300 hover:bg-accent-deep hover:shadow-soft active:scale-[0.98] disabled:cursor-wait disabled:opacity-90"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Analyzing…
            </>
          ) : (
            <>
              Analyze Match
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </>
          )}
        </button>
        <p className="text-xs text-ink-muted">
          Takes a few seconds. No sign-up required.
        </p>
      </div>
    </div>
  );
}
