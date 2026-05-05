
-- Indexes
create index if not exists idx_posts_type_status_published on public.posts (type, status, published_at desc nulls last);
create index if not exists idx_posts_featured_media on public.posts (featured_media_id);
create index if not exists idx_post_categories_post on public.post_categories (post_id);
create index if not exists idx_post_tags_post on public.post_tags (post_id);
create index if not exists idx_seo_meta_lookup on public.seo_meta (object_type, object_id);
create index if not exists idx_media_id on public.media (id);

-- =============================================================
-- get_article_full(slug)
-- =============================================================
create or replace function public.get_article_full(slug_param text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_post posts%rowtype;
  v_result jsonb;
begin
  select * into v_post
  from posts
  where slug = slug_param
    and status = 'publish'
    and type in ('post','page')
  limit 1;

  if not found then
    return null;
  end if;

  select jsonb_build_object(
    'post', jsonb_build_object(
      'id', v_post.id,
      'slug', v_post.slug,
      'title', v_post.title,
      'excerpt', v_post.excerpt,
      'content_html', v_post.content_html,
      'published_at', v_post.published_at,
      'modified_at', v_post.modified_at,
      'type', v_post.type,
      'status', v_post.status,
      'author_id', v_post.author_id,
      'featured_media_id', v_post.featured_media_id
    ),
    'author', (
      select jsonb_build_object(
        'id', a.id, 'display_name', a.display_name, 'slug', a.slug,
        'avatar_url', a.avatar_url, 'bio', a.bio
      )
      from authors a where a.id = v_post.author_id
    ),
    'featured_media', (
      select jsonb_build_object('url', m.url, 'alt_text', m.alt_text)
      from media m where m.id = v_post.featured_media_id
    ),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
      from post_categories pc
      join categories c on c.id = pc.category_id
      where pc.post_id = v_post.id
    ), '[]'::jsonb),
    'seo', (
      select jsonb_build_object(
        'title', s.title, 'description', s.description,
        'canonical_url', s.canonical_url,
        'og_title', s.og_title, 'og_description', s.og_description,
        'og_image', s.og_image, 'robots', s.robots
      )
      from seo_meta s
      where s.object_type = 'post' and s.object_id = v_post.id
      limit 1
    ),
    'top_stories', coalesce((
      select jsonb_agg(t order by t.published_at desc nulls last)
      from (
        select p.id, p.slug, p.title, p.excerpt, p.published_at,
               substring(p.content_html for 1500) as content_html,
               m.url as media_url,
               jsonb_build_object('display_name', a.display_name) as author,
               (select jsonb_build_object('name', c.name, 'slug', c.slug)
                from post_categories pc join categories c on c.id = pc.category_id
                where pc.post_id = p.id limit 1) as category
        from posts p
        left join media m on m.id = p.featured_media_id
        left join authors a on a.id = p.author_id
        where p.type='post' and p.status='publish' and p.id <> v_post.id
        order by p.published_at desc nulls last
        limit 5
      ) t
    ), '[]'::jsonb),
    'other_news', coalesce((
      select jsonb_agg(t order by t.published_at desc nulls last)
      from (
        select p.id, p.slug, p.title, p.excerpt, p.published_at,
               substring(p.content_html for 1500) as content_html,
               m.url as media_url,
               jsonb_build_object('display_name', a.display_name) as author,
               (select jsonb_build_object('name', c.name, 'slug', c.slug)
                from post_categories pc join categories c on c.id = pc.category_id
                where pc.post_id = p.id limit 1) as category
        from posts p
        left join media m on m.id = p.featured_media_id
        left join authors a on a.id = p.author_id
        where p.type='post' and p.status='publish' and p.id <> v_post.id
        order by p.published_at desc nulls last
        offset 5 limit 3
      ) t
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.get_article_full(text) to anon, authenticated;

-- =============================================================
-- get_homepage_data(section_slugs[], crisis_slug, economy_slug)
-- =============================================================
create or replace function public.get_homepage_data(
  p_section_slugs text[] default array['pr-news','pr-insights','marketing','social-media'],
  p_crisis_slug   text   default 'crisis-pr',
  p_economy_slug  text   default 'corporate-pr'
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  with latest as (
    select p.id, p.slug, p.title, p.excerpt, p.published_at,
           p.featured_media_id, p.author_id,
           substring(p.content_html for 1500) as content_html
    from posts p
    where p.type='post' and p.status='publish'
    order by p.published_at desc nulls last
    limit 20
  ),
  latest_enriched as (
    select l.*,
      m.url as media_url,
      jsonb_build_object('id', a.id, 'display_name', a.display_name,
                         'slug', a.slug, 'avatar_url', a.avatar_url) as author,
      (select jsonb_build_object('name', c.name, 'slug', c.slug)
       from post_categories pc join categories c on c.id=pc.category_id
       where pc.post_id = l.id limit 1) as category
    from latest l
    left join media m on m.id = l.featured_media_id
    left join authors a on a.id = l.author_id
  ),
  hero_ids as (select id from latest order by published_at desc nulls last limit 5),
  section_posts as (
    select ss as section_slug,
           sp.id, sp.slug, sp.title, sp.excerpt, sp.published_at,
           sp.media_url, sp.author, sp.content_html,
           jsonb_build_object('name', sc.name, 'slug', sc.slug) as category,
           sp.row_no
    from unnest(p_section_slugs) ss
    cross join lateral (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             substring(p.content_html for 1500) as content_html,
             m.url as media_url,
             jsonb_build_object('id', a.id, 'display_name', a.display_name,
                                'slug', a.slug, 'avatar_url', a.avatar_url) as author,
             row_number() over (order by p.published_at desc nulls last) as row_no
      from posts p
      join post_categories pc on pc.post_id = p.id
      join categories c on c.id = pc.category_id
      left join media m on m.id = p.featured_media_id
      left join authors a on a.id = p.author_id
      where p.type='post' and p.status='publish' and c.slug = ss
        and p.id not in (select id from hero_ids)
      order by p.published_at desc nulls last
      limit 3
    ) sp
    join categories sc on sc.slug = ss
  ),
  crisis_posts as (
    select p.id, p.slug, p.title, p.excerpt, p.published_at,
           substring(p.content_html for 1500) as content_html,
           m.url as media_url,
           jsonb_build_object('id', a.id, 'display_name', a.display_name,
                              'slug', a.slug, 'avatar_url', a.avatar_url) as author
    from posts p
    join post_categories pc on pc.post_id = p.id
    join categories c on c.id = pc.category_id
    left join media m on m.id = p.featured_media_id
    left join authors a on a.id = p.author_id
    where p.type='post' and p.status='publish' and c.slug = p_crisis_slug
    order by p.published_at desc nulls last
    limit 3
  ),
  economy_post as (
    select p.id, p.slug, p.title, p.excerpt, p.published_at,
           substring(p.content_html for 1500) as content_html,
           m.url as media_url,
           jsonb_build_object('id', a.id, 'display_name', a.display_name,
                              'slug', a.slug, 'avatar_url', a.avatar_url) as author
    from posts p
    join post_categories pc on pc.post_id = p.id
    join categories c on c.id = pc.category_id
    left join media m on m.id = p.featured_media_id
    left join authors a on a.id = p.author_id
    where p.type='post' and p.status='publish' and c.slug = p_economy_slug
    order by p.published_at desc nulls last
    limit 1
  ),
  top_authors_q as (
    select id, display_name, slug, avatar_url, bio, post_count
    from authors
    order by post_count desc nulls last
    limit 4
  ),
  footer as (
    select mi.label, mi.url, mi.position
    from menus mn
    join menu_items mi on mi.menu_id = mn.id
    where mn.slug = 'menu-2'
    order by mi.position
  )
  select jsonb_build_object(
    'latest', coalesce((select jsonb_agg(to_jsonb(le) order by le.published_at desc nulls last) from latest_enriched le), '[]'::jsonb),
    'sections', coalesce((
      select jsonb_object_agg(section_slug, posts)
      from (
        select section_slug,
               jsonb_agg(jsonb_build_object(
                 'id', id, 'slug', slug, 'title', title, 'excerpt', excerpt,
                 'published_at', published_at, 'media_url', media_url,
                 'content_html', content_html,
                 'author', author, 'category', category
               ) order by published_at desc nulls last) as posts
        from section_posts group by section_slug
      ) g
    ), '{}'::jsonb),
    'crisis', coalesce((select jsonb_agg(to_jsonb(c) order by c.published_at desc nulls last) from crisis_posts c), '[]'::jsonb),
    'economy', (select to_jsonb(e) from economy_post e limit 1),
    'top_authors', coalesce((select jsonb_agg(to_jsonb(t)) from top_authors_q t), '[]'::jsonb),
    'footer_menu', coalesce((
      select jsonb_agg(jsonb_build_object('label', label, 'url', url) order by position)
      from footer
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.get_homepage_data(text[], text, text) to anon, authenticated;
