import {
  GoogleGenAI,
} from "@google/genai";


const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });


export const understandReel =
  async ({
    metadata,
    transcription,
    visualAnalysis,
  }) => {


    console.log(
      "Building final Reel understanding..."
    );


    const prompt = `
You are creating a semantic memory representation
for a personal memory search system called Recall.

The user saved an Instagram Reel.

Below is information extracted from the Reel.

INSTAGRAM CAPTION:
${metadata.caption || "Not available"}

CREATOR:
${metadata.username || "Unknown"}

SPOKEN TRANSCRIPT:
${transcription.transcript || "Not available"}

VISUAL DESCRIPTION:
${visualAnalysis.visualDescription || "Not available"}

ON-SCREEN TEXT:
${visualAnalysis.onScreenText.join(", ") || "Not available"}

VISUAL TOPICS:
${visualAnalysis.visualTopics.join(", ") || "Not available"}


The speech transcript may contain transcription errors,
especially English technical words spoken inside Hindi
or Hinglish speech.

Use the caption, visual information and context to infer
those terms correctly when there is strong evidence.

Create a clean semantic representation that will help
retrieve this Reel from future natural-language searches.

For example, a user may later search:
"What was that reel explaining API traffic control?"
or
"video about token bucket"
or
"system design reel I saved"

Do not invent unsupported information.

Return ONLY valid JSON:

{
  "title": "short descriptive title",

  "summary": "2-4 sentence semantic summary",

  "topics": [
    "topic"
  ],

  "recallIntents": [
    "natural language query someone might use later"
  ],

  "importantText": [
    "important keyword or concept"
  ]
}
`;


    const response =
      await ai.models.generateContent({
        model:
          process.env.GEMINI_MODEL,

        contents: prompt,
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


      console.log(
        "Final Reel understanding created"
      );


      return {

        title:
          result.title || "",

        summary:
          result.summary || "",

        topics:
          Array.isArray(
            result.topics
          )
            ? result.topics
            : [],

        recallIntents:
          Array.isArray(
            result.recallIntents
          )
            ? result.recallIntents
            : [],

        importantText:
          Array.isArray(
            result.importantText
          )
            ? result.importantText
            : [],
      };


    } catch {

      console.error(
        "Invalid understanding JSON:",
        text
      );

      throw new Error(
        "Could not parse final Reel understanding"
      );
    }
  };