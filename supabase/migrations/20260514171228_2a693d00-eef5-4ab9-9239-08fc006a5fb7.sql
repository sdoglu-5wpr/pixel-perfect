INSERT INTO posts (id, slug, title, content_html, type, status, article_type, pillar_slug, pillar_index, author_id, modified_at)
VALUES
  (112742, 'analyst-relations-ai-era', 'Analyst Relations in the AI Era', '', 'post', 'draft', 'pillar', 'b2b', 1, 1052, now()),
  (112743, 'category-creation-b2b-saas', 'Category Creation for B2B SaaS', '', 'post', 'draft', 'pillar', 'b2b', 2, 1052, now()),
  (112744, 'founder-branding-pipeline', 'Founder Branding That Drives Pipeline', '', 'post', 'draft', 'pillar', 'b2b', 3, 1052, now()),
  (112745, 'comparison-query-playbook', 'The Comparison-Query Playbook: Winning Snowflake vs Databricks', '', 'post', 'draft', 'pillar', 'b2b', 4, 1052, now()),
  (112746, 'procurement-communications', 'Procurement-Facing Communications for B2B SaaS in 2026', '', 'post', 'draft', 'pillar', 'b2b', 5, 1052, now()),
  (112747, 'ai-citation-share', 'AI Citation Share: An Emerging Metric for B2B Visibility', '', 'post', 'draft', 'pillar', 'b2b', 6, 1052, now()),
  (112748, 'ipo-funding-communications', 'IPO & Funding Round Communications for B2B SaaS', '', 'post', 'draft', 'pillar', 'b2b', 7, 1052, now()),
  (112749, 'customer-marketing-advocacy', 'Customer Marketing & Advocacy in the AI Era for B2B SaaS', '', 'post', 'draft', 'pillar', 'b2b', 8, 1052, now()),
  (112750, 'ma-exit-communications', 'M&A and Exit Communications for B2B SaaS', '', 'post', 'draft', 'pillar', 'b2b', 9, 1052, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO post_categories (post_id, category_id)
SELECT id, 27955 FROM posts WHERE id BETWEEN 112742 AND 112750
ON CONFLICT DO NOTHING;