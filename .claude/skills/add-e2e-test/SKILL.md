---
name: add-e2e-test
description: Add or change a Playwright e2e test for saucedemo.com in this project's style (page objects, data-test locators, web-first assertions). Use when asked to write, add, extend or refactor a test or a page object.
---

# Add an e2e test

The invariants (locators, assertions, structure, patterns, honesty checklist) are in
`.claude/rules/playwright.md`. This skill is only the procedure.

## 1. Pin the scenario
Restate it as precondition → actions → one observable outcome, and name the task item in
the assignment PDF it covers. No item → say so; extra tests are out of scope.

## 2. Discover the page before writing
Open it in the built-in browser pane; `read_page` / `find` show the accessibility tree and the
`data-test` attributes. Do not guess attribute names. Fallback: `npx playwright codegen
https://www.saucedemo.com` for locator suggestions only; never paste the generated script.

## 3. Build bottom-up
Component object (if the block repeats) → page object → fixture in `tests/fixtures/test.ts` →
test data in `tests/fixtures/testData.ts` → the spec.

## 4. Verify, in this order, showing output
1. `npx tsc --noEmit -p tsconfig.json`, then `npm run lint`.
2. The new test alone: `npx playwright test <spec> -g "<title>"`.
3. Negative check: break one expected value in `testData.ts`, run again, confirm it fails on
   an `expect` with a clear expected/received, restore the value.
4. The whole suite: `npx playwright test`.

## 5. Report
The command, the pass/fail output verbatim, the negative-check result, anything not verified.
