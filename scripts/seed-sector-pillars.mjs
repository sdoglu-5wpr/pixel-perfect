// Seed/upsert sector pillars (batch 3): one file per slug under
// data/pillars-sources/sectors/. Source files have:
//   - YAML frontmatter delimited by --- ... ---
//   - "Industry Pillar" label, then `# H1`, then plain-text tagline,
//     then "By EPR Staff", then "Pillar · ..." label, then body
//   - FAQ section uses "**Question?▾**" with trailing ▾ artifact;
//     8-10 Q/A pairs; answer is the next non-empty paragraph(s).
//
// Usage:
//   bun run scripts/seed-sector-pillars.mjs <file1.md> [file2.md ...]
//   bun run scripts/seed-sector-pillars.mjs --dry <file>
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const files = args.filter((a) => a !== "--dry");
if (!files.length) { console.error("usage: seed-sector-pillars.mjs [--dry] <file.md> ..."); process.exit(1); }

const SUPABASE_URL = process.env.EPR_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error("missing supabase env"); process.exit(1); }
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function renderInline(s) {
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_m, t, u) => `<a href="${u}">${t}</a>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return out;
}
function renderBlocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (!ln.trim()) { i++; continue; }
    if (ln.startsWith("### ")) { out.push(`<h3>${renderInline(ln.slice(4).trim())}</h3>`); i++; continue; }
    if (ln.startsWith("## ")) { out.push(`<h2>${renderInline(ln.slice(3).trim())}</h2>`); i++; continue; }
    if (ln.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(`<li>${renderInline(lines[i].slice(2).trim())}</li>`); i++; }
      out.push(`<ul>${items.join("")}</ul>`); continue;
    }
    const buf = [ln]; i++;
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("- ")) { buf.push(lines[i]); i++; }
    out.push(`<p>${renderInline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function parsePillar(md) {
  const lines = md.split("\n");
  // YAML between --- ... ---
  if (lines[0].trim() !== "---") throw new Error("expected YAML frontmatter");
  const yEnd = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  const yaml = {};
  for (let i = 1; i < yEnd; i++) {
    const m = lines[i].match(/^([^:]+):\s*(.*)$/);
    if (m) yaml[m[1].trim()] = m[2].trim();
  }
  const canonical = yaml["canonical"] || "";
  const slugMatch = canonical.match(/\/([^/]+)\/?$/);
  const slug = slugMatch ? slugMatch[1] : null;
  const meta_description = yaml["meta-description"] || null;

  // H1
  const h1Idx = lines.findIndex((l, i) => i > yEnd && l.startsWith("# "));
  const title = lines[h1Idx].slice(2).trim();

  // subtitle: next non-empty plain line
  let sIdx = h1Idx + 1;
  while (sIdx < lines.length && !lines[sIdx].trim()) sIdx++;
  const subtitle = lines[sIdx]?.trim() || null;

  // FAQ start
  const faqIdx = lines.findIndex((l) => l.trim() === "## Frequently Asked Questions");

  // body start: skip "By EPR Staff", "Pillar · ...", blank lines after subtitle
  let bodyStart = sIdx + 1;
  while (bodyStart < faqIdx) {
    const l = lines[bodyStart].trim();
    if (!l) { bodyStart++; continue; }
    if (l === "By EPR Staff") { bodyStart++; continue; }
    if (/^Pillar · /.test(l)) { bodyStart++; continue; }
    if (l === "Industry Pillar") { bodyStart++; continue; }
    break;
  }
  const bodyLines = lines.slice(bodyStart, faqIdx >= 0 ? faqIdx : lines.length);
  const body_html = renderBlocks(bodyLines);

  // FAQ: questions are **...▾** possibly with surrounding whitespace
  const faq = [];
  if (faqIdx >= 0) {
    const fls = lines.slice(faqIdx + 1);
    let i = 0;
    while (i < fls.length) {
      const l = fls[i].trim();
      const qm = l.match(/^\*\*(.+?)\*\*$/);
      if (qm) {
        let q = qm[1].trim();
        q = q.replace(/▾\s*$/, "").trim();
        i++;
        const ans = [];
        // skip blank
        while (i < fls.length && !fls[i].trim()) i++;
        while (i < fls.length && fls[i].trim() && !/^\*\*.+\*\*$/.test(fls[i].trim())) {
          ans.push(fls[i].trim()); i++;
        }
        faq.push({ q, a: ans.join(" ") });
      } else { i++; }
    }
  }

  return {
    slug, title, subtitle, meta_description,
    body_html, faq,
    hero_image_url: `/pillars/${slug}.png`,
    robots: ROBOTS, published: true,
  };
}

const pillars = [];
for (const f of files) {
  const md = readFileSync(path.resolve(f), "utf8");
  const p = parsePillar(md);
  pillars.push(p);
  console.log(`Parsed ${p.slug}: title="${p.title}" subtitle="${p.subtitle?.slice(0,60)}..." body=${p.body_html.length}ch faq=${p.faq.length}`);
}

if (DRY) { console.log("\nDRY — no writes"); process.exit(0); }

let ok = 0, fail = 0;
for (const p of pillars) {
  const { data: existing } = await sb.from("pillars").select("id").eq("slug", p.slug).maybeSingle();
  const row = {
    slug: p.slug, title: p.title, subtitle: p.subtitle,
    body_html: p.body_html, faq: p.faq,
    hero_image_url: p.hero_image_url, robots: p.robots, published: p.published,
    updated_at: new Date().toISOString(),
  };
  let err;
  if (existing) ({ error: err } = await sb.from("pillars").update(row).eq("id", existing.id));
  else ({ error: err } = await sb.from("pillars").insert(row));
  if (err) { fail++; console.error(`ERR ${p.slug}: ${err.message}`); }
  else { ok++; console.log(`OK  ${p.slug} (${existing ? "updated" : "inserted"})`); }
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
