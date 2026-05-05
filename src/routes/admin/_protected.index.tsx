import { createFileRoute, Link } from "@tanstack/react-router";
import { getAdminDashboard } from "@/server/admin-shell.functions";

export const Route = createFileRoute("/admin/_protected/")({
  loader: () => getAdminDashboard(),
  component: AdminDashboard,
  errorComponent: ({ error }) => (
    <div className="rounded border border-destructive/40 bg-destructive/10 p-4 text-sm">
      Failed to load dashboard: {error.message}
    </div>
  ),
});

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl font-bold">{value}</div>
    </div>
  );
}

function AdminDashboard() {
  const { counts, recent, scheduled } = Route.useLoaderData();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of content and configuration.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Posts" value={counts.posts} />
        <Card label="Pages" value={counts.pages} />
        <Card label="Media" value={counts.media} />
        <Card label="Redirects" value={counts.redirects} />
      </div>

      <section>
        <h2 className="font-serif text-lg font-bold mb-2">Recently edited</h2>
        <ul className="divide-y rounded border bg-card text-sm">
          {recent.length === 0 && <li className="p-3 text-muted-foreground">No posts yet.</li>}
          {recent.map(p => (
            <li key={p.id} className="flex items-center justify-between p-3">
              <Link to="/$slug" params={{ slug: p.slug }} className="hover:underline truncate">
                {p.title}
              </Link>
              <span className="text-xs text-muted-foreground ml-3 shrink-0">
                {p.status} · {p.modified_at ? new Date(p.modified_at).toLocaleString() : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-lg font-bold mb-2">Scheduled</h2>
        <ul className="divide-y rounded border bg-card text-sm">
          {scheduled.length === 0 && <li className="p-3 text-muted-foreground">No scheduled posts.</li>}
          {scheduled.map(p => (
            <li key={p.id} className="flex items-center justify-between p-3">
              <span className="truncate">{p.title}</span>
              <span className="text-xs text-muted-foreground ml-3 shrink-0">
                {p.published_at ? new Date(p.published_at).toLocaleString() : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
