import { Link } from "react-router-dom";
import type { FC } from "react";
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface DocsBreadcrumbProps {
  items: BreadcrumbItem[];
}
const DocsBreadcrumb: FC<DocsBreadcrumbProps> = ({ items }) => (
  <nav
    className="flex items-center gap-2 text-sm mb-10 text-light-text-secondary dark:text-dark-text-secondary"
    aria-label="Breadcrumb"
  >
    {" "}
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {" "}
        {i > 0 && <span className="opacity-50">/</span>}{" "}
        {item.href ? (
          <Link
            to={item.href}
            className="hover:text-matte-azure hover:underline transition-colors"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-light-text/80 dark:text-dark-text/80 font-medium">
            {item.label}
          </span>
        )}{" "}
      </span>
    ))}{" "}
  </nav>
);
export default DocsBreadcrumb;
