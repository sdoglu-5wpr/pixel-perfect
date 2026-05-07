import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AboutPage } from "@/components/site/AboutPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/about")({
  head: () =>
    buildStaticPageHead({
      path: "/about/",
      title: "About Everything-PR — The Leading PR Industry Publication",
      description:
        "Everything-PR is the leading independent publication covering public relations, marketing, crisis communications, AI communications, and proprietary industry research. Published daily since 2009.",
      breadcrumbs: [{ name: "About" }],
    }),
  component: () => (
    <SiteLayout>
      <AboutPage />
    </SiteLayout>
  ),
});
