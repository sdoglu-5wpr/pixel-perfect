UPDATE posts
SET content_html = regexp_replace(
  content_html,
  '<header class="hero">.*?</header>[[:space:]]*',
  '',
  'gs'
)
WHERE slug = 'israeli-jewish-media-the-ai-visibility-study';
