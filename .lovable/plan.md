# Add GEO pillar + first article (with images)

## Author / structure confirmed

- Author for the article: **Ronn Torossian** (id 6, slug `ronn-torossian`).
- Pillar matches existing pattern (cybersecurity, beauty, etc.): `pillars` row + matching `categories` row, both slug `generative-engine-optimization`. Same `PillarView` renders it — no new component, no layout changes.
- `byline` will be `EPR Staff` to match other pillars.

## What lands in one pass

### 1. Images (generated up front, committed to `public/`)

Both as **WebP**, named after the slug, alt text describes the content.

- `public/pillars/generative-engine-optimization.webp` — pillar hero
  - prompt direction: editorial illustration of an AI search interface citing brand sources, dark navy `#0A1628` background to match pillar hero gradient, brand red `#FF3366` accents, no text rendered in the image.
  - alt: `"Generative Engine Optimization (GEO) — how brands earn citations inside ChatGPT, Claude, Perplexity, and Google AI Overviews"`
- `public/articles/geo-vs-seo.webp` — article featured image
  - prompt direction: split-frame visual contrasting a traditional Google SERP (left) with an AI answer panel showing inline citations (right), same dark navy + red accent palette, clean editorial style, no text.
  - alt: `"GEO vs SEO — search results page versus AI-generated answer with inline citations"`
- Generated via the agent-side `generate_image` tool (premium tier) so they ship as real files in the repo. If the prompt produces a PNG, I'll convert to WebP with `cwebp` before commit. Both files end up tracked in git, immediately referenced by the seed migration.

A `media` row + `post_categories`/`featured_media_id` wiring is added so the article's featured image renders the same way every other post does.

### 2. Database migration (single file, fully idempotent)

- `insert ... on conflict (slug) do update` for:
  - `categories` row `generative-engine-optimization`, name "Generative Engine Optimization", description from the doc lead.
  - `pillars` row `generative-engine-optimization`:
    - `title`: "Generative Engine Optimization (GEO)"
    - `subtitle`: "What GEO is, why it matters, and how brands win citations inside AI answers."
    - `byline`: "EPR Staff"
    - `body_html`: full doc 1 rendered to HTML (h2/h3 headings, table for the SEO-vs-GEO comparison, bullet lists, blockquote for the About 5W block at the end). FAQ section stripped from `body_html` and moved into `faq` JSONB.
    - `faq`: 5 Q/A pairs from the bottom of doc 1 → `[{q,a}, …]`.
    - `schema_jsonld`: `{ "@context": "schema.org", "@graph": [Article + FAQPage] }` keyed to `https://everything-pr.com/generative-engine-optimization/`.
    - `hero_image_url`: `/pillars/generative-engine-optimization.webp`.
    - `published: true`.
- `media` row for the article image, then `posts` row `geo-vs-seo`:
  - `type='post'`, `status='publish'`, `published_at=now()`
  - `author_id`: 6 (Ronn Torossian)
  - `featured_media_id`: id of the new media row
  - `title`: "GEO vs SEO: What's the Difference?"
  - `excerpt`: short-answer paragraph from doc 2.
  - `content_html`: doc 2 rendered to HTML (table preserved, FAQ section preserved, About 5W blockquote at the end).
- `post_categories` join: link the new post to the new category.
- Internal links inside the pillar `body_html` "Related reading" list: "GEO vs SEO" → `/geo-vs-seo`. Other related items stay as plain text since no pages exist yet.

### 3. Markdown → HTML

Conversion done **once** during migration authoring (server-side, before SQL is generated) using `marked` in a one-shot Node script — only the resulting HTML strings end up in the migration file. No new runtime dep added to the app.

### 4. Prerender list

Add `/generative-engine-optimization` and `/geo-vs-seo` to the Tier-1 set in `src/prerender.ts` so they ship as static HTML on first deploy. (Pillars + posts already get picked up by the bulk collector; this just guarantees Tier-1 inclusion regardless of cap.)

### 5. No route changes

`/$slug` already resolves: article → pillar → archive. The moment the rows exist, both URLs work. `PillarView` renders the new pillar identically to `/cybersecurity`.

## Out of scope (still queued from earlier)

Homepage QA fixes (Crisis PR / Other News / 5W bar / FAQPage schema / Ronn sidebar bio cap / hydration error in `ByLine`) — I'll resume that list right after this lands.

Approve and I'll generate both images, then ship the migration + prerender update in one go.
