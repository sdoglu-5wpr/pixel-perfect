// Phase 2b pre-stage — insert 6 draft placeholder rows for /legal pillar
// articles. Idempotent: existing slugs are left alone (status untouched).
// Run before Ronn's content lands; seed-legal.mjs will fill content_html
// and flip to publish.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.EPR_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;
const SERVICE_KEY =
  process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ARTICLES = [
  { i: 1, slug: "amlaw-100-brand-strategy",  title: "How the AmLaw 100 Built Brand: 40 Years of Positioning Inside America's Most Profitable Law Firms" },
  { i: 2, slug: "mass-tort-plaintiff-pr",    title: "The Plaintiff Bar Operating System: How Mass Tort Firms Built a Multi-Billion-Dollar Communications Industry" },
  { i: 3, slug: "public-facing-litigation",  title: "Court of Public Opinion: The Litigation Communications Playbook for High-Stakes Matters" },
  { i: 4, slug: "legaltech-marketing",       title: "Selling Software to Lawyers: The LegalTech Marketing Playbook From Harvey to Relativity" },
  { i: 5, slug: "lateral-partner-branding",  title: "The Lateral Partner Move: How High-Book Partners Manage Press, Clients, and the Switch" },
  { i: 6, slug: "bar-regulation-comms",      title: "What Lawyers Can Actually Say: The Bar Rules Governing Legal Marketing, PR, and AI" },
];

const CATEGORY_ID = 27962; // legal
const AUTHOR_ID = 1052;    // EPR Editorial Team

async function main() {
  const { data: maxRow } = await sb
    .from("posts").select("id")
    .order("id", { ascending: false }).limit(1).maybeSingle();
  let nextId = (maxRow?.id ?? 0) + 1;

  let inserted = 0, skipped = 0;
  for (const a of ARTICLES) {
    const { data: existing } = await sb
      .from("posts").select("id, status").eq("slug", a.slug).maybeSingle();
    if (existing) {
      console.log(`[skip] ${a.slug} already exists (id=${existing.id} status=${existing.status})`);
      skipped++;
      continue;
    }
    const id = nextId++;
    const row = {
      id,
      slug: a.slug,
      title: a.title,
      excerpt: "",
      content_html: "<p><em>Draft — content pending.</em></p>",
      status: "draft",
      type: "post",
      article_type: "pillar",
      pillar_slug: "legal",
      pillar_index: a.i,
      author_id: AUTHOR_ID,
      modified_at: new Date().toISOString(),
    };
    const { error } = await sb.from("posts").insert(row);
    if (error) { console.error(`[insert ${a.slug}]`, error); continue; }
    const { error: pcErr } = await sb
      .from("post_categories")
      .insert({ post_id: id, category_id: CATEGORY_ID });
    if (pcErr) console.warn(`[post_categories ${a.slug}]`, pcErr.message);
    console.log(`[insert] ${a.slug} → id=${id}`);
    inserted++;
  }
  console.log(`\n[done] inserted=${inserted} skipped=${skipped}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
