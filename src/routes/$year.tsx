import { createFileRoute, notFound } from "@tanstack/react-router";
import { getArchive } from "@/server/archives.functions";
import { ArchiveView, type PageHref } from "@/components/site/ArchiveView";

function parseYear(s: string): number | null {
  if (!/^\d{4}$/.test(s)) return null;
  const y = parseInt(s, 10);
  return y >= 1990 && y <= 2100 ? y : null;
}

export const Route = createFileRoute("/$year")({
  loader: async ({ params }) => {
    const y = parseYear(params.year);
    if (y == null) throw notFound();
    const data = await getArchive({ data: { kind: "date", year: y, page: 1 } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.header.title} · Everything-PR` : "Archives" }],
  }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const { year } = Route.useParams();
  return (
    <ArchiveView
      data={data}
      eyebrow="Archives"
      buildHref={(p): PageHref => ({ to: "/$year", params: { year }, search: { page: p } })}
    />
  );
}
