function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Job Fit Score"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        fill="var(--color-accent)"
      />
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        stroke="var(--color-accent-deep)"
        strokeWidth="1.5"
      />
      <circle
        cx="20"
        cy="20"
        r="11.5"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="2"
      />
      <circle
        cx="20"
        cy="20"
        r="6.5"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <path
        d="M15.5 20.4 L18.7 23.5 L24.8 16.5"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="flex flex-col gap-7">
      <div className="flex items-center gap-3.5">
        <Logo className="h-11 w-11 shadow-soft rounded-[11px]" />
        <div className="leading-none">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-muted">
            ATS Readiness Check
          </span>
        </div>
      </div>

      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] font-light leading-[0.98] tracking-[-0.02em] text-ink">
          Job&nbsp;Fit{" "}
          <span className="italic font-normal text-accent">Score</span>
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          Check how well your CV matches the job before you apply — and see
          exactly what to fix to pass ATS screening.
        </p>
      </div>
    </header>
  );
}
