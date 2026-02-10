import type { FC } from 'react';
import type { BlogPost } from '@/types/blog';

const BlogPostPage: FC<{ post: BlogPost; onBack: () => void }> = ({ post, onBack }) => {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg animate-in fade-in duration-300">
            {/* hero section */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-dark-bg/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-6 pb-12">
                    <button onClick={onBack} className="absolute top-8 left-6 md:left-0 flex items-center text-light-surface/80 hover:text-light-surface transition-colors bg-dark-bg/20 hover:bg-dark-bg/40 px-4 py-2 rounded-full backdrop-blur-md">
                        <i className="ri-arrow-left-s-line"></i>
                        Back to Articles
                    </button>
                    <span className="text-global-blue font-bold tracking-wider uppercase mb-4 text-sm">{post.category}</span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-light-bg mb-6 leading-tight">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-light-bg/90">
                        <div className="flex items-center text-sm bg-light-bg/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <i className="ri-calendar-schedule-line"></i>
                            {post.date}
                        </div>
                        <div className="flex items-center text-sm bg-light-bg/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <i className="ri-time-line"></i>
                            {post.readTime}
                        </div>
                    </div>
                </div>
            </div>
            {/* main content area */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* article body */}
                <article className="lg:col-span-11">
                    <div className="prose prose-lg prose-blue max-w-none text-light-text dark:text-dark-text leading-relaxed">
                        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary font-light leading-relaxed mb-8 border-l-4 border-light-surface-2 dark:border-dark-surface pl-4">{post.excerpt}</p>
                        {/* Using dangerouslySetInnerHTML for the mock HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                    {/* Tags */}
                    <div className="mt-12 flex gap-2">
                        {['Technology', 'Web', 'Development'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-light-surface text-dark-surface rounded-full text-sm hover:bg-light-surface-2 cursor-pointer">#{tag}</span>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-8 border-t pt-6">
                        <button className="p-3 rounded-full text-gray-500 hover:text-global-redpink hover:bg-red-50 transition-all group">
                            <i className="ri-poker-hearts-line text-2xl group-hover:fill-current"></i>
                        </button>
                        <button className="p-3 rounded-full text-gray-500 hover:text-global-blue hover:bg-blue-50 transition-all">
                            <i className="ri-share-line text-2xl group-hover:fill-current"></i>
                        </button>
                        <button className="p-3 rounded-full text-gray-500 hover:text-global-yellow hover:bg-yellow-50 transition-all">
                            <i className="ri-star-line text-2xl group-hover:fill-current"></i>
                        </button>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
