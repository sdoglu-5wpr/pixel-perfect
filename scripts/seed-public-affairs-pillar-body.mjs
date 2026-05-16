// Seed the Public Affairs pillar body with the "AI Policy Visibility Gap" study.
// - Reads data/research-sources/public-affairs-ai-policy-visibility-gap.html
// - Strips masthead / hero / footer (the pillar template provides its own)
// - Prefixes every CSS selector with .epr-pa-study so the study styles do
//   not leak into the rest of the site
// - Loads google fonts via <link> appended once at the top of body_html
// - Updates pillars.body_html, .schema_jsonld, .faq, .subtitle for slug
//   public-affairs.
//
// Usage: bun run scripts/seed-public-affairs-pillar-body.mjs

import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "data/research-sources/public-affairs-ai-policy-visibility-gap.html");
const SLUG = "public-affairs";
const WRAP = "epr-pa-study";

const url = process.env.EPR_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE creds.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const raw = readFileSync(SRC, "utf8");

// 1. Extract <style>…</style>
const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
const rawCss = styleMatch ? styleMatch[1] : "";

// 2. Scope-prefix every selector with .epr-pa-study (skip @rules, keyframes-from/to)
function prefixCss(css, scope) {
  // Strip @media/@keyframes content but keep their wrappers and recurse on inner rules.
  // Tokenizer: walk and find selector { ... } blocks at depth 0; inside @media, recurse.
  const out = [];
  let i = 0;
  while (i < css.length) {
    // Skip whitespace
    const ws = css.slice(i).match(/^\s+/);
    if (ws) { out.push(ws[0]); i += ws[0].length; continue; }
    // Comment
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) { out.push(css.slice(i)); break; }
      out.push(css.slice(i, end + 2)); i = end + 2; continue;
    }
    // @media / @supports etc – recurse on inner block
    if (css[i] === "@") {
      const braceStart = css.indexOf("{", i);
      const head = css.slice(i, braceStart + 1);
      // Find matching close brace
      let depth = 1, j = braceStart + 1;
      for (; j < css.length && depth > 0; j++) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
      }
      const inner = css.slice(braceStart + 1, j - 1);
      const isAtRuleWithSelectors = /^@(media|supports|container|layer)\b/i.test(head);
      out.push(head);
      out.push(isAtRuleWithSelectors ? prefixCss(inner, scope) : inner);
      out.push("}");
      i = j; continue;
    }
    // Selector block
    const braceStart = css.indexOf("{", i);
    if (braceStart === -1) { out.push(css.slice(i)); break; }
    const selectorList = css.slice(i, braceStart);
    let depth = 1, j = braceStart + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
    }
    const body = css.slice(braceStart, j);
    const scoped = selectorList
      .split(",")
      .map((sel) => {
        const t = sel.trim();
        if (!t) return t;
        // :root → .scope
        if (/^:root\b/.test(t)) return `.${scope}${t.slice(5)}`;
        // body { … } → .scope { … }
        if (/^body\b/.test(t)) return `.${scope}${t.slice(4)}`;
        // html { scroll-behavior: smooth; } – drop (don't override site)
        if (/^html\b/.test(t)) return `.${scope}`;
        if (/^\*\b/.test(t)) return `.${scope} ${t}`;
        return `.${scope} ${t}`;
      })
      .filter(Boolean)
      .join(", ");
    out.push(scoped + " " + body);
    i = j;
  }
  return out.join("");
}

const scopedCss = prefixCss(rawCss, WRAP);

// 3. Extract <body>…</body>
const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : raw;

// 4. Remove masthead, hero section, footer, and JSON-LD <script>
body = body
  .replace(/<header class="masthead"[\s\S]*?<\/header>/i, "")
  .replace(/<section class="hero">[\s\S]*?<\/section>/i, "")
  .replace(/<footer>[\s\S]*?<\/footer>/i, "")
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .trim();

// 5. Compose final body_html
const fontsLink =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">';

// Box .section-inner (max-width 1320 + padding) -> remove the outer constraints
// since the pillar body sits inside a max-w-7xl prose column already; we let
// the study fill the column width by overriding .section-inner padding.
const overrides = `
.${WRAP} { font-family: 'Instrument Sans', system-ui, sans-serif; color: var(--ink); background: transparent; }
.${WRAP} > section { background: transparent; }
.${WRAP} .section-inner, .${WRAP} .killer-inner, .${WRAP} .takeaway-inner { max-width: 100%; padding-left: 0; padding-right: 0; }
.${WRAP} h1, .${WRAP} h2, .${WRAP} h3, .${WRAP} h4 { color: var(--ink); }
.${WRAP} .takeaway { margin: 56px -2rem; padding: 64px 2rem; }
.${WRAP} .takeaway h2, .${WRAP} .takeaway h3, .${WRAP} .takeaway p { color: var(--paper); }
`;

const styleBlock = `<style>${scopedCss}${overrides}</style>`;
const body_html = `${fontsLink}${styleBlock}<div class="${WRAP}">${body}</div>`;

// 6. Extract JSON-LD (the @graph)
const ldMatch = raw.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
let schema_jsonld = null;
let faq = [];
if (ldMatch) {
  try {
    const parsed = JSON.parse(ldMatch[1]);
    schema_jsonld = parsed;
    const faqNode = (parsed["@graph"] || []).find((n) => n["@type"] === "FAQPage");
    if (faqNode) {
      faq = (faqNode.mainEntity || []).map((q) => ({
        q: q.name,
        a: q.acceptedAnswer?.text || "",
      }));
    }
  } catch (e) {
    console.warn("Could not parse JSON-LD:", e.message);
  }
}

const subtitle =
  "The AI Policy Visibility Gap · Q1 2026 Study. OpenAI and Anthropic out-cite every Washington trade group combined — by nearly 5×.";

console.log(`Updating pillar ${SLUG}: body=${body_html.length} chars, faq=${faq.length}`);

const { error } = await sb
  .from("pillars")
  .update({
    body_html,
    schema_jsonld,
    faq,
    subtitle,
    hero_image_url: "/pillars/public-affairs.png",
    published: true,
  })
  .eq("slug", SLUG);

if (error) {
  console.error("Update failed:", error);
  process.exit(1);
}

const { data: check } = await sb
  .from("pillars")
  .select("slug, title, subtitle, length:body_html, hero_image_url")
  .eq("slug", SLUG)
  .maybeSingle();
console.log("OK:", JSON.stringify({ ...check, len: body_html.length }, null, 2));
