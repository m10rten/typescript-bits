import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Safe } from "../src/safe.js";
import { Result } from "../src/result.js";

describe("safe", () => {
  describe("Safe.attempt", () => {
    it("returns Ok for a successful sync function", () => {
      const r = Safe.attempt(() => 42);
      assert(Result.isOk(r));
      assert.equal(r.value, 42);
    });

    it("returns Err for a throwing sync function", () => {
      const r = Safe.attempt(() => {
        throw new Error("boom");
      });
      assert(Result.isErr(r));
      assert.equal(r.error.message, "boom");
    });

    it("returns Promise<Result> for an async function", async () => {
      const r = await Safe.attempt(async () => 42);
      assert(Result.isOk(r));
      assert.equal(r.value, 42);
    });

    it("returns Promise<Result> for a plain Promise", async () => {
      const r = await Safe.attempt(Promise.resolve(42));
      assert(Result.isOk(r));
      assert.equal(r.value, 42);
    });

    it("returns Err for a rejecting Promise", async () => {
      const r = await Safe.attempt(Promise.reject(new Error("fail")));
      assert(Result.isErr(r));
      assert.equal(r.error.message, "fail");
    });

    it("applies transform to sync errors", () => {
      const r = Safe.attempt(
        () => {
          throw new Error("raw");
        },
        () => new TypeError("wrapped"),
      );
      assert(Result.isErr(r));
      assert(r.error instanceof TypeError);
      assert.equal(r.error.message, "wrapped");
    });

    it("applies transform to async errors", async () => {
      const r = await Safe.attempt(
        async () => {
          throw new Error("raw");
        },
        () => new TypeError("wrapped"),
      );
      assert(Result.isErr(r));
      assert(r.error instanceof TypeError);
    });
  });

  describe("Safe.sync", () => {
    it("returns Ok for success", () => {
      const r = Safe.sync(() => "hello");
      assert(Result.isOk(r));
      assert.equal(r.value, "hello");
    });

    it("returns Err for thrown error", () => {
      const r = Safe.sync(() => {
        throw new Error("oops");
      });
      assert(Result.isErr(r));
      assert.equal(r.error.message, "oops");
    });

    it("applies transform", () => {
      const r = Safe.sync(
        () => {
          throw new Error("raw");
        },
        (e) => `transformed: ${e}`,
      );
      assert(Result.isErr(r));
      assert.equal(r.error, "transformed: Error: raw");
    });
  });

  describe("Safe.async", () => {
    it("returns Ok for resolved promise", async () => {
      const r = await Safe.async(async () => 123);
      assert(Result.isOk(r));
      assert.equal(r.value, 123);
    });

    it("returns Err for rejected promise", async () => {
      const r = await Safe.async(async () => {
        throw new Error("async fail");
      });
      assert(Result.isErr(r));
      assert.equal(r.error.message, "async fail");
    });

    it("applies transform", async () => {
      const r = await Safe.async(
        async () => {
          throw new Error("raw");
        },
        () => "custom error",
      );
      assert(Result.isErr(r));
      assert.equal(r.error, "custom error");
    });
  });
});
