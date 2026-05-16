#!/usr/bin/env node
// Strip the "URL: / Vertical: / Author:" meta paragraph that leaked into
// article bodies, and reassign author_id when the meta line names a real
// author present in the authors table.
import { createClient } from "@supabase/supabase-js";

const url = process.env.EPR_SUPABASE_URL;
const key = process.env.EPR_SUPABASE_SERVICE_KEY;
if (!url || !key) throw new Error("missing EPR_SUPABASE_URL/EPR_SUPABASE_SERVICE_KEY");
const sb = createClient(url, key, { auth: { persistSession: false } });

// Load author map (display_name lowercase -> id)
const { data: authors, error: aerr } = await sb.from("authors").select("id, display_name, slug");
if (aerr) throw aerr;
const byName = new Map();
for (const a of authors) {
  byName.set(a.display_name.trim().toLowerCase(), a.id);
}

// Fetch all candidate posts (paged)
async function fetchAll() {
  const out = [];
  let from = 0;
  const pageSize = 200;
  while (true) {
    const { data, error } = await sb
      .from("posts")
      .select("id, slug, author_id, content_html")
      .ilike("content_html", "%<strong>URL:%")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return out;
}

const posts = await fetchAll();
console.log(`[strip-meta] ${posts.length} candidate posts`);

// Regex to find a <p> that contains "URL:" + <code> path, optionally followed by Vertical/Author/H1 etc.
// Match either:
//   <p>...<strong>URL:</strong>...<code>...</code>...</p>
// Be permissive across whitespace/newlines.
const metaParaRe = /<p>(?:\s|<br\s*\/?>)*<strong>\s*URL\s*:\s*<\/strong>[\s\S]*?<\/p>\s*/i;
const dashParaRe = /^<p>\s*-{2,}\s*<\/p>\s*/i;
const authorRe = /<strong>\s*Author\s*:\s*<\/strong>\s*([^<\n]+?)(?:<|$)/i;

let updated = 0;
let reassigned = 0;
let skipped = 0;

for (const p of posts) {
  const html = p.content_html || "";
  const m = html.match(metaParaRe);
  if (!m) { skipped++; continue; }

  // Extract author name from the meta paragraph (if present)
  let newAuthorId = null;
  const am = m[0].match(authorRe);
  if (am) {
    const name = am[1].replace(/&amp;/g, "&").trim().toLowerCase();
    if (byName.has(name)) newAuthorId = byName.get(name);
  }

  // Strip the meta paragraph
  let next = html.replace(metaParaRe, "");
  // Strip an immediately-following <p>---</p> separator (used in cluster docs)
  next = next.replace(dashParaRe, "");
  // Also strip any <p>---</p> that may have been *before* the meta para and is now leading
  next = next.replace(dashParaRe, "");

  if (next === html && newAuthorId === null) { skipped++; continue; }

  const patch = { content_html: next };
  if (newAuthorId && newAuthorId !== p.author_id) {
    patch.author_id = newAuthorId;
    reassigned++;
  }
  const { error } = await sb.from("posts").update(patch).eq("id", p.id);
  if (error) { console.error(`[strip-meta] ${p.slug} update failed:`, error.message); continue; }
  updated++;
  if (updated % 20 === 0) console.log(`[strip-meta] updated ${updated}…`);
}

console.log(`[strip-meta] done. updated=${updated} reassigned=${reassigned} skipped=${skipped}`);
