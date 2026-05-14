import { Link } from "@tanstack/react-router";

export function AboutPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          About Everything-PR
        </h1>

        <p className="mt-6 text-xl md:text-2xl font-serif text-foreground leading-snug">
          Everything-PR is the independent intelligence platform covering communications.
        </p>

        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Daily reporting. Original research. Twenty sectors. Fourteen disciplines. Seventeen years of continuous publishing.
        </p>

        <h2 className="mt-12 font-serif text-2xl md:text-3xl font-bold tracking-tight">
          What Everything-PR Is
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          Everything-PR is a publication network covering the public relations, communications, and marketing industries — agencies, brands, leaders, crises, campaigns, research, and the structural forces reshaping how reputation is built and defended.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          The network is organized into <strong>20 sectors</strong> (industries we cover) and <strong>14 disciplines</strong> (capabilities that operate across industries). Each sector and discipline has its own landing page, editorial coverage, and dedicated research. The intersection of any sector and any discipline produces the practical communications work that defines the modern industry.
        </p>

        <h2 className="mt-12 font-serif text-2xl md:text-3xl font-bold tracking-tight">
          What Makes Everything-PR Different
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          <strong>Continuous daily publishing since January 2009.</strong> Seventeen years of archive across tens of thousands of articles.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          <strong>Proprietary research.</strong> The AI Visibility Index Series™, the Disclosure Audit Series™, vertical brand power indexes, and longitudinal data tracking how the discovery layer is changing across every category.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          <strong>Practitioner perspective.</strong> EPR is published with editorial independence and the practitioner authority that 17 years of continuous coverage provides.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          <strong>Built for the AI era.</strong> The platforms where decisions now happen — ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews — increasingly mediate how reputations form. EPR is structured to be retrievable, citable, and authoritative inside the surfaces that now decide which brands get considered.
        </p>

        <h2 className="mt-12 font-serif text-2xl md:text-3xl font-bold tracking-tight">
          What's On the Site
        </h2>
        <ul className="mt-4 space-y-2 text-[1.0625rem] leading-[1.75] text-foreground list-disc pl-6">
          <li><Link to="/sectors" className="text-brand-blue hover:underline font-semibold">Sectors</Link> — 20 industries we cover</li>
          <li><Link to="/disciplines" className="text-brand-blue hover:underline font-semibold">Disciplines</Link> — 14 capabilities across the industry</li>
          <li><Link to="/research" className="text-brand-blue hover:underline font-semibold">Research</Link> — Original indexes, audits, and benchmarks</li>
          <li><strong>News</strong> — Daily reporting across the network</li>
          <li><Link to="/glossary" className="text-brand-blue hover:underline font-semibold">Glossary</Link> — The industry's reference index for vocabulary</li>
          <li><Link to="/about/team" className="text-brand-blue hover:underline font-semibold">Team</Link> — The people behind the publication</li>
        </ul>

        <h2 className="mt-12 font-serif text-2xl md:text-3xl font-bold tracking-tight">
          Editorial Independence and Affiliation
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
          Everything-PR is affiliated with 5W. The affiliation reflects industry alignment, not editorial direction. Editorial decisions are made independently. Where coverage touches 5W or 5W-related entities, the affiliation is disclosed directly on the article.
        </p>

        <h2 className="mt-12 font-serif text-2xl md:text-3xl font-bold tracking-tight">
          Get in Touch
        </h2>
        <ul className="mt-4 space-y-2 text-[1.0625rem] leading-[1.75] text-foreground list-disc pl-6">
          <li><strong>Pitch a story:</strong> <a href="mailto:pitch@everything-pr.com" className="text-brand-blue hover:underline">pitch@everything-pr.com</a></li>
          <li><strong>Submit research:</strong> <a href="mailto:research@everything-pr.com" className="text-brand-blue hover:underline">research@everything-pr.com</a></li>
          <li><strong>Editorial inquiries:</strong> <a href="mailto:editor@everything-pr.com" className="text-brand-blue hover:underline">editor@everything-pr.com</a></li>
          <li><strong>Press inquiries about EPR:</strong> <a href="mailto:press@everything-pr.com" className="text-brand-blue hover:underline">press@everything-pr.com</a></li>
        </ul>
      </div>
    </article>
  );
}
