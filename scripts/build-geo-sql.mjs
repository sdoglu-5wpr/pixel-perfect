import { readFileSync, writeFileSync } from 'fs';

const pillarHtml = readFileSync('/tmp/pillar.html', 'utf8');
const pillarFaq = JSON.parse(readFileSync('/tmp/pillar.faq.json', 'utf8'));
const articleHtml = readFileSync('/tmp/article.html', 'utf8');
const articleFaq = JSON.parse(readFileSync('/tmp/article.faq.json', 'utf8'));

// Append FAQ HTML back to article body so on-page FAQ is preserved (matches other posts)
const articleFaqHtml = '\n<h2>Frequently asked questions</h2>\n' +
  articleFaq.map(f => `<h3>${f.q}</h3>\n<p>${f.a}</p>`).join('\n');
const articleHtmlFinal = articleHtml + articleFaqHtml;

const pillarSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://everything-pr.com/generative-engine-optimization/#article",
      "headline": "Generative Engine Optimization (GEO)",
      "description": "What GEO is, why it matters, and how brands win citations inside AI answers.",
      "url": "https://everything-pr.com/generative-engine-optimization/",
      "image": "https://everything-pr.com/pillars/generative-engine-optimization.webp",
      "datePublished": "2026-05-07",
      "dateModified": "2026-05-07",
      "author": { "@type": "Organization", "name": "Everything-PR" },
      "publisher": { "@id": "https://everything-pr.com/#organization" }
    },
    {
      "@type": "FAQPage",
      "@id": "https://everything-pr.com/generative-engine-optimization/#faq",
      "mainEntity": pillarFaq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const j = (o) => q(JSON.stringify(o));

const sql = `
-- Category
INSERT INTO categories (id, slug, name, description, seo_title, seo_description)
VALUES (
  COALESCE((SELECT id FROM categories WHERE slug='generative-engine-optimization'), nextval('categories_id_seq'::regclass)),
  'generative-engine-optimization',
  'Generative Engine Optimization',
  'GEO coverage: how brands earn citations inside ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.',
  'Generative Engine Optimization (GEO)',
  'GEO news, analysis, and strategy for brands competing inside AI-generated answers.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = now();

-- Pillar
INSERT INTO pillars (id, slug, title, subtitle, byline, body_html, faq, schema_jsonld, hero_image_url, published)
VALUES (
  COALESCE((SELECT id FROM pillars WHERE slug='generative-engine-optimization'), nextval('pillars_id_seq'::regclass)),
  'generative-engine-optimization',
  'Generative Engine Optimization (GEO)',
  'What GEO is, why it matters, and how brands win citations inside AI answers.',
  'EPR Staff',
  ${q(pillarHtml)},
  ${j(pillarFaq)}::jsonb,
  ${j(pillarSchema)}::jsonb,
  '/pillars/generative-engine-optimization.webp',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  byline = EXCLUDED.byline,
  body_html = EXCLUDED.body_html,
  faq = EXCLUDED.faq,
  schema_jsonld = EXCLUDED.schema_jsonld,
  hero_image_url = EXCLUDED.hero_image_url,
  published = true,
  updated_at = now();

-- Media row for the article featured image
INSERT INTO media (id, url, filename, mime_type, alt_text, title, width, height, uploaded_at)
VALUES (
  COALESCE((SELECT id FROM media WHERE url='/articles/geo-vs-seo.webp'), nextval('media_id_seq'::regclass)),
  '/articles/geo-vs-seo.webp',
  'geo-vs-seo.webp',
  'image/webp',
  'GEO vs SEO — search results page versus AI-generated answer with inline citations',
  'GEO vs SEO',
  1600,
  900,
  now()
)
ON CONFLICT (url) DO UPDATE SET
  alt_text = EXCLUDED.alt_text,
  title = EXCLUDED.title,
  updated_at = now();

-- Post (geo-vs-seo, author Ronn Torossian id=6)
INSERT INTO posts (id, slug, title, excerpt, content_html, type, status, author_id, featured_media_id, published_at, modified_at)
VALUES (
  COALESCE((SELECT id FROM posts WHERE slug='geo-vs-seo'), nextval('posts_id_seq'::regclass)),
  'geo-vs-seo',
  ${q("GEO vs SEO: What's the Difference?")},
  ${q("SEO competes for a position on a search results page. GEO competes for inclusion inside an AI-generated answer. Here is how the two disciplines diverge — and why brands need both.")},
  ${q(articleHtmlFinal)},
  'post',
  'publish',
  6,
  (SELECT id FROM media WHERE url='/articles/geo-vs-seo.webp'),
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  author_id = EXCLUDED.author_id,
  featured_media_id = EXCLUDED.featured_media_id,
  status = 'publish',
  modified_at = now(),
  updated_at = now();

-- Link the post to the category
INSERT INTO post_categories (post_id, category_id)
SELECT (SELECT id FROM posts WHERE slug='geo-vs-seo'),
       (SELECT id FROM categories WHERE slug='generative-engine-optimization')
ON CONFLICT DO NOTHING;
`;

writeFileSync('/tmp/migration.sql', sql);
console.log('SQL bytes:', sql.length);
