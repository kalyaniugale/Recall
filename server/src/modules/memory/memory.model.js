import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    // ==================================================
    // MEMORY TYPE
    // ==================================================

    type: {
      type: String,
      enum: [
        "screenshot",
        "reel",
        "photo",
        "physical",
      ],
      required: true,
      index: true,
    },

    // ==================================================
    // STORED ASSET
    // ==================================================
    // Files that Recall itself stores.
    //
    // Screenshot:
    // asset.url -> Cloudinary screenshot
    //
    // Reel:
    // currently we do NOT permanently store the video,
    // so these fields can remain empty.
    // ==================================================

    asset: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: null,
      },
    },

    // ==================================================
    // ORIGINAL SOURCE
    // ==================================================

    originalUrl: {
      type: String,
      default: "",
    },

    // ==================================================
    // COMMON SEARCHABLE CONTENT
    // ==================================================

    content: {
      // Exact OCR text from screenshots/images
      extractedText: {
        type: String,
        default: "",
      },

      // Visual understanding generated from image/frames
      visualDescription: {
        type: String,
        default: "",
      },

      // Human-readable generated title
      title: {
        type: String,
        default: "",
      },

      // Semantic summary
      summary: {
        type: String,
        default: "",
      },

      // Broad semantic concepts
      topics: {
        type: [String],
        default: [],
      },

      // Example natural-language searches
      recallIntents: {
        type: [String],
        default: [],
      },

      // Important exact terms/entities
      importantText: {
        type: [String],
        default: [],
      },

      // Spoken content from video/audio
      transcript: {
        type: String,
        default: "",
      },

      // Optional user/system tags
      tags: {
        type: [String],
        default: [],
      },
    },

    // ==================================================
    // REEL-SPECIFIC DATA
    // ==================================================

    reel: {
      platform: {
        type: String,
        default: "",
      },

      shortcode: {
        type: String,
        default: "",
      },

      username: {
        type: String,
        default: "",
      },

      caption: {
        type: String,
        default: "",
      },

      // External Instagram preview image
      thumbnailUrl: {
        type: String,
        default: "",
      },

      duration: {
        type: Number,
        default: null,
      },

      language: {
        type: String,
        default: "",
      },

      languageProbability: {
        type: Number,
        default: null,
      },
    },

    // ==================================================
    // PROCESSING STATE
    // ==================================================

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


// ==================================================
// INDEXES
// ==================================================

// Recent memories
memorySchema.index({
  createdAt: -1,
});

// Useful later when authentication is added.
// We can eventually add userId + indexes around it.


// ==================================================
// MODEL
// ==================================================

const Memory = mongoose.model(
  "Memory",
  memorySchema
);

export default Memory;