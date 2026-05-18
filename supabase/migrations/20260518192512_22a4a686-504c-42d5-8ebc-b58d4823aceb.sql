UPDATE posts
SET content_html = regexp_replace(
  content_html,
  '\s*<div class="about">[\s\S]*?</div>\s*<footer>[\s\S]*?</footer>',
  '',
  'g'
),
modified_at = now()
WHERE slug = 'israeli-jewish-media-the-ai-visibility-study-everything-pr';