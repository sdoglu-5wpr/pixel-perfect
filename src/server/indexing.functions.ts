import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { supabaseAnon } from "@/integrations/supabase/client.anon.server";

export type IndexingState = {
  enabled: boolean;
  reason: string | null;
  source: "env" | "db" | "default";
};

/**
 * Resolve indexing state. Env var (EPR_INDEXING_ENABLED) wins over DB
 * (site_settings.indexing_enabled). Also sets the X-Robots-Tag response
 * header so indexing is enforced even before the HTML <meta> renders.
 */
export const getIndexingState = createServerFn({ method: "GET" }).handler(
  async (): Promise<IndexingState> => {
    let state: IndexingState = { enabled: true, reason: null, source: "default" };

    const env = process.env.EPR_INDEXING_ENABLED;
    if (env !== undefined && env !== "") {
      state = {
        enabled: env === "true" || env === "1",
        reason: "EPR_INDEXING_ENABLED env var",
        source: "env",
      };
    } else {
      try {
        const { data } = await supabaseAnon
          .from("site_settings")
          .select("key, value")
          .in("key", ["indexing_enabled", "noindex_reason"]);
        const map = new Map((data ?? []).map(r => [r.key, r.value as unknown]));
        const dbEnabled = map.get("indexing_enabled");
        if (dbEnabled !== undefined) {
          state = {
            enabled: dbEnabled === true || dbEnabled === "true",
            reason: (map.get("noindex_reason") as string | null) ?? null,
            source: "db",
          };
        }
      } catch (e) {
        console.error("[indexing] failed to read site_settings:", e);
      }
    }

    if (!state.enabled) {
      try {
        setResponseHeaders(
          new Headers({ "X-Robots-Tag": "noindex, nofollow" })
        );
      } catch {
        // setResponseHeaders only works inside a request — ignore otherwise.
      }
    }
    return state;
  }
);
