import { useState, useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import RepoCard from "@/components/card/RepoCard";
import { githubApi, type GitHubRepo } from "@/utils/api";
import Loading from "@/components/common/loading/Loading";
import Error from "@/components/common/server-error/Error";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  "C#": "#239120",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
};

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
};

const Repository: FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await githubApi.getRepos();
        setRepos(data);
      } catch {
        setError("Failed to fetch repositories from GitHub");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get unique languages for filter
  const languages = [
    "all",
    ...Array.from(
      new Set(repos.map((r) => r.language).filter(Boolean) as string[]),
    ),
  ];

  // Filter repos
  const filteredRepos =
    filter === "all" ? repos : repos.filter((r) => r.language === filter);

  // Transform to RepoCard format
  const repositories = filteredRepos.map((repo) => ({
    name: repo.name,
    description: repo.description || "No description available",
    language: repo.language || "Unknown",
    languageColor: LANG_COLORS[repo.language || ""] || "#6e7681",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: formatRelativeTime(repo.github_updated_at),
    url: repo.html_url,
  }));

  return (
    <div>
      <div className="w-full">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
              Skill Showcase
            </h4>
            <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
              Repository
            </h2>
            <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
              リポジトリ
            </h3>
          </div>
          <Link
            to="/work/repository/graph-view"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-surface-secondary border border-border-primary/60 text-text-secondary hover:bg-surface-primary hover:text-text-primary transition-all"
          >
            <i className="ri-node-tree"></i>
            Graph View
          </Link>
        </div>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {/* Stats + Filter */}
      {!loading && !error && (
        <div className="mb-6 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-secondary border border-border-primary/50">
          <p className="text-sm text-text-secondary">
            <i className="ri-github-fill mr-2"></i>
            GitHub Repositories:{" "}
            <span className="font-semibold">{repos.length}</span>
            {filter !== "all" && (
              <span>
                {" "}
                ({filteredRepos.length} {filter})
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === lang
                    ? "bg-global-blue text-white"
                    : "bg-surface-primary text-text-secondary border border-border-primary/60 hover:bg-surface-secondary hover:text-text-primary"
                }`}
              >
                {lang === "all" ? "All" : lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Repository Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo, index) => (
            <RepoCard key={index} {...repo} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && repositories.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-surface-secondary border border-border-primary/50">
          <i className="ri-folder-open-line text-4xl mb-4 text-text-muted"></i>
          <p className="text-text-secondary">
            No repositories found
          </p>
        </div>
      )}
    </div>
  );
};

export default Repository;
