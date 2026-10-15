---
name: debug-failing-test
description: Diagnose a failing or flaky Playwright test in this project — read the report, trace and screenshot, classify the cause (test bug, site change, flakiness, environment), and fix it without weakening assertions. Use when a test fails, times out or passes only sometimes.
---

# Debug a failing test

What a fix may not do (no sleeps, no skips, no loosened assertions) is enforced by lint and the
honesty rules in `.claude/rules/playwright.md`. This skill is the diagnosis procedure.

## 1. Reproduce
`npx playwright test <spec> -g "<title>"` alone. `--repeat-each 3` for suspected flakiness,
`--headed` to watch, `--debug` for the inspector.

## 2. Collect evidence before touching code
- Console output: the failing assertion, expected vs received.
- `test-results/<test>/test-failed-1.png` — screenshot at failure.
- `npx playwright show-trace test-results/<test>/trace.zip` — actions, DOM snapshots, network.
- The live page in the built-in browser: compare the current DOM with the locator.

## 3. Classify
| Cause | Signs | Where the fix goes |
|-------|-------|--------------------|
| Test bug | wrong locator / text / URL | page object or test data |
| Site changed | DOM or copy differs from the test | update and say so in the report |
| Flaky | passes on repeat, timing-related | assert the state you depend on before acting |
| Environment | network, browser missing, site down | setup; if the site is down, screenshot it and report |

## 4. After the fix
The test alone, then the full suite, both outputs shown.

## 5. Report
Cause, the one piece of evidence that proves it, the change, the verbatim final result.
