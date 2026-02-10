import type { FC } from 'react';
import type { BlogPost } from '@/types/blog';
import "@/styles/components/blog.css";

const BlogCard: FC<{ post: BlogPost; onClick: (post: BlogPost) => void }> = ({ post, onClick }) => {
    return (
        <div onClick={() => onClick(post)} className="group flex flex-col bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            {/* image container */}
            <div className="relative h-56 overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute top-4 left-4 bg-light-bg/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-global-blue uppercase tracking-wide shadow-sm">{post.category}</div>
            </div>

            {/* content */}
            <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 space-x-3">
                    <div className="flex items-center">
                        <i className="ri-calendar-schedule-line"></i>
                        {post.date}
                    </div>
                    <div className="flex items-center">
                        <i className="ri-time-line"></i>
                        {post.readTime}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3 group-hover:text-global-blue transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 line-clamp-3 text-sm flex-grow">{post.excerpt}</p>

                {/* author footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="bg-blue-50 p-2 rounded-full text-global-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className="ri-arrow-right-s-line"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
