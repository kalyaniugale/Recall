import fs from "fs/promises";

import {
  GoogleGenAI,
} from "@google/genai";


const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });


export const analyzeReelFrames =
  async (framePaths) => {

    if (!framePaths?.length) {

      return {
        visualDescription: "",
        onScreenText: [],
        visualTopics: [],
      };
    }


    console.log(
      `Analyzing ${framePaths.length} Reel frames...`
    );


    const imageParts = [];


    for (
      const framePath
      of framePaths
    ) {

      const buffer =
        await fs.readFile(
          framePath
        );


      imageParts.push({
        inlineData: {
          mimeType:
            "image/jpeg",

          data:
            buffer.toString(
              "base64"
            ),
        },
      });
    }


    const prompt = `
You are analyzing chronological frames sampled from
one short-form social media video for a personal
semantic memory search system called Recall.

Analyze ALL frames together.

Determine:
1. What the video is mainly about.
2. Important concepts shown visually.
3. Important text appearing on screen.
4. Technologies, algorithms, products, locations,
   topics, or other meaningful entities visible.
5. Information useful for retrieving this video later
   through natural-language search.

Do not describe every frame separately.
Do not invent information.

Return ONLY valid JSON:

{
  "visualDescription": "concise description",
  "onScreenText": [
    "important text"
  ],
  "visualTopics": [
    "important topic"
  ]
}
`;


    const response =
      await ai.models.generateContent({
        model:
          process.env.GEMINI_MODEL,

        contents: [
          {
            role: "user",

            parts: [
              ...imageParts,

              {
                text: prompt,
              },
            ],
          },
        ],
      });


    let text =
      response.text.trim();


    text = text
      .replace(
        /^```json\s*/i,
        ""
      )
      .replace(
        /^```\s*/i,
        ""
      )
      .replace(
        /```$/i,
        ""
      )
      .trim();


    try {

      const result =
        JSON.parse(text);


      return {

        visualDescription:
          result.visualDescription ||
          "",

        onScreenText:
          Array.isArray(
            result.onScreenText
          )
            ? result.onScreenText
            : [],

        visualTopics:
          Array.isArray(
            result.visualTopics
          )
            ? result.visualTopics
            : [],
      };


    } catch {

      console.error(
        "Invalid Gemini response:",
        text
      );

      throw new Error(
        "Could not parse Reel visual analysis"
      );
    }
  };