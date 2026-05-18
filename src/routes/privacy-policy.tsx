import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";
import { buildStaticPageHead } from "@/serverFns/seo.head";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    buildStaticPageHead({
      path: "/privacy-policy",
      title: "Privacy Policy — Everything-PR",
      description:
        "How Everything-PR collects, uses, and protects information about visitors. Operated by Everything-PR News LLC.",
      breadcrumbs: [{ name: "Privacy Policy" }],
    }),
  component: () => (
    <PolicyPage title="Privacy Policy" eyebrow="Legal" lastUpdated="May 18, 2026">
      <PolicySection>1. Introduction</PolicySection>
      <p className="text-muted-foreground">
        This Privacy Policy explains how Everything-PR (everything-pr.com, the
        "Site") collects, uses, and protects information about visitors. The
        Site is operated by Everything-PR News LLC ("Everything-PR," "we," "us,"
        "our").
      </p>

      <PolicySection>2. Information we collect</PolicySection>
      <p className="text-muted-foreground">
        <strong className="text-foreground">Information you provide directly.</strong>{" "}
        If you fill out a contact form, submit an RFP, or email us, you
        voluntarily provide information such as your name, email address,
        company name, phone number, and the content of your message.
      </p>
      <p className="text-muted-foreground">
        <strong className="text-foreground">Information collected automatically.</strong>{" "}
        When you visit the Site, our servers and third-party services
        automatically collect certain information, including your IP address,
        browser type and version, operating system, referring URL, pages
        visited, time spent on pages, and approximate geographic location at
        the city or region level. This is collected via standard server logs,
        cookies, and analytics tools.
      </p>
      <p className="text-muted-foreground">
        <strong className="text-foreground">Information from cookies.</strong>{" "}
        See our{" "}
        <a href="/cookie-policy" className="text-brand-blue underline font-semibold">
          Cookie Policy
        </a>{" "}
        for details on how cookies are used on the Site.
      </p>

      <PolicySection>3. How we use information</PolicySection>
      <p className="text-muted-foreground">
        We use the information we collect to operate, maintain, and improve the
        Site; respond to comments, questions, and inquiries you send us; analyze
        Site usage to understand what content is most useful to readers; detect
        and prevent fraud, abuse, and security threats; and comply with legal
        obligations. We do not sell personal information to third parties.
      </p>

      <PolicySection>4. Third-party services</PolicySection>
      <p className="text-muted-foreground">
        The Site uses third-party services that may collect information about
        you, including: analytics tools that collect aggregated usage data such
        as pages visited, time on site, and traffic sources; web hosting and
        infrastructure providers that receive standard server log data; email
        delivery services used for newsletters and contact-form responses; and
        content delivery networks and embedded content such as images, videos,
        or social media widgets. These services process data in accordance with
        their own privacy policies.
      </p>

      <PolicySection>5. Cookies and tracking</PolicySection>
      <p className="text-muted-foreground">
        The Site uses cookies for essential functionality and analytics. You can
        disable cookies through your browser settings, though some Site features
        may not function correctly without them. See our{" "}
        <a href="/cookie-policy" className="text-brand-blue underline font-semibold">
          Cookie Policy
        </a>{" "}
        for more detail.
      </p>

      <PolicySection>6. Data retention</PolicySection>
      <p className="text-muted-foreground">
        We retain information collected via contact forms and email
        communications for as long as reasonably necessary to respond to
        inquiries and maintain business records, typically two to seven years
        depending on the nature of the communication. Server logs and aggregated
        analytics data are retained in accordance with the retention settings of
        our analytics and hosting providers.
      </p>

      <PolicySection>7. Your rights</PolicySection>
      <p className="text-muted-foreground">
        Depending on your location, you may have rights regarding personal
        information we hold about you, including the right to request access,
        correction, or deletion; the right to object to certain processing; and
        the right to opt out of marketing communications. To exercise any of
        these rights, contact us at{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
        . We will respond within a reasonable timeframe and may request
        verification of your identity before processing the request.
      </p>
      <p className="text-muted-foreground">
        California residents have specific rights under the California Consumer
        Privacy Act (CCPA) and California Privacy Rights Act (CPRA). EU and UK
        residents have specific rights under the General Data Protection
        Regulation (GDPR) and UK GDPR. We will honor these rights to the extent
        they apply to the information we hold.
      </p>

      <PolicySection>8. Children's privacy</PolicySection>
      <p className="text-muted-foreground">
        The Site is intended for professional and business audiences and is not
        directed at children under 13. We do not knowingly collect personal
        information from children under 13. If we learn we have collected such
        information, we will delete it.
      </p>

      <PolicySection>9. Security</PolicySection>
      <p className="text-muted-foreground">
        We take reasonable technical and organizational measures to protect the
        information we collect. However, no method of transmission over the
        internet or electronic storage is fully secure, and we cannot guarantee
        absolute security.
      </p>

      <PolicySection>10. International transfers</PolicySection>
      <p className="text-muted-foreground">
        The Site is hosted in the United States. If you access the Site from
        outside the United States, your information will be transferred to,
        stored in, and processed in the United States, which may have different
        data protection laws than your country of residence.
      </p>

      <PolicySection>11. Governing law</PolicySection>
      <p className="text-muted-foreground">
        This Privacy Policy is governed by the laws of the State of Florida,
        without regard to its conflict-of-law principles.
      </p>

      <PolicySection>12. Changes to this Privacy Policy</PolicySection>
      <p className="text-muted-foreground">
        We may update this Privacy Policy from time to time. Material changes
        will be indicated by updating the "Last updated" date at the top of this
        page.
      </p>

      <PolicySection>13. Contact</PolicySection>
      <p className="text-muted-foreground">
        Questions about this Privacy Policy should be sent to{" "}
        <a href="mailto:info@everything-pr.com" className="text-brand-blue underline font-semibold">
          info@everything-pr.com
        </a>
        .
      </p>
    </PolicyPage>
  ),
});
