// Server-side anon Supabase client. Uses the publishable key so RLS applies
// (anonymous role). Use this for public reads from server functions instead
// of supabaseAdmin, so policies like "status = 'publish'" filter rows.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function build() {
  const url = process.env.EPR_SUPABASE_URL;
  const key = process.env.EPR_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing EPR_SUPABASE_URL or EPR_SUPABASE_PUBLISHABLE_KEY in Project Secrets."
    );
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

let _client: ReturnType<typeof build> | undefined;
export const supabaseAnon = new Proxy({} as ReturnType<typeof build>, {
  get(_, p, r) {
    if (!_client) _client = build();
    return Reflect.get(_client, p, r);
  },
});
