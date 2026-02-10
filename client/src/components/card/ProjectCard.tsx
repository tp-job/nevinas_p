import type { FC } from 'react';
import type { GitHubRepo } from '@/utils/api';

// Gradient backgrounds per category
const GRADIENTS: Record<string, string> = {
    react: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    tailwindcss: 'from-[#0f172a] via-[#1e3a5f] to-[#0ea5e9]/30',
    html: 'from-[#1a1a2e] via-[#2d1b4e] to-[#e34c26]/20',
    default: 'from-[#1a1a2e] via-[#16213e] to-[#3E60C1]/20',
};

const ICONS: Record<string, string> = {
    react: 'ri-reactjs-line',
    tailwindcss: 'ri-tailwind-css-fill',
    html: 'ri-html5-line',
    css: 'ri-css3-line',
    default: 'ri-code-s-slash-line',
};

interface ProjectCardProps {
    repo: GitHubRepo;
    category: string; // 'react' | 'tailwindcss' | 'html' | etc.
    categoryLabel: string;
}

const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return '';
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
};

const ProjectCard: FC<ProjectCardProps> = ({ repo, category, categoryLabel }) => {
    const gradient = GRADIENTS[category] || GRADIENTS.default;
    const icon = ICONS[category] || ICONS.default;

    const openPreview = (url: string | null | undefined) => {
        if (url && url !== '#' && url !== '') {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="group flex flex-col bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            {/* Image / Hero section */}
            <div
                className={`relative h-56 overflow-hidden bg-linear-to-br ${gradient}`}
                onClick={() => openPreview(repo.homepage)}
            >
                {/* Animated icon background */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className={`${icon} text-[120px] text-white/[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}></i>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category badge (like Blog) */}
                <div className="absolute top-4 left-4 bg-light-bg/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-global-blue uppercase tracking-wide shadow-sm">
                    {categoryLabel}
                </div>

                {/* Language badge */}
                {repo.language && (
                    <div className="absolute top-4 right-4 bg-dark-bg/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white/90 shadow-sm">
                        {repo.language}
                    </div>
                )}

                {/* Repo icon center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className={`${icon} text-3xl text-white`}></i>
                    </div>
                </div>
            </div>

            {/* Content section (matching Blog layout) */}
            <div className="flex flex-col grow p-6">
                {/* Meta info (like blog date/readTime) */}
                <div className="flex items-center text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 space-x-3">
                    <div className="flex items-center gap-1">
                        <i className="ri-star-line"></i>
                        <span>{repo.stargazers_count} stars</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="ri-git-branch-line"></i>
                        <span>{repo.forks_count} forks</span>
                    </div>
                    {repo.pushed_at && (
                        <div className="flex items-center gap-1">
                            <i className="ri-time-line"></i>
                            <span>{formatRelativeTime(repo.pushed_at)}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3 group-hover:text-global-blue transition-colors line-clamp-2">
                    {repo.name}
                </h3>

                {/* Description */}
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-3 text-sm grow">
                    {repo.description || 'No description available'}
                </p>

                {/* Topics */}
                {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {repo.topics.slice(0, 4).map(topic => (
                            <span key={topic} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-global-blue/10 text-global-blue">
                                {topic}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer with buttons (like Blog arrow) */}
                <div className="flex items-center gap-3 pt-4 border-t border-light-border dark:border-dark-border mt-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); openPreview(repo.homepage); }}
                        disabled={!repo.homepage}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-global-blue/10 text-global-blue hover:bg-global-blue hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-global-blue/10 disabled:hover:text-global-blue"
                    >
                        <i className="ri-eye-line"></i>
                        Preview
                    </button>
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-text hover:text-light-bg dark:hover:bg-dark-text dark:hover:text-dark-bg transition-all duration-300"
                    >
                        <i className="ri-github-line"></i>
                        Source
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
