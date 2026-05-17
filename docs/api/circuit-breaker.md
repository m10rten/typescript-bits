# CircuitBreaker

Prevents cascading failures by short-circuiting calls when a dependency is unhealthy.

```ts
export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export interface CircuitBreaker {
  execute<T>(fn: () => Promise<T>): Promise<T>;
  state: CircuitState;
  reset(): void;
}
```

- **execute** — runs the function if the circuit is closed/half-open; throws immediately if open.
- **state** — current circuit state.
- **reset** — manually forces the circuit back to closed.

Transitions: `closed → open` after `failureThreshold` failures, `open → half-open` after `resetTimeoutMs`.
