import { useState, useEffect, type FC } from 'react';
import BlogPostPage from '@/components/common/BlogPostPage';
import BlogCard from '@/components/card/BlogCard';
import { blogsApi } from '@/utils/api';
import type { BlogPost } from '@/types/blog';

const BlogPage: FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await blogsApi.getAll();
                // Map server data to BlogPost type
                const mapped: BlogPost[] = data.map(blog => ({
                    id: blog._id,
                    title: blog.title,
                    excerpt: blog.excerpt,
                    content: blog.content,
                    author: blog.author,
                    role: blog.role,
                    date: blog.date,
                    readTime: blog.readTime,
                    category: blog.category,
                    imageUrl: blog.imageUrl,
                    authorAvatar: blog.authorAvatar,
                }));
                setPosts(mapped);
            } catch {
                setError('Failed to load blog posts');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // If a post is selected, show the detail view
    if (selectedPost) {
        return <BlogPostPage post={selectedPost} onBack={() => setSelectedPost(null)} />;
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Blog</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">ドキュメント</h3>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border overflow-hidden">
                            <div className="h-56 bg-light-surface-2 dark:bg-dark-surface" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 w-1/3 rounded bg-light-border dark:bg-dark-border" />
                                <div className="h-6 w-3/4 rounded bg-light-border dark:bg-dark-border" />
                                <div className="h-4 w-full rounded bg-light-border dark:bg-dark-border" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-2xl p-6 bg-global-red/5 border border-global-red/20">
                    <p className="text-center text-global-red">
                        <i className="ri-error-warning-line mr-2"></i>{error}
                    </p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map(post => (
                        <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
                    ))}
                </div>
            )}

            {!loading && !error && posts.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">No blog posts found</p>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
