import { useState, useEffect, type FC } from 'react';
import RepoCard from '@/components/card/RepoCard';
import { useTheme } from '@/context/ThemeContext';
import { githubApi, type GitHubRepo } from '@/utils/api';

const LANG_COLORS: Record<string, string> = {
    'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Java': '#b07219', 'Go': '#00ADD8',
    'Rust': '#dea584', 'C++': '#f34b7d', 'C#': '#239120', 'PHP': '#4F5D95',
    'Ruby': '#701516', 'Shell': '#89e051',
};

const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
};

const Repository: FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await githubApi.getRepos();
                setRepos(data);
            } catch {
                setError('Failed to fetch repositories from GitHub');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Get unique languages for filter
    const languages = ['all', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean) as string[]))];

    // Filter repos
    const filteredRepos = filter === 'all' ? repos : repos.filter(r => r.language === filter);

    // Transform to RepoCard format
    const repositories = filteredRepos.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        language: repo.language || 'Unknown',
        languageColor: LANG_COLORS[repo.language || ''] || '#6e7681',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: formatRelativeTime(repo.updated_at),
        url: repo.html_url,
    }));

    const LoadingSkeleton = () => (
        <div className={`rounded-xl p-6 animate-pulse ${isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'}`}>
            <div className={`h-6 rounded w-3/4 mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className={`h-4 rounded w-full mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className={`h-4 rounded w-2/3 mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex gap-4">
                <div className={`h-4 rounded w-16 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded w-12 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="w-full">
                <div className="mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Skill Showcase</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Repository</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">リポジトリ</h3>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className={`rounded-xl p-6 mb-6 ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        <i className="ri-error-warning-line mr-2"></i>
                        {error}
                    </p>
                </div>
            )}

            {/* Stats + Filter */}
            {!loading && !error && (
                <div className={`mb-6 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-slate-800/30' : 'bg-slate-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                        <i className="ri-github-fill mr-2"></i>
                        GitHub Repositories: <span className="font-semibold">{repos.length}</span>
                        {filter !== 'all' && <span> ({filteredRepos.length} {filter})</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => setFilter(lang)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === lang
                                    ? 'bg-global-blue text-white'
                                    : isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {lang === 'all' ? 'All' : lang}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Repository Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <LoadingSkeleton key={index} />
                    ))
                ) : (
                    repositories.map((repo, index) => (
                        <RepoCard key={index} {...repo} />
                    ))
                )}
            </div>

            {/* Empty State */}
            {!loading && !error && repositories.length === 0 && (
                <div className={`text-center py-12 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-100'}`}>
                    <i className={`ri-folder-open-line text-4xl mb-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}></i>
                    <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                        No repositories found
                    </p>
                </div>
            )}
        </div>
    );
};

export default Repository;
