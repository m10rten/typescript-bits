/**
 * Augment `Array.isArray` to narrow to `unknown[]`.
 *
 * @example
 * ```ts
 * import "@typescript-bits/reset/array";
 *
 * Array.isArray([1, 2]); // narrowed to unknown[]
 * ```
 */
declare global {
  interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[];
  }
  interface ArrayConstructor {
    new <T = unknown>(...items: T[]): T[];
  }
}

export {};
