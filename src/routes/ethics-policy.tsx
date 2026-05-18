import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, GoverningLaw } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/ethics-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/ethics-policy",
      title: "Ethics Policy — Everything-PR",
      description:
        "How Everything-PR works: accuracy, independence, disclosure of conflicts, sourcing integrity, sponsored-content rules, AI usage, and corrections.",
      breadcrumbs: [{ name: "Ethics Policy" }],
    }),
  component: () => (
    <PolicyPage title="Ethics Policy" eyebrow="Standards" lastUpdated="May 18, 2026">
      <p className="text-muted-foreground">
        Everything-PR covers the communications industry for an audience of
        professionals who expect accuracy and independence. This policy states
        the standards the editorial team works to.
      </p>

      <PolicySection>Accuracy</PolicySection>
      <p className="text-muted-foreground">
        We verify before we publish. Factual claims are sourced. Estimates are
        labeled as estimates. When we get something wrong, we correct it openly
        — see our{" "}
        <a href="/corrections-policy" className="text-brand-blue underline font-semibold">
          Corrections Policy
        </a>
        .
      </p>

      <PolicySection>Independence</PolicySection>
      <p className="text-muted-foreground">
        Editorial decisions are made by the Everything-PR editorial team. We do
        not accept payment, advertising commitments, or commercial relationships
        in exchange for coverage, favorable framing, or the omission of a story.
        No advertiser, sponsor, partner, or subject of coverage reviews or
        approves an article before publication.
      </p>

      <PolicySection>Disclosure and Conflicts of Interest</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR is published by Everything-PR News LLC, which shares common
        ownership with 5W AI Communications. Everything-PR's owner is also an
        investor in and active with numerous other companies. Coverage involving
        5W — or any company in which the owner holds a financial or advisory
        interest — is disclosed within the article. Coverage of other agencies
        is held to the same standards as coverage of 5W. Where a contributor
        writes about an organization they are connected to, that connection is
        disclosed on the article or the contributor's author page.
      </p>

      <PolicySection>Sourcing Integrity</PolicySection>
      <p className="text-muted-foreground">
        We identify our sources where possible and honor agreements on background
        and attribution. We do not fabricate quotes, sources, or data. Press
        releases and corporate communications are identified as such.
      </p>

      <PolicySection>Sponsored Content</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR does not publish pay-to-play articles disguised as
        editorial coverage. Any commercial placement is clearly labeled, in line
        with Federal Trade Commission guidance.
      </p>

      <PolicySection>Use of AI</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR uses AI tools to assist with research, drafting,
        fact-checking, and production. Every article is reviewed, edited, and
        approved by a human editor or author before publication. AI is used as
        an editorial production tool — not as an editorial authority.
      </p>

      <PolicySection>Corrections and Feedback</PolicySection>
      <p className="text-muted-foreground">
        We welcome corrections and reader feedback. To raise an accuracy issue,
        email{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>{" "}
        with the article URL and the specific concern. See our{" "}
        <a href="/corrections-policy" className="text-brand-blue underline font-semibold">
          Corrections Policy
        </a>{" "}
        and{" "}
        <a href="/editorial-policy" className="text-brand-blue underline font-semibold">
          Editorial Policy
        </a>
        .
      </p>

      <GoverningLaw policyName="Ethics Policy" />
    </PolicyPage>
  ),
});
