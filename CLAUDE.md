# Swag Labs QA automation assignment

Home assignment (~2 hours): three Playwright + TypeScript e2e tests against the
public demo shop https://www.saucedemo.com/. The task statement is
`qa-automation-home-assignment.pdf` (kept locally, excluded from the delivery
archive) — read it before changing scope. Never edit it.

## Stack and commands

- Playwright Test, TypeScript, Chromium only. Node 23, npm.
- `npm install && npx playwright install chromium` — one-time setup.
- `npm run lint` — ESLint with eslint-plugin-playwright; enforces test honesty rules.
- `npx playwright test` — the full suite. This is the command we report.
- `npx playwright test <spec> -g "<title>"` — one test in isolation.
- `npx playwright show-report` — HTML report of the last run.
- `npm run pack` — delivery zip via `git archive` (tracked files only, no PDF).

## Layout

```
playwright.config.ts   baseURL, testIdAttribute = data-test, actionTimeout, trace/screenshot on failure
eslint.config.mjs      eslint-plugin-playwright rules for test honesty
tests/fixtures/testData.ts credentials, product names, expected messages
tests/fixtures/test.ts    test.extend: page-object fixtures and loggedInPage
tests/pages/              page objects: one class per page, locators + actions only
tests/pages/components/   component objects shared by pages (ProductCard)
tests/*.spec.ts           tests; each starts on the login page and runs on its own
README.md              what we send: how to run, the command, the result, AI note
```

`.claude/rules/` holds the invariants (always loaded). `.claude/skills/` holds
procedures (loaded on demand) and must not repeat the rules.

## Definition of done

1. `npx tsc --noEmit -p tsconfig.json` and `npm run lint` are clean.
2. `npx playwright test` passes, and each spec passes when run alone.
3. A deliberately wrong expectation makes the relevant test fail on an `expect`, fast, with a
   clear message (see "Test honesty" in `.claude/rules/playwright.md`).
4. README has the exact command, the real output and the AI-usage note.

## Guardrails

Hooks in `.claude/settings.json` block destructive shell commands, edits
outside the project, edits of the PDF, and run a typecheck after `.ts` edits.
Do not weaken or bypass them; if a hook blocks something you need, say so
and let the user decide.

Never test the guardrails by putting dangerous commands or paths into a command
you run, even quoted, in comments, or as list items: the hook matches the text
and blocks the whole call. Put test cases in a file (`.claude/hook-selftest.sh`, local only, not committed)
and run that file. Add new cases there, never inline.
