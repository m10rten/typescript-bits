---
name: monorepo-guidelines
description: pnpm workspace monorepo patterns — workspace setup, package anatomy, TypeScript project references, build ordering, versioning, and publishing
---

# Monorepo Guidelines

Practical patterns for managing a pnpm workspace monorepo. Covers structure, build pipeline, TypeScript project references, and publishing.

## Workspace Setup

### `pnpm-workspace.yaml`

Declare which directories are packages:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

Root `package.json` holds only dev tooling and workspace-wide scripts. Never put runtime dependencies at the root.

```json
{
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "prettier": "^3.3.0"
  }
}
```

## Package Anatomy

Each package is self-contained:

```
packages/core/
  package.json    # own name, version, deps
  tsconfig.json   # extends root, adds composite
  src/
    index.ts
  tests/
    index.test.ts
```

`package.json` minimum shape:

```json
{
  "name": "@scope/core",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "node --test"
  }
}
```

No barrel re-exports. Consumers import from subpaths directly:

```ts
// ✅ — import from the package's declared export subpath
import { parse } from "@scope/core/parse";

// ❌ — barrel re-export: index.ts re-exports everything, defeating tree-shaking
import { parse } from "@scope/core"; // only acceptable if this is the canonical single entry
```

## `workspace:` Protocol

Reference sibling packages without publishing:

```json
{
  "dependencies": {
    "@scope/core": "workspace:*"
  }
}
```

`workspace:*` resolves to the local package during development. On publish, `pnpm publish` replaces it with the actual resolved semver version from the package's `package.json`. This means:

- Local: always the current source
- Published tarball: pinned semver — no `workspace:*` leaks

Use `workspace:^` or `workspace:~` if you need a range on publish instead of exact.

## Build Ordering

`pnpm -r build` runs build scripts in all packages in topological order — packages with no dependencies first.

Common filter patterns:

```bash
# Build only a single package and its dependencies
pnpm --filter @scope/app build

# Build packages that depend on @scope/core (affected)
pnpm --filter ...'@scope/core' build

# Build everything except one package
pnpm --filter '!@scope/docs' -r build
```

Always define the `build` script in every package — `pnpm -r` skips packages that lack the script.

## TypeScript Project References

Project references give TypeScript cross-package type-checking and incremental builds without running `tsc` on the whole tree.

### Root `tsconfig.json`

The root config is the base — it defines shared compiler options but is not a project itself:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

### Per-Package `tsconfig.json`

Each package extends root and enables `composite`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "references": [{ "path": "../core" }],
  "include": ["src"]
}
```

`composite: true` requirements:

- `rootDir` must be set
- `declaration: true` is implied
- All source files must be under `rootDir`

Build the whole graph from the root with:

```bash
tsc --build packages/app
```

This walks `references` and rebuilds only what changed.

## Shared Root Config Files

Place shared config at the root and extend per-package:

**`.prettierrc`** — one file at root, no per-package overrides.

**`.gitignore`** — root covers `node_modules/`, `dist/`, `.tsbuildinfo`. Packages add their own only for package-specific artifacts.

**`tsconfig.json`** — root defines `compilerOptions`; packages extend with `composite` and `references`. Never duplicate compiler options across packages.

## Root vs Per-Package Scripts

| Script           | Where to run    | Why                                          |
| ---------------- | --------------- | -------------------------------------------- |
| `build`          | `pnpm -r build` | Topological — respects dependency order      |
| `test`           | `pnpm -r test`  | Independent per package, safe to parallelise |
| `lint`           | Root or `-r`    | Shared config — root invocation is fine      |
| `type-check`     | `tsc --build`   | Project references handle the graph          |
| `prepublishOnly` | Per-package     | Must run in package context before publish   |

Avoid running `-r` for scripts that must run in a specific order — use `--filter` chains or `tsc --build` instead.

## Versioning Strategy

Two strategies — pick one and stay consistent:

**Lockstep (fixed):** All packages share the same version. Simpler, but every package bumps even if unchanged. Best for tightly-coupled packages released together.

**Independent:** Each package has its own version. More accurate, but consumers must track separate changelogs.

### Changesets

[Changesets](https://github.com/changesets/changesets) is the standard tool for both strategies:

```bash
# Record a change
pnpm changeset

# Bump versions based on recorded changesets
pnpm changeset version

# Publish all changed packages
pnpm changeset publish
```

Commit changeset files (`.changeset/*.md`) alongside the code changes that caused them. Never manually edit `CHANGELOG.md`.

## Publishing

### `package.json` publishing fields

```json
{
  "name": "@scope/core",
  "version": "1.2.0",
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "prepublishOnly": "pnpm build"
  }
}
```

Key rules:

- `files` whitelist — only ship `dist/`, never `src/` or `tests/`
- `exports` map — required for subpath imports and dual CJS/ESM
- `publishConfig.access: "public"` — required for scoped packages on the public registry
- `prepublishOnly` — always rebuild before publish; never publish stale `dist/`

### Dry-run before release

```bash
pnpm publish --dry-run
```

Verify the `files` field ships exactly what you intend — no source leaks, no missing types.

## Common Mistakes

| Mistake                                                                  | Fix                                                                  |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Runtime dep in root `package.json`                                       | Move it to the package that needs it                                 |
| `workspace:*` left in published tarball                                  | Use pnpm publish — it rewrites `workspace:` to resolved semver       |
| Missing `composite: true` in per-package tsconfig                        | Project references require `composite` on every referenced package   |
| `tsc -p tsconfig.json` instead of `tsc --build` for multi-package builds | `tsc --build` walks references; `-p` compiles one package only       |
| No `prepublishOnly` script                                               | Stale `dist/` gets published; always rebuild before publish          |
| Barrel re-exports in `src/index.ts`                                      | Import directly from source modules; barrels cause circular deps     |
| `pnpm -r build` ignores a package                                        | Package is missing a `build` script — `-r` skips packages without it |
| `exports` map missing `types` condition                                  | Consumers get no type-checking; always pair each entry with `types`  |
| Manually editing `CHANGELOG.md`                                          | Use changesets — manual edits break the automated release flow       |
| `outDir` not set per-package                                             | TypeScript emits into source tree; always set `outDir: "./dist"`     |
