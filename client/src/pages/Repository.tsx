import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import RepoCard from "@/components/card/RepoCard";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import { formatRelativeTimeLong } from "@/utils/date";
import AsyncBoundary from "@/components/common/AsyncBoundary";

const Repository: FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const { data, loading, error } = useFetch(
    githubApi.getRepos,
    [],
    {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch repositories from GitHub",
    notifyOnError: false,
  },
  );
  const repos = data ?? [];

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
    languageColor: getLangColor(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: formatRelativeTimeLong(repo.github_updated_at),
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

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={repositories.length === 0}
        emptyState={
          <div className="text-center py-12 rounded-xl bg-surface-secondary border border-border-primary/50">
            <i className="ri-folder-open-line text-4xl mb-4 text-text-muted"></i>
            <p className="text-text-secondary">No repositories found</p>
          </div>
        }
      >
        {/* Stats + Filter */}
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
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-primary text-text-secondary border border-border-primary/60 hover:bg-surface-secondary hover:text-text-primary"
                }`}
              >
                {lang === "all" ? "All" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo, index) => (
            <RepoCard key={index} {...repo} />
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
};

export default Repository;
