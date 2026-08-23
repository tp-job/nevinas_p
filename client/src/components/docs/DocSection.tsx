import type { FC } from "react";

/* ==================== Doc Section (Introduction style) ==================== */
const DocSection: FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="mb-16">
    <h2 className="text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-6">
        {subtitle}
      </p>
    )}
    <div className="space-y-6 text-light-text dark:text-dark-text leading-relaxed">
      {children}
    </div>
  </section>
);

export default DocSection;
