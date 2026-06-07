/**
 * Augment `Array.map` return type to `U[]` (instead of `any[]`).
 *
 * @example
 * ```ts
 * import "@typescript-bits/reset/map";
 *
 * const nums: number[] = [1, 2].map((x) => x * 2);
 * ```
 */
declare global {
  interface Array<T> {
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
  }
}

export {};
