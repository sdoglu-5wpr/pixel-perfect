import { createClient } from "@supabase/supabase-js";
const supa = createClient(process.env.EPR_SUPABASE_URL, process.env.EPR_SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
const SKIP = new Set(["b2b","defense","luxury","real-estate","web3","sports","travel","public-affairs","legal","education"]);
const rx = /\bA\.?I\.?\s+[Ee]ngines?\b/g;
const hits = [];
function scan(slug, kind, field, html) {
  if (!html) return;
  let m;
  while ((m = rx.exec(html)) !== null) {
    const s = Math.max(0, m.index - 100);
    const e = Math.min(html.length, m.index + m[0].length + 100);
    hits.push({ slug, kind, field, match: m[0], context: html.slice(s, e).replace(/\s+/g, " ") });
  }
}
const { data: pillars } = await supa.from("pillars").select("slug, body_html, subtitle, faq");
for (const p of pillars) {
  if (SKIP.has(p.slug)) continue;
  scan(p.slug, "pillar", "body_html", p.body_html);
  scan(p.slug, "pillar", "subtitle", p.subtitle);
  if (Array.isArray(p.faq)) for (const f of p.faq) { scan(p.slug,"pillar","faq.q",f.q); scan(p.slug,"pillar","faq.a",f.a); }
}
const { data: posts } = await supa.from("posts").select("slug, content_html, excerpt").eq("status","publish");
for (const p of posts) {
  scan(p.slug, "post", "content_html", p.content_html);
  scan(p.slug, "post", "excerpt", p.excerpt);
}
console.log(JSON.stringify({ count: hits.length, hits }, null, 2));
