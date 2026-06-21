---
name: testing-guidelines
description: Node.js native test runner patterns — assertions, test structure, async tests, isolation, and mocking with node:test and node:assert/strict.
---

# Testing Guidelines

Write tests that verify behavior, catch regressions, and stay cheap to maintain. This skill covers the Node.js native test runner only (`node:test` + `node:assert/strict`).

## Test Runner Setup

Run tests with `tsx` so TypeScript files execute without a compile step:

```json
{
  "scripts": {
    "test": "tsx --test 'src/**/*.test.ts'"
  }
}
```

Pass a glob; `tsx --test` discovers files matching it. For a single file:

```bash
tsx --test src/math.test.ts
```

## Imports

```ts
import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { myFn } from "./math.js";
```

- Always import from `node:test` — never from a third-party test framework.
- Use `node:assert/strict` as the default import; it enables strict mode for all assertions.
- Use `.js` extensions on relative imports even when source files are `.ts`.

## Assertions

| Assertion                                  | Use for                                                     |
| ------------------------------------------ | ----------------------------------------------------------- |
| `assert.strictEqual(actual, expected)`     | Primitives, reference equality (`===`)                      |
| `assert.deepStrictEqual(actual, expected)` | Objects, arrays, Maps, Sets                                 |
| `assert.throws(fn, /pattern/)`             | Synchronous throws; optionally match message                |
| `assert.rejects(asyncFn, /pattern/)`       | Promise rejections                                          |
| `assert.match(str, /pattern/)`             | Regex match on strings                                      |
| `assert.ok(value)`                         | Truthiness — prefer a more specific assertion when possible |

Provide the expected value second; the error message will read naturally.

```ts
// ✅ clear failure message: "Expected '3' to equal '4'"
assert.strictEqual(add(1, 2), 3);

// ✅ deep equality for objects
assert.deepStrictEqual(parse("a=1&b=2"), { a: "1", b: "2" });

// ✅ throws with message check
assert.throws(() => divide(1, 0), /division by zero/i);

// ✅ async rejection
await assert.rejects(() => fetchUser(-1), /invalid id/i);
```

## Testcases Array Pattern

When the same behavior is exercised with multiple inputs, use a `testcases` array and iterate — never copy-paste test blocks.

```ts
const testcases = [
  { input: "hello world", expected: "Hello World" },
  { input: "already Cased", expected: "Already Cased" },
  { input: "", expected: "" },
];

for (const { input, expected } of testcases) {
  it(`titleCase("${input}") === "${expected}"`, () => {
    assert.strictEqual(titleCase(input), expected);
  });
}
```

Rules:

- Name each case after the input or the scenario, not a sequence number.
- Keep the table data-only — no logic inside the array.
- Put edge and boundary cases in the same array as the happy path; they belong together.

## What Makes a Useful Test

A test earns its place when it:

- **Verifies observable behavior** — what the function returns or how it changes state, not which internal methods it calls.
- **Covers a boundary** — empty input, zero, maximum value, type mismatch at the edge of a valid range.
- **Has one clear focus** — a single assertion (or a tight cluster) testing one thing; if it fails you know exactly why.
- **Acts as documentation** — the test name explains the rule: `"returns empty array when input has no matches"`.

## What NOT to Test

- Trivial property getters/setters with no logic.
- TypeScript type constraints — the compiler handles these; a test adds nothing.
- Third-party library behavior — test your integration boundary, not the library itself.
- Private implementation details — test the public interface; refactoring should not break tests.
- Framework wiring (routing, middleware order) — these are integration concerns, not unit concerns.

## Async Test Patterns

`node:test` supports `async` test functions natively. `await` inside the test body is all you need.

```ts
it("resolves with user data for a valid id", async () => {
  const user = await getUser(1);
  assert.deepStrictEqual(user, { id: 1, name: "Alice" });
});

it("rejects with NOT_FOUND for an unknown id", async () => {
  await assert.rejects(() => getUser(999), /not found/i);
});
```

Test both the success and the failure path of every async operation that can fail.

```ts
describe("fetchPrices", () => {
  it("returns prices array on success", async () => {
    const prices = await fetchPrices("EUR");
    assert.ok(Array.isArray(prices));
  });

  it("rejects when currency code is invalid", async () => {
    await assert.rejects(() => fetchPrices("XXX"), /unsupported currency/i);
  });
});
```

## Test Isolation

Shared mutable state between tests is a reliability hazard. Tests must not depend on execution order.

```ts
import { beforeEach } from "node:test";

let db: Database;

beforeEach(() => {
  // fresh instance before every test — no state leaks
  db = new Database(":memory:");
  db.seed(fixtures);
});
```

Rules:

- Never mutate a variable declared at module scope inside a test without resetting it in `beforeEach`.
- Use `afterEach` or `after` to close connections, clear timers, restore mocks.
- Prefer constructing test fixtures inline or in `beforeEach`; avoid sharing objects across test cases.

## Mocking Strategy

Mock I/O boundaries and non-deterministic dependencies. Do not mock pure functions.

**Mock these:**

- File system reads/writes
- Network calls (HTTP, database queries)
- `Date.now()` / `Math.random()` / clocks
- Process environment variables

**Do not mock these:**

- Pure functions your code calls internally
- Data transformations and business logic
- The unit under test itself

```ts
import { mock } from "node:test";
import type { Logger } from "../src/logger.js";

it("calls logger.warn when retry limit is exceeded", () => {
  const warn = mock.fn<Logger["warn"]>();
  const logger: Logger = { warn, info: mock.fn(), error: mock.fn() };

  runWithRetry({ attempts: 0, maxAttempts: 3, logger });

  assert.strictEqual(warn.mock.calls.length, 1);
  assert.match(warn.mock.calls[0]?.arguments[0] as string, /retry limit/i);
});
```

Restore mocks after each test to avoid state leakage:

```ts
afterEach(() => mock.restoreAll());
```

For time-dependent code, mock the clock rather than calling `Date.now()` directly:

```ts
it("expires a token after 60 seconds", () => {
  const clock = mock.timers;
  clock.enable({ apis: ["Date"] });

  const token = createToken();
  clock.tick(61_000);

  assert.strictEqual(isExpired(token), true);
  clock.reset();
});
```

## Lifecycle Hooks

| Hook         | Runs                                                   |
| ------------ | ------------------------------------------------------ |
| `before`     | Once before all tests in the current `describe`        |
| `after`      | Once after all tests in the current `describe`         |
| `beforeEach` | Before every individual `it` in the current `describe` |
| `afterEach`  | After every individual `it` in the current `describe`  |

Keep `before`/`after` for expensive one-time setup (starting a test server, opening a DB connection). Use `beforeEach`/`afterEach` for per-test state reset.

```ts
describe("UserRepository", () => {
  let repo: UserRepository;

  before(async () => {
    await db.migrate(); // run once
  });

  beforeEach(() => {
    repo = new UserRepository(db); // fresh instance per test
    db.truncate("users");
  });

  after(async () => {
    await db.close();
  });
});
```

## Common Mistakes

| Mistake                                                                             | Fix                                                                              |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Importing from `node:assert` instead of `node:assert/strict`                        | Use `import assert from "node:assert/strict"` — loose mode hides type mismatches |
| Duplicating test structure for each input variant                                   | Use a `testcases` array and loop                                                 |
| Asserting on implementation internals (which function was called, which branch ran) | Assert on the return value or observable side effect                             |
| Forgetting `await` on `assert.rejects`                                              | Without `await` the assertion always passes even if the function throws nothing  |
| Shared mutable fixtures at module scope without reset                               | Move setup into `beforeEach`                                                     |
| Mocking pure functions                                                              | Pure functions are fast and deterministic — test through them, not around them   |
| Not calling `mock.restoreAll()` after mocking                                       | Mocked methods persist across tests and cause false passes or failures           |
| Writing a test per function instead of per behavior                                 | One function may need multiple tests; one test may cover multiple functions      |
| Using `.js` extension on bare specifiers                                            | Only relative imports need extensions — `node:test` and npm packages do not      |
