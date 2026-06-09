---
name: zod-best-practices
description: Production-ready Zod 4 patterns — schema composition, parsing, error handling, transforms, and performance for type-safe runtime validation
---

# Zod Best Practices

Practical Zod v4 patterns for type-safe runtime validation. Requires **TypeScript 5.5+** and `strict: true`. Ships as `zod` on npm.

## Schema Definition

Compose schemas from small, reusable pieces:

```ts
const nameSchema = z.object({ first: z.string().min(1), last: z.string().min(1) });
const addressSchema = z.object({ street: z.string(), city: z.string(), zip: z.string() });
const userSchema = z.object({ name: nameSchema, address: addressSchema });
```

Use `.extend()` to add fields — replaces the deprecated `.merge()`:

```ts
const baseEntity = z.object({ id: z.uuid(), createdAt: z.iso.datetime() });
const userSchema = baseEntity.extend({ email: z.email() });
```

Use spread syntax for full control:

```ts
const userSchema = z.strictObject({ ...baseEntity.shape, email: z.email() });
```

### Object Strictness

| Behavior              | Zod 3 (deprecated)  | Zod 4                      |
| --------------------- | ------------------- | -------------------------- |
| Strip unknown keys    | `z.object({...})`   | `z.object({...})` (same)   |
| Throw on unknown keys | `.strict()`         | `z.strictObject({...})`    |
| Pass through unknowns | `.passthrough()`    | `z.looseObject({...})`     |
| Validate unknowns     | `.catchall(schema)` | `.catchall(schema)` (same) |

### Optional, Nullable, Defaults

| Modifier       | Behavior                                                        |
| -------------- | --------------------------------------------------------------- |
| `.optional()`  | Accepts `undefined` (key may be absent)                         |
| `.nullable()`  | Accepts `null`                                                  |
| `.nullish()`   | Accepts both (prefered - most forgiving)                        |
| `.default(v)`  | Short-circuits — returns `v` unparsed when input is `undefined` |
| `.prefault(v)` | Pre-parse default — runs `v` through the schema                 |
| `.catch(v)`    | Returns `v` on invalid input instead of throwing                |

`.default()` no longer re-parses. Use `.prefault()` when the default must be validated/transformed:

```ts
const config = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).prefault(20),
});
```

Defaults inside object properties now apply even within optional fields.

## Type Inference

```ts
const UserSchema = z.object({ id: z.uuid(), email: z.email() });

type User = z.output<typeof UserSchema>; // after transforms/defaults
type Input = z.input<typeof UserSchema>; // before transforms/defaults
type Same = z.infer<typeof UserSchema>; // shorthand, no transforms
```

## Parsing

- **`safeParse`** — never throws. Use for all external data (API, forms, files). Returns `{ success, data }` or `{ success, error }`:
  ```ts
  const result = schema.safeParse(input);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return { fieldErrors };
  }
  ```
- **`parse`** — throws `ZodError`. Use for known-valid data (cache, invariants).
- **`parseAsync`/`safeParseAsync`** — required when `.refine()`/`.superRefine()` returns a promise.

## String Formats

Zod 4 promotes format validators to top-level functions. Method forms (`z.string().email()`) are deprecated.

```ts
z.email();
z.uuid();
z.uuidv4();
z.guid();
z.nanoid();
z.ulid();
z.cuid2();
z.jwt();
z.url();
z.httpUrl();
z.ipv4();
z.ipv6();
z.cidrv4();
z.cidrv6();
z.mac();
z.base64();
z.base64url();
z.hex();
z.hash("sha256");
z.e164();
z.emoji();
z.stringbool();
z.iso.date();
z.iso.time();
z.iso.datetime({ offset: true });
z.iso.duration();
z.string().trim().toLowerCase().toUpperCase().normalize(); // built-in transforms
z.email({ pattern: z.regexes.html5Email }); // custom email regex
```

## Template Literals

Model typed string patterns with type-level precision:

```ts
const route = z.templateLiteral(["/users/", z.string().uuid()]);
// `/users/${string}`
const css = z.templateLiteral([z.number(), z.enum(["px", "em"])]);
// `${number}px` | `${number}em`
```

## Validation & Refinement

All Zod 4 refinements use a unified `error` parameter object (replaces deprecated `message`, `errorMap`, `invalid_type_error`, `required_error`).

### `.refine()`

```ts
z.string()
  .min(8)
  .refine((v) => /[A-Z]/.test(v), { error: "Needs uppercase" });

// Options: error (string|function), path (attribute to field), abort (stop on first failure)
z.object({ pw: z.string(), confirm: z.string() }).refine((d) => d.pw === d.confirm, {
  error: "No match",
  path: ["confirm"],
});
```

### `.superRefine()` — Multi-Error

```ts
z.string().superRefine((val, ctx) => {
  if (val.length < 8) ctx.addIssue({ code: "too_small", minimum: 8, type: "string", inclusive: true });
  if (!/[A-Z]/.test(val)) ctx.addIssue({ code: "custom", message: "Needs uppercase" });
});
```

### `.check()` — Fast Alternative

For performance-sensitive paths (faster than `.superRefine()`):

```ts
z.string().check(z.property("length", z.number().min(10)));
```

### `.when()` — Conditional Refinement

```ts
schema.refine(validator, { error: "...", when: (p) => precheck.safeParse(p.value).success });
```

## Transforms & Codecs

```ts
const slug = z.string().transform((s) => s.toLowerCase().replace(/\s+/g, "-"));
const trimmed = z.string().overwrite((v) => v.trim()); // keeps inferred type

// Bidirectional codec
const stod = z.codec(z.iso.datetime(), z.date(), {
  decode: (s) => new Date(s),
  encode: (d) => d.toISOString(),
});
stod.parse("2024-01-15T10:30:00.000Z"); // forward → Date
z.encode(stod, new Date()); // reverse → string
```

## Error Handling

Use `result.error.issues` to inspect failures. `.format()`/`.flatten()` are deprecated — use top-level functions:

| Function                 | Output                              | Use Case                  |
| ------------------------ | ----------------------------------- | ------------------------- |
| `z.treeifyError(error)`  | Nested object matching schema shape | Nested error display      |
| `z.flattenError(error)`  | `{ formErrors, fieldErrors }`       | Simple field-level errors |
| `z.prettifyError(error)` | Human-readable string with paths    | Debugging                 |

```ts
const { fieldErrors } = z.flattenError(result.error);
// { email: ["Invalid"], name: ["Required"] }
```

### Custom Messages

```ts
z.string({ error: "Not a string!" });
z.string().min(5, { error: "Too short" });
z.email({ error: (iss) => (iss.input === undefined ? "Required" : "Invalid") });

// Global
z.config({
  customError: (iss) => {
    if (iss.code === "invalid_type") return `Expected ${iss.expected}, got ${iss.received}`;
  },
});

// Per-parse (lower precedence)
schema.parse(input, { error: (iss) => "override", reportInput: true });

// i18n
z.config(z.locales.fr());
```

Locales: `ar`, `de`, `en`, `es`, `fr`, `it`, `ja`, `ko`, `nl`, `pl`, `pt`, `ru`, `sv`, `th`, `tr`, `vi`, `zhCN`, `zhTW`.

## Discriminated Unions

Prefer over `z.union` when variants share a literal key — faster, clearer errors:

```ts
const Response = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), data: z.unknown() }),
  z.object({ status: z.literal("error"), error: z.string() }),
]);
```

## Recursive Schemas

Use getter syntax (replaces `z.lazy()`):

```ts
const Category = z.object({
  name: z.string(),
  get subcategories() {
    return z.array(Category);
  },
});
```

Add explicit return types when TypeScript can't resolve mutual recursion:

```ts
get subs(): z.ZodNullable<z.ZodArray<typeof Activity>> { return z.nullable(z.array(Activity)); }
```

`.pick()`, `.omit()`, `.partial()` all work with recursive schemas.

## Performance

- **Define schemas at module scope** — never inside handlers/loops
- **`z.interface()` for hot paths** — faster than `z.object()`, but no `.extend()`/`.pick()`/`.omit()`
- **Prefer spread over chained `.extend()`** — TypeScript gets quadratically slower per chain
- **Discriminated unions > plain unions** — checks key first
- **`.pick()`/`.omit()` are free** — derived without re-parsing

```ts
// ❌ Schema per request
app.post("/data", (req) => z.object({...}).parse(req.body));

// ✅ Module scope
const DataSchema = z.object({...});
```

## Edge Cases

- **Coercion** — `z.coerce.number()`, `z.coerce.boolean()`, `z.coerce.string()` for FormData/query/headers
- **Branded types** — `z.uuid().brand<"UserId">()` for nominal typing
- **`.catch()`** — fallback on parse failure instead of throwing
- **Multi-literal** — `z.literal(["red", "green", "blue"])`
- **JSON Schema** — `schema.toJSONSchema()` for OpenAPI/AI tools

## Zod Mini

Tree-shakable ~2KB for edge/serverless. Functional API, no locales or JSON Schema:

```ts
import { object, string, email } from "zod/mini";
const s = object({ name: string(), email: email() });
```

## Common Mistakes

| Mistake                                             | Fix                                                         |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `parse` for untrusted input                         | Use `safeParse`                                             |
| Schemas inside handlers                             | Hoist to module scope                                       |
| `z.union` when discriminant exists                  | Use `z.discriminatedUnion`                                  |
| Old error APIs (`message`, `errorMap`, `.format()`) | Use unified `error` + `z.flattenError()`/`z.treeifyError()` |
| `.merge()`, `.strict()`, `.passthrough()`           | Use `.extend()`, `z.strictObject()`, `z.looseObject()`      |
| `z.lazy()` for recursive                            | Use getter syntax                                           |
| `.default()` expecting re-parsed value              | Use `.prefault()`                                           |
| `.string().email()` style                           | Use `z.email()` (top-level, tree-shakable)                  |
| Chained `.extend()`                                 | Use spread: `z.object({ ...base.shape, ... })`              |
| Forgetting async variants                           | Use `safeParseAsync`/`parseAsync` for async refine          |
