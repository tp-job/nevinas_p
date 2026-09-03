import type { FC } from "react";
import { PieChart, Pie, Cell, Tooltip as RTooltip } from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { StaggerItem } from "@/components/ui/StaggerList";
import { TH, cardCls } from "./constants";

/**
 * Recharts v3 types `<Pie data>` as `ChartDataInput[]`, which requires a string
 * index signature — a plain interface is rejected with "Index signature for
 * type 'string' is missing". The extra member is a type-level requirement only;
 * the four named fields are still the contract callers write against.
 */
export interface LangDatum {
  name: string;
  count: number;
  pct: number;
  color: string;
  [key: string]: string | number;
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
  <StaggerItem className={`p-8 lg:col-span-8 ${cardCls}`}>
    <div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
      }}
    />
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
          Languages
        </h3>
        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
          Project composition by language
        </p>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">
        {langData.length} active
      </span>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="shrink-0 relative">
        <PieChart width={160} height={160}>
          <Pie
            data={langData}
            dataKey="count"
            nameKey="name"
            cx={80}
            cy={80}
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            strokeWidth={0}
          >
            {langData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <RTooltip content={<ChartTooltip />} />
        </PieChart>
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
