/**
 * Augment `Array.filter` return type from `any[]` to the narrowed type.
 *
 * @example
 * ```ts
 * import "@typescript-bits/reset/filter";
 *
 * const items: (number | undefined)[] = [1, undefined, 2];
 * const defined: number[] = items.filter((v): v is number => v != null);
 * ```
 */
declare global {
  interface Array<T> {
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S[];
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T[];
  }
}

export {};
