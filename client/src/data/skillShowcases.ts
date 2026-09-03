/**
 * The skill-showcase pages, as data.
 *
 * `/work/website`, `/work/react`, `/work/tailwindcss` and `/work/flutter` were
 * four separate page files (60/61/61/69 lines) that were the same file. They
 * differed only in the fields below — the fetch, the useMemo, the header, the
 * AsyncBoundary, the grid and the ProjectCard call were byte-identical
 * copy-paste, down to reproducing the same code comment four times.
 *
 * Four copies means designing the same page four times and keeping four copies
 * in sync forever. Adding a fifth showcase now means adding an entry here.
 *
 * `icon` must exist in the Remix Icon subset — run `npm run icons:subset` after
 * adding one that does not (see CLAUDE.md).
 */
export interface SkillShowcase {
  /** Page title. */
  title: string;
  /** Japanese subtitle under the title. */
  jp: string;
  /** Matched against repo topics, name and description, case-insensitive. */
  keywords: string[];
  /**
   * Exact `repo.language` values that also qualify, for skills the keyword
   * scan misses. Only Website needs this today: an HTML/CSS repo often says
   * neither word anywhere in its topics, name or description.
   */
  languages?: string[];
  /** Selects ProjectCard's gradient and icon. */
  category: string;
  /** Badge text on the card. */
  categoryLabel: string;
  /** Empty-state icon, Remix Icon class. */
  icon: string;
  /** Empty-state headline. */
  emptyTitle: string;
  /** Empty-state supporting line. */
  emptyDescription: string;
}

export const skillShowcases = {
  website: {
    title: "Website (HTML/CSS/JS)",
    jp: "ウェブサイト",
    keywords: ["html", "css"],
    languages: ["HTML", "CSS"],
    category: "html",
    categoryLabel: "HTML / CSS",
    icon: "ri-html5-line",
    emptyTitle: "No HTML/CSS projects found",
    emptyDescription: "No repositories tagged HTML or CSS were returned.",
  },
  react: {
    title: "React",
    jp: "リアクト",
    keywords: ["react", "reactjs"],
    category: "react",
    categoryLabel: "React",
    icon: "ri-reactjs-line",
    emptyTitle: "No React projects found",
    emptyDescription: "No repositories tagged React were returned.",
  },
  tailwindcss: {
    title: "TailwindCSS",
    jp: "テイルウィンド",
    keywords: ["tailwindcss", "tailwind"],
    category: "tailwindcss",
    categoryLabel: "TailwindCSS",
    icon: "ri-tailwind-css-fill",
    emptyTitle: "No TailwindCSS projects found",
    emptyDescription: "No repositories tagged TailwindCSS were returned.",
  },
  flutter: {
    title: "Flutter",
    jp: "フラッター",
    keywords: ["flutter", "dart"],
    category: "flutter",
    categoryLabel: "Flutter",
    icon: "ri-flutter-line",
    emptyTitle: "No Flutter projects found",
    emptyDescription: "No repositories tagged Flutter or Dart were returned.",
  },
} satisfies Record<string, SkillShowcase>;
