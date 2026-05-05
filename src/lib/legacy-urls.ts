/**
 * Rewrites legacy absolute WordPress URLs to relative paths so they hit the
 * app-level proxy (/wp-content/uploads/* → sareld.wpengine.com).
 *
 * Applied at RENDER time only — never mutate posts.content_html in the DB.
 * Used by: <ArticleBody>, RSS <content:encoded>, JSON-LD articleBody,
 * og:description excerpts, featured-image URL resolution.
 */
const LEGACY_HOSTS = [
  "https://everything-pr.com",
  "http://everything-pr.com",
  "https://www.everything-pr.com",
  "http://www.everything-pr.com",
];

const HOST_PATTERN = /(https?:\/\/(?:www\.)?everything-pr\.com)(\/wp-content\/)/gi;
const LEGACY_ATTR_PATTERN = /(src|href)=(['"])https:\/\/everything-pr\.com(\/wp-content\/[^'"]+)\2/gi;

/** Rewrite a single URL string. Leaves non-matching URLs untouched. */
export function rewriteLegacyUrl(url: string | null | undefined): string {
  if (!url) return "";
  for (const host of LEGACY_HOSTS) {
    if (url.startsWith(`${host}/wp-content/`)) {
      return url.slice(host.length);
    }
  }
  return url;
}

/** Rewrite all legacy /wp-content/ URLs inside an HTML blob (src, href, srcset). */
export function rewriteWpContentUrls(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(LEGACY_ATTR_PATTERN, "$1=$2$3$2").replace(HOST_PATTERN, "$2");
}

export function rewriteLegacyHtml(html: string | null | undefined): string {
  return rewriteWpContentUrls(html);
}

export function pickFirstImageSrc(html: string | null | undefined): string | null {
  if (!html) return null;
  const rewritten = rewriteWpContentUrls(html);
  const match = rewritten.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? rewriteLegacyUrl(match[1]) : null;
}

/**
 * Strip the first <img> (and a wrapping <figure>/<p> if it contains only that img)
 * from an HTML blob. Used to avoid duplicating the article's featured image
 * when it was derived from the first inline image.
 */
export function stripFirstImage(html: string | null | undefined): string {
  if (!html) return "";
  // Try to strip a <figure>...<img>...</figure> wrapper first
  const figureRe = /<figure\b[^>]*>\s*(?:<a\b[^>]*>\s*)?<img\b[^>]*>(?:\s*<\/a>)?\s*(?:<figcaption\b[^>]*>[\s\S]*?<\/figcaption>\s*)?<\/figure>/i;
  if (figureRe.test(html)) return html.replace(figureRe, "");
  // <p> wrapping just an image
  const pRe = /<p\b[^>]*>\s*(?:<a\b[^>]*>\s*)?<img\b[^>]*>(?:\s*<\/a>)?\s*<\/p>/i;
  if (pRe.test(html)) return html.replace(pRe, "");
  // Bare <img>
  return html.replace(/<img\b[^>]*\/?>/i, "");
}

export function resolvePostImageUrl(...candidates: Array<string | null | undefined>): string | null {
  for (const candidate of candidates) {
    const rewritten = rewriteLegacyUrl(candidate ?? "");
    if (rewritten) return rewritten;
  }
  return null;
}
