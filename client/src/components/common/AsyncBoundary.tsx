import type { FC, ReactNode } from "react";
import Loading from "@/components/common/loading/Loading";
import ErrorDisplay from "@/components/common/server-error/Error";

export interface AsyncBoundaryProps {
  loading: boolean;
  error?: string | null;
  /** Render the empty state instead of children when the fetch returned nothing. */
  isEmpty?: boolean;
  /** Copy for the empty state, e.g. "No React projects found". */
  emptyMessage?: string;
  /** Full custom empty state; overrides `emptyMessage`. */
  emptyState?: ReactNode;
  children: ReactNode;
}

/**
 * One place for the loading / error / empty / content decision.
 *
 * Every data page repeated the same four-branch ladder by hand:
 *
 *   {loading && <Loading />}
 *   {error && <Error error={error} />}
 *   {!loading && !error && ( …content… )}
 *   {!loading && !error && items.length === 0 && ( …empty… )}
 *
 * which is four chances per page to get a guard subtly wrong — and several did
 * render content and an empty state at the same time on first paint, because
 * `items.length === 0` is true while data is still `null`.
 *
 * The states are mutually exclusive and ordered here once: loading wins, then
 * error, then empty, then content.
 */
const AsyncBoundary: FC<AsyncBoundaryProps> = ({
  loading,
  error,
  isEmpty = false,
  emptyMessage = "Nothing to show yet",
  emptyState,
  children,
}) => {
  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;
  if (isEmpty) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          {emptyMessage}
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

export default AsyncBoundary;
