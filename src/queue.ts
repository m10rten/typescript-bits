export type QueueEvent<T> =
  | { type: "push"; item: T }
  | { type: "pop"; item: T }
  | { type: "drain"; items: T[] }
  | { type: "empty" }
  | { type: "idle" }
  | { type: "error"; error: Error };

export class Queue<T> {
  #items: T[];
  #listeners: Set<(event: QueueEvent<T>) => void>;

  constructor(items?: Iterable<T>) {
    this.#items = items ? [...items] : [];
    this.#listeners = new Set();
  }

  get size(): number {
    return this.#items.length;
  }

  push(item: T): void {
    this.#items.push(item);
    this.#emit({ type: "push", item });
  }

  pop(): T | undefined {
    const item = this.#items.shift();
    if (item === undefined) return undefined;
    this.#emit({ type: "pop", item });
    if (this.#items.length === 0) {
      this.#emit({ type: "empty" });
      this.#emit({ type: "idle" });
    }
    return item;
  }

  front(): T | undefined {
    return this.#items[0];
  }

  drain(): T[] {
    const items = this.#items.splice(0);
    if (items.length > 0) {
      this.#emit({ type: "drain", items });
    }
    this.#emit({ type: "idle" });
    return items;
  }

  on(callback: (event: QueueEvent<T>) => void): () => void {
    this.#listeners.add(callback);
    return () => {
      this.#listeners.delete(callback);
    };
  }

  #emit(event: QueueEvent<T>): void {
    for (const fn of this.#listeners) {
      try {
        fn(event);
      } catch {
        // swallow listener errors
      }
    }
  }
}
