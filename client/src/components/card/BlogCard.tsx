import type { FC } from "react";
import type { BlogPost } from "@/types/blog";
import "@/styles/components/blog.css";

/**
 * A blog post card.
 *
 * WHAT WAS WRONG WITH THE OLD ONE — the same three faults ProjectCard and
 * ToolCard were rebuilt to remove, still present here because this was the last
 * card the pass did not reach.
 *
 * - `neu-card` (neumorphism: hardcoded rgba, a 20px blur, its own
 *   `translateY(-3px)` on hover) is a different visual language from Nocturnal
 *   Atelier, and it was stacked with a Tailwind `hover:-translate-y-1` — so the
 *   card lifted TWICE on hover, 3px from the CSS class and 4px from the
 *   utility. It also painted its own translucent background underneath the
 *   `bg-light-bg` set right next to it, so two surfaces fought for the same
 *   element.
 * - `font-bold` (700) on the title and the category badge. DS v3.2 allows
 *   nothing above 600, and leads hierarchy with size.
 * - A `cursor-pointer` div with an onClick: no role, no tab stop, and no
 *   keyboard activation. The card was mouse-only. It is now a real button.
 *
 * The heading stays an <h3> inside the button so the post list keeps its
 * document outline; the button carries an explicit aria-label so the readout is
 * the post title rather than the concatenation of every child.
 */
const BlogCard: FC<{ post: BlogPost; onClick: (post: BlogPost) => void }> = ({
  post,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(post)}
      aria-label={`Read: ${post.title}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-light-border bg-light-bg text-left transition-all duration-300 hover:-translate-y-1 hover:border-cool/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle dark:border-dark-border dark:bg-dark-bg dark:hover:border-cool/40"
    >
      {/* image container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.imageUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-light-bg/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-global-blue uppercase tracking-wide shadow-sm">
          {post.category}
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col grow p-6">
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
        <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-3 group-hover:text-global-blue transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 line-clamp-3 text-sm grow">
          {post.excerpt}
        </p>

        {/* author footer */}
        <div className="flex items-center justify-between pt-4 border-t border-light-border dark:border-dark-border mt-auto">
          <div className="bg-periwinkle/10 p-2 rounded-full text-global-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <i className="ri-arrow-right-s-line"></i>
          </div>
        </div>
      </div>
    </button>
  );
};

export default BlogCard;
