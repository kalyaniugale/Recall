import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["screenshot", "reel", "photo", "physical"],
      required: true,
    },

    asset: {
      url: {
        type: String,
      },

      publicId: {
        type: String,
      },

      mimeType: {
        type: String,
      },

      size: {
        type: Number,
      },
    },

    originalUrl: {
      type: String,
    },

    content: {
      extractedText: {
        type: String,
        default: "",
      },

      // What is visually present in the screenshot
      visualDescription: {
        type: String,
        default: "",
      },

      // Short generated title for the memory
      title: {
        type: String,
        default: "",
      },

      // Semantic understanding of the memory
      summary: {
        type: String,
        default: "",
      },

      // Broader concepts useful for retrieval
      topics: {
        type: [String],
        default: [],
      },

      // Ways the user may naturally search for this later
      recallIntents: {
        type: [String],
        default: [],
      },

      // Important exact terms/entities
      importantText: {
        type: [String],
        default: [],
      },

      // Useful later for reels/videos
      transcript: {
        type: String,
        default: "",
      },

      tags: {
        type: [String],
        default: [],
      },
    },

    processing: {
      status: {
        type: String,
        enum: [
          "UPLOADED",
          "PROCESSING",
          "READY",
          "FAILED",
        ],
        default: "UPLOADED",
      },

      error: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Memory = mongoose.model(
  "Memory",
  memorySchema
);

export default Memory;