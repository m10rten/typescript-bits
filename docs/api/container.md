# Container

A minimal dependency injection container for registering and resolving dependencies.

```ts
export interface Container {
  register<T>(token: string, factory: () => T): void;
  resolve<T>(token: string): T;
  has(token: string): boolean;
}
```

- **register** — binds a token to a factory function (called once per resolve by default).
- **resolve** — returns the instance for a given token.
- **has** — checks whether a token is registered.
