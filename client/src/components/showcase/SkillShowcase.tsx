import { useMemo, type FC } from "react";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { filterReposByKeywords } from "@/utils/repoFilters";
import ProjectCard from "@/components/card/ProjectCard";
import PageHeader from "@/components/common/PageHeader";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import EmptyState from "@/components/common/EmptyState";
import type { SkillShowcase as Config } from "@/data/skillShowcases";

/**
 * One page, four routes.
 *
 * Website, React, TailwindCSS and Flutter were four page files that were the
 * same file — see data/skillShowcases.ts for what actually differed between
 * them (a keyword array, a title, a badge, an empty-state string). Everything
 * else below was copy-pasted four times.
 *
 * The route files stay as four thin wrappers rather than one parameterised
 * route, because AppRoutes.tsx lazy-loads each page and collapsing them into a
 * single `:slug` route would either break those URLs or put all four in one
 * chunk. Four three-line files preserve the routing and the code splitting
 * while holding zero duplicated logic.
 *
 * ONE BEHAVIOUR CHANGED IN THE MERGE, DELIBERATELY.
 *
 * Three of the four passed `emptyMessage` (a bare string) to AsyncBoundary
 * while Flutter passed a full `<EmptyState>` with an icon, a description and a
 * hint. Flutter's was plainly the better empty state and there was no reason
 * the other three had the poorer one beyond nobody having gone back to update
 * the copies. All four now render EmptyState.
 */
const SkillShowcase: FC<{ config: Config }> = ({ config }) => {
  const { data, loading, error } = useFetch(githubApi.getRepos, [], {
    // notifyOnError: false — AsyncBoundary renders <ErrorDisplay> inline, so a
    // toast on top of it would report the same failure twice.
    errorMessage: `Failed to fetch ${config.title} projects from GitHub`,
    notifyOnError: false,
  });

  const projects = useMemo(
    () =>
      filterReposByKeywords(
        data ?? [],
        config.keywords,
        config.languages ?? [],
      ),
    [data, config.keywords, config.languages],
  );

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Skill Showcase"
        title={config.title}
        jp={config.jp}
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={projects.length === 0}
        emptyState={
          <EmptyState
            icon={config.icon}
            title={config.emptyTitle}
            description={config.emptyDescription}
            hint="They may still be syncing from GitHub."
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              category={config.category}
              categoryLabel={config.categoryLabel}
            />
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
};

export default SkillShowcase;
