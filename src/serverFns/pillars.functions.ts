import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { supabaseAnon } from "@/integrations/supabase/client.anon.server";
import { cached } from "@/serverFns/loader-cache.server";
import { fetchPillarViaRpc, type PillarPayload } from "@/lib/pillars.shared";

export type { PillarPayload, PillarRecord, PillarArticleItem, PillarFAQ } from "@/lib/pillars.shared";

export const getPillar = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; page?: number }) => {
    if (!input?.slug) throw new Error("slug required");
    return { slug: input.slug, page: Math.max(1, Number(input.page ?? 1)) };
  })
  .handler(async ({ data }): Promise<PillarPayload | null> => {
    try {
      setResponseHeader(
        "Cache-Control",
        process.env.INDEXING_ENABLED === "true"
          ? "public, max-age=120, s-maxage=300, stale-while-revalidate=600"
          : "private, max-age=0, must-revalidate",
      );
    } catch {}
    return cached(`pillar:${data.slug}:p${data.page}`, 60_000, () =>
      fetchPillarViaRpc(supabaseAnon, data.slug, data.page),
    );
  });
