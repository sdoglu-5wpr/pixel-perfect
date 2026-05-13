-- Rewrite stored Supabase project storage URLs to the custom domain so the
-- raw *.supabase.co host never leaks via API responses, RSS, sitemaps, or HTML.
update posts
set content_html = replace(content_html,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where content_html like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update posts
set first_inline_image = replace(first_inline_image,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where first_inline_image like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update media
set url = replace(url,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where url like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update media_variants
set url = replace(url,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where url like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update seo_meta
set og_image = replace(og_image,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where og_image like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update seo_meta
set twitter_image = replace(twitter_image,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where twitter_image like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update authors
set avatar_url = replace(avatar_url,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where avatar_url like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update categories
set og_image = replace(og_image,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where og_image like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update tags
set og_image = replace(og_image,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where og_image like '%unycfscvsckgxboherpk.supabase.co/storage/%';

update pillars
set hero_image_url = replace(hero_image_url,
  'https://unycfscvsckgxboherpk.supabase.co/storage/',
  'https://api.everything-pr.com/storage/')
where hero_image_url like '%unycfscvsckgxboherpk.supabase.co/storage/%';