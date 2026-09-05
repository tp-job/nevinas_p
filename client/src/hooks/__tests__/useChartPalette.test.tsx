import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCssTokens } from '../useCssTokens';
import { useChartPalette } from '../useChartPalette';

/**
 * These two hooks removed four hand-kept copies of the chart palette, one of
 * which had silently drifted to the wrong colours. The behaviour worth pinning
 * is therefore not "it returns strings" but:
 *
 *   1. values come from the LIVE stylesheet, not a constant;
 *   2. a token that fails to resolve falls back visibly, not to a plausible
 *      per-role colour that would recreate the copy;
 *   3. a theme toggle re-reads, because some tokens are redefined under .dark.
 */
const setTokens = (vars: Record<string, string>) => {
  const style = document.createElement('style');
  style.id = 'test-tokens';
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join('');
  const darkBody = Object.entries(vars)
    .map(([k, v]) => `${k}: ${v === '#111111' ? '#222222' : v};`)
    .join('');
  style.textContent = `:root{${body}} :root.dark{${darkBody}}`;
  document.head.appendChild(style);
};

afterEach(() => {
  document.getElementById('test-tokens')?.remove();
  document.documentElement.className = '';
});

describe('useCssTokens', () => {
  it('reads a variable off the live stylesheet', async () => {
    setTokens({ '--color-periwinkle': '#C8CDEB' });
    const { result } = renderHook(() => useCssTokens(['--color-periwinkle']));
    await waitFor(() =>
      expect(result.current['--color-periwinkle']).toBe('#C8CDEB'),
    );
  });

  it('omits a variable that does not resolve rather than storing an empty string', async () => {
    const { result } = renderHook(() => useCssTokens(['--color-does-not-exist']));
    await waitFor(() => expect(result.current).toBeDefined());
    expect('--color-does-not-exist' in result.current).toBe(false);
  });

  it('re-reads when the theme class on <html> changes', async () => {
    setTokens({ '--color-accent': '#111111' });
    const { result } = renderHook(() => useCssTokens(['--color-accent']));
    await waitFor(() => expect(result.current['--color-accent']).toBe('#111111'));

    await act(async () => {
      document.documentElement.classList.add('dark');
    });

    // A hook that captured once at mount would still report #111111 here.
    await waitFor(() => expect(result.current['--color-accent']).toBe('#222222'));
  });
});

describe('useChartPalette', () => {
  beforeEach(() => {
    setTokens({
      '--color-periwinkle': '#C8CDEB',
      '--color-cool': '#878CB4',
      '--color-haze': '#465078',
      '--color-haze-deep': '#1E233C',
      '--color-sub-mount': '#85758F',
      '--color-success': '#34a853',
      '--color-warning': '#fbbc05',
    });
  });

  it('maps every role to its live token value', async () => {
    const { result } = renderHook(() => useChartPalette());
    await waitFor(() => expect(result.current.primary).toBe('#C8CDEB'));
    expect(result.current).toEqual({
      primary: '#C8CDEB',
      secondary: '#878CB4',
      tertiary: '#465078',
      muted: '#1E233C',
      accent: '#85758F',
      positive: '#34a853',
      warning: '#fbbc05',
    });
  });

  it('uses ONE neutral fallback for every unresolved role, not a per-role set', async () => {
    // No tokens defined at all. A per-role fallback table would quietly
    // recreate the hand-kept palette this hook exists to delete; the flat
    // result is what makes a miss obvious on the page.
    document.getElementById('test-tokens')?.remove();
    const { result } = renderHook(() => useChartPalette());
    await waitFor(() => expect(result.current.primary).toBeTruthy());
    const values = Object.values(result.current);
    expect(new Set(values).size).toBe(1);
  });

  it('names roles semantically, so a palette change cannot invert meaning', () => {
    const { result } = renderHook(() => useChartPalette());
    expect(Object.keys(result.current).sort()).toEqual(
      ['accent', 'muted', 'positive', 'primary', 'secondary', 'tertiary', 'warning'],
    );
  });
});
