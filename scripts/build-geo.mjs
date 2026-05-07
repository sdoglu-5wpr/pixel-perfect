import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';

function processDoc(path) {
  let md = readFileSync(path, 'utf8');
  // Strip front-matter block (title + metadata lines and first ---)
  md = md.replace(/^# .*?\n\n\*\*URL:\*\*[\s\S]*?\n---\n/, '');
  return md;
}

function extractFAQ(md) {
  const m = md.match(/## Frequently asked questions\n([\s\S]*?)\n---/);
  if (!m) return { faq: [], stripped: md };
  const block = m[1];
  const faq = [];
  const re = /\*\*(.+?)\*\*\n(.+?)(?=\n\n\*\*|\s*$)/gs;
  let mm;
  while ((mm = re.exec(block)) !== null) {
    faq.push({ q: mm[1].trim(), a: mm[2].trim().replace(/\n/g, ' ') });
  }
  // remove the FAQ section from body
  const stripped = md.replace(/## Frequently asked questions\n[\s\S]*?\n---\n/, '');
  return { faq, stripped };
}

marked.setOptions({ gfm: true, breaks: false });

// DOC 1 - pillar
let doc1 = processDoc('/tmp/doc1.md');
const { faq: faq1, stripped: doc1stripped } = extractFAQ(doc1);
// Replace "GEO vs SEO" related-reading line with a link
let doc1final = doc1stripped.replace(/- GEO vs SEO\b/, '- [GEO vs SEO](/geo-vs-seo)');
const html1 = marked.parse(doc1final);

// DOC 2 - article
let doc2 = processDoc('/tmp/doc2.md');
const { faq: faq2, stripped: doc2stripped } = extractFAQ(doc2);
let doc2final = doc2stripped.replace(/- What Is GEO \(Generative Engine Optimization\)\?/, '- [What Is GEO (Generative Engine Optimization)?](/generative-engine-optimization)');
const html2 = marked.parse(doc2final);

writeFileSync('/tmp/pillar.html', html1);
writeFileSync('/tmp/pillar.faq.json', JSON.stringify(faq1, null, 2));
writeFileSync('/tmp/article.html', html2);
writeFileSync('/tmp/article.faq.json', JSON.stringify(faq2, null, 2));

console.log('pillar html len:', html1.length, 'faqs:', faq1.length);
console.log('article html len:', html2.length, 'faqs:', faq2.length);
