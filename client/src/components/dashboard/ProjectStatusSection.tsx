import React, { type FC } from "react";
import { StaggerItem } from "@/components/ui/StaggerList";
import { TH, cardCls } from "./constants";
import type { GitHubStats } from "@/utils/api";

interface ProjectStatusSectionProps {
  status: GitHubStats["projectStatus"] | undefined;
}

/** Project Integrity Status — segmented donut + per-status cards. */
const ProjectStatusSection: FC<ProjectStatusSectionProps> = ({ status }) => {
  const projectStatus = [
    {
      label: "Active",
      count: status?.active || 0,
      color: TH.green,
      icon: "ri-checkbox-circle-fill",
    },
    {
      label: "Inactive",
      count: status?.inactive || 0,
      color: TH.azure,
      icon: "ri-time-line",
    },
    {
      label: "Archived",
      count: status?.archived || 0,
      color: TH.yellow,
      icon: "ri-archive-line",
    },
  ];
  const totalProjects = projectStatus.reduce((a, b) => a + b.count, 0);

  return (
    <StaggerItem className={`p-8 lg:col-span-12 ${cardCls}`}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${TH.royal}60, ${TH.flamingo}60, transparent)`,
        }}
      />
      <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-8">
        Project Integrity Status
      </h3>
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
            <div
              key={item.label}
              className="flex items-center gap-4 p-5 rounded-2xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border/30 hover:border-global-blue/30 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <i
                  className={`${item.icon} text-xl`}
                  style={{ color: item.color }}
                ></i>
              </div>
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
