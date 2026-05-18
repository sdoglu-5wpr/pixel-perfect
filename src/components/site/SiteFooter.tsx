import { Link } from "@tanstack/react-router";

export type FooterMenuItem = { label: string; href: string };

const EXPLORE: FooterMenuItem[] = [
  { label: "News", href: "/pr-news" },
  { label: "Research", href: "/research" },
  { label: "AI & GEO", href: "/generative-engine-optimization" },
  { label: "PR Firms", href: "/pr-firms" },
  { label: "RFPs", href: "/rfp" },
  { label: "Glossary", href: "/glossary" },
];

const PUBLICATION: FooterMenuItem[] = [
  { label: "About", href: "/about" },
  { label: "Contributors", href: "/authors" },
  { label: "Contact", href: "/contact" },
  { label: "Newsletter", href: "/#newsletter" },
];

const STANDARDS: FooterMenuItem[] = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Ethics Policy", href: "/ethics-policy" },
  { label: "Corrections Policy", href: "/corrections-policy" },
];

const EPR_BOILERPLATE =
  "Everything-PR covers communications, reputation, AI visibility, public affairs, media systems, and digital discovery in the answer-engine era. Publishing since 2009. Thirty verticals. Original reporting, research, and analysis. Every page reported, sourced, and built to be cited.";

export function SiteFooter(_props?: { menu?: FooterMenuItem[] }) {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="h-1 bg-ticker" />

      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" aria-label="Everything-PR home">
            <img
              src="/everything-pr-logo.png"
              alt="Everything-PR"
              className="h-12 w-auto bg-white rounded-md px-3 py-2 mb-4"
            />
          </Link>
          <p className="text-sm text-ink-foreground/70 leading-relaxed">
            {EPR_BOILERPLATE}
          </p>
        </div>

        <FooterCol title="Explore" links={EXPLORE} />
        <FooterCol title="Publication" links={PUBLICATION} />
        <FooterCol title="Standards" links={STANDARDS} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-foreground/60">
          <span>© {new Date().getFullYear()} Everything-PR News LLC. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-end">
            <a href="/terms-of-use" className="hover:text-ink-foreground">Terms of Use</a>
            <a href="/privacy-policy" className="hover:text-ink-foreground">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-ink-foreground">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: FooterMenuItem[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-ink-foreground/60">
        {title}
      </h4>
      <ul className="text-sm space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-ink-foreground/80 hover:text-ink-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
