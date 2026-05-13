
WITH targets AS (
  SELECT id FROM posts
  WHERE (content_html ILIKE '%curium%' OR content_text ILIKE '%curium%' OR title ILIKE '%curium%')
    AND created_at > now() - interval '3 days'
)
DELETE FROM post_categories WHERE post_id IN (SELECT id FROM targets);

WITH targets AS (
  SELECT id FROM posts
  WHERE (content_html ILIKE '%curium%' OR content_text ILIKE '%curium%' OR title ILIKE '%curium%')
    AND created_at > now() - interval '3 days'
)
DELETE FROM post_tags WHERE post_id IN (SELECT id FROM targets);

WITH targets AS (
  SELECT id FROM posts
  WHERE (content_html ILIKE '%curium%' OR content_text ILIKE '%curium%' OR title ILIKE '%curium%')
    AND created_at > now() - interval '3 days'
)
DELETE FROM post_revisions WHERE post_id IN (SELECT id FROM targets);

WITH targets AS (
  SELECT id FROM posts
  WHERE (content_html ILIKE '%curium%' OR content_text ILIKE '%curium%' OR title ILIKE '%curium%')
    AND created_at > now() - interval '3 days'
)
DELETE FROM internal_links WHERE source_post_id IN (SELECT id FROM targets) OR target_post_id IN (SELECT id FROM targets);

DELETE FROM posts
WHERE (content_html ILIKE '%curium%' OR content_text ILIKE '%curium%' OR title ILIKE '%curium%')
  AND created_at > now() - interval '3 days';
