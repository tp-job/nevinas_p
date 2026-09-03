import type { FC } from "react";
import type { GitHubRepo } from "@/utils/api";
import { formatRelativeTimeLong } from "@/utils/date";

/**
 * A repository card, rebuilt onto the design system.
 *
 * WHAT WAS WRONG WITH THE OLD ONE
 *
 * - `neu-card` (neumorphism: hardcoded rgba, 20px blur, its own
 *   `translateY(-3px)` on hover) is a different visual language from
 *   Nocturnal Atelier. It was also stacked with a Tailwind
 *   `hover:-translate-y-1`, so the card lifted TWICE on hover — 3px from the
 *   CSS class and 4px from the utility.
 * - Eight hardcoded hex values in a per-category GRADIENTS map (#1a1a2e,
 *   #16213e, #0f3460, #2d1b4e, #e34c26, #0f172a, #1e3a5f, #0ea5e9). CLAUDE.md
 *   requires token classes precisely so a palette change stays a one-file
 *   edit; that map made this card a second place the palette lived.
 * - `font-bold` (700) on the title and the category badge. DS v3.2 allows
 *   nothing above 600.
 * - The whole card was a `cursor-pointer` div with an onClick, wrapping two
 *   real buttons and a link. That is a nested-interactive control: not
 *   reachable by keyboard, no role, and it swallowed clicks meant for the
 *   footer. The hero's hidden "click to open the live site" duplicated the
 *   Preview button sitting right below it.
 * - Four elements competed inside one 224px hero: a 120px ghost icon, a
 *   centred icon tile, and two badges. Two of them were the same icon.
 *
 * WHAT REPLACED IT
 *
 * The site's standard surface (`bg-light-surface`/`dark:bg-dark-bg` + hairline
 * border + `rounded-2xl`), one hero band built from palette tokens, one icon,
 * and the badges kept because they carry data the reader wants.
 *
 * NO PER-CATEGORY COLOUR. The old map tinted the hero differently for React /
 * Tailwind / HTML, which is a third redundant channel next to the icon and the
 * text label that already say the same thing — and the main palette is a
 * blue-purple ramp, so the "different" tints were near-indistinguishable
 * anyway. Same lesson as the Architecture grid's incomplete icon map: a
 * channel that carries no information is noise with a lookup table behind it.
 *
 * NO CARD-LEVEL HOVER TRANSFORM. A lift implies the whole surface is a
 * button. It is not — the footer holds the two things you can actually click,
 * and they have their own hover states. The card gets a border tint on hover
 * so the grouping is still legible, and nothing moves.
 */
const ICONS: Record<string, string> = {
  react: "ri-reactjs-line",
  tailwindcss: "ri-tailwind-css-fill",
  html: "ri-html5-line",
  css: "ri-css3-line",
  flutter: "ri-flutter-line",
  default: "ri-code-s-slash-line",
};

const ProjectCard: FC<{
  repo: GitHubRepo;
  category: string;
  categoryLabel: string;
}> = ({ repo, category, categoryLabel }) => {
  const icon = ICONS[category] || ICONS.default;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border
                 border-light-border bg-light-surface transition-colors
                 hover:border-cool/40 dark:border-dark-border dark:bg-dark-bg
                 dark:hover:border-cool/40"
    >
      {/* Hero band — one tonal gradient from the palette, one icon.
          Shorter than the old 224px: it is an identifying mark, not an image,
          and it was taking more vertical space than the repo's description. */}
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-midnight via-haze-deep to-haze">
        <i
          className={`${icon} text-5xl text-periwinkle/70`}
          aria-hidden="true"
        />

        <span className="absolute left-4 top-4 rounded-full bg-charcoal/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-periwinkle backdrop-blur-sm">
          {categoryLabel}
        </span>

        {repo.language && (
          <span className="absolute right-4 top-4 rounded-full bg-charcoal/40 px-2.5 py-1 text-[11px] font-medium text-periwinkle backdrop-blur-sm">
            {repo.language}
          </span>
        )}
      </div>

      <div className="flex grow flex-col p-6">
        {/* Meta row — tabular-nums so the counts do not jitter between cards. */}
        <div className="mb-3 flex items-center gap-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
          <span className="flex items-center gap-1 tabular-nums">
            <i className="ri-star-line" aria-hidden="true" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <i className="ri-git-branch-line" aria-hidden="true" />
            {repo.forks_count}
          </span>
          {repo.pushed_at && (
            <span className="flex items-center gap-1">
              <i className="ri-time-line" aria-hidden="true" />
              {formatRelativeTimeLong(repo.pushed_at)}
            </span>
          )}
        </div>

        {/* 500, not 700. Size carries the hierarchy here, per DS v3.2. */}
        <h3 className="mb-2 line-clamp-2 text-xl font-medium text-light-text dark:text-dark-text">
          {repo.name}
        </h3>

        <p className="mb-4 grow line-clamp-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {repo.description || "No description available"}
        </p>

        {repo.topics.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-light-surface-2 px-2 py-0.5 text-[11px] text-light-text-secondary dark:bg-dark-surface dark:text-dark-text-secondary"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        {/* The only interactive elements on the card. When a repo has no
            homepage, Preview stays an <a> but is marked `aria-disabled` and
            taken out of the tab order, so it is announced as unavailable
            rather than silently doing nothing when activated. */}
        <div className="mt-auto flex items-center gap-3 border-t border-light-border pt-4 dark:border-dark-border">
          <a
            href={repo.homepage || undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!repo.homepage}
            tabIndex={repo.homepage ? undefined : -1}
            onClick={(e) => {
              if (!repo.homepage) e.preventDefault();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure ${
                          repo.homepage
                            ? "bg-matte-azure/10 text-matte-azure hover:bg-matte-azure/20"
                            : "cursor-not-allowed bg-light-surface-2 text-light-text-tertiary dark:bg-dark-surface dark:text-dark-text-muted"
                        }`}
          >
            <i className="ri-eye-line" aria-hidden="true" />
            Preview
          </a>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-light-surface-2 py-2.5 text-sm
                       font-medium text-light-text-secondary transition-colors hover:text-light-text
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure
                       dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:text-dark-text"
          >
            <i className="ri-github-line" aria-hidden="true" />
            Code
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
