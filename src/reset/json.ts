/**
 * Augment `JSON.parse` to return `unknown` instead of `any`.
 *
 * @example
 * ```ts
 * import "typescript-bits/reset/json";
 *
 * const data: unknown = JSON.parse("42");
 * ```
 */
declare global {
  interface JSON {
    parse(text: string, reviver?: (key: string, value: unknown) => unknown): unknown;
  }
}

export {};
