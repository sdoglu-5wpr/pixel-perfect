UPDATE posts
SET status = 'publish', modified_at = NOW()
WHERE status = 'draft'
  AND type = 'post'
  AND featured_media_id IS NOT NULL
  AND featured_media_id > 0
  AND slug NOT LIKE 'draft-%';