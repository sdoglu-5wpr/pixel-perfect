// Browser-only: attach the Supabase access token as a Bearer header to every
// /_serverFn/ request so server functions guarded by `requireSupabaseAuth`
// can authenticate. Without this, all admin server fns return 401 and the
// raw Response is thrown to the UI as "[object Response]".
import { supabase } from "@/integrations/supabase/client";

let installed = false;

export function installServerFnAuth() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (url && url.includes("/_serverFn/")) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
          if (!headers.has("authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          init = { ...(init ?? {}), headers };
        }
      }
    } catch {
      // fall through — let the original request go out as-is
    }
    return originalFetch(input as any, init);
  };
}
