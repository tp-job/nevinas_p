/** * Format a date string as relative time (e.g."Today","3d ago","2w ago","5mo ago"). * Returns"Recently" when dateString is missing or invalid. */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const days = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86400000,
  );
  if (days === 0) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
