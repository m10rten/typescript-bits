# Reset

TypeScript module augmentation to replace `any` with `unknown` across built-in APIs. Enforces explicit type assertions instead of silent `any` leaks.

Augments `JSON`, `Body` (fetch), `Array`, `ArrayConstructor`, `Set`, and `SetConstructor` to use `unknown` instead of `any`.

## Usage

Import the module — typically in a central entry point or at the top of files that consume untyped data.

```ts
import "typescript-bits/reset";

// Now JSON.parse returns unknown — assertion required
const data = JSON.parse(raw);
// data: unknown

if (Array.isArray(data)) {
  // data: unknown[]
}
```

## Design

- **Side-effect import** — contains only `declare global` blocks; importing it is the activation mechanism.
- **All-in-one** — single import covers all built-in type resets.
