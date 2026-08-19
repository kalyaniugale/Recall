import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    // ==================================================
    // OWNER
    // ==================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

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
      extractedText: {
        type: String,
        default: "",
      },

      visualDescription: {
        type: String,
        default: "",
      },

      title: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },

      topics: {
        type: [String],
        default: [],
      },

      recallIntents: {
        type: [String],
        default: [],
      },

      importantText: {
        type: [String],
        default: [],
      },

      transcript: {
        type: String,
        default: "",
      },

      tags: {
        type: [String],
        default: [],
      },
    },

    // ==================================================
    // REEL DATA
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
    // PROCESSING
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


// Most common query:
// "give me this user's newest memories"

memorySchema.index({
  userId: 1,
  createdAt: -1,
});


const Memory = mongoose.model(
  "Memory",
  memorySchema
);

export default Memory;