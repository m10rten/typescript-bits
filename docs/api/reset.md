# Reset

TypeScript module augmentation to replace `any` with `unknown` across built-in APIs. Enforces explicit type assertions instead of silent `any` leaks.

## Submodules

Load individual resets by importing the specific submodule. Each module augments global types in place.

### reset/json

Makes `JSON.parse` return `unknown` instead of `any`.

```ts
declare global {
  interface JSON {
    parse(text: string, reviver?: (key: string, value: unknown) => unknown): unknown;
  }
}
```

### reset/fetch

Makes `Response.json()` return `Promise<unknown>` instead of `Promise<any>`.

```ts
declare global {
  interface Body {
    json(): Promise<unknown>;
  }
}
```

### reset/filter

Makes `Array.prototype.filter` use `unknown` for `thisArg` and properly narrow with type predicates.

```ts
declare global {
  interface Array<T> {
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S[];
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T[];
  }
}
```

### reset/map

Makes `Array.prototype.map` use `unknown` for `thisArg` and enforce explicit return types.

```ts
declare global {
  interface Array<T> {
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
  }
}
```

### reset/array

Makes `Array.isArray` narrow to `value is unknown[]` and `new Array()` produce `unknown[]`.

```ts
declare global {
  interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[];
  }

  interface ArrayConstructor {
    new <T = unknown>(...items: T[]): T[];
  }
}
```

### reset/set

Makes `Set` constructor and methods use `unknown` as the default type parameter instead of `any`.

```ts
declare global {
  interface SetConstructor {
    new <T = unknown>(values?: readonly T[]): Set<T>;
  }

  interface Set<T> {
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void;
  }
}
```

## Usage

Import the submodule(s) you need — typically in a central entry point or at the top of files that consume untyped data.

```ts
import "typescript-bits/reset/json";
import "typescript-bits/reset/fetch";
import "typescript-bits/reset/array";

// Now JSON.parse returns unknown — assertion required
const data = JSON.parse(raw);
// data: unknown

if (Array.isArray(data)) {
  // data: unknown[]
}
```

## Design

- **Modular** — import only what you need; no blanket global overrides.
- **Side-effect imports** — submodules contain only `declare global` blocks; importing them is the activation mechanism.
- **Composable** — mix and match submodules without coupling.
