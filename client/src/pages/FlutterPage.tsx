import { useMemo } from "react";
import type { FC } from "react";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import EmptyState from "@/components/common/EmptyState";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";
import PageHeader from "@/components/common/PageHeader";

const FlutterPage: FC = () => {
  const { data, loading, error } = useFetch(githubApi.getRepos, [], {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch Flutter projects",
    notifyOnError: false,
  });
  const flutterProjects = useMemo(
    () => filterReposByKeywords(data ?? [], ["flutter", "dart"]),
    [data],
  );

  return (
    <div>
      <div className="w-full">
        <PageHeader eyebrow="Skill Showcase" title="Flutter" jp="フラッター" />
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={flutterProjects.length === 0}
        emptyState={
          <EmptyState
            icon="ri-flutter-line"
            title="No Flutter projects found"
            description="No repositories tagged Flutter or Dart were returned."
            hint="They may still be syncing from GitHub."
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {flutterProjects.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              category="flutter"
              categoryLabel="Flutter"
            />
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
};

export default FlutterPage;
