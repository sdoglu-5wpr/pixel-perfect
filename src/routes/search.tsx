import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getArchive } from "@/server/archives.functions";
import { ArchiveView, type PageHref } from "@/components/site/ArchiveView";

const searchSchema = z.object({
  s: z.string().optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const Route = createFileRoute("/search")({
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({ search }) => ({ s: search.s, page: search.page }),
  loader: async ({ deps }) => {
    return await getArchive({ data: { kind: "search", q: deps.s, page: deps.page } });
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.header.title} · Everything-PR` : "Search" }],
  }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData()!;
  const { s } = Route.useSearch();
  return (
    <ArchiveView
      data={data}
      eyebrow="Search"
      buildHref={(p): PageHref => ({ to: "/search", search: { s, page: p } })}
    />
  );
}
