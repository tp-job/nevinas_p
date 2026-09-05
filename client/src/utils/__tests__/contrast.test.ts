import { describe, it, expect } from 'vitest';
import { contrastRatio, wcagGrade, isOpaqueHex } from '../contrast';

/**
 * contrast.ts states, as data, what the design system's tokens actually
 * measure. Its most important behaviour is the one that is easy to "fix"
 * wrongly: it returns null for rgba() rather than a plausible number, because a
 * ratio against a translucent colour is meaningless without compositing.
 */
describe('contrastRatio', () => {
  it('gives the WCAG maximum of 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  it('gives 1 for a colour against itself', () => {
    expect(contrastRatio('#465078', '#465078')).toBeCloseTo(1, 10);
  });

  it('is symmetric — argument order does not change the ratio', () => {
    const a = contrastRatio('#C8CDEB', '#0A0F19');
    const b = contrastRatio('#0A0F19', '#C8CDEB');
    expect(a).not.toBeNull();
    expect(a).toBeCloseTo(b!, 12);
  });

  it('expands #RGB shorthand to the same value as #RRGGBB', () => {
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(
      contrastRatio('#ffffff', '#000000')!,
      12,
    );
  });

  it('is case-insensitive and tolerates surrounding whitespace', () => {
    expect(contrastRatio('  #C8CDEB  ', '#0a0f19')).toBeCloseTo(
      contrastRatio('#c8cdeb', '#0A0F19')!,
      12,
    );
  });

  /* The deliberate null — the behaviour the file's header exists to protect. */
  it.each([
    ['rgba() with alpha', 'rgba(200,205,235,0.5)'],
    ['rgb() without alpha', 'rgb(200,205,235)'],
    ['a named colour', 'periwinkle'],
    ['a hex with no hash', 'C8CDEB'],
    ['a 5-digit hex', '#12345'],
    ['a non-hex character', '#GGGGGG'],
    ['an empty string', ''],
  ])('returns null rather than a plausible number for %s', (_label, colour) => {
    expect(contrastRatio(colour, '#000000')).toBeNull();
    expect(contrastRatio('#000000', colour)).toBeNull();
  });

  it('reports the real Nocturnal Atelier body-text pairing', () => {
    // Periwinkle on Charcoal — the site's primary dark-mode text pairing.
    const ratio = contrastRatio('#C8CDEB', '#0A0F19');
    expect(ratio).not.toBeNull();
    expect(ratio!).toBeGreaterThan(7); // must clear AAA
  });
});

describe('wcagGrade', () => {
  it.each([
    [21, 'AAA'],
    [7, 'AAA'],
    [6.99, 'AA'],
    [4.5, 'AA'],
    [4.49, 'AA Large'],
    [3, 'AA Large'],
    [2.99, 'Fail'],
    [1, 'Fail'],
  ])('grades %s as %s', (ratio, grade) => {
    expect(wcagGrade(ratio as number)).toBe(grade);
  });

  it('puts each boundary on the passing side, not the failing one', () => {
    // A token measuring exactly 4.5 passes AA under WCAG 2.1. An implementation
    // using `>` instead of `>=` would fail it, and the page would understate
    // the palette.
    expect(wcagGrade(4.5)).toBe('AA');
    expect(wcagGrade(7)).toBe('AAA');
    expect(wcagGrade(3)).toBe('AA Large');
  });
});

describe('isOpaqueHex', () => {
  it('accepts both hex forms', () => {
    expect(isOpaqueHex('#fff')).toBe(true);
    expect(isOpaqueHex('#C8CDEB')).toBe(true);
  });

  it('rejects anything a ratio cannot be computed from', () => {
    expect(isOpaqueHex('rgba(0,0,0,0.5)')).toBe(false);
    expect(isOpaqueHex('transparent')).toBe(false);
    expect(isOpaqueHex('#12345')).toBe(false);
  });
});
