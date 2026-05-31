/**
 * A reactive value container with subscriber notifications.
 *
 * @example
 * ```ts
 * import { atom, type Atom } from "typescript-bits/atom";
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

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    for (const fn of this.subs) fn(value);
  }

  subscribe(fn: (value: T) => void): () => void {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

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

export interface AtomFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  subscribe(listener: T): () => void;
}

/**
 * Create a reactive `Atom` value.
 *
 * @example
 * ```ts
 * import { atom } from "typescript-bits/atom";
 *
 * const count = atom(0);
 * count.set(count.get() + 1);
 * ```
 */
export function atom<T>(initial: T): Atom<T> {
  return new Atom(initial);
}
