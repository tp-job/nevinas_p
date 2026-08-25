import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationType = "info" | "success" | "error" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  /** Identity for de-duplication. Defaults to `${type}:${message}`. */
  key: string;
  /** ms before auto-dismiss; 0 pins it until dismissed by hand. */
  duration: number;
}

export interface NotifyInput {
  message: string;
  type?: NotificationType;
  key?: string;
  duration?: number;
}

export interface NotificationContextValue {
  /** Currently on screen (capped at MAX_VISIBLE). */
  notifications: Notification[];
  /** Show one. Returns its id, or the existing id if de-duplicated. */
  notify: (input: NotifyInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

/**
 * More than this on screen at once is unreadable, and the overflow is almost
 * always the same failure repeating. Extras are dropped rather than queued:
 * a backlog of stale toasts draining one-by-one is worse than not showing them,
 * because by the time they appear they describe a moment that has passed.
 */
const MAX_VISIBLE = 3;

/** Errors linger; confirmations do not need to. */
const DEFAULT_DURATION: Record<NotificationType, number> = {
  info: 4500,
  success: 3500,
  warning: 6000,
  error: 7000,
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef(new Map<string, number>());
  const idSeq = useRef(0);

  /**
   * Synchronous mirror of `notifications`, and the source of truth for the
   * de-duplication and capacity checks.
   *
   * Reading the state variable for those checks is a race: two failures in the
   * same tick both close over the same pre-update array, both conclude the key
   * is absent, and both insert. That produced exactly two identical toasts in
   * testing. A ref is updated before the next caller can read it, so the second
   * one sees the first.
   */
  const listRef = useRef<Notification[]>([]);

  const commit = useCallback((next: Notification[]) => {
    listRef.current = next;
    setNotifications(next);
  }, []);

  const clearTimer = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t !== undefined) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      commit(listRef.current.filter((n) => n.id !== id));
    },
    [clearTimer, commit],
  );

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) return;
      clearTimer(id);
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), duration),
      );
    },
    [clearTimer, dismiss],
  );

  const notify = useCallback(
    ({ message, type = "info", key, duration }: NotifyInput): string => {
      const dedupeKey = key ?? `${type}:${message}`;
      const ms = duration ?? DEFAULT_DURATION[type];

      // De-duplication is the load-bearing part, not a nicety. GraphView fans
      // out one request per repository; without this, one upstream outage
      // produces ~21 identical toasts. A repeat instead refreshes the timer of
      // the notice already on screen, so it stays visible while the failures
      // keep arriving.
      const current = listRef.current;
      const existing = current.find((n) => n.key === dedupeKey);
      if (existing) {
        scheduleDismiss(existing.id, ms);
        return existing.id;
      }

      if (current.length >= MAX_VISIBLE) return "";

      const id = `n${++idSeq.current}`;
      commit([...current, { id, message, type, key: dedupeKey, duration: ms }]);
      scheduleDismiss(id, ms);
      return id;
    },
    [commit, scheduleDismiss],
  );

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
    commit([]);
  }, [commit]);

  // Capture the map itself — `timers.current` would be re-read at unmount,
  // which is the stale-ref trap this cleanup exists to avoid.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => window.clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ notifications, notify, dismiss, clear }),
    [notifications, notify, dismiss, clear],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (ctx === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return ctx;
}

/**
 * Non-throwing variant for code that may run outside the provider.
 *
 * `useFetch` uses this: it is a generic hook and must not become unusable in a
 * tree without notifications wired up (tests, isolated renders, the debug
 * routes). Returns null instead, and the caller simply does not notify.
 */
export function useOptionalNotifications(): NotificationContextValue | null {
  return useContext(NotificationContext) ?? null;
}
