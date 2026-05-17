# Cache

A bounded cache with TTL and LRU eviction.

```ts
export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V, ttlMs?: number): void;
  has(key: K): boolean;
  delete(key: K): void;
  clear(): void;
  size(): number;
}
```

- **get** — returns the value or `undefined` if missing/expired.
- **set** — stores a value with an optional TTL.
- **has** — checks existence (respects expiry).
- **delete** — removes a single entry.
- **clear** — removes all entries.
- **size** — returns the number of live entries.
