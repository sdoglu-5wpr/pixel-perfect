// Title Case for internal anchor text. Applied at render time.
// Rules:
// - lowercase stop words (unless first word)
// - keep acronyms / brand names (mixed case)
// - leave external links alone (caller responsibility)

const ACRONYMS = new Set([
  "AI","GEO","AEO","SEO","PR","B2B","CPG","FARA","NDA","MSA","DPA","SOW",
  "CEO","CMO","CIO","CTO","CFO","COO","SVP","EVP","VP","IPO","KPI","OKR",
  "ROI","ESG","OG","DOJ","FCC","SEC","FTC","NIST","EPA","DOE","DOD","IRS",
  "DHS","FBI","CIA","AML","KYC","PII","SOX","GAAP","IFRS","USD","EUR","GBP",
  "EU","US","UK","UN","IT","HR","QA","UX","UI","API","SDK","MCP","IDE",
  "CDN","DNS","IP","HTTP","HTTPS","URL","HTML","CSS","JS","SQL","ETL","ML",
  "NLP","LLM","AGI","AR","VR","XR","IOT","EV","NFT",
]);

// Mixed-case brand names — looked up case-insensitively, replaced with the canonical form.
const BRANDS: Record<string, string> = {};
[
  "SaaS","PropTech","FinTech","AdTech","MarTech","EdTech","LegalTech","GovTech",
  "ClimateTech","BioTech","HealthTech","NeuroTech","DeepTech","Web3","ChatGPT",
  "GPT-4","Claude","Perplexity","Gemini","Llama","Anthropic","OpenAI","DeepMind",
  "Google","Microsoft","Amazon","Meta","Apple","Tesla","SpaceX","NVIDIA","Intel",
  "AMD","IBM","Oracle","Salesforce","HubSpot","Snowflake","Databricks","BigQuery",
  "Postgres","MySQL","MongoDB","DeFi","DAO","M&A","IoT",
].forEach(b => { BRANDS[b.toLowerCase()] = b; });

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","nor","for","in","on","at","to","of","with",
  "by","vs","via","as","per","from","into","onto",
]);

function titleCaseWord(word: string, isFirst: boolean): string {
  if (!word) return word;
  // Preserve punctuation around the word
  const m = word.match(/^([^A-Za-z0-9]*)([A-Za-z0-9][A-Za-z0-9'’.\\-&]*)([^A-Za-z0-9]*)$/);
  if (!m) return word;
  const [, lead, core, trail] = m;

  const lower = core.toLowerCase();
  const upper = core.toUpperCase();

  if (BRANDS[lower]) return lead + BRANDS[lower] + trail;
  if (ACRONYMS.has(upper)) return lead + upper + trail;
  if (!isFirst && STOP_WORDS.has(lower)) return lead + lower + trail;

  // Default: capitalise first letter, lowercase rest
  const cased = core[0].toUpperCase() + core.slice(1).toLowerCase();
  return lead + cased + trail;
}

export function titleCaseAnchor(text: string): string {
  if (!text) return text;
  const words = text.split(/(\s+)/); // keep whitespace tokens
  let firstWordSeen = false;
  return words.map(tok => {
    if (/^\s+$/.test(tok)) return tok;
    const isFirst = !firstWordSeen;
    firstWordSeen = true;
    return titleCaseWord(tok, isFirst);
  }).join("");
}

// True if href points at this site (relative path or same-host absolute).
export function isInternalHref(href: string | null | undefined, host?: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  if (/^https?:\/\//i.test(href)) {
    try {
      const u = new URL(href);
      const h = (host || (typeof window !== "undefined" ? window.location.host : ""));
      if (!h) return false;
      return u.host.toLowerCase() === h.toLowerCase() || u.host.toLowerCase().endsWith("everything-pr.com");
    } catch { return false; }
  }
  return false;
}

const SKIP_ANCESTORS = new Set(["CODE","PRE","KBD"]);

/** Walk a root element and rewrite internal <a> anchor text to Title Case. */
export function normalizeInternalAnchors(root: HTMLElement | null): void {
  if (!root) return;
  const anchors = root.querySelectorAll("a[href]");
  anchors.forEach(a => {
    const href = a.getAttribute("href");
    if (!isInternalHref(href)) return;
    // skip if inside <code>/<pre>/<kbd>
    let p: HTMLElement | null = a.parentElement;
    while (p) {
      if (SKIP_ANCESTORS.has(p.tagName)) return;
      p = p.parentElement;
    }
    // Only operate on anchors with simple text content (no nested elements)
    if (a.children.length === 0) {
      const txt = a.textContent || "";
      const next = titleCaseAnchor(txt);
      if (next !== txt) a.textContent = next;
    } else {
      // For mixed-content anchors, transform direct text nodes only
      a.childNodes.forEach(n => {
        if (n.nodeType === 3 /* TEXT_NODE */) {
          const txt = n.nodeValue || "";
          const next = titleCaseAnchor(txt);
          if (next !== txt) n.nodeValue = next;
        }
      });
    }
  });
}
