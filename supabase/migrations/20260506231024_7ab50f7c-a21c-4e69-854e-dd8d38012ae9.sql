CREATE OR REPLACE FUNCTION public.build_media_backfill_queue()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '120s'
AS $$
DECLARE
  v_scanned int := 0;
  v_inserted int := 0;
  v_pattern text := 'https?://(?:www\.)?everything-pr\.com/wp-content/uploads/[^\s"''<>)\]]+';
BEGIN
  WITH all_urls AS (
    SELECT DISTINCT regexp_replace(url, '[)\].,;:!?"'']+$', '') AS url
    FROM (
      SELECT (regexp_matches(content_html, v_pattern, 'gi'))[1] AS url
      FROM posts
      WHERE content_html ~* 'everything-pr\.com/wp-content/uploads/'
      UNION ALL
      SELECT first_inline_image
      FROM posts
      WHERE first_inline_image ~* 'everything-pr\.com/wp-content/uploads/'
      UNION ALL
      SELECT og_image FROM seo_meta WHERE og_image ~* 'everything-pr\.com/wp-content/uploads/'
      UNION ALL
      SELECT twitter_image FROM seo_meta WHERE twitter_image ~* 'everything-pr\.com/wp-content/uploads/'
      UNION ALL
      SELECT (regexp_matches(raw::text, v_pattern, 'gi'))[1]
      FROM seo_meta
      WHERE raw::text ~* 'everything-pr\.com/wp-content/uploads/'
    ) src
    WHERE url IS NOT NULL
  ),
  parsed AS (
    SELECT
      url,
      'wp-content/uploads/' || substring(url FROM '/wp-content/uploads/(.+)$') AS storage_key
    FROM all_urls
    WHERE url ~ '/wp-content/uploads/.+'
  ),
  scanned AS (
    SELECT COUNT(*) AS c FROM parsed
  ),
  ins AS (
    INSERT INTO media_backfill_queue (url, storage_key, status)
    SELECT url, storage_key, 'pending' FROM parsed
    ON CONFLICT (url) DO NOTHING
    RETURNING 1
  )
  SELECT (SELECT c FROM scanned), (SELECT COUNT(*) FROM ins)
  INTO v_scanned, v_inserted;

  RETURN jsonb_build_object(
    'scanned_urls', v_scanned,
    'queued', v_scanned,
    'newly_inserted', v_inserted
  );
END;
$$;