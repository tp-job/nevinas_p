import type { FC } from 'react';

interface RepoCardProps {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updatedAt: string;
    url: string;
}

const RepoCard: FC<RepoCardProps> = ({ name, description, language, languageColor, stars, forks, updatedAt, url }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="
                group block p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1
                bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                hover:shadow-xl dark:hover:border-matte-azure/50
            "
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-light-surface-2 dark:bg-dark-surface">
                        <i className="ri-folder-3-line text-lg text-global-blue"></i>
                    </div>
                    <h3 className="text-lg font-bold truncate text-light-text dark:text-matte-azure group-hover:text-global-blue transition-colors">
                        {name}
                    </h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                    Public
                </div>
            </div>

            <p className="text-sm mb-5 line-clamp-2 min-h-10 text-light-text-secondary dark:text-dark-text-secondary">
                {description || 'No description available'}
            </p>

            <div className="flex items-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                    <span
                        className="w-3 h-3 rounded-full ring-2 ring-light-surface dark:ring-dark-bg ring-offset-1"
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
        </a>
    );
};

export default RepoCard;
