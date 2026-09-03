import { useMemo } from "react";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import PageHeader from "@/components/common/PageHeader";

const Website = () => {
  const { data, loading, error } = useFetch(githubApi.getRepos, [], {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to fetch projects from GitHub",
    notifyOnError: false,
  });
  const projects = useMemo(
    () => filterReposByKeywords(data ?? [], ["html", "css"], ["HTML", "CSS"]),
    [data],
  );

  return (
    <>
      <div className="w-full">
        <PageHeader
          eyebrow="Skill Showcase"
          title="Website (HTML/CSS/JS)"
          jp="ウェブサイト"
        />
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={projects.length === 0}
        emptyMessage="No HTML/CSS projects found"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              category="html"
              categoryLabel="HTML / CSS"
            />
          ))}
        </div>
      </AsyncBoundary>
    </>
  );
};

export default Website;
