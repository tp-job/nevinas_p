import { useState, useEffect, useCallback, useRef } from "react";
import {
  ApiError,
  escalateToErrorPage,
  type ApiRequestOptions,
  type ErrorSeverity,
} from "@/utils/api";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** The original error, when the failure came from the API layer. */
  apiError: ApiError | null;
}

export interface UseFetchOptions {
  /** Fixed message to show instead of whatever the server said. */
  errorMessage?: string;
  /**
   * How to surface a failure.
   *
   * `transient` (the default) keeps the failure local — the caller renders it
   * inline. `fatal` additionally escalates 500/503/504 to the full-page error
   * screen, and is only correct for a page's PRIMARY fetch: the one without
   * which the page has nothing to show.
   *
   * Defaulting to transient is the fix for the old behaviour, where the HTTP
   * layer escalated every 5xx globally and a single failing background request
   * blanked the whole app.
   */
  severity?: ErrorSeverity;
}

/**
 * Generic hook for fetching data with loading and error state.
 *
 * The fetcher is kept in a ref, so passing an inline arrow function is safe —
 * it will NOT retrigger the fetch on every render. Refetching happens only
 * when `deps` change (or via the returned `refetch`).
 *
 * The fetcher receives `ApiRequestOptions` carrying an AbortSignal tied to this
 * hook's lifecycle, so a fetch in flight is cancelled on unmount or when deps
 * change rather than merely having its result discarded.
 *
 * @param fetcher - Async function returning the data, e.g. `githubApi.getRepos`
 * @param deps - Dependency array; refetch when these change (default [])
 * @param options - Fixed error message, or the full options object
 */
export function useFetch<T>(
  fetcher: (options?: ApiRequestOptions) => Promise<T>,
  deps: unknown[] = [],
  options?: string | UseFetchOptions,
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Accepts a bare string for the original `errorMessage` call style.
  const resolved: UseFetchOptions =
    typeof options === "string" ? { errorMessage: options } : (options ?? {});
  const optionsRef = useRef(resolved);
  optionsRef.current = resolved;

  // Guards against state updates from a stale request (unmount or deps change
  // mid-flight): only the latest request id may commit results.
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    // Cancel whatever the previous call left in flight.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setApiError(null);
    try {
      const result = await fetcherRef.current({ signal: controller.signal });
      if (requestId !== requestIdRef.current) return;
      setData(result);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      // A cancellation we caused is not a failure worth reporting.
      if (controller.signal.aborted && !(err instanceof ApiError)) return;

      const { errorMessage, severity = "transient" } = optionsRef.current;
      if (err instanceof ApiError) {
        setApiError(err);
        if (severity === "fatal") escalateToErrorPage(err.status);
      }
      setError(
        errorMessage ??
          (err instanceof Error ? err.message : "Something went wrong"),
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => doFetch(), [doFetch]);

  useEffect(() => {
    doFetch();
    return () => {
      // Invalidate AND cancel the in-flight request on unmount / deps change.
      requestIdRef.current++;
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, apiError, refetch };
}
