import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/comments-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/comments-policy",
      title: "Comments Policy — Everything-PR",
      description:
        "Everything-PR's policy for reader comments: what we remove and how we keep the discussion civil and useful.",
      breadcrumbs: [{ name: "Comments Policy" }],
    }),
  component: () => (
    <PolicyPage title="Comments Policy" eyebrow="Standards" lastUpdated="May 18, 2026">
      <p className="text-muted-foreground">
        Everything-PR welcomes reader comments on its articles. Comments are not
        pre-moderated. We remove comments that:
      </p>
      <ul className="space-y-2 text-muted-foreground list-disc pl-5">
        <li>are abusive, harassing, or use excessive profanity</li>
        <li>contain ad hominem attacks or bullying</li>
        <li>contain racist, sexist, homophobic, or other slurs</li>
        <li>are spam, solicitations, or advertising for unrelated sites</li>
        <li>consist of keyword-stuffed signatures or low-value filler</li>
        <li>are posted to provoke other readers or staff</li>
        <li>infringe the copyright or intellectual property rights of others</li>
      </ul>
      <p className="text-muted-foreground">
        We may remove comments at our discretion to keep the discussion useful
        and civil. Questions about this policy:{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
        .
      </p>
    </PolicyPage>
  ),
});
