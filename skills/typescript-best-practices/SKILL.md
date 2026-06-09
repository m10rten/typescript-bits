---
name: typescript-best-practices
description: Production-ready TypeScript best practices — tsconfig, type patterns, generics, error handling, and code organization for strict, maintainable codebases
---

# TypeScript Best Practices

Practical, production-ready TypeScript patterns for strict, maintainable codebases. Apply these when writing or reviewing TypeScript code.

## Configuration

### tsconfig.json — Strict Mode

Enable all strict checks — these catch real bugs at compile time:

```json
{
  "compilerOptions": {
    // Enables all strict type-checking (noImplictAny, strictNullChecks, etc.)
    "strict": true,
    // Forces handling `undefined` from bracket access on arrays/objects
    "noUncheckedIndexedAccess": true,
    // Prevents unused variables from compiling
    "noUnusedLocals": true,
    // Prevents unused function parameters from compiling
    "noUnusedParameters": true,
    // Optional properties can't be explicitly set to `undefined`
    "exactOptionalPropertyTypes": true,
    // Enforces `import type` / `export type` — keeps runtime bundles clean
    "verbatimModuleSyntax": true
  }
}
```

## Type System

### Prefer Types Over Enums

- Use `type` unions instead of `enum` — they're erasable at runtime, tree-shakeable, and compose naturally.
- Use `const` objects with `as const` when you need both runtime values and type-level unions.

```ts
// Prefer this:
type Status = "active" | "inactive" | "pending";

// Over this:
enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}
```

### Branded Types for Primitives

Use branded types to distinguish structurally identical primitives (e.g., two `string` IDs that must not be confused):

```ts
type UserId = string & { __brand: "UserId" };
type PostId = string & { __brand: "PostId" };
```

### Discriminated Unions for State

Model distinct states as discriminated unions with a literal `type` or `kind` discriminant. This gives you exhaustiveness checking and narrows each branch automatically:

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

Switch on the discriminant for narrowing & exhaustiveness:

```ts
type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number };
function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "square":
      return s.side ** 2;
  }
}
```

### Utility Types — When to Use

| Type           | Use case                                                     |
| -------------- | ------------------------------------------------------------ |
| `Pick<T, K>`   | Subset of known keys (stable API slice)                      |
| `Omit<T, K>`   | Exclude keys (e.g., strip internal fields)                   |
| `Partial<T>`   | Gradual construction / update payloads                       |
| `Required<T>`  | After validation — mark all fields as required               |
| `Readonly<T>`  | Config objects, constants passed to consumers                |
| `Record<K, V>` | Dynamic key-value maps (use with `noUncheckedIndexedAccess`) |

### Advanced: Conditional Types

Use `infer` to extract unwrapped types:

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

### Prefer `interface` for Public APIs, `type` for Computed Types

- Use `interface` for object shapes that consumers implement or extend (declaration merging, better error messages).
- Use `type` for unions, intersections, mapped/conditional types, tuples, and computed types.

### Mapped Types for Object Transformations

Transform object types by iterating over keys:

```ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
```

### Template Literal Types

Model string patterns for event names, CSS values, and API paths:

```ts
type EventName = `on${Capitalize<string>}`;
type CSSValue = `${number}${"px" | "rem"}`;
```

### Use `satisfies` for Literal Inference

Validates a value matches a type without widening:

```ts
type Config = { url: string; retries: number };
const dev = { url: "http://localhost", retries: 3 } satisfies Config;
```

## Generics

- Constrain with `extends`: `<T extends HasId>` — never leave a generic unconstrained.
- Default types reduce inference burden: `<T = string>`.

## Avoiding `any`

- **Never use `any`.** It bypasses the entire type system.
- Use `unknown` instead — forces runtime narrowing before use.
- Use `never` for exhaustive switch/if-else checking in discriminated unions.
- Use `as const` for literal inference on arrays and objects.

Error handling pattern with `unknown`:

```ts
try {
  // ...
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

## Error Handling

- Use `Result<T, E>` types (discriminated union with `ok` discriminant) for expected failures — avoids try/catch control flow.
- Reserve `throw` for programmer errors (assertions, invariant violations) that should crash.
- Always narrow caught errors — `catch (err: unknown)` and validate shape before use.

## Code Organization

### No Barrel Exports

Never re-export modules through index files. Import directly from source files. This:

- Prevents circular dependencies
- Keeps import chains explicit and traceable
- Improves tree-shaking

### Self-Documenting Code

- Prefer meaningful names over comments — DRY, KISS.
- Write JSDoc only for: externally-exported APIs, extremely complex logic.
- Skip JSDoc on internal functions — the code should speak for itself.

### Module Boundaries

- One module = one responsibility.
- Export only what consumers need. Mark internals with `_` prefix or keep them unexported.

## Type Testing and Patterns

- Use assertion functions (`asserts x is T`) for runtime validation that narrows types post-return.
- Write compile-time type tests using `// @ts-expect-error` for negative cases.
- Avoid type assertions (`as T`) — they lie to the compiler. Use type guards instead.

## Common Mistakes

| Mistake                                                     | Fix                                               |
| ----------------------------------------------------------- | ------------------------------------------------- |
| Using `any` to bypass errors                                | Use `unknown` + type narrowing                    |
| Overly broad return types (`object`, `Record<string, any>`) | Return specific discriminated unions              |
| Missing `readonly` on function parameters                   | `readonly T[]` for array params                   |
| Optional chaining on non-nullable types                     | Let the type system guide you — don't over-defend |
| Type assertions instead of type guards                      | Write a user-defined type guard: `x is T`         |
