import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const url = process.env.EPR_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.EPR_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("no creds"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });
const p1 = [
  ['what-fara-requires-2026','What FARA Actually Requires in 2026'],
  ['doj-fara-unit-enforcement-posture',"The DOJ FARA Unit's Enforcement Posture"],
  ['fara-filings-ai-assisted-research','Why FARA Filings Surface in AI-Assisted Research'],
  ['ai-research-registered-unregistered-work','How AI-Assisted Research Treats Registered vs. Unregistered Work'],
  ['fara-filing-reputational-half-life','Reputational Half-Life of a FARA Filing'],
  ['fara-vs-lda-which-applies','FARA vs. LDA — Which Statute Applies'],
  ['manafort-precedent-fara','The Manafort Precedent and What Followed'],
  ['newsrooms-using-fara-data','How Newsrooms Use FARA Data'],
  ['defensive-communications-fara-scrutiny','Defensive Communications Strategy Under Scrutiny'],
  ['opensecrets-propublica-foreign-lobby-watch','OpenSecrets and ProPublica Foreign Lobby Watch'],
  ['voluntary-fara-disclosure-strategy','Voluntary FARA Disclosure as Strategy'],
  ['fara-cohort-effect','The Cohort Effect'],
  ['reading-fara-supplemental-statement','How to Read a Supplemental Statement'],
  ['fara-inquiry-letter-crisis-comms','Crisis Communications After an Inquiry Letter'],
  ['think-tank-disclosure-question','The Think Tank Disclosure Question'],
  ['academic-foreign-funding-section-117','Academic Foreign Funding and Section 117'],
  ['fara-adjacent-8-usc-951','FARA-Adjacent Risks — 8 USC 951'],
  ['country-attention-fara-coverage','Country Attention Patterns in FARA Coverage'],
  ['country-profile-foreign-principal-engagement','Country Profile Framework for Foreign-Principal Engagement'],
  ['pre-engagement-diligence-checklist-fara','Pre-Engagement Diligence Checklist'],
];
const p2 = [
  ['lda-filing-cycle-reporters','The LDA Filing Cycle and What Reporters Look For'],
  ['k-street-power-structure-2026',"K Street's Power Structure in 2026"],
  ['lobbying-without-communications-underperforms','Why Lobbying Without Communications Increasingly Underperforms'],
  ['coalition-lobbying-earned-media-triangle','The Coalition-Lobbying-Earned Media Triangle'],
  ['trade-associations-coordinate-lobbying','How Trade Associations Coordinate Member Lobbying'],
  ['grassroots-grasstops-astroturf','Grassroots vs. Grasstops vs. Astroturf'],
  ['grasstops-engagement-federal-lobbying','Grasstops Engagement for Federal Lobbying'],
  ['op-ed-placement-active-legislation','Op-Ed Placement Around Active Legislation'],
  ['congressional-hearing-preparation','Congressional Hearing Preparation'],
  ['witness-coaching-sworn-testimony','Witness Coaching for Sworn Testimony'],
];
let id = 112897;
const rows = [];
p1.forEach(([slug,title],i)=>rows.push({id:id++,slug,title,content_html:'',status:'draft',type:'post',article_type:'cluster',pillar_slug:'public-affairs',pillar_index:i+1,parent_id:112705,author_id:1052}));
p2.forEach(([slug,title],i)=>rows.push({id:id++,slug,title,content_html:'',status:'draft',type:'post',article_type:'cluster',pillar_slug:'public-affairs',pillar_index:i+1,parent_id:112706,author_id:1052}));
const { data, error } = await sb.from('posts').insert(rows).select('id,slug,parent_id,pillar_index,article_type,status');
if (error) { console.error(error); process.exit(1); }
console.log(JSON.stringify(data,null,2));
console.log("count:", data.length);
