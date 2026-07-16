import { useState, useEffect, useCallback, useRef } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data with loading and error state.
 *
 * The fetcher is kept in a ref, so passing an inline arrow function is safe —
 * it will NOT retrigger the fetch on every render. Refetching happens only
 * when `deps` change (or via the returned `refetch`).
 *
 * @param fetcher - Async function that returns the data (e.g. () => githubApi.getRepos())
 * @param deps - Dependency array; refetch when these change (default [])
 * @param errorMessage - Optional fixed message to show instead of the raw error
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  errorMessage?: string,
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const errorMessageRef = useRef(errorMessage);
  errorMessageRef.current = errorMessage;

  // Guards against state updates from a stale request (unmount or deps change
  // mid-flight): only the latest request id may commit results.
  const requestIdRef = useRef(0);

  const doFetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (requestId !== requestIdRef.current) return;
      setData(result);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(
        errorMessageRef.current ??
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
      // Invalidate in-flight request on unmount / deps change.
      requestIdRef.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}
