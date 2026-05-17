# Deferred

A promise whose resolve and reject can be called from outside.

```ts
export interface Deferred<T> {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(reason: unknown): void;
}

export function createDeferred<T>(): Deferred<T>;
```

- **promise** — the underlying promise to await.
- **resolve** — fulfills the promise with a value.
- **reject** — rejects the promise with a reason.

Useful for bridging callback-style APIs or coordinating async workflows.
