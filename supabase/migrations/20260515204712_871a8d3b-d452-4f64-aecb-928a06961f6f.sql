-- Convert <li>[label](/path/)</li> into <li><a href="/path/">label</a></li>
-- Run repeatedly to handle multiple links per row.
UPDATE public.posts
SET content_html = regexp_replace(
      content_html,
      '<li>\[([^\]]+)\]\(([^)]+)\)</li>',
      '<li><a href="\2">\1</a></li>',
      'g'
    ),
    updated_at = now()
WHERE article_type = 'pillar'
  AND pillar_slug = 'travel'
  AND content_html ~ '<li>\[[^\]]+\]\([^)]+\)</li>';

-- Decode &amp; back to & inside the anchor labels we just produced
-- (so "Loyalty Program PR &amp; the Miles Economy" -> "& the Miles Economy").
UPDATE public.posts
SET content_html = regexp_replace(
      content_html,
      '(<a href="[^"]+">[^<]*?)&amp;([^<]*?</a>)',
      '\1&\2',
      'g'
    ),
    updated_at = now()
WHERE article_type = 'pillar'
  AND pillar_slug = 'travel';

-- Strip stray <p>---</p> separators left over from the markdown source.
UPDATE public.posts
SET content_html = regexp_replace(content_html, '\s*<p>\s*---\s*</p>\s*', E'\n', 'g'),
    updated_at = now()
WHERE article_type = 'pillar'
  AND pillar_slug = 'travel'
  AND content_html LIKE '%<p>---</p>%';
