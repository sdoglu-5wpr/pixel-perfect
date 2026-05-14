// Shared filter for "is this a real, displayable hero image?".
// Used on every public-facing card grid/list to skip rows that would otherwise
// fall back to PostImage's neutral block. The neutral block is kept as a true
// last-resort default (e.g. an article's own page header), but cards in grids
// should be HIDDEN rather than render as filler.

export type WithHero = { featured_image_url?: string | null };

export function hasHero<T extends WithHero>(p: T | null | undefined): p is T {
  return Boolean(p && p.featured_image_url);
}

export function withHero<T extends WithHero>(items: readonly T[] | null | undefined): T[] {
  return (items ?? []).filter(hasHero);
}
