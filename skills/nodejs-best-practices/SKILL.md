---
name: nodejs-best-practices
description: Production-ready Node.js patterns — ESM, native test runner, built-in APIs, async control flow, process management, and security for modern Node.js applications
---

# Node.js Best Practices

Practical, production-ready Node.js patterns for building robust, maintainable server-side applications. Apply these when writing or reviewing Node.js code.

## Module System

### Always Use ESM

```json
{
  "type": "module"
}
```

- Use `import`/`export` syntax throughout — no `require()`.
- Import all Node.js built-ins with the `node:` protocol: `import { readFile } from "node:fs"`.
- Use explicit file extensions in import paths (`.js`, `.ts`, `.mjs`). Never omit extensions.
- Use `import type` / `export type` for type-only imports to keep runtime bundles clean.

### Conditional Exports

Use `package.json` `exports` field for dual ESM/CJS distribution or subpath exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.js"
    }
  }
}
```

### Static Analysis Friendly

- Avoid dynamic `import()` in hot paths — prefer static top-level imports.
- Use `import.meta.url` instead of `__dirname` / `__filename`:

```typescript
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Native Testing

### Use `node:test` and `node:assert`

Prefer Node's built-in test runner over third-party frameworks (Jest, Mocha, Vitest):

```typescript
import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { myModule } from "../src/index.js";

describe("myModule", () => {
  it("handles the basic case", () => {
    assert.strictEqual(myModule(1), 2);
  });
});
```

### Test Structure

- Use `describe` for grouping, `it` for individual test cases.
- Prefer `node:assert/strict` (deepStrictEqual, strictEqual) over the base `node:assert`.
- Use edge-case arrays with `for` loops for repetitive tests:

```typescript
const edgecases = [
  { input: null, expected: "null" },
  { input: undefined, expected: "undefined" },
  { input: "", expected: "empty" },
];
for (const { input, expected } of edgecases) {
  it(`handles ${expected}`, () => {
    assert.strictEqual(myFn(input), expected);
  });
}
```

### Mocking

Use `mock.fn()` and `mock.method()` from `node:test` — avoid external mocking libraries:

```typescript
import { mock } from "node:test";

const fn = mock.fn((x: number) => x * 2);
assert.strictEqual(fn(3), 6);
assert.strictEqual(fn.mock.calls.length, 1);
```

## Async Patterns

### Prefer Promises Over Callbacks

- Use `fs.promises` API over `fs.callback` API.
- Convert callback-based APIs to promises with `util.promisify` when needed.
- Never mix callbacks and promises in the same code path.

### Async Iteration

Use `for await...of` for streams and async generators over `.on("data")` / `.on("end")` patterns:

```typescript
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

async function processLines(filePath: string): Promise<void> {
  const rl = createInterface({ input: createReadStream(filePath) });
  for await (const line of rl) {
    // process line
  }
}
```

### Concurrent Execution

```typescript
// Parallel — no ordering needed
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Sequential — each depends on prior
const a = await fetchA();
const b = await fetchB(a);

// Race with timeout
const result = await Promise.race([
  fetchData(),
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
]);
```

### Avoid Unhandled Rejections

- Always `await` or `.catch()` promises — never leave them dangling.
- Register a global handler for unhandled rejections in applications (not libraries):

```typescript
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});
```

## Error Handling

### Operational vs Programmer Errors

| Type        | Examples                         | Handling                                     |
| ----------- | -------------------------------- | -------------------------------------------- |
| Operational | Network failure, file not found  | Recover, retry, or return safe error to user |
| Programmer  | `undefined` access, invalid args | Crash fast — don't recover                   |

### Structured Error Classes

```typescript
export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly context?: Record<string, unknown>;

  constructor(message: string, code: string, statusCode = 500, context?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}
```

### Result Type for Expected Failures

Use discriminated union `Result` types for expected failures (network, parsing, validation) and reserve `throw` for programmer errors:

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const parsed = parseJSON(input);
if (!parsed.ok) {
  return { ok: false, error: new AppError("Invalid JSON", "PARSE_ERROR", 400) };
}
```

### Always Narrow Caught Errors

```typescript
try {
  await operation();
} catch (err: unknown) {
  if (err instanceof AppError) throw err;
  if (err instanceof SyntaxError) return handleSyntax(err);
  throw new AppError("Unexpected error", "INTERNAL", 500, { cause: err });
}
```

## Process and Environment

### Configuration from Environment

- Read configuration from `process.env` at startup, not inline.
- Validate and coerce environment variables early:

```typescript
function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  port: Number(getEnv("PORT", "3000")),
  nodeEnv: getEnv("NODE_ENV", "development"),
};
```

### Exit Codes

Use meaningful exit codes:

| Code | Meaning                  |
| ---- | ------------------------ |
| 0    | Success                  |
| 1    | General error            |
| 2    | Misuse of shell builtins |
| 126  | Command cannot execute   |
| 127  | Command not found        |
| 130  | Terminated by Ctrl+C     |

### Signal Handling

```typescript
function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000); // force exit after 10s
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
```

## Standard Library First

### Prefer Built-in APIs Over npm Packages

| Need                  | Built-in                     | Instead of                            |
| --------------------- | ---------------------------- | ------------------------------------- |
| HTTP server           | `node:http`                  | express                               |
| File system           | `node:fs` (promises)         | fs-extra                              |
| Path manipulation     | `node:path`                  | path-to-regexp                        |
| URL parsing           | `node:url`                   | urijs                                 |
| Command-line parsing  | `node:util.parseArgs`        | commander, yargs                      |
| Assertions / testing  | `node:assert`, `node:test`   | jest, mocha, chai                     |
| Event system          | `node:events` (EventEmitter) | eventemitter3                         |
| Streaming             | `node:stream` (web streams)  | through2, pump                        |
| Crypto                | `node:crypto`                | bcrypt (use scrypt)                   |
| UUID                  | `node:crypto.randomUUID`     | uuid                                  |
| Environment variables | `process.env`                | dotenv (Node 20+ loads .env natively) |

### When to Add Dependencies

- Only when the built-in API is genuinely insufficient.
- Prefer zero-dependency libraries when possible.
- Evaluate: is the API surface worth the maintenance burden?

### Stream and Buffer

- Use `Buffer.from()` / `Buffer.alloc()` over the `new Buffer()` constructor.
- Use web `ReadableStream` / `WritableStream` APIs in Node 20+ for cross-platform code.

```typescript
import { Buffer } from "node:buffer";
import { TextEncoder, TextDecoder } from "node:util";

const encoded = new TextEncoder().encode("hello");
const decoded = new TextDecoder().decode(encoded);
```

## File System

### Prefer Promises API

```typescript
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";

async function readConfig(path: string): Promise<Config> {
  const content = await readFile(path, "utf-8");
  return JSON.parse(content);
}
```

### Avoid Sync APIs in Production Code

- `readFileSync`, `writeFileSync`, `existsSync` are acceptable in:
  - CLI tools and scripts
  - Startup/initialization (before the server starts)
  - Build-time tooling
- Never use sync calls inside request handlers, event loops, or concurrent operations.

## Security

### Command Injection Prevention

Never pass unsanitized user input to shell commands:

```typescript
// ❌ Dangerous
import { exec } from "node:child_process";
exec(`ls ${userInput}`); // userInput could be "; rm -rf /"

// ✅ Safe — use execFile with arguments array
import { execFile } from "node:child_process";
execFile("ls", [userInput]); // arguments are escaped

// ✅ Safe — use spawn with arguments array
import { spawn } from "node:child_process";
spawn("ls", [userInput]);
```

### Path Traversal Prevention

```typescript
import { resolve, relative } from "node:path";

function safePath(base: string, userPath: string): string {
  const full = resolve(base, userPath);
  if (!full.startsWith(resolve(base))) {
    throw new Error("Path traversal detected");
  }
  return full;
}
```

### Input Validation

- Validate all external input at the boundary (network, files, env).
- Use structured schemas for complex data.
- Never trust `JSON.parse` without validation.

## Event Patterns

### EventEmitter Conventions

- Extend `EventEmitter` for pub/sub objects, not custom listener implementations — unless you need stricter control.
- Use `once()` for one-shot listeners, `on()` for persistent ones.
- Always provide a `Symbol.dispose` or explicit cleanup method:

```typescript
import { EventEmitter } from "node:events";

class MyService extends EventEmitter {
  #cleanup: (() => void)[] = [];

  start(): void {
    const listener = (data: unknown) => this.#onData(data);
    someSource.on("data", listener);
    this.#cleanup.push(() => someSource.off("data", listener));
  }

  [Symbol.dispose](): void {
    for (const cleanup of this.#cleanup) cleanup();
    this.removeAllListeners();
  }
}
```

### Memory Leak Prevention

- Always remove listeners when done — especially in long-lived processes.
- Use the `maxListeners` warning threshold to detect leaks:

```typescript
import { EventEmitter } from "node:events";
const emitter = new EventEmitter();
emitter.setMaxListeners(20); // silence warning if intentional
```

## Performance Patterns

### Avoid Blocking the Event Loop

- Offload CPU-intensive work to worker threads via `node:worker_threads`.
- Use `setImmediate()` to break up synchronous work:

```typescript
function processInBatches(items: big[], batchSize = 1000): void {
  let index = 0;
  function nextBatch(): void {
    const batch = items.slice(index, index + batchSize);
    index += batchSize;
    for (const item of batch) process(item);
    if (index < items.length) setImmediate(nextBatch);
  }
  nextBatch();
}
```

### Pool Resources

Reuse connections, file handles, and workers — don't create/destroy per request:

```typescript
// ❌ Creates new connection per request
app.get("/data", async () => {
  const conn = await createConnection();
  const result = await conn.query("...");
  await conn.close();
  return result;
});

// ✅ Pooled connection
const pool = new ConnectionPool({ max: 10 });
app.get("/data", async () => {
  const conn = await pool.acquire();
  try {
    return await conn.query("...");
  } finally {
    pool.release(conn);
  }
});
```

## CLI and Tooling

### Parse Arguments with `util.parseArgs`

```typescript
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  options: {
    output: { type: "string", short: "o", default: "dist" },
    verbose: { type: "boolean", short: "v", default: false },
  },
  allowPositionals: true,
});
```

### Graceful Exit

- Clean up resources (file handles, network connections) before exit.
- Use `process.on("exit")` for synchronous cleanup only — async cleanup needs `SIGINT`/`SIGTERM` handlers.
- Avoid `process.exit()` in library code.

## Common Mistakes

| Mistake                                              | Fix                                                      |
| ---------------------------------------------------- | -------------------------------------------------------- |
| Using `require()` instead of `import`                | Enable `"type": "module"` in package.json                |
| Omitting file extensions in imports                  | Always add `.js` extension                               |
| Unhandled promise rejections                         | Always `await` or `.catch()`                             |
| Using `fs.readFileSync` in request handlers          | Use `fs.promises.readFile` with `await`                  |
| Shell injection via template strings in `exec`       | Use `execFile` with arguments array                      |
| Assuming `err` is always an `Error` instance         | Narrow with `instanceof Error` or check shape            |
| Not cleaning up EventEmitter listeners               | Track listeners and remove on cleanup/dispose            |
| Using third-party packages for built-in capabilities | Check Node.js docs first — prefer native                 |
| Blocking the event loop with CPU-heavy work          | Offload to worker threads or chunk with `setImmediate`   |
| Missing `await` in `try/catch`                       | The caught error may be a rejected promise, not an Error |
