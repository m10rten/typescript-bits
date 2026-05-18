# Queue

A FIFO queue with typed event callbacks for reactive consumption.

```ts
export type QueueEvent<T> =
  | { type: "push"; item: T }
  | { type: "pop"; item: T }
  | { type: "drain"; items: T[] }
  | { type: "empty" }
  | { type: "idle" }
  | { type: "error"; error: Error };

export class Queue<T> {
  readonly size: number;
  constructor(items?: Iterable<T>);
  push(item: T): void;
  pop(): T | undefined;
  front(): T | undefined;
  drain(): T[];
  on(callback: (event: QueueEvent<T>) => void): () => void;
}
```

- **constructor** — creates a new queue, optionally seeded with items.
- **push** — adds an item to the back; fires `"push"` event.
- **pop** — removes and returns the front item; fires `"pop"` or `"empty"` event.
- **front** — returns the front item without removing it.
- **drain** — removes and returns all items in FIFO order; fires `"drain"` event.
- **on** — registers a callback for queue events; returns an unsubscribe function.
