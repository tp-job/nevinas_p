import { describe, it, expect } from 'vitest';
import { niceTicks, axisMax, barHeightPct } from '../scale';

/**
 * The axis maths behind the recharts replacement. A wrong axis is the silent
 * failure here — the chart still renders beautifully, just against the wrong
 * numbers — so these pin the properties rather than specific outputs where a
 * property is what actually matters.
 */
describe('niceTicks', () => {
  it('starts at zero and ascends', () => {
    const t = niceTicks(37);
    expect(t[0]).toBe(0);
    expect([...t]).toEqual([...t].sort((a, b) => a - b));
  });

  it('always reaches at or above the data maximum', () => {
    for (const max of [1, 3, 7, 10, 23, 99, 100, 101, 457, 1234]) {
      const t = niceTicks(max);
      expect(t[t.length - 1]).toBeGreaterThanOrEqual(max);
    }
  });

  it('produces only integers — these axes count events', () => {
    for (const max of [1, 2, 3, 5, 7, 9, 13, 47, 233]) {
      for (const v of niceTicks(max)) expect(Number.isInteger(v)).toBe(true);
    }
  });

  it('uses an evenly spaced step', () => {
    for (const max of [8, 23, 99, 457]) {
      const t = niceTicks(max);
      const steps = t.slice(1).map((v, i) => v - t[i]);
      expect(new Set(steps).size).toBe(1);
    }
  });

  it('picks a 1/2/5 x 10^n step', () => {
    for (const max of [4, 9, 19, 44, 90, 190, 440]) {
      const t = niceTicks(max);
      const step = t[1] - t[0];
      const mantissa = step / 10 ** Math.floor(Math.log10(step));
      expect([1, 2, 5, 10]).toContain(Math.round(mantissa));
    }
  });

  it('returns a usable axis for an empty or degenerate dataset', () => {
    // A chart with no events must still draw an axis rather than collapse.
    expect(niceTicks(0)).toEqual([0, 1]);
    expect(niceTicks(-5)).toEqual([0, 1]);
    expect(niceTicks(NaN)).toEqual([0, 1]);
    expect(niceTicks(Infinity)).toEqual([0, 1]);
  });

  it('keeps the tick count near the target rather than exploding', () => {
    for (const max of [3, 17, 63, 250, 1999]) {
      const t = niceTicks(max, 4);
      expect(t.length).toBeGreaterThanOrEqual(2);
      expect(t.length).toBeLessThanOrEqual(12);
    }
  });
});

describe('axisMax', () => {
  it('is the last tick', () => {
    expect(axisMax([0, 5, 10])).toBe(10);
  });

  it('falls back to 1 for an empty tick list rather than 0', () => {
    // Returning 0 would make every bar height a division by zero.
    expect(axisMax([])).toBe(1);
  });
});

describe('barHeightPct', () => {
  it('scales linearly against the axis top', () => {
    expect(barHeightPct(50, 100)).toBeCloseTo(50);
    expect(barHeightPct(100, 100)).toBeCloseTo(100);
  });

  it('floors a small non-zero value at a visible hairline', () => {
    // A value of 1 against a max of 1000 is 0.1% — invisible. It must still
    // read as a measured bar, matching WorkRhythm's choice.
    expect(barHeightPct(1, 1000)).toBe(1.5);
  });

  it('gives a true zero no height, so zero and near-zero stay distinguishable', () => {
    expect(barHeightPct(0, 100)).toBe(0);
  });

  it('never divides by a zero axis', () => {
    expect(barHeightPct(5, 0)).toBe(0);
    expect(Number.isFinite(barHeightPct(5, 0))).toBe(true);
  });
});
