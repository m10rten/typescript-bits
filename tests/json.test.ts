import { describe, it } from "node:test";
import assert from "node:assert";
import { RichJSON, replacer, reviver } from "../src/json.js";

describe("RichJSON", () => {
  describe("parse / stringify round-trips", () => {
    const edgecases: { name: string; value: unknown; assertEqual: (a: unknown, b: unknown) => void }[] = [
      { name: "string", value: "hello", assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "number", value: 42, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "boolean", value: true, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "null", value: null, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "array", value: [1, "two", false], assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      { name: "plain object", value: { a: 1, b: "two" }, assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      {
        name: "Map",
        value: new Map([
          ["a", 1],
          ["b", 2],
        ]),
        assertEqual: (a, b) => assert.deepStrictEqual(a, b),
      },
      { name: "Set", value: new Set([1, 2, 3]), assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      {
        name: "Date",
        value: new Date("2024-01-01T00:00:00.000Z"),
        assertEqual: (a, b) => assert.strictEqual((a as Date).getTime(), (b as Date).getTime()),
      },
      {
        name: "RegExp",
        value: /hello/gi,
        assertEqual: (a, b) => {
          assert.strictEqual((a as RegExp).source, (b as RegExp).source);
          assert.strictEqual((a as RegExp).flags, (b as RegExp).flags);
        },
      },
      { name: "BigInt", value: BigInt("12345678901234567890"), assertEqual: (a, b) => assert.strictEqual(a, b) },
      {
        name: "Error",
        value: (() => {
          const e = new TypeError("something went wrong");
          return e;
        })(),
        assertEqual: (a, b) => {
          assert.strictEqual((a as Error).name, (b as Error).name);
          assert.strictEqual((a as Error).message, (b as Error).message);
        },
      },
      {
        name: "Symbol with description",
        value: Symbol("test"),
        assertEqual: (a, b) => assert.strictEqual((a as symbol).description, (b as symbol).description),
      },
      {
        name: "Symbol without description",
        value: Symbol(),
        assertEqual: (a, b) => {
          assert.strictEqual((a as symbol).description, "");
          assert.strictEqual((b as symbol).description, undefined);
        },
      },
    ];

    for (const c of edgecases) {
      it(`round-trips ${c.name}`, () => {
        const serialized = RichJSON.stringify(c.value);
        const deserialized = RichJSON.parse(serialized);
        c.assertEqual(deserialized, c.value);
      });
    }
  });

  describe("nested structures", () => {
    it("handles Map containing Set", () => {
      const value = new Map<string, Set<number>>([
        ["a", new Set([1, 2])],
        ["b", new Set([3, 4])],
      ]);
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized);
      assert.ok(deserialized instanceof Map);
      assert.deepStrictEqual((deserialized as Map<string, Set<number>>).get("a"), new Set([1, 2]));
      assert.deepStrictEqual((deserialized as Map<string, Set<number>>).get("b"), new Set([3, 4]));
    });

    it("handles array containing Date", () => {
      const dates = [new Date("2024-01-01"), new Date("2024-12-31")];
      const serialized = RichJSON.stringify(dates);
      const deserialized = RichJSON.parse(serialized) as Date[];
      assert.strictEqual(deserialized[0]!.getTime(), dates[0]!.getTime());
      assert.strictEqual(deserialized[1]!.getTime(), dates[1]!.getTime());
    });

    it("handles object containing Map, Set, and Date", () => {
      const value = {
        myMap: new Map([["key", "value"]]),
        mySet: new Set(["a", "b"]),
        nested: { date: new Date("2024-06-15") },
      };
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized) as typeof value;
      assert.ok(deserialized.myMap instanceof Map);
      assert.ok(deserialized.mySet instanceof Set);
      assert.ok(deserialized.nested.date instanceof Date);
      assert.strictEqual(deserialized.myMap.get("key"), "value");
      assert.deepStrictEqual(deserialized.mySet, new Set(["a", "b"]));
    });

    it("handles Map with BigInt keys and values", () => {
      const value = new Map<bigint, bigint>([
        [BigInt(1), BigInt(100)],
        [BigInt(2), BigInt(200)],
      ]);
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized);
      assert.ok(deserialized instanceof Map);
      const result = deserialized as Map<bigint, bigint>;
      assert.strictEqual(result.get(BigInt(1)), BigInt(100));
      assert.strictEqual(result.get(BigInt(2)), BigInt(200));
    });
  });

  describe("custom reviver", () => {
    it("applies reviver after type restoration", () => {
      const value = { date: new Date("2024-01-01T00:00:00.000Z") };
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized, (_key, val) => {
        if (val instanceof Date) return (val as Date).toISOString();
        return val;
      });
      assert.deepStrictEqual(deserialized, { date: "2024-01-01T00:00:00.000Z" });
    });
  });

  describe("custom replacer", () => {
    it("applies replacer after type encoding", () => {
      const value = { secret: "hidden", visible: 42 };
      const serialized = RichJSON.stringify(value, (key, val) => {
        if (key === "secret") return undefined;
        return val;
      });
      const deserialized = RichJSON.parse(serialized);
      assert.deepStrictEqual(deserialized, { visible: 42 });
    });

    it("replacer sees encoded special types", () => {
      const value = { date: new Date("2024-01-01T00:00:00.000Z") };
      const seen: unknown[] = [];
      RichJSON.stringify(value, (_key, val) => {
        seen.push(val);
        return val;
      });
      // The replacer should see the encoded Date object, not the original Date
      const encodedDate = seen.find(
        (v) => typeof v === "object" && v !== null && "__type" in v && (v as { __type: string }).__type === "Date",
      );
      assert.ok(encodedDate, "replacer should see encoded Date");
    });

    it("supports array replacer", () => {
      const value = { a: 1, b: 2, c: 3 };
      const serialized = RichJSON.stringify(value, ["a", "c"]);
      const deserialized = RichJSON.parse(serialized);
      assert.deepStrictEqual(deserialized, { a: 1, c: 3 });
    });
  });

  describe("undefined handling", () => {
    it("encodes undefined in object values", () => {
      const value = { a: 1, b: undefined };
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized);
      assert.deepStrictEqual(deserialized, { a: 1, b: undefined });
    });

    it("encodes undefined in arrays as tagged object", () => {
      const value = [1, undefined, 3];
      const serialized = RichJSON.stringify(value);
      const deserialized = RichJSON.parse(serialized);
      assert.deepStrictEqual(deserialized, [1, undefined, 3]);
    });
  });

  describe("pretty printing", () => {
    it("respects space parameter", () => {
      const value = { a: 1 };
      const serialized = RichJSON.stringify(value, null, 2);
      assert.ok(serialized.includes("\n"));
      assert.ok(serialized.includes("  "));
    });
  });
});

describe("native JSON with exported replacer and reviver", () => {
  it("round-trips tagged types via JSON.parse(text, reviver)", () => {
    const value = {
      map: new Map([["key", new Set([1, 2])]]),
      date: new Date("2024-01-01"),
    };
    // Use RichJSON.stringify to produce tagged JSON, then native parse with reviver
    const serialized = RichJSON.stringify(value);
    const deserialized = JSON.parse(serialized, reviver);
    const obj = deserialized as typeof value;
    assert.ok(obj.map instanceof Map);
    assert.ok(obj.map.get("key") instanceof Set);
    assert.ok(obj.date instanceof Date);
  });

  it("round-trips all special types via JSON.parse(text, reviver)", () => {
    const edgecases: { name: string; value: unknown; assertEqual: (a: unknown, b: unknown) => void }[] = [
      { name: "Map", value: new Map([["x", "y"]]), assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      { name: "Set", value: new Set([1, 2]), assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      {
        name: "Date",
        value: new Date("2024-06-15"),
        assertEqual: (a, b) => assert.strictEqual((a as Date).getTime(), (b as Date).getTime()),
      },
      {
        name: "RegExp",
        value: /test/g,
        assertEqual: (a, b) => {
          assert.strictEqual((a as RegExp).source, (b as RegExp).source);
          assert.strictEqual((a as RegExp).flags, (b as RegExp).flags);
        },
      },
      { name: "BigInt", value: BigInt(999), assertEqual: (a, b) => assert.strictEqual(a, b) },
      {
        name: "Symbol",
        value: Symbol("hi"),
        assertEqual: (a, b) => assert.strictEqual((a as symbol).description, (b as symbol).description),
      },
    ];

    for (const c of edgecases) {
      const serialized = RichJSON.stringify(c.value);
      const deserialized = JSON.parse(serialized, reviver);
      c.assertEqual(deserialized, c.value);
    }
  });

  it("encodes non-toJSON types via JSON.stringify(value, replacer)", () => {
    // Note: JSON.stringify calls toJSON() BEFORE the replacer, so types with
    // native toJSON (like Date) are already serialized before replacer sees them.
    // The replacer works for types WITHOUT toJSON: Map, Set, RegExp, BigInt, Error, Symbol.
    const value = {
      map: new Map([["a", 1]]),
      set: new Set([1, 2]),
      regex: /test/g,
      big: BigInt(999),
      sym: Symbol("hi"),
    };
    const serialized = JSON.stringify(value, replacer);
    const deserialized = JSON.parse(serialized, reviver);
    const obj = deserialized as typeof value;
    assert.ok(obj.map instanceof Map);
    assert.ok(obj.set instanceof Set);
    assert.strictEqual((obj.regex as RegExp).source, "test");
    assert.strictEqual(obj.big, BigInt(999));
    assert.strictEqual((obj.sym as symbol).description, "hi");
  });

  it("combines exported replacer with custom replacer", () => {
    const value = { map: new Map([["a", 1]]), secret: "hidden", visible: 42 };
    const filtered = JSON.stringify(value, (key, val) => {
      if (key === "secret") return undefined;
      return replacer(key, val);
    });
    const deserialized = JSON.parse(filtered, reviver) as typeof value;
    assert.ok(deserialized.map instanceof Map);
    assert.strictEqual(deserialized.secret, undefined);
    assert.strictEqual(deserialized.visible, 42);
  });
});
