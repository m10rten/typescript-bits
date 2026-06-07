import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { atom, Atom } from "../src/index.js";

describe("Atom", () => {
  it("returns the initial value", () => {
    const counter = atom(42);
    assert.equal(counter.get(), 42);
  });

  it("updates the value via set", () => {
    const greeting = atom("hello");
    greeting.set("world");
    assert.equal(greeting.get(), "world");
  });

  it("notifies subscribers on set", () => {
    const counter = atom(0);
    const receivedValues: number[] = [];
    counter.subscribe((value) => receivedValues.push(value));
    counter.set(1);
    counter.set(2);
    assert.deepEqual(receivedValues, [1, 2]);
  });

  it("returns an unsubscribe function", () => {
    const counter = atom(0);
    const receivedValues: number[] = [];
    const unsubscribe = counter.subscribe((value) => receivedValues.push(value));
    counter.set(1);
    unsubscribe();
    counter.set(2);
    assert.deepEqual(receivedValues, [1]);
  });

  it("notifies only active subscribers", () => {
    const counter = atom(0);
    const firstSubscriberValues: number[] = [];
    const secondSubscriberValues: number[] = [];
    const unsubscribeFirst = counter.subscribe((value) => firstSubscriberValues.push(value));
    counter.subscribe((value) => secondSubscriberValues.push(value));
    counter.set(1);
    unsubscribeFirst();
    counter.set(2);
    assert.deepEqual(firstSubscriberValues, [1]);
    assert.deepEqual(secondSubscriberValues, [1, 2]);
  });

  it("supports multiple independent atoms", () => {
    const firstCounter = atom("a");
    const secondCounter = atom("b");
    firstCounter.set("x");
    assert.equal(firstCounter.get(), "x");
    assert.equal(secondCounter.get(), "b");
  });

  describe("Atom.fn", () => {
    it("notifies subscribers when invoked", () => {
      const onClick = Atom.fn<(x: number, y: number) => void>();
      const recordedCalls: [number, number][] = [];
      onClick.subscribe((x, y) => recordedCalls.push([x, y]));
      onClick(1, 2);
      onClick(3, 4);
      assert.deepEqual(recordedCalls, [
        [1, 2],
        [3, 4],
      ]);
    });

    it("supports multiple subscribers", () => {
      const onMessage = Atom.fn<(msg: string) => void>();
      const rawMessages: string[] = [];
      const uppercasedMessages: string[] = [];
      onMessage.subscribe((msg) => rawMessages.push(msg));
      onMessage.subscribe((msg) => uppercasedMessages.push(msg.toUpperCase()));
      onMessage("hello");
      assert.deepEqual(rawMessages, ["hello"]);
      assert.deepEqual(uppercasedMessages, ["HELLO"]);
    });

    it("returns unsubscribe function", () => {
      const onCount = Atom.fn<(count: number) => void>();
      const receivedValues: number[] = [];
      const unsubscribe = onCount.subscribe((count) => receivedValues.push(count));
      onCount(1);
      unsubscribe();
      onCount(2);
      assert.deepEqual(receivedValues, [1]);
    });

    it("works with no subscribers", () => {
      const onTick = Atom.fn<() => void>();
      onTick(); // should not throw
    });

    it("notifies only active subscribers", () => {
      const onEvent = Atom.fn<(value: number) => void>();
      const firstSubscriberValues: number[] = [];
      const secondSubscriberValues: number[] = [];
      const unsubscribeFirst = onEvent.subscribe((value) => firstSubscriberValues.push(value));
      onEvent.subscribe((value) => secondSubscriberValues.push(value));
      onEvent(1);
      unsubscribeFirst();
      onEvent(2);
      assert.deepEqual(firstSubscriberValues, [1]);
      assert.deepEqual(secondSubscriberValues, [1, 2]);
    });
  });
});
