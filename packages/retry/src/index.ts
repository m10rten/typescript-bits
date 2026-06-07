import { Result } from "@typescript-bits/result";
import { Safe } from "@typescript-bits/safe";

/**
 * Configuration for {@link retry}.
 *
 * @example
 * ```ts
 * import { retry } from "@typescript-bits/retry";
 *
 * const result = retry(() => {
 *   return Math.random() > 0.5 ? "ok" : "fail";
 * }, { attempts: 5, delay: 100, backoff: true });
 * ```
 */
export interface RetryOptions<E = unknown> {
  /** Maximum number of retry attempts (default: 3) */
  readonly attempts?: number;
  /** Delay in ms between retries (default: 0) */
  readonly delay?: number;
  /** Whether delay should increase exponentially (default: false) */
  readonly backoff?: boolean;
  /** Optional predicate to determine if an error is retryable (default: retry all errors) */
  readonly shouldRetry?: (error: E, attempt: number) => boolean;
  /** Optional callback invoked before each retry attempt */
  readonly onRetry?: (error: E, attempt: number) => void;
  /** Optional error transform (default: identity — error passes through as-is) */
  readonly transform?: (error: unknown) => E;
}

/**
 * Retry a synchronous operation with configurable backoff.
 *
 * @example
 * ```ts
 * import { retry } from "@typescript-bits/retry";
 *
 * const result = retry(() => {
 *   const ok = Math.random() > 0.7;
 *   if (!ok) throw new Error("transient");
 *   return "done";
 * }, { attempts: 5, delay: 50, backoff: true, shouldRetry: () => true });
 *
 * if (result.ok) console.log(result.value);
 * ```
 */
export function retry<T, E = unknown>(fn: () => T, options?: RetryOptions<E>): Result<T, E>;

/**
 * Retry an async operation with configurable backoff.
 *
 * @example
 * ```ts
 * import { retry } from "@typescript-bits/retry";
 *
 * const result = await retry(async () => {
 *   const res = await fetch("https://api.example.com/data");
 *   if (!res.ok) throw new Error("fetch failed");
 *   return res.json();
 * }, { attempts: 3, delay: 200, backoff: true });
 * ```
 */
export function retry<T, E = unknown>(fn: () => Promise<T>, options?: RetryOptions<E>): Promise<Result<T, E>>;

export function retry<T, E = unknown>(
  fn: () => T | Promise<T>,
  options?: RetryOptions<E>,
): Result<T, E> | Promise<Result<T, E>> {
  const maxAttempts = options?.attempts ?? 3;
  const delay = options?.delay ?? 0;
  const backoff = options?.backoff ?? false;
  const shouldRetry = options?.shouldRetry ?? (() => true);
  const onRetry = options?.onRetry;
  const transform = options?.transform ?? ((e: unknown) => e as unknown as E);

  const getDelay = (attempt: number): number => (backoff ? delay * 2 ** (attempt - 1) : delay);

  const firstResult = Safe.attempt(fn, transform) as Result<T, E> | Promise<Result<T, E>>;

  if (isPromise(firstResult)) {
    return retryAsync(firstResult, fn as () => Promise<T>, maxAttempts, shouldRetry, onRetry, getDelay, transform);
  }

  if (firstResult.ok) {
    return Result.ok(firstResult.value);
  }

  return retrySync(firstResult, fn, maxAttempts, shouldRetry, onRetry, getDelay, transform);
}

function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise;
}

function retrySync<T, E>(
  firstResult: Result<T, E>,
  fn: () => T | Promise<T>,
  maxAttempts: number,
  shouldRetry: (error: E, attempt: number) => boolean,
  onRetry: ((error: E, attempt: number) => void) | undefined,
  getDelay: (attempt: number) => number,
  transform: (error: unknown) => E,
): Result<T, E> {
  if (firstResult.ok) return firstResult;

  let lastError = firstResult.error;
  for (let attempt = 2; attempt <= maxAttempts; attempt++) {
    if (!shouldRetry(lastError, attempt - 1)) return Result.err(lastError);
    onRetry?.(lastError, attempt - 1);

    const wait = getDelay(attempt - 1);
    if (wait > 0) {
      const start = Date.now();
      while (Date.now() - start < wait) {
        // busy wait for sync
      }
    }

    const attemptResult = Safe.sync(fn, transform);
    if (attemptResult.ok) {
      if (isPromise(attemptResult.value)) return Result.err(lastError);
      return Result.ok(attemptResult.value);
    }
    lastError = attemptResult.error;
  }

  return Result.err(lastError);
}

async function retryAsync<T, E>(
  firstPromise: Promise<Result<T, E>>,
  fn: () => Promise<T>,
  maxAttempts: number,
  shouldRetry: (error: E, attempt: number) => boolean,
  onRetry: ((error: E, attempt: number) => void) | undefined,
  getDelay: (attempt: number) => number,
  transform: (error: unknown) => E,
): Promise<Result<T, E>> {
  const firstAttempt = await firstPromise;
  if (firstAttempt.ok) return firstAttempt;

  let lastError = firstAttempt.error;
  for (let attempt = 2; attempt <= maxAttempts; attempt++) {
    if (!shouldRetry(lastError, attempt - 1)) return Result.err(lastError);
    onRetry?.(lastError, attempt - 1);

    const wait = getDelay(attempt - 1);
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }

    const attemptResult = await Safe.async(fn, transform);
    if (attemptResult.ok) return attemptResult;
    lastError = attemptResult.error;
  }

  return Result.err(lastError);
}
