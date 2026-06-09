---
name: nextjs-best-practices
description: Production-ready Next.js App Router patterns — server components, data fetching, streaming, server actions, caching, routing architecture, middleware, error handling, and performance for modern Next.js applications
---

# Next.js Best Practices

Practical, production-ready Next.js patterns for the App Router. Apply these when building or reviewing Next.js applications.

## App Router Architecture

### File Conventions

The App Router uses special filenames to define behavior for each route segment. Every folder in `app/` can contain these files, and they compose automatically across nested folders:

| File            | Role                                                                |
| --------------- | ------------------------------------------------------------------- |
| `page.tsx`      | Route UI — makes the URL accessible at that segment                 |
| `layout.tsx`    | Shared wrapper — persists across navigations without remounting     |
| `loading.tsx`   | Automatic Suspense boundary while the page's data loads             |
| `error.tsx`     | Error boundary for the segment (must be a Client Component)         |
| `not-found.tsx` | 404 UI for the segment                                              |
| `template.tsx`  | Like layout but remounts on every navigation                        |
| `route.ts`      | API route with no UI — use only for webhooks and external callbacks |
| `default.tsx`   | Fallback render for parallel route slots when no match exists       |

`layout.tsx` and `template.tsx` differ in lifecycle — layouts persist across navigations (the sidebar does not remount when navigating between dashboard pages), templates remount every time. Prefer `layout.tsx` unless you need effect re-runs or animation reset on every navigation.

### Root Layout

The root `app/layout.tsx` is required and wraps every page. It defines the HTML shell, font loading, global styles, and shared metadata defaults. Every provider (auth, theme, query client) in the root layout affects the entire application — keep this tree narrow. Providers that only apply to a subset of routes belong in a route group layout.

### Route Groups

Use `(folder)` parentheses to organize routes without affecting URL structure. Route groups create separate layout trees under the same URL namespace:

```
app/
  (marketing)/           # No URL prefix
    page.tsx             # Homepage at /
    about/page.tsx       # /about
    layout.tsx           # Marketing layout — nav, footer, no auth
  (dashboard)/           # Separate layout tree
    layout.tsx           # Dashboard layout — auth check, sidebar
    settings/page.tsx    # /settings
    admin/page.tsx       # /admin
```

Marketing pages get a minimal layout with nav and footer. Dashboard pages get auth middleware plus sidebar. No URL segments distinguish them — the difference is purely organizational. This is the standard pattern for apps with public pages and authenticated sections.

### Route Handlers

With Server Actions handling mutations and Server Components handling reads, the `app/api/` directory shrinks to a few specialized cases. Route handlers (`route.ts`) are needed only for:

- Webhooks from external services (Stripe, GitHub, SendGrid, Clerk) that expect a HTTP endpoint.
- External service callbacks that need a stable, unmounted URL.
- Long-running operations that stream progress to the client via Server-Sent Events.
- Upload endpoints that process raw binary request bodies before they reach application logic.

All standard CRUD operations, form submissions, and data mutations go through Server Actions. All reads go through Server Components.

## Server vs Client Components

### The Decision Rule

Default to Server Component. Add `"use client"` only when the component needs one of these:

- Event handlers (`onClick`, `onChange`, `onSubmit`, `onKeyDown`).
- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, `useReducer`, `useCallback`, `useMemo`).
- Browser-only APIs (`window`, `document`, `localStorage`, `sessionStorage`, `IntersectionObserver`, `ResizeObserver`, `navigator`).
- Third-party libraries that use hooks or browser APIs internally — chart components, map components, rich text editors, animation libraries.

A Server Component runs exclusively on the server: it sends zero JavaScript to the browser, can directly access databases and filesystems with no API route wrapper, and can `await` data fetches inline without a loading state variable. Environment variables and API keys referenced in Server Components never reach the client bundle.

### The Composition Pattern

Keep pages as Server Components. Extract only the interactive parts as leaf Client Components. Pass data as props from server to client. A Client Component can receive Server Components as `children` — this embeds server-rendered content inside interactive shells without pushing JavaScript to the browser for the inner content. This is the standard pattern for pages that are mostly static but have one or two interactive widgets.

### The Cost of Overuse

Adding `"use client"` to a file makes every import in that file's tree part of the client bundle. A single broad `"use client"` on a layout or page can pull server-only dependencies into the browser bundle, negating the bundle-size benefit of Server Components. Push `"use client"` as far down the tree as possible — to the leaf components that genuinely need interactivity.

## Data Fetching and Caching

### Server Component Fetching

Server Components fetch data directly at render time — no API route wrapper, no `useEffect`, no client-side loading state, no state variable for the result:

```ts
async function BlogPost({ id }: { id: string }) {
  const post = await db.post.findUnique({ where: { id } });
  return <article>{post.title}</article>;
}
```

The `fetch` API is also available directly in Server Components. React automatically deduplicates `fetch` calls with the same URL and options within a single render pass. You can call the same data function in `generateMetadata` and the page component — it resolves once.

### Caching Strategy

Next.js 15 changed the caching defaults. Previously, `fetch` responses were cached indefinitely by default. Now the defaults are more conservative, and every data fetch should carry an explicit strategy:

| Strategy   | Mechanism                               | Use Case                                                |
| ---------- | --------------------------------------- | ------------------------------------------------------- |
| Dynamic    | No cache option or `cache: "no-store"`  | Dashboards, personalized pages, auth-dependent data     |
| Time-based | `next: { revalidate: 3600 }`            | Blog posts, product pages, documentation                |
| Static     | `cache: "force-cache"`                  | Reference data, legal content, never-changing resources |
| On-demand  | `revalidatePath()` or `revalidateTag()` | CMS content — revalidate when editors publish           |

### Cache Layers

Next.js has four cache layers. Request Memoization lasts one render pass. Data Cache persists across HTTP requests (`revalidate`/`cache`). Full Route Cache stores rendered HTML (skipped for dynamic routes). Router Cache lives in the browser (hard refresh clears it). Data-staleness bugs most often stem from layer interactions — the Router Cache may serve stale data while the Data Cache is fresh. Debug from client to origin: hard refresh first, then verify each layer.

Dynamic rendering is triggered by any dynamic API (`cookies()`, `headers()`, `searchParams` access), uncached `fetch`, or `export const dynamic = "force-dynamic"`. In Next.js 15, `fetch` defaults to `no-store`, so most routes using `fetch` render dynamically without explicit cache: "no-store".

### Parallel Data Fetching

Never waterfall independent data fetches inside a single component. Start all independent fetches simultaneously and await them together with `Promise.all`. Sequential fetches add latency equal to the sum of each fetch's duration. Parallel fetches complete in the duration of the slowest fetch:

```ts
// Sequential (slow) — each waits for the previous to resolve
const user = await getUser(id);
const posts = await getPosts(user.id);
const analytics = await getAnalytics(id);

// Parallel (fast) — all three run concurrently
const [user, posts, analytics] = await Promise.all([getUser(id), getPosts(id), getAnalytics(id)]);
```

## Streaming and Suspense

### Suspense Boundaries at Data Boundaries

Every async data dependency should be wrapped in its own `<Suspense>` boundary with a dimensionally accurate skeleton. This lets each section of the page stream independently — a slow analytics chart does not block the fast user list, and a failed data fetch in one section does not hold up the rest of the page. The page shell renders immediately, and each data-dependent section replaces its skeleton when ready.

### loading.tsx vs Explicit Suspense

`loading.tsx` wraps the entire page in a single Suspense boundary automatically. Use it as a coarse initial fallback for the page shell. Inside the page, use explicit `<Suspense>` boundaries around individual data-dependent sections for granular streaming. This way, sections whose data resolves quickly render immediately while slow sections show their own individual skeletons.

**Partial Prerendering (PPR):** Enable `experimental.ppr = true` in `next.config` to pre-render static shells at build time while streaming dynamic content. Static Suspense boundaries render immediately (CDN-cacheable), dynamic ones hydrate per-request. This combines static speed with dynamic freshness.

### Skeleton Design

A good skeleton matches the exact dimensions and layout of the content it replaces — border radius, line heights, and approximate block sizes should mirror the final content. This prevents cumulative layout shift and gives users an accurate mental model of what is loading. Avoid generic spinner-centered animations for layout-heavy sections; they cause layout shift when the content finally renders.

## Server Actions

Server Actions replace API routes for mutations. They are async functions annotated with `"use server"` that run on the server and can be called directly from Client Components or used as HTML form `action` attributes.

### Progressive Enhancement

Server Actions work without JavaScript. When used as a form `action`, the form submits as a standard HTML form post. When JavaScript loads, the submission becomes seamless with pending states, error handling, and client-side validation. Every form works on first render and gets progressively better — this is the defining advantage over traditional API routes.

### Input Validation

Every Server Action must validate its inputs at the top of the function body. Untrusted data from the client must never reach the database or business logic without passing through a validation schema. Return typed error objects to the client rather than throwing exceptions — this keeps error handling predictable and type-safe at the call site.

```ts
import { z } from "zod";
const schema = z.object({ email: z.string().email(), name: z.string().min(1) });
export async function updateProfile(_: unknown, data: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { issues: parsed.error.flatten().fieldErrors };
  return { data: await db.user.update({ where: { email: parsed.data.email }, data: parsed.data }) };
}
```

### When Server Actions Are Not the Right Tool

- Operations that need progress reporting during execution (download progress, batch processing status) — use Route Handler with SSE or WebSocket.
- File uploads that need incremental progress streaming — use Route Handler with multipart processing.
- Third-party webhooks that expect a standard POST endpoint with specific headers — use Route Handler.

## Routing Patterns

### Parallel Routes (`@folder`)

Use parallel routes for dashboards with independent sections. Each slot (`@analytics`, `@notifications`) loads independently with its own `loading.tsx`, `error.tsx`, and data dependencies. A crash in one slot cannot take down the others. Each slot also gets its own `layout.tsx` if needed, providing independent layout trees alongside each other.

Every parallel slot must include a `default.tsx` file. Without it, navigating to a route that does not match the slot causes a 404 error — Next.js cannot determine what to render in the unmatched slot and defaults to an error state.

### Intercepting Routes

Use intercepting routes for modals and overlays that display content from another route while preserving the underlying page. The syntax mirrors relative path traversal:

| Syntax            | Meaning                                  |
| ----------------- | ---------------------------------------- |
| `(.)feed`         | Intercept segment at the same level      |
| `(..)photo`       | Intercept one level up                   |
| `(..)(..)profile` | Intercept two levels up                  |
| `(...)shop`       | Intercept from the root `app/` directory |

The same URL renders inline in a modal when navigated from within the app, or as a full page when accessed directly or refreshed. The same data function powers both views — no duplicate data fetching or state synchronization.

### Dynamic Routes

In Next.js 15, `params` and `searchParams` are Promises and must be awaited before accessing:

```ts
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <Article post={post} />;
}
```

Use `generateStaticParams` for routes with a known set of values (blog posts, products, documentation pages) to pre-render them at build time. This eliminates per-request computation and allows static delivery via CDN.

## Metadata and SEO

Use `generateMetadata` for dynamic metadata that depends on route params or fetched data. It runs on the server and is deduplicated with the page component's data fetch — if both call `getPost(id)`, the call is made once.

Site-wide defaults go in the root layout's `metadata` export. Page-specific overrides go in each page's `generateMetadata`. Values merge down the route hierarchy — more specific segments override their parents. Configure a title template in the root layout (e.g., `"%s | My App"`) so every page's title is consistently branded without repeating the suffix.

## Middleware

Middleware runs on the Edge Runtime before every matched request, before the route renders. Use it for operations that must happen early in the request lifecycle:

- URL redirects: legacy URL migration, trailing slash normalization, locale-based prefixing.
- Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Content-Security-Policy`.
- Geolocation-based routing: serve different content or pricing based on visitor country.
- Bot detection and early termination: block known bad actors before they reach application code.

Keep middleware fast, stateless, and side-effect-free. It runs on every matched request — any heavy computation or database access belongs in the page or route handler. Use `config.matcher` to limit middleware execution to paths that genuinely need it.

## Performance

### Dynamic Imports

Use `next/dynamic` for heavy client components not needed on initial render. The `ssr: false` option skips server-side rendering for components that depend on browser APIs:

```ts
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/chart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
```

### Image Optimization

Use `next/image` for automatic image optimization: responsive sizes, WebP and AVIF format negotiation, lazy loading, and explicit dimension requirements that prevent layout shift. Above-the-fold images should set `priority` to skip lazy loading. Always provide the `sizes` attribute for responsive images so the browser selects the correct source.

### Font Optimization

Use `next/font` to load fonts at build time with automatic self-hosting. This eliminates external font requests, reduces layout shift from font swap, and inlines font CSS declarations for critical path rendering.

### Bundle Analysis

Run bundle analysis regularly. A charting library, markdown renderer, or date utility imported at the top of a route component contributes to every visitor's critical path JavaScript. Dynamic imports and route-level code splitting keep the initial bundle lean.

## Error Handling

### Granular Error Boundaries

Place `error.tsx` at the most specific route segment possible. A dashboard with three parallel slots should have an error boundary in each slot rather than a single boundary at the layout level. A failing notifications panel should not blank the entire dashboard.

`error.tsx` must be a Client Component. It receives `error` (the thrown value) and `reset` (a function that retries rendering the segment). Use `reset()` for transient errors like network timeouts — it re-renders the failed segment without a full page reload.

For errors thrown in the root layout itself, create `app/global-error.tsx`. This file must include its own `<html>` and `<body>` tags because the root layout has already failed and cannot provide them.

## Production Checklist

Before shipping, verify each of the following:

- Minimal `"use client"` usage — audit every directive for necessity.
- Every async data dependency has a `<Suspense>` boundary with a dimensionally accurate skeleton.
- Every `fetch` call has an explicit `revalidate` or `cache` option.
- Server Actions validate all input at the top of the function body.
- Each parallel route slot has its own `error.tsx` and `default.tsx`.
- Dynamic imports for all heavy client-side components.
- Images use `next/image` with explicit `sizes` and `priority` where appropriate.
- Metadata is set on every page with a template in the root layout.
- Forms work without client JavaScript — progressive enhancement is functional.
- Bundle analysis shows a lean critical-path client bundle.

## Common Mistakes

| Mistake                                                   | Fix                                                           |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| Adding `"use client"` to the entire page tree             | Push `"use client"` down to interactive leaf components       |
| Not awaiting params in Next.js 15                         | `params` and `searchParams` are Promises — `await` them       |
| Waterfalling independent data fetches                     | Use `Promise.all` to start all fetches concurrently           |
| Fetching in Client Components when Server Components work | Move data fetching to the Server Component parent             |
| Forgetting `default.tsx` for parallel route slots         | Every `@slot` folder needs a `default.tsx`                    |
| Relying on default caching behavior                       | Set explicit `revalidate` or `cache` on every fetch           |
| Creating API routes for simple CRUD operations            | Use Server Actions for mutations, Server Components for reads |
| Relying solely on `loading.tsx` without granular Suspense | Use explicit `<Suspense>` boundaries inside pages             |
| Missing error boundaries on parallel route slots          | Each slot needs its own `error.tsx`                           |
| Running heavy logic or database queries in middleware     | Middleware is for fast, stateless request interception only   |
