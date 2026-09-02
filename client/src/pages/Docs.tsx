import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import { githubApi, ApiError, type GitHubRepo } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/date";
import Breadcrumb from "@/components/docs/Breadcrumb";
import OnThisPage from "@/components/docs/OnThisPage";
import DocSection from "@/components/docs/DocSection";
import Callout from "@/components/docs/Callout";
import ArchitectureGrid from "@/components/docs/ArchitectureGrid";
import RepoDetailPanel from "@/components/docs/RepoDetailPanel";
import DesignSystemSection from "@/components/docs/DesignSystemSection";
import ChangelogSection from "@/components/docs/ChangelogSection";
import ProjectStructureSection from "@/components/docs/ProjectStructureSection";
import { cardCls, proseCls } from "@/components/docs/constants";
import { architecture } from "@/data/docData";

/* ==================== Docs Page ==================== */
const Docs: FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedRepoData, setSelectedRepoData] = useState<GitHubRepo | null>(
    null,
  );
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  // Repo index filters — Phase 5's "filterable" requirement. Name search
  // covers the case that matters most ("I know roughly what it's called");
  // the language filter reuses data the list already renders (the coloured
  // dot), so it costs nothing new to derive.
  const [repoQuery, setRepoQuery] = useState("");
  const [repoLanguage, setRepoLanguage] = useState("all");

  // Repo list is optional here — on failure the section just renders empty.
  const { data: repoData, loading: reposLoading } = useFetch(
    githubApi.getRepos,
  );
  const repos = repoData ?? [];

  const handleRepoClick = async (name: string) => {
    const repoData = repos.find((r) => r.name === name) || null;
    setSelectedRepo(name);
    setSelectedRepoData(repoData);
    setReadmeContent(null);
    setReadmeError(null);
    setReadmeLoading(true);
    try {
      const readme = await githubApi.getRepoReadme(name);
      setReadmeContent(readme.content);
    } catch (err) {
      // Prefer what the server actually said ("README not found for this
      // repository", "Request timed out after 8000ms") over a catch-all — the
      // API layer now carries it through instead of discarding the body.
      setReadmeError(
        err instanceof ApiError
          ? err.message
          : "README not found or failed to load",
      );
    } finally {
      setReadmeLoading(false);
    }
  };

  const clearSelectedRepo = () => {
    setSelectedRepo(null);
    setSelectedRepoData(null);
    setReadmeContent(null);
    setReadmeError(null);
  };

  const repoCardData = repos.map((repo) => ({
    name: repo.name,
    description: repo.description || "No description available",
    language: repo.language || "Unknown",
    languageColor: getLangColor(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: formatRelativeTime(repo.github_updated_at),
    url: repo.html_url,
  }));

  // Sorted so the dropdown reads alphabetically rather than in whatever
  // order repos happen to come back from the API.
  const repoLanguages = [...new Set(repoCardData.map((r) => r.language))].sort(
    (a, b) => a.localeCompare(b),
  );

  const filteredRepoCardData = repoCardData.filter((repo) => {
    const matchesQuery = repo.name
      .toLowerCase()
      .includes(repoQuery.trim().toLowerCase());
    const matchesLanguage =
      repoLanguage === "all" || repo.language === repoLanguage;
    return matchesQuery && matchesLanguage;
  });

  return (
    <div className="w-full">
      {/* NO inner max-width/padding wrapper here.
          There used to be a `max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12`
          around everything below, stacked on top of WorkLayout's own
          `px-5 lg:px-8 xl:px-[8%]`. The two paddings added up, so Docs was the
          only /work/* page indented a further 48 px: measured content left
          edge 419 px against 371 px on Performance, TechStack, Tools, Website,
          React, Repository, Tailwind, Gallery, Blog and Flutter at 1440 px.
          Docs inherits the layout's padding like every sibling now — if this
          page needs a different gutter, change WorkLayout, not this file. */}

      {/* ── Opening block ──────────────────────────────────────────────
          Full content width, ABOVE the two-column grid, so the breadcrumb,
          title and lead start on exactly the same left edge and run to the
          same right edge as every other page. Inside the grid they would have
          been squeezed by the 15rem rail column, which is what made the header
          read as a different page. */}
      <Breadcrumb
        items={[{ label: "Work", href: "/work" }, { label: "Docs" }]}
      />

      {/* Type scale is the canonical /work/* page header, matched exactly:
          18px/400 eyebrow · text-4xl sm:text-5xl (48px) /400 title · 20px/400
          Japanese subtitle, in a `mb-6` block. Docs previously ran its own
          scale — a 14px uppercase-tracked eyebrow, a 300-weight title and an
          18px 300-weight subtitle — which is the "font size is not the same"
          complaint, measurable at every one of the three lines.

          Tags differ from the siblings on purpose and cost nothing visually:
          they render the title as <h2> with no <h1> anywhere in main, so the
          page never announces what it is. Here the title is the page's only
          <h1> and the two labels are paragraphs, because a label is not a
          section. There are no global heading styles in this codebase
          (Tailwind preflight resets them), so <p class="text-lg"> and
          <h4 class="text-lg"> paint identically — the tag choice is a pure
          accessibility win with zero pixel difference. */}
      <div className="mb-6">
        <p className="mb-1 text-lg text-light-text dark:text-dark-text">
          Developer Analytics
        </p>
        <h1 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
          Document
        </h1>
        <p className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
          ドキュメント
        </p>
      </div>

      <div className={proseCls}>
        {/* Both lines used to advertise an API reference. That section is gone,
            so the promise is gone with it — a lead that lists a section the
            page does not have is worse than no lead. */}
        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-6">
          Architecture, design system, and project guides.
        </p>
        <p className="text-base text-light-text dark:text-dark-text leading-relaxed mb-8">
          A React 19 front end and an Express 5 API, with no database — the
          store is a set of JSON files kept in sync with the GitHub API. These
          docs cover the architecture, the project layout and the design system.
        </p>
        <Callout title="Design principle">
          Prefer &apos;few, high-quality primitives&apos; over scattered
          features. If a workflow cannot be explained in one screen, we simplify
          it.
        </Callout>
      </div>

      {/* ── Sections + rail ────────────────────────────────────────────
          Two-column from xl: content, then the sticky "On this page" rail.
          Below xl the rail collapses into a <details> disclosure ABOVE the
          content — a table of contents underneath what it indexes is useless,
          and always-expanded pushed the whole page down on every phone load
          before the reader had asked for it. */}
      <div className="mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-12 xl:items-start">
        {/* First in the DOM so that below xl — where the parent is a plain
              block and `order` does nothing — it lands above the content. At
              xl it is placed explicitly into column 2, so reading order and
              visual order agree in both layouts. */}
        <aside className="mb-6 xl:mb-0 xl:col-start-2 xl:row-start-1 xl:sticky xl:top-4">
          {/* `xl:contents` drops the <details> box itself from layout at
                xl+, leaving only its children (summary, content) as direct
                children of <aside> — so the sticky/top-4 above still applies
                cleanly. Below xl it is a real, closed-by-default disclosure:
                native <details>, no JS. This is the only collapsible left on
                the page — Disclosure.tsx went with the Design System rewrite,
                which no longer hides its reference material behind a toggle. */}
          <details className="group xl:contents rounded-xl border border-light-border dark:border-dark-border xl:border-0">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3
                           text-light-text dark:text-dark-text xl:hidden
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure
                           hover:bg-light-surface/60 dark:hover:bg-dark-surface/50 transition-colors"
            >
              <i
                aria-hidden="true"
                className="ri-arrow-right-s-line text-lg leading-none transition-transform group-open:rotate-90"
              />
              <span className="text-xs font-medium uppercase tracking-[0.14em]">
                On this page
              </span>
            </summary>
            <div className="px-4 pb-4 pt-1 xl:contents xl:p-0">
              <OnThisPage />
            </div>
          </details>
        </aside>

        <div className="min-w-0 xl:col-start-1 xl:row-start-1">
          {/* Reader order below: Overview → Architecture → Project Structure →
              Design System → Changelog → Project READMEs.

              Getting Started and API Reference were removed: this is a
              portfolio, not an onboarding manual for a repo nobody else runs,
              and the endpoint table was documentation of an internal API with
              no external consumer. `OnThisPage` scans the DOM for
              `data-doc-section`, so the rail drops both entries by itself —
              there is no second list to keep in sync. */}

          {/* ========== Overview ("What you can do") ========== */}
          <DocSection
            title="What you can do"
            subtitle="Explore project documentation and technical details."
          >
            <ul className="list-disc pl-6 space-y-3 text-light-text-secondary dark:text-dark-text-secondary">
              <li>Browse project repositories and view README files.</li>
              <li>
                Review architecture overview — frontend, backend, and dev tools.
              </li>
              <li>Explore the design system — palette and typography.</li>
              <li>Track release history in the changelog.</li>
            </ul>
          </DocSection>

          {/* ========== Architecture ========== */}
          {/* The grid renders straight onto the page, like Design System does.
              It used to sit in a `cardCls` panel with its own gradient top bar,
              which was the outermost of four nested rounded borders — and the
              panel added nothing the section heading above it did not already
              say. */}
          <DocSection
            title="Architecture Overview"
            subtitle="What this site is built from, by layer."
            wide
          >
            <ArchitectureGrid data={architecture} />
          </DocSection>

          {/* ========== Project Structure ========== */}
          <ProjectStructureSection />

          {/* ========== Design System ========== */}
          <DesignSystemSection />

          {/* ========== Changelog ========== */}
          <ChangelogSection />

          {/* ========== Project READMEs ========== */}
          <DocSection
            title="Project Docs"
            subtitle="Pick a repository to read its README."
          >
            {/* A compact index, not a second repository browser.
                  This was a 4-column grid of all 21 repo cards and the visual
                  centre of gravity of the page — while /work/repository
                  already is the repo browser, using the same fetch and the
                  same card family. What Docs uniquely offers is the README
                  drill-down, so the list only needs to be enough to choose
                  one. Moved to the end of the page: it is the deepest,
                  least-orienting content here, not what a cold reader needs
                  first. */}
            {!reposLoading && repos.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[12rem]">
                  <i
                    aria-hidden="true"
                    className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-light-text-tertiary dark:text-dark-text-muted"
                  />
                  <input
                    type="text"
                    value={repoQuery}
                    onChange={(e) => setRepoQuery(e.target.value)}
                    placeholder="Filter by name…"
                    aria-label="Filter repositories by name"
                    className="w-full rounded-lg border border-light-border dark:border-dark-border
                                 bg-light-surface-2 dark:bg-dark-surface
                                 py-1.5 pl-8 pr-3 text-sm text-light-text dark:text-dark-text
                                 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-muted
                                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure"
                  />
                </div>
                <select
                  value={repoLanguage}
                  onChange={(e) => setRepoLanguage(e.target.value)}
                  aria-label="Filter repositories by language"
                  className="rounded-lg border border-light-border dark:border-dark-border
                               bg-light-surface-2 dark:bg-dark-surface
                               py-1.5 px-3 text-sm text-light-text dark:text-dark-text
                               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure"
                >
                  <option value="all">All languages</option>
                  {repoLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
                  {filteredRepoCardData.length} of {repoCardData.length}
                </span>
              </div>
            )}

            <div className={`overflow-hidden ${cardCls}`}>
              {reposLoading ? (
                <ul className="divide-y divide-light-border dark:divide-dark-border">
                  {[...Array(6)].map((_, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="h-3 w-40 rounded animate-pulse bg-light-surface-2 dark:bg-dark-surface" />
                      <span className="ml-auto h-3 w-16 rounded animate-pulse bg-light-surface-2 dark:bg-dark-surface" />
                    </li>
                  ))}
                </ul>
              ) : repos.length === 0 ? (
                <p className="px-4 py-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
                  No repositories found
                </p>
              ) : filteredRepoCardData.length === 0 ? (
                <p className="px-4 py-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
                  No repositories match &ldquo;{repoQuery}&rdquo;
                  {repoLanguage !== "all" && <> in {repoLanguage}</>}.
                </p>
              ) : (
                <ul className="divide-y divide-light-border dark:divide-dark-border">
                  {filteredRepoCardData.map((repo) => (
                    <li key={repo.name}>
                      <button
                        type="button"
                        onClick={() => handleRepoClick(repo.name)}
                        aria-label={`Read the README for ${repo.name}`}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors
                                     hover:bg-light-surface/60 dark:hover:bg-dark-surface/40
                                     focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-matte-azure"
                      >
                        <span className="truncate text-sm font-medium text-light-text dark:text-dark-text">
                          {repo.name}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          {repo.language}
                        </span>
                        <span className="ml-auto shrink-0 text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
                          {repo.updatedAt}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Looking for stars, forks and topics?{" "}
              <Link
                to="/work/repository"
                className="text-matte-azure underline underline-offset-2 hover:no-underline"
              >
                Browse all repositories
              </Link>
              .
            </p>
          </DocSection>

          {/* ========== Project Detail (when repo selected) ========== */}
          {selectedRepo && (
            <RepoDetailPanel
              selectedRepo={selectedRepo}
              selectedRepoData={selectedRepoData}
              readmeContent={readmeContent}
              readmeLoading={readmeLoading}
              readmeError={readmeError}
              onBack={clearSelectedRepo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;
