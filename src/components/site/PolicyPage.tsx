import { SiteLayout } from "./SiteLayout";

type PolicyPageProps = {
  title: string;
  eyebrow?: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

/**
 * Standing reference page layout for legal / standards / policy pages.
 * No author byline, no reading-time, no top stories, no share buttons.
 */
export function PolicyPage({ title, eyebrow, lastUpdated, children }: PolicyPageProps) {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-foreground to-foreground/95 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-5">
              <span className="w-8 h-px bg-white/40" /> {eyebrow}
            </div>
          ) : null}
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-4 text-sm text-white/60">Last updated: {lastUpdated}</p>
          ) : null}
        </div>
      </section>

      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <div className="policy-prose text-foreground space-y-5 text-[16.5px] leading-relaxed">
            {children}
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}

/** Section heading styled consistently across policy pages. */
export function PolicySection({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-2xl md:text-3xl font-bold mt-10 first:mt-0 text-foreground"
    >
      {children}
    </h2>
  );
}

/** Last line on every policy page. */
export function GoverningLaw({ policyName }: { policyName: string }) {
  return (
    <>
      <PolicySection>Governing Law</PolicySection>
      <p className="text-muted-foreground">
        This {policyName} is governed by the laws of the State of Florida, without
        regard to its conflict-of-law principles.
      </p>
    </>
  );
}
