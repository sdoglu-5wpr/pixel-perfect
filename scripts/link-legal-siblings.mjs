// Phase 2b second-pass — Inject cross-pillar sibling links into the 6
// /legal/ long-form articles. Mirrors scripts/link-public-affairs-siblings.mjs.
// Idempotent: skips a target if a link to that slug already exists.
//
// Usage:
//   bun run scripts/link-legal-siblings.mjs           # write
//   bun run scripts/link-legal-siblings.mjs --dry     # report only

import { createClient } from "@supabase/supabase-js";

const DRY = process.argv.includes("--dry");

const SUPABASE_URL =
  process.env.EPR_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.VITE_EPR_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;
const SERVICE_KEY =
  process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or service-role key in env.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Phrases listed longest-first per row. Case-sensitive flag noted inline.
const ROWS = [
  {
    target: "/amlaw-100-brand-strategy/",
    phrases: [
      { p: "AmLaw 100 brand", cs: true },
      { p: "AmLaw 100", cs: true },
      { p: "AmLaw", cs: true },
      { p: "BigLaw brand", cs: false },
    ],
  },
  {
    target: "/mass-tort-plaintiff-pr/",
    phrases: [
      { p: "mass tort communications", cs: false },
      { p: "mass tort marketing", cs: false },
      { p: "plaintiff firm marketing", cs: false },
      { p: "plaintiff bar", cs: false },
      { p: "mass tort", cs: false },
      { p: "mass-tort", cs: false },
    ],
  },
  {
    target: "/public-facing-litigation/",
    phrases: [
      { p: "litigation communications", cs: false },
      { p: "court of public opinion", cs: false },
      { p: "litigation PR", cs: false },
      { p: "high-stakes litigation", cs: false },
    ],
  },
  {
    target: "/legaltech-marketing/",
    phrases: [
      { p: "legaltech marketing", cs: false },
      { p: "legal technology marketing", cs: false },
      { p: "LegalTech", cs: true },
      { p: "legal tech", cs: false },
    ],
  },
  {
    target: "/lateral-partner-branding/",
    phrases: [
      { p: "lateral partner move", cs: false },
      { p: "lateral partner", cs: false },
      { p: "lateral move", cs: false },
      { p: "lateral hiring", cs: false },
    ],
  },
  {
    target: "/bar-regulation-comms/",
    phrases: [
      { p: "ABA Model Rules", cs: true },
      { p: "Model Rule 7", cs: true },
      { p: "lawyer advertising rules", cs: false },
      { p: "bar rules", cs: false },
      { p: "bar regulation", cs: false },
    ],
  },
];

const SLUGS = ROWS.map((r) => r.target.replace(/\//g, ""));
const SKIP_TAGS = ["a", "code", "pre", "kbd", "h1", "h2", "h3", "h4", "h5", "h6"];

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function buildSkipRanges(html) {
  const ranges = [];
  for (const tag of SKIP_TAGS) {
    const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "gi");
    let m;
    while ((m = re.exec(html)) !== null) {
      ranges.push([m.index, m.index + m[0].length]);
    }
  }
  return ranges;
}

function inSkip(idx, ranges) {
  for (const [a, b] of ranges) if (idx >= a && idx < b) return true;
  return false;
}

function findFirstMatch(html, phrase, skipRanges, caseSensitive) {
  const flags = caseSensitive ? "g" : "gi";
  const re = new RegExp(
    `(?<![A-Za-z0-9-])${escapeRegex(phrase)}(?![A-Za-z0-9-])`,
    flags,
  );
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!inSkip(m.index, skipRanges)) {
      return { index: m.index, length: m[0].length, text: m[0] };
    }
  }
  return null;
}

function processArticle(html, selfTarget) {
  const added = [];
  let cur = html;
  for (const row of ROWS) {
    if (row.target === selfTarget) continue;
    if (cur.includes(`href="${row.target}"`)) continue;
    let best = null;
    for (const ph of row.phrases) {
      const skipRanges = buildSkipRanges(cur);
      const hit = findFirstMatch(cur, ph.p, skipRanges, ph.cs);
      if (hit) { best = { phrase: ph.p, ...hit }; break; }
    }
    if (!best) continue;
    const before = cur.slice(0, best.index);
    const after = cur.slice(best.index + best.length);
    cur = before + `<a href="${row.target}">${best.text}</a>` + after;
    added.push({ text: best.text, target: row.target });
  }
  return { html: cur, added };
}

async function run() {
  const { data: rows, error } = await sb
    .from("posts")
    .select("id, slug, content_html")
    .eq("pillar_slug", "legal")
    .eq("article_type", "pillar")
    .order("pillar_index", { ascending: true });
  if (error) throw error;
  if (!rows?.length) { console.error("No legal pillar articles found."); process.exit(1); }

  console.log(`Found ${rows.length} articles.\n`);

  for (const row of rows) {
    const selfTarget = `/${row.slug}/`;
    const { html, added } = processArticle(row.content_html, selfTarget);
    let total = 0;
    for (const s of SLUGS) {
      const re = new RegExp(`href="/${s}/"`, "g");
      total += (html.match(re) || []).length;
    }
    console.log(`── /${row.slug}/`);
    if (added.length === 0) console.log("   (no new sibling links)");
    else for (const a of added) console.log(`   + "${a.text}" → ${a.target}`);
    console.log(`   total sibling links now: ${total}`);

    if (!DRY && added.length > 0) {
      const { error: upErr } = await sb
        .from("posts")
        .update({ content_html: html, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (upErr) console.error(`   ! update failed: ${upErr.message}`);
      else console.log("   ✓ saved");
    } else if (DRY) console.log("   (dry run — not saved)");
    console.log();
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
