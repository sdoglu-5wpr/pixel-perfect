
CREATE OR REPLACE FUNCTION public.get_pillar_placeholder(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_pillar jsonb;
  v_items jsonb := '[]'::jsonb;
BEGIN
  SELECT jsonb_build_object(
           'id', p.id, 'slug', p.slug, 'title', p.title,
           'subtitle', p.subtitle, 'byline', p.byline,
           'body_html', p.body_html, 'hero_image_url', p.hero_image_url,
           'faq', p.faq, 'schema_jsonld', p.schema_jsonld,
           'robots', p.robots, 'published', p.published
         )
    INTO v_pillar
    FROM public.pillars p
   WHERE p.slug = p_slug AND p.published = false
   LIMIT 1;
  IF v_pillar IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(x) ORDER BY x.published_at DESC NULLS LAST), '[]'::jsonb)
    INTO v_items
    FROM (
      SELECT po.id, po.slug, po.title, po.excerpt, po.published_at,
             m.url AS media_url,
             po.first_inline_image AS content_html,
             s.og_image,
             jsonb_build_object('id', a.id, 'display_name', a.display_name, 'slug', a.slug) AS author,
             NULL::jsonb AS category
        FROM public.posts po
        LEFT JOIN public.media m ON m.id = po.featured_media_id
        LEFT JOIN public.authors a ON a.id = po.author_id
        LEFT JOIN public.seo_meta s ON s.object_type = 'post' AND s.object_id = po.id
       WHERE po.type = 'post' AND po.status = 'publish' AND po.pillar_slug = p_slug
       ORDER BY po.published_at DESC NULLS LAST
       LIMIT 24
    ) x;

  RETURN jsonb_build_object('pillar', v_pillar, 'items', v_items);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_pillar_placeholder(text) TO anon, authenticated;

INSERT INTO public.pillars (id, slug, title, subtitle, body_html, faq, published) VALUES
  (54, 'beauty-fashion', 'Beauty & Fashion Communications', 'Coverage hub launching soon.', '<p>Coverage hub for beauty and fashion communications launching soon.</p>', '[]'::jsonb, false),
  (55, 'consumer-brands', 'Consumer Brands Communications', 'Coverage hub launching soon.', '<p>Coverage hub for consumer brands launching soon.</p>', '[]'::jsonb, false),
  (56, 'corporate-communications', 'Corporate Communications', 'Coverage hub launching soon.', '<p>Coverage hub for corporate communications launching soon.</p>', '[]'::jsonb, false),
  (57, 'crisis-communications', 'Crisis Communications', 'Coverage hub launching soon.', '<p>Coverage hub for crisis communications launching soon.</p>', '[]'::jsonb, false),
  (58, 'digital-marketing', 'Digital Marketing', 'Coverage hub launching soon.', '<p>Coverage hub for digital marketing launching soon.</p>', '[]'::jsonb, false),
  (59, 'generative-engine-optimization', 'Generative Engine Optimization', 'Coverage hub launching soon.', '<p>Coverage hub for generative engine optimization launching soon.</p>', '[]'::jsonb, false),
  (60, 'healthcare', 'Healthcare Communications', 'Coverage hub launching soon.', '<p>Coverage hub for healthcare communications launching soon.</p>', '[]'::jsonb, false),
  (61, 'nonprofit', 'Nonprofit Communications', 'Coverage hub launching soon.', '<p>Coverage hub for nonprofit communications launching soon.</p>', '[]'::jsonb, false),
  (62, 'research', 'PR Research & Studies', 'Coverage hub launching soon.', '<p>Coverage hub for PR research and studies launching soon.</p>', '[]'::jsonb, false),
  (63, 'technology', 'Technology Communications', 'Coverage hub launching soon.', '<p>Coverage hub for technology communications launching soon.</p>', '[]'::jsonb, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.redirects (source_path, target_path, status_code, enabled, notes) VALUES
  ('/automotive', '/automotive-mobility', 301, true, 'Pillar alias'),
  ('/automotive/', '/automotive-mobility', 301, true, 'Pillar alias'),
  ('/retail', '/retail-ecommerce', 301, true, 'Pillar alias'),
  ('/retail/', '/retail-ecommerce', 301, true, 'Pillar alias');
