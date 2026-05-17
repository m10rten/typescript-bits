# Mutex

Async mutual exclusion to protect critical sections from concurrent access.

```ts
export interface Mutex {
  acquire(): Promise<Release>;
}

export type Release = () => void;
```

- **acquire** — returns a promise that resolves with a release function when the lock is available.
- **Release** — call to free the lock for the next waiter.
