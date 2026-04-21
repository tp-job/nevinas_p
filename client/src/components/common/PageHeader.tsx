import type { FC } from "react";
interface PageHeaderProps {
  /** Small label above title (e.g."Skill Showcase","Developer Analytics") */ label?: string;
  /** Main page title */ title: string;
  /** Subtitle or romanization (e.g."リポジトリ") */ subtitle?: string;
}
const PageHeader: FC<PageHeaderProps> = ({ label, title, subtitle }) => (
  <header className="w-full mb-8">
    {" "}
    {label && (
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-light-text-secondary dark:text-dark-text-secondary">
        {" "}
        {label}{" "}
      </p>
    )}{" "}
    <h1 className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl text-light-text dark:text-dark-text">
      {" "}
      {title}{" "}
    </h1>{" "}
    {subtitle && (
      <p className="text-lg font-zen text-light-text-secondary dark:text-dark-text-secondary sm:text-xl">
        {" "}
        {subtitle}{" "}
      </p>
    )}{" "}
  </header>
);
export default PageHeader;
