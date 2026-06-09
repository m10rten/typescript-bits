---
name: composition-patterns
description: Concrete patterns for composing behavior from small units — function composition, middleware, decorators, mixins, monad chaining, builders, plugin systems, strategy composition, and type-level composition for TypeScript
---

# Composition Patterns

Practical patterns for composing behavior from small units. The _how_ counterpart to the _why_ in software-principles-guidelines. Apply these when building composable APIs or combining existing primitives into larger workflows.

## Function Composition

Combine functions by passing output as input. The foundation of all composition.

### `pipe()` — Left-to-Right

Data flows left-to-right, matching reading order:

```ts
function pipe<A, B>(f: (a: A) => B): (a: A) => B;
function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;
// ...overloads up to 10 params — TypeScript infers better than variadic generics
function pipe(...fns: Function[]): Function {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}
```

### `flow()` — Right-to-Left

Data flows right-to-left (mathematical `f ∘ g`). Use `pipe` for data pipelines; use `flow` only when declaring a named transformation in math style.

### Point-Free Style

Define functions without mentioning arguments — useful when the pipeline is the definition:

```ts
const processUser = pipe(validateUser, enrichWithDefaults, hashPassword, saveToDatabase);
```

Don't force point-free. If naming intermediate values improves clarity, use a block body.

### Type Safety

Prefer variadic tuple generics (TS 5.x) as the primary approach — inference is robust. Keep overloads up to 10-12 params as a fallback for edge cases where inference degrades.

## Middleware Chains

The onion/hook pattern for sequential processing where each layer can modify context, delegate to the next, and optionally modify output on the way back.

### Koa-Style Onion (with outbound phase)

Each middleware receives context and `next`. Layers execute inbound, then outbound:

```ts
type Middleware<Ctx> = (ctx: Ctx, next: () => Promise<void>) => Promise<void>;

function compose<Ctx>(middleware: Middleware<Ctx>[]): (ctx: Ctx) => Promise<void> {
  return async (ctx) => {
    let index = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const fn = middleware[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    };
    await dispatch(0);
  };
}
```

### Express-Style Chain (sequential, no onion)

Middlewares pass through in order with req/res/next. No outbound phase — just sequential delegation.

### When to Use Which

| Pattern         | Use case                                 | Outbound phase |
| --------------- | ---------------------------------------- | -------------- |
| Koa-style onion | Request/response, logging, timing, auth  | Yes            |
| Express chain   | Simple sequential processing, validation | No             |

## Decorators

Wrap a function to add behavior before, after, or around its execution. Prefer functions over class decorators (TS 5.x supports Stage 3 decorators with `experimentalDecorators: false`; wrappers remain more explicit and composable).

```ts
function before<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  hook: (...args: Args) => void,
): (...args: Args) => R {
  return (...args) => {
    hook(...args);
    return fn(...args);
  };
}

function after<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  hook: (result: R, ...args: Args) => void,
): (...args: Args) => R {
  return (...args) => {
    const r = fn(...args);
    hook(r, ...args);
    return r;
  };
}

function around<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  wrapper: (inner: (...args: Args) => R, ...args: Args) => R,
): (...args: Args) => R {
  return (...args) => wrapper(fn, ...args);
}
```

### Common Decorators

```ts
const withLogging = <A extends unknown[], R>(fn: (...args: A) => R) =>
  around(fn, (inner, ...args) => {
    console.log(`call: ${fn.name}`, args);
    const result = inner(...args);
    console.log(`result: ${fn.name}`, result);
    return result;
  });
```

### Key Principles

- Keep decorators single-responsibility: one concern per wrapper.
- Compose multiple decorators via `pipe(fn, withLogging, withRetry)`.
- Decorators should not change the function's return type (unless it's a terminal operation).

## Mixin Composition

Combine behaviors from multiple sources into one object. Prefer composition via spread over class mixins.

### Via Spread (Recommended)

```ts
type Nameable = { name: string; setName(n: string): Nameable };
type Ageable = { age: number; setAge(a: number): Ageable };

function withName(name: string): Nameable {
  return {
    name,
    setName(this: Nameable, n: string): Nameable {
      return { ...this, name: n };
    },
  };
}
function withAge(age: number): Ageable {
  return {
    age,
    setAge(this: Ageable, a: number): Ageable {
      return { ...this, age: a };
    },
  };
}

function createPerson(name: string, age: number) {
  return { ...withName(name), ...withAge(age) };
}
```

### Class Mixins (When Inheritance Is Mandatory)

Only when a class-based interface is required (e.g., framework base classes):

```ts
type Constructor<T = object> = abstract new (...args: unknown[]) => T;
function MixName<T extends Constructor>(Base: T) {
  abstract class WithName extends Base {
    name!: string;
    setName(n: string): void {
      this.name = n;
    }
  }
  return WithName;
}
```

Class mixins break `instanceof`, complicate inference, and couple to inheritance chains. Prefer spreading.

### Override Resolution

Later sources win. Document priority explicitly:

```ts
const composed = { ...defaults, ...config, ...flags }; // flags highest priority
```

## Monad-Like Composition

Chain operations on container types (`Result`, `Option`, `Promise`) without unwrapping intermediate values.

### `map` — Transform the Inner Value

```ts
// Result<string, Error> → Result<number, Error>
const parsed = map(parseInt)(result);
```

### `flatMap` / `chain` — Sequence Dependent Operations

```ts
const result = pipe(
  fetchUser(id),
  flatMap((user) => validateAge(user)),
  flatMap((user) => saveToDb(user)),
);
```

Without chaining: 3 levels of nesting with manual error propagation.

### Pattern for Custom Chains

```ts
class Chainable<T> {
  constructor(private value: T) {}
  map<U>(fn: (t: T) => U): Chainable<U> {
    return new Chainable(fn(this.value));
  }
  tap(fn: (t: T) => void): this {
    fn(this.value);
    return this;
  }
  unwrap(): T {
    return this.value;
  }
}
```

### When to Chain vs. Pipe

| Situation                         | Approach        |
| --------------------------------- | --------------- |
| Transformations on a single value | `pipe`          |
| Dependent operations on a monad   | `flatMap`/chain |
| Side effects in a pipeline        | `tap` / `do`    |
| Parallel independent operations   | `map` + tuple   |

### Applicative Composition (Error Accumulation)

For independent validations, collect **all** errors with applicative style instead of failing fast:

```ts
const result = collectAll([parseName(raw), parseAge(raw)]); // both errors captured
```

Use `flatMap` for sequential dependencies; use applicative for parallel validations where every error matters.

## Builder Pattern

Fluent interface for constructing complex objects step by step. Terminal operations finalize and produce the result.

```ts
class QueryBuilder {
  private filters: string[] = [];
  private sortField = "id";
  private sortOrder: "asc" | "desc" = "asc";
  private limit = 100;

  where(condition: string): this {
    this.filters.push(condition);
    return this;
  }
  orderBy(field: string, order: "asc" | "desc" = "asc"): this {
    this.sortField = field;
    this.sortOrder = order;
    return this;
  }
  take(n: number): this {
    this.limit = Math.min(Math.max(n, 1), 1000);
    return this;
  }
  build(): { sql: string; params: unknown[] } {
    return { sql: `SELECT * FROM users ...`, params: [] };
  }
}
```

### Typed Builder via Generics

Accumulate type information through the chain for precise return types:

```ts
class ConfigBuilder<T extends Partial<Config> = {}> {
  static create(): ConfigBuilder<{}> { return new ConfigBuilder({} as any); }
  setHost<H extends string>(host: H): ConfigBuilder<T & { host: H }> { ... }
  setPort<P extends number>(port: P): ConfigBuilder<T & { port: P }> { ... }
  build(): Config<T> { return this.state as any; }
}
```

### Terminal vs. Intermediate

| Operation                      | Returns     | Chainable? |
| ------------------------------ | ----------- | ---------- |
| Setter                         | `this`      | Yes        |
| `build()` / `run()` / `done()` | Final value | No         |

Every builder must have a terminal operation. Without it, the builder is just mutable state.

## Plugin Architecture

Allow external code to extend behavior through registration hooks. The host defines extension points; plugins hook into them.

```ts
type Plugin<Ctx> = { name: string; apply: (ctx: Ctx) => void | Promise<void> };

class Engine<Ctx extends Record<string, unknown>> {
  private plugins: Plugin<Ctx>[] = [];
  use(plugin: Plugin<Ctx>): this {
    this.plugins.push(plugin);
    return this;
  }
  unregister(name: string): boolean {
    const idx = this.plugins.findIndex((p) => p.name === name);
    if (idx === -1) return false;
    this.plugins.splice(idx, 1);
    return true;
  }
  async init(ctx: Ctx): Promise<void> {
    for (const plugin of this.plugins) await plugin.apply(ctx);
  }
}
```

### Key Principles

- Define lifecycle hooks (beforeRequest, afterResponse, onError) that plugins can implement.
- Always provide `unregister` — plugins should be removable at runtime.
- Return `this` from `use()` for chaining.
- Validate plugin contracts at registration, not at call time.
- Restrict plugin access to a controlled context object — never expose internals.

## Strategy Composition

Select or combine strategies at runtime. More flexible than a single strategy interface.

```ts
type Matcher<T, R> = { match(input: T): boolean; execute(input: T): R };

// First-match — routing, dispatch, fallback
function firstMatch<T, R>(input: T, strategies: Matcher<T, R>[]): R | undefined {
  for (const s of strategies) if (s.match(input)) return s.execute(input);
  return undefined;
}

// All-match — validation, enrichment
function allMatch<T, R>(input: T, strategies: Matcher<T, R>[]): R[] {
  return strategies.filter((s) => s.match(input)).map((s) => s.execute(input));
}
```

### Decision Matrix

| Pattern         | Behavior                        | Use case                    |
| --------------- | ------------------------------- | --------------------------- |
| First-match     | Returns first winning result    | Routing, dispatch, fallback |
| All-match       | Collects all winning results    | Validation, enrichment      |
| Aggregate       | Combines results mathematically | Scoring, voting             |
| Weighted-select | Picks by priority/weight        | A/B testing, feature flags  |

## Type-Level Composition

Combine, constrain, and derive types to make composable APIs type-safe at zero runtime cost.

```ts
// Intersection (&) — combine types
type Nameable = { name: string };
type Ageable = { age: number };
type Person = Nameable & Ageable;

// Union (|) — this or that
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// Generic constraints — ensure composability
type HasId = { id: string };
function mergeEntities<A extends HasId, B extends HasId>(a: A, b: B): A & B {
  return { ...a, ...b };
}

// Mapped types — derive plugin-enhanced API
type WithPlugins<T, PluginReturn> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer R ? (...args: [...Args, ...PluginReturn[]]) => R : T[K];
};
```

## Common Anti-Patterns

| Anti-Pattern                | Description                                                  | Fix                                                   |
| --------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| Deep pipeline blindness     | Debugging 20-stage `pipe` where any stage can fail           | Break into named intermediates; log per stage         |
| Over-composition            | Tiny single-use functions in pursuit of purity               | Don't extract until the pattern repeats               |
| Mutation in pipelines       | Step mutates shared state, breaking referential transparency | Use immutable transforms                              |
| Wrong direction             | Using `flow` when data reads left-to-right                   | Default to `pipe`                                     |
| Overloaded middleware       | One middleware doing logging + auth + validation             | One concern per middleware (SRP)                      |
| Chaining with side effects  | Using `map` for side effects instead of `tap`                | Use `tap` for effects, `map` for transforms           |
| Builder without terminal    | Builder that never finalizes                                 | Every builder must have `build()` or equivalent       |
| Lossy intersection types    | `A & B` with overlapping keys silently losing one            | Use `Omit` to resolve conflicts explicitly            |
| Over-parameterized generics | Making every function generic "for flexibility"              | Constrain with `extends`; inference matters           |
| Leaky plugin context        | Plugin receives more internal state than needed              | Restrict plugin access to a controlled context object |
