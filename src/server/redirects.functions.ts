import { createServerFn } from "@tanstack/react-start";
import { supabaseAnon } from "@/integrations/supabase/client.anon.server";

export const lookupRedirect = createServerFn({ method: "GET" })
  .inputValidator((input: { path: string }) => ({ path: input.path }))
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAnon
      .from("redirects")
      .select("target_path, status_code")
      .eq("source_path", data.path)
      .eq("enabled", true)
      .maybeSingle();
    return row ?? null;
  });
