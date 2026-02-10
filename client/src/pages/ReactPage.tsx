import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Loading from '@/components/ui/common/Loading';
import Error from '@/components/ui/common/Error';
import { githubApi, type GitHubRepo } from '@/utils/api';
import ProjectCard from '@/components/card/ProjectCard';

const ReactPage: FC = () => {
    const [reactProjects, setReactProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
                    return topics.includes('react') || topics.includes('reactjs')
                        || name.includes('react')
                        || desc.includes('react');
                });
                setReactProjects(filtered);
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch React projects');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div>
            <div className="w-full">
                <div className="mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Skill Showcase</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">React</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">リアクト</h3>
                </div>
            </div>

            {loading && <Loading />}
            {error && <Error error={error} />}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reactProjects.map(repo => (
                        <ProjectCard key={repo.id} repo={repo} category="react" categoryLabel="React" />
                    ))}
                </div>
            )}

            {!loading && !error && reactProjects.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">No React projects found</p>
                </div>
            )}
        </div>
    );
};

export default ReactPage;
