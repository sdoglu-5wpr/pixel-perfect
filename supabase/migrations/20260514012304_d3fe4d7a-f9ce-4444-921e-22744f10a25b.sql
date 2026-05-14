
-- 1. Flip canonical: rename adtech-pr → adtech
UPDATE public.categories
SET slug = 'adtech', name = 'AdTech & MarTech', updated_at = now()
WHERE slug = 'adtech-pr';

-- 2. Replace redirect: delete old /adtech/ → /adtech-pr/, insert flipped
DELETE FROM public.redirects
WHERE source_path = '/adtech/' AND target_path = '/adtech-pr/';

INSERT INTO public.redirects (source_path, target_path, status_code, is_regex, enabled, notes)
VALUES ('/adtech-pr/', '/adtech/', 301, false, true, 'Category slug flip 2026-05-14: adtech is canonical')
ON CONFLICT DO NOTHING;

-- 3. Rewrite internal links in posts.content_html
UPDATE public.posts
SET content_html = REPLACE(content_html,
                          'href="https://everything-pr.com/adtech-pr/',
                          'href="https://everything-pr.com/adtech/')
WHERE content_html LIKE '%/adtech-pr/%';

UPDATE public.posts
SET content_html = REPLACE(content_html,
                          'href="/adtech-pr/',
                          'href="/adtech/')
WHERE content_html LIKE '%/adtech-pr/%';

-- 4. Activity log entry
INSERT INTO public.activity_log (action, table_name, row_id, diff)
VALUES ('category.slug_flip', 'categories', '27742',
        jsonb_build_object('from', 'adtech-pr', 'to', 'adtech',
                           'reason', 'Canonicalize to non -pr slug to match the other 6 merges'));
