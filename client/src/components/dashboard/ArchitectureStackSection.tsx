import type { FC } from "react";
import { StaggerItem } from "@/components/ui/StaggerList";
import { techStackData } from "@/data/techData";
import { TH, cardCls } from "./constants";

/** Architecture Stack — primary frameworks & libraries. */
const ArchitectureStackSection: FC = () => (
  <StaggerItem className={`p-8 lg:col-span-7 ${cardCls}`}>
    <div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${TH.royal}80, ${TH.azure}80, transparent)`,
      }}
    />
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-medium text-light-text dark:text-dark-text">
          Architecture Stack
        </h3>
        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
          Primary frameworks & libraries
        </p>
      </div>
      <a
        href="/about/tech-stack"
        className="text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors"
      >
        All Stack <i className="ri-arrow-right-s-line"></i>
      </a>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {techStackData.slice(0, 6).map((tech) => (
        <a
          key={tech.id}
          href={tech.link}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start gap-3.5 p-4 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-0.5"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tech.color} shadow-sm group-hover:shadow-md transition-all`}
          >
            <i className={`${tech.icon} text-lg text-white`}></i>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors truncate">
                {tech.name}
              </h4>
            </div>
            <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary line-clamp-1">
              {tech.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  </StaggerItem>
);

export default ArchitectureStackSection;
