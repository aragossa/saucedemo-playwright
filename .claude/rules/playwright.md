---
paths:
  - "tests/**"
  - "playwright.config.ts"
---

# Playwright conventions

## Locators
- Prefer `page.getByTestId(...)`; the config maps it to the site's `data-test` attribute.
- Second choice: `getByRole` with an accessible name. CSS classes and XPath are last resort.
- Product cards: filter `inventory-item` by `inventory-item-name` text. Never rely on index/order.

## Assertions and waiting
- Web-first assertions only: `await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`, `toHaveCount`.
- No `page.waitForTimeout`, no `isVisible()` polled in loops, no `try/catch` around asserts.
- Assert the exact text the task gives (e.g. the lockout error), not a substring, unless the task says otherwise.
- Prefer one meaningful assertion per step over many weak ones. Every test must be able to fail.

## Structure
- Page objects hold locators and actions. No `expect` inside page objects.
- Tests hold the scenario and the assertions. One scenario per test, title reads like the task item.
- Every test starts from the login page and shares no state with other tests.
- Credentials and product names come from `tests/fixtures/testData.ts`, never inline strings.
- Use the blocked user (`locked_out_user`) only in the lockout test.

## Patterns (use all of them)
- **Custom fixtures** in `tests/fixtures/test.ts`: `test.extend` exposes `loginPage`,
  `inventoryPage`, `cartPage` as fixtures. Specs import `test`/`expect` from there and take page
  objects as arguments. Never `new LoginPage(page)` inside a spec.
- **`loggedInPage` fixture**: opens the login page and signs in as `standard_user`. Tests that
  need an authenticated start depend on it instead of repeating the login in `beforeEach`.
  The login test itself and the lockout test use `loginPage` and start unauthenticated.
- **`test.step`** for every user-visible action: `Login`, `Add Sauce Labs Backpack to cart`,
  `Open cart`. Steps show up in the HTML report and the trace.
- **Component object** `tests/pages/components/ProductCard.ts`: wraps one `inventory-item`
  (name, price, Add/Remove button). `InventoryPage.product(name)` and `CartPage.item(name)`
  return a `ProductCard`; the `inventory-item-name` filter lives there only.

## Test honesty
A test is honest when it can fail for the reason the scenario describes, and only for that reason.

Automated (item 1): `npm run lint` runs `eslint-plugin-playwright`. It fails on a test without
`expect`, on `if` around actions or assertions, on `skip`/`fixme`/`only`, on `waitForTimeout`,
on `force: true`, on a missing `await` before `expect`, and on `expect` inside `tests/pages/`.
Lint must be clean before a test counts as written.

Review checklist (item 3), applied to every test before it is called done:
- The final assertion is on the outcome the task names (cart contents, error text, visible product),
  not only on an intermediate signal (badge count, URL).
- Where the task gives text, assert it exactly with `toHaveText`. A regex or substring needs a
  comment saying why.
- No `expect` in page objects, no `try/catch` around assertions, no `expect.soft`.
- Every `test.step` ends with an assertion, not just an action.
- The test does not depend on the order of other tests or on data they leave behind.

Failure quality (item 4): when an expected value is wrong, the test must fail on an `expect`
within the expect timeout, with a clear expected/received message. A failure that is an action
timeout (`click` waiting 30 s for an element) is a smell: assert the element is visible before
acting on it. `actionTimeout` in the config is 10 s so a broken locator surfaces fast.

Negative check: break one expected value in `tests/fixtures/testData.ts`, run the test, confirm
it fails on the right assertion, restore. Mention the result in the summary.

## Config
- Keep `baseURL`, `testIdAttribute: 'data-test'`, `actionTimeout: 10_000`, `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`.
- Chromium only, `fullyParallel: true`. Do not add browsers or retries locally without asking.
