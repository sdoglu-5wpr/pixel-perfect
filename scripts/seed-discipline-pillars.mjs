// Seed/upsert V2 discipline pillars (batch 1): seo, analyst-relations,
// content-marketing, podcast-pr, media-training. Idempotent on slug.
//
// Parses data/pillars-sources/v2-disciplines.md split on
// `# PAGE N — \`/<slug>\`` boundaries, then per pillar extracts:
//   title (H1), subtitle (bold tagline), meta_description (YAML),
//   body_html (coverage paragraph + all H2 sections + Topics/Most active/
//   Related blocks; SKIPS: YAML, "Industry Pillar", H1, tagline, image,
//   "Pillar · X" label, FAQ section), faq JSONB (5 Q/A pairs from FAQ
//   section).
//
// Usage:
//   bun run scripts/seed-discipline-pillars.mjs       # apply
//   bun run scripts/seed-discipline-pillars.mjs --dry # parse only
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SOURCE = path.join(process.cwd(), "data/pillars-sources/v2-disciplines.md");
const DRY = process.argv.includes("--dry");
const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const SUPABASE_URL = process.env.EPR_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error("missing supabase env"); process.exit(1); }
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderInline(s) {
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
    (_m, t, u) => `<a href="${u}">${t}</a>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return out;
}

// Render a "block" of markdown lines (no FAQ, no YAML, no images, no H1).
// Supports: H2 (## ...), bullet lists (- ...), paragraphs.
function renderBlocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (!ln.trim()) { i++; continue; }
    if (ln.startsWith("## ")) {
      out.push(`<h2>${renderInline(ln.slice(3).trim())}</h2>`);
      i++; continue;
    }
    if (ln.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${renderInline(lines[i].slice(2).trim())}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    // Paragraph: collect until blank or block start
    const buf = [ln];
    i++;
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("## ") && !lines[i].startsWith("- ")) {
      buf.push(lines[i]); i++;
    }
    out.push(`<p>${renderInline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function parsePillar(section) {
  const lines = section.split("\n");
  // PAGE header
  const headerMatch = lines[0].match(/^# PAGE \d+ — `\/([^`]+)`/);
  if (!headerMatch) return null;
  const slug = headerMatch[1];

  // YAML frontmatter
  const yamlStart = lines.findIndex((l) => l.trim() === "```yaml");
  const yamlEnd = lines.findIndex((l, idx) => idx > yamlStart && l.trim() === "```");
  const yaml = {};
  for (let i = yamlStart + 1; i < yamlEnd; i++) {
    const m = lines[i].match(/^([^:]+):\s*(.*)$/);
    if (m) yaml[m[1].trim()] = m[2].trim();
  }
  const meta_description = yaml["meta-description"] || null;

  // H1
  const h1Idx = lines.findIndex((l, idx) => idx > yamlEnd && l.startsWith("# "));
  const title = lines[h1Idx].slice(2).trim();

  // Tagline (next non-empty line, **...**)
  let tagIdx = h1Idx + 1;
  while (tagIdx < lines.length && !lines[tagIdx].trim()) tagIdx++;
  const tagMatch = lines[tagIdx]?.match(/^\*\*(.+)\*\*$/);
  const subtitle = tagMatch ? tagMatch[1].trim() : null;

  // Find FAQ start
  const faqIdx = lines.findIndex((l) => l.trim() === "## Frequently Asked Questions");

  // Find body start: skip image, "Pillar · ..." label
  let bodyStart = tagIdx + 1;
  while (bodyStart < faqIdx) {
    const l = lines[bodyStart];
    if (!l.trim()) { bodyStart++; continue; }
    if (l.startsWith("![")) { bodyStart++; continue; }
    if (/^\*\*Pillar · /.test(l)) { bodyStart++; continue; }
    break;
  }

  const bodyLines = lines.slice(bodyStart, faqIdx >= 0 ? faqIdx : lines.length);
  const body_html = renderBlocks(bodyLines);

  // FAQ
  const faq = [];
  if (faqIdx >= 0) {
    const faqLines = lines.slice(faqIdx + 1);
    let i = 0;
    while (i < faqLines.length) {
      const l = faqLines[i].trim();
      const qm = l.match(/^\*\*(.+)\*\*$/);
      if (qm) {
        const q = qm[1].trim();
        // collect answer until next blank then next bold-Q or end
        const ans = [];
        i++;
        while (i < faqLines.length) {
          const al = faqLines[i];
          if (!al.trim()) break;
          ans.push(al.trim());
          i++;
        }
        faq.push({ q, a: ans.join(" ") });
      } else {
        i++;
      }
    }
  }

  return {
    slug, title, subtitle, meta_description,
    body_html,
    faq,
    hero_image_url: `/pillars/${slug}.png`,
    robots: ROBOTS,
    published: true,
  };
}

const md = readFileSync(SOURCE, "utf8");
const sections = md.split(/(?=^# PAGE \d+ — `\/[^`]+`)/m).filter((s) => /^# PAGE/.test(s));
const pillars = sections.map(parsePillar).filter(Boolean);

console.log(`Parsed ${pillars.length} pillars`);
for (const p of pillars) {
  console.log(`  ${p.slug}: title="${p.title}" body=${p.body_html.length}ch faq=${p.faq.length}`);
}

if (DRY) { console.log("DRY — no writes"); process.exit(0); }

let ok = 0, fail = 0;
for (const p of pillars) {
  const { data: existing } = await sb.from("pillars").select("id").eq("slug", p.slug).maybeSingle();
  const row = {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    body_html: p.body_html,
    faq: p.faq,
    hero_image_url: p.hero_image_url,
    robots: p.robots,
    published: p.published,
    updated_at: new Date().toISOString(),
  };
  let err;
  if (existing) {
    ({ error: err } = await sb.from("pillars").update(row).eq("id", existing.id));
  } else {
    ({ error: err } = await sb.from("pillars").insert(row));
  }
  if (err) { fail++; console.error(`ERR ${p.slug}: ${err.message}`); }
  else { ok++; console.log(`OK  ${p.slug} (${existing ? "updated" : "inserted"})`); }
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
