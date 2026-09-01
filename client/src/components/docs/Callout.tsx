import type { FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { STATUS_SKIN, type StatusVariant } from "@/styles/statusSkin";

/**
 * Callout box, with a status variant.
 *
 * Previously fixed to a single "info" look — a left accent bar plus an icon,
 * both hardcoded to `matte-azure`. That is still the `info` variant's colour
 * (matte-azure IS the theme-reactive accent channel as of Phase A of the other
 * plan), but a docs page also needs to flag "this endpoint is deprecated" or
 * "this step is destructive" without reusing the same neutral blue for
 * everything. `warn` and `success` cover that; `error` ships too since the
 * palette already has it and restricting the type would only mean adding it
 * back the first time someone needs it.
 *
 * Colours come from styles/statusSkin.ts, the same verified light/dark pairs
 * Toast uses — see that file for why it does not build on the shared
 * `--color-success` / `-warning` / `-error` tokens, which are currently wrong
 * in light mode and undefined outside `.dark`.
 */
const Callout: FC<{
  title: string;
  children: React.ReactNode;
  icon?: string;
  variant?: StatusVariant;
}> = ({ title, children, icon, variant = "info" }) => {
  const { isDark } = useTheme();
  const skin = STATUS_SKIN[variant];
  const c = isDark ? skin.dark : skin.light;

  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : undefined}
      className="flex gap-4 p-5 rounded-xl border-l-4"
      style={{ backgroundColor: c.bg, borderLeftColor: c.accent }}
    >
      <i
        aria-hidden="true"
        className={`${icon ?? skin.icon} text-xl shrink-0 mt-0.5`}
        style={{ color: c.accent }}
      />
      <div>
        <p className="font-semibold mb-2" style={{ color: c.text }}>
          {title}
        </p>
        {/* Full opacity, not dimmed — `c.text` is the exact colour already
            measured passing in Toast (body 6.47–12.06 against the 4.5 bar).
            An earlier version applied opacity: 0.85 here for visual softness
            and it eroded that margin to 4.54 on the success variant — caught
            by re-measuring, not assumed safe. */}
        <p className="text-sm leading-relaxed" style={{ color: c.text }}>
          {children}
        </p>
      </div>
    </div>
  );
};

export default Callout;
