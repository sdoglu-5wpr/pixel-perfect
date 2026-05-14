type Editor = {
  id: string;
  name: string;
  role: string;
  bio: React.ReactNode;
  expertise: string;
  links?: string;
};

const EDITORS: Editor[] = [
  {
    id: "ronn-torossian",
    name: "Ronn Torossian",
    role: "Publisher & Editor-in-Chief",
    bio: (
      <>
        Ronn Torossian is the Publisher of Everything-PR and the Founder and Chairman of 5W, one of the largest independently owned public relations and digital marketing firms in the United States. He founded 5W in 2003, is the author of <em>For Immediate Release: Shape Minds, Build Brands, and Deliver Results With Game-Changing Public Relations</em>, and is active in multiple ventures with successful exits.
      </>
    ),
    expertise:
      "AI communications, crisis management, brand strategy, financial services PR, public affairs, and the intersection of earned media with AI retrieval.",
    links: "5wpr.com | ronntorossian.com | LinkedIn",
  },
  {
    id: "seth-semilof",
    name: "Seth Semilof",
    role: "Contributing Editor",
    bio: (
      <>
        Seth Semilof is Co-Founder and COO of Haute Media Group, the Miami-based luxury media network behind Haute Living, Haute Residence, Haute Time, Haute Jets, Haute Beauty, and Haute Wealth — reaching ultra-high-net-worth audiences across luxury real estate, private aviation, watches, beauty, travel, and wealth.
      </>
    ),
    expertise:
      "Luxury marketing, UHNW audience strategy, AI visibility for luxury brands, luxury real estate, private aviation, watches, beauty, wealth migration.",
  },
  {
    id: "michael-heller",
    name: "Michael Heller",
    role: "Contributing Editor",
    bio: (
      <>
        Michael Heller is the CEO of Talent Resources, bridging celebrity, influencer, and creator marketing for global brands across two decades of activations and partnerships.
      </>
    ),
    expertise:
      "Influencer and creator marketing, celebrity and athlete partnerships, sports marketing, NIL, brand activations, AI visibility for personality-led brands.",
  },
  {
    id: "kevin-mercuri",
    name: "Kevin Mercuri",
    role: "Contributing Editor",
    bio: (
      <>
        Kevin Mercuri is the Founder and CEO of Propheta Communications, a PR and fractional CMO agency built around startup and early-stage company growth. Three-plus decades across PR, corporate communications, and public affairs. Executive-in-Residence at Emerson College.
      </>
    ),
    expertise:
      "B2B tech PR, startup communications, crisis response, category creation, public affairs, regulated industries.",
  },
  {
    id: "kyle-porter",
    name: "Kyle Porter",
    role: "Contributing Editor",
    bio: (
      <>
        Kyle Porter is Executive Vice President and Managing Director of Virgo PR, an integrated communications firm specializing in rapid-growth industries. More than a decade managing agencies across emerging markets, with experience on 15+ IPO/RTOs and clients spanning Web3, biotech, fintech, and cannabis.
      </>
    ),
    expertise:
      "Emerging markets PR, financial communications, Web3 and blockchain, B2B tech, biotech, cannabis.",
  },
];

export function AboutTeamPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          The Team
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          Everything-PR is published by a named editorial team with disclosed credentials, real expertise, and direct experience in the industries we cover.
        </p>

        <hr className="my-12 border-black/10" />

        <div className="space-y-12">
          {EDITORS.map((e) => (
            <section key={e.id} id={e.id} className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                {e.name} — {e.role}
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">{e.bio}</p>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
                <strong>Areas of expertise:</strong> {e.expertise}
              </p>
              {e.links ? (
                <p className="mt-2 text-sm text-muted-foreground">{e.links}</p>
              ) : null}
            </section>
          ))}

          <section className="border-t border-black/10 pt-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              Contributing Editors — We're Recruiting
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
              Everything-PR is actively recruiting contributing editors. We are looking for senior practitioners who can write with editorial independence about the categories they know best — and whose names, credentials, and platforms strengthen the credibility of the publication.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground">
              <strong>Interested?</strong> Reach out to{" "}
              <a href="mailto:editor@everything-pr.com" className="text-brand-blue hover:underline">
                editor@everything-pr.com
              </a>{" "}
              with a brief on your background, your category, and 2–3 sample pieces of writing.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
