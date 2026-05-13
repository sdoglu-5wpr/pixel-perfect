import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const SESSION_WAIT_MS = 2500;
const SESSION_POLL_MS = 100;

export async function waitForAdminSession(expectedUserId?: string): Promise<Session | null> {
  if (typeof window === "undefined") return null;

  const deadline = Date.now() + SESSION_WAIT_MS;
  while (Date.now() <= deadline) {
    const { data } = await supabase.auth.getSession();
    const session = data.session ?? null;
    if (session && (!expectedUserId || session.user.id === expectedUserId)) return session;
    await new Promise((resolve) => window.setTimeout(resolve, SESSION_POLL_MS));
  }

  const { data } = await supabase.auth.getSession();
  const session = data.session ?? null;
  return session && (!expectedUserId || session.user.id === expectedUserId) ? session : null;
}

export async function persistReturnedSession(session: Session): Promise<Session | null> {
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return waitForAdminSession(session.user.id);
}