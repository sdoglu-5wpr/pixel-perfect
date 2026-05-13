// Netlify Edge Function: canonicalize URLs at the edge.
//
// Runs BEFORE static asset serving and SSR. Strips tracking / AMP query
// params and issues a single 301 to an ABSOLUTE clean URL so Netlify can't
// re-attach the original query string (which was causing infinite loops
// with `[[redirects]]` query rules).

import type { Context } from "https://edge.netlify.com";

const APEX_HOST = "everything-pr.com";

const STRIP_QUERY_PARAMS = new Set([
  "noamp", "amp",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
  "gclid", "gclsrc", "dclid", "fbclid", "msclkid", "yclid",
  "_ga", "mc_cid", "mc_eid", "ck_subscriber_id",
  "ref", "referrer", "trk", "trkInfo",
  "__hstc", "__hssc", "hsCtaTracking",
  "si", "feature", "share",
]);

const WP_BLOCK = [
  /^\/wp-admin(\/|$)/i,
  /^\/wp-login\.php/i,
  /^\/xmlrpc\.php/i,
  /^\/wp-json(\/|$)/i,
  /^\/wp-content\/plugins(\/|$)/i,
  /^\/wp-content\/themes(\/|$)/i,
];

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  let changed = false;

  // www. -> apex
  if (url.hostname.toLowerCase() === `www.${APEX_HOST}`) {
    url.hostname = APEX_HOST;
    changed = true;
  }

  // Block legacy WP admin paths
  for (const rx of WP_BLOCK) {
    if (rx.test(url.pathname)) {
      return new Response("Gone", {
        status: 410,
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }
  }

  // Lowercase pathname
  if (!url.pathname.startsWith("/_serverFn") && /[A-Z]/.test(url.pathname)) {
    url.pathname = url.pathname.toLowerCase();
    changed = true;
  }

  // Collapse double slashes
  if (/\/{2,}/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/{2,}/g, "/");
    changed = true;
  }

  // Strip BOM / zero-width / invisible characters from the path. Legacy
  // WordPress imports left BOM (U+FEFF) and zero-width chars in slugs;
  // Google has thousands of those URLs queued and they redirect to broken
  // percent-encoded variants. Drop them with a 301 to the clean slug.
  if (/[\u200b-\u200f\u2028-\u202f\u2060\ufeff]/.test(url.pathname) ||
      /%e2%80[89ab][0-9a-f]/i.test(url.pathname) ||
      /%ef%bb%bf/i.test(url.pathname)) {
    url.pathname = url.pathname
      .replace(/[\u200b-\u200f\u2028-\u202f\u2060\ufeff]/g, "")
      .replace(/%e2%80[89ab][0-9a-f]/gi, "")
      .replace(/%ef%bb%bf/gi, "");
    changed = true;
  }

  // Trailing-slash canonicalization. The site's canonical form is WITHOUT a
  // trailing slash, EXCEPT for the root and /author/{slug}/ archives which
  // canonicalize WITH a trailing slash (matches their <link rel=canonical>).
  // Netlify's default behavior is a 307 strip — we override with a 301 so
  // Google consolidates signals on the canonical form.
  if (
    url.pathname.length > 1 &&
    url.pathname.endsWith("/") &&
    !/^\/author\/[^/]+\/$/.test(url.pathname)
  ) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    changed = true;
  }

  // Strip tracking / AMP query params
  if (url.search) {
    const toDelete: string[] = [];
    for (const k of url.searchParams.keys()) {
      if (STRIP_QUERY_PARAMS.has(k.toLowerCase())) toDelete.push(k);
    }
    if (toDelete.length > 0) {
      for (const k of toDelete) url.searchParams.delete(k);
      changed = true;
    }
  }

  if (changed) {
    // Absolute URL prevents Netlify from re-attaching the original query string.
    const absolute = `${url.protocol}//${url.hostname}${url.pathname}${url.search}${url.hash}`;
    return new Response(null, {
      status: 301,
      headers: {
        Location: absolute,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  // No change — let the request continue to the next handler.
  return;
};

export const config = {
  path: "/*",
  // Skip assets and internal endpoints to avoid unnecessary edge invocations.
  excludedPath: [
    "/assets/*",
    "/wp-content/uploads/*",
    "/_serverFn/*",
    "/.netlify/*",
    "/*.js",
    "/*.css",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.webp",
    "/*.avif",
    "/*.svg",
    "/*.ico",
    "/*.woff",
    "/*.woff2",
    "/*.map",
  ],
};
