# Swag Labs — Playwright home assignment

End-to-end tests for the public demo shop [saucedemo.com](https://www.saucedemo.com/),
written with Playwright and TypeScript.

## Tests

| # | Spec | Scenario |
|---|------|----------|
| 1 | `tests/login.spec.ts` | `standard_user` signs in; the Products page opens and **Sauce Labs Backpack** is visible |
| 2 | `tests/cart.spec.ts`  | `standard_user` adds **Sauce Labs Backpack** to the cart and opens the cart; the cart contains exactly that item |
| 3 | `tests/login.spec.ts` | `locked_out_user` is rejected; the login page stays open with the error `Epic sadface: Sorry, this user has been locked out.` |

Each test starts on the login page and is independent, so any of them can run alone.

## How to run

```bash
npm install
npx playwright install chromium
npx playwright test
```

Useful variations:

```bash
npx playwright test --headed             # watch the browser
npx playwright test tests/cart.spec.ts   # a single spec
npx playwright show-report               # HTML report of the last run (test.step names included)
npm run lint                             # eslint-plugin-playwright: no test without expect, no sleeps, no skips
npm run typecheck
```

## Result

Command: `npx playwright test`

```
Running 3 tests using 3 workers
  ✓  1 [chromium] › tests/login.spec.ts:24:7 › Login › locked_out_user is rejected and stays on the login page (1.2s)
  ✓  3 [chromium] › tests/login.spec.ts:5:7 › Login › standard_user signs in and sees Sauce Labs Backpack on the products page (1.2s)
  ✓  2 [chromium] › tests/cart.spec.ts:5:7 › Cart › standard_user adds Sauce Labs Backpack to the cart and sees it in the cart (1.3s)
  3 passed (2.1s)
```

All 3 tests passed (Chromium, macOS, Playwright 1.64.1).

I also checked that the tests can fail: with a wrong product name tests 1 and 2 fail on the
visibility assertion, with a wrong lockout text test 3 fails on the exact-text assertion.

## Project layout

```
playwright.config.ts            baseURL, data-test as the test-id attribute, actionTimeout, trace/screenshot on failure
eslint.config.mjs               test-honesty lint rules (eslint-plugin-playwright)
tests/
  fixtures/users.ts             credentials, product names, expected messages
  fixtures/test.ts              test.extend: page-object fixtures and loggedInPage
  pages/LoginPage.ts            page objects: locators + actions, no assertions
  pages/InventoryPage.ts
  pages/CartPage.ts
  pages/components/ProductCard.ts  one product card, shared by the Products page and the cart
  login.spec.ts                 tests 1 and 3
  cart.spec.ts                  test 2
```

Design notes:
- Locators use the site's `data-test` attributes via `getByTestId`.
- Page objects are injected as Playwright fixtures; `loggedInPage` gives test 2 an authenticated start.
- Each user-visible action is a `test.step`, so the HTML report and trace read like the scenario.
- Only web-first assertions (`expect(locator).toBeVisible()` etc.), no fixed waits.
- Test honesty is enforced by ESLint (`eslint.config.mjs`): every test asserts, no conditionals
  around assertions, no `skip`/`only`, no `waitForTimeout`, no `expect` in page objects.
  A wrong expected value makes a test fail on an `expect` within seconds, not on an action timeout.

## Note on AI usage

I used an AI assistant (Claude Code) to scaffold the project and draft the page objects and tests.
The specification the assistant worked from is in this repo: `.claude/rules/` (locators, assertions,
structure, patterns), `.claude/skills/` (how to add and debug a test) and `.claude/settings.json`
with hooks that block destructive commands and typecheck every `.ts` edit. The chat prompts
themselves were short; the rules did the work.
I reviewed the code, ran the suite locally and verified that wrong expectations make the tests fail.
