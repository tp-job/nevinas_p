import type { FC } from "react";
interface KpiBadgeProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}
const KpiBadge: FC<KpiBadgeProps> = ({ icon, value, label, color }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border">
    {" "}
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15` }}
    >
      {" "}
      <i className={`${icon} text-sm`} style={{ color }}></i>{" "}
    </div>{" "}
    <div>
      {" "}
      <p className="text-lg font-extrabold leading-none text-light-text dark:text-dark-text">
        {value}
      </p>{" "}
      <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </p>{" "}
    </div>{" "}
  </div>
);
export default KpiBadge;
