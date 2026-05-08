#!/usr/bin/env bun
/**
 * Map an SE Ranking keyword export CSV to Everything PR content buckets.
 *
 * Usage:
 *   bun run scripts/map-se-ranking-keywords.ts --in ./data/se-ranking.csv --out ./data/keyword-map.csv
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  EPR_DISCIPLINE_CATEGORY_SLUGS,
  EPR_HUB_PATHS,
  EPR_SECTOR_CATEGORY_SLUGS,
} from "../src/lib/internal-linking.shared";

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

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function csvField(v: string | number | undefined): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function priorityFor(volume: number): "high" | "medium" | "low" {
  if (volume >= 1000) return "high";
  if (volume >= 200) return "medium";
  return "low";
}

function bucketFor(keyword: string): { bucket: string; target: string; notes: string } {
  const k = keyword.toLowerCase();
  const tokens = k.split(/[^a-z0-9]+/).filter(Boolean);
  const hay = ` ${tokens.join(" ")} `;

  for (const slug of EPR_SECTOR_CATEGORY_SLUGS) {
    const term = slug.replace(/-/g, " ");
    if (hay.includes(` ${term} `) || hay.includes(slug)) {
      return { bucket: `sector:${slug}`, target: `/${slug}`, notes: "matched sector slug" };
    }
  }
  for (const slug of EPR_DISCIPLINE_CATEGORY_SLUGS) {
    const term = slug.replace(/-/g, " ");
    if (hay.includes(` ${term} `) || hay.includes(slug)) {
      return { bucket: `discipline:${slug}`, target: `/${slug}`, notes: "matched discipline slug" };
    }
  }
  if (/\b(ai|llm|chatgpt|gemini|geo|generative)\b/.test(k)) {
    return { bucket: "hub:geo", target: "/generative-engine-optimization", notes: "AI/GEO keyword" };
  }
  if (/\b(study|research|report|survey|stats|statistics)\b/.test(k)) {
    return { bucket: "hub:research", target: "/research", notes: "research keyword" };
  }
  if (/\b(agency|agencies|firm|firms|top)\b/.test(k)) {
    return { bucket: "hub:pr-firms", target: "/pr-firms", notes: "firm/agency keyword" };
  }
  if (/\brfp\b/.test(k)) {
    return { bucket: "hub:rfp", target: "/rfp", notes: "RFP keyword" };
  }
  return { bucket: "unassigned", target: EPR_HUB_PATHS[0], notes: "no match — review manually" };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inPath = args.in;
  const outPath = args.out || "./data/keyword-map.csv";
  if (!inPath) {
    console.error("Missing --in <se-ranking.csv>");
    process.exit(1);
  }

  const raw = readFileSync(inPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    console.error("Empty input");
    process.exit(1);
  }
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const kwIdx = header.findIndex((h) => /keyword|query|term/.test(h));
  const volIdx = header.findIndex((h) => /volume|searches|search\s*vol/.test(h));
  if (kwIdx < 0) {
    console.error("Could not detect 'keyword' column. Header:", header);
    process.exit(1);
  }

  const outRows: string[] = [
    ["keyword", "volume", "suggested_bucket", "priority", "target_url", "notes"]
      .map(csvField)
      .join(","),
  ];
  let mapped = 0;
  let unassigned = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const keyword = (cols[kwIdx] ?? "").trim();
    if (!keyword) continue;
    const volume = volIdx >= 0 ? Number((cols[volIdx] ?? "0").replace(/[^\d.]/g, "")) || 0 : 0;
    const { bucket, target, notes } = bucketFor(keyword);
    if (bucket === "unassigned") unassigned++;
    else mapped++;
    outRows.push(
      [keyword, volume, bucket, priorityFor(volume), target, notes].map(csvField).join(","),
    );
  }

  writeFileSync(outPath, outRows.join("\n") + "\n", "utf8");
  console.log(`Mapped ${mapped}, unassigned ${unassigned}, total ${mapped + unassigned} → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
