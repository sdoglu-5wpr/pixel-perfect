#!/usr/bin/env bun
/**
 * Build internal-links JSONL from a posts JSONL export.
 *
 * Usage:
 *   bun run scripts/build-internal-links-jsonl.ts \
 *     --posts ./data/posts.jsonl \
 *     --out ./data/internal-links.jsonl \
 *     --max-siblings 4
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  EPR_HUB_PATHS,
  EPR_SECTOR_CATEGORY_SLUGS,
  EPR_DISCIPLINE_CATEGORY_SLUGS,
  type InternalLinkJsonlRow,
} from "../src/lib/internal-linking.shared";

type PostRow = {
  slug: string;
  title?: string;
  categories?: Array<string | { slug: string; name?: string }>;
};

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}

function categorySlugs(p: PostRow): string[] {
  if (!Array.isArray(p.categories)) return [];
  return p.categories
    .map((c) => (typeof c === "string" ? c : c?.slug))
    .filter((s): s is string => !!s);
}

function hubFor(catSlug: string): string | null {
  if (EPR_SECTOR_CATEGORY_SLUGS.includes(catSlug)) return `/${catSlug}`;
  if (EPR_DISCIPLINE_CATEGORY_SLUGS.includes(catSlug)) return `/${catSlug}`;
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const postsPath = args.posts || "./data/posts.jsonl";
  const outPath = args.out || "./data/internal-links.jsonl";
  const maxSiblings = Number(args["max-siblings"] || "4");

  const raw = readFileSync(postsPath, "utf8");
  const posts: PostRow[] = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as PostRow;
      } catch {
        return null;
      }
    })
    .filter((p): p is PostRow => !!p && !!p.slug);

  // Index by category for sibling lookup
  const byCat = new Map<string, PostRow[]>();
  for (const p of posts) {
    for (const c of categorySlugs(p)) {
      const arr = byCat.get(c) ?? [];
      arr.push(p);
      byCat.set(c, arr);
    }
  }

  const seen = new Set<string>();
  const rows: InternalLinkJsonlRow[] = [];

  let hubCount = 0;
  let siblingCount = 0;

  for (const p of posts) {
    const cats = categorySlugs(p);

    // Hub links: prefer category hubs that match, then global hubs (max 3 total)
    const hubs: string[] = [];
    for (const c of cats) {
      const h = hubFor(c);
      if (h && !hubs.includes(h)) hubs.push(h);
      if (hubs.length >= 2) break;
    }
    for (const h of EPR_HUB_PATHS) {
      if (hubs.length >= 3) break;
      if (!hubs.includes(h)) hubs.push(h);
    }
    for (const target of hubs) {
      const key = `${p.slug}|${target}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        source_slug: p.slug,
        target_url: target,
        anchor_text: target.replace(/^\//, "").replace(/-/g, " ") || "home",
        kind: "hub",
      });
      hubCount++;
    }

    // Sibling links: posts sharing the first category
    const primary = cats[0];
    if (primary) {
      const siblings = (byCat.get(primary) ?? []).filter((s) => s.slug !== p.slug).slice(0, maxSiblings);
      for (const s of siblings) {
        const target = `/${s.slug}`;
        const key = `${p.slug}|${target}`;
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({
          source_slug: p.slug,
          target_url: target,
          anchor_text: s.title || s.slug,
          kind: "sibling",
        });
        siblingCount++;
      }
    }
  }

  writeFileSync(outPath, rows.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  console.log(
    `Wrote ${rows.length} rows (${hubCount} hub, ${siblingCount} sibling) for ${posts.length} posts → ${outPath}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
