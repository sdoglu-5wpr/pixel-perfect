import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/terms-of-use")({
  head: () =>
    buildStaticPageHead({
      path: "/terms-of-use",
      title: "Terms of Use — Everything-PR",
      description:
        "The terms governing your access to and use of the Everything-PR website, operated by Everything-PR News LLC.",
      breadcrumbs: [{ name: "Terms of Use" }],
    }),
  component: () => (
    <PolicyPage title="Terms of Use" eyebrow="Legal" lastUpdated="May 18, 2026">
      <PolicySection>1. Acceptance of terms</PolicySection>
      <p className="text-muted-foreground">
        Welcome to Everything-PR (everything-pr.com). These Terms of Use
        ("Terms") govern your access to and use of the Everything-PR website and
        any content, features, or services offered through it (collectively, the
        "Site"). By accessing or using the Site, you agree to these Terms. If
        you do not agree, please do not use the Site.
      </p>

      <PolicySection>2. About the Site</PolicySection>
      <p className="text-muted-foreground">
        Everything-PR is an independent publication covering the public
        relations, marketing, and communications industries. The Site is
        operated by Everything-PR News LLC ("Everything-PR," "we," "us," or
        "our").
      </p>

      <PolicySection>3. Intellectual property</PolicySection>
      <p className="text-muted-foreground">
        All content published on Everything-PR — including articles, research
        studies, graphics, logos, and design elements — is owned by
        Everything-PR News LLC or its licensors and is protected by United
        States and international copyright, trademark, and other intellectual
        property laws. You may view and share content for personal,
        non-commercial purposes with proper attribution and a link back to the
        original source. Republication, bulk copying, or commercial use of Site
        content requires prior written permission from Everything-PR News LLC.
      </p>
      <p className="text-muted-foreground">
        Research studies published on Everything-PR may be republished with
        attribution to the original author and Everything-PR, and a link back to
        the Everything-PR source page, unless otherwise noted on the specific
        study.
      </p>

      <PolicySection>4. Acceptable use</PolicySection>
      <p className="text-muted-foreground">When using the Site, you agree not to:</p>
      <ul className="space-y-2 text-muted-foreground list-disc pl-5">
        <li>Use automated tools (scrapers, bots, crawlers) to harvest Site content at scale beyond what is permitted by the Site's robots.txt file</li>
        <li>Attempt to gain unauthorized access to any portion of the Site, including non-public areas, server infrastructure, or user accounts</li>
        <li>Post, submit, or transmit content that is unlawful, defamatory, harassing, fraudulent, or that infringes anyone's intellectual property rights</li>
        <li>Interfere with the Site's operation, introduce malware, or conduct denial-of-service activity</li>
        <li>Misrepresent your identity when submitting contact forms, comments, or other communications</li>
        <li>Use the Site to send spam, unsolicited marketing, or bulk communications</li>
      </ul>

      <PolicySection>5. Third-party links and content</PolicySection>
      <p className="text-muted-foreground">
        The Site links to and references third-party websites, including
        websites operated by PR agencies, news organizations, and research
        sources. We provide these links for convenience and do not endorse,
        control, or take responsibility for third-party content or practices.
        Your use of any linked site is subject to that site's own terms and
        policies.
      </p>

      <PolicySection>6. RFPs, forms, and submissions</PolicySection>
      <p className="text-muted-foreground">
        The Site publishes requests for proposals (RFPs) and other third-party
        business opportunities for informational purposes. We do not verify,
        endorse, or guarantee any RFP or opportunity listed. Submission of any
        form on the Site does not create a business relationship, agency-client
        relationship, or contractual obligation.
      </p>

      <PolicySection>7. Disclaimer of warranties</PolicySection>
      <p className="text-muted-foreground">
        The Site is provided on an "as is" and "as available" basis. We make no
        warranties, express or implied, regarding the accuracy, completeness,
        timeliness, or reliability of any content on the Site. Industry research
        and analysis published on the Site reflects estimates based on publicly
        available data and the judgment of the authors; figures are estimates
        and should not be relied upon as definitive without independent
        verification.
      </p>

      <PolicySection>8. Limitation of liability</PolicySection>
      <p className="text-muted-foreground">
        To the maximum extent permitted by law, Everything-PR News LLC and its
        respective affiliates, officers, employees, and agents shall not be
        liable for any indirect, incidental, consequential, special, or punitive
        damages arising from your use of or inability to use the Site, including
        but not limited to loss of profits, loss of data, or business
        interruption, even if advised of the possibility of such damages.
      </p>

      <PolicySection>9. Indemnification</PolicySection>
      <p className="text-muted-foreground">
        You agree to indemnify and hold harmless Everything-PR News LLC and its
        affiliates from any claims, damages, or expenses (including reasonable
        attorneys' fees) arising from your violation of these Terms or your
        misuse of the Site.
      </p>

      <PolicySection>10. Changes to these Terms</PolicySection>
      <p className="text-muted-foreground">
        We may update these Terms from time to time. Material changes will be
        indicated by updating the "Last updated" date at the top of this page.
        Continued use of the Site after changes are posted constitutes your
        acceptance of the revised Terms.
      </p>

      <PolicySection>11. Governing law</PolicySection>
      <p className="text-muted-foreground">
        These Terms are governed by the laws of the State of Florida, without
        regard to its conflict-of-law principles. Any disputes arising from
        these Terms or your use of the Site shall be resolved in the state or
        federal courts located in Florida.
      </p>

      <PolicySection>12. Contact</PolicySection>
      <p className="text-muted-foreground">
        Questions about these Terms should be sent to{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
        .
      </p>
    </PolicyPage>
  ),
});
