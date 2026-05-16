INSERT INTO public.redirects (source_path, target_path, status_code, enabled, notes)
SELECT path, '/', 301, true, 'Pillar empty — hidden until content ready'
FROM (VALUES
  ('/startups-venture'),('/startups-venture/'),
  ('/investor-relations'),('/investor-relations/'),
  ('/influencer-marketing'),('/influencer-marketing/'),
  ('/event-experiential'),('/event-experiential/'),
  ('/government-relations-lobbying'),('/government-relations-lobbying/'),
  ('/nonprofit'),('/nonprofit/')
) AS t(path)
ON CONFLICT (source_path) DO UPDATE
  SET target_path = EXCLUDED.target_path,
      status_code = 301,
      enabled = true,
      notes = EXCLUDED.notes;