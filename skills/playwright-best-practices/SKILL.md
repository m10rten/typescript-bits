---
name: playwright-best-practices
description: Production-ready Playwright patterns — config, locators, assertions, page objects, network mocking, and CI setup for reliable E2E tests.
---

# Playwright Best Practices

Production-ready Playwright patterns for reliable, maintainable end-to-end tests. Apply these when writing or reviewing Playwright test suites.

## Configuration

### playwright.config.ts

A minimal, realistic config that enables retries, tracing, and multi-browser coverage:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // Trace on first retry — gives you a full timeline without the storage cost of always-on
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
```

Keep `retries: 0` locally so flakiness is visible immediately. Set `retries: 2` only in CI where network and timing variance is higher.

## Locators

### Priority Order

Prefer user-facing locators. They reflect what a real user sees and are resilient to implementation changes:

1. `getByRole` — semantic HTML, most resilient
2. `getByLabel` — form fields associated with a label
3. `getByPlaceholder` — inputs without a label
4. `getByText` — visible text content
5. `getByTestId` — last resort when no semantic anchor exists

```ts
// ✅ role — survives CSS and markup changes
await page.getByRole("button", { name: "Submit" }).click();

// ✅ label — ties the locator to the form field's accessible name
await page.getByLabel("Email address").fill("user@example.com");

// ✅ placeholder — useful for search inputs
await page.getByPlaceholder("Search…").fill("playwright");

// ✅ text — for non-interactive elements
await page.getByText("Your order was placed").isVisible();

// ✅ test id — only when no role/label/text is available
await page.getByTestId("confirm-dialog").isVisible();
```

### What NOT to Use

```ts
// ❌ CSS class — breaks on every UI refactor
page.locator(".btn-primary");

// ❌ XPath — brittle, unreadable, couples to DOM structure
page.locator("//div[@class='container']/button[1]");

// ❌ nth-child chains — fails when list order changes
page.locator("ul > li:nth-child(3) > a");
```

CSS selectors and XPath couple your tests to implementation details. When the DOM restructures your tests break, not the app.

### Scoped (Chained) Locators

Scope a locator to a region to avoid ambiguous matches:

```ts
// Find the "Edit" button inside a specific list item
const userRow = page.getByRole("row", { name: "Alice" });
await userRow.getByRole("button", { name: "Edit" }).click();
```

## Assertions

### Auto-Retrying Assertions

Use `expect` assertions — they poll until the condition is true or the timeout expires:

```ts
// Visibility
await expect(page.getByRole("alert")).toBeVisible();

// Text content
await expect(page.getByRole("heading")).toHaveText("Welcome back");

// URL after navigation
await expect(page).toHaveURL("/dashboard");

// Form field value
await expect(page.getByLabel("Username")).toHaveValue("alice");

// List length
await expect(page.getByRole("listitem")).toHaveCount(3);
```

### Non-Retrying: waitFor

Use `waitFor` only when you need to wait for a state change before performing an action, not for assertions:

```ts
// Wait for a network-driven element to appear before interacting
await page.getByRole("table").waitFor({ state: "visible" });
await page.getByRole("row").first().click();
```

Do not use `waitFor` as a substitute for `expect` assertions — `waitFor` resolves without verifying the final value.

### Soft Assertions

Use `expect.soft()` for non-fatal checks — the test continues and reports all failures at the end:

```ts
await expect.soft(page.getByTestId("price")).toHaveText("$9.99");
await expect.soft(page.getByTestId("currency")).toHaveText("USD");
// Both failures are reported even if the first one fails
```

Reserve soft assertions for validation sweeps (e.g., auditing every field on a detail page). Use hard assertions for flow-critical conditions.

## Actions & Interactions

### Common Actions

```ts
// Navigation
await page.goto("/login");
await page.reload();

// Form input
await page.getByLabel("Email").fill("user@example.com");
await page.getByLabel("Password").fill("secret");
await page.getByRole("combobox", { name: "Country" }).selectOption("NL");
await page.getByRole("checkbox", { name: "Remember me" }).check();

// Click
await page.getByRole("button", { name: "Sign in" }).click();

// Keyboard
await page.getByRole("searchbox").press("Enter");
await page.keyboard.press("Escape");
```

Actions auto-wait for the element to be actionable (visible, enabled, stable). Do not add `waitFor` or `waitForTimeout` before an action — it is redundant and slows tests down.

```ts
// ❌ unnecessary manual wait
await page.waitForTimeout(1000);
await page.getByRole("button", { name: "Submit" }).click();

// ✅ click waits automatically
await page.getByRole("button", { name: "Submit" }).click();
```

## Page Object Model

### Class-Based POM

Encapsulate page interactions in a class. The constructor takes `Page`; methods return `this` or a new POM for chaining:

```ts
import type { Page, Locator } from "@playwright/test";

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

Wire the POM into a custom fixture so every test receives a ready-to-use instance (see Fixtures).

## Fixtures

### Custom Fixtures with test.extend

Use `test.extend` to provide typed, composable fixtures:

```ts
import { test as base } from "@playwright/test";
import { LoginPage } from "./pages/login-page.js";

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
```

Import `test` from this file instead of `@playwright/test` in every spec:

```ts
import { test, expect } from "../fixtures.js";

test("logs in successfully", async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login("alice@example.com", "password");
  await expect(page).toHaveURL("/dashboard");
});
```

### Auth via storageState

Log in once in `globalSetup`, save the session, and reuse it across all tests — no per-test login overhead:

```ts
// e2e/global-setup.ts
import { chromium, type FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${config.projects[0]!.use.baseURL}/login`);
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");

  // Persist cookies and localStorage for reuse
  await page.context().storageState({ path: "e2e/.auth/user.json" });
  await browser.close();
}
```

Reference it in `playwright.config.ts`:

```ts
export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  use: {
    storageState: "e2e/.auth/user.json",
  },
});
```

Add `e2e/.auth/` to `.gitignore` — it contains session tokens.

## Network & API Mocking

### Intercepting Requests with page.route

Mock API responses to test UI behavior without a real backend:

```ts
await page.route("**/api/products", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ id: 1, name: "Widget", price: 9.99 }]),
  });
});

await page.goto("/products");
await expect(page.getByRole("listitem")).toHaveCount(1);
```

### Aborting Requests

Test error states by aborting a request entirely:

```ts
await page.route("**/api/products", (route) => route.abort());

await page.goto("/products");
await expect(page.getByRole("alert")).toHaveText("Failed to load products");
```

### Asserting Real Calls with waitForResponse

Verify the app makes the expected network call:

```ts
const [response] = await Promise.all([
  page.waitForResponse("**/api/cart"),
  page.getByRole("button", { name: "Add to cart" }).click(),
]);

expect(response.status()).toBe(200);
```

### Direct API Calls with APIRequestContext

Use the `request` fixture for API-level setup or assertions without a browser page:

```ts
test("creates a resource via API", async ({ request }) => {
  const response = await request.post("/api/items", {
    data: { name: "New item" },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe("New item");
});
```

## Parallelism & Isolation

### Fully Parallel Mode

```ts
// playwright.config.ts
export default defineConfig({
  fullyParallel: true, // each test file runs in its own worker
});
```

### Serial Sequences

When tests within a file must run in order (e.g., a multi-step checkout flow), opt into serial mode:

```ts
import { test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("step 1 — add to cart", async ({ page }) => {
  /* … */
});
test("step 2 — checkout", async ({ page }) => {
  /* … */
});
```

Keep serial suites small. Prefer independent tests with explicit setup over ordered dependencies.

### Worker-Scoped Fixtures

Use `scope: "worker"` for expensive setup shared across tests in the same worker (e.g., a seeded database):

```ts
export const test = base.extend<{}, { db: Database }>({
  db: [
    async ({}, use) => {
      const db = await Database.connect();
      await db.seed();
      await use(db);
      await db.close();
    },
    { scope: "worker" },
  ],
});
```

Never share mutable state across workers — each worker has its own process and memory space; sharing through files or an external store introduces race conditions.

## CI/CD

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test --reporter=html

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

### Sharding Across Matrix Jobs

Split the test suite across parallel CI jobs to cut wall-clock time:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3]
steps:
  - name: Run tests (shard ${{ matrix.shard }}/3)
    run: npx playwright test --shard=${{ matrix.shard }}/3
```

Each shard runs a disjoint subset of tests. Merge reports from all shards with `npx playwright merge-reports`.

## Common Mistakes

| Mistake                                                          | Fix                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Using `waitForTimeout(ms)` to let things settle                  | Use auto-retrying `expect` assertions — they wait for the right state, not a fixed time     |
| Hardcoded CSS class selectors (`'.btn-primary'`)                 | Use `getByRole`, `getByLabel`, or `getByText` — they survive styling changes                |
| `page.locator('button').click()` when multiple buttons exist     | Scope the locator or use `getByRole('button', { name: '…' })` to target the right one       |
| Logging in on every test                                         | Use `storageState` from `globalSetup` — login once, reuse the session                       |
| Missing `await` on assertions (`expect(el).toBeVisible()`)       | Without `await`, the assertion resolves immediately and always passes                       |
| Asserting network calls instead of UI state                      | Verify what the user sees, not which HTTP calls were made                                   |
| Running tests headed (`--headed`) in CI                          | Always run headless in CI; headed mode requires a display and is slower                     |
| Putting destructive state changes in `beforeAll` without cleanup | Use `afterAll` to restore state, or move setup into `beforeEach` to guarantee a clean slate |
