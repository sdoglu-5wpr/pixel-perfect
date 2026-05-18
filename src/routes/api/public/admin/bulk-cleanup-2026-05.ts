// One-off bulk cleanup route. Reads the staged CSV at src/generated/bulk-cleanup-2026-05.csv,
// inserts redirects, and deletes posts + orphaned media. Idempotent — safe to re-run.
// Protected by a static token header. Delete this route after the cleanup is done.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
// Vite ?raw import — the CSV is bundled into the worker at build time.
import csvText from "@/generated/bulk-cleanup-2026-05.csv?raw";

const BULK_TOKEN = "everything-pr-bulk-cleanup-2026-05-xK9pQ2"; // one-shot, rotated after use

type Reason = "RFP" | "Seeking-agency" | "Thin-content" | "Hiring";
const TARGETS: Record<Reason, { target: string; status: number }> = {
  RFP: { target: "/category/rfp", status: 301 },
  "Seeking-agency": { target: "/category/pr-firms", status: 301 },
  "Thin-content": { target: "/", status: 301 },
  Hiring: { target: "/", status: 410 },
};

function parseCsv(text: string): Array<{ url: string; reason: Reason }> {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  // header: "url","title","published","html_len","reason"
  const out: Array<{ url: string; reason: Reason }> = [];
  for (let i = 1; i < lines.length; i++) {
    // CSV with quoted fields, commas inside quotes
    const m = lines[i].match(/^"([^"]*)","((?:[^"]|"")*)","([^"]*)","([^"]*)","([^"]*)"$/);
    if (!m) continue;
    const url = m[1];
    const reason = m[5] as Reason;
    if (!url.startsWith("/")) continue;
    if (!(reason in TARGETS)) continue;
    out.push({ url, reason });
  }
  return out;
}

async function runCleanup(dryRun: boolean) {
  const rows = parseCsv(csvText);
  const dedup = new Map<string, Reason>();
  for (const r of rows) if (!dedup.has(r.url)) dedup.set(r.url, r.reason);

  const redirectRows = Array.from(dedup, ([url, reason]) => ({
    source_path: url,
    target_path: TARGETS[reason].target,
    status_code: TARGETS[reason].status,
    enabled: true,
    notes: "bulk cleanup 2026-05",
  }));

  const slugs = Array.from(dedup.keys()).map((u) => u.replace(/^\//, ""));

  const summary = {
    dryRun,
    totalRows: dedup.size,
    redirectsInserted: 0,
    postsDeleted: 0,
    mediaDeleted: 0,
    storagePaths: [] as string[],
    errors: [] as string[],
  };

  if (dryRun) return summary;

  // 1. Insert redirects in chunks (upsert by source_path)
  const CHUNK = 500;
  for (let i = 0; i < redirectRows.length; i += CHUNK) {
    const chunk = redirectRows.slice(i, i + CHUNK);
    const { error, count } = await supabaseAdmin
      .from("redirects")
      .upsert(chunk, { onConflict: "source_path", ignoreDuplicates: true, count: "exact" });
    if (error) summary.errors.push(`redirects chunk ${i}: ${error.message}`);
    else summary.redirectsInserted += count ?? chunk.length;
  }

  // 2. Find post ids + media ids
  const postIds: number[] = [];
  const mediaIds = new Set<number>();
  for (let i = 0; i < slugs.length; i += 500) {
    const chunk = slugs.slice(i, i + 500);
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("id, featured_media_id")
      .in("slug", chunk);
    if (error) {
      summary.errors.push(`select posts ${i}: ${error.message}`);
      continue;
    }
    for (const p of data ?? []) {
      postIds.push(p.id);
      if (p.featured_media_id) mediaIds.add(p.featured_media_id);
    }
  }

  // 3. Collect storage paths before deleting media
  if (mediaIds.size > 0) {
    const mediaArr = Array.from(mediaIds);
    for (let i = 0; i < mediaArr.length; i += 500) {
      const chunk = mediaArr.slice(i, i + 500);
      const { data } = await supabaseAdmin
        .from("media")
        .select("storage_path")
        .in("id", chunk);
      for (const m of data ?? []) if (m.storage_path) summary.storagePaths.push(m.storage_path);
    }
  }

  // 4. Delete child rows + posts in chunks
  for (let i = 0; i < postIds.length; i += 500) {
    const chunk = postIds.slice(i, i + 500);
    for (const tbl of ["post_categories", "post_tags", "post_revisions"] as const) {
      const { error } = await supabaseAdmin.from(tbl).delete().in("post_id", chunk);
      if (error) summary.errors.push(`${tbl} ${i}: ${error.message}`);
    }
    {
      const { error } = await supabaseAdmin
        .from("internal_links")
        .delete()
        .or(`source_post_id.in.(${chunk.join(",")}),target_post_id.in.(${chunk.join(",")})`);
      if (error) summary.errors.push(`internal_links ${i}: ${error.message}`);
    }
    {
      const { error } = await supabaseAdmin
        .from("seo_meta")
        .delete()
        .eq("object_type", "post")
        .in("object_id", chunk);
      if (error) summary.errors.push(`seo_meta ${i}: ${error.message}`);
    }
    const { error: pErr, count } = await supabaseAdmin
      .from("posts")
      .delete({ count: "exact" })
      .in("id", chunk);
    if (pErr) summary.errors.push(`posts delete ${i}: ${pErr.message}`);
    else summary.postsDeleted += count ?? chunk.length;
  }

  // 5. Delete orphaned media (only those not referenced by any remaining post)
  if (mediaIds.size > 0) {
    const mediaArr = Array.from(mediaIds);
    for (let i = 0; i < mediaArr.length; i += 500) {
      const chunk = mediaArr.slice(i, i + 500);
      const { data: stillRef } = await supabaseAdmin
        .from("posts")
        .select("featured_media_id")
        .in("featured_media_id", chunk);
      const refs = new Set((stillRef ?? []).map((p) => p.featured_media_id));
      const orphans = chunk.filter((id) => !refs.has(id));
      if (orphans.length === 0) continue;
      await supabaseAdmin.from("media_variants").delete().in("media_id", orphans);
      const { error: mErr, count } = await supabaseAdmin
        .from("media")
        .delete({ count: "exact" })
        .in("id", orphans);
      if (mErr) summary.errors.push(`media delete ${i}: ${mErr.message}`);
      else summary.mediaDeleted += count ?? orphans.length;
    }
  }

  return summary;
}

export const Route = createFileRoute("/api/public/admin/bulk-cleanup-2026-05")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("token") !== BULK_TOKEN) {
          return new Response("Unauthorized", { status: 401 });
        }
        const dryRun = url.searchParams.get("apply") !== "1";
        try {
          const result = await runCleanup(dryRun);
          return Response.json(result, { status: 200 });
        } catch (e) {
          return Response.json(
            { error: e instanceof Error ? e.message : String(e) },
            { status: 500 },
          );
        }
      },
    },
  },
});
