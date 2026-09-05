import { describe, it, expect } from 'vitest';
import { dayKey, mondayIndex } from '../calendarDates';

/**
 * The calendar's two date helpers.
 *
 * These exist because the obvious implementations are both wrong:
 *   - `toISOString().slice(0,10)` buckets by UTC, which shifts late-night local
 *     events into the next day. On this project most commits are late-night, so
 *     the bug would move a large fraction of the squares.
 *   - `getDay()` is Sunday-first; the dashboard is Monday-first everywhere else.
 *
 * The suite runs under a pinned TZ (Asia/Bangkok, UTC+7 — see vitest.config.ts).
 * Without that pin a UTC runner would make a broken UTC implementation pass.
 */
describe('dayKey', () => {
  it('formats as zero-padded local YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 0, 5, 12, 0, 0))).toBe('2026-01-05');
    expect(dayKey(new Date(2026, 10, 20, 12, 0, 0))).toBe('2026-11-20');
  });

  it('buckets a late-night local event by its LOCAL day, not the UTC day', () => {
    // 2026-03-10 23:30 local (UTC+7) is 2026-03-10 16:30 UTC — same date here,
    // so use a time that genuinely straddles: 00:30 local is the PREVIOUS day
    // in UTC, and toISOString() would report 2026-03-09.
    const lateNight = new Date(2026, 2, 10, 0, 30, 0);
    expect(dayKey(lateNight)).toBe('2026-03-10');
    expect(lateNight.toISOString().slice(0, 10)).toBe('2026-03-09');
  });

  it('never returns the UTC date when the two disagree', () => {
    // Every hour of one local day must carry that day's key.
    const keys = new Set<string>();
    for (let h = 0; h < 24; h++) keys.add(dayKey(new Date(2026, 5, 15, h, 30)));
    expect([...keys]).toEqual(['2026-06-15']);
  });

  it('rolls over at local midnight, not at 00:00 UTC', () => {
    expect(dayKey(new Date(2026, 5, 15, 23, 59, 59))).toBe('2026-06-15');
    expect(dayKey(new Date(2026, 5, 16, 0, 0, 0))).toBe('2026-06-16');
  });

  it('handles a year boundary', () => {
    expect(dayKey(new Date(2025, 11, 31, 23, 0))).toBe('2025-12-31');
    expect(dayKey(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });

  it('handles a leap day', () => {
    expect(dayKey(new Date(2028, 1, 29, 12, 0))).toBe('2028-02-29');
  });
});

describe('mondayIndex', () => {
  it('is Monday-first: Monday is 0 and Sunday is 6', () => {
    // 2026-06-15 is a Monday.
    const monday = new Date(2026, 5, 15);
    expect(monday.getDay()).toBe(1); // sanity: the fixture really is a Monday
    expect(mondayIndex(monday)).toBe(0);

    const sunday = new Date(2026, 5, 21);
    expect(sunday.getDay()).toBe(0);
    expect(mondayIndex(sunday)).toBe(6);
  });

  it('assigns each weekday a distinct index across a whole week', () => {
    const week = Array.from({ length: 7 }, (_, i) => new Date(2026, 5, 15 + i));
    expect(week.map(mondayIndex)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('subtracting mondayIndex always lands on a Monday', () => {
    // This is the property the calendar's week-padding relies on.
    for (let i = 0; i < 28; i++) {
      const d = new Date(2026, 5, 1 + i);
      const start = new Date(d);
      start.setDate(start.getDate() - mondayIndex(d));
      expect(start.getDay()).toBe(1);
    }
  });
});
