import { useMemo } from "react";
import type { FC } from "react";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";
import PageHeader from "@/components/common/PageHeader";

const ReactPage: FC = () => {
  const { data, loading, error } = useFetch(githubApi.getRepos, [], {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch React projects",
    notifyOnError: false,
  });
  const reactProjects = useMemo(
    () => filterReposByKeywords(data ?? [], ["react", "reactjs"]),
    [data],
  );

  return (
    <div>
      <div className="w-full">
        <PageHeader eyebrow="Skill Showcase" title="React" jp="リアクト" />
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
