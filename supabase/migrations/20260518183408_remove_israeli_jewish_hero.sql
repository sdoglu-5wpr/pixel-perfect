UPDATE posts
SET content_html = regexp_replace(
  content_html,
  '<header class="hero">[\s\S]*?</header>\s*',
  '',
  'n'
)
WHERE slug = 'israeli-jewish-media-the-ai-visibility-study';
