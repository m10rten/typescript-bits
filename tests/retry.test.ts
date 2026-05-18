import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { retry, type RetryOptions } from "../src/retry.js";
import { Result } from "../src/result.js";

describe("retry", () => {
  describe("sync", () => {
    it("returns ok on first success", () => {
      const result = retry(() => 42);
      assert.ok(Result.isOk(result));
      assert.equal(Result.unwrap(result), 42);
    });

    it("retries on failure and returns ok on subsequent attempt", () => {
      let attempt = 0;
      const fn = () => {
        attempt++;
        if (attempt < 3) throw new Error("fail");
        return "success";
      };
      const result = retry(fn, { attempts: 3 });
      assert.ok(Result.isOk(result));
      assert.equal(Result.unwrap(result), "success");
    });

    it("returns err after exhausting all attempts", () => {
      const fn = () => {
        throw new Error("always fails");
      };
      const result = retry(fn, { attempts: 2 });
      assert.ok(Result.isErr(result));
    });

    it("calls onRetry before each retry", () => {
      let retryCount = 0;
      const errors: Error[] = [];
      const fn = () => {
        retryCount++;
        if (retryCount < 3) throw new Error(`fail-${retryCount}`);
        return "ok";
      };
      const options: RetryOptions = {
        attempts: 3,
        onRetry: (error) => errors.push(error as Error),
      };
      retry(fn, options);
      assert.equal(errors.length, 2);
      assert.equal(errors[0]?.message, "fail-1");
      assert.equal(errors[1]?.message, "fail-2");
    });

    it("respects shouldRetry predicate", () => {
      let attempt = 0;
      const fn = () => {
        attempt++;
        throw new Error("non-retryable");
      };
      const result = retry(fn, {
        attempts: 3,
        shouldRetry: () => false,
      });
      assert.ok(Result.isErr(result));
      assert.equal(attempt, 1);
    });

    it("uses transform to customize error type", () => {
      const fn = () => {
        throw new Error("raw");
      };
      const result = retry(fn, {
        attempts: 1,
        transform: (e) => new TypeError((e as Error).message),
      });
      assert.ok(Result.isErr(result));
      assert.ok(result.error instanceof TypeError);
    });

    it("returns correct result type for different return types", () => {
      const edgecases: { fn: () => unknown; expected: unknown }[] = [
        { fn: () => "string", expected: "string" },
        { fn: () => 123, expected: 123 },
        { fn: () => ({ a: 1 }), expected: { a: 1 } },
        { fn: () => true, expected: true },
      ];

      for (const { fn, expected } of edgecases) {
        const result = retry(fn);
        assert.ok(Result.isOk(result));
        assert.deepEqual(result.value, expected);
      }
    });
  });

  describe("async", () => {
    it("returns ok on first success", async () => {
      const result = await retry(async () => 42);
      assert.ok(Result.isOk(result));
      assert.equal(Result.unwrap(result), 42);
    });

    it("retries on failure and returns ok on subsequent attempt", async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 3) throw new Error("fail");
        return "success";
      };
      const result = await retry(fn, { attempts: 3 });
      assert.ok(Result.isOk(result));
      assert.equal(Result.unwrap(result), "success");
    });

    it("returns err after exhausting all attempts", async () => {
      const fn = async () => {
        throw new Error("always fails");
      };
      const result = await retry(fn, { attempts: 2 });
      assert.ok(Result.isErr(result));
    });

    it("calls onRetry before each retry", async () => {
      let retryCount = 0;
      const errors: Error[] = [];
      const fn = async () => {
        retryCount++;
        if (retryCount < 3) throw new Error(`fail-${retryCount}`);
        return "ok";
      };
      const options: RetryOptions = {
        attempts: 3,
        onRetry: (error) => errors.push(error as Error),
      };
      await retry(fn, options);
      assert.equal(errors.length, 2);
    });

    it("respects shouldRetry predicate", async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        throw new Error("non-retryable");
      };
      const result = await retry(fn, {
        attempts: 3,
        shouldRetry: () => false,
      });
      assert.ok(Result.isErr(result));
      assert.equal(attempt, 1);
    });

    it("returns correct result type for different return types", async () => {
      const edgecases: { fn: () => Promise<unknown>; expected: unknown }[] = [
        { fn: async () => "string", expected: "string" },
        { fn: async () => 123, expected: 123 },
        { fn: async () => ({ a: 1 }), expected: { a: 1 } },
      ];

      for (const { fn, expected } of edgecases) {
        const result = await retry(fn);
        assert.ok(Result.isOk(result));
        assert.deepEqual(result.value, expected);
      }
    });
  });

  describe("delay", () => {
    it("waits between retries when delay is set", async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 2) throw new Error("fail");
        return "ok";
      };
      const start = Date.now();
      await retry(fn, { attempts: 3, delay: 50 });
      const elapsed = Date.now() - start;
      assert.ok(elapsed >= 45, `Expected delay >= 45ms, got ${elapsed}ms`);
    });

    it("applies exponential backoff when enabled", async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 3) throw new Error("fail");
        return "ok";
      };
      const start = Date.now();
      await retry(fn, { attempts: 3, delay: 30, backoff: true });
      const elapsed = Date.now() - start;
      // 30ms + 60ms = 90ms minimum
      assert.ok(elapsed >= 80, `Expected backoff delay >= 80ms, got ${elapsed}ms`);
    });
  });
});
