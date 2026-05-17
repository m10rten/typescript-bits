type TaggedValue =
  | { __type: "Map"; value: [unknown, unknown][] }
  | { __type: "Set"; value: unknown[] }
  | { __type: "undefined" }
  | { __type: "Date"; value: string }
  | { __type: "RegExp"; value: { source: string; flags: string } }
  | { __type: "BigInt"; value: string }
  | { __type: "Error"; value: { name: string; message: string; stack: string } }
  | { __type: "Symbol"; value: string };

const RECOGNIZED_TYPES = ["Map", "Set", "undefined", "Date", "RegExp", "BigInt", "Error", "Symbol"] as const;

function isTaggedValue(value: unknown): value is TaggedValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "__type" in value &&
    RECOGNIZED_TYPES.includes((value as TaggedValue).__type as (typeof RECOGNIZED_TYPES)[number])
  );
}

function restoreType(value: TaggedValue): unknown {
  switch (value.__type) {
    case "Map":
      return new Map(value.value as [unknown, unknown][]);
    case "Set":
      return new Set(value.value);
    case "undefined":
      return undefined;
    case "Date":
      return new Date(value.value);
    case "RegExp":
      return new RegExp(value.value.source, value.value.flags);
    case "BigInt":
      return BigInt(value.value);
    case "Error": {
      const err = new Error(value.value.message);
      err.name = value.value.name;
      err.stack = value.value.stack;
      return err;
    }
    case "Symbol":
      return Symbol(value.value);
  }
}

function encodeValue(value: unknown): unknown {
  if (value instanceof Map) {
    return {
      __type: "Map",
      value: Array.from(value.entries()).map(([k, v]) => [encodeValue(k) ?? k, encodeValue(v) ?? v]),
    };
  }
  if (value instanceof Set) {
    return { __type: "Set", value: Array.from(value).map((item) => encodeValue(item) ?? item) };
  }
  if (value === undefined) {
    return { __type: "undefined" };
  }
  if (value instanceof Date) {
    return { __type: "Date", value: value.toISOString() };
  }
  if (value instanceof RegExp) {
    return { __type: "RegExp", value: { source: value.source, flags: value.flags } };
  }
  if (typeof value === "bigint") {
    return { __type: "BigInt", value: value.toString() };
  }
  if (value instanceof Error) {
    return {
      __type: "Error",
      value: { name: value.name, message: value.message, stack: value.stack ?? "" },
    };
  }
  if (typeof value === "symbol") {
    return { __type: "Symbol", value: value.description ?? "" };
  }
  return undefined;
}

/** Replacer for use with native `JSON.stringify(value, replacer)`. Encodes special types. */
export function replacer(_key: string, value: unknown): unknown {
  return encodeValue(value) ?? value;
}

/** Reviver for use with native `JSON.parse(text, reviver)`. Restores tagged special types. */
export function reviver(_key: string, value: unknown): unknown {
  if (isTaggedValue(value)) {
    return restoreType(value);
  }
  return value;
}

export namespace RichJSON {
  export function parse(text: string, userReviver?: (key: string, value: unknown) => unknown): unknown {
    const parsed = JSON.parse(text);
    return restoreWalk("", parsed, userReviver);
  }

  export function stringify(
    value: unknown,
    userReplacer?: ((key: string, value: unknown) => unknown) | (string | number)[] | null,
    space?: string | number | null,
  ): string {
    const encoded = encodeWithReplacer(value, userReplacer);
    return JSON.stringify(encoded, null, space ?? undefined);
  }
}

function restoreWalk(key: string, value: unknown, userReviver?: (key: string, value: unknown) => unknown): unknown {
  if (Array.isArray(value)) {
    const restored = value.map((item, i) => restoreWalk(String(i), item, userReviver));
    return userReviver ? userReviver(key, restored) : restored;
  }

  if (typeof value === "object" && value !== null) {
    if (isTaggedValue(value)) {
      const restored = restoreTagged(value);
      return userReviver ? userReviver(key, restored) : restored;
    }

    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = restoreWalk(k, v, userReviver);
    }
    return userReviver ? userReviver(key, result) : result;
  }

  return userReviver ? userReviver(key, value) : value;
}

function restoreTagged(value: TaggedValue): unknown {
  switch (value.__type) {
    case "Map": {
      const m = new Map();
      for (const [k, v] of value.value) {
        m.set(restoreWalk("", k), restoreWalk("", v));
      }
      return m;
    }
    case "Set": {
      const s = new Set();
      for (const item of value.value) {
        s.add(restoreWalk("", item));
      }
      return s;
    }
    case "undefined":
      return undefined;
    case "Date":
      return new Date(value.value);
    case "RegExp":
      return new RegExp(value.value.source, value.value.flags);
    case "BigInt":
      return BigInt(value.value);
    case "Error": {
      const err = new Error(value.value.message);
      err.name = value.value.name;
      err.stack = value.value.stack;
      return err;
    }
    case "Symbol":
      return Symbol(value.value);
  }
}

function encodeWithReplacer(
  value: unknown,
  userReplacer?: ((key: string, value: unknown) => unknown) | (string | number)[] | null,
): unknown {
  const fnReplacer = typeof userReplacer === "function" ? userReplacer : undefined;
  const keySet = Array.isArray(userReplacer) ? new Set(userReplacer.map(String)) : undefined;

  function walk(key: string, val: unknown): unknown {
    // Encode special types first (bypasses toJSON problem)
    let processed = encodeValue(val) ?? val;

    // Apply user replacer to encoded value
    if (fnReplacer) {
      processed = fnReplacer(key, processed);
      if (processed === undefined) return undefined;
    }

    // Filter by key set
    if (keySet && key !== "" && !keySet.has(key)) return undefined;

    // Recurse into arrays
    if (Array.isArray(processed)) {
      return processed.map((item, i) => walk(String(i), item));
    }

    // Recurse into objects
    if (typeof processed === "object" && processed !== null) {
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(processed)) {
        const encodedVal = walk(k, v);
        if (encodedVal !== undefined) {
          result[k] = encodedVal;
        }
      }
      return result;
    }

    return processed;
  }

  return walk("", value);
}
