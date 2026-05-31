/**
 * Augment `Body.json()` to return `Promise<unknown>` instead of `Promise<any>`.
 *
 * @example
 * ```ts
 * import "typescript-bits/reset/fetch";
 *
 * const res = await fetch("https://example.com/data");
 * const data: unknown = await res.json();
 * ```
 */
declare global {
  interface Body {
    json(): Promise<unknown>;
  }
}

export {};
