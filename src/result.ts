/**
 * A discriminated union for explicit success-or-failure.
 *
 * @example
 * ```ts
 * import { Result } from "typescript-bits/result";
 *
 * const ok = Result.ok(42);
 * const err = Result.err(new Error("fail"));
 *
 * if (ok.ok) console.log(ok.value); // 42
 * ```
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;

/**
 * The success variant of {@link Result}.
 *
 * @example
 * ```ts
 * import { Result } from "typescript-bits/result";
 *
 * const ok = Result.ok(10);
 * console.log(ok.value); // 10
 * ```
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * The failure variant of {@link Result}.
 *
 * @example
 * ```ts
 * import { Result } from "typescript-bits/result";
 *
 * const err = Result.err("something broke");
 * console.log(err.error); // "something broke"
 * ```
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

export namespace Result {
  /**
   * Wrap a value as `Ok`.
   *
   * @example
   * ```ts
   * Result.ok(42); // { ok: true, value: 42 }
   * ```
   */
  export function ok<T>(value: T): Ok<T> {
    return { ok: true, value };
  }

  /**
   * Wrap an error as `Err`.
   *
   * @example
   * ```ts
   * Result.err("fail"); // { ok: false, error: "fail" }
   * ```
   */
  export function err<E>(error: E): Err<E> {
    return { ok: false, error };
  }

  /**
   * Narrow a `Result` to `Ok`.
   *
   * @example
   * ```ts
   * const r: Result<number, string> = Result.ok(5);
   * if (Result.isOk(r)) console.log(r.value); // 5
   * ```
   */
  export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.ok;
  }

  /**
   * Narrow a `Result` to `Err`.
   *
   * @example
   * ```ts
   * const r: Result<number, string> = Result.err("fail");
   * if (Result.isErr(r)) console.log(r.error); // "fail"
   * ```
   */
  export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return !result.ok;
  }

  /**
   * Unwrap an `Ok` value or throw the error.
   *
   * @example
   * ```ts
   * Result.unwrap(Result.ok(42)); // 42
   * Result.unwrap(Result.err("fail")); // throws "fail"
   * ```
   */
  export function unwrap<T, E>(result: Result<T, E>): T {
    if (result.ok) return result.value;
    throw result.error;
  }

  /**
   * Unwrap an `Ok` value or return a fallback.
   *
   * @example
   * ```ts
   * Result.unwrapOr(Result.ok(42), 0); // 42
   * Result.unwrapOr(Result.err("fail"), 0); // 0
   * ```
   */
  export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
    return result.ok ? result.value : fallback;
  }
}
