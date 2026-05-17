# Queue

A bounded async task queue that processes items sequentially or with limited concurrency.

```ts
export interface Queue<T, R> {
  push(item: T): Promise<R>;
  size(): number;
  clear(): void;
}
```

- **push** — enqueues an item and returns a promise that resolves with the result.
- **size** — returns the number of pending items.
- **clear** — removes all pending items; in-flight tasks continue.
