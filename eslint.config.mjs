import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'] },
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
  },
  {
    // Test honesty: a test must assert, must not branch, must not be skipped, must not sleep.
    files: ['tests/**/*.spec.ts'],
    rules: {
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/valid-expect': 'error',
    },
  },
  {
    // Page objects: locators and actions only. No assertions.
    files: ['tests/pages/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { paths: [{ name: '@playwright/test', importNames: ['expect'], message: 'No expect in page objects.' }] }],
      'no-restricted-syntax': ['error', { selector: "CallExpression[callee.name='expect']", message: 'No expect in page objects.' }],
    },
  },
  {
    // Fixtures may assert outside a test body (e.g. loggedInPage checks the login succeeded).
    files: ['tests/fixtures/**/*.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
];
