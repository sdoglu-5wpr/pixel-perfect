// Decode common HTML entities and strip tags. Used to display excerpts as plain text.
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", copy: "©", reg: "®",
  trade: "™", deg: "°", middot: "·", bull: "•", euro: "€", pound: "£",
};

export function decodeHtmlEntities(s: string): string {
  if (!s) return "";
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      try { return String.fromCodePoint(parseInt(h, 16)); } catch { return _; }
    })
    .replace(/&#(\d+);/g, (_, n) => {
      try { return String.fromCodePoint(parseInt(n, 10)); } catch { return _; }
    })
    .replace(/&([a-z]+);/gi, (m, name) => NAMED[name.toLowerCase()] ?? m);
}

/** Convert HTML to readable plain text (for excerpts, meta descriptions). */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  const noTags = html
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "");
  return decodeHtmlEntities(noTags).replace(/\s+/g, " ").trim();
}
