import { describe, it } from "node:test";
import assert from "node:assert";
import { Result } from "../src/result.js";

describe("Result", () => {
  describe("ok / err", () => {
    it("creates Ok and Err variants", () => {
      const r1 = Result.ok(42);
      const r2 = Result.err(new Error("fail"));
      assert.strictEqual(r1.ok, true);
      assert.strictEqual(r1.value, 42);
      assert.strictEqual(r2.ok, false);
      assert.strictEqual(r2.error.message, "fail");
    });
  });

  describe("isOk / isErr", () => {
    const cases: { result: Result<number, Error>; expectOk: boolean; expectErr: boolean }[] = [
      { result: Result.ok(1), expectOk: true, expectErr: false },
      { result: Result.err(new Error("x")), expectOk: false, expectErr: true },
    ];

    for (const c of cases) {
      it(`isOk=${c.expectOk}, isErr=${c.expectErr} for ${c.result.ok ? "Ok" : "Err"}`, () => {
        assert.strictEqual(Result.isOk(c.result), c.expectOk);
        assert.strictEqual(Result.isErr(c.result), c.expectErr);
      });
    }
  });

  describe("unwrap", () => {
    it("returns value for Ok", () => {
      assert.strictEqual(Result.unwrap(Result.ok("hello")), "hello");
    });

    it("throws for Err", () => {
      const e = new Error("boom");
      assert.throws(() => Result.unwrap(Result.err(e)), e);
    });
  });

  describe("unwrapOr", () => {
    const cases: { result: Result<number, Error>; fallback: number; expected: number }[] = [
      { result: Result.ok(5), fallback: 0, expected: 5 },
      { result: Result.err(new Error("x")), fallback: 99, expected: 99 },
    ];

    for (const c of cases) {
      it(`returns ${c.expected}`, () => {
        assert.strictEqual(Result.unwrapOr(c.result, c.fallback), c.expected);
      });
    }
  });
});
