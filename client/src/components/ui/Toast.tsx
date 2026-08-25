import type { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Easing } from "framer-motion";
import {
  useNotifications,
  type Notification,
  type NotificationType,
} from "@/context/NotificationContext";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";
import { useTheme } from "@/context/ThemeContext";

/**
 * Toast — Nocturnal Atelier v3.2 §13.7, extended for dark mode.
 *
 * The DS spec fixes one light-mode palette per type. That is not enough here:
 * the site is dark by default, and #1E233C text on a pale tint is unreadable
 * against a charcoal page. Each type therefore carries BOTH modes, driven off
 * the `.dark` class the rest of the app already switches on, and the accents
 * stay inside the palette — status colours from §1.10 (semantic only, never
 * decorative) and the main palette for `info`.
 */

const EASE_SPRING: Easing = [0.22, 1, 0.36, 1];

interface ToastSkin {
  /** Remixicon class — the subset is regenerated via `npm run icons:subset`. */
  icon: string;
  light: { bg: string; border: string; text: string; accent: string };
  dark: { bg: string; border: string; text: string; accent: string };
}

const SKIN: Record<NotificationType, ToastSkin> = {
  info: {
    icon: "ri-information-line",
    // Main palette — info reuses cool gray, which §1.10 marks as on-palette.
    light: { bg: "rgba(200,205,235,0.78)", border: "#A8B0D9", text: "#1E233C", accent: "#465078" },
    dark: { bg: "rgba(46,53,88,0.82)", border: "rgba(200,205,235,0.28)", text: "#E8EAF5", accent: "#C8CDEB" },
  },
  success: {
    icon: "ri-check-line",
    light: { bg: "rgba(200,240,210,0.72)", border: "#a5d6a7", text: "#1b5e20", accent: "#2E7D32" },
    dark: { bg: "rgba(30,50,40,0.85)", border: "rgba(134,239,172,0.34)", text: "#D6F0DD", accent: "#86EFAC" },
  },
  warning: {
    icon: "ri-alert-line",
    light: { bg: "rgba(255,236,214,0.78)", border: "#ffcc80", text: "#7a3b00", accent: "#E65100" },
    dark: { bg: "rgba(58,44,26,0.85)", border: "rgba(251,191,36,0.34)", text: "#F6E3C4", accent: "#FBBF24" },
  },
  error: {
    icon: "ri-error-warning-line",
    light: { bg: "rgba(255,218,214,0.78)", border: "#ef9a9a", text: "#8e1414", accent: "#C62828" },
    dark: { bg: "rgba(58,30,32,0.85)", border: "rgba(252,165,165,0.34)", text: "#F7DADA", accent: "#FCA5A5" },
  },
};

const ToastItem: FC<{
  notification: Notification;
  isDark: boolean;
  reducedMotion: boolean;
  onDismiss: (id: string) => void;
}> = ({ notification, isDark, reducedMotion, onDismiss }) => {
  const skin = SKIN[notification.type];
  const c = isDark ? skin.dark : skin.light;

  return (
    <motion.div
      layout={!reducedMotion}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: EASE_SPRING }}
      className="pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3.5
                 w-[min(360px,calc(100vw-2rem))]
                 backdrop-blur-2xl backdrop-saturate-150
                 shadow-[0_8px_32px_rgba(30,35,60,0.18)]
                 dark:shadow-[0_14px_36px_rgba(0,0,0,0.36)]"
      style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text }}
    >
      {/* Icon-only element — 600 is the DS's single allowed exception. */}
      <i
        aria-hidden="true"
        className={`${skin.icon} shrink-0 text-lg leading-none mt-0.5 font-semibold`}
        style={{ color: c.accent }}
      />
      <p className="flex-1 text-sm font-normal leading-relaxed">
        {notification.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss notification"
        className="shrink-0 -mr-1 -mt-0.5 rounded-lg p-1 opacity-60
                   transition-opacity hover:opacity-100
                   focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: c.text, outlineColor: c.accent }}
      >
        <i aria-hidden="true" className="ri-close-line text-base leading-none" />
      </button>
    </motion.div>
  );
};

/**
 * ToastViewport — the single stack, mounted once near the root.
 *
 * `aria-live="polite"` rather than `assertive`: these announce results of work
 * the user did not necessarily initiate, and interrupting a screen reader
 * mid-sentence for a background fetch failure is the wrong trade. Genuinely
 * blocking failures escalate to the full-page error screen instead, which
 * takes focus on its own.
 */
const ToastViewport: FC = () => {
  const { notifications, dismiss } = useNotifications();
  const { reducedMotion } = useDeviceProfile();
  // From context, not the DOM class — a class read is not reactive and would
  // leave a toast in the previous theme after a live toggle.
  const { isDark } = useTheme();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-relevant="additions text"
      // Reflects live store state, which the DOM alone does not: AnimatePresence
      // keeps exiting nodes mounted, so counting children over-reports. Used by
      // the verification pass to assert de-duplication.
      data-toast-keys={notifications.map((n) => n.key).join("|")}
      data-toast-count={notifications.length}
      className="pointer-events-none fixed bottom-6 right-6 z-[300]
                 flex flex-col-reverse gap-3
                 max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:items-stretch"
    >
      <AnimatePresence initial={false}>
        {notifications.map((n) => (
          <ToastItem
            key={n.id}
            notification={n}
            isDark={isDark}
            reducedMotion={reducedMotion}
            onDismiss={dismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
