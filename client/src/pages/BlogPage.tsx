import { useState, useMemo, type FC } from "react";
import BlogPostPage from "@/components/common/BlogPostPage";
import BlogCard from "@/components/card/BlogCard";
import { blogsApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import type { BlogPost } from "@/types/blog";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";

const BlogPage: FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data, loading, error } = useFetch(blogsApi.getAll, [], {
    // notifyOnError: false — this page renders <ErrorDisplay> inline already.
    errorMessage: "Failed to load blog posts",
    notifyOnError: false,
  });
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
      <PageHeader
        eyebrow="Developer Analytics"
        title="Blog"
        jp="ドキュメント"
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={posts.length === 0}
        emptyState={
          <EmptyState
            icon="ri-article-line"
            title="No blog posts found"
            description="There are no published posts to show right now."
            hint="Check back soon — new writing lands here first."
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
};

export default BlogPage;
