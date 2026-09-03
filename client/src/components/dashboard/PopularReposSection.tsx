import type { FC } from "react";
import RepoCard from "@/components/card/RepoCard";
import { StaggerItem } from "@/components/ui/StaggerList";

export interface RepoCardData {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

interface PopularReposSectionProps {
  repositories: RepoCardData[];
}

/** Popular Repositories — curated selection of high-impact projects. */
const PopularReposSection: FC<PopularReposSectionProps> = ({
  repositories,
}) => (
  <StaggerItem className="lg:col-span-12 mb-12">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-2xl font-medium text-light-text dark:text-dark-text">
          Popular Repositories
        </h3>
        <p className="text-sm mt-1 text-light-text-secondary dark:text-dark-text-secondary">
          Curated selection of high-impact projects
        </p>
      </div>
      <a
        href="/work/repository"
        className="flex items-center gap-2 text-sm font-semibold text-global-blue hover:text-matte-azure transition-colors"
      >
        Portfolio <i className="ri-arrow-right-line"></i>
      </a>
    </div>

    {repositories.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repositories.map((repo, i) => (
          <RepoCard key={i} {...repo} />
        ))}
      </div>
    ) : (
      <div className="rounded-3xl p-12 bg-light-surface-2 dark:bg-dark-surface text-center border-2 border-dashed border-light-border dark:border-dark-border/20">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          No repository data available for display
        </p>
      </div>
    )}
  </StaggerItem>
);

export default PopularReposSection;
