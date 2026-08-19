import { createWorker } from "tesseract.js";

export const extractTextFromImage = async (imageUrl) => {
  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(imageUrl);

    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
};