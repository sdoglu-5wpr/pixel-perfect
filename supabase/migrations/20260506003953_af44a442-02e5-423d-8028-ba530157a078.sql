UPDATE public.pillars
SET body_html = regexp_replace(body_html, '<h3>Extracted images.*$', '', 's'),
    updated_at = now()
WHERE slug = 'cybersecurity';