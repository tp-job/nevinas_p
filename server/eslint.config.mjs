// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * The server's lint config, deliberately a near-mirror of client/eslint.config.js
 * minus the React plugins.
 *
 * The server had no lint script at all until the CI gates went in — which is how
 * the client's count reached 74 errors unnoticed. Zero-tolerance from the start
 * here is cheap; it is only expensive to adopt after drift.
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'scripts'] },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // Same underscore convention as the client: a leading underscore marks a
      // binding that exists for its position, not its value — Express error
      // middleware must declare all four parameters to be recognised as such.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
);
