import { createFileRoute, notFound } from "@tanstack/react-router";
import { getArchive } from "@/server/archives.functions";
import { ArchiveView, type PageHref } from "@/components/site/ArchiveView";

export const Route = createFileRoute("/tag/$slug")({
  loader: async ({ params }) => {
    const data = await getArchive({ data: { kind: "tag", slug: params.slug, page: 1 } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.header.title} · Everything-PR` : "Tag" }],
  }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const { slug } = Route.useParams();
  return (
    <ArchiveView
      data={data}
      eyebrow="Tag"
      buildHref={(p): PageHref => {
        if (p === 1) return { to: "/tag/$slug", params: { slug } };
        return { to: "/tag/$slug/page/$page", params: { slug, page: String(p) } };
      }}
    />
  );
}
