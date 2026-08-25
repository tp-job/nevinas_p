import { useMemo } from "react";
import type { FC } from "react";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";

const ReactPage: FC = () => {
  const { data, loading, error } = useFetch(
    githubApi.getRepos,
    [],
    {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch React projects",
    notifyOnError: false,
  },
  );
  const reactProjects = useMemo(
    () => filterReposByKeywords(data ?? [], ["react", "reactjs"]),
    [data],
  );

  return (
    <div>
      <div className="w-full">
        <div className="mb-4">
          <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
            Skill Showcase
          </h4>
          <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
            React
          </h2>
          <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
            リアクト
          </h3>
        </div>
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={reactProjects.length === 0}
        emptyMessage="No React projects found"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reactProjects.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              category="react"
              categoryLabel="React"
            />
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
};

export default ReactPage;
