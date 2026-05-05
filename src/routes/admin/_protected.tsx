import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/server/admin-shell.functions";

type MeInfo = Awaited<ReturnType<typeof getMyRoles>>;

export const Route = createFileRoute("/admin/_protected")({
  // Client-side gate: ensure we have a session before calling getMyRoles
  // (which requires a bearer token).
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  loader: async () => {
    try {
      const me = await getMyRoles();
      return { me, accessError: null as string | null };
    } catch (e: any) {
      return { me: null as MeInfo | null, accessError: e?.message ?? String(e) };
    }
  },
  component: AdminLayout,
});

const NAV: Array<{ label: string; to: string }> = [
  { label: "Dashboard", to: "/admin" },
  { label: "Posts", to: "/admin" },
  { label: "Pages", to: "/admin" },
  { label: "Media", to: "/admin" },
  { label: "Categories", to: "/admin" },
  { label: "Tags", to: "/admin" },
  { label: "Authors", to: "/admin" },
  { label: "Redirects", to: "/admin" },
  { label: "Menus", to: "/admin" },
  { label: "SEO", to: "/admin" },
  { label: "Automations", to: "/admin" },
  { label: "Settings", to: "/admin" },
  { label: "Activity", to: "/admin" },
];

function AdminLayout() {
  const { me, accessError } = Route.useLoaderData();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(`Logout failed: ${error.message}`);
    navigate({ to: "/admin/login" });
  };

  if (accessError || !me) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="font-serif text-2xl font-bold">Access error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{accessError ?? "Unknown error"}</p>
        <button onClick={logout} className="mt-4 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">
          Sign out
        </button>
      </main>
    );
  }

  if (!me.isStaff) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="font-serif text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account exists but doesn't have admin/editor/author privileges.
          Contact <a href="mailto:emoraru@5wpr.com" className="underline">emoraru@5wpr.com</a>.
        </p>
        <button onClick={logout} className="mt-4 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">
          Sign out
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 shrink-0 border-r bg-surface-soft">
        <div className="px-4 py-4 border-b font-serif text-lg font-bold">Everything-PR</div>
        <nav className="p-2 space-y-1 text-sm">
          {NAV.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`block rounded px-3 py-1.5 hover:bg-muted ${
                pathname === item.to ? "bg-muted font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">Admin</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-foreground">{me.email ?? me.userId}</span>
            <span className="text-xs text-muted-foreground">[{me.roles.join(", ")}]</span>
            <button
              onClick={logout}
              className="rounded border px-3 py-1.5 hover:bg-muted"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
