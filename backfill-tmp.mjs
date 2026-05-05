import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.EPR_SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error("missing env"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

const WP_BASE = "https://everything-pr.com/wp-json/wp/v2";

async function fetchOg(postId) {
  try {
    const r = await fetch(`${WP_BASE}/posts/${postId}?_fields=yoast_head_json,jetpack_featured_media_url`, {
      headers: { accept: "application/json", "user-agent": "backfill/1.0" },
    });
    if (!r.ok) return { url: null, reason: `wp_http_${r.status}` };
    const j = await r.json();
    const og = j?.yoast_head_json?.og_image?.[0]?.url;
    if (typeof og === "string" && og.startsWith("http")) return { url: og, reason: "yoast" };
    const jp = j?.jetpack_featured_media_url;
    if (typeof jp === "string" && jp.startsWith("http")) return { url: jp, reason: "jetpack" };
    return { url: null, reason: "no_image_field" };
  } catch (e) { return { url: null, reason: `threw:${e.message}` }; }
}

const PAGE = 200;
let offset = 0;
let totalScanned = 0, totalUpdated = 0, totalSkipped = 0;
const reasons = {};
const errs = [];

while (true) {
  const { data: candidates, error } = await supabase
    .from("posts")
    .select("id, slug, content_html, first_inline_image")
    .eq("status", "publish")
    .eq("type", "post")
    .is("featured_media_id", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + PAGE - 1);
  if (error) { console.error("query err", error); break; }
  if (!candidates || candidates.length === 0) break;

  const targets = candidates.filter(p => !p.first_inline_image && !/<img\b/i.test(p.content_html ?? ""));
  totalScanned += targets.length;

  let batchUpdated = 0;
  for (const p of targets) {
    const { data: existing } = await supabase
      .from("seo_meta").select("id, og_image")
      .eq("object_type", "post").eq("object_id", p.id).maybeSingle();
    if (existing?.og_image) { totalSkipped++; reasons.already = (reasons.already||0)+1; continue; }

    const f = await fetchOg(p.id);
    if (!f.url) { totalSkipped++; reasons[f.reason] = (reasons[f.reason]||0)+1; continue; }

    if (existing?.id) {
      const { error: e } = await supabase.from("seo_meta").update({ og_image: f.url }).eq("id", existing.id);
      if (e) { errs.push(`#${p.id} update ${e.message}`); reasons.update_err=(reasons.update_err||0)+1; totalSkipped++; continue; }
    } else {
      const { error: e } = await supabase.from("seo_meta").insert({
        object_type: "post", object_id: p.id, url_path: `/${p.slug}/`,
        og_image: f.url, og_type: "article", twitter_card: "summary_large_image",
      });
      if (e) { errs.push(`#${p.id} insert ${e.message}`); reasons.insert_err=(reasons.insert_err||0)+1; totalSkipped++; continue; }
    }
    totalUpdated++; batchUpdated++;
  }

  console.log(`offset=${offset} candidates=${candidates.length} targets=${targets.length} updated=${batchUpdated} totalUpdated=${totalUpdated} totalSkipped=${totalSkipped}`);

  // If updated, those rows now have og_image but still fall in the "featured_media_id is null" pool
  // so they'll be skipped next pass. Always advance.
  offset += PAGE;
  if (offset > 15000) break;
}

console.log("\n=== DONE ===");
console.log({ totalScanned, totalUpdated, totalSkipped, reasons });
console.log("errors sample:", errs.slice(0, 10));
