import type { FC } from 'react';
import ToolCard from '@/components/card/ToolCard';
import { toolsData, toolSections } from '@/data/toolsData';

const ToolsPage: FC = () => {
    return (
        <section className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Tooling</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">ツール</h3>
            </div>

            {/* Main Tool Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {toolsData.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>

            {/* Tool Sections */}
            <div className="space-y-10">
                {toolSections.map((section) => (
                    <div key={section.id}>
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-matte-azure/10 dark:bg-matte-azure/15 flex items-center justify-center">
                                <i className={`${section.icon} text-lg text-matte-azure`}></i>
                            </div>
                            <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{section.title}</h3>
                            <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                                {section.tools.length} tools
                            </span>
                        </div>

                        {/* Section Tools Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {section.tools.map((tool) => (
                                <a
                                    key={tool.title}
                                    href={tool.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg bg-light-surface dark:bg-dark-bg border-light-border dark:border-dark-border hover:border-matte-azure/30 dark:hover:border-matte-azure/30"
                                >
                                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-light-border dark:bg-dark-border group-hover:bg-matte-azure transition-colors" />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-semibold text-light-text dark:text-dark-text group-hover:text-matte-azure transition-colors truncate">
                                            {tool.title}
                                        </h4>
                                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                                            {tool.desc}
                                        </p>
                                    </div>
                                    <i className="ri-external-link-line text-sm shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-matte-azure"></i>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToolsPage;
