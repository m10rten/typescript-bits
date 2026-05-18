import { describe, it } from "node:test";
import assert from "node:assert";
import { Queue } from "../src/queue.js";

describe("Queue", () => {
  describe("constructor", () => {
    it("creates an empty queue", () => {
      const q = new Queue<number>();
      assert.strictEqual(q.size, 0);
    });

    it("creates a queue seeded with items", () => {
      const q = new Queue([1, 2, 3]);
      assert.strictEqual(q.size, 3);
    });
  });

  describe("push", () => {
    it("adds an item and increases size", () => {
      const q = new Queue<number>();
      q.push(1);
      assert.strictEqual(q.size, 1);
    });

    it("fires a push event", () => {
      const q = new Queue<number>();
      const events: { type: string; item?: number }[] = [];
      q.on((e) => events.push(e as { type: string; item?: number }));
      q.push(42);
      assert.deepStrictEqual(events, [{ type: "push", item: 42 }]);
    });
  });

  describe("pop", () => {
    it("removes and returns the front item", () => {
      const q = new Queue([1, 2]);
      assert.strictEqual(q.pop(), 1);
      assert.strictEqual(q.size, 1);
    });

    it("returns undefined when empty", () => {
      const q = new Queue<number>();
      assert.strictEqual(q.pop(), undefined);
    });

    it("fires a pop event", () => {
      const q = new Queue([1]);
      const events: { type: string; item?: number }[] = [];
      q.on((e) => events.push(e as { type: string; item?: number }));
      q.pop();
      assert.deepStrictEqual(events[0], { type: "pop", item: 1 });
    });

    it("fires empty and idle events when last item is popped", () => {
      const q = new Queue([1]);
      const events: { type: string; item?: number }[] = [];
      q.on((e) => events.push(e as { type: string; item?: number }));
      q.pop();
      assert.deepStrictEqual(events, [{ type: "pop", item: 1 }, { type: "empty" }, { type: "idle" }]);
    });
  });

  describe("front", () => {
    it("returns the front item without removing it", () => {
      const q = new Queue([1, 2]);
      assert.strictEqual(q.front(), 1);
      assert.strictEqual(q.size, 2);
    });

    it("returns undefined when empty", () => {
      const q = new Queue<number>();
      assert.strictEqual(q.front(), undefined);
    });
  });

  describe("drain", () => {
    it("returns all items in FIFO order", () => {
      const q = new Queue([1, 2, 3]);
      assert.deepStrictEqual(q.drain(), [1, 2, 3]);
      assert.strictEqual(q.size, 0);
    });

    it("returns empty array when queue is empty", () => {
      const q = new Queue<number>();
      assert.deepStrictEqual(q.drain(), []);
    });

    it("fires a drain event", () => {
      const q = new Queue([1, 2]);
      const events: { type: string; items?: number[] }[] = [];
      q.on((e) => events.push(e as { type: string; items?: number[] }));
      q.drain();
      assert.deepStrictEqual(events[0], { type: "drain", items: [1, 2] });
    });

    it("fires an idle event when queue becomes empty", () => {
      const q = new Queue([1]);
      const events: { type: string }[] = [];
      q.on((e) => events.push(e as { type: string }));
      q.drain();
      assert.strictEqual(events.at(-1)?.type, "idle");
    });
  });

  describe("on", () => {
    it("returns an unsubscribe function", () => {
      const q = new Queue<number>();
      const unsub = q.on(() => {});
      assert.strictEqual(typeof unsub, "function");
    });

    it("stops receiving events after unsubscribe", () => {
      const q = new Queue<number>();
      const events: string[] = [];
      const unsub = q.on((e) => events.push(e.type));
      q.push(1);
      unsub();
      q.push(2);
      assert.deepStrictEqual(events, ["push"]);
    });
  });
});
