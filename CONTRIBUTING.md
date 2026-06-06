# Contributing

Thanks for considering contributing to typescript-bits.

## Getting started

```sh
pnpm install
pnpm build
```

## Development flow

This project follows Red-Green-Refactor:

1. **Red** — Write a failing test in `tests/<module>.test.ts`
2. **Green** — Implement minimal code in `src/<module>.ts` to pass
3. **Refactor** — Clean up while keeping tests green

See [AGENTS.md](AGENTS.md) for detailed conventions on code style, project structure, and commands.

## Before committing

```sh
pnpm format:check && pnpm typecheck
```

A pre-commit hook enforces formatting and type-checking.

## Guidelines

- Keep PRs focused on a single concern
- Write tests for new primitives and bug fixes
- Use Node.js native APIs over third-party packages
- Mark breaking changes clearly in commit messages and PR descriptions

## Questions?

Open a [discussion](https://github.com/m10rten/typescript-bits/discussions) or an issue.
