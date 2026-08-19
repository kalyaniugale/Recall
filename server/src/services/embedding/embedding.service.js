import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required to generate an embedding");
  }

  const response = await ai.models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL,

    contents: text,

    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
};