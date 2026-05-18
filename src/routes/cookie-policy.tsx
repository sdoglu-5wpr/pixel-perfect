import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, GoverningLaw } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/cookie-policy",
      title: "Cookie Policy — Everything-PR",
      description:
        "How Everything-PR uses cookies and similar technologies. Read alongside our Privacy Policy.",
      breadcrumbs: [{ name: "Cookie Policy" }],
    }),
  component: () => (
    <PolicyPage title="Cookie Policy" eyebrow="Legal" lastUpdated="May 18, 2026">
      <p className="text-muted-foreground">
        This Cookie Policy explains how Everything-PR (everything-pr.com) uses
        cookies and similar technologies. The Site is operated by Everything-PR
        News LLC. This policy should be read alongside our{" "}
        <a href="/privacy-policy" className="text-brand-blue underline font-semibold">
          Privacy Policy
        </a>
        .
      </p>

      <PolicySection>1. What cookies are</PolicySection>
      <p className="text-muted-foreground">
        Cookies are small text files placed on your device when you visit a
        website. They are widely used to make sites work, to improve
        performance, and to provide information to site operators.
      </p>

      <PolicySection>2. How we use cookies</PolicySection>
      <p className="text-muted-foreground">Everything-PR uses two categories of cookies:</p>
      <ul className="space-y-3 text-muted-foreground list-disc pl-5">
        <li><strong className="text-foreground">Essential cookies</strong> — required for the Site to function, including page navigation, security, and basic preferences. The Site cannot operate properly without them.</li>
        <li><strong className="text-foreground">Analytics cookies</strong> — used to understand how visitors use the Site, such as which pages are viewed and how long visitors stay. This data is aggregated and helps us improve the Site.</li>
      </ul>
      <p className="text-muted-foreground">
        Everything-PR does not use cookies to sell personal information.
      </p>

      <PolicySection>3. Third-party cookies</PolicySection>
      <p className="text-muted-foreground">
        Some cookies are set by third-party services we use, including analytics
        providers and embedded content such as videos or social media widgets.
        These third parties set their own cookies and process data under their
        own privacy and cookie policies.
      </p>

      <PolicySection>4. Managing cookies</PolicySection>
      <p className="text-muted-foreground">
        You can control and delete cookies through your browser settings, and
        set your browser to refuse cookies or alert you when cookies are being
        sent. Disabling essential cookies may affect how the Site functions.
      </p>

      <PolicySection>5. Changes to this policy</PolicySection>
      <p className="text-muted-foreground">
        We may update this Cookie Policy from time to time. Material changes
        will be indicated by updating the "Last updated" date at the top of this
        page.
      </p>

      <PolicySection>6. Contact</PolicySection>
      <p className="text-muted-foreground">
        Questions about this Cookie Policy should be sent to{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
        .
      </p>

      <GoverningLaw policyName="Cookie Policy" />
    </PolicyPage>
  ),
});
