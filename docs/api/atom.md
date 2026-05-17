# Atom

A reactive primitive that holds a single immutable value and notifies subscribers on change.

```ts
export class Atom<T> {
  constructor(initial: T);
  get(): T;
  set(value: T): void;
  subscribe(fn: (value: T) => void): () => void;
  static fn<T extends (...args: never[]) => void>(): AtomFn<T>;
}

export interface AtomFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  subscribe(listener: T): () => void;
}

export function atom<T>(initial: T): Atom<T>;
```

- **constructor** — creates a new `Atom` with the given initial value.
- **get** — returns the current value.
- **set** — replaces the value and notifies all subscribers.
- **subscribe** — registers a callback; returns an unsubscribe function.
- **atom** — factory function, equivalent to `new Atom(initial)`.
- **Atom.fn** — creates a callable event atom. Invoke it to notify all subscribers with the given arguments.

```ts
const count = atom(0);
count.subscribe((v) => console.log(v));
count.set(1); // logs: 1

const onClick = Atom.fn<(x: number, y: number) => void>();
onClick.subscribe((x, y) => console.log(x, y));
onClick(10, 20); // logs: 10 20
```
