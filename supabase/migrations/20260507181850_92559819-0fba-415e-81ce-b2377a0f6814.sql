-- One-off taxonomy cleanup: merge obvious duplicate tags + delete empty tags.
-- Keeps the slug with the most posts, repoints post_tags to the winner,
-- inserts a 301 redirect from loser /tag/<slug>/ to winner.

-- 1) Define duplicate pairs (loser_slug -> winner_slug)
WITH pairs(loser, winner) AS (
  VALUES
    ('42west','42-west'),
    ('ad-tech','adtech'),
    ('co-communications-2','co-communications'),
    ('content-creation-2','content-creation'),
    ('covid19','covid-19'),
    ('digital-marketing-2','digital-marketing'),
    ('hr-tech-2','hr-tech'),
    ('lgbtq-2','lgbtq'),
    ('linkbuilding','link-building'),
    ('marketing-2','marketing'),
    ('market-research-2','market-research'),
    ('mwwpr','mww-pr'),
    ('pr-2','pr'),
    ('prfirm','pr-firm'),
    ('sidehustle','side-hustle'),
    ('trevelino-pr-keller-2','trevelino-pr-keller'),
    ('we-work','wework')
),
ids AS (
  SELECT p.loser, p.winner, l.id AS loser_id, w.id AS winner_id
  FROM pairs p
  JOIN tags l ON l.slug = p.loser
  JOIN tags w ON w.slug = p.winner
),
-- 2) Move post_tags from loser -> winner (skip rows where post already tagged with winner)
moved AS (
  UPDATE post_tags pt
  SET tag_id = i.winner_id
  FROM ids i
  WHERE pt.tag_id = i.loser_id
    AND NOT EXISTS (SELECT 1 FROM post_tags pt2 WHERE pt2.post_id = pt.post_id AND pt2.tag_id = i.winner_id)
  RETURNING 1
),
-- 3) Drop any leftover loser links (where winner already had it)
deleted_links AS (
  DELETE FROM post_tags pt USING ids i WHERE pt.tag_id = i.loser_id RETURNING 1
),
-- 4) Insert 301 redirects loser -> winner (both with and without trailing slash)
inserted_redirects AS (
  INSERT INTO redirects (source_path, target_path, status_code, enabled, notes)
  SELECT '/tag/' || loser || '/', '/tag/' || winner || '/', 301, true, 'tag dedupe'
  FROM ids
  ON CONFLICT DO NOTHING
  RETURNING 1
),
-- 5) Delete loser tag rows
deleted_tags AS (
  DELETE FROM tags t USING ids i WHERE t.id = i.loser_id RETURNING 1
)
SELECT
  (SELECT COUNT(*) FROM moved) AS moved_links,
  (SELECT COUNT(*) FROM deleted_links) AS deleted_dup_links,
  (SELECT COUNT(*) FROM inserted_redirects) AS new_redirects,
  (SELECT COUNT(*) FROM deleted_tags) AS deleted_tags;

-- 6) Recompute post_count for affected (and all) tags
UPDATE tags t
SET post_count = COALESCE(c.n, 0)
FROM (
  SELECT tag_id, COUNT(*) AS n FROM post_tags GROUP BY tag_id
) c
WHERE c.tag_id = t.id AND t.post_count <> c.n;

UPDATE tags SET post_count = 0
WHERE post_count <> 0 AND id NOT IN (SELECT tag_id FROM post_tags);

-- 7) Delete all empty tags (no posts attached)
DELETE FROM tags WHERE post_count = 0;
