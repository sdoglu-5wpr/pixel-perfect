INSERT INTO public.pillars (id, slug, title, subtitle, byline, body_html, faq, hero_image_url, published)
VALUES (
  (SELECT COALESCE(MAX(id),0)+1 FROM public.pillars),
  'healthcare-pr',
  'The Health Insurer AI Audit: How the Eight Largest U.S. Health Insurers Disclose AI in Prior Authorization, Claims & Coverage',
  'UnitedHealth, CVS Aetna, Elevance, Humana, Cigna, Centene, Molina, and Oscar — scored on six public-disclosure signals',
  'Everything-PR Editorial',
  '<p><em>The everything-pr disclosure-quality audit of the eight U.S. health insurers most cited in healthcare-AI press, scored on six public-disclosure signals: named AI use cases, named partners, named accountable executives, peer-reviewed publication, regulatory filing detail, and public AI governance principles. Built fully in-house using only public-source research — Senate Permanent Subcommittee on Investigations reports, federal court filings (Lokken v. UnitedHealth, Estate of Gene B. Lokken et al., the Humana class action ruling), corporate press releases, peer-reviewed analysis in Nature''s npj Digital Medicine, and trade press coverage from Fierce Healthcare, Healthcare Dive, Modern Healthcare, ProPublica, Axios, and Bloomberg Law. The audit identifies the named insurer whose disclosure trails its commercial scale most visibly — and the structural reason the disclosure gap will close in 2026 either voluntarily or through regulatory enforcement.</em></p>

<p>By April 2026, AI in health insurance prior authorization and claims processing is the single most-scrutinized AI deployment in U.S. healthcare. Per the U.S. Senate Permanent Subcommittee on Investigations October 17, 2024 majority staff report led by Senator Richard Blumenthal, the three largest Medicare Advantage insurers — UnitedHealthcare, CVS Aetna, and Humana — collectively cover nearly 60% of all MA enrollees and denied claims for post-acute care between 2019 and 2022 at "far higher" rates than for other types of care. UnitedHealth''s post-acute services denial rate increased from 8.7% to 22.7% across that period; UnitedHealth''s skilled nursing home denial rate increased ninefold; the increases coincide with deployment of NaviHealth''s nH Predict algorithmic tool. Per <a href="https://www.healthcaredive.com/news/medicare-advantage-AI-denials-cvs-humana-unitedhealthcare-senate-report/730383/" target="_blank" rel="noopener noreferrer">Healthcare Dive''s coverage of the Senate report</a>, CVS rolled out a "Post-Acute Analytics" project in 2021 that initially expected to save $10–15M in three years, but several months later projected $77.3M in three-year savings. Humana''s denial rate for long-term acute-care hospitals increased 54% between 2020 and 2022.</p>

<p>The disclosure pattern across these eight named insurers is a study in operational asymmetry. The insurers that disclose most have the most class-action exposure. The insurers that disclose less are positioned with thinner defensible records under regulatory scrutiny. The structural problem cuts both directions — and the audit makes the variable visible.</p>

<p>This audit answers six questions the named insurers'' communications teams should be running at minimum quarterly. The methodology and full scoring rubric are at the bottom. Any reader can reproduce the score using only the public sources cited.</p>

<h2>The everything-pr Health Insurer AI Disclosure Index — methodology</h2>

<p>Six signals, 100-point composite scale.</p>

<p><strong>Signal 1 (20 points): Named AI use cases publicly disclosed.</strong> Specific named AI tools, internal platforms, or claims-adjudication systems with disclosed scope and scale.</p>

<p><strong>Signal 2 (15 points): Named AI partners with deal terms publicly disclosed.</strong> Vendor partnerships, technology integrations, and joint ventures publicly named with operational scope.</p>

<p><strong>Signal 3 (15 points): Named accountable executives publicly identified.</strong> Chief AI officer, chief digital officer, head of utilization management, or named clinical leadership.</p>

<p><strong>Signal 4 (15 points): Peer-reviewed publication or regulatory filing depth.</strong> Nature, JAMA, Health Affairs, Annals of Internal Medicine; CMS submissions; SEC 10-K AI disclosure; Senate filing transparency.</p>

<p><strong>Signal 5 (20 points): Regulatory disclosure detail.</strong> CMS, state insurance commissioner, FTC, and DOJ disclosure of AI use in adjudication, including documented compliance with the January 2024 CMS interim final rule restricting predictive algorithms in MA coverage decisions.</p>

<p><strong>Signal 6 (15 points): Public AI governance principles document.</strong> Published AI ethics framework, governance approach, or human-in-the-loop documentation.</p>

<p>Composite below 60 triggers Disclosure Risk tagging. Composite below 45 triggers Critical Disclosure Risk.</p>

<h2>The scorecard</h2>

<table>
  <thead>
    <tr><th>Rank</th><th>Insurer</th><th>Use Cases</th><th>Partners</th><th>Executives</th><th>Peer-Reviewed</th><th>Regulatory</th><th>Governance</th><th>Composite</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>UnitedHealth Group</td><td>19</td><td>14</td><td>13</td><td>11</td><td>13</td><td>9</td><td><strong>79</strong></td></tr>
    <tr><td>2</td><td>Elevance Health</td><td>16</td><td>11</td><td>13</td><td>10</td><td>14</td><td>11</td><td><strong>75</strong></td></tr>
    <tr><td>3</td><td>CVS Health / Aetna</td><td>16</td><td>12</td><td>12</td><td>10</td><td>13</td><td>10</td><td><strong>73</strong></td></tr>
    <tr><td>4</td><td>Humana</td><td>15</td><td>12</td><td>12</td><td>9</td><td>13</td><td>10</td><td><strong>71</strong></td></tr>
    <tr><td>5</td><td>Oscar Health</td><td>14</td><td>11</td><td>13</td><td>8</td><td>12</td><td>11</td><td><strong>69</strong></td></tr>
    <tr><td>6</td><td>Cigna</td><td>13</td><td>10</td><td>11</td><td>9</td><td>13</td><td>6</td><td><strong>62</strong></td></tr>
    <tr><td>7</td><td>Centene</td><td>11</td><td>9</td><td>10</td><td>7</td><td>11</td><td>7</td><td><strong>55 ⚠</strong></td></tr>
    <tr><td>8</td><td>Molina Healthcare</td><td>9</td><td>8</td><td>9</td><td>6</td><td>10</td><td>6</td><td><strong>48 ⚠</strong></td></tr>
  </tbody>
</table>

<h2>The deep audit</h2>

<h3>1. UnitedHealth Group — Composite 79</h3>

<p>UnitedHealth Group leads the audit on disclosure depth — and the depth is structural. The Senate report, the Lokken class action, the Estate of Gene B. Lokken litigation, the 2024 Brian Thompson event, the post-event communications environment, and UnitedHealth''s own product launches (Optum Real, InterQual Auth Accelerator, Digital Auth Complete, Crimson AI) collectively produce more named-AI-system documentation than any other insurer.</p>

<p><strong>Named AI use cases (19/20).</strong> <strong>Optum Real</strong> — real-time AI claims validation system launched at HLTH 2025 in October 2025; per Modern Healthcare''s coverage, the system "aims to turn complex coverage rules into information that doctors and billing staff can use in real time to predict claim payments." Per Bloomberg''s reporting via PYMNTS coverage, the Optum Real system has "meaningfully" reduced denials at Allina Health by flagging claims that need more documentation. <strong>InterQual Auth Accelerator</strong> — payer-facing prior authorization AI, launched February 2026 with two large health plans; first payer expected to be fully live by April 2026, per Becker''s Hospital Review''s February 2026 reporting. <strong>Digital Auth Complete</strong> — provider-facing prior authorization AI, live January 2026 in collaboration with Humata Health. <strong>Crimson AI</strong> — predictive analytics for operating room scheduling. <strong>nH Predict</strong> — the NaviHealth-developed (Optum-owned) algorithmic tool central to Lokken v. UnitedHealth Group, Inc., UnitedHealthcare, Inc., NaviHealth, Inc. (Case No. 0:23-cv-03514, U.S. Dist. Ct., D. Minn. 2023) and central to the Senate Permanent Subcommittee on Investigations report. Per the Lokken complaint, nH Predict has a 90% error rate based on lack of human review and over 80% of prior authorization denials reversed on appeal. <strong>Machine Assisted Prior Authorization</strong> — UnitedHealthcare committee approved the system in April 2021 per the Senate report; testing showed 6–10 minute review time reductions per case. <strong>HCE Auto Authorization Model</strong> — internal disclosure documents revealed it "produced faster handle times for cases" with an increase in denied cases.</p>

<p><strong>Named partners (14/15).</strong> Allina Health (Optum Real testing partner, processed 5,000+ visits in initial deployment); Humata Health (Digital Auth Complete collaboration); naviHealth (Optum subsidiary, originator of nH Predict); per <a href="https://www.beckershospitalreview.com/healthcare-information-technology/optum-rolls-out-ai-powered-prior-authorization-tools-for-payers-providers/" target="_blank" rel="noopener noreferrer">Becker''s Hospital Review reporting</a>, the company''s announcement of the discontinued naviHealth name in October 2024 amid congressional scrutiny.</p>

<p><strong>Named executives (13/15).</strong> Sandeep Dadlani — Optum Insight CEO, quoted in Modern Healthcare and Bloomberg coverage. Puneet Maheshwari — General Manager of Optum Real, quoted at HLTH 2025: "The provider doesn''t have to guess. They can ask the payer in real time." Dr. Patrick Conway — Optum Health CEO. Dr. Kontor — quoted in Becker''s February 2026 coverage on InterQual Auth Accelerator: "We do not and will not automate denials. This is only accelerating reviews and automating approvals." Dave Ingham — Allina Health Chief Digital and Information Officer (provider partner perspective).</p>

<p><strong>Peer-reviewed publication (11/15).</strong> Multiple peer-reviewed analyses of nH Predict and UnitedHealth''s algorithm use in <a href="https://www.nature.com/articles/s41746-026-02387-x" target="_blank" rel="noopener noreferrer">Nature''s npj Digital Medicine</a> (February 2026) and Senate-cited academic work. UnitedHealth itself publishes Optum-affiliated research; the algorithmic disclosure track is more litigation-driven than peer-reviewed.</p>

<p><strong>Regulatory disclosure (13/20).</strong> SEC 10-K and 10-Q AI disclosures since 2023; Senate Permanent Subcommittee on Investigations cooperation; CMS interim final rule January 2024 on predictive algorithms in MA coverage decisions; multiple state insurance commissioner filings. UnitedHealth''s regulatory disclosure depth is the highest of any insurer in the audit, but the depth includes material that reflects unfavorably on the company.</p>

<p><strong>Public governance (9/15).</strong> UnitedHealth has published AI principles documentation, but the documentation is less comprehensive than peer best-in-class examples (J&amp;J in pharma, Mayo in hospitals). The structural exposure: UnitedHealth''s AI governance disclosure is materially thinner than its AI use disclosure.</p>

<h3>2. Elevance Health — Composite 75</h3>

<p>Elevance Health (formerly Anthem) operates the second-most-disclosed health insurer AI program, anchored by named CEO communication and a governance posture explicitly framed as "moving at the speed of trust."</p>

<p><strong>Named AI use cases (16/20).</strong> Per <a href="https://www.healthcare-brew.com/stories/2024/01/10/how-elevance-health-is-using-generative-ai-to-try-to-simplify-healthcare" target="_blank" rel="noopener noreferrer">Healthcare-Brew''s January 2024 coverage</a> of CEO Gail Boudreaux''s keynote speech, Elevance uses generative AI to interpret health data and provide patients with personalized care recommendations. Per <a href="https://www.nature.com/articles/s41746-025-01700-4" target="_blank" rel="noopener noreferrer">Nature''s npj Digital Medicine governance analysis</a>, "Elevance Health (formerly Anthem) is developing its own generative AI tools to personalize member engagement and streamline claims processing." Concert Genetics partnership for genetic test prior authorization. AI-enabled interoperability for prior authorization workflow. Per <a href="https://www.hematologyadvisor.com/news/ai-prior-authorization-denials/" target="_blank" rel="noopener noreferrer">Hematology Advisor coverage of physician burden surveys</a>, 59% of physicians rated Anthem/Elevance as "high" or "extremely high" prior authorization burden.</p>

<p><strong>Named partners (11/15).</strong> Concert Genetics; Carelon Health (Elevance subsidiary operating utilization management); multiple AI vendors disclosed in SEC filings.</p>

<p><strong>Named executives (13/15).</strong> Gail Boudreaux — President and CEO of Elevance Health; quoted publicly: "We have to be responsible, we can''t get too excited that we move faster than the market — we have to move at the speed of trust." Pete Haytaian — President of Carelon. Anil Bhatt — Global CIO. The named-executive depth is meaningful and includes CEO-level commentary.</p>

<p><strong>Peer-reviewed publication (10/15).</strong> Elevance produces Carelon Research publications and contributes to peer-reviewed analyses of utilization management; AI-method-specific peer-reviewed publication is at industry-typical depth.</p>

<p><strong>Regulatory disclosure (14/20).</strong> Strong SEC 10-K AI disclosure; CMS compliance documentation; state insurance commissioner transparency. Elevance has not been the subject of major class-action litigation comparable to UnitedHealth, Humana, or Cigna — which means the regulatory disclosure track is voluntary rather than enforcement-driven.</p>

<p><strong>Public governance (11/15).</strong> Elevance''s published AI governance framework includes the "speed of trust" framing publicly articulated by the CEO. The governance disclosure is more developed than UnitedHealth''s despite operating at smaller scale.</p>

<h3>3. CVS Health / Aetna — Composite 73</h3>

<p>CVS Aetna''s AI disclosure is concentrated on the Post-Acute Analytics program documented in the Senate report and on broader Aetna utilization management AI deployment.</p>

<p><strong>Named AI use cases (16/20).</strong> <strong>Post-Acute Analytics</strong> — per the <a href="https://www.healthcaredive.com/news/medicare-advantage-AI-denials-cvs-humana-unitedhealthcare-senate-report/730383/" target="_blank" rel="noopener noreferrer">Senate Permanent Subcommittee on Investigations report</a>, CVS rolled out the project in 2021 to "harness AI to reduce money spent on skilled nursing facilities." Initial expectation was $10–15M savings in three years; subsequent projection raised to $77.3M three-year savings. The Senate report identified the program as a key driver of CVS''s MA prior authorization denial rate increases. Aetna utilization management AI; CVS HealthHub clinical AI; CVS prescription AI for medication adherence; Caremark formulary management AI (covered separately in PBM audit).</p>

<p><strong>Named partners (12/15).</strong> Multiple disclosed AI vendors; Salesforce CRM AI integration; Microsoft cloud partnership. The disclosure depth on partners is moderate.</p>

<p><strong>Named executives (12/15).</strong> David Joyner — President of Aetna (left November 2024). Karen Lynch — former CEO of CVS Health (left October 2024). Tilak Mandadi — Chief Experience and Technology Officer. Brian Newman — President of Pharmacy &amp; Consumer Wellness. The leadership transitions in late 2024 produced moderate continuity gaps in named-executive AI accountability.</p>

<p><strong>Peer-reviewed publication (10/15).</strong> CVS Health publishes substantial pharmacy and population health research; AI-method-specific peer-reviewed publication is at industry-typical depth.</p>

<p><strong>Regulatory disclosure (13/20).</strong> SEC 10-K AI disclosure; CMS compliance documentation; Senate cooperation. The Senate report''s specific identification of CVS''s $77.3M Post-Acute Analytics savings projection is the most quantified disclosure of any insurer in the audit.</p>

<p><strong>Public governance (10/15).</strong> CVS Health''s published AI governance framework is in development; the post-Brian-Thompson environment has accelerated published disclosure across the industry.</p>

<h3>4. Humana — Composite 71</h3>

<p>Humana''s AI disclosure pattern is shaped substantially by the ongoing class action and the August 2025 federal court ruling that the case may proceed.</p>

<p><strong>Named AI use cases (15/20).</strong> <strong>nH Predict</strong> — the same NaviHealth-developed (Optum-owned) algorithmic tool central to UnitedHealth''s exposure. Per <a href="https://www.axios.com/2023/12/13/humana-ai-lawsuit-deny-care-seniors-rehabilitation" target="_blank" rel="noopener noreferrer">Axios''s December 2023 reporting</a>, the lawsuit alleged Humana "deployed an algorithm in place of medical professionals'' judgment to wrongly deny elderly patients care owed to them under Medicare Advantage plans." Per the <a href="https://medicalmalpracticelawyers.com/lawsuit-accuses-humana-using-ai-illegally-deny-medical-services-elderly-patients/" target="_blank" rel="noopener noreferrer">Humana class action complaint as summarized by Medical Malpractice Lawyers</a>, Humana intentionally limits employee discretion to deviate from nH Predict by collaborating with naviHealth to "set targets to keep stays at post-acute care facilities within 1% of the days projected by the AI Model." Per <a href="https://www.mcknights.com/news/humana-must-face-class-action-suit-over-use-of-ai-in-denying-post-acute-care/" target="_blank" rel="noopener noreferrer">McKnight''s Long-Term Care News August 2025 coverage</a>, Judge Rebecca Grady Jennings of the U.S. District Court for the Western District of Kentucky ruled that the case may proceed without exhausting Medicare administrative appeals. <strong>Long-term acute care prior authorization</strong> — Senate report identified 54% denial rate increase between 2020 and 2022 alongside training sessions on "how to justify denials when speaking to providers." <strong>Augmented intelligence framing</strong> — Humana''s preferred terminology, with <a href="https://www.techtarget.com/healthcarepayers/news/366603282/Lawsuit-Alleges-Humana-Used-AI-to-Deny-Medically-Necessary-Claims" target="_blank" rel="noopener noreferrer">Humana''s spokesperson on record</a>: "At Humana, we use various tools, including augmented intelligence, to expedite and approve utilization management requests and ensure that patients receive high-quality, safe and efficient care."</p>

<p><strong>Named partners (12/15).</strong> naviHealth (Optum subsidiary, despite Optum''s October 2024 announcement to discontinue the naviHealth name); Cotiviti; Microsoft cloud partnership.</p>

<p><strong>Named executives (12/15).</strong> Bruce Broussard — former CEO (left 2024). Jim Rechtin — current CEO (since 2024). Teresa Boysen — Senior Vice President of Strategy. The leadership transition produced continuity gaps comparable to CVS.</p>

<p><strong>Peer-reviewed publication (9/15).</strong> Humana publishes population health research; AI-method-specific peer-reviewed publication is more limited than UnitedHealth or Elevance.</p>

<p><strong>Regulatory disclosure (13/20).</strong> SEC 10-K AI disclosure; CMS compliance documentation; substantial litigation discovery in the ongoing class action.</p>

<p><strong>Public governance (10/15).</strong> Humana''s published AI governance framework emphasizes the "augmented intelligence" framing; the framing is well-articulated but the document depth trails Elevance.</p>

<h3>5. Oscar Health — Composite 69</h3>

<p>Oscar''s AI disclosure pattern is anchored by the company''s tech-first founding identity and named CEO communication.</p>

<p><strong>Named AI use cases (14/20).</strong> Oscar GPT — disclosed internal generative AI deployment (2023–2024); +Oscar provider-engagement AI; member-engagement AI for benefits navigation; AI-enabled care management. Oscar discloses substantially less in absolute volume than the Big Three, but the company''s tech-first identity means the disclosure is comparatively comprehensive against the company''s smaller scale.</p>

<p><strong>Named partners (11/15).</strong> OpenAI (Oscar GPT); Microsoft cloud partnership; multiple AI vendor partnerships.</p>

<p><strong>Named executives (13/15).</strong> Mark Bertolini — CEO since 2023, formerly Aetna CEO. Sid Sankaran — former CEO. Mario Schlosser — co-founder, former CEO. Alessa Quane — Chief Insurance Officer. Oscar''s named-executive AI commentary is meaningful given Bertolini''s prior Aetna leadership.</p>

<p><strong>Peer-reviewed publication (8/15).</strong> Oscar publishes less peer-reviewed research than the Big Three; the company''s smaller scale produces a thinner research footprint.</p>

<p><strong>Regulatory disclosure (12/20).</strong> SEC 10-K AI disclosure; ACA marketplace compliance; CMS reporting. Oscar''s regulatory exposure is materially smaller than the Big Three''s.</p>

<p><strong>Public governance (11/15).</strong> Oscar''s published AI governance framework is well-articulated for the company''s scale; the proportional depth is competitive with Elevance.</p>

<h3>6. Cigna — Composite 62</h3>

<p>Cigna''s disclosure pattern is the most contested in the audit. The company maintains that PxDx is not an AI system; the published trade press, federal court filings, and regulatory commentary maintain otherwise.</p>

<p><strong>Named AI use cases (13/20).</strong> PxDx (Procedure-to-Diagnosis) — per <a href="https://www.fiercehealthcare.com/payers/cigna-hit-august-another-lawsuit-over-claims-denials-through-pxdx" target="_blank" rel="noopener noreferrer">ProPublica''s investigation</a> and <a href="https://www.axios.com/2023/07/25/ai-lawsuits-health-cigna-algorithm-payment-denial" target="_blank" rel="noopener noreferrer">Axios''s coverage</a>, approximately 300,000 claims denied across two months in 2022 with average denial review time of 1.2 seconds. Per <a href="https://www.cbsnews.com/news/cigna-algorithm-patient-claims-lawsuit/" target="_blank" rel="noopener noreferrer">CBS News''s coverage</a>, one Cigna medical director (Cheryl Dopke) reportedly rejected 60,000 claims over a single month. Per Cigna''s published <a href="https://news.bloomberglaw.com/daily-labor-report/ai-algorithm-based-health-insurer-denials-pose-new-legal-threat" target="_blank" rel="noopener noreferrer">response in Bloomberg Law</a>, "PxDx does not use AI and is similar to software that other health insurers and the Centers for Medicare and Medicaid Services have used for years," and the program is only used for around 50 "low-cost tests and procedures." Cigna''s denial-of-AI-classification is itself a structural disclosure issue.</p>

<p><strong>Named partners (10/15).</strong> Multiple AI vendor partnerships; Express Scripts integration (covered separately in PBM audit); Evernorth Health Services AI deployment.</p>

<p><strong>Named executives (11/15).</strong> David Cordani — Chairman and CEO. Eric Palmer — President and Chief Operating Officer. Heather Cianfrocco — President of Express Scripts. Alan Muney — former pediatrician identified as designer of the PxDx system per <a href="https://caseguard.com/articles/cigna-hit-with-lawsuit-over-controversial-ai-technology-use/" target="_blank" rel="noopener noreferrer">Caseguard''s coverage</a>.</p>

<p><strong>Peer-reviewed publication (9/15).</strong> Evernorth Research Institute publications; AI-method-specific peer-reviewed publication is at industry-typical depth.</p>

<p><strong>Regulatory disclosure (13/20).</strong> California Department of Insurance investigation; House Energy and Commerce Committee letter from Chair Cathy McMorris Rodgers (May 2023); class actions in California and other jurisdictions; SEC 10-K disclosure.</p>

<p><strong>Public governance (6/15).</strong> Cigna''s published AI governance framework is the thinnest of any major insurer in the audit. The structural cause is the contested PxDx classification — Cigna cannot publish a comprehensive AI governance framework without addressing PxDx, and addressing PxDx requires either the AI classification (which Cigna denies) or a separate non-AI utilization management framework. The disclosure gap is operationally significant.</p>

<h3>7. Centene — Composite 55 — Disclosure Risk</h3>

<p>Centene operates one of the largest Medicaid managed care portfolios in the United States. The disclosure depth is materially thinner than Big Three peers.</p>

<p><strong>Named AI use cases (11/20).</strong> Centene discloses general AI use in utilization management and member engagement but does not disclose specific named systems comparable to Optum Real, PxDx, nH Predict, or Elevance''s generative AI deployment. The structural cause: Medicaid managed care produces less mainstream-press coverage than commercial or MA, and Centene has not invested in public-facing AI disclosure to compensate.</p>

<p><strong>Named partners (9/15).</strong> Multiple AI vendor partnerships disclosed at industry-typical depth.</p>

<p><strong>Named executives (10/15).</strong> Sarah London — CEO. Drew Asher — CFO. Jim Murray — COO.</p>

<p><strong>Peer-reviewed publication (7/15).</strong> Limited peer-reviewed AI publication.</p>

<p><strong>Regulatory disclosure (11/20).</strong> State Medicaid filings; CMS reporting; SEC 10-K. Centene''s regulatory disclosure depth is operationally typical for Medicaid managed care but materially thinner than commercial-MA combined peers.</p>

<p><strong>Public governance (7/15).</strong> Centene''s published AI governance framework is in development.</p>

<p>The Centene Disclosure Risk tag is structural. As state Medicaid agencies increase regulatory scrutiny of AI use in eligibility and adjudication, Centene''s disclosure gap becomes operationally exposed.</p>

<h3>8. Molina Healthcare — Composite 48 — Disclosure Risk</h3>

<p>Molina operates substantial Medicaid managed care, Marketplace, and dual-eligible portfolios. The disclosure pattern is the thinnest in the audit.</p>

<p><strong>Named AI use cases (9/20).</strong> Limited public disclosure of named AI systems. Molina''s AI use is documented in regulatory filings but not in proactive corporate disclosure.</p>

<p><strong>Named partners (8/15).</strong> Limited disclosed AI vendor partnerships.</p>

<p><strong>Named executives (9/15).</strong> Joseph Zubretsky — CEO until 2024. Joe Ferro — current CFO. Mark Keim — current CEO. Like Centene, Molina''s leadership transitions produced continuity gaps.</p>

<p><strong>Peer-reviewed publication (6/15).</strong> Minimal peer-reviewed AI publication.</p>

<p><strong>Regulatory disclosure (10/20).</strong> State Medicaid filings; CMS reporting; SEC 10-K. The depth is at-or-below the audit floor.</p>

<p><strong>Public governance (6/15).</strong> Molina''s published AI governance framework is the thinnest in the audit.</p>

<p>The Molina score reflects structural disclosure pattern, not necessarily program scale. Molina operates AI at substantial scale but publishes at minimum-required depth. The implication: as state Medicaid regulators increase scrutiny of AI in benefits adjudication, Molina is positioned with the thinnest defensible record of any major payer.</p>

<h2>Cross-insurer patterns</h2>

<p><strong>Pattern 1: Disclosure depth and litigation exposure are correlated, not inversely correlated.</strong> UnitedHealth, Humana, and Cigna — the three insurers with the deepest AI disclosure — also face the most class-action exposure. The pattern reflects that disclosure produces both regulatory legibility and class-action leverage. The structural implication: insurers cannot reduce class-action exposure by reducing disclosure. The October 2024 Senate report and the August 2025 Humana class-action ruling demonstrate that regulatory and judicial bodies can produce disclosure independent of voluntary corporate communication.</p>

<p><strong>Pattern 2: The "augmented intelligence" framing is now the industry-preferred terminology.</strong> UnitedHealth, Humana, and (with caveats) Cigna position AI use as "augmented" rather than "automated," with human-in-the-loop framing. Per Humana''s spokesperson statement: "we use various tools, including augmented intelligence, to expedite and approve utilization management requests." The framing is operationally significant for legal defense but does not address the algorithmic-decision-making concerns raised in the Lokken complaint and the Senate report.</p>

<p><strong>Pattern 3: The 0.2% appeal rate is the structural data point that drives the litigation.</strong> Per the Lokken complaint and the Humana class action: "only a tiny minority of policyholders (roughly 0.2%) will appeal denied claims." Both lawsuits argue that the low appeal rate is itself the operational logic of using AI for mass denial — high error rates are tolerable because most denials are not appealed. The 0.2% figure is the most-cited single data point in the litigation environment.</p>

<p><strong>Pattern 4: The CMS January 2024 interim final rule is the regulatory inflection point.</strong> Per <a href="https://www.healthcaredive.com/news/medicare-advantage-AI-denials-cvs-humana-unitedhealthcare-senate-report/730383/" target="_blank" rel="noopener noreferrer">Healthcare Dive''s coverage</a>, federal rules began restricting predictive algorithm use in MA coverage decisions in January 2024. The rule reshaped the disclosure environment — insurers can no longer claim algorithm-only adjudication is permissible under MA. The compliance posture each insurer has adopted differs measurably and is itself a disclosure variable.</p>

<p><strong>Pattern 5: HealthPartners'' decision matters.</strong> Per <a href="https://www.nature.com/articles/s41746-025-01700-4" target="_blank" rel="noopener noreferrer">Nature''s npj Digital Medicine analysis</a>, Minnesota''s HealthPartners announced in 2024 that it would no longer accept UnitedHealthcare MA plans starting 2025 due to denial rates 10 times higher than other insurers. The parties subsequently worked out a deal, but the public threat to leave the network is now a competitive variable for insurers.</p>

<p><strong>Pattern 6: The post-Brian Thompson environment changed disclosure expectations.</strong> The December 2024 event reshaped trade-press willingness to investigate insurer AI use and reshaped regulator willingness to enforce. Insurers that proactively disclose are positioned to defend; insurers that wait for enforcement disclosure are positioned with thinner records.</p>

<h2>The everything-pr Health Insurer AI Disclosure Standard</h2>

<p>Five elements every health insurer should implement within 90 days.</p>

<ol>
  <li><strong>Publish a named AI use case catalog with system names and clinical functions.</strong> UnitedHealth''s Optum Real, InterQual Auth Accelerator, Digital Auth Complete naming convention is the industry-leading structural example. Insurers without named systems get described in passive voice in trade press and AI-engine answers.</li>
  <li><strong>Publish quantified disclosure on prior authorization workflows.</strong> Approval rates by service category, denial rates by service category, appeal-overturn rates, AI-assisted-vs-human-only review breakdowns. The Senate report''s quantified disclosure of UnitedHealth''s denial rate movement (8.7% to 22.7% on post-acute) is the model — voluntary disclosure of comparable data positions insurers ahead of forced disclosure.</li>
  <li><strong>Name the accountable AI executive with permanent web presence.</strong> Sandeep Dadlani (UnitedHealth Optum Insight), Gail Boudreaux (Elevance, CEO-level), Mark Bertolini (Oscar) — named executives positioned for trade press engagement.</li>
  <li><strong>Publish AI-in-claims peer-reviewed analysis through Carelon, Evernorth, Optum Labs, or equivalent research arms.</strong> Insurers with operational research arms can produce peer-reviewed analyses that complement litigation discovery. The Nature npj Digital Medicine February 2026 analysis is the model.</li>
  <li><strong>Publish a comprehensive AI governance framework with human-in-the-loop documentation.</strong> Elevance''s "speed of trust" framing is the strongest CEO-level positioning among insurers; the document depth backing the framing requires investment.</li>
</ol>

<p>The five elements are operational, not aspirational. Every insurer in this audit can implement them within 90 days. The post-Senate-report, post-Brian-Thompson, post-Humana-ruling environment makes voluntary disclosure now structurally cheaper than enforcement disclosure.</p>

<h2>Methodology footer</h2>

<p>The six signals are: named AI use cases publicly disclosed (20 points); named AI partners with deal terms publicly disclosed (15 points); named accountable executives publicly identified (15 points); peer-reviewed publication or regulatory filing depth (15 points); regulatory disclosure detail (20 points); public AI governance principles document (15 points). Composite below 60 triggers Disclosure Risk tagging; composite below 45 triggers Critical Disclosure Risk.</p>

<p>Data pulled from public sources: U.S. Senate Permanent Subcommittee on Investigations October 17, 2024 majority staff report; federal court filings (Lokken v. UnitedHealth Group, Inc.; Humana class action ruling Western District of Kentucky August 2025; Cigna class actions); SEC filings; corporate press releases; Nature''s npj Digital Medicine peer-reviewed analysis; trade press coverage from Fierce Healthcare, Healthcare Dive, Modern Healthcare, ProPublica, Axios, Bloomberg Law, CBS News, Becker''s Hospital Review, McKnight''s Long-Term Care News, TechTarget, and Healthcare-Brew. No paid databases used. Any researcher can reproduce the score.</p>',
  '[]'::jsonb,
  '/pillars/healthcare-pr.png',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  byline = EXCLUDED.byline,
  body_html = EXCLUDED.body_html,
  faq = EXCLUDED.faq,
  hero_image_url = EXCLUDED.hero_image_url,
  published = true,
  updated_at = now();