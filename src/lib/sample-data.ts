import type { AnalysisResult } from "./types";

export const sampleResult: AnalysisResult = {
  score: 72,
  matched: ["React", "TypeScript", "REST APIs", "Agile", "Git", "Unit testing"],
  missing: [
    "Next.js",
    "GraphQL",
    "AWS",
    "CI/CD pipelines",
    "Design systems",
    "Accessibility (WCAG)",
  ],
  suggestions: [
    {
      title: "Lead with Next.js experience",
      detail:
        "The role centres on Next.js. Add a project or bullet that shows production work with the App Router and server components.",
    },
    {
      title: "Quantify your impact",
      detail:
        "Replace duty-style lines with outcomes — e.g. “cut page load by 40%” — so recruiters and ATS see measurable value.",
    },
    {
      title: "Mirror the job's keywords",
      detail:
        "Weave in “CI/CD”, “GraphQL” and “design systems” where they truthfully apply. ATS filters rank on exact-term matches.",
    },
    {
      title: "Add an accessibility note",
      detail:
        "Mention WCAG / a11y work on a past project. It’s listed as required and is currently absent from your CV.",
    },
  ],
};
