// ===================================================================
// Tests for nested subpath exports across scoped packages
// ===================================================================

// Test 1: Scoped package with subpath → @my-example-test/core/result
import { Result } from "@my-example-test/core/result";
console.log("✓ @my-example-test/core/result → Result imported");

// Test 2: Scoped package with subpath → @my-example-test/core/error
import { AppError } from "@my-example-test/core/error";
console.log("✓ @my-example-test/core/error  → AppError imported");

// Test 3: Scoped package main entry → @my-example-test/core
import * as Core from "@my-example-test/core";
console.log("✓ @my-example-test/core         →", Object.keys(Core).join(", "));

// Test 4: Scoped package with subpath → @my-example-test/utils/string
import { capitalize } from "@my-example-test/utils/string";
console.log("✓ @my-example-test/utils/string  → capitalize imported");

// Test 5: Scoped package with subpath → @my-example-test/utils/collection
import { chunk } from "@my-example-test/utils/collection";
console.log("✓ @my-example-test/utils/collection → chunk imported");

// Test 6: Scoped package main entry → @my-example-test/utils
import { sleep } from "@my-example-test/utils";
console.log("✓ @my-example-test/utils         → sleep imported");

// Test 7: Cross-module scoped package (api depends on core + utils)
import { fetchData } from "@my-example-test/api";
console.log("✓ @my-example-test/api           → fetchData imported");

// Test 8: Full root package subpath exports
import * as Full from "my-example-test";
console.log("✓ my-example-test (full)         →", Object.keys(Full).join(", "));

// Test 9: Root package subpath → my-example-test/core/result
import { Result as RootResult } from "my-example-test/core/result";
console.log("✓ my-example-test/core/result    → Result imported");

// Test 10: Root package subpath → my-example-test/utils/string
import { capitalize as RootCapitalize } from "my-example-test/utils/string";
console.log("✓ my-example-test/utils/string   → capitalize imported");

// ===================================================================
// Smoke tests
// ===================================================================

// Result from subpath works
const ok = Result.ok(42);
console.assert(ok.isOk(), "Result.ok().isOk()");
console.assert(ok.unwrap() === 42, "Result.ok(42).unwrap() === 42");

// AppError from subpath works
const err = new AppError("test", "ERR_TEST");
console.assert(err instanceof AppError, "AppError is instanceof AppError");
console.assert(err.code === "ERR_TEST", "AppError.code === 'ERR_TEST'");

// capitalize from subpath works
console.assert(capitalize("hello") === "Hello", "capitalize('hello') === 'Hello'");

// chunk from subpath works
console.assert(chunk([1, 2, 3, 4], 2).length === 2, "chunk([1,2,3,4], 2).length === 2");

// Cross-module result type — fetchData returns Result
// (skip runtime call to avoid network dependency)

console.log("\n✅ All nested subpath tests passed");
