import type { FC } from "react";

interface RepoCardProps {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
  /** When provided, card becomes clickable (no external link). Used for Docs page. */
  onClick?: () => void;
}

const RepoCard: FC<RepoCardProps> = ({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  updatedAt,
  url,
  onClick,
}) => {
  const baseCls = `
        group block p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1
        bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]
    `;

  const content = (
    <>
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-light-surface-2 dark:bg-dark-surface shrink-0">
            <i className="ri-folder-3-line text-lg text-global-blue"></i>
          </div>
          <div className="min-w-0 overflow-hidden">
            <h3
              className={`text-lg font-medium text-light-text dark:text-matte-azure group-hover:text-global-blue transition-colors ${name.length > 18 ? "" : "truncate"
                }`}
              title={name}
            >
              {name.length > 18 ? (
                <span className="inline-flex whitespace-nowrap gap-6 animate-marquee">
                  {name}
                  {name}
                </span>
              ) : (
                name
              )}
            </h3>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary shrink-0">
          Public
        </div>
      </div>

      <p className="text-sm mb-5 line-clamp-2 min-h-10 text-light-text-secondary dark:text-dark-text-secondary">
        {description || "No description available"}
      </p>

      <div className="flex items-center gap-4 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-inset ring-black/20 dark:ring-white/20"
            style={{ backgroundColor: languageColor }}
          />
          <span className="font-medium text-light-text-secondary dark:text-dark-text-secondary">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary">
          <i className="ri-star-line text-sm"></i>
          <span className="font-medium">{stars}</span>
        </div>

        <div className="flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary">
          <i className="ri-git-branch-line text-sm"></i>
          <span className="font-medium">{forks}</span>
        </div>

        <div className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">
          <i className="ri-time-line mr-1"></i>
          {updatedAt}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseCls} text-left w-full cursor-pointer`}
      >
        {content}
      </button>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={baseCls}>
      {content}
    </a>
  );
};

export default RepoCard;
