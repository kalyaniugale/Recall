import cloudinary from "../../config/cloudinary.js";

import Memory from "./memory.model.js";


// ======================================================
// SCREENSHOT SERVICES
// ======================================================

import {
  extractTextFromImage,
} from "../../services/ocr/ocr.service.js";

import {
  describeScreenshot,
} from "../../services/vision/vision.service.js";


// ======================================================
// EMBEDDING + VECTOR SERVICES
// ======================================================

import {
  generateEmbedding,
} from "../../services/embedding/embedding.service.js";

import {
  indexMemory,
  deleteMemoryVector,
} from "../../services/vector/vector.service.js";


// ======================================================
// REEL SERVICES
// ======================================================

import {
  resolveInstagramReel,
} from "../../services/reel/instagram-reel.service.js";

import {
  downloadReel,
  cleanupReelWorkspace,
} from "../../services/reel/reel-download.service.js";

import {
  extractReelAudio,
  extractReelFrames,
} from "../../services/reel/reel-media.service.js";

import {
  transcribeReelAudio,
} from "../../services/reel/reel-transcript.service.js";

import {
  analyzeReelFrames,
} from "../../services/reel/reel-vision.service.js";

import {
  understandReel,
} from "../../services/reel/reel-understanding.service.js";


// ======================================================
// CLOUDINARY HELPER
// ======================================================

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
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


// ======================================================
// CREATE SCREENSHOT MEMORY
// ======================================================

export const createScreenshotMemory = async (
  file
) => {

  // --------------------------------------------------
  // 1. Upload screenshot
  // --------------------------------------------------

  console.log("Uploading image...");

  const uploadResult =
    await uploadBufferToCloudinary(
      file.buffer
    );

  console.log("Image uploaded");


  // --------------------------------------------------
  // 2. OCR
  // --------------------------------------------------

  console.log("Starting OCR...");

  const extractedText =
    await extractTextFromImage(
      uploadResult.secure_url
    );

  console.log("OCR completed");


  // --------------------------------------------------
  // 3. Vision understanding
  // --------------------------------------------------

  console.log(
    "Starting vision analysis..."
  );

  const understanding =
    await describeScreenshot(
      file.buffer,
      file.mimetype,
      extractedText
    );

  console.log(
    "Vision analysis completed"
  );

  console.log(
    "Screenshot understanding:",
    understanding
  );


  // --------------------------------------------------
  // 4. Searchable representation
  // --------------------------------------------------

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


  // --------------------------------------------------
  // 5. Embedding
  // --------------------------------------------------

  console.log(
    "Generating embedding..."
  );

  const embedding =
    await generateEmbedding(
      searchableText
    );

  console.log(
    "Embedding generated:",
    embedding.length,
    "dimensions"
  );


  // --------------------------------------------------
  // 6. MongoDB
  // --------------------------------------------------

  console.log(
    "Saving memory to MongoDB..."
  );

  const memory =
    await Memory.create({
      type: "screenshot",

      asset: {
        url:
          uploadResult.secure_url,

        publicId:
          uploadResult.public_id,

        mimeType:
          file.mimetype,

        size:
          file.size,
      },

      content: {
        extractedText,

        title:
          understanding.title || "",

        visualDescription:
          understanding.visualDescription ||
          "",

        summary:
          understanding.summary || "",

        topics:
          understanding.topics || [],

        recallIntents:
          understanding.recallIntents ||
          [],

        importantText:
          understanding.importantText ||
          [],
      },

      processing: {
        status: "READY",
      },
    });


  console.log(
    "Memory saved:",
    memory._id.toString()
  );


  // --------------------------------------------------
  // 7. Chroma
  // --------------------------------------------------

  console.log(
    "Indexing memory in Chroma..."
  );

  await indexMemory({
    memoryId:
      memory._id.toString(),

    embedding,

    document:
      searchableText,

    type:
      memory.type,
  });


  console.log(
    "Memory indexed in Chroma"
  );


  return memory;
};


// ======================================================
// CREATE REEL MEMORY
// ======================================================

export const createReelMemory = async (
  url
) => {

  let workspace = null;

  try {

    console.log(
      "\n=============================="
    );

    console.log(
      "STARTING REEL PIPELINE"
    );

    console.log(
      "=============================="
    );


    // --------------------------------------------------
    // 1. Resolve Instagram metadata
    // --------------------------------------------------

    console.log(
      "\nSTEP 1: Resolving Reel metadata..."
    );

    const metadata =
      await resolveInstagramReel(url);


    console.log(
      "Reel metadata resolved"
    );

    console.log({
      shortcode:
        metadata.shortcode,

      username:
        metadata.username,

      caption:
        metadata.caption,

      duration:
        metadata.duration,
    });


    // --------------------------------------------------
    // 2. Download Reel
    // --------------------------------------------------

    console.log(
      "\nSTEP 2: Downloading Reel..."
    );

    const downloadResult =
      await downloadReel(
        metadata.originalUrl || url
      );


    workspace =
      downloadResult.workspace;

    const videoPath =
      downloadResult.videoPath;


    console.log(
      "Reel downloaded"
    );


    // --------------------------------------------------
    // 3. Extract audio
    // --------------------------------------------------

    console.log(
      "\nSTEP 3: Extracting audio..."
    );

    const audioPath =
      await extractReelAudio({
        videoPath,
        workspace,
      });


    console.log(
      "Audio extracted"
    );


    // --------------------------------------------------
    // 4. Extract frames
    // --------------------------------------------------

    console.log(
      "\nSTEP 4: Extracting frames..."
    );

    const framePaths =
      await extractReelFrames({
        videoPath,
        workspace,
      });


    console.log(
      `${framePaths.length} frames extracted`
    );


    // --------------------------------------------------
    // 5. Audio + visual understanding
    // --------------------------------------------------

    console.log(
      "\nSTEP 5: Analyzing Reel..."
    );


    const [
      transcription,
      visualAnalysis,
    ] = await Promise.all([

      transcribeReelAudio(
        audioPath
      ),

      analyzeReelFrames(
        framePaths
      ),

    ]);


    console.log(
      "Transcript completed"
    );

    console.log(
      "Detected language:",
      transcription.language
    );


    console.log(
      "Visual analysis completed"
    );


    // --------------------------------------------------
    // 6. Final semantic understanding
    // --------------------------------------------------

    console.log(
      "\nSTEP 6: Building Reel understanding..."
    );


    const understanding =
      await understandReel({
        metadata,
        transcription,
        visualAnalysis,
      });


    console.log(
      "Reel understanding completed"
    );


    console.log(
      understanding
    );


    // --------------------------------------------------
    // 7. Build searchable representation
    // --------------------------------------------------

    console.log(
      "\nSTEP 7: Building searchable text..."
    );


    const onScreenText =
      Array.isArray(
        visualAnalysis.onScreenText
      )
        ? visualAnalysis.onScreenText
        : [];


    const searchableText = `
Title:
${understanding.title || ""}

Summary:
${understanding.summary || ""}

Topics:
${(understanding.topics || []).join(", ")}

Possible Recall Intents:
${(understanding.recallIntents || []).join("\n")}

Important Terms:
${(understanding.importantText || []).join(", ")}

Creator:
${metadata.username || ""}

Instagram Caption:
${metadata.caption || ""}

Visual Description:
${visualAnalysis.visualDescription || ""}

On-Screen Text:
${onScreenText.join("\n")}

Spoken Transcript:
${transcription.transcript || ""}
    `.trim();


    console.log(
      "Searchable representation created"
    );


    // --------------------------------------------------
    // 8. Generate embedding
    // --------------------------------------------------

    console.log(
      "\nSTEP 8: Generating embedding..."
    );


    const embedding =
      await generateEmbedding(
        searchableText
      );


    console.log(
      "Embedding generated:",
      embedding.length,
      "dimensions"
    );


// --------------------------------------------------
// 9. Save MongoDB memory
// --------------------------------------------------

console.log(
  "\nSTEP 9: Saving Reel to MongoDB..."
);

const memory = await Memory.create({
  type: "reel",

  // Original Instagram URL
  originalUrl:
    metadata.originalUrl || url,

  // IMPORTANT:
  // We don't permanently store the downloaded Reel.
  // reel.mp4/audio/frames are temporary.
  //
  // Therefore asset remains empty for Reel memories.
  asset: {
    url: "",
    publicId: "",
    mimeType: "",
    size: null,
  },

  content: {
    // Text detected from Reel frames
    extractedText:
      onScreenText.join("\n"),

    // Gemini visual understanding
    visualDescription:
      visualAnalysis.visualDescription || "",

    title:
      understanding.title || "",

    summary:
      understanding.summary || "",

    topics:
      understanding.topics || [],

    recallIntents:
      understanding.recallIntents || [],

    importantText:
      understanding.importantText || [],

    // Whisper transcription
    transcript:
      transcription.transcript || "",

    tags: [],
  },

  // Reel-specific metadata
  reel: {
    platform:
      metadata.platform || "instagram",

    shortcode:
      metadata.shortcode || "",

    username:
      metadata.username || "",

    caption:
      metadata.caption || "",

    // External Instagram thumbnail
    thumbnailUrl:
      metadata.thumbnailUrl || "",

    duration:
      metadata.duration ?? null,

    language:
      transcription.language || "",

    languageProbability:
      transcription.languageProbability ??
      null,
  },

  processing: {
    status: "READY",
    error: null,
  },
});

console.log(
  "Reel saved:",
  memory._id.toString()
);

    // --------------------------------------------------
    // 10. Chroma
    // --------------------------------------------------

    console.log(
      "\nSTEP 10: Indexing Reel in Chroma..."
    );


    try {

      await indexMemory({

        memoryId:
          memory._id.toString(),

        embedding,

        document:
          searchableText,

        type:
          memory.type,

      });

    } catch (error) {

      // Mongo was created but vector indexing failed.
      // Remove Mongo document so databases remain
      // consistent.

      await Memory.findByIdAndDelete(
        memory._id
      );

      throw error;
    }


    console.log(
      "Reel indexed in Chroma"
    );


    console.log(
      "\n=============================="
    );

    console.log(
      "REEL PIPELINE COMPLETE ✓"
    );

    console.log(
      "=============================="
    );


    return memory;

  } catch (error) {

    console.error(
      "\nReel processing failed:",
      error
    );

    throw error;

  } finally {

    // --------------------------------------------------
    // 11. Clean temporary files
    // --------------------------------------------------

    if (workspace) {

      console.log(
        "\nCleaning Reel workspace..."
      );

      try {

        await cleanupReelWorkspace(
          workspace
        );

        console.log(
          "Temporary files removed"
        );

      } catch (cleanupError) {

        console.error(
          "Workspace cleanup failed:",
          cleanupError
        );

      }
    }
  }
};


// ======================================================
// GET MEMORIES
// ======================================================

export const getMemories = async () => {

  const memories =
    await Memory.find()
      .sort({
        createdAt: -1,
      });

  return memories;
};


// ======================================================
// DELETE MEMORY
// ======================================================

export const deleteMemory = async (
  memoryId
) => {

  // --------------------------------------------------
  // 1. Find memory
  // --------------------------------------------------

  const memory =
    await Memory.findById(
      memoryId
    );


  if (!memory) {

    throw new Error(
      "Memory not found"
    );

  }


  // --------------------------------------------------
  // 2. Delete Cloudinary asset if Recall owns it
  // --------------------------------------------------

  if (memory.asset?.publicId) {

    console.log(
      "Deleting Cloudinary asset..."
    );


    await cloudinary.uploader.destroy(
      memory.asset.publicId
    );

  }


  // --------------------------------------------------
  // 3. Delete Chroma vector
  // --------------------------------------------------

  console.log(
    "Deleting Chroma vector..."
  );


  await deleteMemoryVector(
    memory._id.toString()
  );


  // --------------------------------------------------
  // 4. Delete Mongo document
  // --------------------------------------------------

  console.log(
    "Deleting MongoDB memory..."
  );


  await Memory.findByIdAndDelete(
    memoryId
  );


  console.log(
    "Memory deleted successfully"
  );


  return memory;
};