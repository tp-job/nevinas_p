import type { FC } from "react";

/* ==================== Callout Box ==================== */
const Callout: FC<{
  title: string;
  children: React.ReactNode;
  icon?: string;
}> = ({ title, children, icon = "ri-information-line" }) => (
  <div className="flex gap-4 p-5 rounded-xl bg-light-surface-2/80 dark:bg-dark-surface/80 border-l-4 border-matte-azure">
    <i className={`${icon} text-xl text-matte-azure shrink-0 mt-0.5`}></i>
    <div>
      <p className="font-bold text-light-text dark:text-dark-text mb-2">
        {title}
      </p>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
        {children}
      </p>
    </div>
  </div>
);

export default Callout;
