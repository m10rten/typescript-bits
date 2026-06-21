---
name: caching-patterns
description: In-memory caching patterns for TypeScript — memoization, async deduplication, TTL, LRU, stale-while-revalidate, and invalidation strategies
---

# Caching Patterns

In-memory caching for TypeScript. These patterns apply in Node.js and browser environments without external stores.

> **See also:** `memory-management-guidelines` for LRU/TTL class implementations and GC impact. `async-patterns` for retry/backoff when fetches fail.

---

## Synchronous Memoization

Cache the result of a pure function keyed by its arguments. Only safe when inputs are primitives or produce stable serializations.

```ts
/** Memoize a pure function. Cache is unbounded — use with low-cardinality inputs. */
function memoize<Args extends readonly unknown[], R>(
  fn: (...args: Args) => R,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args),
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

```ts
// Usage
const expensiveCalc = memoize((x: number, y: number) => x ** y);
expensiveCalc(2, 10); // computed
expensiveCalc(2, 10); // cached
```

**Key function matters.** Default `JSON.stringify` fails for `undefined`, `Date`, circular refs, and object argument order differences. Supply a custom `keyFn` for anything beyond plain numbers/strings.

---

## Async Memoization — In-flight Deduplication

Store the **Promise**, not the resolved value. Multiple callers awaiting the same key all share one in-flight request.

```ts
/** Deduplicates concurrent async calls for the same key. */
function memoizeAsync<Args extends readonly unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args),
): (...args: Args) => Promise<R> {
  const cache = new Map<string, Promise<R>>();
  return (...args: Args): Promise<R> => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key)!;
    const promise = fn(...args).finally(() => cache.delete(key));
    cache.set(key, promise);
    return promise;
  };
}
```

The `.finally` removes the entry on settlement — only in-flight requests are deduplicated. For persistent caching, keep the settled value and apply a TTL (see below).

**When to keep the settled value:** if you want cache hits after the first fetch completes, remove `.finally` and manage expiry separately.

---

## TTL Cache

Entries expire after a configurable duration. Use when data has a known freshness window.

```ts
type TTLEntry<V> = { value: V; expiresAt: number };

/** Bounded TTL cache. Expired entries are evicted lazily on access. */
class TTLCache<K, V> {
  readonly #ttlMs: number;
  readonly #map = new Map<K, TTLEntry<V>>();

  constructor(ttlMs: number) {
    this.#ttlMs = ttlMs;
  }

  get(key: K): V | undefined {
    const entry = this.#map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.#map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    this.#map.set(key, { value, expiresAt: Date.now() + this.#ttlMs });
  }

  delete(key: K): void {
    this.#map.delete(key);
  }

  sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.#map) {
      if (now > entry.expiresAt) this.#map.delete(key);
    }
  }
}
```

**Lazy eviction** keeps the hot path fast but allows stale keys to linger until accessed. Add a periodic sweep if unbounded growth is a concern:

```ts
setInterval(() => cache.sweep(), ttlMs);
```

---

## LRU Eviction

Bounded-size cache. Evicts the least-recently-used entry when full. Uses insertion-order iteration of `Map` — the oldest key is always `map.keys().next()`.

```ts
/** LRU cache with a hard size cap. O(1) get and set. */
class LRUCache<K, V> {
  readonly #max: number;
  readonly #map = new Map<K, V>();

  constructor(max: number) {
    this.#max = max;
  }

  get(key: K): V | undefined {
    const value = this.#map.get(key);
    if (value === undefined) return undefined;
    // Refresh insertion order → marks as recently used
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#max) {
      const oldest = this.#map.keys().next();
      if (!oldest.done) this.#map.delete(oldest.value);
    }
  }

  delete(key: K): void {
    this.#map.delete(key);
  }
}
```

Combine LRU + TTL by composing both: store `TTLEntry<V>` as values in `LRUCache` and validate expiry on `get`.

---

## Stale-While-Revalidate

Return the cached value immediately (even if stale) and refresh in the background. Reduces perceived latency at the cost of serving briefly stale data.

```ts
type SWREntry<V> = { value: V; fetchedAt: number };

/**
 * Stale-while-revalidate cache.
 * Returns stale data immediately and triggers a background refresh if TTL has elapsed.
 */
class SWRCache<K, V> {
  readonly #ttlMs: number;
  readonly #map = new Map<K, SWREntry<V>>();
  readonly #inflight = new Map<K, Promise<V>>();

  constructor(ttlMs: number) {
    this.#ttlMs = ttlMs;
  }

  get(key: K, fetch: () => Promise<V>): V | undefined {
    const entry = this.#map.get(key);
    const stale = entry && Date.now() - entry.fetchedAt > this.#ttlMs;

    if (!entry || stale) {
      if (!this.#inflight.has(key)) {
        const p = fetch()
          .then((value) => {
            this.#map.set(key, { value, fetchedAt: Date.now() });
            return value;
          })
          .finally(() => this.#inflight.delete(key));
        this.#inflight.set(key, p);
      }
    }

    return entry?.value;
  }

  /** Await the current in-flight refresh, if any. */
  async revalidate(key: K): Promise<V | undefined> {
    await this.#inflight.get(key);
    return this.#map.get(key)?.value;
  }
}
```

**Behaviour on first call (cold):** returns `undefined` and kicks off fetch. Callers must handle `undefined`. Alternatively, block on first fetch and use SWR only for subsequent calls.

---

## Cache Invalidation Strategies

### Manual delete

Call `cache.delete(key)` on write. Simple, synchronous, precise.

```ts
async function updateUser(id: string, data: UserPatch): Promise<User> {
  const updated = await db.users.update(id, data);
  userCache.delete(id); // invalidate on mutation
  return updated;
}
```

### TTL expiry

Set a TTL appropriate to data staleness tolerance. No explicit invalidation needed — entries expire automatically. Best for read-heavy, write-infrequent data.

### Event-based invalidation

Publish an invalidation event on write; all cache holders subscribe and delete.

```ts
// Writer
eventBus.emit("user:updated", { id });

// Cache holder
eventBus.on("user:updated", ({ id }: { id: string }) => {
  userCache.delete(id);
});
```

Clean up event listeners on teardown — see `memory-management-guidelines`.

### Versioned keys

Append a version or generation counter to the cache key. "Invalidation" is a key bump — old entries become unreachable and expire via TTL or LRU eviction.

```ts
let generation = 0;
const key = (id: string) => `${id}:v${generation}`;
// Bust the entire cache
generation++;
```

### Strategy comparison

| Strategy      | Precision   | Complexity | Latency impact    |
| ------------- | ----------- | ---------- | ----------------- |
| Manual delete | Exact       | Low        | None              |
| TTL expiry    | Approximate | None       | Serves stale data |
| Event-based   | Exact       | Medium     | None              |
| Versioned key | Whole-gen   | Low        | LRU waste         |

---

## When NOT to Cache

| Scenario                               | Reason to skip cache                                       |
| -------------------------------------- | ---------------------------------------------------------- |
| Mutable inputs (objects, arrays)       | Key equality is reference, not value — hits are never safe |
| Side-effectful functions               | Caching skips the side effect on repeat calls              |
| Low hit rate (one-off keys)            | Memory cost exceeds benefit                                |
| High write frequency relative to reads | Invalidation overhead dominates                            |
| Security-sensitive data per-user       | Cross-user key collisions leak data                        |
| Functions that depend on current time  | Cached results become stale immediately                    |

---

## Common Mistakes

| Mistake                                           | Fix                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Caching the resolved value instead of the Promise | Store the `Promise` to deduplicate concurrent in-flight requests            |
| Using `JSON.stringify` as key for object args     | Supply a stable `keyFn`; object property order can differ                   |
| Unbounded memoize on high-cardinality inputs      | Wrap with `LRUCache` to cap size                                            |
| Caching functions with side effects               | Cache is a contract of purity — side effects must not be suppressed         |
| No eviction strategy on module-level cache        | Every unique key lives forever; add TTL or LRU                              |
| Forgetting to invalidate on mutation              | Call `cache.delete(key)` at the write site, or use event-based invalidation |
| Not handling `undefined` on SWR cold start        | SWR returns `undefined` before first fetch; callers must guard              |
| Sharing a cache across users/tenants              | Scope the cache per user or include a user identifier in the key            |
| Composing TTL check after LRU promotion           | Validate TTL before promoting in `get`, not after                           |
