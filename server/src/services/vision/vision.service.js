import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const describeScreenshot = async (
  imageBuffer,
  mimeType,
  extractedText
) => {
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
You are analyzing a screenshot for a personal memory retrieval system called Recall.

The goal is not only to describe the screenshot, but to create useful semantic information so the user can find it later using vague natural-language searches.

OCR has already extracted the following text:

--- OCR TEXT ---
${extractedText}
--- END OCR TEXT ---

Analyze BOTH:
1. The screenshot itself
2. The OCR text

Return ONLY valid JSON with exactly this structure:

{
  "title": "short descriptive title",

  "visualDescription": "1-3 sentence description of what is visibly shown in the screenshot",

  "summary": "concise semantic summary explaining what this content is mainly about and why it may be useful",

  "topics": [
    "important topic",
    "related concept"
  ],

  "recallIntents": [
    "natural phrase a user might type when trying to find this memory later"
  ],

  "importantText": [
    "important exact names, technologies, places, concepts or terms"
  ]
}

Guidelines:

- Do not simply repeat the OCR.
- Use the image to understand context that OCR may miss.
- Correct obvious OCR noise when understanding the content.
- Do not invent information unrelated to the screenshot.

For "topics":
- Include the main topic and closely related semantic concepts.
- Include broader concepts when genuinely relevant.
- Prefer useful search concepts over insignificant visible words.

For "recallIntents":
- Generate 4 to 6 realistic natural-language search phrases.
- Think about how someone may vaguely remember this screenshot later.
- Include both specific and broader ways of recalling it.
- Do not copy the same phrase repeatedly with minor wording changes.

For "importantText":
- Preserve important exact entities and terminology.
- Examples include technology names, places, tools, concepts, products, people, commands, error names, etc.

Keep every field concise.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,

    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],

    config: {
      responseMimeType: "application/json",
    },
  });

  const result = JSON.parse(response.text);

  return result;
};