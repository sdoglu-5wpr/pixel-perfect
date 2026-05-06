CREATE OR REPLACE FUNCTION public.get_pillar(p_slug text, p_page integer DEFAULT 1, p_page_size integer DEFAULT 12)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_pillar jsonb;
  v_title text;
  v_cat_id bigint;
  v_cat_ids bigint[];
  v_total int := 0;
  v_offset int := greatest(0, (coalesce(p_page,1)-1)) * coalesce(p_page_size,12);
  v_items jsonb := '[]'::jsonb;
  v_fts_query tsquery;
  v_fts_text text;
begin
  select to_jsonb(p.*), p.title into v_pillar, v_title
  from public.pillars p where p.slug = p_slug and p.published = true limit 1;
  if v_pillar is null then return null; end if;

  -- Primary category (exact slug match) for legacy callers
  select id into v_cat_id from public.categories where slug = p_slug limit 1;

  -- Gather all categories whose slug starts with the pillar slug
  -- (e.g. pillar "health-tech" also pulls "health-tech-pr")
  select coalesce(array_agg(id), '{}'::bigint[]) into v_cat_ids
  from public.categories
  where slug = p_slug
     or slug like (p_slug || '-%')
     or slug like ('%-' || p_slug);

  -- Build a tsquery from the pillar title (first 3 significant words)
  -- so we can fall back to full-text matching when category coverage is thin.
  v_fts_text := regexp_replace(coalesce(v_title,''), '[^A-Za-z0-9 ]', ' ', 'g');
  v_fts_text := trim(regexp_replace(v_fts_text, '\s+', ' ', 'g'));
  begin
    v_fts_query := websearch_to_tsquery('english', v_fts_text);
  exception when others then
    v_fts_query := null;
  end;

  with candidate_posts as (
    -- via related categories
    select distinct po.id, po.published_at
    from public.post_categories pc
    join public.posts po on po.id = pc.post_id
    where pc.category_id = any(v_cat_ids)
      and po.type = 'post' and po.status = 'publish'
    union
    -- fallback: full-text match on title/content
    select po.id, po.published_at
    from public.posts po
    where po.type = 'post' and po.status = 'publish'
      and v_fts_query is not null
      and po.search_vector @@ v_fts_query
  ),
  ranked as (
    select id, published_at from candidate_posts
  )
  select count(*)::int into v_total from ranked;

  with candidate_posts as (
    select distinct po.id, po.published_at
    from public.post_categories pc
    join public.posts po on po.id = pc.post_id
    where pc.category_id = any(v_cat_ids)
      and po.type = 'post' and po.status = 'publish'
    union
    select po.id, po.published_at
    from public.posts po
    where po.type = 'post' and po.status = 'publish'
      and v_fts_query is not null
      and po.search_vector @@ v_fts_query
  ),
  page_ids as (
    select id from candidate_posts order by published_at desc nulls last
    offset v_offset limit p_page_size
  )
  select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_items
  from (
    select po.id, po.slug, po.title, po.excerpt, po.published_at,
      po.first_inline_image as content_html,
      m.url as media_url, s.og_image,
      jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
      (
        select jsonb_build_object('name', c.name, 'slug', c.slug)
        from public.post_categories pc2
        join public.categories c on c.id = pc2.category_id
        where pc2.post_id = po.id
        order by case when c.id = any(v_cat_ids) then 0 else 1 end, c.id
        limit 1
      ) as category
    from page_ids pid
    join public.posts po on po.id = pid.id
    left join public.media m on m.id = po.featured_media_id
    left join public.authors a on a.id = po.author_id
    left join public.seo_meta s on s.object_type = 'post' and s.object_id = po.id
  ) x;

  return jsonb_build_object(
    'pillar', v_pillar,
    'category_id', v_cat_id,
    'related_category_ids', to_jsonb(v_cat_ids),
    'total', v_total,
    'page', coalesce(p_page,1),
    'page_size', coalesce(p_page_size,12),
    'items', v_items
  );
end;
$function$;