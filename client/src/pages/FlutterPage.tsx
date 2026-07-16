import { useMemo } from "react";
import type { FC } from "react";
import Loading from "@/components/common/loading/Loading";
import Error from "@/components/common/server-error/Error";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";

const FlutterPage: FC = () => {
  const { data, loading, error } = useFetch(
    githubApi.getRepos,
    [],
    "Failed to fetch Flutter projects",
  );
  const flutterProjects = useMemo(
    () => filterReposByKeywords(data ?? [], ["flutter", "dart"]),
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
            Flutter
          </h2>
          <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
            フラッター
          </h3>
        </div>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {!loading && !error && (
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
      )}

      {!loading && !error && flutterProjects.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            No Flutter projects found
          </p>
        </div>
      )}
    </div>
  );
};

export default FlutterPage;
