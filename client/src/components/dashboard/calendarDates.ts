/**
 * Date helpers for the contribution calendar.
 *
 * Split out of ActivityCalendar.tsx so that file exports only its component,
 * and so these two can be tested directly — they are the part of the calendar
 * where a bug is silent. Both have an obvious implementation that is wrong:
 *
 *   - `toISOString().slice(0,10)` buckets by UTC, shifting late-night local
 *     events into the next day. On this project most commits are late-night,
 *     so that bug would move a large share of the squares and still look
 *     entirely plausible.
 *   - `getDay()` is Sunday-first; the rest of the dashboard is Monday-first.
 *
 * See calendarDates.test.ts, which pins both under a fixed timezone.
 */

/** Local YYYY-MM-DD. Deliberately not `toISOString()` — see above. */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Monday-first weekday index, matching the dashboard's day ordering. */
export const mondayIndex = (d: Date) => (d.getDay() === 0 ? 6 : d.getDay() - 1);
