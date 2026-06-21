---
name: api-design-guidelines
description: Guidelines for designing public TypeScript APIs — surface area, types, options objects, exports, tree-shaking, and backwards compatibility
---

# API Design Guidelines

Rules for authoring TypeScript libraries and modules that are predictable, minimal, and stable. These apply when writing any code that will be imported by other modules.

## Minimal Surface Area

Export only the public contract. Everything not in the contract is an implementation detail — keep it unexported or in a `_internal` module.

```ts
// ✅ Export the type and the factory, nothing else
export type { Parser } from "./parser.js";
export { createParser } from "./parser.js";

// ❌ Leaking internals — callers shouldn't know about tokenize
export { tokenize } from "./parser.js";
```

- If you're unsure whether to export something, don't. You can always add; removing is a breaking change.
- Unexported symbols are free to change without a semver bump.

## Functions Over Classes for Stateless Utilities

Pure functions are simpler, tree-shakeable, and easier to test. Reach for a class only when you need encapsulated mutable state or when consumers must implement an interface.

```ts
// ❌ Unnecessary class — no state, just logic
class DateFormatter {
  format(date: Date, locale: string): string { ... }
}

// ✅ Plain function — importable, tree-shakeable, testable
export function formatDate(date: Date, locale: string): string { ... }
```

## Explicit Public Types

Annotate return types on every exported function. Never rely on inference for public API shapes — inference can change silently across TypeScript versions.

```ts
// ❌ Inferred — breaks when implementation changes
export function parseConfig(raw: unknown) {
  return { host: String(raw), port: 3000 };
}

// ✅ Explicit contract
export interface Config {
  host: string;
  port: number;
}

export function parseConfig(raw: unknown): Config {
  return { host: String(raw), port: 3000 };
}
```

- Ban `any` in all public signatures. Use `unknown` and narrow at runtime.
- Export the types consumers need to annotate their own code — don't make them `ReturnType<typeof yourFn>`.

## Options Objects Over Overloads

Use a single options object with optional fields instead of multiple overloads. Options are extensible without breaking callers; overloads are not.

```ts
// ❌ Overloads — adding a third variant is a breaking change
export function fetch(url: string): Promise<Response>;
export function fetch(url: string, timeout: number): Promise<Response>;

// ✅ Options object — new fields are additive
export interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export function fetch(url: string, options?: FetchOptions): Promise<Response> { ... }
```

- Always make new options fields optional with sensible defaults.
- Group related parameters: if three functions share `timeout` and `retries`, extract a `RetryOptions` interface.

## Named Exports Over Default Exports

Named exports are refactor-safe, grep-friendly, and compose predictably with re-export-free import paths.

```ts
// ❌ Default — callers can name it anything; tooling suffers
export default function parse(input: string) { ... }

// ✅ Named — import name is enforced at the source
export function parse(input: string) { ... }
```

- One exception: framework conventions that require a default (e.g., Next.js page components). Comply but stay consistent within the project.

## No Barrel / Re-export Index Files

Do not create `index.ts` files that re-export from other files. Import directly from the source module.

```ts
// ❌ Barrel — hides the dependency graph, breaks tree-shaking
// src/index.ts
export * from "./parse.js";
export * from "./format.js";
export * from "./validate.js";

// ✅ Direct import — explicit, traceable
import { parse } from "./src/parse.js";
```

- Barrels obscure the public API surface and defeat bundler tree-shaking.
- Consumers who need many symbols can import multiple paths — that's fine.

## Tree-Shaking Friendliness

Bundlers eliminate dead code only when modules have no side effects. Keep top-level module scope pure.

```ts
// ❌ Side effect at module scope — entire module is retained
const registry = new Map<string, Handler>();
registry.set("default", defaultHandler);

export function getHandler(name: string) {
  return registry.get(name);
}

// ✅ No side effects at module scope
export function createRegistry(): Map<string, Handler> {
  return new Map([["default", defaultHandler]]);
}
```

Rules:

- No `console.log`, `fetch`, or mutations at the top level of a module.
- Mark modules as side-effect-free in `package.json`: `"sideEffects": false`.
- If a module truly has a required side effect (polyfill, global setup), isolate it in its own file and document it.

## Backwards Compatibility

A public API is a promise. Once published, changes must be additive or versioned.

```ts
// ✅ Additive — new optional field, existing callers unaffected
export interface Config {
  host: string;
  port: number;
  timeout?: number; // added in 1.2.0
}

// ❌ Breaking — removed a field, changed a type
export interface Config {
  endpoint: string; // renamed from host — breaking change
}
```

- Use `@deprecated` JSDoc to signal removal without breaking callers immediately.

```ts
/**
 * @deprecated Use `formatDate` instead. Will be removed in v3.0.
 */
export function formatDateLegacy(date: Date): string { ... }
```

- Never change the type of an existing parameter — widen it or add an overload.
- Never remove a named export without a major version bump.

## Semantic Versioning Decision Matrix

| Change type                               | Version bump |
| ----------------------------------------- | ------------ |
| Add optional field to options object      | Minor        |
| Add a new named export                    | Minor        |
| Add optional parameter with a default     | Minor        |
| Bug fix with no API change                | Patch        |
| Remove an export                          | Major        |
| Change parameter type (narrower or wider) | Major        |
| Change return type                        | Major        |
| Rename an export                          | Major        |
| Make an optional field required           | Major        |

When in doubt, bump major. Consumers can always ignore a minor bump; they cannot ignore a broken major.

## JSDoc Expectations for Public Exports

JSDoc is required on every exported symbol. Internal functions do not need it.

```ts
/**
 * Parses a raw configuration object into a validated `Config`.
 *
 * @param raw - The untrusted input (e.g., from `process.env` or a JSON file).
 * @returns A validated `Config`, or throws `ConfigError` if validation fails.
 *
 * @example
 * const config = parseConfig({ host: "localhost", port: 8080 });
 */
export function parseConfig(raw: unknown): Config { ... }
```

Minimum requirements per exported symbol:

- One-sentence summary on the first line.
- `@param` for each parameter when the name alone is ambiguous.
- `@returns` when the return value is non-obvious.
- `@throws` when the function throws a documented error type.
- `@example` for functions with non-trivial usage.
- `@deprecated` with a migration path when applicable.

Skip JSDoc on unexported functions. The code should be self-documenting at that level.

## Common Mistakes

| Mistake                                                        | Fix                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Exporting implementation helpers alongside the public API      | Keep helpers unexported; only export the contract                        |
| Relying on inferred return types for exported functions        | Annotate all exported return types explicitly                            |
| Using function overloads for optional behavior                 | Use an options object with optional fields                               |
| Using default exports in a library                             | Use named exports; comply with framework conventions only when forced    |
| Creating `index.ts` barrel files                               | Import directly from source files                                        |
| Side effects at module scope (global mutations, `console.log`) | Move side effects into explicitly called functions                       |
| Changing an existing optional field to required                | Add a new field; deprecate the old one with a migration note             |
| Removing an export in a minor or patch release                 | Deprecate first; remove only on a major version bump                     |
| Writing JSDoc only on complex functions                        | Write JSDoc on every exported symbol, regardless of perceived complexity |
