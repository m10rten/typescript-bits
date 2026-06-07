import { describe, it } from "node:test";
import assert from "node:assert";
import { RichJSON, replacer, reviver } from "../src/index.js";

describe("RichJSON", () => {
  describe("parse / stringify round-trips", () => {
    const edgecases: { name: string; value: unknown; assertEqual: (a: unknown, b: unknown) => void }[] = [
      { name: "string", value: "hello", assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "number", value: 42, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "boolean", value: true, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "null", value: null, assertEqual: (a, b) => assert.strictEqual(a, b) },
      { name: "array", value: [1, "two", true], assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      { name: "plain object", value: { a: 1, b: "two" }, assertEqual: (a, b) => assert.deepStrictEqual(a, b) },
      {
        name: "Map",
        value: new Map([["a", 1]]),
        assertEqual: (a, b) => {
          assert.ok(a instanceof Map);
          assert.ok(b instanceof Map);
          assert.deepStrictEqual([...a], [...b]);
        },
      },
      {
        name: "Set",
        value: new Set([1, 2, 3]),
        assertEqual: (a, b) => {
          assert.ok(a instanceof Set);
          assert.ok(b instanceof Set);
          assert.deepStrictEqual([...a], [...b]);
        },
      },
      {
        name: "Date",
        value: new Date("2024-01-01"),
        assertEqual: (a, b) => {
          assert.ok(a instanceof Date);
          assert.ok(b instanceof Date);
          assert.strictEqual(a.getTime(), b.getTime());
        },
      },
      {
        name: "RegExp",
        value: /test/gi,
        assertEqual: (a, b) => {
          assert.ok(a instanceof RegExp);
          assert.ok(b instanceof RegExp);
          assert.strictEqual(a.source, b.source);
          assert.strictEqual(a.flags, b.flags);
        },
      },
      {
        name: "BigInt",
        value: BigInt(9007199254740991),
        assertEqual: (a, b) => {
          assert.strictEqual(typeof a, "bigint");
          assert.strictEqual(typeof b, "bigint");
          assert.strictEqual(a, b);
        },
      },
      {
        name: "Error",
        value: new Error("test error"),
        assertEqual: (a, b) => {
          assert.ok(a instanceof Error);
          assert.ok(b instanceof Error);
          assert.strictEqual(a.message, b.message);
          assert.ok(!!a.stack);
          assert.ok(!!b.stack);
        },
      },
      {
        name: "Symbol with description",
        value: Symbol("test-sym"),
        assertEqual: (a, b) => {
          assert.strictEqual(typeof a, "symbol");
          assert.strictEqual(typeof b, "symbol");
          assert.strictEqual(a.description, b.description);
        },
      },
      {
        name: "Symbol without description",
        value: Symbol(),
        assertEqual: (a, b) => {
          assert.strictEqual(typeof a, "symbol");
          assert.strictEqual(typeof b, "symbol");
          assert.strictEqual(a.description, undefined);
        },
      },
    ];

    for (const { name, value, assertEqual } of edgecases) {
      it(`round-trips ${name}`, () => {
        const json = RichJSON.stringify(value);
        const parsed = RichJSON.parse(json);
        assertEqual(value, parsed);
      });
    }
  });

  describe("nested structures", () => {
    it("handles Map containing Set", () => {
      const original = new Map<string, Set<number>>();
      original.set("a", new Set([1, 2, 3]));
      const json = RichJSON.stringify(original);
      const parsed = RichJSON.parse(json);
      assert.ok(parsed instanceof Map);
      const set = parsed.get("a");
      assert.ok(set instanceof Set);
      assert.deepStrictEqual([...set], [1, 2, 3]);
    });

    it("handles array containing Date", () => {
      const original = [new Date("2024-06-15")];
      const json = RichJSON.stringify(original);
      const parsed = RichJSON.parse(json);
      assert.ok(Array.isArray(parsed));
      assert.ok(parsed[0] instanceof Date);
      assert.strictEqual((parsed[0] as Date).getTime(), original[0]!.getTime());
    });

    it("handles object containing Map, Set, and Date", () => {
      const original = {
        map: new Map([["x", 10]]),
        set: new Set(["a", "b"]),
        date: new Date("2024-01-01"),
      };
      const json = RichJSON.stringify(original);
      const parsed = RichJSON.parse(json) as typeof original;
      assert.ok(parsed.map instanceof Map);
      assert.ok(parsed.set instanceof Set);
      assert.ok(parsed.date instanceof Date);
      assert.strictEqual(parsed.map.get("x"), 10);
      assert.ok(parsed.set.has("a"));
      assert.strictEqual(parsed.date.getTime(), original.date.getTime());
    });
  });

  describe("custom reviver", () => {
    it("applies reviver after type restoration", () => {
      const input = { value: 42 };
      const json = RichJSON.stringify(input);
      const reviverFn = (_key: string, val: unknown) => (typeof val === "number" ? val * 2 : val);
      const parsed = RichJSON.parse(json, reviverFn) as { value: number };
      assert.strictEqual(parsed.value, 84);
    });
  });

  describe("custom replacer", () => {
    it("applies replacer after type encoding", () => {
      const input = { secret: 42 };
      const replacerFn = (key: string, val: unknown) => (key === "secret" ? undefined : val);
      const json = RichJSON.stringify(input, replacerFn);
      const parsed = RichJSON.parse(json) as { secret: number };
      assert.strictEqual(parsed.secret, undefined);
    });

    it("replacer sees encoded special types", () => {
      const input = new Map([["a", 1]]);
      const seen: unknown[] = [];
      const replacerFn = (key: string, val: unknown) => {
        seen.push(val);
        return val;
      };
      RichJSON.stringify(input, replacerFn);
      assert.ok(seen.length > 0);
    });

    it("supports array replacer", () => {
      const input = { a: 1, b: 2, c: 3 };
      const json = RichJSON.stringify(input, ["a"]);
      const parsed = RichJSON.parse(json) as { a: number; b?: number };
      assert.strictEqual(parsed.a, 1);
      assert.strictEqual(parsed.b, undefined);
    });
  });

  describe("undefined handling", () => {
    it("encodes undefined in object values", () => {
      const input = { a: 1, b: undefined };
      const json = RichJSON.stringify(input);
      const parsed = RichJSON.parse(json) as { a: number; b: undefined };
      assert.strictEqual(parsed.a, 1);
      assert.strictEqual(parsed.b, undefined);
    });

    it("encodes undefined in arrays as tagged object", () => {
      const input = [1, undefined, 3];
      const json = RichJSON.stringify(input);
      const parsed = RichJSON.parse(json) as (number | undefined)[];
      assert.strictEqual(parsed[0], 1);
      assert.strictEqual(parsed[1], undefined);
      assert.strictEqual(parsed[2], 3);
    });
  });

  describe("pretty printing", () => {
    it("respects space parameter", () => {
      const input = { a: 1, b: 2 };
      const json = RichJSON.stringify(input, null, 2);
      const lines = json.split("\n");
      assert.ok(lines.length > 1);
      for (const line of lines) {
        assert.ok(!line || line.startsWith(" ") || line.startsWith("{") || line.startsWith("}"));
      }
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
