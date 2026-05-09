/**
 * Build-time generator: writes sitemap XML files into dist/client/ so they
 * are served as static assets by Netlify (and any host) instead of falling
 * through the SPA fallback to index.html. Also writes /robots.txt and /feed
 * (RSS) so external consumers always get XML, not HTML.
 *
 * Run from scripts/build.mjs after the prerender pass.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  buildSitemapIndex,
  buildPostSitemap,
  buildPageSitemap,
  buildTermSitemap,
  buildAuthorSitemap,
  buildRssFeed,
} from "../src/serverFns/sitemaps.server";
import { SITE_URL, SITEMAP_PAGE_SIZE } from "../src/serverFns/seo.constants";
import { supabaseAnon } from "../src/integrations/supabase/client.anon.server";

const OUT = path.resolve(process.cwd(), "dist/client");

function write(rel: string, body: string) {
  const dest = path.join(OUT, rel);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, body, "utf8");
  console.log(`[sitemaps] wrote ${rel} (${body.length} bytes)`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  // sitemap index
  const indexXml = await buildSitemapIndex();
  write("sitemap_index.xml", indexXml);
  // alias commonly requested by crawlers
  write("sitemap.xml", indexXml);

  // per-section sitemaps
  const [pageXml, catXml, tagXml, authorXml] = await Promise.all([
    buildPageSitemap(),
    buildTermSitemap("categories", "category"),
    buildTermSitemap("tags", "tag"),
    buildAuthorSitemap(),
  ]);
  write("page-sitemap.xml", pageXml);
  write("category-sitemap.xml", catXml);
  write("post_tag-sitemap.xml", tagXml);
  write("author-sitemap.xml", authorXml);

  // post sitemaps (paginated)
  const { count } = await supabaseAnon
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "publish")
    .eq("type", "post");
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / SITEMAP_PAGE_SIZE));
  for (let p = 1; p <= pages; p++) {
    const xml = await buildPostSitemap(p);
    if (!xml) continue;
    const name = p === 1 ? "post-sitemap.xml" : `post-sitemap${p}.xml`;
    write(name, xml);
  }

  // RSS feed (legacy /feed and /feed/index.html style)
  const rss = await buildRssFeed();
  write("feed.xml", rss);

  // robots.txt — keep the static fallback aligned with src/routes/robots[.txt].ts
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

# Explicitly allow major AI crawlers — we WANT to be cited
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: DiffBot
Allow: /

User-agent: YouBot
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap_index.xml
`;
  write("robots.txt", robots);

  console.log(`[sitemaps] done — index + ${pages} post sitemap(s) + 4 term sitemaps + feed + robots`);
}

main().catch((e) => {
  console.error("[sitemaps] FAILED:", e);
  process.exit(1);
});
