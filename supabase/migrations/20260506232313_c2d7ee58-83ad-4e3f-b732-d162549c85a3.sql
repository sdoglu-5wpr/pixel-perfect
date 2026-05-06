CREATE OR REPLACE FUNCTION public.rewrite_legacy_media_urls()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '300s'
AS $$
DECLARE
  v_supabase_url text;
  v_seo_og int := 0;
  v_seo_tw int := 0;
  v_inline int := 0;
  v_html int := 0;
  v_map_size int := 0;
BEGIN
  SELECT split_part(url, '/storage/v1/', 1)
    INTO v_supabase_url
  FROM media
  WHERE url LIKE '%/storage/v1/object/public/wp-media/%'
  LIMIT 1;

  IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
    RETURN jsonb_build_object('error','no_supabase_url_detected');
  END IF;

  CREATE TEMP TABLE _url_map ON COMMIT DROP AS
  SELECT
    url AS old_url,
    v_supabase_url || '/storage/v1/object/public/wp-media/' || storage_key AS new_url
  FROM media_backfill_queue
  WHERE status = 'done';

  CREATE INDEX ON _url_map (old_url);
  SELECT count(*) INTO v_map_size FROM _url_map;

  -- 1) seo_meta.og_image
  WITH upd AS (
    UPDATE seo_meta s
    SET og_image = m.new_url, updated_at = now()
    FROM _url_map m
    WHERE s.og_image = m.old_url
    RETURNING 1
  ) SELECT count(*) INTO v_seo_og FROM upd;

  -- 2) seo_meta.twitter_image
  WITH upd AS (
    UPDATE seo_meta s
    SET twitter_image = m.new_url, updated_at = now()
    FROM _url_map m
    WHERE s.twitter_image = m.old_url
    RETURNING 1
  ) SELECT count(*) INTO v_seo_tw FROM upd;

  -- 3) posts.first_inline_image
  WITH upd AS (
    UPDATE posts p
    SET first_inline_image = m.new_url, updated_at = now()
    FROM _url_map m
    WHERE p.first_inline_image = m.old_url
    RETURNING 1
  ) SELECT count(*) INTO v_inline FROM upd;

  -- 4) posts.content_html — iterate and replace each occurrence per post
  -- Build per-post replacements via aggregate, then apply with replace() chain
  CREATE TEMP TABLE _post_pairs ON COMMIT DROP AS
  SELECT p.id AS post_id, m.old_url, m.new_url
  FROM posts p
  JOIN _url_map m ON p.content_html LIKE '%' || m.old_url || '%';

  -- Use a PL/pgSQL loop to apply replacements per post
  DECLARE
    rec record;
    new_html text;
  BEGIN
    FOR rec IN SELECT post_id, content_html FROM (
      SELECT DISTINCT pp.post_id, p.content_html
      FROM _post_pairs pp JOIN posts p ON p.id = pp.post_id
    ) t LOOP
      new_html := rec.content_html;
      FOR rec IN SELECT old_url, new_url FROM _post_pairs WHERE post_id = rec.post_id LOOP
        new_html := replace(new_html, rec.old_url, rec.new_url);
      END LOOP;
    END LOOP;
  END;

  -- Simpler & correct: do the html rewrite as one statement using a recursive CTE per post.
  WITH per_post AS (
    SELECT post_id, array_agg(old_url) AS olds, array_agg(new_url) AS news
    FROM _post_pairs GROUP BY post_id
  ),
  rewritten AS (
    SELECT
      pp.post_id,
      (
        SELECT html FROM (
          WITH RECURSIVE r(html, i) AS (
            SELECT p.content_html, 1
            UNION ALL
            SELECT replace(html, pp.olds[i], pp.news[i]), i + 1
            FROM r WHERE i <= array_length(pp.olds, 1)
          )
          SELECT html FROM r ORDER BY i DESC LIMIT 1
        ) x
      ) AS new_html
    FROM per_post pp
    JOIN posts p ON p.id = pp.post_id
  ),
  upd AS (
    UPDATE posts p
    SET content_html = r.new_html, updated_at = now()
    FROM rewritten r
    WHERE p.id = r.post_id AND r.new_html IS DISTINCT FROM p.content_html
    RETURNING 1
  )
  SELECT count(*) INTO v_html FROM upd;

  RETURN jsonb_build_object(
    'seo_updated', v_seo_og + v_seo_tw,
    'posts_inline_updated', v_inline,
    'posts_html_updated', v_html,
    'mapping_size', v_map_size
  );
END;
$$;