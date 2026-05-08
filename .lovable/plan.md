# Implementation Plan

## Objective A — Surface `related` (internal_links) on article pages

**`src/serverFns/articles.functions.ts`**
- Extend `ArticlePayload` type with `relatedPosts: RelatedPost[]`.
- No handler logic change needed — payload is built in `articles.shared.ts`.

**`src/lib/articles.shared.ts`**
- Read `rpc.related ?? []`, map through existing `relatedFromRow()` mapper.
- Return as `relatedPosts` alongside `topStories` / `otherNews`.

**`src/routes/$slug.tsx`**
- Destructure `relatedPosts` from article payload.
- After the article body / before/around the existing related sections, render a "Related reading" block when `relatedPosts.length > 0`.
- Use grid of cards mirroring the existing top-stories visual pattern (`<PostImage>` + title + category), each linking via `<Link to="/$slug" params={{ slug }} />`.

## Objective B — Shared nav + internal-linking module

**`src/lib/site-nav.shared.ts`** (new)
- Export `LeafLink`, `NavItem` types.
- Export `SITE_PRIMARY_NAV` containing the exact entries currently inlined in `SiteHeader.tsx` (News, Sectors, Disciplines, Research, AI & GEO, PR Firms, RFPs, About).

**`src/components/site/SiteHeader.tsx`**
- Remove inline `NAV` + types.
- Import `SITE_PRIMARY_NAV`, `NavItem`, `LeafLink` from `@/lib/site-nav.shared`.
- No UI/behavior change.

**`src/lib/internal-linking.shared.ts`** (new)
- Derive `EPR_SECTOR_CATEGORY_SLUGS` from the Sectors menu children.
- Derive `EPR_DISCIPLINE_CATEGORY_SLUGS` from the Disciplines menu children.
- Export `EPR_HUB_PATHS` = `["/research", "/generative-engine-optimization", "/about"]` plus top-level category paths (`/pr-news`, `/pr-firms`, `/rfp`).
- Export `INTERNAL_LINKS_JSONL_RELATIVE = "data/internal-links.jsonl"`.
- Export `InternalLinkJsonlRow` type: `{ source_slug; target_url; anchor_text; kind: "hub" | "sibling" | "manual" }`.
- Export `INTERNAL_LINKING_RULES_SUMMARY` (string) describing the policy (≤3 hub links, ≤4 sibling links, no duplicates, prefer descriptive anchor, etc.).

## Objective C — Ops scripts

**`scripts/build-internal-links-jsonl.ts`** (new)
- Read posts JSONL line by line, parse minimal fields (`slug`, `categories[]`, `content_html`).
- For each post:
  - Hub links: pick up to N hub paths matching post's categories/disciplines.
  - Sibling links: pick up to `--max-siblings` other posts sharing a category, excluding the post itself.
- Dedupe on `(source_slug, target_url)`.
- Write JSONL rows of `InternalLinkJsonlRow`.
- CLI: `--posts`, `--out`, `--max-siblings` (default 4). Print summary.

**`scripts/audit-anchor-links.ts`** (new)
- Read posts JSONL, iterate `<a href="...">`.
- Use `rewriteWpContentUrls` + URL parsing to flag legacy `everything-pr.com` absolute links.
- Report counts per file; with `--apply`, emit fixed JSONL using `rewriteLegacyHtml` from `src/lib/legacy-urls.ts`.
- CLI: `--in`, `--out`, `--apply`.

**`scripts/map-se-ranking-keywords.ts`** (new)
- Read SE Ranking CSV (columns: keyword, volume, ...), tolerant header detection.
- Match keyword tokens against sector/discipline/hub slugs to suggest `suggested_bucket` + `target_url`.
- Score `priority` from volume tiers (e.g. >=1000 high, >=200 med, else low).
- Output CSV: `keyword, volume, suggested_bucket, priority, target_url, notes`.
- CLI: `--in`, `--out`.

**`package.json`**
- Add scripts:
  - `internal-links:build`
  - `internal-links:audit`
  - `keywords:map`

## Objective D — Ron migration artifacts

**`ron-migration-checklist.txt`** (new) — sections: Export & Inventory, Lovable Project Setup, Content & Media Import, SEO-Safe Cutover, QA, Handoff.

**`ron-redirect-map.csv`** (new) — header `old_url,new_url,redirect_type,notes` + 1 example row.

## Validation
- Run `bunx tsc --noEmit` and `bunx eslint .` (or project's lint script) — report results.
- Note: harness handles full builds; manual build not invoked.

## Assumptions
- `rpc.related` shape matches `top_stories` (already mapped by `relatedFromRow`).
- "Related reading" goes near top/other news block; styled minimally with existing tokens — no new shadcn components.
- Scripts use Bun's CLI/file APIs already used by other `scripts/*.mjs|ts`.
- Ron migration files live at repo root (no plan-markdown).
