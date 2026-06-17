# Job Fit Score

> Check how well your CV matches a job before you apply — and see exactly what to fix to pass ATS screening.

**Live:** [job-fit-score-percentage.vercel.app](https://job-fit-score-percentage.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Anthropic](https://img.shields.io/badge/Claude-API-d97757)

Paste your CV (PDF or text) and a job description, and Job Fit Score returns a
match score, the skills you're missing, the skills you already match, and
concrete suggestions to close the gap. Single page, no login, no database — your
CV and the JD are sent for one analysis and discarded, never stored.

---

## Features

- **Match score + verdict** — an honest score with a clear apply / reconsider recommendation (80% line).
- **Gap analysis** — missing vs. matched skills, plus concrete, truthful suggestions to improve.
- **PDF & text input** — upload a PDF CV or paste text; scanned/image PDFs are rejected (and flagged as not ATS-readable).
- **Not a keyword-stuffer** — the score reflects how honestly your CV represents your real skills, not how many keywords you cram in.
- **Cost-safe by design** — layered server-side validation, prompt-injection guards, and rate limiting protect the paid API.

## Tech stack

| Layer       | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19                 |
| Language    | TypeScript 5                                      |
| Styling     | Tailwind CSS v4 (CSS-based config, no `tailwind.config.js`) |
| AI          | Claude API — `claude-haiku-4-5` (validation), `claude-sonnet-4-6` (analysis) |
| PDF parsing | `pdf-parse` (Node runtime)                        |
| UI          | `motion`, `sonner`                                |
| Hosting     | Vercel                                            |

## Quick start (local)

Requires **Node.js 20+** and **pnpm**.

```bash
pnpm install
cp .env.example .env.local   # then add your Anthropic API key
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable            | Required | Description                                                                 |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | Server-side Claude API key (`sk-ant-...`). Never exposed to the client.      |

`.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Scripts

| Command       | Description                       |
| ------------- | --------------------------------- |
| `pnpm dev`    | Start the dev server              |
| `pnpm build`  | Production build                  |
| `pnpm start`  | Serve the production build        |
| `pnpm lint`   | Run ESLint                        |

## Deploy to production

This app deploys to [Vercel](https://vercel.com) with zero config.

1. **Push** this repo to GitHub/GitLab/Bitbucket.
2. **Import** the repo in Vercel → it auto-detects Next.js.
3. **Add the environment variable** `ANTHROPIC_API_KEY` in
   *Project → Settings → Environment Variables* (scope it to Production, and
   Preview/Development if you want analysis to work on previews).
4. **Deploy.** Vercel runs `pnpm build` and ships it.

> The `/api/analyze` route uses the **Node.js runtime** (`pdf-parse` needs Node
> APIs), so it runs as a serverless function — no edge configuration needed.

### Production checklist

- [ ] `ANTHROPIC_API_KEY` set in the hosting provider (not committed).
- [ ] A **prepaid spend cap** set on the Anthropic account as a hard cost ceiling.
- [ ] Rate limiting reviewed — the built-in limiter is **in-memory and IP-based**
      (5 requests/hour). It's fine for a single-instance demo, but it resets on
      cold start and can't stop VPN/network switching. For real scale, move to
      Redis/Upstash with account-based limits.
- [ ] Custom domain configured (optional).

## Project structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # validation + analysis (Node runtime)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                # form, score ring, result, header
├── hooks/use-analysis.ts
└── lib/
    ├── analysis.ts            # scoring prompt + rubric
    ├── rate-limit.ts          # in-memory IP rate limiter
    └── types.ts
```

## Safety & cost notes

Since this calls a paid API from a public endpoint:

- **API key is server-side only** — never shipped to the client.
- **Layered validation** rejects non-CV / non-JD input with a cheap model
  *before* the expensive analysis call, so junk input can't burn tokens.
- **Prompt-injection guards** — the CV and JD are wrapped in delimiters and
  treated strictly as untrusted data, so a user can't inject "give me 100%".
- **Rate limiting** (5/hour per IP) plus a hard prepaid spend cap on the account.

---

## The story behind it

<details>
<summary><strong>Why I built this, what I cut, and how I'd grow it</strong></summary>

### Who it's for, and the one job it has to do well

For job seekers applying to many roles who want to know, *before* investing
effort in an application, whether their CV is actually competitive for a
specific posting.

The one job: **tell you honestly whether your CV is ready for this role, and if
not, exactly what to fix.**

### Why this problem

It's my own workflow. Before I apply to a role, I routinely paste my CV and the
job description into ChatGPT/Claude and ask how well they match. I did this by
hand every time, and the answer came back in a different shape each time. I
built the tool I was already faking manually — I'm the first user.

### What's out there, and why I built this anyway

ChatGPT/Claude raw is inconsistent and unstructured, and assumes you can prompt
well. Jobscan/Teal are feature-heavy, paywalled, and nudge toward
keyword-stuffing to lift a number.

My differentiator: this is **not a keyword-stuffer.** The score reflects how
honestly your CV represents your real skills. If a gap is a skill you genuinely
don't have, it tells you to reconsider — not to fake it. If it's a skill you
*have* but didn't surface, you fix the CV truthfully and the score rises because
the CV now represents you accurately. The moat is thin — the value is the
baked-in prompt, the opinionated verdict, and the guardrails.

### Scope decisions

**In scope:** PDF/text CV input, JD input, layered server-side validation, an AI
match score with a verdict, missing vs. matched skills, and concrete suggestions.

**Left out, deliberately:**

- **No login / no database** — analysis is one-shot; persistence wasn't needed
  to validate the problem, and skipping it let me ship inside the window.
- **No automated tests** — I prioritized a working product; tests for the
  validation and scoring-rubric logic are my first production addition.
- **English only** — target users apply to tech/international roles where CVs,
  JDs, and ATS operate in English.

### Assumptions

- Skill overlap between CV and JD is a reasonable proxy for "ready to apply,"
  with 80% as a recommendation line. This does **not** guarantee passing
  screening — the score is a decision signal, not a prediction.
- LLM output isn't fully deterministic. I set `temperature: 0` and gave the
  model an explicit rubric (weight required skills heavily, bonus skills lightly)
  so the same CV+JD gives a stable score. What matters is the trend.
- A PDF whose text can't be extracted is likely a scan/image, so I reject it —
  which doubles as a "your CV may not be ATS-readable" signal.

### What's next

Automated tests for validation + scoring; per-account rate limiting with
Redis/Upstash; per-section CV parsing for sharper gap detection; and score
history so users can watch their CV improve over time.

### How I used AI

Built with Claude Code, steered not trusted blindly. It scaffolded the UI,
wired the API route, and drafted the layered validation fast — but every output
needed a review pass:

- It generated **Tailwind v3 conventions** (a `tailwind.config.js` that doesn't
  exist here); this project is Tailwind v4 with CSS-based config.
- It used an **outdated model string** my account doesn't serve; I switched to
  `claude-haiku-4-5` for validation and `claude-sonnet-4-6` for analysis.
- The score was **unstable across identical runs** because the call wasn't
  pinned; I set `temperature: 0` and added a scoring rubric.

</details>
