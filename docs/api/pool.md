# Pool

A bounded resource pool for reusing expensive objects (connections, workers, etc.).

```ts
export interface Pool<T> {
  acquire(): Promise<Pooled<T>>;
  size(): number;
  close(): Promise<void>;
}

export interface Pooled<T> {
  resource: T;
  release(): void;
}
```

- **acquire** — returns a pooled resource (creates one if under limit, otherwise waits).
- **release** — returns the resource to the pool for reuse.
- **size** — returns the number of currently acquired resources.
- **close** — drains and destroys all pooled resources.
