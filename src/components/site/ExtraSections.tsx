import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { PostImage } from "./PostImage";
import { decodeHtmlEntities } from "@/lib/text";
import { formatDate } from "@/lib/date";
import type { ExtraPost } from "@/lib/extra-sections";

export function TrendingSidebar({
  posts,
  className = "",
}: {
  posts: ExtraPost[];
  className?: string;
}) {
  if (!posts.length) return null;
  return (
    <div className={`rounded-lg border bg-white p-5 shadow-sm ${className}`}>
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red mb-4 flex items-center gap-2">
        <Flame className="w-3.5 h-3.5" /> Trending
      </div>
      <ol className="space-y-4">
        {posts.map((p, i) => (
          <li key={p.id} className="flex gap-3 items-start">
            <span className="font-serif font-bold text-2xl leading-none text-brand-red/70 w-6 shrink-0">
              {i + 1}
            </span>
            <Link
              to="/$slug"
              params={{ slug: p.slug }}
              className="group flex-1 min-w-0"
            >
              <h4 className="font-semibold text-sm leading-snug line-clamp-3 group-hover:text-brand-red">
                {decodeHtmlEntities(p.title)}
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {formatDate(p.published_at)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        to="/$slug"
        params={{ slug: "trending" }}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
      >
        See all trending <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

export function CategorySectionRow({
  title,
  categorySlug,
  categoryName,
  posts,
}: {
  title: string;
  categorySlug: string;
  categoryName?: string;
  posts: ExtraPost[];
}) {
  const visible = posts.filter((p) => Boolean(p.featured_image_url));
  if (!visible.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 mt-14">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="font-serif font-bold text-2xl flex items-center gap-3">
            <span className="inline-block w-3 h-3 bg-brand-red" aria-hidden />
            {title}
          </h2>
          {categoryName ? (
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              From {categoryName}
            </p>
          ) : null}
        </div>
        <Link
          to="/$slug"
          params={{ slug: categorySlug }}
          className="text-sm font-medium inline-flex items-center gap-1 hover:text-brand-red"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {visible.map((p) => (
          <article key={p.id} className="group block">
            <Link to="/$slug" params={{ slug: p.slug }} className="block">
              <PostImage
                src={p.featured_image_url}
                alt={decodeHtmlEntities(p.title)}
                className="aspect-[16/10] w-full overflow-hidden rounded-md bg-muted"
                imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </Link>
            {p.category ? (
              <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-brand-red">
                {p.category.name}
              </p>
            ) : null}
            <h3 className="mt-1 font-serif font-bold text-lg leading-snug line-clamp-3">
              <Link
                to="/$slug"
                params={{ slug: p.slug }}
                className="hover:text-brand-red"
              >
                {decodeHtmlEntities(p.title)}
              </Link>
            </h3>
            <p className="mt-2 text-xs flex items-center gap-1.5 text-muted-foreground">
              {p.author?.slug ? (
                <Link
                  to="/author/$slug"
                  params={{ slug: p.author.slug }}
                  className="font-medium text-foreground hover:text-brand-blue"
                >
                  {p.author.display_name}
                </Link>
              ) : (
                <span className="text-foreground">Editorial Team</span>
              )}
              <span aria-hidden>·</span>
              <span>{formatDate(p.published_at)}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
