/**
 * Augment `Set` constructor and `forEach` with better types.
 *
 * @example
 * ```ts
 * import "typescript-bits/reset/set";
 *
 * const set = new Set([1, 2, 3]);
 * set.forEach((v) => console.log(v)); // v is number (not any)
 * ```
 */
declare global {
  interface SetConstructor {
    new <T = unknown>(values?: readonly T[]): Set<T>;
  }
  interface Set<T> {
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void;
  }
}

export {};
