import { useState, type FC } from "react";
import RepoCard from "@/components/card/RepoCard";
import { githubApi, ApiError, type GitHubRepo } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/date";
import Breadcrumb from "@/components/docs/Breadcrumb";
import DocSection from "@/components/docs/DocSection";
import Callout from "@/components/docs/Callout";
import ArchitectureGrid from "@/components/docs/ArchitectureGrid";
import RepoDetailPanel from "@/components/docs/RepoDetailPanel";
import DesignSystemSection from "@/components/docs/DesignSystemSection";
import ChangelogSection from "@/components/docs/ChangelogSection";
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
        {/* Header.
            Semantics, not just styling: the page title is now the only h1 in
            main. It used to be an h2, with the eyebrow above it as an h4 and
            the Japanese subtitle below as an h3 — an h4 → h2 → h3 order with no
            h1 anywhere, so the page never announced what it was. The eyebrow
            and the subtitle are labels, not sections, so they are paragraphs.
            Weight follows DS v3.2: the title is 300 and sections are 500, so
            hierarchy descends with size instead of fighting it. */}
        <div className={`mb-8 ${proseCls}`}>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
            Developer Analytics
          </p>
          <h1 className="mb-1 text-4xl sm:text-5xl font-light tracking-tight text-light-text dark:text-dark-text">
            Document
          </h1>
          <p className="text-lg font-light font-zen text-light-text-secondary dark:text-dark-text-secondary">
            ドキュメント
          </p>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Work", href: "/work" }, { label: "Docs" }]}
        />

        {/* Introduction */}
        <div className={`mb-16 ${proseCls}`}>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Developer analytics, API reference, and project guides.
          </p>
          <p className="text-base text-light-text dark:text-dark-text leading-relaxed mb-8">
            This portfolio combines React 19, Express 5, and MongoDB into a
            full-stack application. The docs cover the project&apos;s
            architecture and design system.
          </p>
          <Callout title="Design principle">
            Prefer &apos;few, high-quality primitives&apos; over scattered
            features. If a workflow cannot be explained in one screen, we
            simplify it.
          </Callout>
        </div>

        {/* ========== What you can do ========== */}
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

        {/* ========== Repo Cards (Skill Showcase) ========== */}
        <DocSection
          title="Project Docs"
          subtitle="คลิกที่ repo card เพื่อดูเอกสาร (README) ของโปรเจกต์นั้น"
          wide
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.primary}60, ${TH.secondary}60, transparent)`,
              }}
            />
            {reposLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 animate-pulse bg-light-surface-2 dark:bg-dark-surface h-40"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {repoCardData.map((repo, i) => (
                  <RepoCard
                    key={i}
                    {...repo}
                    onClick={() => handleRepoClick(repo.name)}
                  />
                ))}
              </div>
            )}
            {!reposLoading && repos.length === 0 && (
              <p className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
                No repositories found
              </p>
            )}
          </div>
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

        {/* ========== Design System ========== */}
        <DesignSystemSection />

        {/* ========== Changelog ========== */}
        <ChangelogSection />
      </div>
    </div>
  );
};

export default Docs;
