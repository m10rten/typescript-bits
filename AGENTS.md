# AGENTS.md — typescript-bits

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
src/          # Library source code (rootDir for build)
src/bin/      # CLI / binary tool source (not library modules)
tests/        # Tests (colocated naming: <module>.test.ts)
dist/         # Build output (generated, do not edit)
docs/api/     # API documentation per module
poc/          # Proof-of-concept / scratch code (excluded from build)
```

> `src/bin/cli/` is the `npx typescript-bits` CLI. It is **not** a library module — exclude
> it from any module-discovery or package-generation logic (the app's
> `source-files.ts` already skips it).

---

## Development Flow

### Red-Green-Refactor

1. **Red** — Write a failing test in `tests/<module>.test.ts`
2. **Green** — Implement minimal code in `src/<module>.ts` to pass
3. **Refactor** — Clean up while keeping tests green

### Commands

```
pnpm build          # Build with zshy
pnpm typecheck      # Type-check only (tsc --noEmit)
pnpm format         # Format all files with Prettier
pnpm format:check   # Check formatting (pre-commit)
```

### Testing

- Use Node's native `node:test` and `node:assert/strict`
- Test files live in `tests/` with `<module>.test.ts` naming
- Write repetitive tests using an `edgecases` array and a `for` loop

---

## Shared Code

When updating, creating, or removing shared code, update this AGENTS.md if conventions change.
