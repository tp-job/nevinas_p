import type { FC } from "react";

/** Static page header shown during loading / error states. */
const DashboardHeader: FC = () => (
  <div className="w-full mb-4">
    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
      Developer Analytics
    </h4>
    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
      Dashboard
    </h2>
    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
      概要
    </h3>
  </div>
);

export default DashboardHeader;
