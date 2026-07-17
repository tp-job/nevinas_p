import type { FC } from "react";
import { Link } from "react-router-dom";

/* ==================== Breadcrumb ==================== */
const Breadcrumb: FC<{ items: { label: string; href?: string }[] }> = ({
  items,
}) => (
  <nav className="flex items-center gap-2 text-sm mb-8 text-light-text-secondary dark:text-dark-text-secondary">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="opacity-60">/</span>}
        {item.href ? (
          <Link to={item.href} className="text-matte-azure hover:underline">
            {item.label}
          </Link>
        ) : (
          <span className="text-light-text dark:text-dark-text">
            {item.label}
          </span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
