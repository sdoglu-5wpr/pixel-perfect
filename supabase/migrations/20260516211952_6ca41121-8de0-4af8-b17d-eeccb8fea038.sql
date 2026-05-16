CREATE OR REPLACE FUNCTION public.get_archive_list(p_kind text, p_slug text DEFAULT NULL::text, p_year integer DEFAULT NULL::integer, p_month integer DEFAULT NULL::integer, p_day integer DEFAULT NULL::integer, p_q text DEFAULT NULL::text, p_page integer DEFAULT 1, p_page_size integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout TO '20s'
AS $function$
declare
  v_offset int := greatest(0, (coalesce(p_page, 1) - 1)) * coalesce(p_page_size, 10);
  v_term jsonb := null;
  v_total int := 0;
  v_rows jsonb := '[]'::jsonb;
  v_start timestamptz;
  v_end timestamptz;
  v_tsq tsquery;
  v_prefix_tsq tsquery;
  v_like text;
begin
  if p_kind = 'category' then
    select jsonb_build_object(
      'id', id, 'name', name, 'slug', slug, 'description', description, 'kind', 'category',
      'seo_title', seo_title, 'seo_description', seo_description,
      'canonical_url', canonical_url, 'robots', robots,
      'og_image', og_image, 'focus_keyword', focus_keyword
    )
      into v_term from public.categories where slug = p_slug limit 1;
    if v_term is null then return null; end if;

    select count(*)::int into v_total
    from public.post_categories pc
    join public.posts p on p.id = pc.post_id
    where pc.category_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish';

    select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_rows
    from (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             p.first_inline_image as content_html,
             m.url as media_url, s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
             jsonb_build_object('name', c.name, 'slug', c.slug) as category
      from public.post_categories pc
      join public.categories c on c.id = pc.category_id
      join public.posts p on p.id = pc.post_id
      left join public.media m on m.id = p.featured_media_id
      left join public.authors a on a.id = p.author_id
      left join public.seo_meta s on s.object_type = 'post' and s.object_id = p.id
      where pc.category_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish'
      order by p.published_at desc nulls last
      offset v_offset limit p_page_size
    ) x;

  elsif p_kind = 'tag' then
    select jsonb_build_object(
      'id', id, 'name', name, 'slug', slug, 'description', description, 'kind', 'tag',
      'seo_title', seo_title, 'seo_description', seo_description,
      'canonical_url', canonical_url, 'robots', robots,
      'og_image', og_image, 'focus_keyword', focus_keyword
    )
      into v_term from public.tags where slug = p_slug limit 1;
    if v_term is null then return null; end if;

    select count(*)::int into v_total
    from public.post_tags pt
    join public.posts p on p.id = pt.post_id
    where pt.tag_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish';

    select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_rows
    from (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             p.first_inline_image as content_html,
             m.url as media_url, s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
             cat.category
      from public.post_tags pt
      join public.posts p on p.id = pt.post_id
      left join public.media m on m.id = p.featured_media_id
      left join public.authors a on a.id = p.author_id
      left join public.seo_meta s on s.object_type = 'post' and s.object_id = p.id
      left join lateral (
        select jsonb_build_object('name', c2.name, 'slug', c2.slug) as category
        from public.post_categories pc2 join public.categories c2 on c2.id = pc2.category_id
        where pc2.post_id = p.id limit 1
      ) cat on true
      where pt.tag_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish'
      order by p.published_at desc nulls last
      offset v_offset limit p_page_size
    ) x;

  elsif p_kind = 'author' then
    select jsonb_build_object(
      'id', id, 'display_name', display_name, 'slug', slug,
      'avatar_url', avatar_url, 'bio', bio, 'website', website,
      'email', email, 'social', social, 'post_count', post_count,
      'tags', tags, 'job_title', job_title,
      'knows_about', knows_about, 'works_for', works_for,
      'kind', 'author'
    )
      into v_term from public.authors where slug = p_slug limit 1;
    if v_term is null then return null; end if;

    select count(*)::int into v_total
    from public.posts p
    where p.author_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish';

    select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_rows
    from (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             p.first_inline_image as content_html,
             m.url as media_url, s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
             cat.category
      from public.posts p
      left join public.media m on m.id = p.featured_media_id
      left join public.authors a on a.id = p.author_id
      left join public.seo_meta s on s.object_type = 'post' and s.object_id = p.id
      left join lateral (
        select jsonb_build_object('name', c2.name, 'slug', c2.slug) as category
        from public.post_categories pc2 join public.categories c2 on c2.id = pc2.category_id
        where pc2.post_id = p.id limit 1
      ) cat on true
      where p.author_id = (v_term->>'id')::bigint and p.type = 'post' and p.status = 'publish'
      order by p.published_at desc nulls last
      offset v_offset limit p_page_size
    ) x;

  elsif p_kind = 'date' then
    if p_day is not null then
      v_start := make_timestamptz(p_year, p_month, p_day, 0, 0, 0, 'UTC');
      v_end := v_start + interval '1 day';
    elsif p_month is not null then
      v_start := make_timestamptz(p_year, p_month, 1, 0, 0, 0, 'UTC');
      v_end := v_start + interval '1 month';
    else
      v_start := make_timestamptz(p_year, 1, 1, 0, 0, 0, 'UTC');
      v_end := v_start + interval '1 year';
    end if;

    select count(*)::int into v_total
    from public.posts p
    where p.type = 'post' and p.status = 'publish' and p.published_at >= v_start and p.published_at < v_end;

    select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_rows
    from (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             p.first_inline_image as content_html,
             m.url as media_url, s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
             cat.category
      from public.posts p
      left join public.media m on m.id = p.featured_media_id
      left join public.authors a on a.id = p.author_id
      left join public.seo_meta s on s.object_type = 'post' and s.object_id = p.id
      left join lateral (
        select jsonb_build_object('name', c2.name, 'slug', c2.slug) as category
        from public.post_categories pc2 join public.categories c2 on c2.id = pc2.category_id
        where pc2.post_id = p.id limit 1
      ) cat on true
      where p.type = 'post' and p.status = 'publish' and p.published_at >= v_start and p.published_at < v_end
      order by p.published_at desc nulls last
      offset v_offset limit p_page_size
    ) x;

    v_term := jsonb_build_object('kind', 'date', 'year', p_year, 'month', p_month, 'day', p_day);

  elsif p_kind = 'search' then
    if coalesce(trim(p_q), '') = '' then return null; end if;
    -- Use 'english' to match the indexed search_vector (which uses english stemming).
    v_tsq := websearch_to_tsquery('english', p_q);
    -- Prefix fallback: AND the tokens with :* so partial words match
    -- (e.g. "comm" -> communications). Strip punctuation, split on whitespace.
    select coalesce(
      (
        select string_agg(tok || ':*', ' & ')
        from (
          select tok
          from unnest(regexp_split_to_array(lower(regexp_replace(p_q, '[^a-zA-Z0-9 ]', ' ', 'g')), '\s+')) as tok
          where length(tok) > 0
        ) t
      ),
      ''
    ) into v_like;
    if v_like <> '' then
      begin
        v_prefix_tsq := to_tsquery('english', v_like);
      exception when others then
        v_prefix_tsq := null;
      end;
    end if;

    select count(*)::int into v_total
    from public.posts p
    where p.type = 'post' and p.status = 'publish'
      and (
        (v_tsq is not null and p.search_vector @@ v_tsq)
        or (v_prefix_tsq is not null and p.search_vector @@ v_prefix_tsq)
        or p.title ilike '%' || p_q || '%'
      );

    select coalesce(jsonb_agg(to_jsonb(x) order by x.published_at desc nulls last), '[]'::jsonb) into v_rows
    from (
      select p.id, p.slug, p.title, p.excerpt, p.published_at,
             p.first_inline_image as content_html,
             m.url as media_url, s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) as author,
             cat.category
      from public.posts p
      left join public.media m on m.id = p.featured_media_id
      left join public.authors a on a.id = p.author_id
      left join public.seo_meta s on s.object_type = 'post' and s.object_id = p.id
      left join lateral (
        select jsonb_build_object('name', c2.name, 'slug', c2.slug) as category
        from public.post_categories pc2 join public.categories c2 on c2.id = pc2.category_id
        where pc2.post_id = p.id limit 1
      ) cat on true
      where p.type = 'post' and p.status = 'publish'
        and (
          (v_tsq is not null and p.search_vector @@ v_tsq)
          or (v_prefix_tsq is not null and p.search_vector @@ v_prefix_tsq)
          or p.title ilike '%' || p_q || '%'
        )
      order by p.published_at desc nulls last
      offset v_offset limit p_page_size
    ) x;

    v_term := jsonb_build_object('kind', 'search', 'q', p_q);

  else
    return null;
  end if;

  return jsonb_build_object('term', v_term, 'total', v_total, 'items', v_rows);
end;
$function$;