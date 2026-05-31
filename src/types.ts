/**
 * Generate a union of numbers `0` to `N-1`.
 *
 * @example
 * ```ts
 * import type { Enumerate } from "typescript-bits/types";
 *
 * type Small = Enumerate<4>; // 0 | 1 | 2 | 3
 * ```
 */
export type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

/**
 * Generate a union of numbers from `F` to `T-1`.
 *
 * @example
 * ```ts
 * import type { Range } from "typescript-bits/types";
 *
 * type OneToThree = Range<1, 4>; // 1 | 2 | 3
 * ```
 */
export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
