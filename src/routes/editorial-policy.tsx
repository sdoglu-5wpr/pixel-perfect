import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, GoverningLaw } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/editorial-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/editorial-policy",
      title: "Editorial Policy — Everything-PR",
      description:
        "Everything-PR's editorial standards: ownership disclosure, sourcing, corrections, sponsored content, AI usage, and contributor attribution.",
      breadcrumbs: [{ name: "Editorial Policy" }],
    }),
  component: () => (
    <PolicyPage title="Editorial Policy" eyebrow="Standards" lastUpdated="May 18, 2026">
      <p className="text-muted-foreground">
        Everything-PR is an independent trade publication covering communications,
        marketing, public relations, and AI visibility. Founded in January 2009,
        it has published continuously for more than 17 years — one of the
        longest-running independent sources of communications industry news,
        analysis, and research.
      </p>

      <PolicySection>Ownership and Disclosure</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR is published by Everything-PR News LLC. Everything-PR News
        LLC shares common ownership with 5W AI Communications.
      </p>
      <p className="text-muted-foreground">
        This relationship informs our editorial perspective; it does not direct
        our coverage. Everything-PR is produced by people active in the
        communications industry, which gives the publication practitioner insight
        outside observers cannot replicate. We hold to a clear set of standards
        that keep editorial coverage separate from commercial interest:
      </p>
      <ul className="space-y-3 text-muted-foreground list-disc pl-5">
        <li><strong className="text-foreground">5W coverage is always identified.</strong> When Everything-PR covers 5W research, new business, or personnel, the article names 5W as the subject.</li>
        <li><strong className="text-foreground">The owner's other interests are disclosed too.</strong> Where coverage involves any company in which Everything-PR's owner holds a financial or advisory interest, the relationship is disclosed within the article.</li>
        <li><strong className="text-foreground">Research is attributed to its authors.</strong> Where a study is produced jointly with 5W, that is stated on the study.</li>
        <li><strong className="text-foreground">Competitors are held to the same standard.</strong> Everything-PR covers agency news, account wins, M&amp;A activity, and executive moves across the industry regardless of the firms involved.</li>
        <li><strong className="text-foreground">Opinion is labeled.</strong> Commentary, op-eds, and perspective pieces carry a visible author byline and are distinguished from news coverage.</li>
      </ul>

      <PolicySection>Editorial Independence</PolicySection>
      <p className="text-muted-foreground">
        Editorial decisions are made by the Everything-PR editorial team. 5W does
        not review articles before publication, does not determine which
        companies receive coverage, and does not direct editorial conclusions.
        Where coverage involves 5W — or any company in which Everything-PR's
        owner holds a financial or advisory interest — the relationship is
        disclosed within the relevant article.
      </p>

      <PolicySection>Sources and Sourcing</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR coverage draws on direct reporting and interviews with
        industry practitioners; primary sources including SEC filings, government
        registries, court documents, and regulatory disclosures; industry
        research, with attribution; trade press, attributed to the originating
        publication; and press releases and corporate communications, identified
        as such.
      </p>
      <p className="text-muted-foreground">
        Where Everything-PR extends a source to a new conclusion, that extension
        is identified. Where figures are estimates rather than disclosed data,
        they are labeled as estimates.
      </p>

      <PolicySection>Corrections</PolicySection>
      <p className="text-muted-foreground">
        When Everything-PR publishes a factual error, the correction is made in
        the affected article and noted at the bottom; substantial corrections are
        also noted at the top. Corrections are not silent edits. To report a
        factual error, email{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>{" "}
        with the article URL and the specific issue. See our{" "}
        <a href="/corrections-policy" className="text-brand-blue underline font-semibold">
          Corrections Policy
        </a>
        .
      </p>

      <PolicySection>Sponsored Content and Advertising</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR does not publish sponsored content, native advertising, or
        pay-to-play articles disguised as editorial coverage. Any commercial
        placement on the Site is labeled "Sponsored," "Advertisement," or
        equivalent, in compliance with Federal Trade Commission guidelines.
        Directory listings, research sponsorships, and partnership placements
        are disclosed where they appear.
      </p>

      <PolicySection>Use of AI in Editorial Production</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR uses AI tools to assist with research, drafting,
        fact-checking, and production. Every article is reviewed, edited, and
        approved by a human editor or author before publication. AI is used as
        an editorial production tool — not as an editorial authority.
      </p>

      <PolicySection>Contributor Attribution</PolicySection>
      <p className="text-muted-foreground">
        Articles are attributed either to the Everything-PR Editorial Team — the
        staff byline for news, analysis, and features — or to a named author,
        for signed op-eds, research, and byline pieces. Named authors have
        biographical information on their author pages.
      </p>

      <PolicySection>Contact</PolicySection>
      <p className="text-muted-foreground">
        Editorial inquiries, tips, and corrections:{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
      </p>

      <GoverningLaw policyName="Editorial Policy" />
    </PolicyPage>
  ),
});
