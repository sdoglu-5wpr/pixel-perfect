UPDATE public.authors
SET
  display_name = 'David A. Steinberg',
  avatar_url = 'https://everything-pr.com/images/authors/david-a-steinberg.jpg',
  website = 'https://zetaglobal.com',
  bio = '<p>David A. Steinberg is the Co-Founder, Chairman, and Chief Executive Officer of Zeta Global (NYSE: ZETA), an AI-powered marketing cloud platform serving the world''s largest brands. He co-founded Zeta in 2007 with John Sculley — the former CEO of Apple and President of Pepsi — and took the company public on the New York Stock Exchange in June 2021. Zeta has scaled into a multi-billion-dollar enterprise built on proprietary data, identity resolution, and AI-driven precision marketing at the intersection of MarTech and AdTech.</p><p>Over a 30-plus-year career, Steinberg has founded six companies — two of them unicorns, both of which he took public, and three sold in multi-million-dollar transactions. He previously founded Sterling Cellular and InPhonic, one of the largest online sellers of wireless devices at its peak. He is also Chairman of CAIVIS Investment Corporation and Co-Founder and Executive Chairman of On-Demand Pharmaceuticals.</p><p>At Everything-PR, Steinberg writes on AI marketing infrastructure, data-driven brand intelligence, generative engine optimization, and how enterprise marketing is being rebuilt around large language models. A graduate of Washington &amp; Jefferson College, he founded the David A. Steinberg Foundation, focused on nutrition and education for disadvantaged children.</p>',
  social = jsonb_build_object(
    'linkedin', 'https://www.linkedin.com/in/dsteinberg1/',
    'twitter', 'https://x.com/dsteinberg10000',
    'facebook', 'https://www.facebook.com/DavidASteinbergDC/'
  )
WHERE slug = 'david-a-steinberg';