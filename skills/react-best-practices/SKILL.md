---
name: react-best-practices
description: Production-ready React best practices — component architecture, React 19 compiler patterns, useEffect discipline, state management, rendering patterns, performance, testing, and code organization for modern React applications
---

# React Best Practices

Practical, production-ready React patterns for building robust, performant applications. Apply these when writing or reviewing React code.

## Component Architecture

### Server-First Mentality

In React 19, every component is a Server Component by default when using a server-compatible framework. This means zero client JavaScript for that component, direct access to databases and filesystems, and secrets staying on the server. Treat `"use client"` as an opt-in, not a default. Add it only when the component needs browser APIs, event handlers, or React state and effects.

### Composition Over Configuration

Let parents compose children rather than passing giant config objects. Extract interactive islands as leaf Client Components while keeping the page or server parent a Server Component. A Client Component can receive Server Components as `children`, embedding server-rendered content inside interactive shells without pushing JavaScript to the browser for the inner content. This is the single most impactful pattern for bundle size control.

### Single Responsibility

One component equals one concern. A component over 200 lines that fetches data, manages state, and renders complex UI should be split into a data-fetching wrapper, a state-managing shell, and a presentational child. Each piece becomes independently testable, reusable, and optimizable.

### Controlled vs Uncontrolled

Every extensible input component should support both modes. Detect controlled mode by whether `value` is provided as a prop. When controlled, the parent owns state and passes `value` plus `onChange`. When uncontrolled, the component manages internal state and exposes an optional `defaultValue` prop. This gives consumers flexibility without forcing a pattern.

### Presentational and Container Separation

Components that render markup should not know about data sources. Components that manage data should minimize rendering logic. The boundary is pragmatic — a small component that does both is fine. The rule only applies when either concern grows complex enough to obscure the other.

## The React Compiler

React 19 ships with the React Compiler (previously "React Forget"), which automatically memoizes components and values at build time by analyzing the JavaScript AST and inserting memoization calls.

### What the Compiler Handles

- Skipping re-renders when props have not changed (replaces `React.memo`).
- Stabilizing callback references across renders (replaces `useCallback`).
- Memoizing expensive computations within the render tree (replaces `useMemo`).
- Optimizing component trees for the reconciliation algorithm.

### What You Still Own

| Concern            | Reason                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Code splitting     | The compiler cannot split bundles — only explicit dynamic imports can. |
| Virtualization     | The compiler cannot virtualize the DOM — only a dedicated library can. |
| Image optimization | The compiler cannot optimize images or prevent layout shift.           |
| Bundle analysis    | The compiler cannot know what imports cost at the point of use.        |
| State architecture | The compiler does not change how you model state.                      |
| Error boundaries   | There is no compiler equivalent for `componentDidCatch`.               |

### Migration Rule

Do not proactively add `useMemo`, `useCallback`, or `React.memo` in new code — the compiler handles them. Remove them from existing code only when you can verify the compiler covers that pattern in your build configuration. Premature removal can regress performance in mixed environments where some parts of the tree are compiled and others are not.

## useEffect Discipline

`useEffect` is for synchronizing with external systems — connecting React to non-React state, browser APIs, subscriptions, or third-party widgets. It is not for data fetching, derived state, or event responses.

### Replacements for Common Misuses

| Misuse                  | Problem                                                            | Replacement                                        |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| Fetching data           | Race conditions, double-fetch in strict mode, manual loading state | Server Components or a client query strategy       |
| Computing derived state | Extra render cycle from setState in effect                         | Compute from existing props or state during render |
| Responding to events    | Latency and indirection between event and effect                   | Call the handler directly in the event callback    |
| Logging state changes   | Logs extra times in strict mode                                    | Log directly where the event or condition occurs   |

### When useEffect IS Appropriate

- Synchronizing with a non-React system: WebSocket, history API, third-party widget that manages its own DOM.
- Managing document-level state: title, meta tags, body class names.
- Setting up browser subscriptions with explicit cleanup: `addEventListener` / `removeEventListener`, `IntersectionObserver` / `disconnect`.
- Imperative DOM operations: canvas rendering, video player control, measuring element dimensions.
- Polling or interval-based updates that cannot use server push or WebSocket.

### Cleanup Contract

Every effect that creates a subscription, timer, or listener must return a cleanup function. Missing cleanup causes memory leaks, duplicate handler invocations, and stale closure bugs — especially in strict mode where effects mount-unmount-mount in development:

| Resource        | Setup                   | Cleanup                |
| --------------- | ----------------------- | ---------------------- |
| Interval        | `setInterval`           | `clearInterval`        |
| Event listener  | `addEventListener`      | `removeEventListener`  |
| WebSocket       | `new WebSocket()`       | `close()`              |
| Observer        | `observe()`             | `disconnect()`         |
| Animation frame | `requestAnimationFrame` | `cancelAnimationFrame` |

### Dependency Array Discipline

Every reactive value used inside `useEffect` must appear in the dependency array. The React Compiler will eventually autofill deps, but until adoption is universal, rely on the `exhaustive-deps` lint rule. Omitting deps causes stale closures — the effect captures an outdated variable reference and never re-executes when that variable changes. Adding deps you do not use causes unnecessary re-executions.

## State Management Strategy

### Tier 1: Local State

Start with `useState` for all component-local concerns: form inputs, toggles, tab indices, dropdown state, modal visibility. Reach for `useReducer` only when state transitions involve multiple coordinated sub-values that must change atomically — multi-step form wizards, undo history, validation state with interdependent fields.

### Tier 2: Server State

Data from the server is a cache, not component state. Managing it with `useState` and `useEffect` forces you to reimplement caching, deduplication, background refetching, retry logic, optimistic updates, and cache invalidation by hand. A purpose-built data-fetching strategy handles all of this declaratively.

### Tier 3: Global Client State

Only for truly cross-cutting state not derived from the server: theme preference, locale selection, auth session tokens, feature flag overrides, sidebar collapse state. Use \`use(Context)\` for simple cases with few consumers — \`use\` supports conditional and early-return calls that \`useContext\` does not. Reach for a dedicated store only when context re-render cost becomes measurable — premature abstraction adds indirection without benefit.

Split unrelated state into separate contexts — a single context holding both theme and auth state re-renders all consumers when either value changes. Use context selectors or split by domain so re-renders stay scoped to actual consumers.

### State Decision Flow

```
Is it local UI state?                  →  useState / useReducer
Is it cached server data?              →  Server Components or a query strategy
Is it cross-cutting but simple?        →  Context with few consumers
Is it complex global client state?     →  Dedicated store (escalate only when needed)
Is it synchronized with the URL?       →  Framework search params or hash
```

## React 19 Features

### `use()` — Unwrapping Promises and Context

`use(promise)` reads from a promise, suspending the component until it resolves. Unlike `useEffect` with a loading state variable, it integrates directly with Suspense boundaries — the closest parent `<Suspense>` determines which fallback renders. \`use(Context)\` reads context outside the normal hook rules: it can be called in conditionals, early returns, and loops — unlike the legacy \`useContext\` API, it is not constrained to top-level unconditional calls. Prefer \`use(Context)\` over \`useContext(Context)\` in new code.

> **Important:** \`use(promise)\` can only be called during render, not in event handlers or effects — it relies on the component's Suspense boundary to coordinate fallback UI. Calling it outside render throws.

### `useOptimistic` — Instant UI on Mutations

For mutations processed by the server, `useOptimistic` displays the expected result immediately while the async operation completes. When the server confirms or rejects, the optimistic state is reconciled automatically. Use this for likes, upvotes, follows, toggles, and inline edits where even a short delay degrades interaction quality.

### `useActionState` — Form State Without Boilerplate

Binds form state (pending, error, data, reset callback) to a server action or async function in a single hook. Replaces the manual combination of `useState` for pending, `useState` for error, and `onSubmit` handler wiring. The form degrades to a standard HTML form action submission when JavaScript is unavailable — progressive enhancement from a single hook.

### `useTransition` — Marking Non-Urgent Updates

Wrap state updates that trigger expensive re-renders or data refetches in `startTransition`. This signals to React that the update is low priority — urgent updates like text input or button clicks continue uninterrupted. Unlike `setTimeout` deferrals, transitions remain interruptible and stay within React\'s scheduling priority system.

### \`useDeferredValue\` — Deferring Expensive Re-Renders

Where \`useTransition\` marks the state update as non-urgent, \`useDeferredValue\` keeps the current value displayed while a derived computation completes. Ideal for search/filter UIs — use it so input stays responsive while results render in the background:

\`\`\`tsx
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filter(items, deferredQuery), [items, deferredQuery]);
\`\`\`

Use a transition when controlling the state update; use a deferred value when deriving slow output from fast-changing input.

## Performance

### Code Splitting

Split every route with `React.lazy` and `<Suspense>`. Split heavy below-the-fold components the same way. The compiler cannot bundle-split — this is a manual architectural decision. Each dynamic import creates a separate JavaScript chunk loaded on demand:

- Route boundaries — every major view gets its own chunk.
- Heavy visualizations — charts, maps, 3D scenes load on scroll or interaction.
- Third-party widgets — rich text editors, media players, PDF viewers.

### Virtualization

For lists longer than approximately 200 items, render only what fits in the viewport. Without virtualization, a 10,000-item list creates 10,000 DOM nodes — each with layout cost, paint cost, and memory overhead. Virtualization caps visible nodes at the viewport size plus a small overscan buffer.

### Bundle Awareness

Know what each import costs. A 50KB charting library imported statically at the top of a route component is 50KB every user must download, parse, and execute. Use dynamic imports and bundle analyzers to keep critical-path JavaScript lean.

### Re-Render Awareness

The React Compiler eliminates most unnecessary re-renders, but structural anti-patterns still cause wasted work:

- Creating new objects or arrays in the render body that get passed as props (breaks referential equality at the point of use).
- Placing large state high in the tree, causing wide re-render cascades on any change.
- Lifting state up past where it is needed — keep state as close to consumers as possible.

### Image Optimization

Use `loading="lazy"` for below-the-fold images and eager loading for above-the-fold images. Always set explicit width and height attributes or their CSS equivalents to prevent layout shift. Use `srcSet` and `sizes` so mobile devices do not download desktop-sized images.

## Error Boundaries

Error boundaries are class components with `componentDidCatch` — no hook equivalent exists in React 19. Place them at:

- Route sections — coarse enough that one error does not blank the entire page, fine-grained enough that each section recovers independently.
- Around interactive widgets that can throw: rich text editors, media players, file uploaders, third-party embeds.
- At the root level as a global last-resort fallback.

Each boundary should render a fallback UI that communicates what failed and lets the user retry or navigate away. An error in the sidebar should never take down the main content area.

## Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<aside>`) instead of generic `<div>` elements with ARIA roles — semantics carry built-in keyboard and screen reader behavior.
- Every interactive element needs full keyboard support: Enter to activate, Escape to dismiss, Tab to navigate between controls, arrow keys for selection.
- Label every input: visible `<label htmlFor="id">` for visible fields, `aria-label` for icon-only buttons, `aria-describedby` for helper text.
- Manage focus in modals and drawers: trap focus inside the overlay, restore to the trigger element on close, send focus to the first interactive element on open.
- Announce dynamic content changes with `aria-live` regions: `"polite"` for standard updates, `"assertive"` for urgent time-sensitive changes.
- Maintain color contrast of at least 4.5:1 for body text, 3:1 for large text (WCAG AA).

## TypeScript in React

Always type props with an explicit `interface` or `type`. Use `interface` for exported component props — they produce better error messages and support declaration merging. Use `type` for unions, mapped types, and computed types. Extract third-party props with `React.ComponentProps<typeof Component>`. Never use `any` in props, state, or return types — use `unknown` with narrowing instead.

## Code Organization

### File Structure

Organize by feature, not by type. A feature directory contains the component, its hooks, its styles, and its tests. Shared primitives live in a `ui/` directory. This structure scales because adding a feature does not require touching files spread across six folders.

### No Barrel Exports

Never re-export modules through index files. Import directly from source files. Barrel exports create circular dependencies, obscure the dependency graph, and hurt tree-shaking. Direct imports are explicit and traceable.

## Testing

- Test behavior, not implementation. A component test should assert on rendered output and user interactions, not on internal state values or hook calls.
- Use `@testing-library/react` for component tests — it encourages testing from the user's perspective.
- Write integration tests for feature workflows, not unit tests for every component in isolation.
- Write edge-case arrays for repetitive test scenarios to keep test files concise.

## Common Mistakes

| Mistake                                                                     | Fix                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Adding `"use client"` to the entire page because one section is interactive | Extract the interactive section as a leaf Client Component |
| Using `useEffect` for data fetching                                         | Fetch in Server Components or a client query strategy      |
| Wrapping everything in `React.memo`, `useMemo`, or `useCallback`            | Let the React Compiler handle memoization                  |
| Creating state from props when it can be derived                            | Compute from props during render — no state needed         |
| Not cleaning up effects                                                     | Every subscription, timer, or listener must return cleanup |
| Putting all state in a global store before considering local                | Start with `useState`, escalate only when necessary        |
| Passing `key={index}` to reorderable list items                             | Use a stable unique ID to preserve component state         |
| Single-purpose components over 200 lines                                    | Split by responsibility — data, interaction, presentation  |
| Prop drilling past three levels                                             | Lift state or use context                                  |
| Using `any` in props or state                                               | Use specific types or `unknown` with narrowing             |

## Rendering Strategy Summary

| Scenario                                | Approach                                      | Why                                                       |
| --------------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Static content, no interactivity        | Server Component                              | Zero client JS, direct backend access                     |
| Interactive leaf in a static page       | Client Component in a Server Component parent | Minimal client boundary                                   |
| Data from a database                    | Fetch in Server Component                     | No API route, no loading state, no waterfall              |
| Form with server mutation               | `useActionState` + Server Action              | Progressive enhancement, built-in pending and error state |
| Optimistic UI (likes, toggles, follows) | `useOptimistic`                               | Instant feedback, automatic reconciliation                |
| Heavy chart, editor, or 3D scene        | Dynamic import + Suspense                     | Loads on demand, does not block initial render            |
| Long list                               | Virtualization                                | Constant DOM cost regardless of list size                 |
| Expensive computation                   | Compute inline or rely on the compiler        | Compiler inserts memoization automatically                |
| Scroll-dependent rendering              | \`useDeferredValue\` or Intersection Observer | Defers non-urgent work without blocking scroll            |
