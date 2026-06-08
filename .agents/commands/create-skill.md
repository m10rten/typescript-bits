---
description: Scaffold a new distributable skill with SKILL.md under skills/, auto-discovered by the docs site
---

Create a new skill from this request: `$ARGUMENTS`

Extract `<name>` and optional `<?desc?>` from the arguments. If no description, use a brief summary of what the skill covers.

## Conventions

- **Location**: `skills/<name>/SKILL.md` — one skill per directory, one `SKILL.md` per skill
- **Discovery**: Auto-discovered by the docs site — no registration needed. Users install via `npx skills add m10rten/typescript-bits`
- **Name**: kebab-case, short and descriptive (e.g. `nodejs-best-practices`, `testing-patterns`)
- **Frontmatter**: `name` (kebab-case) and `description` (one-liner). `displayName` is auto-derived from `name`
- **Style**: Practical, production-ready patterns with code examples. Tables for comparisons and common mistakes. No fluff

## Steps

### 1. Propose skill plan

Based on `<name>` and `<?desc?>`, propose:

- Full skill name and description
- Topic sections to cover (look at existing skills for reference)
- Each section should have practical code examples

**Stop and wait.** Ask me to accept or revise the plan.

### 2. Write SKILL.md

Write `skills/<name>/SKILL.md` with this structure:

```markdown
---
name: <name>
description: <description>
---

# <Display Name>

<one-paragraph intro — what this skill is for and when to apply it>

## <Section 1>

### <Subsection>

<practical guidance with code examples>

<repeat for each section>

## Common Mistakes

| Mistake | Fix |
| ------- | --- |
| ...     | ... |
```

Follow the format of the existing skills exactly (`skills/typescript-best-practices/SKILL.md` is a good reference).

### 3. Verify

- Run `pnpm format` to ensure formatting is consistent
- Run `pnpm typecheck` to ensure no type errors (the app parses the skill)
- Confirm the skill appears by checking the docs build or verifying the frontmatter parses correctly

### 4. Present result

Summarize what was created: skill name, description, sections covered, and how to view it in the docs.
