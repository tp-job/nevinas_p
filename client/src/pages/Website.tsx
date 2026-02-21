import { useState, useEffect } from 'react';
import { githubApi, type GitHubRepo } from '@/utils/api';
import ProjectCard from '@/components/card/ProjectCard';
import Loading from '@/components/ui/common/Loading';
import Error from '@/components/ui/common/Error';

const Website = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const repos = await githubApi.getRepos();
                const filtered = repos.filter(r => {
                    const topics = r.topics || [];
                    const name = (r.name || '').toLowerCase();
                    const desc = (r.description || '').toLowerCase();
                    return topics.includes('html') || topics.includes('css')
                        || r.language === 'HTML' || r.language === 'CSS'
                        || name.includes('html') || name.includes('css')
                        || desc.includes('html') || desc.includes('css');
                });
                setProjects(filtered);
            } catch {
                setError('Failed to fetch projects from GitHub');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <div className="w-full">
                <div className="mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Skill Showcase</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Website (HTML/CSS/JS)</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">ウェブサイト</h3>
                </div>
            </div>

            {loading && <Loading />}
            {error && <Error error={error} />}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map(repo => (
                        <ProjectCard key={repo.id} repo={repo} category="html" categoryLabel="HTML / CSS" />
                    ))}
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">No HTML/CSS projects found</p>
                </div>
            )}
        </>
    );
};

export default Website;
