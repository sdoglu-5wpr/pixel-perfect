import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "./SiteLayout";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostImage } from "./PostImage";
import { decodeHtmlEntities, htmlToPlainText } from "@/lib/text";
import { withHero } from "@/lib/has-hero";
import { formatDate } from "@/lib/date";
import type { PillarPlaceholderPayload } from "@/lib/pillars.shared";

export function PillarPlaceholderView({ data }: { data: PillarPlaceholderPayload }) {
  const { pillar } = data;
  const items = withHero(data.items);
  const intro =
    pillar.subtitle ||
    `Our ${pillar.title} coverage hub is launching soon. In the meantime, browse the related stories below.`;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A1628] text-white">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#101F36] to-[#1A2940]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF3366] mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[#FF3366]" />
            Coverage Hub · Launching Soon
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight max-w-3xl">
            {pillar.title}
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* RELATED ARTICLES (only when we have any) */}
      {items.length > 0 ? (
        <section className="bg-surface-soft border-t">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-ticker mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-ticker" /> Related coverage
                </div>
                <h2 className="font-serif text-3xl font-bold">
                  Recent articles in {pillar.title}
                </h2>
              </div>
              <div className="text-sm text-muted-foreground">
                {items.length} article{items.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <article
                  key={p.id}
                  className="group bg-white rounded-lg border overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <Link to="/$slug" params={{ slug: p.slug }} className="block">
                    <PostImage
                      src={p.featured_image_url}
                      alt={p.title}
                      className="aspect-[16/10] overflow-hidden bg-muted"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-lg font-bold leading-snug mb-2">
                      <Link
                        to="/$slug"
                        params={{ slug: p.slug }}
                        className="hover:text-brand-blue line-clamp-3"
                      >
                        {decodeHtmlEntities(p.title)}
                      </Link>
                    </h3>
                    {p.excerpt ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {htmlToPlainText(p.excerpt)}
                      </p>
                    ) : null}
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                      {p.author ? (
                        <Link
                          to="/author/$slug"
                          params={{ slug: p.author.slug }}
                          className="hover:text-foreground font-medium"
                        >
                          {p.author.display_name}
                        </Link>
                      ) : (
                        <span />
                      )}
                      <time dateTime={p.published_at ?? undefined}>
                        {formatDate(p.published_at)}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
              >
                Browse the homepage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-7xl px-6 py-14">
        <NewsletterBanner />
      </div>
    </SiteLayout>
  );
}
