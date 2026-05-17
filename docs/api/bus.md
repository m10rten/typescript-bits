# Bus

A lightweight event bus for publish/subscribe communication between decoupled modules.

```ts
export interface Bus {
  on(event: string, handler: (...args: unknown[]) => void): () => void;
  off(event: string, handler: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
}
```

- **on** — registers a handler for an event; returns an unsubscribe function.
- **off** — removes a previously registered handler.
- **emit** — invokes all handlers for the event with the provided arguments.
