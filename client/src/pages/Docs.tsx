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
import GettingStartedSection from "@/components/docs/GettingStartedSection";
import ApiReferenceSection from "@/components/docs/ApiReferenceSection";
import ProjectStructureSection from "@/components/docs/ProjectStructureSection";
import { TH, cardCls, proseCls } from "@/components/docs/constants";
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

  return (
    <div className="w-full">
      {/* Doc-style content wrapper.
          The page header lives INSIDE this wrapper. It used to sit outside,
          so it did not receive the wrapper's `lg:px-12` and rendered exactly
          48 px to the left of the breadcrumb and every section below it —
          measured title left edge 384 px against body 432 px. */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Two-column from xl: content, then the sticky "On this page" rail.
            Below xl the rail collapses into a <details> disclosure ABOVE the
            content — a table of contents underneath what it indexes is
            useless, and always-expanded pushed the whole page down on every
            phone load before the reader had asked for it. */}
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-12 xl:items-start">
          {/* First in the DOM so that below xl — where the parent is a plain
              block and `order` does nothing — it lands above the content. At
              xl it is placed explicitly into column 2, so reading order and
              visual order agree in both layouts. */}
          <aside className="mb-6 xl:mb-0 xl:col-start-2 xl:row-start-1 xl:sticky xl:top-4">
            {/* `xl:contents` drops the <details> box itself from layout at
                xl+, leaving only its children (summary, content) as direct
                children of <aside> — so the sticky/top-4 above still applies
                cleanly. Below xl it is a real, closed-by-default disclosure:
                native <details>, no JS, matching Disclosure.tsx's visual
                language without inheriting its fixed non-responsive layout. */}
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
            {/* Breadcrumb, title and lead now share one column and one tight
                rhythm instead of three separately-spaced blocks — breadcrumb
                sat BELOW the title before, and the lead paragraph lived one
                grid level deeper again, so the three read as unrelated pieces
                rather than one opening block. */}
            <Breadcrumb
              items={[{ label: "Work", href: "/work" }, { label: "Docs" }]}
            />

            {/* Semantics, not just styling: the page title is the only h1 in
                main. It used to be an h2, with the eyebrow above it as an h4
                and the Japanese subtitle below as an h3 — no h1 anywhere, so
                the page never announced what it was. The eyebrow and the
                subtitle are labels, not sections, so they are paragraphs.
                Weight follows DS v3.2: the title is 300 and sections are 500,
                so hierarchy descends with size instead of fighting it. */}
            <div className={proseCls}>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
                Developer Analytics
              </p>
              <h1 className="mb-1 text-4xl sm:text-5xl font-light tracking-tight text-light-text dark:text-dark-text">
                Document
              </h1>
              <p className="mb-6 text-lg font-light font-zen text-light-text-secondary dark:text-dark-text-secondary">
                ドキュメント
              </p>
              <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Developer analytics, API reference, and project guides.
              </p>
              <p className="text-base text-light-text dark:text-dark-text leading-relaxed mb-8">
                A React 19 front end and an Express 5 API, with no database —
                the store is a set of JSON files kept in sync with the GitHub
                API. These docs cover the architecture, the endpoints and the
                design system.
              </p>
              <Callout title="Design principle">
                Prefer &apos;few, high-quality primitives&apos; over scattered
                features. If a workflow cannot be explained in one screen, we
                simplify it.
              </Callout>
            </div>

            {/* Reader order below: Overview → Getting Started → Architecture →
                API Reference → Project Structure → Design System → Changelog →
                Project READMEs. Getting Started, API Reference and Project
                Structure do not exist yet (Phase 4) — their slots are marked
                so the order does not get re-litigated when they land. */}

            {/* ========== Overview ("What you can do") ========== */}
            <DocSection
              title="What you can do"
              subtitle="Explore project documentation and technical details."
            >
              <ul className="list-disc pl-6 space-y-3 text-light-text-secondary dark:text-dark-text-secondary">
                <li>Browse project repositories and view README files.</li>
                <li>
                  Review architecture overview — frontend, backend, and dev
                  tools.
                </li>
                <li>Explore the design system — palette and typography.</li>
                <li>Track release history in the changelog.</li>
              </ul>
            </DocSection>

            {/* ========== Getting Started ========== */}
            <GettingStartedSection />

            {/* ========== Architecture ========== */}
            <DocSection
              title="Architecture Overview"
              subtitle="Technology stack breakdown"
              wide
            >
              <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${TH.primary}60, ${TH.secondary}60, transparent)`,
                  }}
                />
                <ArchitectureGrid data={architecture} />
              </div>
            </DocSection>

            {/* ========== API Reference ========== */}
            <ApiReferenceSection />

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
                ) : (
                  <ul className="divide-y divide-light-border dark:divide-dark-border">
                    {repoCardData.map((repo) => (
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
    </div>
  );
};

export default Docs;
