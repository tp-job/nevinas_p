import type { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Easing } from "framer-motion";
import { useNotifications, type Notification } from "@/context/NotificationContext";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";
import { useTheme } from "@/context/ThemeContext";
import { STATUS_SKIN as SKIN } from "@/styles/statusSkin";

/**
 * Toast — Nocturnal Atelier v3.2 §13.7, extended for dark mode.
 *
 * The palette lives in styles/statusSkin.ts — shared with Callout, so the
 * verified light/dark pairs have exactly one source instead of two hand-copied
 * hex sets drifting apart. `NotificationType` and `StatusVariant` are the same
 * four strings on purpose; see that file for why it does not build on the
 * shared `--color-success` etc. tokens.
 */

const EASE_SPRING: Easing = [0.22, 1, 0.36, 1];

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
