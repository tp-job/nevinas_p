import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Guard for the async-state components.
 *
 * `components/common/server-error/Error.tsx` exports `ErrorDisplay`, but every
 * page used to import it as `import Error from …` — which shadows the native
 * `Error` constructor for that whole module. The file's own header says it was
 * renamed to prevent exactly that; the rename never reached the call sites, and
 * eight modules shipped with a shadowed global.
 *
 * `no-restricted-imports` cannot see what a default import is bound to, so
 * banning the *name* is not possible. Banning the *path* is stronger anyway:
 * `AsyncBoundary` is now the single legitimate consumer of both the spinner and
 * the error panel, and routing everything through it is what keeps the
 * loading → error → empty → content decision in one ordered place. The glob
 * catches relative forms (`./Error`, `../server-error/Error`) as well as the
 * `@/` alias.
 */
const RESTRICTED_ASYNC_STATE_IMPORTS = [
  {
    group: ['**/server-error/Error', '@/components/common/server-error/Error'],
    message:
      'Use AsyncBoundary (components/common/AsyncBoundary) instead of importing the ' +
      'error panel directly. Importing it as `Error` shadows the native Error ' +
      'constructor — the bug this rule exists to prevent. If you genuinely need the ' +
      'bare panel, import it as `ErrorDisplay` and disable this rule with a reason.',
  },
]

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: RESTRICTED_ASYNC_STATE_IMPORTS },
      ],
    },
  },
  {
    // AsyncBoundary is the one place allowed to compose these directly — it is
    // the abstraction the rule above points everyone at.
    files: ['**/components/common/AsyncBoundary.tsx'],
    rules: { 'no-restricted-imports': 'off' },
  },
])
