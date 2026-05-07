import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Build passes (driven by scripts/build.mjs):
//   LOVABLE_BUILD_PASS=prerender → no Cloudflare, no Netlify plugin. Prerender
//     enabled. TanStack's preview server expects dist/server/server.js, so we
//     keep the default server entry. Writes static HTML into
//     dist/client/<route>/index.html.
//
//   LOVABLE_BUILD_PASS=worker → Cloudflare plugin enabled, prerender disabled.
//     Emits the Cloudflare Worker (dist/server/index.js + wrangler.json).
//
//   LOVABLE_BUILD_PASS=netlify → Netlify plugin enabled, prerender disabled.
//     Cloudflare plugin disabled. Emits Netlify Functions bundle alongside
//     dist/client. Used by `npm run build:netlify`.
//
//   Anything else (dev, ad-hoc `vite build`) → no prerender, Cloudflare plugin
//     on by default during build.
const PASS = process.env.LOVABLE_BUILD_PASS;
const isPrerenderPass = PASS === "prerender";
const isNetlifyPass = PASS === "netlify";
const PRERENDER_DATA_PATH = resolve(process.cwd(), ".prerender-pages.json");

function loadPrerenderPages() {
  const raw = readFileSync(PRERENDER_DATA_PATH, "utf8");
  const data = JSON.parse(raw) as { pages?: Array<{ path: string }> };
  const pages = data.pages ?? [];
  if (pages.length === 0) {
    throw new Error("[vite.config] .prerender-pages.json contains 0 pages; refusing to run prerender pass");
  }
  return pages;
}

function buildTanstackOptions() {
  if (!isPrerenderPass) return {} as Record<string, unknown>;
  return {
    pages: loadPrerenderPages(),
    prerender: {
      enabled: true,
      concurrency: 4,
      autoStaticPathsDiscovery: false,
      crawlLinks: false,
      failOnError: false,
      retryCount: 1,
    },
  } as Record<string, unknown>;
}

const tanstackStart = buildTanstackOptions();

export default defineConfig({
  tanstackStart,
  // Disable Cloudflare plugin during prerender + netlify passes.
  cloudflare: isPrerenderPass || isNetlifyPass ? false : undefined,
  plugins: isNetlifyPass ? [netlify()] : [],
});
