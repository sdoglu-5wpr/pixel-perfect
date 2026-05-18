# Mass delete + redirect plan (3,005 URLs)

## CSV breakdown
- **RFP** — 2,756
- **Seeking-agency** — 233
- **Thin-content** — 11 (incl. 6 `/draft-*`)
- **Hiring** — 5

## Redirect targets (existing categories confirmed)
| Reason | Target | Status |
|---|---|---|
| RFP | `/category/rfp` (existing, 3,630 posts, name "PR RFPs & Marketing RFPs") | 301 |
| Seeking-agency | `/category/pr-firms` (existing, 379 posts) | 301 |
| Thin-content | `/` (homepage) | 301 |
| Hiring | — (no redirect) | **410 Gone** |

If you'd prefer Seeking-agency → `/category/agency-of-record` (83 posts) instead of `/category/pr-firms`, say so. I'll default to `pr-firms` since it's the larger, more general hub.

## Execution steps

### 1. Stage the CSV
Copy `noindex-candidates.csv` into a temp table so we can join on it cleanly.

### 2. Insert redirects (migration #1)
For each row, insert into `public.redirects` (source_path, target_path, status_code, enabled=true, notes='bulk cleanup 2026-05'):
- RFP rows → `/category/rfp`, 301
- Seeking-agency rows → `/category/pr-firms`, 301
- Thin-content rows → `/`, 301
- Hiring rows → still inserted but with **status_code = 410** and target `/` (the edge/redirect handler returns 410 for that code; if it doesn't yet, I'll add that branch in code)

Skip rows where a redirect for that `source_path` already exists.

### 3. Delete posts + media (migration #2)
For every slug in the CSV that exists in `posts`:
1. Collect `featured_media_id` values.
2. Delete child rows: `post_categories`, `post_tags`, `post_revisions`, `internal_links` (source or target), `seo_meta` where `object_type='post'` and `object_id=post.id`.
3. Delete the posts.
4. Delete orphaned `media` rows (and `media_variants`) whose ids were collected AND are no longer referenced by any remaining post's `featured_media_id` or `first_inline_image`. Storage objects in the `media` bucket are NOT auto-deleted by row delete — I'll list the storage_paths in the migration output so you can bulk-delete them from the Supabase Storage dashboard (or I can add a follow-up server function to purge them).

### 4. Verify 410 handling
Check the edge redirect handler (`netlify/edge-functions/canonicalize.ts` and the worker redirect logic that reads `src/generated/redirects.json`) actually emits a 410 when `status_code = 410`. If it only handles 301/302/307/308, add a 410 branch (no `Location` header, body "Gone").

### 5. Rebuild prerender
`src/prerender.ts` reads published posts to build the URL list — once posts are deleted, those URLs drop out of the sitemap and prerender automatically on the next build. No code change needed there.

## Technical notes
- All DB work goes through `supabase--migration` (schema-safe single transaction per phase). I'll show you both SQL migrations before they run.
- `redirects` table already has `source_path` unique-ish usage in the admin UI; I'll use `ON CONFLICT (source_path) DO NOTHING` to be safe (will add the unique index if missing).
- Storage objects: row delete in `media` does NOT remove the file in the bucket. I'll output the list of storage_paths so they can be purged separately — confirm if you want me to also wire a cleanup server function.

## Open questions (answer to refine, or I'll use defaults)
1. Seeking-agency target: `/category/pr-firms` (default) or `/category/agency-of-record`?
2. Hiring: **410 Gone** (default, per your message) or 301 → `/`?
3. Storage bucket cleanup: list-only (default) or also auto-purge via a script?
