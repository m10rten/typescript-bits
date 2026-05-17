# Result

A discriminated union for explicit error handling without exceptions.

```ts
export type Result<T, E = Error> = Ok<T> | Err<E>;

export namespace Result {
  export function ok<T>(value: T): Ok<T>;
  export function err<E>(error: E): Err<E>;
  export function isOk<T, E>(result: Result<T, E>): result is Ok<T>;
  export function isErr<T, E>(result: Result<T, E>): result is Err<E>;
  export function unwrap<T, E>(result: Result<T, E>): T;
  export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T;
}
```

- **ok** — creates a success variant.
- **err** — creates an error variant.
- **isOk / isErr** — type guards for narrowing.
- **unwrap** — returns the value or throws the error.
- **unwrapOr** — returns the value or a fallback.
