import type { FC } from "react";
import type { TechStackCardProps } from "@/types/techStack";

const TechStackCard: FC<TechStackCardProps> = ({ techStack }) => {
    return (
        <div className="group flex flex-col bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            {/* Hero section (like BlogCard image) */}
            <div className={`relative h-56 overflow-hidden ${techStack.color}`}>
                {/* Watermark icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className={`${techStack.icon} text-[120px] text-white/[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}></i>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Category badge (top-left like Blog) */}
                <div className="absolute top-4 left-4 bg-light-bg/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-global-blue uppercase tracking-wide shadow-sm">
                    {techStack.category}
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className={`${techStack.icon} text-3xl text-white`}></i>
                    </div>
                </div>
            </div>

            {/* Content section (matching Blog layout) */}
            <div className="flex flex-col grow p-6">
                {/* Tool count meta */}
                <div className="flex items-center text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 space-x-3">
                    <div className="flex items-center gap-1">
                        <i className="ri-stack-line"></i>
                        <span>{techStack.itemTools.length} packages</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="ri-external-link-line"></i>
                        <span>Documentation</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3 group-hover:text-global-blue transition-colors line-clamp-2">
                    {techStack.name}
                </h3>

                {/* Description */}
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-3 text-sm grow">
                    {techStack.description}
                </p>

                {/* Tech Items (like topics) */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {techStack.itemTools.map((item, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-global-blue/10 text-global-blue"
                        >
                            {item}
                        </span>
                    ))}
                </div>

                {/* Footer (like Blog footer) */}
                <div className="flex items-center justify-between pt-4 border-t border-light-border dark:border-dark-border mt-auto">
                    <a
                        href={techStack.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary group-hover:text-global-blue transition-colors"
                    >
                        See More
                        <i className="ri-arrow-right-line"></i>
                    </a>
                    <div className="bg-blue-50 dark:bg-global-blue/10 p-2 rounded-full text-global-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className="ri-arrow-right-s-line"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechStackCard;
