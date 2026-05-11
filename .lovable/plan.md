## Goal
Hide the "About 5W" boilerplate block on pillar pages (e.g. `/cannabis`), the same way it's already hidden on article pages.

## Root cause
`/cannabis` is a **pillar page** rendered by `src/components/site/PillarView.tsx`. The pillar's `body_html` (stored in DB) contains:

```
<h2>About 5W</h2>
<p>5W is the AI Communications Firm, ...</p>
```

The helper `stripAbout5WFromHtml` (in `src/lib/faq.ts`) already exists and is applied in `src/routes/$slug.tsx` for articles — but **not** for pillars. So the block leaks through on pillar pages.

## Change (one file)

**`src/components/site/PillarView.tsx`**
- Import `stripAbout5WFromHtml` from `@/lib/faq`.
- Compute `const bodyHtml = stripAbout5WFromHtml(pillar.body_html);` near the top of the component.
- Replace `dangerouslySetInnerHTML={{ __html: pillar.body_html }}` (line 78) with `__html: bodyHtml`.

This removes the heading and the paragraph(s) under it, up to the next heading — exactly the same logic that already runs for articles. No DB changes, no edits to the boilerplate stored in the pillar record (so it remains editable in admin if ever needed), and no impact on other content.

## Why not also strip in articles? 
Already done — the article path in `src/routes/$slug.tsx` already calls `stripAbout5WFromHtml`. This only adds parity for pillars.

## Out of scope
- Removing the boilerplate from the database content.
- Adding admin UI to toggle the disclosure.
- Touching archive pages (they don't render `body_html`).