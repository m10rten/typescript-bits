# Clock

A time abstraction that makes time-dependent code testable.

```ts
export interface Clock {
  now(): number;
  sleep(ms: number): Promise<void>;
}
```

- **now** — returns the current timestamp in milliseconds (like `Date.now()`).
- **sleep** — returns a promise that resolves after the given delay.

Production implementation wraps `Date` and `setTimeout`; test implementations can advance time instantly.
