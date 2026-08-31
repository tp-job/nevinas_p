import type { FC } from "react";
import { changelog } from "@/data/docData";
import DocSection from "./DocSection";
import { TH, cardCls } from "./constants";

/** Changelog — version history timeline. */
const ChangelogSection: FC = () => (
  <DocSection title="Changelog" subtitle="Version history" wide>
    <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${TH.primary}60, transparent)`,
        }}
      />
      <div className="space-y-6">
        {changelog.map((entry, i) => (
          <div key={entry.version} className="relative pl-8">
            {/* Timeline */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-light-border dark:bg-dark-border" />
            <div
              className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full border-2 border-light-surface dark:border-dark-bg"
              style={{
                backgroundColor:
                  i === 0 ? TH.primary : i === 1 ? TH.secondary : TH.tertiary,
              }}
            />

            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                v{entry.version}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                {entry.date}
              </span>
              {i === 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-matte-azure/10 text-matte-azure">
                  Latest
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {entry.changes.map((change, ci) => (
                <li
                  key={ci}
                  className="flex items-start gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary"
                >
                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-light-text-secondary dark:bg-dark-text-secondary" />
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </DocSection>
);

export default ChangelogSection;
