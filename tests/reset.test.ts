import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Equal, Expect, NotAny } from "./type-utils.js";
import "../src/reset/json.js";
import "../src/reset/fetch.js";
import "../src/reset/array.js";
import "../src/reset/filter.js";
import "../src/reset/map.js";
import "../src/reset/set.js";

describe("reset", () => {
  describe("reset/json", () => {
    it("JSON.parse returns unknown, not any", () => {
      const result = JSON.parse('{"a": 1}');

      const _unknown: Expect<Equal<typeof result, unknown>> = true;
      const _notAny: Expect<NotAny<typeof result>> = true;
      void _unknown;
      void _notAny;

      assert.strictEqual(typeof result, "object");
      assert.ok(result !== null);
    });

    it("JSON.parse with reviver returns unknown", () => {
      const result = JSON.parse("42", (_key, value) => value);
      const _unknown: Expect<Equal<typeof result, unknown>> = true;
      void _unknown;
      assert.strictEqual(result, 42);
    });
  });

  describe("reset/array", () => {
    it("Array.isArray narrows to unknown[]", () => {
      const input: unknown = [1, 2, 3];
      if (Array.isArray(input)) {
        const _narrowed: Expect<Equal<typeof input, unknown[]>> = true;
        void _narrowed;
        assert.ok(Array.isArray(input));
      }
    });

    it("Array.isArray returns false for non-arrays", () => {
      const cases: unknown[] = [null, undefined, "string", 42, {}, true];
      for (const c of cases) {
        assert.strictEqual(Array.isArray(c), false);
      }
    });

    it("new Array() defaults to unknown[]", () => {
      const arr = new Array();
      const _default: Expect<Equal<typeof arr, unknown[]>> = true;
      void _default;
      assert.strictEqual(arr.length, 0);
    });

    it("new Array(...items) infers item types", () => {
      const arr = new Array(1, 2, 3);
      const _inferred: Expect<Equal<typeof arr, number[]>> = true;
      void _inferred;
      assert.deepStrictEqual(arr, [1, 2, 3]);
    });
  });

  describe("reset/filter", () => {
    it("filter with type guard narrows correctly", () => {
      const items: unknown[] = [1, "two", 3, "four"];
      const numbers = items.filter((v): v is number => typeof v === "number");
      const _narrowed: Expect<Equal<typeof numbers, number[]>> = true;
      void _narrowed;
      assert.deepStrictEqual(numbers, [1, 3]);
    });

    it("filter without type guard returns same type", () => {
      const items = [1, 2, 3];
      const filtered = items.filter((v) => v > 1);
      const _same: Expect<Equal<typeof filtered, number[]>> = true;
      void _same;
      assert.deepStrictEqual(filtered, [2, 3]);
    });

    it("filter thisArg accepts unknown", () => {
      const items = [1, 2, 3];
      const ctx: { threshold: number } = { threshold: 1 };
      const filtered = items.filter(function (this: { threshold: number }, v) {
        return v > this.threshold;
      }, ctx as unknown);
      const _filtered: Expect<Equal<typeof filtered, number[]>> = true;
      void _filtered;
      assert.deepStrictEqual(filtered, [2, 3]);
    });
  });

  describe("reset/map", () => {
    it("map transforms types correctly", () => {
      const items = [1, 2, 3];
      const mapped = items.map((v) => String(v));
      const _mapped: Expect<Equal<typeof mapped, string[]>> = true;
      void _mapped;
      assert.deepStrictEqual(mapped, ["1", "2", "3"]);
    });

    it("map thisArg accepts unknown", () => {
      const items = [1, 2, 3];
      const ctx: { multiplier: number } = { multiplier: 10 };
      const mapped = items.map(function (this: { multiplier: number }, v) {
        return v * this.multiplier;
      }, ctx as unknown);
      const _mapped: Expect<Equal<typeof mapped, number[]>> = true;
      void _mapped;
      assert.deepStrictEqual(mapped, [10, 20, 30]);
    });
  });

  describe("reset/set", () => {
    it("new Set() defaults to Set<unknown>", () => {
      const set = new Set();
      const _default: Expect<Equal<typeof set, Set<unknown>>> = true;
      void _default;
      assert.strictEqual(set.size, 0);
    });

    it("new Set(values) infers type from values", () => {
      const set = new Set([1, 2, 3]);
      const _inferred: Expect<Equal<typeof set, Set<number>>> = true;
      void _inferred;
      assert.strictEqual(set.size, 3);
    });

    it("Set forEach thisArg accepts unknown", () => {
      const set = new Set([1, 2, 3]);
      const ctx: { sum: number } = { sum: 0 };
      set.forEach(function (this: { sum: number }, v) {
        this.sum += v;
      }, ctx as unknown);
      assert.strictEqual(ctx.sum, 6);
    });
  });
});
