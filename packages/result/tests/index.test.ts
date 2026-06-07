import { describe, it } from "node:test";
import assert from "node:assert";
import { Result } from "../src/index.js";

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
    for (const { result, expectOk, expectErr } of cases) {
      it(`isOk=${expectOk}, isErr=${expectErr}`, () => {
        assert.strictEqual(Result.isOk(result), expectOk);
        assert.strictEqual(Result.isErr(result), expectErr);
      });
    }
  });

  describe("unwrap", () => {
    it("returns value for Ok", () => {
      assert.strictEqual(Result.unwrap(Result.ok(5)), 5);
    });
    it("throws for Err", () => {
      assert.throws(() => Result.unwrap(Result.err(new Error("fail"))), /fail/);
    });
  });

  describe("unwrapOr", () => {
    const edgecases: { result: Result<number, string>; fallback: number; expected: number }[] = [
      { result: Result.ok(5), fallback: 99, expected: 5 },
      { result: Result.err("error"), fallback: 99, expected: 99 },
    ];
    for (const { result, fallback, expected } of edgecases) {
      it(`returns ${expected}`, () => {
        assert.strictEqual(Result.unwrapOr(result, fallback), expected);
      });
    }
  });
});
