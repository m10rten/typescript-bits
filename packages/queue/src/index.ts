/**
 * An event-driven FIFO queue with typed lifecycle events.
 *
 * @summary A typed FIFO queue built around a lifecycle event system. Subscribe
 * to `push`, `pop`, `drain`, `empty`, `idle`, and `error` events via `on()`,
 * which returns an unsubscribe handle. Use `drain()` to pull all items at once
 * or `front()` to peek without removing. Designed for ordered processing
 * pipelines where visibility into queue state matters.
 *
 * @example
 * ```ts
 * import { Queue } from "@typescript-bits/queue";
 *
 * const queue = new Queue<string>();
 * queue.push("a");
 * queue.push("b");
 * queue.pop(); // "a"
 * queue.size;  // 1
 * ```
 */
export class Queue<T> {
  #items: T[];
  #listeners: Set<(event: QueueEvent<T>) => void>;

  constructor(items?: Iterable<T>) {
    this.#items = items ? [...items] : [];
    this.#listeners = new Set();
  }

  /**
   * The number of items currently in the queue.
   *
   * @returns The current queue length.
   */
  get size(): number {
    return this.#items.length;
  }

  /**
   * Adds an item to the back of the queue. Emits a `push` event.
   *
   * @param item - The item to enqueue.
   */
  push(item: T): void {
    this.#items.push(item);
    this.#emit({ type: "push", item });
  }

  /**
   * Removes and returns the item at the front of the queue. Emits `pop`, then
   * `empty` and `idle` if the queue reaches zero items. Returns `undefined` if
   * the queue is empty.
   *
   * @returns The front item, or `undefined` if the queue was empty.
   */
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

  /**
   * Returns the item at the front of the queue without removing it.
   *
   * @returns The front item, or `undefined` if the queue is empty.
   */
  front(): T | undefined {
    return this.#items[0];
  }

  /**
   * Removes and returns all items in one operation. Emits `drain` (when there
   * is at least one item) followed by `idle`.
   *
   * @returns An array of all items that were in the queue, in FIFO order.
   *
   * @example
   * ```ts
   * const q = new Queue<number>();
   * q.push(1);
   * q.push(2);
   * q.drain(); // [1, 2] — queue is now empty
   * ```
   */
  drain(): T[] {
    const items = this.#items.splice(0);
    if (items.length > 0) {
      this.#emit({ type: "drain", items });
    }
    this.#emit({ type: "idle" });
    return items;
  }

  /**
   * Subscribes to all queue events. Returns an unsubscribe function that
   * removes the listener when called.
   *
   * @param callback - Called with each {@link QueueEvent} as it fires.
   * @returns A function that unregisters the listener.
   *
   * @example
   * ```ts
   * const q = new Queue<string>();
   * const off = q.on((event) => {
   *   if (event.type === "empty") console.log("queue drained");
   * });
   * q.push("hello");
   * q.pop(); // logs "queue drained"
   * off();   // unsubscribe
   * ```
   */
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

/**
 * Events emitted by {@link Queue}.
 *
 * @example
 * ```ts
 * import { Queue } from "@typescript-bits/queue";
 *
 * const q = new Queue<number>();
 * q.on((event) => {
 *   if (event.type === "push") console.log("pushed:", event.item);
 * });
 * q.push(1); // "pushed: 1"
 * ```
 */
export type QueueEvent<T> =
  | { type: "push"; item: T }
  | { type: "pop"; item: T }
  | { type: "drain"; items: T[] }
  | { type: "empty" }
  | { type: "idle" }
  | { type: "error"; error: Error };
