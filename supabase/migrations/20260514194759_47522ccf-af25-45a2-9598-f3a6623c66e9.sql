
WITH rows(slug, title, pillar_slug, pillar_index) AS (VALUES
  ('university-brand-strategy-ai-era','University Brand Strategy in the AI Era','university-brand-strategy-ai-era',0),
  ('citation-share-universities-ai-search','Citation Share: How Universities Now Measure Reputation in AI Search','university-brand-strategy-ai-era',1),
  ('why-university-not-in-chatgpt','Why Your University Doesn''t Show Up in ChatGPT — And How to Fix It','university-brand-strategy-ai-era',2),
  ('geo-playbook-higher-education','The GEO Playbook for Higher Education','university-brand-strategy-ai-era',3),
  ('faculty-brand-equity-retrieval-anchors','Faculty as Brand Equity: How Professors Become Retrieval Anchors','university-brand-strategy-ai-era',4),
  ('research-visibility-pubmed-to-perplexity','Research Visibility Strategy: From PubMed to Perplexity','university-brand-strategy-ai-era',5),
  ('university-website-new-press-release','The University Website Is the New Press Release','university-brand-strategy-ai-era',6),
  ('synthetic-media-university-reputation','Synthetic Media and the New Reputation Threat Facing Universities','university-brand-strategy-ai-era',7),
  ('trust-authenticity-higher-education-brand','Trust, Authenticity, and the Higher Education Brand','university-brand-strategy-ai-era',8),
  ('wikipedia-wikidata-university-citation-stack','Wikipedia, Wikidata, and the AI Citation Stack for Universities','university-brand-strategy-ai-era',9),
  ('ai-overviews-college-rankings','How AI Overviews Are Rewriting College Rankings','university-brand-strategy-ai-era',10),
  ('death-of-the-college-brochure','The Death of the College Brochure','university-brand-strategy-ai-era',11),
  ('institutional-authority-higher-education','Institutional Authority: The New Currency of Higher Education','university-brand-strategy-ai-era',12),
  ('edtech-platform-marketing','EdTech Platform Marketing','edtech-platform-marketing',0),
  ('edtech-gtm-pilot-to-procurement','EdTech GTM Strategy: From Pilot to Procurement','edtech-platform-marketing',1),
  ('ai-tutor-differentiation','AI Tutor Differentiation in a Saturated Market','edtech-platform-marketing',2),
  ('trust-ai-learning-products','Trust in AI Learning Products: The New Buyer Question','edtech-platform-marketing',3),
  ('district-procurement-decoded','District Procurement Decoded: The Long Sales Cycle','edtech-platform-marketing',4),
  ('ai-product-positioning-edtech-founders','AI Product Positioning for EdTech Founders','edtech-platform-marketing',5),
  ('edtech-seo-dead-geo-live','EdTech SEO Is Dead. EdTech GEO Is Live.','edtech-platform-marketing',6),
  ('edtech-content-marketing-authority-stack','Content Marketing for EdTech: The Authority Stack','edtech-platform-marketing',7),
  ('enterprise-sales-learning-platforms','Enterprise Sales for Learning Platforms','edtech-platform-marketing',8),
  ('investor-narratives-ai-edtech','Investor Narratives in the AI EdTech Sector','edtech-platform-marketing',9),
  ('b2b-funnels-education-buyers','B2B Funnels That Win Education Buyers','edtech-platform-marketing',10),
  ('edtech-categories-founders-should-build','The Categories EdTech Founders Should Be Building Now','edtech-platform-marketing',11),
  ('ai-learning-citations-claude-chatgpt','How AI Learning Companies Earn Citations in Claude and ChatGPT','edtech-platform-marketing',12)
),
numbered AS (
  SELECT row_number() OVER (ORDER BY pillar_slug, pillar_index) AS rn, * FROM rows
),
inserted AS (
  INSERT INTO posts (id, slug, title, status, type, article_type, pillar_slug, pillar_index, content_html, excerpt, author_id, featured_media_id, modified_at)
  SELECT 112794 + rn, slug, title, 'draft'::post_status, 'post'::content_type, 'pillar', pillar_slug, pillar_index, '', NULL, 1052, NULL, now()
  FROM numbered
  RETURNING id
)
INSERT INTO post_categories (post_id, category_id)
SELECT id, 27963 FROM inserted;
