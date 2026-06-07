# AGENTS.md - typescript-bits

## Project Overview

A collection of TypeScript utility primitives (Result, deferred, cache, queue, etc.) published as an ESM package.

- **Package manager:** pnpm
- **Runtime:** Node.js (ESM, `"type": "module"`)
- **Build:** zshy (tsc under the hood)
- **Formatter:** Prettier only — no ESLint

---

## Code Style

- **Production first** — quality over quantity, always. Every piece of code must be production-ready before merging. No shortcuts, no "we'll fix it later".
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
- **Prettier** — run `pnpm format` before committing; pre-commit hook enforces `pnpm format:check && pnpm typecheck`
- **Node native** — prefer built-in Node APIs over third-party packages where possible
- **JSDoc** — only for externally-exported code and complex logic; skip for trivial internal functions
- **No barrel exports** — never use `export {}` or re-export modules through index files; import directly from source files
- **Self-documenting code** — DRY, KISS, meaningful names over comments

---

## Project Structure

```
packages/     # Monorepo packages (one per module)
  atom/       # @typescript-bits/atom
  json/       # @typescript-bits/json
  queue/      # @typescript-bits/queue
  reset/      # @typescript-bits/reset (subpath exports: array, fetch, filter, json, map, set)
  result/     # @typescript-bits/result
  retry/      # @typescript-bits/retry (depends on result, safe)
  safe/       # @typescript-bits/safe (depends on result)
  types/      # @typescript-bits/types
app/          # Next.js demo app
bin/cli.ts    # CLI binary (npx typescript-bits), not part of any library package
  dist/         # Root-level build output (CLI + all packages compiled for umbrella `typescript-bits` entrypoints)
docs/api/     # API documentation per module
poc/          # Proof-of-concept / scratch code (excluded from build)
```

> Each package has its own `package.json`, `tsconfig.json`, `src/`, and `tests/`.
> All packages are built with `zshy` via `pnpm -r --filter @typescript-bits/* build`.
> Root `zshy` re-compiles all package sources into `dist/packages/<name>/src/` for the umbrella `typescript-bits` package (single installation, all modules).
> Root `package.json` declares all `@typescript-bits/*` as `dependencies: workspace:*` so cross-package imports (`@typescript-bits/result` from `safe`) resolve from root `dist/` output.
> Tests use `tsx` and live in each package's `tests/` directory.

---

## Development Flow

### Red-Green-Refactor

1. **Red** — Write a failing test in `tests/<module>.test.ts`
2. **Green** — Implement minimal code in `src/<module>.ts` to pass
3. **Refactor** — Clean up while keeping tests green

### Commands

```
pnpm build          # Per-package builds → root umbrella build → app build
pnpm typecheck      # Type-check only (tsc --noEmit)
pnpm format         # Format all files with Prettier
pnpm format:check   # Check formatting (pre-commit)
pnpm test           # Run all tests via tsx
```

### Testing

- Use Node's native `node:test` and `node:assert/strict`
- Test files live in `tests/` with `<module>.test.ts` naming
- Write repetitive tests using an `edgecases` array and a `for` loop

---

## Shared Code

When updating, creating, or removing shared code, update this AGENTS.md if conventions change.
