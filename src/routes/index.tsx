import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SiteLayout } from "@/components/site/SiteLayout";

const getLatestSlug = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("slug")
    .eq("type", "post")
    .eq("status", "publish")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  return { slug: data?.slug ?? null };
});

export const Route = createFileRoute("/")({
  loader: () => getLatestSlug(),
  component: Index,
});

function Index() {
  const { slug } = Route.useLoaderData();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Phase 1 · Article page shipped</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3">Everything-PR</h1>
        <p className="mt-4 text-muted-foreground">
          The homepage layout is the next step. For now, jump straight into the
          most recent published article to QA the article template.
        </p>
        {slug ? (
          <Link
            to="/$slug"
            params={{ slug }}
            className="inline-flex mt-8 items-center rounded-md bg-ink text-ink-foreground px-5 py-2.5 text-sm font-semibold hover:bg-ink/90"
          >
            Open the latest article →
          </Link>
        ) : (
          <p className="mt-8 text-sm text-destructive">No published posts found.</p>
        )}
      </div>
    </SiteLayout>
  );
}
