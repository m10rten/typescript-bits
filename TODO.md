# TODO: Check and replace the actual domain for typescript-bits

## Domain decision

- [ ] **Confirm the production domain.** Currently `https://typescript-bits.dev` is used as a hardcoded fallback throughout the app. Is this the correct domain? If not, decide on the actual domain before proceeding.

## App: hardcoded domain references (if domain changes)

- [ ] `app/src/app/layout.tsx` — line 22: `const siteUrl = "https://typescript-bits.dev"`
- [ ] `app/src/app/opengraph-image.tsx` — line 66: `typescript-bits.dev` (rendered text in OG image)
- [ ] `app/src/app/sitemap.ts` — line 4: fallback `"https://typescript-bits.dev"` (env var `SITE_URL` overrides)
- [ ] `app/src/app/robots.ts` — line 3: fallback `"https://typescript-bits.dev"` (env var `SITE_URL` overrides)
- [ ] **Set `SITE_URL` env var** in the production deployment environment so the fallback is never used.

## Package registry metadata

- [ ] **Add `homepage` to `package.json`** — should point to the documentation site (e.g., `https://typescript-bits.dev`)
- [ ] **Add `repository` field to `package.json`** — should point to the GitHub repo (e.g., `"git+https://github.com/m10rten/typescript-bits.git"`)
- [ ] **Add `bugs` field to `package.json`** — should point to the GitHub issues page (e.g., `"https://github.com/m10rten/typescript-bits/issues"`)

## GitHub username inconsistency

- [ ] `.github/ISSUE_TEMPLATE/config.yml` — line 4 uses `qmaar/typescript-bits`; all other references use `m10rten/typescript-bits`. Update to `m10rten/typescript-bits`.

## JSDoc example URLs (low priority)

- [ ] `src/reset/fetch.ts` — line 8: `https://example.com/data` in `@example` block
- [ ] `src/retry.ts` — line 57: `https://api.example.com/data` in `@example` block

These are fine as generic examples, but could be updated to a more realistic URL if desired.
