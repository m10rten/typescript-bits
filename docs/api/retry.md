# Retry

Configurable retry logic for functions that may fail transiently.

```ts
export interface RetryOptions {
  times: number;
  delayMs: number;
  backoff?: (attempt: number) => number;
  predicate?: (error: unknown) => boolean;
}

export function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T>;
```

- **times** — maximum number of attempts.
- **delayMs** — base delay between retries.
- **backoff** — optional custom delay calculator (overrides `delayMs`).
- **predicate** — optional filter to decide whether an error is retryable.
