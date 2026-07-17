import type { FC } from "react";

/* ==================== Color Swatch ==================== */
const ColorSwatch: FC<{ name: string; hex: string; variable: string }> = ({
  name,
  hex,
  variable,
}) => (
  <div
    className="group rounded-xl overflow-hidden border border-light-border dark:border-dark-border
               bg-light-surface-2 dark:bg-dark-surface
               transition-all duration-300 hover:-translate-y-1
               hover:shadow-[0_10px_28px_rgba(30,35,60,0.12)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
  >
    {/* Color band */}
    <div
      className="h-14 w-full ring-1 ring-inset ring-black/5"
      style={{ backgroundColor: hex }}
    />
    {/* Meta */}
    <div className="px-3 py-2">
      <p className="text-[11px] font-semibold text-light-text dark:text-dark-text truncate">
        {name}
      </p>
      <p className="text-[10px] font-mono text-light-text-secondary dark:text-dark-text-secondary truncate">
        {hex}
      </p>
      <code className="block text-[9px] font-mono mt-0.5 text-haze/70 dark:text-periwinkle/60 truncate">
        {variable}
      </code>
    </div>
  </div>
);

export default ColorSwatch;
