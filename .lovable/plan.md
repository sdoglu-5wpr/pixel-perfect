## Trace

`/luxury` → matches `src/routes/$slug.tsx` → loader runs `getPillar({slug:"luxury"})` → returns `{kind:"pillar", data: PillarPayload}` → route's `head({loaderData})` calls `buildPillarHead(...)` (`src/serverFns/seo.head.ts:315`) → returns `{ meta, links:[{rel:"canonical",href:url}], scripts:[{type:"application/ld+json", children:"..."}] }` → TanStack Start serializes head into the SSR HTML stream.

## Diagnostic — what's actually in the live HTML

Curl of `https://everythingpr.lovable.app/luxury` (live, today):

| What | Source | Present? |
|---|---|---|
| `<title>Luxury Communications & UHNW Intelligence · Everything-PR</title>` | leaf `buildPillarHead` meta | ✅ |
| `<meta property="og:title">`, `og:description`, `og:image`, `og:type`, robots | leaf meta | ✅ |
| Root meta (charSet, viewport) | `__root.tsx` meta | ✅ |
| Root `<link rel="icon">`, preconnect, stylesheet | `__root.tsx` links | ✅ |
| Root gtag `<script src>` + inline gtag | `__root.tsx` scripts | ✅ |
| **Leaf `<link rel="canonical">`** | `buildPillarHead` links | ❌ MISSING |
| **Leaf `<script type="application/ld+json">` (FAQPage / CollectionPage / ItemList / Breadcrumb)** | `buildPillarHead` scripts | ❌ MISSING |

Counter-test: `/about` and `/` (both PRERENDERED, not dynamic-SSR) DO emit leaf-route canonical link AND leaf jsonld script (verified — `/about` HTML contains `<link rel="canonical" href=".../about/"/>` plus a 4-node `@graph` script). So leaf head().links/scripts work on the **prerender pass** but get dropped on the **dynamic SSR Worker pass**.

## Root cause (highly likely)

`/about` (slug exists in `posts.type='page'`) and `/` are in the prerender list (`src/prerender.ts:165-172`). Pillar slugs (`/luxury`, `/sports`, `/social-media`, etc.) are NOT in `posts` — they're rows in the `pillars` table — so `collectUrls()` never adds them, and they're served by the runtime SSR Worker via `@tanstack/react-start/server-entry`.

The Worker SSR path is dropping leaf-route `head().links` and `head().scripts` arrays while preserving `head().meta`. Root-level scripts/links survive because they come from a different code path (`__root.tsx`'s static head, applied as the shell). This is consistent with a known class of TanStack head-merge issues where deferred/streamed leaf head content can race the head-flush — meta has eager merge semantics, scripts/links don't.

We can debug the framework cause separately, but the user-facing fix doesn't depend on it.

## Proposed fix — render JSON-LD and canonical inside the React component

Stop relying on `head().scripts`/`head().links` for pillar SEO. Move JSON-LD emission and canonical into `PillarView` as actual React-rendered tags, which the SSR HTML stream captures regardless of the head-merge bug.

### Changes

**1. `src/lib/pillars.shared.ts`** — extend `PillarPayload` with a `headExtras` shape (or just pass the existing fields PillarView already gets). No change if PillarView can rebuild the JSON-LD itself from `pillar` + `items`.

**2. `src/serverFns/seo.head.ts`** — extract the JSON-LD graph builder from `buildPillarHead` into a pure helper:

```ts
export function buildPillarSchemaGraph(opts: { /* same as buildPillarHead */ }): {
  jsonld: object;            // the @context+@graph object
  canonical: string;         // absolute URL
}
```

Keep `buildPillarHead` unchanged so meta still emits via TanStack head.

**3. `src/components/site/PillarView.tsx`** — at the top of the JSX (right under the `SiteLayout` open), inject:

```tsx
{/* SSR-safe canonical + JSON-LD: TanStack head().links/scripts are
    dropped on dynamic-SSR pillar routes (head().meta still works). */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonldGraph) }}
/>
```

(Canonical is more invasive to inject from a component — defer that to a follow-up; JSON-LD is the priority since it's what the user is tracking.)

**4. `src/routes/$slug.tsx`** — no change to `head()`; the pillar branch already calls `buildPillarHead` for meta. Just pass `jsonldGraph` (built once in the loader's host-aware code path) into `PillarView` via the existing `data` prop.

Cleanest: build the graph inside `PillarView` from `data.pillar` + `data.items` + `data.page`, calling `buildPillarSchemaGraph` directly. No new loader plumbing.

**5. `/about`** — PRERENDERED, currently working. Phase 2m's new Person nodes will appear automatically on next deploy. No change needed unless validation shows otherwise post-deploy.

**6. `/sports`, `/social-media`, `/luxury`, all other vertical landings** — all use `PillarView` (via `$slug.tsx` pillar branch), so all benefit from the single PillarView edit.

### Diff sketch

`src/components/site/PillarView.tsx` (top of the returned JSX):

```diff
+import { buildPillarSchemaGraph } from "@/serverFns/seo.head";
 ...
 export function PillarView({ data }: { data: PillarPayload }) {
   const { pillar, items: rawItems, total, page, pageSize } = data;
+  const jsonld = buildPillarSchemaGraph({
+    slug: pillar.slug, title: pillar.title, subtitle: pillar.subtitle,
+    heroImage: pillar.hero_image_url, page, totalItems: total,
+    items: items.map(i => ({ title: i.title, slug: i.slug })),
+    faq: pillar.faq, extraSchema: pillar.schema_jsonld ?? null,
+  });
   ...
   return (
     <SiteLayout>
+      <script
+        type="application/ld+json"
+        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
+      />
       {/* HERO */}
       ...
```

`src/serverFns/seo.head.ts` — extract the graph-building section of `buildPillarHead` (lines ~353-422) into `buildPillarSchemaGraph` returning the raw graph object; have `buildPillarHead` consume it for backward compatibility so prerender paths still work.

## Test plan

1. `bun run build` (or whatever the prerender command is — `scripts/build.mjs`).
2. `curl https://<preview-host>/luxury | grep -c FAQPage` → expect `1`.
3. `curl https://<preview-host>/luxury | grep -c CollectionPage` → expect `1`.
4. `curl https://<preview-host>/sports | python3 -c "import sys,re,json; t=sys.stdin.read(); m=re.search(r'<script type=\"application/ld\\+json\">(.*?)</script>',t,re.DOTALL); g=json.loads(m.group(1))['@graph']; print([n['@type'] for n in g])"` → expect `['NewsMediaOrganization','WebSite','CollectionPage','ItemList','BreadcrumbList','FAQPage']`.
5. `curl https://<preview-host>/about` → expect `Person` ×4 (Ronn + 3 contributors) once Phase 2m deploy ships. If still missing post-deploy, apply the same React-rendered pattern to `AboutPage.tsx`.
6. Validate JSON-LD via Google's Rich Results Test on `/luxury` → expect FAQPage and CollectionPage detected.

## Caveats

- **Canonical link** stays missing on dynamic-SSR pillar routes for now. React can't `<link>` outside `<head>` in standard SSR. Two follow-up options: (a) add a server-route-level header `Link: <url>; rel="canonical"` in `getPillar`'s `setResponseHeader` block (already used for X-Robots-Tag), or (b) move pillars into the prerender URL list in `src/prerender.ts` so they get the static-pass head-emission that already works. Recommend (a) as the lower-risk patch; (b) is cleaner long-term but increases the prerender cost.
- **Hydration**: React rendering a `<script type="application/ld+json">` is safe — no executable code, no hydration mismatch as long as the JSON is deterministic per route+page.
- **Framework-side fix**: the underlying TanStack head-merge drop-on-dynamic-SSR bug is worth filing upstream, but unblocking the SEO work doesn't require waiting on it.
- **Phase 2m /about**: emission is already working via prerender; the new Person nodes will appear after the next build/deploy. If they don't, we apply the same React-render pattern to `AboutPage.tsx`.
- **CF cache purge**: still requires the user's local token; same caveat as Phase 2k–2m.
