import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { error } = await sb.from("pillars").update({ schema_jsonld: null }).eq("slug","public-affairs");
console.log(error || "cleared schema_jsonld");
