---
name: type-system-patterns
description: Advanced TypeScript type system patterns — branded types, discriminated unions, conditional types, mapped types, template literals, type predicates, and variance
---

# Type System Patterns

Deep-end TypeScript. These patterns go beyond utility types and tsconfig — they cover how to model domain invariants, derive types, and make illegal states unrepresentable.

## Branded / Nominal Types

TypeScript is structurally typed: two types with the same shape are interchangeable. Branding breaks that when semantic identity matters.

### Construction Pattern

```ts
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/** Opaque user ID — not assignable from plain string */
export type UserId = Brand<string, "UserId">;
/** Opaque post ID — not assignable from plain string */
export type PostId = Brand<string, "PostId">;

/** Constructor validates and brands the raw value */
export function makeUserId(raw: string): UserId {
  if (!raw.trim()) throw new Error("UserId cannot be empty");
  return raw as UserId;
}

function getUser(id: UserId): void {
  /* ... */
}

const raw = "abc-123";
getUser(raw); // Error: Argument of type 'string' is not assignable
getUser(makeUserId(raw)); // OK
```

### Why `unique symbol` over string literal

A `unique symbol` brand cannot be forged from another file without importing the symbol — stronger than `{ __brand: "UserId" }` which any object literal can satisfy. However, for most cases a string literal brand is simpler and sufficient; use `unique symbol` when collision risk is real.

### Numeric brands

```ts
export type Milliseconds = Brand<number, "Milliseconds">;
export type Seconds = Brand<number, "Seconds">;

export const ms = (n: number): Milliseconds => n as Milliseconds;
export const sec = (n: number): Seconds => n as Seconds;

function delay(duration: Milliseconds): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

delay(sec(5)); // Error — prevents silent unit mismatch
delay(ms(5000)); // OK
```

## Discriminated Unions

Model states as a closed set. Each variant carries exactly the data it needs; others are absent.

### Design Rules

- Discriminant field is a string or numeric literal — never `boolean` (boolean discriminants produce confusing inference)
- Every variant is a plain object literal type — no classes
- Add new variants without touching existing code (Open/Closed)

```ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: T; fetchedAt: number }
  | { status: "error"; error: Error; retries: number };
```

### Exhaustive Switch with `never`

```ts
function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unhandled variant: ${JSON.stringify(value)}`);
}
```

```ts
function render<T>(state: FetchState<T>): string {
  switch (state.status) {
    case "idle":
      return "Idle";
    case "loading":
      return `Loading since ${state.startedAt}`;
    case "success":
      return `Data: ${JSON.stringify(state.data)}`;
    case "error":
      return `Error (${state.retries} retries): ${state.error.message}`;
    default:
      return assertNever(state);
  }
}
```

Adding a new variant (`"cancelled"`) causes a compile error at the `assertNever` call — not a silent runtime miss.

### Multi-field Narrowing

TypeScript narrows on any literal field, not just a dedicated `kind`. But mixing business data with the discriminant gets messy fast — keep the discriminant dedicated.

## Conditional Types

Compute types based on type-level conditions. Three primitives: `extends`, `infer`, distributive behavior.

### `infer` — Extract from Structure

```ts
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type FirstArg<T> = T extends (first: infer A, ...rest: any[]) => any ? A : never;

// Extract the resolved value from a deeply nested promise
type DeepAwaited = Awaited<Promise<Promise<string>>>; // string
```

### Distributive Behavior

When the checked type is a naked type parameter, the conditional distributes over unions:

```ts
type IsString<T> = T extends string ? true : false;
type R = IsString<string | number>; // true | false — distributed

// Prevent distribution by wrapping in a tuple
type IsStringExact<T> = [T] extends [string] ? true : false;
type R2 = IsStringExact<string | number>; // false — no distribution
```

Use tuple-wrap when you want to test a union as a whole, not element by element.

### Practical: Filter Union Members

```ts
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type Events = "click" | "focus" | "blur" | "change";
type FocusEvents = Extract<Events, "focus" | "blur">; // "focus" | "blur"
```

## Mapped Types

Iterate over keys to derive new object types. Three clauses: `in`, `as` (key remapping), `?`/`-?`/`readonly`/`-readonly`.

```ts
// Readonly deep clone
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Getters — key remapping with `as`
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Remove optionality
type Required<T> = { [K in keyof T]-?: T[K] };

// Filter keys by value type
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type User = { id: string; age: number; active: boolean };
type StringFields = PickByValue<User, string>; // { id: string }
```

### Key Remapping Rules

- `as never` removes the key entirely
- `as` clause receives the key type `K`, not the value
- Combine with template literals for naming conventions (`get${...}`, `on${...}`)

## Template Literal Types

Construct and decompose string types at the type level. Most useful for event names, CSS shorthand, and API paths.

```ts
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Route = `/${string}`;
type Endpoint = `${HTTPMethod} ${Route}`;

// Typed event emitter
type EventMap = { click: MouseEvent; keydown: KeyboardEvent; resize: UIEvent };
type OnEvent = `on${Capitalize<keyof EventMap & string>}`;
// "onClick" | "onKeydown" | "onResize"

// Extract route params
type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractParams<`/${Rest}`>
  : T extends `${string}:${infer Param}`
    ? Param
    : never;

type Params = ExtractParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"
```

### Intrinsic String Utilities

TypeScript provides four built-in string manipulation types: `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`. All are resolved at compile time with no runtime cost.

## Type Predicates and Assertion Functions

Narrow types based on runtime checks while keeping the call site readable.

### Type Predicates (`x is T`)

```ts
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

// Usage
const items: (string | null)[] = ["a", null, "b", null, "c"];
const strings: string[] = items.filter(isNonNull);
```

### Assertion Functions (`asserts x is T`)

Unlike predicates, assertion functions throw instead of returning `false`. TypeScript narrows the type for the **rest of the enclosing scope** after the call.

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected string, got ${typeof value}`);
  }
}

function assertDefined<T>(value: T, label = "value"): asserts value is NonNullable<T> {
  if (value == null) throw new Error(`${label} must be defined`);
}

// Usage
function process(input: unknown): string {
  assertIsString(input);
  return input.toUpperCase(); // narrowed to string here
}
```

### When to Use Which

| Situation                                 | Pattern                               |
| ----------------------------------------- | ------------------------------------- |
| `Array.filter`, conditional branches      | Type predicate (`x is T`)             |
| Validate at boundary, throw on failure    | Assertion function (`asserts x is T`) |
| Simple `instanceof`/`typeof` check inline | Inline check — no helper needed       |

## Variance

Variance describes how a generic type `Container<T>` relates to `Container<U>` when `T extends U`.

### Covariant — Output Position

A type is covariant in `T` when `T` only appears as a return value (output). `Container<Dog> extends Container<Animal>` — the more specific type is assignable to the wider one.

```ts
type Producer<T> = { produce: () => T };
// Producer<Dog> is assignable to Producer<Animal> ✓
```

### Contravariant — Input Position

A type is contravariant in `T` when `T` only appears as a parameter (input). `Container<Animal>` is assignable to `Container<Dog>` — you need to flip.

```ts
type Consumer<T> = { consume: (value: T) => void };
// Consumer<Animal> is assignable to Consumer<Dog> ✓
// (a function that handles any Animal can handle a Dog)
```

### Invariant — Both Positions

When `T` appears in both input and output, neither direction is safe. The type is invariant — only `Container<T>` is assignable to `Container<T>`.

```ts
type ReadWrite<T> = { get: () => T; set: (v: T) => void }; // invariant
```

### Practical Rule

- `readonly` arrays (`ReadonlyArray<T>`) are covariant — safe to assign `Dog[]` to `Animal[]`
- Mutable arrays are invariant in strict mode (`strictFunctionTypes: true`)
- Function parameters are contravariant — a callback expecting `Animal` can stand in for one expecting `Dog`

When designing generic APIs: if a type parameter only flows out, make the container `readonly`; if it only flows in, the callback pattern naturally handles contravariance.

## Common Mistakes

| Mistake                                                                   | Fix                                                                                                                                                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Branding with `{ __brand: "X" }` as an intersection without a constructor | Always pair the brand with a constructor that validates and casts — raw `as BrandedType` at call sites defeats the purpose                                   |
| Forgetting `assertNever` in exhaustive switches                           | Add `default: return assertNever(x)` — compiler catches new union variants silently otherwise                                                                |
| Distributing over a union unintentionally                                 | Wrap the checked type in `[T] extends [U]` to suppress distribution                                                                                          |
| Using `as` key remapping without `string &` guard                         | `Capitalize<K>` requires `K extends string` — use `string & K` or `K & string` to narrow                                                                     |
| Writing type predicates that lie                                          | A predicate returning `x is Foo` that doesn't actually verify the full shape is worse than no predicate — over-narrow or use `unknown` + validate completely |
| Modeling mutable state as covariant                                       | A `Container<Dog>[]` assigned to `Container<Animal>[]` allows pushing a `Cat` — use `ReadonlyArray` or invariant generics for mutable containers             |
| Using `infer` in a non-conditional position                               | `infer` only works inside the `extends` clause of a conditional type — it cannot appear in mapped types or plain generics                                    |
| Ignoring variance when wrapping callbacks                                 | Passing `(animal: Animal) => void` where `(dog: Dog) => void` is expected is safe; the reverse is not — understand contravariance before inverting callbacks |
