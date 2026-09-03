import React, { type FC } from "react";
import { StaggerItem } from "@/components/ui/StaggerList";
import { cardCls } from "./constants";
import SectionHead from "./SectionHead";
import { useChartPalette } from "@/hooks/useChartPalette";
import type { GitHubStats } from "@/utils/api";

interface ProjectStatusSectionProps {
  status: GitHubStats["projectStatus"] | undefined;
}

/** Project Integrity Status — segmented donut + per-status cards. */
const ProjectStatusSection: FC<ProjectStatusSectionProps> = ({ status }) => {
  const c = useChartPalette();
  const projectStatus = [
    {
      label: "Active",
      count: status?.active || 0,
      color: c.positive,
      icon: "ri-checkbox-circle-fill",
    },
    {
      label: "Inactive",
      count: status?.inactive || 0,
      color: c.muted,
      icon: "ri-time-line",
    },
    {
      label: "Archived",
      count: status?.archived || 0,
      color: c.accent,
      icon: "ri-archive-line",
    },
  ];
  const totalProjects = projectStatus.reduce((a, b) => a + b.count, 0);

  return (
    <StaggerItem className={`lg:col-span-12 ${cardCls}`}>
      {/* "Project Integrity Status" claimed something this does not measure —
          nothing here inspects integrity, it counts repositories by recency of
          activity. Renamed to what it is. */}
      <SectionHead
        title="Repository Status"
        subtitle="Public repositories by recent activity"
        meta={
          <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
            {totalProjects} total
          </span>
        }
      />
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-44 h-44 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {
              projectStatus.reduce(
                (acc, item, i) => {
                  const pct =
                    totalProjects > 0 ? (item.count / totalProjects) * 100 : 0;
                  const circ = 2 * Math.PI * 48;
                  const dash = (pct / 100) * circ;
                  acc.elements.push(
                    <circle
                      key={i}
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-acc.offset}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />,
                  );
                  acc.offset += dash;
                  return acc;
                },
                { elements: [] as React.JSX.Element[], offset: 0 },
              ).elements
            }
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-medium text-light-text dark:text-dark-text">
              {totalProjects}
            </span>
            <span className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary uppercase font-medium tracking-widest">
              Total
            </span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {projectStatus.map((item) => (
            /* Flat row, not a card. This was a bordered, rounded, filled
               tile holding a second rounded tile behind its icon — inside a
               section card that is itself bordered and rounded. Three nested
               radii, all repeating the same treatment. */
            <div key={item.label} className="flex items-baseline gap-3">
              <i
                aria-hidden="true"
                className={`${item.icon} text-base`}
                style={{ color: item.color }}
              ></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-medium text-light-text dark:text-dark-text">
                    {item.count}
                  </span>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {totalProjects > 0
                      ? Math.round((item.count / totalProjects) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <p className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-tighter">
                  {item.label} Repos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaggerItem>
  );
};

export default ProjectStatusSection;
