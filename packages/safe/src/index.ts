import { Result } from "@typescript-bits/result";

/**
 * Wrap throwable code and return a `Result` instead of crashing.
 *
 * @summary Wraps any throwable sync or async operation and returns a `Result` instead of throwing.
 * Smart overload detection handles raw Promises, async functions, and sync functions uniformly through a single `attempt` entry point.
 * An optional `transform` parameter lets you shape caught errors into typed `Err` values before they reach the caller.
 *
 * @example
 * ```ts
 * import { Safe } from "@typescript-bits/safe";
 *
 * const ok = Safe.sync(() => JSON.parse("42"));
 * // ok.ok === true, ok.value === 42
 *
 * const fail = Safe.sync(() => JSON.parse("invalid"));
 * // fail.ok === false, fail.error instanceof SyntaxError
 * ```
 */
export namespace Safe {
  /**
   * Wrap a `Promise` and return `Promise<Result<T, E>>`. Rejections become `Err`, resolutions become `Ok`.
   *
   * @param promise - The promise to wrap
   * @param transform - Optional function to transform the caught error before wrapping as `Err`
   * @returns A `Promise` that always resolves to a `Result`
   */
  export function attempt<T, E = Error>(promise: Promise<T>, transform?: (error: unknown) => E): Promise<Result<T, E>>;

  /**
   * Wrap a synchronous or async function and return a `Result` or `Promise<Result<T, E>>`.
   * Thrown errors become `Err`, returned values become `Ok`.
   *
   * @param fn - The function to execute
   * @param transform - Optional function to transform the caught error before wrapping as `Err`
   * @returns A `Result` for synchronous functions, or a `Promise<Result>` for async functions
   *
   * @example
   * ```ts
   * const r = Safe.attempt(() => JSON.parse("42"));
   * // r.ok === true, r.value === 42
   *
   * const fail = Safe.attempt(() => JSON.parse("invalid"));
   * // fail.ok === false, fail.error instanceof SyntaxError
   * ```
   */
  export function attempt<R, E = Error>(
    fn: () => R,
    transform?: (error: unknown) => E,
  ): [R] extends [never] ? Result<R, E> : [R] extends [Promise<infer U>] ? Promise<Result<U, E>> : Result<R, E>;

  export function attempt<T, E = Error>(
    input: (() => T) | Promise<T>,
    transform?: (error: unknown) => E,
  ): Result<T, E> | Promise<Result<T, E>> {
    if (input instanceof Promise) {
      return wrapAsync(input, transform);
    }

    try {
      const result = input();
      if (result instanceof Promise) {
        return wrapAsync(result, transform);
      }
      return Result.ok(result);
    } catch (error) {
      return Result.err(transform ? transform(error) : (error as E));
    }
  }

  /**
   * Execute a synchronous function and return a `Result`. Thrown errors become `Err`, returned values become `Ok`.
   *
   * @param fn - The synchronous function to execute
   * @param transform - Optional function to transform the caught error before wrapping as `Err`
   * @returns `Ok<T>` on success, `Err<E>` on thrown error
   *
   * @example
   * ```ts
   * const r = Safe.sync(() => JSON.parse("42"));
   * // r.ok === true, r.value === 42
   *
   * const fail = Safe.sync(() => JSON.parse("invalid"));
   * // fail.ok === false, fail.error instanceof SyntaxError
   * ```
   */
  export function sync<T, E = Error>(fn: () => T, transform?: (error: unknown) => E): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(transform ? transform(error) : (error as E));
    }
  }

  /**
   * Execute a `Promise` or an async function and return `Promise<Result<T, E>>`.
   * Rejections become `Err`, resolved values become `Ok`.
   *
   * @param fn - A `Promise` or a function returning a `Promise`
   * @param transform - Optional function to transform the caught error before wrapping as `Err`
   * @returns A `Promise` that always resolves to a `Result`
   *
   * @example
   * ```ts
   * const r = await Safe.async(() => fetch("https://example.com/data").then(res => res.json()));
   * if (r.ok) console.log(r.value);
   * else console.error(r.error);
   * ```
   */
  export function async<T, E = Error>(
    fn: Promise<T> | (() => Promise<T>),
    transform?: (error: unknown) => E,
  ): Promise<Result<T, E>> {
    const cb = typeof fn === "function" ? fn() : fn;
    return wrapAsync(cb, transform);
  }
}

async function wrapAsync<T, E>(promise: Promise<T>, transform?: (error: unknown) => E): Promise<Result<T, E>> {
  try {
    return Result.ok(await promise);
  } catch (error) {
    return Result.err(transform ? transform(error) : (error as E));
  }
}
