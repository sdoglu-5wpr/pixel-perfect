import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.EPR_SUPABASE_URL;
const SB_KEY = process.env.EPR_SUPABASE_SERVICE_KEY;
const WP = process.env.WP_BASE_URL?.replace(/\/$/, "");
const WP_USER = process.env.WP_USERNAME;
const WP_PASS = process.env.WP_APP_PASSWORD;

if (!SB_URL || !SB_KEY || !WP) { console.error("missing env"); process.exit(1); }

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
const auth = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

function pickSocial(meta = {}, desc = "") {
  const out = { twitter: null, linkedin: null, facebook: null, instagram: null };
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v !== "string" || !v) continue;
    const lk = k.toLowerCase();
    if (lk.includes("twitter")) out.twitter = v.startsWith("http") ? v : `https://twitter.com/${v.replace(/^@/, "")}`;
    else if (lk.includes("linkedin")) out.linkedin = v;
    else if (lk.includes("facebook")) out.facebook = v;
    else if (lk.includes("instagram")) out.instagram = v;
  }
  return out;
}

async function fetchWpUser(slug) {
  // Try authenticated lookup with full context to get email/meta
  const url = `${WP}/wp-json/wp/v2/users?slug=${encodeURIComponent(slug)}&context=edit&_fields=id,name,slug,description,url,avatar_urls,meta`;
  let r = await fetch(url, { headers: { Authorization: auth } });
  if (!r.ok) {
    // fallback to public
    r = await fetch(`${WP}/wp-json/wp/v2/users?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,description,url,avatar_urls`);
  }
  if (!r.ok) return null;
  const arr = await r.json();
  return Array.isArray(arr) && arr[0] ? arr[0] : null;
}

const { data: authors, error } = await sb.from("authors").select("id, slug, display_name, avatar_url, bio, website, social").order("post_count", { ascending: false });
if (error) { console.error(error); process.exit(1); }

console.log(`Processing ${authors.length} authors...`);
let updated = 0, skipped = 0, missing = 0;

for (const a of authors) {
  const needs = !a.bio || !a.avatar_url || !a.website;
  if (!needs) { skipped++; continue; }
  const wp = await fetchWpUser(a.slug);
  if (!wp) { missing++; console.log(`  miss ${a.slug}`); continue; }

  const bestAvatar = wp.avatar_urls ? (wp.avatar_urls["96"] || wp.avatar_urls["48"] || wp.avatar_urls["24"]) : null;
  const social = pickSocial(wp.meta || {}, wp.description || "");

  const patch = {
    bio: a.bio || (wp.description || null),
    avatar_url: a.avatar_url || (bestAvatar || null),
    website: a.website || (wp.url || null),
    social: { ...(a.social || {}), ...Object.fromEntries(Object.entries(social).filter(([,v]) => v)) },
  };

  const { error: uerr } = await sb.from("authors").update(patch).eq("id", a.id);
  if (uerr) { console.log(`  err ${a.slug}: ${uerr.message}`); continue; }
  updated++;
  if (updated % 10 === 0) console.log(`  updated=${updated} skipped=${skipped} missing=${missing}`);
}
console.log(`DONE updated=${updated} skipped=${skipped} missing=${missing}`);
