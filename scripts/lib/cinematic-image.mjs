// Shared two-stage cinematic editorial image generator for Lovable AI Gateway.
// Stage 1: planner (gemini-3-flash-preview) → returns { visual_prompt, alt_text } via tool call.
// Stage 2: renderer (gemini-3.1-flash-image-preview / Nano Banana 2) → returns image bytes.

const PLANNER_MODEL = "google/gemini-3-flash-preview";
const RENDERER_MODEL = "google/gemini-3.1-flash-image-preview";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const SYSTEM_PROMPT = `You are an award-winning photo editor designing featured images for editorial PR/marketing articles. Your visuals are CINEMATIC and REALISTIC — like photography from The New York Times, WIRED, or The Atlantic. Read the article carefully and choose the SUBJECT that best fits its actual content — strongly prefer objects, products, places, environments, still life, architecture, textures, or documents over humans. Only include people when the article is genuinely about people or human activity. When people ARE appropriate: cast for diversity — vary gender (men, women, non-binary), ethnicity (Black, East Asian, South Asian, Latino, Middle Eastern, white, mixed), age, body type. NEVER default to a young white woman in an office. Vary the setting too — streets, homes, studios, factories, labs, outdoors, cafes, warehouses. Rotate color palettes (warm earth tones, cool blues, monochrome, high-contrast, pastel, jewel tones, muted neutrals). Use creative framing: macro detail, overhead flat lay, low angle, reflections, environmental shots, still-life arrangements, architectural geometry. Reject clichés: glowing brains, neural networks, blue circuit boards, generic robots, hands touching holograms, floating data orbs, businesspeople pointing at charts, the same stock 'woman smiling at laptop' shot.`;

const PLANNER_TOOL = {
  type: "function",
  function: {
    name: "plan_featured_image",
    description: "Plan the featured image for the article. Pick a SPECIFIC scene grounded in the article content.",
    parameters: {
      type: "object",
      properties: {
        visual_prompt: {
          type: "string",
          description: "Concrete, specific visual scene description. Include subject, camera/lens vibe, lighting, color palette, materials. No text, words, logos, watermarks, or UI in the image.",
        },
        alt_text: {
          type: "string",
          description: "Descriptive alt text, sentence-case, ~100-160 chars. No quotes around proper nouns. Should describe what's IN the image, useful for accessibility.",
        },
      },
      required: ["visual_prompt", "alt_text"],
      additionalProperties: false,
    },
  },
};

function strip(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

export async function planImage({ apiKey, title, focusKeyword, body, brandInstructions }) {
  const userPrompt = [
    `Article title: ${title}`,
    focusKeyword ? `Focus keyword: ${focusKeyword}` : null,
    brandInstructions ? `Brand & style: ${brandInstructions}` : null,
    `Article body (truncated):\n${strip(body).slice(0, 2400)}`,
    `\nPlan the featured image. Pick a SPECIFIC scene and moment grounded in the article. Specify camera/lens vibe, lighting, color palette, materials. No text, words, logos, watermarks, or UI in the image.`,
  ].filter(Boolean).join("\n\n");

  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: PLANNER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools: [PLANNER_TOOL],
      tool_choice: { type: "function", function: { name: "plan_featured_image" } },
    }),
  });
  if (!r.ok) throw new Error(`planner_${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const call = j?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error(`planner_no_tool_call: ${JSON.stringify(j).slice(0, 200)}`);
  const args = JSON.parse(call.function.arguments);
  if (!args.visual_prompt || !args.alt_text) throw new Error("planner_missing_fields");
  return args;
}

export async function renderImage({ apiKey, visualPrompt, brandInstructions }) {
  const positive = `Cinematic editorial photograph for a PR/marketing news article. ${visualPrompt}. Photorealistic, shot on 35mm or 50mm full-frame, natural directional lighting, true-to-life color, shallow depth of field where appropriate, magazine-quality finish (NYT / WIRED / National Geographic / Vogue). 16:9 widescreen, rule-of-thirds composition, balanced exposure, sharp focus, subtle film grain. Prefer non-human subjects when the article allows.${brandInstructions ? `\n\nPublication brand & style direction (must follow): ${brandInstructions}.` : ""}\n\nNegative prompt — do NOT include: any text, letters, words, captions, typography, watermarks, logos, signatures, UI elements, screenshots, charts; bad quality, blurry, oversaturated, plastic skin, deformed faces, malformed hands, extra limbs, extra fingers, generic stock-photo look, AI-art artifacts, cartoon, CGI, anime, glowing brains, neural networks, blue circuit boards, generic robots.`;

  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: RENDERER_MODEL,
      messages: [{ role: "user", content: positive }],
      modalities: ["image", "text"],
    }),
  });
  if (!r.ok) throw new Error(`renderer_${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const url = j?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url?.startsWith("data:")) throw new Error("renderer_no_image");
  const c = url.indexOf(",");
  const mime = url.slice(5, c).split(";")[0] || "image/png";
  return { mime, bytes: Buffer.from(url.slice(c + 1), "base64") };
}

export function extFromMime(mime) {
  return mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
}

export async function generateImageFor({ apiKey, title, focusKeyword, body, brandInstructions }) {
  const plan = await planImage({ apiKey, title, focusKeyword, body, brandInstructions });
  const img = await renderImage({ apiKey, visualPrompt: plan.visual_prompt, brandInstructions });
  return { ...img, visual_prompt: plan.visual_prompt, alt_text: plan.alt_text };
}
