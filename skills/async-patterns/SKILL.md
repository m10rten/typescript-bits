---
name: async-patterns
description: Production-ready async patterns — concurrency control, cancellation, retry, streams, queues, error handling, and anti-patterns for robust asynchronous TypeScript
---

# Async Patterns

Practical async patterns for building reliable asynchronous systems. These are language-level patterns — they apply in any JavaScript/TypeScript environment (browser, server, edge).

## Concurrency Control

Choosing the right concurrency primitive depends on error tolerance and ordering needs:

| Pattern              | Short-circuits on | Settles when                 | Use case                              |
| -------------------- | ----------------- | ---------------------------- | ------------------------------------- |
| `Promise.all`        | First rejection   | All fulfill or first rejects | All must succeed; fail-fast           |
| `Promise.allSettled` | Never             | All settle                   | Fire-and-forget; collect all outcomes |
| `Promise.race`       | First settlement  | First settlement             | Timeouts, earliest response wins      |
| `Promise.any`        | First fulfillment | First fulfills or all reject | Redundancy — any success suffices     |

```ts
// Promise.all — all-or-nothing, fail-fast
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);

// Promise.allSettled — partial success acceptable
const results = await Promise.allSettled([syncToA(data), syncToB(data)]);
const failures = results.filter((r) => r.status === "rejected");

// Promise.race — timeout
const data = await Promise.race([fetchData(), rejectAfter(5000)]);

// Promise.any — fastest success wins
const response = await Promise.any([fetchFrom("us-east"), fetchFrom("eu-west"), fetchFrom("ap-southeast")]);
```

## Sequential vs Parallel Execution

### Sequential (series)

Each operation waits for the previous. Use when operations depend on prior results.

```ts
async function sequential<T, R>(items: T[], fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (const [i, item] of items.entries()) results.push(await fn(item, i));
  return results;
}
```

### Parallel (unbounded)

All operations start immediately. Use when operations are independent.

```ts
const results = await Promise.all(items.map((item) => process(item)));
```

**Warning:** Unbounded parallelism can overwhelm resources (file handles, DB connections, memory).

### Limited Concurrency (bounded)

Controls how many operations run simultaneously:

```ts
async function mapConcurrent<T, R>(items: T[], fn: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i]);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
```

| Strategy   | Throughput | Resource use | Ordering  |
| ---------- | ---------- | ------------ | --------- |
| Sequential | Lowest     | Lowest       | Preserved |
| Parallel   | Highest    | Highest      | Preserved |
| Concurrent | Tuned      | Tuned        | Preserved |

## Cancellation

### AbortController / AbortSignal

The standard cancellation primitive (Node 15+, browser). Accept `AbortSignal` in all async functions that can be cancelled.

```ts
function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), 5000);
  signal?.addEventListener("abort", () => controller.abort(signal.reason));
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
}
```

### Reusable Timeout

```ts
function rejectAfter(ms: number, message = "Operation timed out"): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}
```

### Propagation Rules

- `AbortSignal` flows **down** the call stack — pass it to every async sub-operation.
- `signal.throwIfAborted()` between steps for immediate response.
- Never reuse an `AbortController` — create one per operation or per group.
- Link signals for composite cancellation (parent + child):

```ts
function linkSignals(...signals: AbortSignal[]): AbortController {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller;
}
```

### AbortSignal.timeout / AbortSignal.any

`AbortSignal.timeout(ms)` (Node 19+) replaces manual timeout controllers:

```ts
const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
```

`AbortSignal.any([s1, s2])` (Node 20+) composes signals for composite cancellation:

```ts
const combined = AbortSignal.any([parentSignal, AbortSignal.timeout(5000)]);
await fetch(url, { signal: combined });
```

## Retry & Backoff

Retry transient failures only — never retry 4xx client errors, only 5xx, network errors, and timeouts.

```ts
type RetryConfig = {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  jitter?: boolean;
};

async function retryWithBackoff<T>(fn: (attempt: number) => Promise<T>, config: RetryConfig): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      if (attempt === config.maxRetries) break;
      await delay(calculateBackoff(attempt, config));
    }
  }
  throw lastError;
}
```

### Backoff Algorithms

| Strategy          | Formula                            | Characteristics            |
| ----------------- | ---------------------------------- | -------------------------- |
| Fixed             | `delay`                            | Simple but thundering herd |
| Linear            | `delay * attempt`                  | Predictable, slow growth   |
| Exponential       | `delay * 2^attempt`                | Industry standard          |
| Exponential + cap | `min(delay * 2^attempt, maxDelay)` | Prevents unbounded wait    |
| Jitter            | `random(0, cappedDelay)`           | Spreads retries, herd-safe |

```ts
function calculateBackoff(attempt: number, config: RetryConfig): number {
  const exponential = Math.min(config.baseDelay * 2 ** attempt, config.maxDelay);
  return config.jitter ? Math.random() * exponential : exponential;
}
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### Circuit Breaker (Concept)

- **Closed** — normal operation, calls pass through.
- **Open** — failures exceed threshold; calls fail immediately.
- **Half-open** — after cooldown, one test call determines whether to close or re-open.

### Retry Decision Matrix

| Error type              | Retry? | Notes                         |
| ----------------------- | ------ | ----------------------------- |
| Network timeout         | Yes    | Transient                     |
| HTTP 503 (Unavailable)  | Yes    | Back off                      |
| HTTP 429 (Rate Limited) | Yes    | Use `Retry-After` header      |
| HTTP 4xx                | No     | Client error, will fail again |
| HTTP 5xx                | Yes    | May be transient              |
| Parse/validation error  | No     | Data is bad                   |

## Streams

### Async Iteration Over Streams

Prefer `for await...of` over event listeners for stream consumption:

```ts
async function collectStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return new TextDecoder().decode(Buffer.concat(chunks as any));
}
```

### Backpressure

Backpressure prevents a fast producer from overwhelming a slow consumer.

- **Push-based** (events, unbuffered streams) — producer emits regardless of consumer readiness. Risk: memory exhaustion.
- **Pull-based** (async iterables, `reader.read()`) — consumer requests when ready. Inherent backpressure.

### Transform Stream

Process chunks with controlled concurrency:

```ts
async function* transformStream<T, R>(
  source: AsyncIterable<T>,
  transform: (chunk: T) => Promise<R>,
  concurrency = 1,
): AsyncGenerator<R> {
  const pending: Promise<R>[] = [];
  for await (const chunk of source) {
    pending.push(transform(chunk));
    if (pending.length >= concurrency) {
      yield await Promise.race(pending);
      pending.splice(0, 1);
    }
  }
  for (const result of pending) yield result;
}
```

## Deferred Pattern

A deferred promise is a promise with externally controlled resolve/reject. Useful for bridging callback APIs or event-driven logic.

```ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: Deferred<T>["resolve"];
  let reject!: Deferred<T>["reject"];
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
```

**Note:** `Promise.withResolvers()` (ES2024) makes deferred a native one-liner:

```ts
const { promise, resolve, reject } = Promise.withResolvers<T>();
```

### When to Use Deferred

- Wrapping callback-based APIs into promises
- One-shot event-to-promise conversion
- Coordination primitives (latch, barrier)

**Avoid** the deferred antipattern — don't use deferred when you already have a promise API:

```ts
// ❌ Unnecessary deferred
function fetchData(): Promise<Data> {
  const d = deferred<Data>();
  fetch("/api/data")
    .then((r) => r.json())
    .then(d.resolve)
    .catch(d.reject);
  return d.promise;
}
// ✅ Direct return
function fetchData(): Promise<Data> {
  return fetch("/api/data").then((r) => r.json());
}
```

## Async Queue

Coordinates producers (adding work) and consumers (processing work) without shared mutable state.

```ts
type AsyncQueue<T> = {
  push(item: T): void;
  pushMany(items: T[]): void;
  next(): Promise<T>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
};

function asyncQueue<T>(): AsyncQueue<T> {
  const buffer: T[] = [];
  let resolveNext: ((value: T) => void) | null = null;
  return {
    push(item: T): void {
      if (resolveNext) {
        resolveNext(item);
        resolveNext = null;
      } else {
        buffer.push(item);
      }
    },
    pushMany(items: T[]): void {
      for (const item of items) this.push(item);
    },
    next(): Promise<T> {
      if (buffer.length > 0) return Promise.resolve(buffer.shift()!);
      return new Promise((resolve) => {
        resolveNext = resolve;
      });
    },
    [Symbol.asyncIterator]() {
      return { next: () => this.next().then((value) => ({ value, done: false })) };
    },
  };
}
```

### Batching

Collect items over a time window and process as a batch:

```ts
function batched<T, R>(
  processBatch: (items: T[]) => Promise<R[]>,
  maxSize: number,
  maxWaitMs: number,
): (item: T) => Promise<R> {
  let batch: T[] = [];
  let resolveMap = new Map<number, (value: R) => void>();
  let id = 0;

  async function flush() {
    const items = batch.splice(0);
    const resolvers = resolveMap;
    resolveMap = new Map();
    const results = await processBatch(items);
    for (let i = 0; i < items.length; i++) resolvers.get(i)!(results[i]!);
  }

  return (item: T): Promise<R> =>
    new Promise((resolve) => {
      const idx = id++;
      resolveMap.set(idx, resolve);
      batch.push(item);
      if (batch.length >= maxSize) flush();
      else setTimeout(flush, maxWaitMs);
    });
}
```

## Async Iteration

### `for await...of`

Prefer over `.on("data")` / `.on("end")` event patterns. Cleaner control flow, automatic backpressure with async iterables.

```ts
async function* paginate<T>(
  fetchPage: (cursor?: string) => Promise<{ items: T[]; next?: string }>,
): AsyncGenerator<T> {
  let cursor: string | undefined;
  for (;;) {
    const { items, next } = await fetchPage(cursor);
    for (const item of items) yield item;
    if (!next) return;
    cursor = next;
  }
}

for await (const item of paginate(fetchPage)) process(item);
```

### Convert Push to Pull

Convert events/callbacks to async iterables:

```ts
function fromEvent<T>(
  emitter: { on(e: string, cb: (data: T) => void): void; off(e: string, cb: (data: T) => void): void },
  event: string,
): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      let resolve: ((v: T) => void) | null = null;
      const buffer: T[] = [];
      const listener = (data: T) => {
        if (resolve) {
          resolve(data);
          resolve = null;
        } else buffer.push(data);
      };
      emitter.on(event, listener);
      return {
        next() {
          if (buffer.length) return Promise.resolve({ value: buffer.shift()!, done: false });
          return new Promise((r) => {
            resolve = r;
          });
        },
        return() {
          emitter.off(event, listener);
          return Promise.resolve({ value: undefined, done: true });
        },
      };
    },
  };
}
```

## Error Handling in Async

### Promise Chain Errors

Errors propagate to the nearest `.catch()` or `try/catch`. Unhandled rejections crash the process.

```ts
async function processData(): Promise<void> {
  try {
    const data = await fetchData();
    const validated = validate(data);
    await save(validated);
  } catch (err: unknown) {
    if (err instanceof ValidationError) return handleValidation(err);
    throw err; // rethrow unexpected
  }
}
```

### Errors in Concurrent Ops

`Promise.all` loses all results on any rejection. `Promise.allSettled` preserves individual outcomes:

```ts
const results = await Promise.allSettled([riskyOp(), safeOp()]);
for (const result of results) {
  if (result.status === "rejected") console.error("Operation failed:", result.reason);
}
```

### Convert Throwing to Result

Bridge throw-based APIs to type-safe error handling:

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
async function toResult<T, E = Error>(promise: Promise<T>, mapError?: (err: unknown) => E): Promise<Result<T, E>> {
  try {
    return { ok: true, value: await promise };
  } catch (err: unknown) {
    return { ok: false, error: mapError ? mapError(err) : (err as E) };
  }
}
```

### Race Condition Safety — Stale Response Guard

Discard responses from earlier requests when a newer one is in flight:

```ts
function useLatest<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {
  let counter = 0;
  return async (...args: Args) => {
    const id = ++counter;
    const result = await fn(...args);
    if (id !== counter) throw new Error("Stale response discarded");
    return result;
  };
}
```

### Combinator Decision Guide

| Pattern                 | Use when...                             |
| ----------------------- | --------------------------------------- |
| `Promise.all`           | All must succeed, fail fast             |
| `Promise.allSettled`    | Collect all outcomes, tolerate failures |
| `Promise.race`          | Fastest settlement wins (timeouts)      |
| `Promise.any`           | First success wins (redundancy)         |
| `Promise.withResolvers` | External resolve/reject control         |

## Common Mistakes

| Mistake                                        | Fix                                         |
| ---------------------------------------------- | ------------------------------------------- |
| Using `Promise.all` when partial success is OK | Use `Promise.allSettled`                    |
| Unbounded parallelism on large arrays          | Use limited concurrency (`mapConcurrent`)   |
| Missing `AbortSignal` propagation              | Pass `signal` to every sub-operation        |
| Sequential ops that could be parallel          | Identify independent ops → `Promise.all`    |
| Silent catch blocks (empty `catch`)            | Always log or rethrow                       |
| Deferred antipattern (wrapping promise APIs)   | Return the existing promise directly        |
| Not handling promise rejections                | Always `.catch()` or `await` in `try/catch` |
| Thundering herd on retry                       | Add jitter to backoff                       |
| Shared mutable state in concurrent ops         | Use isolated state per operation            |
| Promise nesting (waterfall pyramid)            | Flat chain with `.then()` or `await`        |
| Forgetting to `await`                          | Use `void` for explicit fire-and-forget     |
| Async functions without error boundaries       | Wrap concurrent entry points in `try/catch` |
