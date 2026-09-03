import { useMemo, useState, type FC } from "react";
import SectionHead from "@/components/common/SectionHead";
import type { GitHubEvent } from "@/utils/api";

/**
 * Activity Calendar — events per day, bucketed from real timestamps.
 *
 * WHY THE PROVENANCE MATTERS MORE THAN THE LOOK
 *
 * A heatmap was deleted from this page two commits ago because it fabricated
 * every cell: the API had no day-by-hour matrix, only two independent
 * marginals, and the component invented cells as `((dayVal + hourVal) / 2) * 4`
 * while rendering in a form that reads as per-cell measurement.
 *
 * This one buckets `/api/github/events` — 100 events, each with its own
 * timestamp — by calendar date. Every cell is a count of events that actually
 * happened on that day. Nothing is averaged, interpolated or derived from a
 * marginal. That is the whole reason this component is allowed to exist in the
 * shape the previous one was not.
 *
 * "PUSHES", NOT "COMMITS"
 *
 * The ask was for commits and PRs. Commits are not available: GitHub's PUBLIC
 * events feed omits per-push commit data — a PushEvent payload carries only
 * `before / head / push_id / ref / repository_id`, with no `commits`, `size` or
 * `distinct_size` (verified against the live API, which is also why
 * `stats.totalCommits` is 0 while 53 push events exist).
 *
 * What IS exact is the number of pushes. So the filter says Pushes and the
 * footnote says why. Labelling 53 pushes as "53 commits" would be the same
 * fabrication as the deleted heatmap, moved up one level.
 *
 * INTENSITY IS ONE HUE'S OPACITY RAMP
 *
 * Five steps of periwinkle, not five different colours. The quantity being
 * encoded is ordinal — more events, more presence — and a rainbow would imply
 * the categories differ in kind rather than degree.
 */

type Filter = "all" | "push" | "pr";

const FILTERS: { id: Filter; label: string; match: (t: string) => boolean }[] =
  [
    { id: "all", label: "All", match: () => true },
    { id: "push", label: "Pushes", match: (t) => t === "PushEvent" },
    { id: "pr", label: "PRs", match: (t) => t === "PullRequestEvent" },
  ];

/** Local YYYY-MM-DD. `toISOString()` would bucket by UTC and shift late-night
 *  events into the next day — which on this project is most of them. */
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** Monday-first index, matching the rest of the dashboard's day ordering. */
const mondayIndex = (d: Date) => (d.getDay() === 0 ? 6 : d.getDay() - 1);

const ActivityCalendar: FC<{ events: GitHubEvent[] }> = ({ events }) => {
  const [filter, setFilter] = useState<Filter>("all");

  const { weeks, counts, total, max, rangeLabel } = useMemo(() => {
    const active = FILTERS.find((f) => f.id === filter)!;
    const dated = events
      .map((e) => ({ type: e.type, at: new Date(e.event_at) }))
      .filter((e) => !Number.isNaN(e.at.getTime()));

    const counts = new Map<string, number>();
    let total = 0;
    for (const e of dated) {
      if (!active.match(e.type)) continue;
      const k = dayKey(e.at);
      counts.set(k, (counts.get(k) ?? 0) + 1);
      total++;
    }

    if (dated.length === 0) {
      return { weeks: [], counts, total: 0, max: 0, rangeLabel: "" };
    }

    // Span the full window the events cover, not just the days with activity —
    // a gap is information here (the quiet stretches are real), so empty days
    // must be drawn rather than skipped.
    const times = dated.map((e) => e.at.getTime());
    const first = new Date(Math.min(...times));
    const last = new Date(Math.max(...times));

    // Pad to whole weeks so every column is a real Mon-Sun week and rows line
    // up with their weekday label.
    const start = new Date(first);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - mondayIndex(start));
    const end = new Date(last);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + (6 - mondayIndex(end)));

    const weeks: Date[][] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const max = Math.max(...[...counts.values()], 1);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    return {
      weeks,
      counts,
      total,
      max,
      rangeLabel: `${fmt(first)} – ${fmt(last)}`,
    };
  }, [events, filter]);

  if (weeks.length === 0) return null;

  // Five ordinal steps. Level 0 is drawn as a faint outline rather than nothing,
  // so a quiet day still reads as a measured zero instead of a hole in the grid.
  const level = (n: number) => (n === 0 ? 0 : Math.ceil((n / max) * 4));
  const OPACITY = [0.07, 0.28, 0.5, 0.72, 1];

  return (
    <section className="mb-12">
      <SectionHead
        title="Activity Calendar"
        subtitle="Events per day, counted from the GitHub events feed"
        meta={
          <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
            {total} events · {rangeLabel}
          </span>
        }
      />

      {/* Filter. A real button group: each is focusable and states its pressed
          state, rather than a div that changes colour. */}
      <div
        className="mb-5 flex flex-wrap gap-1"
        role="group"
        aria-label="Filter activity by event type"
      >
        {FILTERS.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure ${
                on
                  ? "bg-matte-azure/10 text-matte-azure"
                  : "text-light-text-secondary hover:bg-light-surface/60 hover:text-light-text dark:text-dark-text-secondary dark:hover:bg-dark-surface/50 dark:hover:text-dark-text"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid left, explanation right. A 27-day window is only ~5 columns wide,
          so a full-width block would leave two thirds of the row empty; pairing
          the legend and the provenance note beside it uses the space without
          inflating the grid to pretend the range is longer than it is. */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2">
            {/* Weekday labels. Every other row, so the column does not out-weigh
              the grid it is labelling. */}
            <div className="flex shrink-0 flex-col gap-[4px] pt-[1px]">
              {WEEKDAYS.map((d, i) => (
                <span
                  key={d}
                  className="h-[18px] text-[10px] leading-[18px] text-light-text-tertiary dark:text-dark-text-muted"
                >
                  {i % 2 === 0 ? d : ""}
                </span>
              ))}
            </div>

            <div className="flex gap-[4px]">
              {weeks.map((week) => (
                <div
                  key={week[0].toISOString()}
                  className="flex flex-col gap-[4px]"
                >
                  {week.map((day) => {
                    const key = dayKey(day);
                    const n = counts.get(key) ?? 0;
                    const label = `${day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}: ${n} event${n === 1 ? "" : "s"}`;
                    return (
                      <span
                        key={key}
                        title={label}
                        aria-label={label}
                        className="h-[18px] w-[18px] rounded-[3px]"
                        style={{
                          backgroundColor: "var(--color-periwinkle)",
                          opacity: OPACITY[level(n)],
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:max-w-[34ch]">
          <span className="mb-3 flex items-center gap-1.5 text-[11px] text-light-text-tertiary dark:text-dark-text-muted">
            Less
            {OPACITY.map((o, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{
                  backgroundColor: "var(--color-periwinkle)",
                  opacity: o,
                }}
              />
            ))}
            More
          </span>
          <p className="text-xs leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
            Pushes, not commits: GitHub&apos;s public events feed omits the
            commit list inside each push, so a push is the smallest unit this
            data can count honestly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ActivityCalendar;
