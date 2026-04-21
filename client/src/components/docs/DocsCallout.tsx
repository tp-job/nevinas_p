import type { FC } from "react";
interface DocsCalloutProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}
const DocsCallout: FC<DocsCalloutProps> = ({
  title,
  children,
  icon = "ri-information-line",
}) => (
  <div className="flex gap-4 p-5 sm:p-6 rounded-lg border-l-4 border-matte-azure bg-light-surface-2/60 dark:bg-dark-surface/90 text-light-text dark:text-dark-text">
    {" "}
    <i
      className={`${icon} text-xl text-matte-azure shrink-0 mt-0.5`}
      aria-hidden
    ></i>{" "}
    <div className="min-w-0">
      {" "}
      <p className="font-bold text-light-text dark:text-dark-text mb-2">
        {title}
      </p>{" "}
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
        {children}
      </p>{" "}
    </div>{" "}
  </div>
);
export default DocsCallout;
