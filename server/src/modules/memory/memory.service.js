import cloudinary from "../../config/cloudinary.js";

import Memory from "./memory.model.js";

import {
  extractTextFromImage,
} from "../../services/ocr/ocr.service.js";

import {
  describeScreenshot,
} from "../../services/vision/vision.service.js";

import {
  generateEmbedding,
} from "../../services/embedding/embedding.service.js";

import {
  indexMemory,
  deleteMemoryVector,
} from "../../services/vector/vector.service.js";

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "recall/screenshots",
        resource_type: "image",
      },

      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};


export const createScreenshotMemory = async (file) => {

  // ------------------------------------------------
  // 1. Upload screenshot to Cloudinary
  // ------------------------------------------------

  console.log("Uploading image...");

  const uploadResult =
    await uploadBufferToCloudinary(
      file.buffer
    );

  console.log("Image uploaded");


  // ------------------------------------------------
  // 2. Extract exact text using OCR
  // ------------------------------------------------

  console.log("Starting OCR...");

  const extractedText =
    await extractTextFromImage(
      uploadResult.secure_url
    );

  console.log("OCR completed");


  // ------------------------------------------------
  // 3. Understand screenshot using Gemini
  // ------------------------------------------------

  console.log("Starting vision analysis...");

  const understanding =
    await describeScreenshot(
      file.buffer,
      file.mimetype,
      extractedText
    );

  console.log("Vision analysis completed");

  console.log(
    "Screenshot understanding:",
    understanding
  );


  // ------------------------------------------------
  // 4. Build optimized searchable representation
  // ------------------------------------------------

  const searchableText = `
Title:
${understanding.title || ""}

Summary:
${understanding.summary || ""}

Visual Description:
${understanding.visualDescription || ""}

Topics:
${(understanding.topics || []).join(", ")}

Possible Recall Intents:
${(understanding.recallIntents || []).join("\n")}

Important Terms:
${(understanding.importantText || []).join(", ")}

Original Extracted Text:
${extractedText}
  `.trim();


  console.log(
    "Searchable representation created"
  );


  // ------------------------------------------------
  // 5. Generate semantic embedding
  // ------------------------------------------------

  console.log("Generating embedding...");

  const embedding =
    await generateEmbedding(
      searchableText
    );

  console.log(
    "Embedding generated:",
    embedding.length,
    "dimensions"
  );


  // ------------------------------------------------
  // 6. Store actual Memory in MongoDB
  // ------------------------------------------------

  console.log(
    "Saving memory to MongoDB..."
  );

  const memory = await Memory.create({
    type: "screenshot",

    asset: {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      mimeType: file.mimetype,
      size: file.size,
    },

    content: {
      extractedText,

      title:
        understanding.title || "",

      visualDescription:
        understanding.visualDescription || "",

      summary:
        understanding.summary || "",

      topics:
        understanding.topics || [],

      recallIntents:
        understanding.recallIntents || [],

      importantText:
        understanding.importantText || [],
    },

    processing: {
      status: "READY",
    },
  });


  console.log(
    "Memory saved:",
    memory._id.toString()
  );


  // ------------------------------------------------
  // 7. Store embedding in ChromaDB
  // ------------------------------------------------

  console.log(
    "Indexing memory in Chroma..."
  );

  await indexMemory({
    memoryId: memory._id.toString(),
    embedding,
    document: searchableText,
    type: memory.type,
  });

  console.log(
    "Memory indexed in Chroma"
  );


  return memory;
};


export const getMemories = async () => {

  const memories =
    await Memory.find()
      .sort({
        createdAt: -1,
      });

  return memories;
};

export const deleteMemory = async (memoryId) => {
  // 1. Find memory first
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  // 2. Delete image from Cloudinary
  if (memory.asset?.publicId) {
    await cloudinary.uploader.destroy(
      memory.asset.publicId
    );
  }

  // 3. Delete vector from Chroma
  await deleteMemoryVector(
    memory._id.toString()
  );

  // 4. Delete MongoDB document LAST
  await Memory.findByIdAndDelete(memoryId);

  return memory;
};