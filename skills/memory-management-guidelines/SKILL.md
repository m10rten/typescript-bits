---
name: memory-management-guidelines
description: Production memory management patterns for Node.js/TypeScript — GC fundamentals, leak detection, weak references, caching strategies, object pooling, stream backpressure, and closure memory for V8
---

# Memory Management Guidelines

Practical, production-oriented memory management for Node.js/TypeScript on V8. Apply these when writing performance-sensitive code, investigating leaks, or reviewing resource-heavy logic.

## GC Fundamentals

### V8 Heap: Structure & Triggers

| Generation      | Size    | Algorithm                 | Trigger                  |
| --------------- | ------- | ------------------------- | ------------------------ |
| Young (nursery) | ~16 MB  | Scavenge (copying)        | Young gen fills          |
| Old             | ~1.4 GB | Mark-sweep / mark-compact | Old gen grows past limit |
| Large object    | > 64 KB | Direct allocation         | On demand                |

- **Young gen**: Most objects die here. Fast ~1-5ms pauses.
- **Old gen**: Mark-sweep identifies live; mark-compact defragments. Pauses can exceed 100ms.
- **Large objects**: > 64 KB outside normal heap — compaction is expensive so V8 avoids it.
- **Other triggers**: allocation pressure, idle-time GC (Node 14+), `global.gc()` (`--expose-gc`, never in production)

```ts
import { performance } from "node:perf_hooks";
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) console.log(`GC: ${entry.name}, ${entry.duration}ms`);
});
observer.observe({ entryTypes: ["gc"] });
```

### GC Tuning Flags

| Flag                        | Effect                       |
| --------------------------- | ---------------------------- |
| `--max-old-space-size=4096` | Increase old gen limit (MB)  |
| `--max-semi-space-size=64`  | Increase young gen size (MB) |
| `--trace-gc`                | Log all GC events to stderr  |
| `--trace-gc-verbose`        | Detailed GC stats            |

## Memory Leak Patterns

### Closures Holding References

Closures capture the entire scope chain — not just the variables they use:

```ts
// ❌ Retains entire `largeData` in closure scope
function createHandlers(largeData: big[]) {
  return { onClick: () => console.log(largeData.length) };
}
// ✅ Extract only what's needed
function createHandlers(largeData: big[]) {
  const length = largeData.length;
  return { onClick: () => console.log(length) };
}
```

### Forgotten Timers and Intervals

Node.js won't exit while `setInterval` / `setTimeout` is active. The callback retains its entire scope. Always store the timer handle and clear it on cleanup.

### EventEmitter Listeners

Every `.on()` is a strong reference from the emitter to the listener. Without removal, listeners accumulate and prevent GC of their scope:

```ts
// ❌ Accumulates — never removed
source.on("data", handleData);
// ✅ Remove on cleanup (pass signal or return teardown)
source.on("data", handleData);
signal.addEventListener("abort", () => source.off("data", handleData));
// ✅ Use once for one-shots
source.once("end", () => console.log("done"));
```

Set `maxListeners` to detect accidental leaks: `emitter.setMaxListeners(50)`.

### Global Caches

Module-level caches that grow unbounded — every unique key lives forever:

```ts
// ❌ Unbounded
const cache = new Map<string, big[]>();
function fetchData(key: string): big[] {
  if (!cache.has(key)) cache.set(key, expensiveLoad(key));
  return cache.get(key)!;
}
// ✅ Bounded with LRU or TTL
const cache = new LRUCache<string, big[]>({ maxSize: 1000 });
```

### Map/Set With Object Keys

Object keys in `Map` / `Set` are held by strong reference. Use `WeakMap` / `WeakSet` for ephemeral associations:

```ts
// ✅ GC collects the entry when the key object is no longer reachable
const sessions = new WeakMap<object, SessionData>();
```

## Detecting Leaks

### Heap Snapshots

Generate and compare snapshots over time:

```ts
import { writeHeapSnapshot } from "node:v8";
const snapshotPath = writeHeapSnapshot();
```

### Chrome DevTools Memory Tab

1. Start Node with `--inspect`: `node --inspect app.mjs`
2. Open `chrome://inspect` in Chrome
3. Look for: detached DOM trees, shallow vs retained size, constructor retention

### process.memoryUsage()

Quick health check — log at intervals to spot growth trends:

```ts
import { memoryUsage } from "node:process";
function logMemory(): void {
  const { rss, heapUsed, heapTotal, external } = memoryUsage();
  console.log({
    rss: `${(rss / 1024 / 1024).toFixed(1)} MB`,
    heapUsed: `${(heapUsed / 1024 / 1024).toFixed(1)} MB`,
    heapTotal: `${(heapTotal / 1024 / 1024).toFixed(1)} MB`,
    external: `${(external / 1024 / 1024).toFixed(1)} MB`,
  });
}
```

| Metric      | Measures                                 | Leak indicator              |
| ----------- | ---------------------------------------- | --------------------------- |
| `rss`       | Total memory (heap + stack + code + C++) | Steady growth over time     |
| `heapUsed`  | V8 heap actively in use                  | Sawtooth (GC) then climb    |
| `heapTotal` | V8 heap allocated                        | Not releasing after GC      |
| `external`  | C++ objects (Buffers, WASM)              | Growth unrelated to JS heap |

### 3-Snapshot Technique

1. Snapshot A at startup (baseline)
2. Snapshot B after suspected leak
3. Snapshot C after cleanup / repeat
4. Objects in B but not freed in C (absent from A) are likely leaked

### Node --trace-gc

Run `node --trace-gc app.mjs`. Look for increasing old-gen size after major GC, longer scavenge pauses, or increasing GC frequency (allocation pressure).

### Production Monitoring

Monitor heap growth in production with periodic `process.memoryUsage()` checks:

```ts
setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  if (heapUsed / 1024 / 1024 > 1024) console.error(`heap > 1 GB`);
}, 30_000);
```

Thresholds: >512 MB log/metric, >1 GB alert/snapshot, >2 GB restart/scale.

## Weak References

### WeakMap / WeakSet

Keys are held weakly — if no other reference to the key exists, the entry is GC'd:

```ts
const metadata = new WeakMap<object, Metadata>();
function setMeta(obj: object, meta: Metadata): void {
  metadata.set(obj, meta);
}
function getMeta(obj: object): Metadata | undefined {
  return metadata.get(obj);
}
```

| Structure | Key type    | Value GC'd with key? | Use case                     |
| --------- | ----------- | -------------------- | ---------------------------- |
| `Map`     | Any         | No (must delete)     | Long-lived associations      |
| `WeakMap` | Object only | Yes                  | Ephemeral metadata, membrane |
| `Set`     | Any         | No (must delete)     | Membership tracking          |
| `WeakSet` | Object only | Yes                  | Tagging, visited tracking    |

### WeakRef

Holds a weak reference — does not prevent GC. Dereference with `.deref()`:

```ts
const cache = new Map<string, WeakRef<ExpensiveObject>>();
function getOrCreate(key: string): ExpensiveObject {
  const ref = cache.get(key);
  const existing = ref?.deref();
  if (existing) return existing;
  const obj = new ExpensiveObject(key);
  cache.set(key, new WeakRef(obj));
  return obj;
}
```

**Caveats:** `.deref()` can return `undefined` after GC — always check. GC is non-deterministic. Avoid in hot paths.

### FinalizationRegistry

Register a callback when an object is GC'd — useful for native resource cleanup:

```ts
const registry = new FinalizationRegistry<string>((resourceId: string) => {
  nativeCleanup(resourceId);
});
class FileHandle {
  readonly #id: string;
  constructor(path: string) {
    this.#id = nativeOpen(path);
    registry.register(this, this.#id);
  }
}
```

**Caveats:** Callback runs on a different tick — don't rely on timing. Not called during process exit — explicit cleanup still needed.

## Buffer Management

### Buffer.alloc vs Buffer.from

| Method                     | Behavior              | When to use                                 |
| -------------------------- | --------------------- | ------------------------------------------- |
| `Buffer.alloc(size)`       | Zero-filled, safe     | New allocations                             |
| `Buffer.allocUnsafe(size)` | Uninitialized, faster | Performance-critical, immediately overwrite |
| `Buffer.from(data)`        | Allocates and copies  | Converting strings, arrays                  |

```ts
const safe = Buffer.alloc(1024);
const fast = Buffer.allocUnsafe(1024);
fast.fill(0); // must fill before reading
```

### Avoid Large String Concatenation

Creates multiple intermediate copies. For large payloads, use arrays or buffers:

```ts
// ❌ O(n²) memory — multiple intermediate strings
let result = "";
for (const chunk of largeArray) result += chunk;

// ✅ Single allocation
const parts: string[] = [];
for (const chunk of largeArray) parts.push(chunk);
const result = parts.join("");

// ✅ For binary data
const result = Buffer.concat(largeArray.map((s) => Buffer.from(s)));
```

### Detached Buffer Gotcha

`postMessage()` transfers `ArrayBuffer` ownership — source `byteLength` becomes 0:

```ts
const buf = new ArrayBuffer(1024);
postMessage(buf, [buf]);
buf.byteLength; // 0 — detached!
```

## Caching Strategies

### LRU Cache

Evicts least-recently-used entries when full:

```ts
class LRUCache<K, V> {
  readonly #max: number;
  readonly #map = new Map<K, V>();
  constructor(max: number) {
    this.#max = max;
  }
  get(key: K): V | undefined {
    const value = this.#map.get(key);
    if (value !== undefined) {
      this.#map.delete(key);
      this.#map.set(key, value);
    }
    return value;
  }
  set(key: K, value: V): void {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#max) {
      const first = this.#map.keys().next();
      if (!first.done) this.#map.delete(first.value);
    }
  }
}
```

### TTL Cache

Entries expire after a set duration regardless of access:

```ts
class TTLCache<K, V> {
  readonly #map = new Map<K, { value: V; expiresAt: number }>();
  constructor(private readonly ttlMs: number) {}
  get(key: K): V | undefined {
    const entry = this.#map.get(key);
    if (!entry) return;
    if (Date.now() > entry.expiresAt) {
      this.#map.delete(key);
      return;
    }
    return entry.value;
  }
  set(key: K, value: V): void {
    this.#map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
```

### Eviction Comparison

| Strategy | Eviction policy       | Memory bound | Overhead | Use case                |
| -------- | --------------------- | ------------ | -------- | ----------------------- |
| LRU      | Least recently used   | Hard         | O(1)     | General caching         |
| TTL      | Time-based            | Soft         | O(1)     | Stale-data tolerance    |
| LFU      | Least frequently used | Hard         | O(log n) | Hot data prioritization |
| FIFO     | First in, first out   | Hard         | O(1)     | Simple, predictable     |

### Which Cache to Use

| Pattern               | Best pick |
| --------------------- | --------- |
| Fixed-size hot data   | FIFO      |
| Recency-skewed access | LRU       |
| Frequency-skewed      | LFU       |
| Time-bounded validity | TTL       |

## Object Pooling

Reuse objects to reduce GC pressure — allocation is cheap, but GC of short-lived objects is not free:

```ts
class ConnectionPool<T> {
  readonly #available: T[] = [];
  readonly #max: number;
  readonly #factory: () => T;
  readonly #reset: (item: T) => void;

  constructor(max: number, factory: () => T, reset: (item: T) => void) {
    this.#max = max;
    this.#factory = factory;
    this.#reset = reset;
  }
  acquire(): T {
    return this.#available.pop() ?? this.#factory();
  }
  release(item: T): void {
    this.#reset(item);
    if (this.#available.length < this.#max) this.#available.push(item);
  }
}
```

### When to Pool

| Pool candidate              | NOT worth pooling                |
| --------------------------- | -------------------------------- |
| Database connections        | Small temporary objects          |
| Large buffers (> 64 KB)     | Short-lived primitives           |
| WebSocket / TCP sockets     | Objects pooled by V8 already     |
| Expensive-to-create objects | Objects with complex reset logic |

### Pool Gotchas

- **Stale state** — always reset before reuse
- **Held references** — pooled objects in closures prevent pool GC
- **Growth under load** — set hard `max`, not a soft target
- **Fragmentation** — varying-size objects waste space; use fixed-size pools

## Streams and Backpressure

### Memory-Safe Streaming

Read streams buffer data. Without backpressure, entire payloads fit in memory:

```ts
// ❌ Loads entire file
const data = await readFile("large.log", "utf-8");
// ✅ Constant memory — one line at a time
const rl = createInterface({ input: createReadStream("large.log") });
for await (const line of rl) processLine(line);
```

### highWaterMark

Controls internal buffer size. Tune for throughput vs memory:

```ts
// Lower memory, more I/O
const slow = createReadStream("file", { highWaterMark: 16 * 1024 }); // 16 KB
// Higher throughput, more memory
const fast = createReadStream("file", { highWaterMark: 1024 * 1024 }); // 1 MB
```

| highWaterMark | Memory/stream | Throughput | Use case           |
| ------------- | ------------- | ---------- | ------------------ |
| 16 KB         | ~16 KB        | Lower      | Memory-constrained |
| 64 KB         | ~64 KB        | Medium     | Default (balanced) |
| 1 MB          | ~1 MB         | Higher     | High-throughput    |

### Drain Events

When `Writable.write()` returns `false`, wait for `drain` before continuing:

```ts
async function writeLarge(output: Writable, items: Buffer[]): Promise<void> {
  for (const item of items) {
    const canContinue = output.write(item);
    if (!canContinue) await new Promise<void>((resolve) => output.once("drain", resolve));
  }
  output.end();
}
```

## Closure Memory

### Scope Capture

A closure captures the entire `[[Scope]]` — every variable in every enclosing function, not just referenced ones:

```ts
// ❌ Closure retains both `massive` and `tiny` — only `tiny` needed
function outer() {
  const massive = new Array(1_000_000).fill("data");
  const tiny = "hello";
  return function inner() {
    return tiny;
  };
}

// ✅ Separate scopes so `massive` isn't captured
function makeGetter() {
  const tiny = "hello";
  return function inner() {
    return tiny;
  };
}
function createMassiveData(): void {
  const massive = new Array(1_000_000).fill("data"); // GC'd after return
}
```

### Holding `this` in Callbacks

Arrow functions capture `this` — if `this` is a large object, it's retained for the callback's lifetime. Extract only what's needed instead.

### Accidental Retention in Loops

Callbacks in loops capture the entire iteration scope. If only a primitive is needed, extract it.

## Common Mistakes

| Mistake                                          | Fix                                          |
| ------------------------------------------------ | -------------------------------------------- |
| Unbounded `Map`/`Set` with no eviction           | Add LRU, TTL, or bounded size                |
| Not removing EventEmitter listeners              | Track with cleanup; use `once` for one-shots |
| Closures capturing large scope                   | Extract only needed variables                |
| Using `WeakRef` without `.deref()` null check    | Always guard: `ref?.deref() ?? createNew()`  |
| Large string concatenation in loops              | Use `Array.join()` or `Buffer.concat()`      |
| No `highWaterMark` tuning on streams             | Set based on throughput vs memory trade-off  |
| `Buffer.allocUnsafe` without filling before read | `fill(0)` or immediately overwrite           |
| Ignoring `external` memory growth                | Profile native bindings, Buffer usage, WASM  |
| No heap snapshot comparison in investigations    | Use 3-snapshot technique                     |
