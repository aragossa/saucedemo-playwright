---
name: debug-failing-test
description: Diagnose a failing or flaky Playwright test in this project — read the report, trace and screenshot, classify the cause (test bug, site change, flakiness, environment), and fix it without weakening assertions. Use when a test fails, times out or passes only sometimes.
---

# Debug a failing test

## 1. Reproduce
- `npx playwright test <spec> -g "<title>"` — alone, to rule out interference.
- `--repeat-each 3` if flakiness is suspected. `--headed` to watch; `--debug` for the inspector.

## 2. Collect evidence before changing code
- Read the assertion message in the console output: expected vs received.
- `test-results/<test>/test-failed-1.png` — the screenshot at failure.
- `npx playwright show-trace test-results/<test>/trace.zip` — actions, DOM snapshots, network.
- Open the real page in the built-in browser and compare the current DOM with the locator.

## 3. Classify the cause
| Cause | Signs | Fix |
|-------|-------|-----|
| Test bug | wrong locator / text / URL | fix the test or page object |
| Site changed | DOM or copy differs from the test | update locator/text, note it in the report |
| Flaky | passes on repeat, timing-related | add a web-first assertion on the state you depend on |
| Environment | network, browser not installed, site down | fix setup; if the site is down, take a screenshot and report it |

## 4. Fix rules
- Never add `waitForTimeout`, retries, `test.fixme`/`skip`, or loosen an exact-text assertion
  to make a test green. If the expected text truly changed, update it and say so.
- Keep the fix in the page object when it is a locator issue.
- After the fix: run the test alone, then the full suite, and show both outputs.

## 5. Report
Cause, evidence (one line), the change, and the verbatim result of the final run.
