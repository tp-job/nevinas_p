import { useMemo } from "react";
import type { FC } from "react";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import PageHeader from "@/components/common/PageHeader";

const TailwindPage: FC = () => {
  const { data, loading, error } = useFetch(githubApi.getRepos, [], {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch projects",
    notifyOnError: false,
  });
  const twProjects = useMemo(
    () => filterReposByKeywords(data ?? [], ["tailwindcss", "tailwind"]),
    [data],
  );

  return (
    <>
      <div className="w-full">
        <PageHeader
          eyebrow="Skill Showcase"
          title="TailwindCSS"
          jp="テイルウィンド"
        />
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={twProjects.length === 0}
        emptyMessage="No TailwindCSS projects found"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {twProjects.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              category="tailwindcss"
              categoryLabel="TailwindCSS"
            />
          ))}
        </div>
      </AsyncBoundary>
    </>
  );
};

export default TailwindPage;
