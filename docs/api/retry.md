# Retry

Retries a synchronous or asynchronous operation with configurable attempts, delay, and backoff.

```ts
export interface RetryOptions<E = Error> {
  readonly attempts?: number;
  readonly delay?: number;
  readonly backoff?: boolean;
  readonly shouldRetry?: (error: E, attempt: number) => boolean;
  readonly onRetry?: (error: E, attempt: number) => void;
  readonly transform?: (error: unknown) => E;
}

export function retry<T, E = Error>(fn: () => T, options?: RetryOptions<E>): Result<T, E>;
export function retry<T, E = Error>(fn: () => Promise<T>, options?: RetryOptions<E>): Promise<Result<T, E>>;
```

- **retry** — executes `fn` up to `attempts` times (default: 3). Returns `Result<T, E>` for sync, `Promise<Result<T, E>>` for async. Supports `delay` (ms), exponential `backoff`, `shouldRetry` predicate, `onRetry` callback, and error `transform`.
