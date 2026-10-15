---
name: add-e2e-test
description: Add or change a Playwright e2e test for saucedemo.com in this project's style (page objects, data-test locators, web-first assertions). Use when asked to write, add, extend or refactor a test or a page object.
---

# Add an e2e test

Follow `.claude/rules/playwright.md`. Work in this order and do not skip the checks.

## 1. Understand the scenario
- Restate the scenario as: precondition → actions → one observable outcome.
- Map it to a task item in `qa-automation-home-assignment.pdf` if one exists. If it does
  not, say so: extra tests are out of scope unless the user asked.

## 2. Discover the page
- Open the page in the built-in browser pane and use `read_page` / `find` to see the
  accessibility tree and `data-test` attributes. Do not guess attribute names.
- Fallback: `npx playwright codegen https://www.saucedemo.com` and copy the suggested
  `getByTestId` / `getByRole` locators. Never paste the generated script as-is.

## 3. Page object first
- Add missing locators and actions to the matching class in `tests/pages/`, or create a new
  class for a new page. Locators + actions only, no assertions.
- A block that appears on more than one page (product card) is a component object in
  `tests/pages/components/`; pages return it instead of duplicating its locators.
- Register a new page object as a fixture in `tests/fixtures/test.ts`.
- Reuse `tests/fixtures/users.ts` for credentials and product names; add new constants there.

## 4. Write the test
- Put it in the spec whose `describe` matches the feature (`login.spec.ts`, `cart.spec.ts`, ...).
- Import `test` and `expect` from `tests/fixtures/test`. Take page objects as fixture arguments.
  Start from `loginPage` for unauthenticated scenarios, from `loggedInPage` when the scenario
  begins after a successful `standard_user` login.
- Wrap each user-visible action in `test.step('...')`. Assert with web-first `expect`.
- Title reads like the task item: `standard_user adds Sauce Labs Backpack to the cart and sees it in the cart`.

## 5. Verify
Run in this order and show the output:
1. `npx tsc --noEmit -p tsconfig.json` and `npm run lint`.
2. `npx playwright test <spec> -g "<title>"` — the new test alone.
3. Negative check: temporarily break one expected value (product name, error text), run
   again, confirm it fails on an `expect` (not an action timeout) with a clear message, then
   restore it. Mention this in the summary.
4. Walk the "Test honesty" checklist in `.claude/rules/playwright.md`.
5. `npx playwright test` — the whole suite.

## 6. Report
State the command run, the pass/fail result verbatim, and anything you could not verify.
