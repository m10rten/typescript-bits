---
name: esm-best-practices
description: ESM-specific patterns for TypeScript and Node.js — file extensions, import.meta, dynamic imports, dual packages, and module resolution modes
---

# ESM Best Practices

Covers the ESM-specific layer on top of TypeScript and Node.js.

## `"type": "module"` in package.json

Setting `"type": "module"` makes Node.js treat all `.js` files in the package as ESM.

```json
{
  "type": "module"
}
```

What it enables:

- `import`/`export` syntax in `.js` files
- Top-level `await`
- `import.meta.url` — module-relative URL (see the [import.meta](#importmeta) section; `import.meta.dirname` requires Node 21.2+)

What it breaks:

- `require()` — no longer available (use dynamic `import()` or convert callers)
- `__dirname` / `__filename` — not defined in ESM (see [Interop Pitfalls](#common-interop-pitfalls))
- `module.exports` / `exports` — CJS-only
- JSON imports require an import assertion: `import data from "./data.json" with { type: "json" }`

Use `.mjs` / `.cjs` extensions to override per-file when mixing module systems within one package.

## File Extensions in Imports

TypeScript's ESM output requires explicit `.js` extensions on relative imports — even when the source file is `.ts`:

```ts
// ✅ Correct — TypeScript resolves foo.ts but emits the .js extension
import { parse } from "./parser.js";

// ❌ Wrong — fails at runtime; Node cannot find the file without an extension
import { parse } from "./parser";

// ✅ Correct for type-only imports
import type { ParseOptions } from "./parser.js";
```

The `.js` extension refers to the _emitted_ file, not the source. TypeScript understands this under `moduleResolution: node16 | nodenext | bundler`.

Importing a directory index requires an explicit path too:

```ts
// ❌ Node ESM does not auto-resolve index files
import { x } from "./utils";

// ✅ Explicit
import { x } from "./utils/index.js";
```

### Type-Only Imports

With `verbatimModuleSyntax: true` in tsconfig, type-only imports **must** use `import type`. The compiler emits an error if a type-only symbol is imported without the `type` keyword — it cannot safely erase the import at emit time otherwise.

```ts
// When verbatimModuleSyntax: true is set in tsconfig
// ✅ Correct — type-only import is explicitly marked
import type { ParseOptions } from "./parser.js";

// ❌ Compile error — ParseOptions is type-only but not marked `import type`
import { ParseOptions } from "./parser.js";
```

## Named vs Namespace Imports

Prefer named imports — they are statically analyzable and tree-shakeable:

```ts
// ✅ Named — only what you use is imported
import { readFile, writeFile } from "node:fs/promises";

// ✅ Namespace — acceptable when using many exports from one module as a unit
import * as path from "node:path";
path.join(a, b);
path.resolve(c);
```

Use namespace imports (`* as`) when:

- You use many exports from a single module and grouping adds readability
- Calling module-level functions that share a common prefix makes them clearer together
- You are re-exporting a third-party module under a local alias

Never use namespace imports to fake a barrel; import directly from the source file.

## Dynamic `import()`

Use dynamic imports for lazy loading and conditional module loading:

```ts
// Lazy load — only fetched when called
async function loadPlugin(name: string): Promise<Plugin> {
  const { default: plugin } = await import(`./plugins/${name}.js`);
  return plugin;
}

// Conditional — avoids loading dev-only code in production
if (process.env.NODE_ENV !== "production") {
  const { inspect } = await import("node:util");
  console.log(inspect(value, { depth: null }));
}
```

Dynamic `import()` always returns a `Promise<Module>` — the module object, not the default export. Destructure `default` explicitly if needed.

Avoid dynamic imports in hot paths — static imports are analyzed at load time; dynamic imports run the full module resolution pipeline on every call.

## `import.meta`

`import.meta` is only available in ESM modules.

```ts
// URL of the current module as a string
import.meta.url; // "file:///Users/you/project/src/server.js"

// Node 21.2+ — direct path equivalents of __dirname / __filename
import.meta.dirname; // "/Users/you/project/src"
import.meta.filename; // "/Users/you/project/src/server.js"

// For Node < 21.2, derive paths manually (see Interop Pitfalls)

// Resolve a path relative to the current module
const configPath = import.meta.resolve("./config.json");

// Construct an absolute path to a sibling file
import { fileURLToPath } from "node:url";
const assetPath = fileURLToPath(new URL("../assets/logo.png", import.meta.url));
```

`import.meta.resolve` returns a `file://` URL string, not a filesystem path. Wrap with `fileURLToPath` if you need a path.

## Top-Level Await

Top-level `await` is available in ESM entry points and modules:

```ts
// ✅ Load config before the module's exports are accessible to importers
const config = await loadConfig("./config.json");

export const db = await connectDatabase(config.databaseUrl);
```

Caveats:

- A module with top-level `await` **blocks all importers** until it resolves. Slow or failing awaits delay the entire application startup.
- Circular imports involving a top-level-awaiting module can deadlock — the import graph stalls waiting for a module that is waiting for itself.
- Never use top-level `await` in library modules unless the delay is intentional and documented. Prefer lazy initialization or factory functions.

```ts
// ✅ Factory pattern — caller controls when initialization runs
export async function createClient(url: string) {
  const conn = await connect(url);
  return { query: conn.query.bind(conn) };
}
```

## Dual CJS/ESM Packages

Expose both module formats using the `exports` field:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.js",
      "require": "./dist/utils.cjs"
    }
  }
}
```

The `types` condition must come **before** `import`/`require` — TypeScript resolves conditions in order.

### Dual Package Hazard

When both CJS and ESM entry points are loaded in the same process, any module-level state (singletons, caches, registries) is duplicated — one copy per format. Guard against this:

```ts
// ✅ Export pure functions and data — no module-level singletons
// ❌ Avoid module-level state that consumers rely on being shared
let _instance: Client | null = null;
export function getInstance() { ... } // breaks if CJS and ESM both load
```

If your package must hold shared state, expose a factory with an explicit registration step so the host app controls the singleton.

## Module Resolution Modes in tsconfig

| `moduleResolution` | When to use                                                    |
| ------------------ | -------------------------------------------------------------- |
| `node16`           | Node.js 16+ with `"type": "module"` or `.mts`/`.cts` files     |
| `nodenext`         | Alias for the latest `node*` behavior — prefer over `node16`   |
| `bundler`          | Vite, esbuild, webpack — extensions optional, CJS interop easy |

**Practical guidance:**

- Use `nodenext` for Node.js libraries and CLI tools — it enforces `.js` extensions and correct import conditions.
- Use `bundler` for frontend apps and packages consumed only through a bundler — it matches what bundlers actually do.
- Never use `node`, `node10`, or `classic` in new projects — they do not understand the `exports` field.

Pair `nodenext` with `"module": "nodenext"` and `"target": "es2022"` (or higher) for full ESM output.

## Common Interop Pitfalls

### `__dirname` / `__filename` in ESM

These globals do not exist in ESM. For Node 21.2+, use `import.meta.dirname` / `import.meta.filename`. For older Node:

```ts
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### `require()` in ESM

`require` is not defined in ESM. If you must call a CJS-only API:

```ts
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const legacy = require("./legacy-cjs-module.js");
```

Prefer converting the CJS module to ESM. Use `createRequire` only as a temporary bridge.

### Default Export Interop

CJS modules that set `module.exports = value` are exposed in ESM as the `default` export:

```ts
// CJS module: module.exports = { foo, bar }
import pkg from "some-cjs-package";
const { foo, bar } = pkg; // ✅

// ❌ Named imports from CJS default exports may fail depending on Node/bundler version
import { foo } from "some-cjs-package";
```

With `moduleResolution: nodenext`, TypeScript enforces this and will error on incorrect named imports from CJS packages. Set `"esModuleInterop": true` if consuming CJS packages that have a single default export.

## Common Mistakes

| Mistake                                                  | Fix                                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Omitting `.js` extension on relative imports             | Always write `./foo.js` even when the source is `.ts`                         |
| Using `__dirname` / `__filename` in ESM                  | Use `import.meta.dirname` (Node 21.2+) or `fileURLToPath` + `dirname`         |
| Calling `require()` in an ESM file                       | Use `createRequire(import.meta.url)` or convert to `import`                   |
| Top-level `await` in a library module                    | Use a factory function — callers control initialization timing                |
| Module-level singletons in a dual package                | Dual loading creates two instances; use explicit registration                 |
| Named imports from a CJS `module.exports` object         | Destructure the `default` export; don't rely on named re-exports              |
| `moduleResolution: node` with `"type": "module"`         | Use `nodenext` — `node` ignores the `exports` field entirely                  |
| Missing `"types"` condition before `"import"` in exports | TypeScript resolves conditions in order; `types` must be first                |
| Dynamic `import()` in hot paths                          | Use static imports; dynamic imports add resolution overhead per call          |
| JSON import without assertion                            | Add `with { type: "json" }` or use `readFile` + `JSON.parse`                  |
| Importing a type-only symbol without `import type`       | `verbatimModuleSyntax: true` requires `import type` for all type-only imports |
