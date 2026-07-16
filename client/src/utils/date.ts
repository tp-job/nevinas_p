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

/** * Verbose variant (e.g."3 days ago","2 weeks ago","1 month ago"). * Same semantics as formatRelativeTime, different display format. */
export function formatRelativeTimeLong(dateString?: string): string {
  if (!dateString) return "Recently";
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
}
