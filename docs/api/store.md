# Store

A key-value store with a pluggable backend (memory, file, Redis, etc.).

```ts
export interface Store<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V): Promise<void>;
  delete(key: K): Promise<void>;
  has(key: K): Promise<boolean>;
  keys(): Promise<K[]>;
}
```

- **get** — retrieves a value by key.
- **set** — stores a value.
- **delete** — removes a key.
- **has** — checks if a key exists.
- **keys** — returns all keys.
