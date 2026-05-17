# Safe

A try-catch wrapper that returns a `Result` instead of throwing.

```ts
export namespace Safe {
  export function attempt<T, E = Error>(
    fn: () => T,
    transform?: (error: unknown) => E,
  ): T extends Promise<infer U> ? Promise<Result<U, E>> : Result<T, E>;

  export function attempt<T, E = Error>(promise: Promise<T>, transform?: (error: unknown) => E): Promise<Result<T, E>>;

  export function sync<T, E = Error>(fn: () => T, transform?: (error: unknown) => E): Result<T, E>;

  export function async<T, E = Error>(fn: () => Promise<T>, transform?: (error: unknown) => E): Promise<Result<T, E>>;
}
```

- **attempt** — accepts a sync/async function or plain `Promise`; returns `Result` for sync, `Promise<Result>` for async.
- **sync** — sync-only, returns `Result` directly.
- **async** — async function-only, returns `Promise<Result>`.
- **transform** — optional mapper to convert raw errors into a typed `E`.
