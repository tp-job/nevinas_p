import { useState, useEffect, useCallback } from "react";
interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
} /** * Generic hook for fetching data with loading and error state. * @param fetcher - Async function that returns the data (e.g. () => galleryApi.getGallery()) * @param deps - Dependency array; refetch when these change (default []) */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);
  const refetch = useCallback(() => doFetch(), [doFetch]);
  useEffect(() => {
    doFetch();
  }, deps);
  return { data, loading, error, refetch };
}
