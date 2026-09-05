/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite';
import viteConfig from './vite.config';

/**
 * Test config, kept SEPARATE from vite.config.ts on purpose.
 *
 * vite.config.ts carries a long comment explaining why `manualChunks` must not
 * come back. Folding a `test` block into it invites someone editing test setup
 * to touch build config in the same file. This one imports it instead, so the
 * alias and plugin setup stay in one place and cannot drift.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      // Dates are load-bearing in the calendar tests: dayKey buckets by LOCAL
      // time on purpose, and a UTC test runner would make a broken UTC
      // implementation look correct. Pin the zone so the suite proves the same
      // thing on a developer's machine and in CI.
      env: { TZ: 'Asia/Bangkok' },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/utils/**', 'src/hooks/**', 'src/components/dashboard/**'],
      },
    },
  }),
);
