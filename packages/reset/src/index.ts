/**
 * Global ambient type augmentations that tighten TypeScript's standard library types.
 *
 * Patches applied:
 * - `Array.isArray` — narrows `readonly T[]` correctly instead of widening to `any[]`
 * - `JSON.parse` — returns `unknown` instead of `any`
 * - `Array.prototype.filter` / `Array.prototype.map` — stricter callback types
 * - `Set` — tightens iteration and constructor overloads
 * - `fetch` `Body.json()` — returns `unknown` instead of `any`
 *
 * Import this package once at your program entry point. There is nothing to call — types are applied globally via module augmentation.
 *
 * @summary A collection of global ambient type augmentations that close long-standing gaps in TypeScript's standard library. It patches `Array.isArray` narrowing for readonly arrays, changes `JSON.parse` and `fetch` `Body.json()` to return `unknown` instead of `any`, and tightens callback inference for `Array.prototype.filter`, `Array.prototype.map`, and `Set`. Import once at your entry point and the stricter types apply project-wide with zero runtime cost.
 *
 * @example
 * ```ts
 * import "@typescript-bits/reset";
 *
 * // Array.isArray now narrows readonly arrays correctly
 * const xs: readonly number[] | string = [1, 2, 3];
 * if (Array.isArray(xs)) {
 *   xs; // readonly number[] — not widened to any[]
 * }
 * ```
 */
import "./array.js";
import "./filter.js";
import "./map.js";
import "./json.js";
import "./fetch.js";
import "./set.js";
