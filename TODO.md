# TODO — Next.js App: Best Practices Audit

## Domain

- [ ] **Confirm the production domain.** Currently `https://typescript-bits.dev` used as hardcoded fallback. Is this correct?

## SEO & Metadata

- [ ] **Add `generateMetadata` to all dynamic route pages.** `docs/[module]/page.tsx` and `docs/[module]/[submodule]/page.tsx` don't export metadata — every module page gets the same generic title/description. Each should generate unique `<title>`, `description`, `openGraph`, and `twitter` based on module content.
- [ ] **Add JSON-LD structured data (Schema.org).** At minimum a `WebSite` + `TechArticle` schema on docs pages improves SEO and AI/crawler understanding.

## Error Handling

- [ ] **Add `error.tsx` at root and `docs/` level.** Currently no error boundary exists anywhere. App Router needs `error.tsx` (client component with `"use client"` and `reset` prop) per route segment to catch render errors gracefully.

## Performance & Bundle

- [ ] **Configure `@next/bundle-analyzer`.** Add `withBundleAnalyzer` to `next.config.ts` and a `pnpm analyze` script so bundle size regressions are visible.
- [ ] **Dynamically import heavy client components.** `Search` and `ViewToggle` are client components imported eagerly in layouts/pages. Use `next/dynamic` with a `loading` fallback to keep initial JS payload smaller.
- [ ] **Add `loading.tsx` to the docs root** (`app/docs/loading.tsx`). Currently the docs index page has no loading state.

## Security

- [ ] **Add `middleware.ts`** at `src/middleware.ts` for:
  - Redirects (e.g. trailing slash handling, `www` -> bare domain)
  - Request-level security headers (belt-and-suspenders alongside `next.config` headers)
- [ ] **Add `Cache-Control` headers to route handlers.** The `/llms.txt` route returns content without cache directives — add `public, max-age=3600, s-maxage=3600, stale-while-revalidate`.
- [ ] **Remove `suppressContentEditableWarning`** from `<html>` in layout — not needed and suppresses legitimate warnings.

## Maintainability

- [ ] **Create `src/hooks/` directory** — mapped to `$/*` in tsconfig but empty. First hooks: `useMounted` (extracted from `ThemeToggle`), `useMetaKey` (extracted from `Search`).
- [ ] **Add favicon variants** — only `favicon.svg` exists. Add `apple-icon`, `icon` sizes (32x32, 16x16) for proper browser/OS support.
