/**
 * A reactive value container with subscriber notifications.
 *
 * @summary A typed reactive container that holds a single value: call `get()` to read it,
 * `set()` to update it and synchronously notify all subscribers, and `subscribe()` to register
 * a listener — receiving an unsubscribe handle in return. `Atom.fn()` extends this model to
 * plain functions, wrapping any callable so that every invocation fans out to subscribers,
 * making it easy to build observable event emitters without a class. Zero dependencies.
 *
 * @example
 * ```ts
 * import { atom, type Atom } from "@typescript-bits/atom";
 *
 * const count = atom(0);
 * count.set(1);
 * count.get(); // 1
 * ```
 */
export class Atom<T> {
  private value: T;
  private subs = new Set<(value: T) => void>();

  constructor(initial: T) {
    this.value = initial;
  }

  /**
   * Returns the current value of the atom.
   *
   * @returns The current value
   */
  get(): T {
    return this.value;
  }

  /**
   * Updates the atom's value and notifies all subscribers.
   *
   * @param value - The new value to set
   */
  set(value: T): void {
    this.value = value;
    for (const fn of this.subs) fn(value);
  }

  /**
   * Registers a listener that is called whenever the atom's value changes.
   *
   * @param fn - The callback to invoke with the new value on each change
   * @returns An unsubscribe function that removes the listener when called
   *
   * @example
   * ```ts
   * const count = atom(0);
   * const unsub = count.subscribe((v) => console.log("count:", v));
   * count.set(1); // count: 1
   * unsub();
   * count.set(2); // (no output)
   * ```
   */
  subscribe(fn: (value: T) => void): () => void {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

  /**
   * Creates a subscribable function atom — a callable that notifies listeners when invoked.
   *
   * @returns An `AtomFn<T>` that can be called directly and subscribed to
   *
   * @example
   * ```ts
   * const onClick = Atom.fn<(x: number, y: number) => void>();
   * const unsub = onClick.subscribe((x, y) => console.log(x, y));
   * onClick(10, 20); // 10 20
   * unsub();
   * ```
   */
  static fn<T extends (...args: never[]) => void>(): AtomFn<T> {
    const subs = new Set<T>();
    const fn = ((...args: Parameters<T>) => {
      for (const s of subs) s(...args);
    }) as AtomFn<T>;
    fn.subscribe = (listener: T) => {
      subs.add(listener);
      return () => subs.delete(listener);
    };
    return fn;
  }
}

/**
 * A callable value that notifies subscribers each time it is invoked.
 *
 * Produced by {@link Atom.fn}.
 */
export interface AtomFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  subscribe(listener: T): () => void;
}

/**
 * Create a reactive `Atom` value.
 *
 * @example
 * ```ts
 * import { atom } from "@typescript-bits/atom";
 *
 * const count = atom(0);
 * count.set(count.get() + 1);
 * ```
 */
export function atom<T>(initial: T): Atom<T> {
  return new Atom(initial);
}
