import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

const recommended = playwright.configs['flat/recommended'];

export default [
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'] },
  ...tseslint.configs.recommended,
  {
    // Every recommended Playwright rule is an error: a warning would not fail `npm run lint`.
    ...recommended,
    files: ['tests/**/*.ts'],
    rules: Object.fromEntries(Object.keys(recommended.rules).map((rule) => [rule, 'error'])),
  },
  {
    // Page objects hold locators and actions only.
    files: ['tests/pages/**/*.ts'],
    rules: { 'no-restricted-syntax': ['error', { selector: "CallExpression[callee.name='expect']", message: 'No expect in page objects.' }] },
  },
  {
    // The loggedInPage fixture asserts that the login succeeded before handing the page to a test.
    files: ['tests/fixtures/**/*.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
];
