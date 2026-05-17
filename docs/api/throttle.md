# Throttle

Rate-limiting utilities for controlling function execution frequency.

```ts
export interface ThrottleOptions {
  intervalMs: number;
  leading?: boolean;
  trailing?: boolean;
}

export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, options: ThrottleOptions): T;
```

- **intervalMs** — minimum time between invocations.
- **leading** — call on the leading edge (default `true`).
- **trailing** — call on the trailing edge after the interval elapses.

Returns a wrapped function that respects the rate limit.
