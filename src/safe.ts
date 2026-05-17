import { Result } from "./result.js";

export namespace Safe {
  export function attempt<T, E = Error>(promise: Promise<T>, transform?: (error: unknown) => E): Promise<Result<T, E>>;

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

  export function sync<T, E = Error>(fn: () => T, transform?: (error: unknown) => E): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(transform ? transform(error) : (error as E));
    }
  }

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
