# Codec

A bidirectional encoder/decoder for safe data transformation at system boundaries.

```ts
export interface Codec<I, O> {
  encode(input: I): O;
  decode(output: O): I;
}
```

- **encode** — transforms internal representation to external format.
- **decode** — transforms external format back to internal representation, throwing on invalid input.
