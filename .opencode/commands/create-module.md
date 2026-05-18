---
description: Create a new module with interface, tests, and implementation
---

Create a new module from this request: `$ARGUMENTS`

Extract `<name>` and optional `<?desc?>` from the arguments. If no description, use "A utility module."

Follow this flow strictly, one step at a time. Wait for my input where indicated.

## Conventions

- Source: `src/<name>.ts` — export types + namespace with functions
- Tests: `tests/<name>.test.ts` — use `node:test`, `node:assert/strict`, edgecases array + for loop
- Docs: `docs/api/<name>.md` — type signatures + brief descriptions
- Naming: PascalCase for types/namespaces, camelCase for functions
- Style: strict TS, DRY, KISS, JSDoc only for external/complex code

## Steps

### 1. Write interface

Propose the public API (types, interfaces, namespace functions) for `<name>`. Keep it minimal.

### 2. Accept or decline

**Stop and wait.** Ask me to accept or decline the interface. If I decline, revise and ask again.

### 3. Write docs

Write `docs/api/<name>.md` with type signatures and brief descriptions (see `docs/api/result.md` for format).

### 4. Write implementation stub

Write `src/<name>.ts` with the full interface. Functions should throw `"Not implemented"` initially.
If multiple files for the module, then: `src/<name>/<sub*|index>.ts`

### 5. Write unit tests (red)

Write `tests/<name>.test.ts` with tests that describe the expected behavior. Tests should fail at this point (red).

### 6. Run tests (red)

Run `pnpx tsx --test tests/<name>.test.ts` and confirm they fail.

### 7. Write implementation

Replace stubs with real implementation. Keep it minimal and pragmatic.

### 8. Run tests (green)

Run `pnpx tsx --test tests/<name>.test.ts` and confirm they pass.

### 9. Refactor

Review the code for DRY/KISS improvements. Run `pnpm format && pnpm typecheck`.

### 10. Present work

Summarize what was created and any remaining TODOs.
