
CREATE OR REPLACE FUNCTION public.rewrite_legacy_media_urls()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '300s'
AS $$
DECLARE
  v_supabase_url text;
  v_seo_updated int := 0;
  v_posts_updated int := 0;
  v_inline_updated int := 0;
BEGIN
  -- Resolve base URL from any media row, fallback to placeholder if absent
  SELECT split_part(url, '/storage/v1/', 1)
    INTO v_supabase_url
  FROM media
  WHERE url LIKE '%/storage/v1/object/public/wp-media/%'
  LIMIT 1;

  IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
    RETURN jsonb_build_object('error','no_supabase_url_detected');
  END IF;

  -- Build mapping table from done queue
  CREATE TEMP TABLE _url_map ON COMMIT DROP AS
  SELECT
    url AS old_url,
    v_supabase_url || '/storage/v1/object/public/wp-media/' || storage_key AS new_url
  FROM media_backfill_queue
  WHERE status = 'done';

  CREATE INDEX ON _url_map (old_url);

  -- 1) seo_meta og_image / twitter_image
  WITH upd AS (
    UPDATE seo_meta s
    SET og_image      = COALESCE(mo.new_url, s.og_image),
        twitter_image = COALESCE(mt.new_url, s.twitter_image),
        updated_at    = now()
    FROM (SELECT 1) dummy
    LEFT JOIN _url_map mo ON mo.old_url = s.og_image
    LEFT JOIN _url_map mt ON mt.old_url = s.twitter_image
    WHERE (mo.new_url IS NOT NULL AND mo.new_url IS DISTINCT FROM s.og_image)
       OR (mt.new_url IS NOT NULL AND mt.new_url IS DISTINCT FROM s.twitter_image)
    RETURNING 1
  )
  SELECT count(*) INTO v_seo_updated FROM upd;

  -- 2) posts.first_inline_image
  WITH upd AS (
    UPDATE posts p
    SET first_inline_image = m.new_url,
        updated_at = now()
    FROM _url_map m
    WHERE p.first_inline_image = m.old_url
    RETURNING 1
  )
  SELECT count(*) INTO v_inline_updated FROM upd;

  -- 3) posts.content_html — replace each occurrence
  WITH to_update AS (
    SELECT p.id, p.content_html, m.old_url, m.new_url
    FROM posts p
    JOIN _url_map m ON p.content_html LIKE '%' || m.old_url || '%'
  ),
  agg AS (
    SELECT id,
           (SELECT string_agg(old_url || E'\n' || new_url, E'\n---\n')
              FROM to_update t2 WHERE t2.id = t.id) AS pairs
    FROM to_update t
    GROUP BY id
  ),
  rewritten AS (
    SELECT p.id,
           (SELECT
              (WITH RECURSIVE r(html, remaining) AS (
                 SELECT p.content_html, ARRAY(
                   SELECT ROW(t2.old_url, t2.new_url)::text
                   FROM to_update t2 WHERE t2.id = p.id
                 )
                 UNION ALL
                 SELECT replace(html,
                                split_part(remaining[1], ',', 1),
                                split_part(remaining[1], ',', 2)),
                        remaining[2:]
                 FROM r
                 WHERE array_length(remaining,1) > 0
               )
               SELECT html FROM r ORDER BY array_length(remaining,1) NULLS FIRST LIMIT 1)
           ) AS new_html
    FROM posts p
    WHERE EXISTS (SELECT 1 FROM to_update t WHERE t.id = p.id)
  ),
  upd AS (
    UPDATE posts p
    SET content_html = r.new_html,
        updated_at = now()
    FROM rewritten r
    WHERE p.id = r.id AND r.new_html IS DISTINCT FROM p.content_html
    RETURNING 1
  )
  SELECT count(*) INTO v_posts_updated FROM upd;

  RETURN jsonb_build_object(
    'seo_updated', v_seo_updated,
    'posts_inline_updated', v_inline_updated,
    'posts_html_updated', v_posts_updated,
    'mapping_size', (SELECT count(*) FROM _url_map)
  );
END;
$$;
