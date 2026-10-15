# Swag Labs — Playwright home assignment

End-to-end tests for the public demo shop [saucedemo.com](https://www.saucedemo.com/),
written with Playwright and TypeScript.

## Quick start

**Option 1 — Node.js 20+ on your machine**

```bash
git clone https://github.com/aragossa/saucedemo-playwright.git && cd saucedemo-playwright && npm run test:fresh
```

`test:fresh` = `npm ci && npx playwright install --with-deps chromium && npx playwright test`.
Once set up, rerun with just `npx playwright test`.

**Option 2 — Docker, nothing else needed** (clones the repo inside the container, touches nothing on the host)

```bash
docker run --rm mcr.microsoft.com/playwright:v1.64.1-noble sh -c "git clone -q https://github.com/aragossa/saucedemo-playwright.git /work && cd /work && npm ci && npx playwright test"
```

Expected result: `3 passed`.

## Tests

| # | Spec | Scenario |
|---|------|----------|
| 1 | `tests/login.spec.ts` | `standard_user` signs in; the Products page opens and **Sauce Labs Backpack** is visible |
| 2 | `tests/cart.spec.ts`  | `standard_user` adds **Sauce Labs Backpack** to the cart and opens the cart; the cart contains that item |
| 3 | `tests/login.spec.ts` | `locked_out_user` is rejected; the login page stays open with the error `Epic sadface: Sorry, this user has been locked out.` |

Each test starts on the login page and is independent, so any of them can run alone.

## More commands

Developed on Node 23. `--with-deps` in `test:fresh` installs the browser's system libraries on
Linux (needs `sudo` on a non-root machine) and does nothing on macOS or Windows; without it, Chromium
does not start on a bare Linux box (`libnspr4.so: cannot open shared object file`).

```bash
npx playwright test --headed             # watch the browser
npx playwright test tests/cart.spec.ts   # a single spec
npx playwright show-report               # HTML report of the last run (test.step names included)
npm run lint                             # eslint-plugin-playwright, all rules as errors
npm run typecheck
```

## Result

Command: `npx playwright test`

```
Running 3 tests using 3 workers
  ✓  2 [chromium] › tests/login.spec.ts:21:7 › Login › locked_out_user is rejected and stays on the login page (1.3s)
  ✓  3 [chromium] › tests/login.spec.ts:5:7 › Login › standard_user signs in and sees Sauce Labs Backpack on the products page (1.5s)
  ✓  1 [chromium] › tests/cart.spec.ts:5:7 › Cart › standard_user adds Sauce Labs Backpack to the cart and sees it in the cart (1.6s)
  3 passed (2.3s)
```

All 3 tests passed (Chromium, macOS, Playwright 1.64.1).

Also verified from a fresh `git clone` on clean machines:

| Environment | Steps | Result |
|-------------|-------|--------|
| Docker `node:20-bookworm` (Debian 12, Node 20.20) | quick start, option 1 | 3 passed |
| Docker `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 24, arm64 and amd64) | quick start, option 2 | 3 passed |

I also checked that the tests can fail: with a wrong product name tests 1 and 2 fail on the
visibility assertion, with a wrong lockout text test 3 fails on the exact-text assertion.

## Project layout

```
playwright.config.ts            baseURL, data-test as the test-id attribute, actionTimeout, trace/screenshot on failure
eslint.config.mjs               test-honesty lint rules (eslint-plugin-playwright)
tests/
  fixtures/testData.ts          credentials, product names, expected messages
  fixtures/test.ts              test.extend: page-object fixtures and loggedInPage
  pages/LoginPage.ts            page objects: locators + actions, no assertions
  pages/InventoryPage.ts
  pages/CartPage.ts
  pages/components/ProductCard.ts  one product card, shared by the Products page and the cart
  login.spec.ts                 tests 1 and 3
  cart.spec.ts                  test 2
```

Locators use the site's `data-test` attributes. Page objects are injected as fixtures, `loggedInPage`
gives test 2 an authenticated start, and each user action is a `test.step`. ESLint with
`eslint-plugin-playwright` rejects a test without `expect`, conditionals around assertions,
`skip`/`only`, `waitForTimeout` and `expect` inside page objects.

## Note on AI usage

I used Claude Code. I set the design rules first and had the assistant generate the code against
them; I reviewed every file, ran the suite, and checked that wrong expected values make the right
tests fail.
