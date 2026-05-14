-- A2: rename legacy post that collides with /travel pillar
UPDATE posts SET slug = 'travel-is-hotter-than-ever', modified_at = now() WHERE id = 15435 AND slug = 'travel';

-- B2: 301s for Ronn's spec slugs that don't match DB pillar slugs
INSERT INTO redirects (source_path, target_path, status_code, enabled, notes)
VALUES
  ('/ai/', '/ai-communications/', 301, true, 'Ronn spec slug → DB pillar slug'),
  ('/ai', '/ai-communications/', 301, true, 'Ronn spec slug → DB pillar slug'),
  ('/healthcare/', '/health-tech/', 301, true, 'Ronn spec slug → DB pillar slug'),
  ('/healthcare', '/health-tech/', 301, true, 'Ronn spec slug → DB pillar slug')
ON CONFLICT (source_path) DO NOTHING;