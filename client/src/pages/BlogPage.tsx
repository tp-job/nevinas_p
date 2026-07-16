import { useState, useMemo, type FC } from "react";
import BlogPostPage from "@/components/common/BlogPostPage";
import BlogCard from "@/components/card/BlogCard";
import { blogsApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import type { BlogPost } from "@/types/blog";
import Loading from "@/components/common/loading/Loading";
import Error from "@/components/common/server-error/Error";

const BlogPage: FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data, loading, error } = useFetch(
    blogsApi.getAll,
    [],
    "Failed to load blog posts",
  );
  // Map server data to BlogPost type
  const posts: BlogPost[] = useMemo(
    () =>
      (data ?? []).map((blog) => ({
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
      })),
    [data],
  );

  // If a post is selected, show the detail view
  if (selectedPost) {
    return (
      <BlogPostPage post={selectedPost} onBack={() => setSelectedPost(null)} />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
          Developer Analytics
        </h4>
        <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
          Blog
        </h2>
        <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
          ドキュメント
        </h3>
      </div>

      {loading && <Loading />}
      {error && <Error error={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            No blog posts found
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
