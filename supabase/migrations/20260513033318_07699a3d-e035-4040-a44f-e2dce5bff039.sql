INSERT INTO public.authors (id, slug, display_name, email, bio, website, social)
VALUES (
  (SELECT COALESCE(MAX(id), 0) + 1 FROM public.authors),
  'eduard-moraru',
  'Eduard Moraru',
  'emoraru@5wpr.com',
  E'Eduard Moraru is an Entrepreneur, AI Growth Expert, SEO Strategist, and GEO Expert with 15+ years of experience launching and scaling digital platforms across AI, health tech, influencer marketing, and education. As CEO of e-CreativeAgency.com and creator of a student education platform that was successfully acquired, Eduard builds systems that turn visibility into revenue.\n\nHe specializes in SEO, Generative Engine Optimization (GEO), and Social Media Marketing — helping brands rank on Google, get cited by AI tools like ChatGPT, Claude, and Perplexity, and dominate on TikTok, Instagram, and YouTube.\n\nBeyond marketing, Eduard builds AI-powered SaaS products, mobile apps, and intelligent workflow systems that automate operations and scale execution. From full-stack development to AI integrations, he engineers the infrastructure that lets businesses grow without bottlenecks.\n\nWith deep experience in the creator and influencer space, Eduard has helped individuals and agencies build their digital presence, monetize their audiences, and scale personal brands into sustainable businesses. Through his agency and consulting work, he has helped creators, brands, and tech startups generate $5M+ in revenue using organic search, TikTok-first content strategies, AI automation, affiliate models, and performance marketing.\n\nHis edge lies in combining technical SEO, GEO, and social media growth with full-stack execution — from AI-powered SaaS and custom apps to scalable content systems and automated workflows — driving measurable, long-term results across industries including the creator economy and talent space.',
  'https://e-creativeagency.com',
  '{"linkedin":"https://www.linkedin.com/in/eduard-moraru-04b913120/","twitter":"https://x.com/edwardmoraru","instagram":"https://www.instagram.com/edwardmoraru"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  bio = EXCLUDED.bio,
  website = EXCLUDED.website,
  social = EXCLUDED.social,
  updated_at = now();