import type { FC } from "react";
import type { architecture } from "@/data/docData";
import { TH } from "./constants";

interface ArchitectureGridProps {
  data: typeof architecture;
}

// Per-field icons so every tech row gets a distinct glyph (Remixicon).
const FIELD_ICONS: Record<string, string> = {
  framework: "ri-code-box-line",
  styling: "ri-palette-line",
  buildTool: "ri-hammer-line",
  routing: "ri-route-line",
  charts: "ri-bar-chart-box-line",
  icons: "ri-shapes-line",
  runtime: "ri-terminal-box-line",
  database: "ri-database-2-line",
  externalApi: "ri-global-line",
  auth: "ri-shield-keyhole-line",
  linter: "ri-check-double-line",
  compiler: "ri-file-code-line",
  hotReload: "ri-loop-left-line",
};

/** Three-column Frontend / Backend / Dev Tools stack breakdown. */
const ArchitectureGrid: FC<ArchitectureGridProps> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[
      {
        title: "Frontend",
        subtitle: "Client-side layer",
        icon: "ri-window-line",
        color: TH.primary,
        data: data.frontend,
      },
      {
        title: "Backend",
        subtitle: "Server & data layer",
        icon: "ri-server-line",
        color: TH.secondary,
        data: data.backend,
      },
      {
        title: "Dev Tools",
        subtitle: "Build & tooling",
        icon: "ri-tools-line",
        color: TH.tertiary,
        data: data.devTools,
      },
    ].map((section) => {
      const items = Object.entries(section.data);
      return (
        <div
          key={section.title}
          className="group relative flex flex-col rounded-2xl p-6 overflow-hidden
                     bg-light-surface-2 dark:bg-dark-surface
                     border border-light-border dark:border-dark-border
                     transition-all duration-300 hover:-translate-y-1
                     hover:shadow-[0_16px_40px_rgba(30,35,60,0.10)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: `linear-gradient(90deg, ${section.color}, ${section.color}00)`,
            }}
          />

          {/* Header — circular gradient icon badge + title */}
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                         shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${section.color}, ${section.color}99)`,
                boxShadow: `0 6px 18px ${section.color}40`,
              }}
            >
              <i className={`${section.icon} text-xl text-white`} />
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-light-text dark:text-dark-text leading-tight">
                {section.title}
              </h4>
              <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                {section.subtitle}
              </p>
            </div>
            <span
              className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full self-start"
              style={{ backgroundColor: `${section.color}18`, color: section.color }}
            >
              {items.length}
            </span>
          </div>

          {/* Tech items — icon tile + value + role label */}
          <div className="space-y-1.5">
            {items.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-2.5 rounded-xl
                           bg-light-surface/60 dark:bg-dark-bg/40
                           border border-transparent
                           hover:border-light-border dark:hover:border-dark-border
                           transition-colors duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <i
                    className={`${FIELD_ICONS[key] ?? "ri-checkbox-blank-circle-line"} text-sm`}
                    style={{ color: section.color }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-light-text dark:text-dark-text truncate">
                    {value}
                  </p>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default ArchitectureGrid;
