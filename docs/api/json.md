# RichJSON

Extended JSON serialization/deserialization supporting additional JavaScript types beyond the native JSON spec.

## Wire Format

Special types are encoded as tagged objects with a `__type` discriminator:

| Type        | Wire Format                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `Map`       | `{"__type":"Map","value":[[k,v],...]}`                                    |
| `Set`       | `{"__type":"Set","value":[...]}`                                          |
| `undefined` | `{"__type":"undefined"}`                                                  |
| `Date`      | `{"__type":"Date","value":"ISO-8601 string"}`                             |
| `RegExp`    | `{"__type":"RegExp","value":{"source":"...","flags":"..."}}`              |
| `BigInt`    | `{"__type":"BigInt","value":"string representation"}`                     |
| `Error`     | `{"__type":"Error","value":{"name":"...","message":"...","stack":"..."}}` |
| `Symbol`    | `{"__type":"Symbol","value":"description"}`                               |

## API

### `RichJSON.parse(text, reviver?)`

Parses a JSON string and restores encoded special types.

**Parameters:**

- `text: string` — JSON string to parse
- `reviver?: (key: string, value: unknown) => unknown` — optional custom reviver applied after type restoration

**Returns:** `unknown` — the deserialized value with special types restored.

### `RichJSON.stringify(value, replacer?, space?)`

Serializes a value to JSON, encoding supported special types using the wire format. Uses pre-encoding to handle types with native `toJSON()` methods (like `Date`).

**Parameters:**

- `value: unknown` — value to serialize
- `replacer?: ((key: string, value: unknown) => unknown) | (string | number)[] | null` — optional replacer function or array
- `space?: string | number | null` — optional whitespace for pretty-printing

**Returns:** `string` — JSON string with special types encoded.

### `reviver(key, value)`

Standalone reviver for use with native `JSON.parse(text, reviver)`. Useful when you receive tagged JSON from an external source and want to restore types using the native parser.

### `replacer(key, value)`

Standalone replacer for use with native `JSON.stringify(value, replacer)`. Encodes special types into the wire format.

**Limitation:** `JSON.stringify` calls `toJSON()` on values BEFORE the replacer. Types with native `toJSON()` (like `Date`) are already serialized before `replacer` sees them. For full support of all types including `Date`, use `RichJSON.stringify` instead. The exported `replacer` works correctly for types without `toJSON()`: `Map`, `Set`, `RegExp`, `BigInt`, `Error`, `Symbol`, `undefined`.

## Usage

```ts
import { RichJSON, replacer, reviver } from "typescript-bits/json";

// Using RichJSON helpers (recommended — handles all types including Date)
const json = RichJSON.stringify({ map: new Map([["a", 1]]), date: new Date() });
const parsed = RichJSON.parse(json);

// Using native JSON.parse with exported reviver
const parsed2 = JSON.parse(json, reviver);

// Using native JSON.stringify with exported replacer (works for non-toJSON types)
const json2 = JSON.stringify({ map: new Map([["a", 1]]) }, replacer);
const parsed3 = JSON.parse(json2, reviver);

// Combining replacer with custom filtering
const json3 = JSON.stringify({ map: new Map([["a", 1]]), secret: "hidden" }, (key, val) =>
  key === "secret" ? undefined : replacer(key, val),
);
```

## Supported Types

- `Map<K, V>` — entries serialized as `[key, value]` pairs
- `Set<T>` — values serialized as an array
- `undefined` — encoded as a tagged object
- `Date` — serialized to ISO 8601 string
- `RegExp` — serialized with `source` and `flags`
- `BigInt` — serialized as a string (lossless round-trip)
- `Error` — serialized with `name`, `message`, and `stack`
- `Symbol` — serialized by description only (not fully round-trippable)

## Notes

- Does **not** override global `JSON.parse`/`JSON.stringify`.
- Nested structures are fully supported (e.g., a `Map` containing a `Set`).
- Symbols without a description are serialized as `{"__type":"Symbol","value":""}`.
- When using a custom replacer with `RichJSON.stringify`, the replacer is applied **after** type encoding, so it sees the encoded tagged values (e.g., `{ __type: "Date", value: "..." }`).
- `RichJSON.stringify` uses pre-encoding rather than a replacer function internally, ensuring types with native `toJSON()` methods (like `Date`) are handled correctly.
