# Skills

Skills are structured reference files that encode reusable engineering knowledge. They follow a category-based organization and are registered in `skills.sh.json`.

## Categories

| Category           | Scope                                                                            | Example                          |
| ------------------ | -------------------------------------------------------------------------------- | -------------------------------- |
| **principles**     | Fundamental truths, theory, first principles _(the why)_                         | `software-principles-guidelines` |
| **guidelines**     | Practical rules applicable across technologies _(the what)_                      | `memory-management-guidelines`   |
| **best-practices** | Technology/runtime-specific rules _(the how on a given stack)_                   | `typescript-best-practices`      |
| **patterns**       | Reusable solution templates _(the how for a class of problem)_                   | `async-patterns`                 |
| **recipes**        | Step-by-step instructions for a specific outcome _(the how for a concrete task)_ |                                  |

## Naming Convention

Every skill is named `{domain}-{category}`:

```
async-patterns                    # patterns category, async domain
memory-management-guidelines      # guidelines category, memory domain
typescript-best-practices         # best-practices category, typescript domain
software-principles-guidelines     # principles category, software domain
auth-recipes                      # recipes category, auth domain
```

## Inventory

| Skill                            | Category       | Domain                       |
| -------------------------------- | -------------- | ---------------------------- |
| `complexity-principles`          | principles     | Algorithmic complexity       |
| `software-principles-guidelines` | principles     | General software engineering |
| `memory-management-guidelines`   | guidelines     | Memory management            |
| `typescript-best-practices`      | best-practices | TypeScript                   |
| `nodejs-best-practices`          | best-practices | Node.js                      |
| `zod-best-practices`             | best-practices | Zod                          |
| `async-patterns`                 | patterns       | Asynchronous programming     |
| `composition-patterns`           | patterns       | Function/object composition  |
| `react-best-practices`           | best-practices | React 19                     |
| `nextjs-best-practices`          | best-practices | Next.js App Router           |

## Registration

All skills must be registered in `skills.sh.json` to be discoverable.
