INSERT INTO public.redirects (source_path, target_path, status_code, enabled, is_regex, notes)
VALUES
  ('/about/team', '/about/', 301, true, false, 'Phase 2m kill /about/team'),
  ('/about/team/', '/about/', 301, true, false, 'Phase 2m kill /about/team');

UPDATE public.posts
SET content_html = $H$<p>Everything-PR is the independent intelligence platform covering the public relations, marketing, communications, and AI-era reputation industries. Daily reporting since January 2009. Twenty sectors. Fourteen disciplines. Original research.</p><p><strong>Publisher:</strong> Ronn Torossian — Founder and Chairman of 5W Public Relations.</p><p><strong>Contributors:</strong> Seth Semilof (Haute Media Group), Michael Heller (Talent Resources), Kevin Mercuri (Propheta Communications).</p><p>See <a href="/about/">the About page</a> for the full description, research catalog, editorial standards, and contact details.</p>$H$,
    title = 'About Everything-PR',
    excerpt = 'Everything-PR is the independent intelligence platform covering the public relations, marketing, communications, and AI-era reputation industries. Daily reporting since January 2009.',
    updated_at = now(),
    modified_at = now()
WHERE slug = 'about';