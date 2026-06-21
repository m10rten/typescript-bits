---
name: error-handling-patterns
description: Type-safe error handling in TypeScript — Result type, error-as-value philosophy, typed hierarchies, Error.cause chaining, exhaustive matching, and Result combinators
---

# Error Handling Patterns

Errors are values. Model them explicitly so callers are forced to handle them — no surprise exceptions, no lost context.

## Result Type

A `Result<T, E>` is either a success carrying `T` or a failure carrying `E`. The `ok` discriminant lets TypeScript narrow each branch.

```ts
type Ok<T> = { readonly ok: true; readonly value: T };
type Err<E> = { readonly ok: false; readonly error: E };

/** Represents either a successful value or a typed failure. */
export type Result<T, E> = Ok<T> | Err<E>;

/** Constructs a successful Result. */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

/** Constructs a failed Result. */
export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

/** Narrows a Result to Ok — use as a type guard in if/switch. */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

/** Narrows a Result to Err — use as a type guard in if/switch. */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}
```

Usage:

```ts
import { ok, err, isOk } from "./result.js";

function divide(a: number, b: number): Result<number, "division-by-zero"> {
  if (b === 0) return err("division-by-zero");
  return ok(a / b);
}

const result = divide(10, 0);
if (isOk(result)) {
  console.log(result.value);
} else {
  console.error(result.error); // "division-by-zero"
}
```

## Error-as-Value Philosophy

**Return errors when the caller is expected to handle them.** Throw when a programming invariant is violated and recovery is not expected.

| Situation                                    | Pattern                          | Why                           |
| -------------------------------------------- | -------------------------------- | ----------------------------- |
| Validation failure, not-found, parse error   | `Result<T, E>`                   | Caller must decide what to do |
| Invariant violation, impossible state        | `throw`                          | Signals a bug — crash loudly  |
| Third-party API that throws                  | Wrap in `Result` at the boundary | Contain the blast radius      |
| Programmer error (e.g., wrong argument type) | `throw new TypeError(...)`       | Crash early, catch in tests   |

Keep `throw` at the edges of your system (I/O, external boundaries) and convert to `Result` immediately. Core domain logic should never throw.

```ts
// At the I/O boundary — convert once, use Result everywhere inside
import { ok, err } from "./result.js";
import type { Result } from "./result.js";

async function readConfig(path: string): Promise<Result<Config, "not-found" | "parse-error">> {
  let raw: string;
  try {
    raw = await fs.readFile(path, "utf8");
  } catch {
    return err("not-found");
  }
  try {
    return ok(JSON.parse(raw) as Config);
  } catch {
    return err("parse-error");
  }
}
```

## Typed Error Hierarchies

Use discriminated unions to express a closed set of error variants. Avoid loosely typed `Error` subclasses as the primary error surface.

```ts
type DatabaseError =
  | { readonly kind: "connection-failed"; readonly host: string }
  | { readonly kind: "query-timeout"; readonly queryId: string; readonly durationMs: number }
  | { readonly kind: "constraint-violation"; readonly constraint: string };
```

When you need an `Error` instance (e.g., for stack traces or interop with code expecting `Error`), attach the semantic payload as a property:

```ts
class AppError extends Error {
  constructor(
    message: string,
    public readonly kind: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
  }
}
```

Prefer the union approach for domain errors returned via `Result`. Reserve `Error` subclasses for thrown programmer errors.

## Error Wrapping and Chaining via Error.cause

`Error.cause` (ES2022) preserves the original error when wrapping. Always pass `{ cause: err }` when rethrowing or converting.

```ts
function parseUserInput(raw: string): Result<UserInput, Error> {
  try {
    return ok(JSON.parse(raw) as UserInput);
  } catch (cause) {
    return err(new Error("Failed to parse user input", { cause }));
  }
}
```

Chaining surfaces the full error path during debugging:

```ts
// Error: Failed to load user profile
//   caused by: Failed to parse user input
//   caused by: SyntaxError: Unexpected token } in JSON
```

Unwrapping the chain:

```ts
function getRootCause(err: unknown): unknown {
  if (err instanceof Error && err.cause !== undefined) {
    return getRootCause(err.cause);
  }
  return err;
}
```

## Exhaustive Matching on Error Variants

Switch on the discriminant and use a `never` check to guarantee all variants are handled. The `never` assertion will cause a compile error if a new variant is added without updating the switch.

```ts
function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unhandled variant: ${JSON.stringify(value)}`);
}
```

```ts
import type { DatabaseError } from "./db-errors.js";
import { assertNever } from "./assert-never.js";

function handleDbError(error: DatabaseError): string {
  switch (error.kind) {
    case "connection-failed":
      return `Cannot reach ${error.host}`;
    case "query-timeout":
      return `Query ${error.queryId} timed out after ${error.durationMs}ms`;
    case "constraint-violation":
      return `Constraint violated: ${error.constraint}`;
    default:
      return assertNever(error);
  }
}
```

If you add `{ kind: "deadlock" }` to `DatabaseError` without adding a case, TypeScript will error on the `assertNever(error)` line — the variant is not assignable to `never`.

## Result Combinators

Combinators let you transform and chain Results without nested `if (isOk(...))` blocks.

### map — transform the success value

```ts
/** Transforms the value inside Ok; passes Err through unchanged. */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}
```

### mapErr — transform the error value

```ts
/** Transforms the error inside Err; passes Ok through unchanged. */
export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return result.ok ? result : err(fn(result.error));
}
```

### flatMap — chain Results without nesting

```ts
/** Chains a Result-returning function; short-circuits on Err. */
export function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}
```

### match — collapse Result to a single value

```ts
/** Eliminates the Result by providing handlers for both branches. */
export function match<T, E, U>(result: Result<T, E>, onOk: (value: T) => U, onErr: (error: E) => U): U {
  return result.ok ? onOk(result.value) : onErr(result.error);
}
```

Combinator chain example:

```ts
import { map, flatMap, match } from "./result.js";
import type { Result } from "./result.js";

declare function parseUserInput(raw: string): Result<string, ParseError>;
declare function validateLength(s: string, max: number): Result<string, ValidationError>;

const raw = "  hello world  ";

const message = match(
  flatMap(
    map(parseUserInput(raw), (input) => input.trim().toUpperCase()),
    (upper) => validateLength(upper, 256),
  ),
  (value) => `Accepted: ${value}`,
  (error) => `Rejected: ${error.message}`,
);
```

### unwrapOr — extract with a fallback

```ts
/** Returns the Ok value or a default if Err. */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}
```

## Common Mistakes

| Mistake                                                         | Fix                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Using `Result<T, Error>` with untyped `Error` as the error type | Use a discriminated union or branded error so callers can match variants          |
| Throwing inside a function that returns `Result`                | Pick one strategy per function — mixed throw/return makes callers handle both     |
| Ignoring the error branch (`const { value } = result`)          | Always check `isOk` or use `match` before accessing `value`                       |
| Losing the original error when wrapping                         | Pass `{ cause: originalError }` to preserve the chain                             |
| Forgetting to add a case when extending an error union          | Add an `assertNever` default in every switch to get a compile error               |
| Using `as` to cast `unknown` errors to `Error`                  | Narrow with `instanceof Error` before accessing `.message`                        |
| Returning `Result<T, string>` with free-form string messages    | Use a typed union for errors so callers can distinguish variants programmatically |
| Nesting `if (isOk(a)) { if (isOk(b)) { ... } }`                 | Use `flatMap` to chain Results without nesting                                    |
