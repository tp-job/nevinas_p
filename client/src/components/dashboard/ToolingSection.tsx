import type { FC } from "react";
import { StaggerItem } from "@/components/ui/StaggerList";
import { toolsData, toolSections } from "@/data/toolsData";
import { TH, cardCls } from "./constants";

/** Workflow Tooling — professional development utilities. */
const ToolingSection: FC = () => (
  <StaggerItem className={`p-8 lg:col-span-12 ${cardCls}`}>
    <div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)`,
      }}
    />
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          Workflow Tooling
        </h3>
        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
          Professional development utilities
        </p>
      </div>
      <a
        href="/about/tools"
        className="flex items-center gap-1.5 text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors"
      >
        Explore Tools <i className="ri-arrow-right-s-line"></i>
      </a>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      {toolsData.map((tool) => (
        <a
          key={tool.id}
          href={tool.link}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-1 text-center"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color} shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-500`}
          >
            <i className={`${tool.icon} text-2xl text-white`}></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors">
              {tool.name}
            </h4>
            <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary mt-1 uppercase tracking-tighter opacity-70">
              {tool.category}
            </p>
          </div>
        </a>
      ))}
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {toolSections.slice(0, 8).map((section) => {
        const toolCount = section.tools.length;
        return (
          <div
            key={section.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-light-surface-2/50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border/20"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-global-blue/10 shrink-0">
              <i className={`${section.icon} text-lg text-global-blue`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-light-text dark:text-dark-text truncate">
                {section.title}
              </p>
              <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">
                {toolCount} resources
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </StaggerItem>
);

export default ToolingSection;
