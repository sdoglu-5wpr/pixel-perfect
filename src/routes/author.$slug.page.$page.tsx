import { createFileRoute, notFound } from "@tanstack/react-router";
import { getArchive } from "@/serverFns/archives.functions";
import { fetchArchiveViaRpc } from "@/lib/archives.shared";
import { supabase } from "@/integrations/supabase/client";
import { AuthorPage } from "@/components/site/AuthorPage";

export const Route = createFileRoute("/author/$slug/page/$page")({
  loader: async ({ params }) => {
    const page = parseInt(params.page, 10);
    if (!Number.isFinite(page) || page < 1) throw notFound();
    const data =
      typeof window !== "undefined"
        ? await fetchArchiveViaRpc(supabase, { kind: "author", slug: params.slug, page })
        : await getArchive({ data: { kind: "author", slug: params.slug, page } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.header.title} — Page ${loaderData.page} · Everything-PR` : "Author" }],
  }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <AuthorPage data={data} />;
}
