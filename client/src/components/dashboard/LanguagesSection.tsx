import type { FC } from "react";
import Donut from "@/components/charts/Donut";
import { StaggerItem } from "@/components/ui/StaggerList";
import { cardCls } from "./constants";
import SectionHead from "@/components/common/SectionHead";

/**
 * The index signature here was a recharts v3 requirement — `<Pie data>` was
 * typed as ChartDataInput[] and rejected a plain interface. recharts is gone
 * from this route, so the type is now just the four fields callers actually
 * write.
 */
export interface LangDatum {
  name: string;
  count: number;
  pct: number;
  color: string;
}

interface LanguagesSectionProps {
  langData: LangDatum[];
  repoCount: number;
}

/** Languages — donut + per-language bars of project composition. */
const LanguagesSection: FC<LanguagesSectionProps> = ({
  langData,
  repoCount,
}) => (
  <StaggerItem className={`lg:col-span-8 ${cardCls}`}>
    {/* Language colours are kept: here the colour IS the identity of the thing
        being measured, which is the one case DS v3.2 allows a palette outside
        the main ramp. The gradient accent bar and the azure pill were chrome
        and are gone. */}
    <SectionHead
      title="Languages"
      subtitle="Project composition by language"
      meta={
        <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
          {langData.length} across {repoCount} repositories
        </span>
      }
    />

    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="shrink-0 relative">
        <Donut
          segments={langData.map((l) => ({
            name: l.name,
            value: l.count,
            color: l.color,
          }))}
          size={160}
          innerRadius={50}
          outerRadius={75}
          padAngle={3}
          ariaLabel={`Project composition by language: ${langData
            .map((l) => `${l.name} ${l.pct}%`)
            .join(", ")}.`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-medium text-light-text dark:text-dark-text">
            {repoCount}
          </span>
          <span className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
            Repos
          </span>
        </div>
      </div>

      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {langData.map((lang) => (
          <div key={lang.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-xs font-medium text-light-text dark:text-dark-text">
                  {lang.name}
                </span>
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: lang.color }}
              >
                {lang.pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${lang.pct}%`,
                  backgroundColor: lang.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </StaggerItem>
);

export default LanguagesSection;
