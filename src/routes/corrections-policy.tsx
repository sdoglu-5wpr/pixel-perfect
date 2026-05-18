import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, GoverningLaw } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/corrections-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/corrections-policy",
      title: "Corrections Policy — Everything-PR",
      description:
        "How Everything-PR handles corrections: minor fixes, substantive corrections, dated correction notes, and how to request one.",
      breadcrumbs: [{ name: "Corrections Policy" }],
    }),
  component: () => (
    <PolicyPage title="Corrections Policy" eyebrow="Standards" lastUpdated="May 18, 2026">
      <p className="text-muted-foreground">
        Everything-PR works for accuracy in everything it publishes. When we
        publish material that is later found to be incorrect, we correct it
        promptly and transparently.
      </p>

      <PolicySection>How we handle corrections</PolicySection>
      <ul className="space-y-3 text-muted-foreground list-disc pl-5">
        <li><strong className="text-foreground">Minor fixes</strong> — typographical errors, broken links, formatting — are corrected without a note.</li>
        <li><strong className="text-foreground">Substantive corrections</strong> — any change to a fact, figure, name, quote, or characterization — are appended to the bottom of the article with a dated correction note. Significant corrections are also flagged at the top of the article.</li>
        <li>Corrections are never silent edits to the facts of a story.</li>
      </ul>

      <PolicySection>How to request a correction</PolicySection>
      <p className="text-muted-foreground">
        Email{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>{" "}
        with the article URL, the specific passage in question, and the
        correction you are requesting, with supporting documentation. We review
        every request and respond within a reasonable timeframe.
      </p>

      <GoverningLaw policyName="Corrections Policy" />
    </PolicyPage>
  ),
});
