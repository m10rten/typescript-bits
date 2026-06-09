---
name: software-principles-guidelines
description: Core software engineering principles and guidelines — SOLID, DRY, KISS, YAGNI, cohesion, coupling, and structural design patterns for maintainable systems
---

# Software Principles & Guidelines

Foundational software engineering principles for designing maintainable, scalable, and robust systems. Apply these when making architectural decisions, writing code, or reviewing pull requests.

## SOLID Principles

### Single Responsibility (SRP)

A module, class, or function should have one reason to change — one clearly defined responsibility.

```
// ❌ Mixed concerns — parsing + validation + persistence
function processUserData(raw: unknown): void { ... }

// ✅ Separate each concern
function parseUserData(raw: unknown): UserData { ... }
function validateUserData(data: UserData): ValidationResult { ... }
function saveUserData(data: UserData): Promise<void> { ... }
```

- If a function has "and" in its name (`validateAndSave`), it does too much.
- Extract orthogonal concerns (logging, metrics, persistence, parsing) into separate modules.
- The 200-line function limit is a heuristic — if it's harder to name, split it.

### Open/Closed (OCP)

Software entities should be open for extension, closed for modification.

```ts
// ❌ Adding a new shape requires editing this function
function area(shape: Shape): number {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2;
  if (shape.kind === "rectangle") return shape.width * shape.height;
  throw new Error("unknown shape");
}

// ✅ New shapes implement the interface — no modification needed
interface Shape {
  area(): number;
}
class Circle implements Shape {
  constructor(public radius: number) {}
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
class Rectangle implements Shape {
  constructor(
    public w: number,
    public h: number,
  ) {}
  area(): number {
    return this.w * this.h;
  }
}
```

- Use polymorphism, strategy pattern, or plugin architecture over conditionals.
- Discriminated unions with exhaustive matching are a functional equivalent of OCP.

### Liskov Substitution (LSP)

Subtypes must be substitutable for their base types without altering correctness.

```ts
// ❌ Violates LSP — narrows return type, strengthens preconditions
class Rectangle {
  setWidth(w: number): void {
    this.width = w;
  }
  setHeight(h: number): void {
    this.height = h;
  }
}
class Square extends Rectangle {
  setWidth(w: number): void {
    this.width = w;
    this.height = w;
  } // side effect: changes height
  setHeight(h: number): void {
    this.width = h;
    this.height = h;
  }
}
```

- Prefer composition over inheritance to avoid LSP violations.
- If a subtype cannot fully honor the contract of its base, restructure with interfaces.
- The Square/Rectangle violation fundamentally stems from mutable state — using immutable value objects avoids this pattern.

### Interface Segregation (ISP)

No client should be forced to depend on methods it does not use.

```ts
// ❌ Fat interface — every printer must implement scan/fax
interface AllInOne {
  print(doc: Document): void;
  scan(): Document;
  fax(doc: Document): void;
}

// ✅ Segregated interfaces
interface Printer {
  print(doc: Document): void;
}
interface Scanner {
  scan(): Document;
}
interface Fax {
  fax(doc: Document): void;
}
```

- Split large interfaces by role/consumer, not by entity.
- In TypeScript, you don't need to pre-declare interfaces — let consumers accept the narrowest type they need.

### Dependency Inversion (DIP)

High-level modules should not depend on low-level modules. Both should depend on abstractions.

```ts
// ❌ High-level depends on low-level detail
class UserService { constructor(private db: PostgresDatabase) {} }

// ✅ Both depend on abstraction
interface UserRepository { find(id: string): Promise<User>; }
class PostgresUserRepository implements UserRepository { ... }
class UserService { constructor(private repo: UserRepository) {} }
```

- Inject dependencies through constructors or function parameters — never `new` inside a class.
- In functional code, pass dependencies as arguments rather than importing directly.

## General Design Principles

### DRY (Don't Repeat Yourself)

Every piece of knowledge must have a single, unambiguous representation within a system.

```ts
// ❌ Duplicated validation logic
function createUser(data: unknown) { if (!data.name) throw new Error("name required"); ... }
function updateUser(data: unknown) { if (!data.name) throw new Error("name required"); ... }

// ✅ Single source of truth
function requireName(data: unknown): asserts data is { name: string } {
  if (!data || typeof data.name !== "string") throw new Error("name required");
}
```

- Duplication of structure (same code) is a code smell; duplication of intent (same concepts) is a design smell.
- Three strikes and you refactor — one-off duplication may be acceptable; three occurrences need extraction.

### KISS (Keep It Simple, Stupid)

Simple systems are easier to understand, test, and change. Complexity is a liability.

```ts
// ❌ Over-engineered
class UserBuilder {
  #user: Partial<User> = {};
  withName(name: string): this {
    this.#user.name = name;
    return this;
  }
  withEmail(email: string): this {
    this.#user.email = email;
    return this;
  }
  build(): User {
    return this.#user as User;
  }
}

// ✅ Simple factory function
function createUser(name: string, email: string): User {
  return { name, email };
}
```

- Every abstraction has a cost (indirection, naming, discoverability). Ask: is the simplicity of the call site worth the complexity of the abstraction?
- Prefer flat code with clear control flow over deep nesting or clever metaprogramming.

### YAGNI (You Ain't Gonna Need It)

Always implement things when you actually need them, never when you merely anticipate that you might need them.

- Don't add generic extensibility hooks, plugin systems, or configuration flags for hypothetical future requirements.
- Refactoring toward generality when a real second use case emerges is cheaper than maintaining unused abstraction.
- This is not an excuse to write rigid code — extract when the pattern actually repeats.
- Distinguish hypothetical future-proofing from deliberate feature flags — flags for trunk-based development or gradual rollouts serve an immediate need and are not YAGNI violations.
- When adding a flag, scope it narrowly and remove it once the decision settles.

## Structural Principles

### Composition Over Inheritance

Favor composing behaviors from small, focused units over deep inheritance hierarchies.

```ts
// ❌ Deep inheritance
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {
  bark(): void {}
}

// ✅ Composed behaviors
type Bark = { bark(): void };
type Walk = { walk(): void };
function createDog(): Bark & Walk {
  return { bark() {}, walk() {} };
}
```

- Inheritance creates rigid taxonomies that break when requirements cross branches.
- Composition with interfaces (or function composition) is more flexible and testable.

### Separation of Concerns

Different concerns (data access, business logic, presentation, configuration) belong in different modules.

- Layered architecture: presentation → application → domain → infrastructure.
- Within a module, separate public API from internal implementation details.
- Configuration and wiring (DI container, main function) is a concern separate from business logic.

### Functional Core / Imperative Shell

Push side-effects (IO, network, mutations) to a thin outer shell; keep business logic as pure functions at the center.

- Pure functions are trivial to test, reason about, and compose — the `Result` type pattern embodies this.
- The shell orchestrates: parse input → call pure logic → handle result → persist/output.
- This boundary is where validation, error wrapping, and resource cleanup naturally live.

### Law of Demeter (Principle of Least Knowledge)

A unit should only talk to its immediate neighbors — not to the neighbor of a neighbor.

```ts
// ❌ Train wreck — knows too much about the graph
const city = order.customer.address.city;

// ✅ Tell, don't ask — or restructure
const city = order.getShippingCity();
```

- One dot per expression is a guideline, not a rule. Two dots (a.b.c) is a code smell.
- The deeper the chain, the more coupled the code is to the data structure.

## Coupling & Cohesion

### High Cohesion

Related behaviors belong together. Everything in a module should contribute to a single purpose.

- Module exports: they should form a coherent set. If half the exports are unrelated, split the module.
- Class: its methods should operate on its own data — static utility methods that don't reference `this` belong elsewhere.

### Loose Coupling

Modules should depend on abstractions, not concrete implementations. Changes in one module should rarely force changes in another.

| Coupling Type    | Indicators                                           | Fix                             |
| ---------------- | ---------------------------------------------------- | ------------------------------- |
| Content coupling | Reading another module's internals                   | Encapsulate behind API          |
| Common coupling  | Shared global mutable state                          | Pass data explicitly            |
| Control coupling | Passing flags that alter control flow                | Split into separate functions   |
| Stamp coupling   | Passing entire objects when only one field is needed | Pass only what's needed         |
| Data coupling    | Passing only primitive arguments                     | Acceptable — preferred coupling |

## Error Handling & Robustness

### Fail Fast

Detect and report errors as early as possible — at construction/startup, not deep in a transaction.

```ts
// ❌ Latent failure — fails at call time
class Config {
  constructor(private raw: unknown) {}
  get port(): number {
    return (this.raw as any).port;
  }
}

// ✅ Fail fast — validate at construction
class Config {
  readonly port: number;
  constructor(raw: unknown) {
    if (!raw || typeof raw !== "object" || typeof (raw as any).port !== "number") throw new Error("Invalid config");
    this.port = (raw as any).port;
  }
}
```

- Validate inputs at the boundary (API, file read, user input).
- Assert invariants early in constructors and setup functions.

### Robustness Principle (Postel's Law)

Be conservative in what you send, be liberal in what you accept.

- Accept flexible input formats but produce strict, well-defined output.
- Do not silently ignore invalid input — preserve errors in a structured way even when being lenient.

## Testing Principles

### FIRST

- **Fast** — tests should run quickly to encourage frequent execution.
- **Isolated** — each test runs independently, no shared state.
- **Repeatable** — same result every time, regardless of environment.
- **Self-validating** — pass/fail is binary; no manual inspection.
- **Timely** — write tests close to when you write the code.

### Test Behavior, Not Implementation

- Test the visible contract (public API, function signatures), not internal implementation details.
- Refactoring internals should not break tests if the contract holds.
- Mock at boundaries (IO, external services), not within your domain logic.
- For pure functions (validation, parsing, transformation), consider property-based testing — assert invariants over random inputs instead of hand-picked examples.

## Pragmatic Guidelines

### Command-Query Separation (CQS)

Methods should either be commands (mutate state, return void) or queries (return data, no side effects), but not both.

```ts
// ❌ Mixes command and query
function pop<T>(stack: T[]): T | undefined {
  return stack.pop();
}

// ✅ Separate
function peek<T>(stack: T[]): T | undefined {
  return stack.at(-1);
}
function pop<T>(stack: T[]): T | undefined {
  return stack.pop();
}
```

### Principle of Least Astonishment

Code should behave in ways that users (and other developers) would reasonably expect.

- Function names should accurately describe what they do — `deleteUser` should delete, not archive.
- Parameter order should be consistent within the codebase.
- Avoid surprising implicit behaviors (auto-save, hidden mutations, magic globals).

### Boy Scout Rule

Leave the codebase cleaner than you found it.

- If you touch a file, fix one small issue (rename, extract, add a missing guard).
- Dedicate 10% of every implementation ticket to surrounding cleanup.
- This prevents gradual decay into technical debt.

## Common Anti-Patterns

| Anti-Pattern           | Description                                    | Fix                                   |
| ---------------------- | ---------------------------------------------- | ------------------------------------- |
| God class              | A single class knows/does everything           | Split by responsibility (SRP)         |
| Spaghetti code         | Entangled control flow with no structure       | Extract functions, layer architecture |
| Golden hammer          | Overusing a favorite pattern/abstraction       | Choose the right tool for the problem |
| Copy-paste programming | Duplicating code without understanding         | Extract shared logic (DRY)            |
| Premature abstraction  | Abstracting before the pattern is clear        | Write concrete, then refactor (YAGNI) |
| Shotgun surgery        | One change requires edits everywhere           | Centralize the concern behind an API  |
| Feature envy           | A method uses another class's data excessively | Move the method closer to the data    |
| Magic numbers/strings  | Bare literals without named constants          | Extract to well-named constants       |
