# Atom

A reactive primitive that holds a single immutable value and notifies subscribers on change.

```ts
export interface Atom<T> {
  get(): T;
  set(value: T): void;
  subscribe(fn: (value: T) => void): () => void;
}
```

- **get** — returns the current value.
- **set** — replaces the value and notifies all subscribers.
- **subscribe** — registers a callback; returns an unsubscribe function.
