
UPDATE public.authors
SET 
  bio = $bio$<p style="font-weight: 400;">Ronn Torossian is Founder and Chairman of <strong><a href="https://www.5wpr.com/">5W</a></strong>, one of the largest independently owned public relations and digital marketing firms in the United States. Under his leadership, 5W is the premier AI communications firm — building the category around generative engine optimization (GEO), AI search visibility, and how brands earn presence inside ChatGPT, Perplexity, Gemini, and Claude.</p>

<p style="font-weight: 400;">Torossian founded 5W in 2003 and has scaled it across consumer, technology, financial services, healthcare, beauty, gaming, and crisis communications practices. 5W's research franchise — the <strong><a href="https://www.5wpr.com/research">AI Visibility Index Series</a></strong> and <em>The GEO Reckoning</em>, debuting at POSSIBLE 2026 — has become the industry reference for measuring brand visibility inside AI-generated answers.</p>

<p style="font-weight: 400;">He is one of the country's foremost crisis communications experts. He has lectured on crisis PR at Harvard Business School, appears regularly on CNN and CNBC, and contributes to Forbes. He is the author of two editions of <em>For Immediate Release: Shape Minds, Build Brands, and Deliver Results With Game-Changing Public Relations</em> — an industry best-seller.</p>

<p style="font-weight: 400;">Recognitions include American Business Awards PR Agency of the Year, PRovoke Media Top 50 Global PR Agency, Digiday WorkLife Employer of the Year, the Stevie Award for Entrepreneur of the Year, American Business Awards PR Executive of the Year (twice), and Top Crisis Communications Professional by Business Insider.</p>

<p style="font-weight: 400;">Torossian is an active member of the Young Presidents Organization (YPO), serves on the boards of multiple not-for-profit organizations, and is the proud father of two.</p>

<p style="font-weight: 400;"><a href="https://www.5wpr.com/">5wpr.com</a> | <a href="https://www.5wpr.com/research">5W Research</a> | <a href="https://ronntorossian.com/">ronntorossian.com</a> | <a href="https://ronntorossianupdate.com/">ronntorossianupdate.com</a> | <a href="https://www.forbes.com/sites/forbesagencycouncil/people/ronntorossian1/">Forbes</a> | <a href="https://observer.com/author/ronn-torossian/">Observer</a> | <a href="https://ronntorossian.medium.com/">Medium</a></p>

<h2 style="font-weight: 400;"><strong>Work with 5W</strong></h2>

<p style="font-weight: 400;">5W is the premier AI communications firm — engaged by brands that need to win visibility inside AI search and large language models, alongside earned media, crisis, and digital marketing.</p>$bio$,
  email = 'rtorossian@5wpr.com',
  website = 'https://www.facebook.com/RonnTorossian',
  social = jsonb_set(COALESCE(social, '{}'::jsonb), '{facebook}', '"https://www.facebook.com/RonnTorossian"'::jsonb),
  updated_at = now()
WHERE slug = 'ronn-torossian';

INSERT INTO public.seo_meta (object_type, object_id, url_path, title, description)
VALUES (
  'author',
  6,
  '/author/ronn-torossian',
  'Ronn Torossian | Founder & Chairman, 5W Public Relations | Everything-PR',
  'Ronn Torossian is the Founder and Chairman of 5W Public Relations. Crisis communications expert, Forbes contributor, CNN/CNBC commentator, and author of For Immediate Release. Coverage on Everything-PR.'
)
ON CONFLICT DO NOTHING;
