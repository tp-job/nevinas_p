import { useState, useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import RepoCard from "@/components/card/RepoCard";
import { githubApi, type GitHubRepo } from "@/utils/api";
import {
  apiEndpoints,
  dataModels,
  architecture,
  projectDetailByRepo,
  folderStructure,
  gettingStarted,
  designSystem,
  changelog,
} from "@/data/docData";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00ADD8",
};

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "Recently";
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

// Theme accent
const TH = {
  azure: "#5983FC",
  orchid: "#964EC2",
  green: "#0f9d58",
  yellow: "#f4b400",
  flamingo: "#FF7BBF",
  royal: "#3E60C1",
};

/* ==================== Breadcrumb ==================== */
const Breadcrumb: FC<{ items: { label: string; href?: string }[] }> = ({
  items,
}) => (
  <nav className="flex items-center gap-2 text-sm mb-8 text-light-text-secondary dark:text-dark-text-secondary">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="opacity-60">/</span>}
        {item.href ? (
          <Link to={item.href} className="text-matte-azure hover:underline">
            {item.label}
          </Link>
        ) : (
          <span className="text-light-text dark:text-dark-text">
            {item.label}
          </span>
        )}
      </span>
    ))}
  </nav>
);

/* ==================== Doc Section (Introduction style) ==================== */
const DocSection: FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="mb-16">
    <h2 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-6">
        {subtitle}
      </p>
    )}
    <div className="space-y-6 text-light-text dark:text-dark-text leading-relaxed">
      {children}
    </div>
  </section>
);

/* ==================== Callout Box ==================== */
const Callout: FC<{
  title: string;
  children: React.ReactNode;
  icon?: string;
}> = ({ title, children, icon = "ri-information-line" }) => (
  <div className="flex gap-4 p-5 rounded-xl bg-light-surface-2/80 dark:bg-dark-surface/80 border-l-4 border-matte-azure">
    <i className={`${icon} text-xl text-matte-azure shrink-0 mt-0.5`}></i>
    <div>
      <p className="font-bold text-light-text dark:text-dark-text mb-2">
        {title}
      </p>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
        {children}
      </p>
    </div>
  </div>
);

/* ==================== Method Badge ==================== */
const MethodBadge: FC<{ method: string }> = ({ method }) => {
  const cls: Record<string, string> = {
    GET: "bg-global-green/10 text-global-green",
    POST: "bg-global-yellow/10 text-global-yellow",
    PUT: "bg-matte-azure/10 text-matte-azure",
    DELETE: "bg-global-red/10 text-global-red",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls[method] || "bg-light-surface-2 text-light-text-secondary"}`}
    >
      {method}
    </span>
  );
};

/* ==================== Color Swatch ==================== */
const ColorSwatch: FC<{ name: string; hex: string; variable: string }> = ({
  name,
  hex,
  variable,
}) => (
  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50 transition-colors">
    <div
      className="w-8 h-8 rounded-lg shrink-0 ring-1 ring-light-border dark:ring-dark-border"
      style={{ backgroundColor: hex }}
    />
    <div className="min-w-0">
      <p className="text-xs font-semibold text-light-text dark:text-dark-text truncate">
        {name}
      </p>
      <p className="text-[10px] font-mono text-light-text-secondary dark:text-dark-text-secondary">
        {hex}
      </p>
    </div>
  </div>
);

/* ==================== Docs Page ==================== */
const Docs: FC = () => {
  const [openModel, setOpenModel] = useState<string | null>("Project");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedRepoData, setSelectedRepoData] = useState<GitHubRepo | null>(
    null,
  );
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  const cardCls =
    "bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden";

  useEffect(() => {
    (async () => {
      try {
        setReposLoading(true);
        const data = await githubApi.getRepos();
        setRepos(data);
      } catch {
        setRepos([]);
      } finally {
        setReposLoading(false);
      }
    })();
  }, []);

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
    } catch {
      setReadmeError("README not found or failed to load");
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

  const projectArchitecture = selectedRepo
    ? projectDetailByRepo[selectedRepo]
    : null;

  const repoCardData = repos.map((repo) => ({
    name: repo.name,
    description: repo.description || "No description available",
    language: repo.language || "Unknown",
    languageColor: LANG_COLORS[repo.language || ""] || "#6e7681",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: formatRelativeTime(repo.updated_at),
    url: repo.html_url,
  }));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
          Developer Analytics
        </h4>
        <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
          Document
        </h2>
        <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
          ドキュメント
        </h3>
      </div>
      {/* Doc-style content wrapper */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Work", href: "/work" }, { label: "Docs" }]}
        />

        {/* Header / Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-light-text dark:text-dark-text mb-3">
            Documentation
          </h1>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Developer analytics, API reference, and project guides.
          </p>
          <p className="text-base text-light-text dark:text-dark-text leading-relaxed mb-8">
            This portfolio combines React 19, Express 5, and MongoDB into a
            full-stack application. The docs cover architecture, API endpoints,
            data models, and setup instructions for local development.
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
            <li>Explore API endpoints and data models.</li>
            <li>Follow the getting started guide for local setup.</li>
          </ul>
        </DocSection>

        {/* ========== Repo Cards (Skill Showcase) ========== */}
        <DocSection
          title="Project Docs"
          subtitle="คลิกที่ repo card เพื่อดูเอกสาร (README) ของโปรเจกต์นั้น"
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
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
          <>
            {/* Architecture Overview — for repos with projectDetailByRepo */}
            {projectArchitecture && (
              <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
                  }}
                />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                      <i className="ri-folder-3-line mr-2 text-matte-azure"></i>
                      {selectedRepo} — Project Detail
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                      Technology stack breakdown
                    </p>
                  </div>
                  <button
                    onClick={clearSelectedRepo}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:bg-matte-azure/10 hover:text-matte-azure transition-colors"
                  >
                    <i className="ri-arrow-left-line mr-1"></i> Back
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      title: "Frontend",
                      icon: "ri-window-line",
                      color: TH.azure,
                      data: projectArchitecture.frontend,
                    },
                    {
                      title: "Backend",
                      icon: "ri-server-line",
                      color: TH.orchid,
                      data: projectArchitecture.backend,
                    },
                    {
                      title: "Dev Tools",
                      icon: "ri-tools-line",
                      color: TH.yellow,
                      data: projectArchitecture.devTools,
                    },
                  ].map((section) => (
                    <div
                      key={section.title}
                      className="p-5 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${section.color}15` }}
                        >
                          <i
                            className={`${section.icon} text-lg`}
                            style={{ color: section.color }}
                          ></i>
                        </div>
                        <h4 className="text-sm font-bold text-light-text dark:text-dark-text">
                          {section.title}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(section.data).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: section.color }}
                            />
                            <div>
                              <span className="text-[11px] font-medium text-light-text-secondary dark:text-dark-text-secondary capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <p className="text-xs font-semibold text-light-text dark:text-dark-text">
                                {value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simple Tech Stack — for repos without projectDetailByRepo */}
            {!projectArchitecture && selectedRepoData && (
              <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)`,
                  }}
                />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                      <i className="ri-folder-3-line mr-2 text-matte-azure"></i>
                      {selectedRepo} — Project Info
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                      {selectedRepoData.description || "No description"}
                    </p>
                  </div>
                  <button
                    onClick={clearSelectedRepo}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:bg-matte-azure/10 hover:text-matte-azure transition-colors"
                  >
                    <i className="ri-arrow-left-line mr-1"></i> Back
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedRepoData.language && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            LANG_COLORS[selectedRepoData.language] || "#6e7681",
                        }}
                      />
                      <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {selectedRepoData.language}
                      </span>
                    </div>
                  )}
                  {(selectedRepoData.topics || []).map((t) => (
                    <span
                      key={t}
                      className="px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* README Viewer */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)`,
                }}
              />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                  <i className="ri-file-list-3-line mr-2 text-matte-azure"></i>
                  {selectedRepo} — README
                </h3>
                {!projectArchitecture && !selectedRepoData && (
                  <button
                    onClick={clearSelectedRepo}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:bg-matte-azure/10 hover:text-matte-azure transition-colors"
                  >
                    <i className="ri-arrow-left-line mr-1"></i> Back
                  </button>
                )}
              </div>
              {readmeLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin w-10 h-10 border-2 border-matte-azure border-t-transparent rounded-full" />
                </div>
              )}
              {readmeError && (
                <div className="py-12 text-center">
                  <i className="ri-error-warning-line text-4xl text-global-red mb-3"></i>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    {readmeError}
                  </p>
                </div>
              )}
              {readmeContent && !readmeLoading && (
                <div
                  className="prose-doc [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-light-text [&_h1]:dark:text-dark-text
                            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-light-text [&_h2]:dark:text-dark-text
                            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-light-text [&_h3]:dark:text-dark-text
                            [&_p]:text-base [&_p]:text-light-text [&_p]:dark:text-dark-text [&_p]:mb-4 [&_p]:leading-relaxed
                            [&_a]:text-matte-azure [&_a]:underline [&_a]:hover:no-underline
                            [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:bg-light-surface-2 [&_code]:dark:bg-dark-surface [&_code]:font-mono
                            [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:bg-light-surface-2 [&_pre]:dark:bg-dark-surface [&_pre]:border [&_pre]:border-light-border [&_pre]:dark:border-dark-border [&_pre]:mb-6
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-light-text [&_ul]:dark:text-dark-text
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-light-text [&_ol]:dark:text-dark-text"
                >
                  <ReactMarkdown>{readmeContent}</ReactMarkdown>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========== Architecture ========== */}
        <DocSection
          title="Architecture Overview"
          subtitle="Technology stack breakdown"
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "Frontend",
                  icon: "ri-window-line",
                  color: TH.azure,
                  data: architecture.frontend,
                },
                {
                  title: "Backend",
                  icon: "ri-server-line",
                  color: TH.orchid,
                  data: architecture.backend,
                },
                {
                  title: "Dev Tools",
                  icon: "ri-tools-line",
                  color: TH.yellow,
                  data: architecture.devTools,
                },
              ].map((section) => (
                <div
                  key={section.title}
                  className="p-5 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${section.color}15` }}
                    >
                      <i
                        className={`${section.icon} text-lg`}
                        style={{ color: section.color }}
                      ></i>
                    </div>
                    <h4 className="text-sm font-bold text-light-text dark:text-dark-text">
                      {section.title}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(section.data).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: section.color }}
                        />
                        <div>
                          <span className="text-[11px] font-medium text-light-text-secondary dark:text-dark-text-secondary capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <p className="text-xs font-semibold text-light-text dark:text-dark-text">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DocSection>

        {/* ========== API Documentation ========== */}
        <DocSection title="API Endpoints" subtitle="REST API documentation">
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)`,
              }}
            />
            <div className="space-y-2">
              {apiEndpoints.map((api) => (
                <div
                  key={api.path}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3.5 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-matte-azure/30 transition-colors"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <MethodBadge method={api.method} />
                    <code className="text-sm font-mono font-semibold text-light-text dark:text-dark-text">
                      {api.path}
                    </code>
                  </div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary flex-1">
                    {api.description}
                  </p>
                  <code className="text-[10px] font-mono px-2 py-1 rounded-md bg-light-border/30 dark:bg-dark-border/30 text-light-text-secondary dark:text-dark-text-secondary shrink-0 hidden lg:block">
                    {api.response}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </DocSection>

        {/* ========== Data Models ========== */}
        <DocSection title="Data Models" subtitle="MongoDB collection schemas">
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.orchid}60, ${TH.flamingo}60, transparent)`,
              }}
            />

            {/* Model tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {dataModels.map((m) => (
                <button
                  key={m.name}
                  onClick={() =>
                    setOpenModel(openModel === m.name ? null : m.name)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    openModel === m.name
                      ? "bg-matte-azure text-white shadow-lg"
                      : "bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:text-matte-azure"
                  }`}
                >
                  {m.name}
                  <span className="ml-2 text-[10px] opacity-70">
                    ({m.fields.length})
                  </span>
                </button>
              ))}
            </div>

            {/* Model fields */}
            {dataModels
              .filter((m) => m.name === openModel)
              .map((model) => (
                <div key={model.name} className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-light-border dark:border-dark-border">
                        {["Field", "Type", "Required", "Description"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {model.fields.map((f) => (
                        <tr
                          key={f.name}
                          className="border-b border-light-border/30 dark:border-dark-border/30 hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50"
                        >
                          <td className="py-2.5 px-4 font-mono font-semibold text-matte-azure text-xs">
                            {f.name}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-xs text-velvet-orchid">
                            {f.type}
                          </td>
                          <td className="py-2.5 px-4">
                            {f.required ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-global-red/10 text-global-red">
                                required
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-light-text-secondary dark:text-dark-text-secondary">
                                optional
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {f.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        </DocSection>

        {/* ========== Getting Started ========== */}
        <DocSection
          title="Getting Started"
          subtitle="Setup guide for local development"
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)`,
              }}
            />
            <div className="space-y-5">
              {gettingStarted.map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-matte-azure/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-matte-azure">
                      {s.step}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-light-text dark:text-dark-text mb-1">
                      {s.title}
                    </h4>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">
                      {s.description}
                    </p>
                    <pre className="text-[11px] font-mono leading-relaxed p-3 rounded-lg overflow-x-auto bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
                      {s.command}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DocSection>

        {/* ========== Folder Structure ========== */}
        <DocSection
          title="Folder Structure"
          subtitle="Project directory layout"
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.royal}60, transparent)`,
              }}
            />
            <pre className="text-[11px] font-mono leading-relaxed p-5 rounded-xl overflow-x-auto bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
              {folderStructure}
            </pre>
          </div>
        </DocSection>

        {/* ========== Design System ========== */}
        <DocSection
          title="Design System"
          subtitle="Theme colors and typography"
        >
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.flamingo}60, ${TH.orchid}60, transparent)`,
              }}
            />

            {/* Main Theme */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">
              Main Theme (Matte + Velvet)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-6">
              {designSystem.mainTheme.map((c) => (
                <ColorSwatch key={c.hex} {...c} />
              ))}
            </div>

            {/* Light + Dark */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">
                  Light Mode
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {designSystem.lightMode.map((c) => (
                    <ColorSwatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">
                  Dark Mode
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {designSystem.darkMode.map((c) => (
                    <ColorSwatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
            </div>

            {/* Fonts */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">
              Typography
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {designSystem.fonts.map((f) => (
                <div
                  key={f.name}
                  className="p-4 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border"
                >
                  <p
                    className={`text-lg font-semibold text-light-text dark:text-dark-text mb-1 ${f.variable === "--font-zen" ? "font-zen" : "font-inter"}`}
                  >
                    {f.name}
                  </p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {f.usage}
                  </p>
                  <code className="text-[10px] font-mono mt-1 text-matte-azure">
                    {f.variable}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </DocSection>

        {/* ========== Changelog ========== */}
        <DocSection title="Changelog" subtitle="Version history">
          <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)`,
              }}
            />
            <div className="space-y-6">
              {changelog.map((entry, i) => (
                <div key={entry.version} className="relative pl-8">
                  {/* Timeline */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-light-border dark:bg-dark-border" />
                  <div
                    className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full border-2 border-light-surface dark:border-dark-bg"
                    style={{
                      backgroundColor:
                        i === 0 ? TH.azure : i === 1 ? TH.orchid : "#9ca3af",
                    }}
                  />

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-light-text dark:text-dark-text">
                      v{entry.version}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                      {entry.date}
                    </span>
                    {i === 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-matte-azure/10 text-matte-azure">
                        Latest
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {entry.changes.map((change, ci) => (
                      <li
                        key={ci}
                        className="flex items-start gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary"
                      >
                        <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-light-text-secondary dark:bg-dark-text-secondary" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </DocSection>
      </div>
    </div>
  );
};

export default Docs;
