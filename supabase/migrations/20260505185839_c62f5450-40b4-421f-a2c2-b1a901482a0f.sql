-- Recompute post_count from real published posts first
UPDATE public.authors a
SET post_count = COALESCE(c.cnt, 0)
FROM (
  SELECT author_id, COUNT(*)::int AS cnt
  FROM public.posts
  WHERE type = 'post' AND status = 'publish' AND author_id IS NOT NULL
  GROUP BY author_id
) c
WHERE c.author_id = a.id;

UPDATE public.authors SET post_count = 0
WHERE id NOT IN (
  SELECT DISTINCT author_id FROM public.posts
  WHERE author_id IS NOT NULL AND type = 'post' AND status = 'publish'
);

-- Delete spam/subscriber rows: anyone with no published posts and not referenced by any post
DELETE FROM public.authors
WHERE post_count = 0
  AND id NOT IN (SELECT DISTINCT author_id FROM public.posts WHERE author_id IS NOT NULL);