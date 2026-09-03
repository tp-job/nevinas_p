import type { FC } from "react";
import { StaggerItem } from "@/components/ui/StaggerList";
import { SKILL_ICONS, TH, cardCls } from "./constants";

interface SkillsMatrixSectionProps {
  /** [skill, count] pairs — keys must exist in SKILL_ICONS */
  skillData: [string, number][];
  repoTotal: number;
}

/** Skills Matrix — technology distribution bars from repo topics. */
const SkillsMatrixSection: FC<SkillsMatrixSectionProps> = ({
  skillData,
  repoTotal,
}) => (
  <StaggerItem className={`p-8 lg:col-span-4 ${cardCls}`}>
    <div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)`,
      }}
    />
    <div className="mb-6">
      <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
        Skills Matrix
      </h3>
      <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
        Technology distribution
      </p>
    </div>
    {skillData.length > 0 ? (
      <div className="space-y-4">
        {skillData.map(([skill, count]) => {
          const meta = SKILL_ICONS[skill];
          const pct = Math.round((count / repoTotal) * 100);
          return (
            <div key={skill} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${meta.color}15` }}
                  >
                    <i
                      className={`${meta.icon} text-sm`}
                      style={{ color: meta.color }}
                    ></i>
                  </div>
                  <span className="text-sm font-semibold text-light-text dark:text-dark-text capitalize">
                    {skill}
                  </span>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: meta.color }}
                >
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${meta.color}60, ${meta.color})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex items-center justify-center h-40 text-light-text-secondary dark:text-dark-text-secondary text-sm">
        No skills data available
      </div>
    )}
  </StaggerItem>
);

export default SkillsMatrixSection;
