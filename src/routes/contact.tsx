import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ContactPage } from "@/components/site/ContactPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildStaticPageHead({
      path: "/contact",
      title: "Contact Everything-PR — Editorial Inquiries, Op-Eds & Press Releases",
      description:
        "Contact Everything-PR. Send editorial submissions, op-eds, press releases, and corrections to info@everything-pr.com.",
      breadcrumbs: [{ name: "Contact" }],
    }),
  component: () => (
    <SiteLayout>
      <ContactPage />
    </SiteLayout>
  ),
});
