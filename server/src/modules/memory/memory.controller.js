import {
  createScreenshotMemory,
  createReelMemory,
  getMemories,
  deleteMemory,
} from "./memory.service.js";


// ==========================================
// UPLOAD SCREENSHOT
// ==========================================

export const uploadScreenshot = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Screenshot file is required",
      });
    }

    const memory =
      await createScreenshotMemory(
        req.file
      );

    return res.status(201).json({
      success: true,
      message: "Screenshot memory created",
      data: memory,
    });

  } catch (error) {
    console.error(
      "Screenshot upload failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create screenshot memory",
    });
  }
};


// ==========================================
// CREATE REEL MEMORY
// ==========================================

export const createReel = async (
  req,
  res
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Reel URL is required",
      });
    }

    const memory =
      await createReelMemory(url);

    return res.status(201).json({
      success: true,
      message: "Reel memory created",
      data: memory,
    });

  } catch (error) {
    console.error(
      "Reel creation failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create Reel memory",
    });
  }
};


// ==========================================
// GET ALL MEMORIES
// ==========================================

export const getAllMemories = async (
  req,
  res
) => {
  try {
    const memories =
      await getMemories();

    return res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });

  } catch (error) {
    console.error(
      "Failed to fetch memories:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch memories",
    });
  }
};


// ==========================================
// DELETE MEMORY
// ==========================================

export const removeMemory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const memory =
      await deleteMemory(id);

    return res.status(200).json({
      success: true,
      message: "Memory deleted",
      data: {
        id: memory._id,
      },
    });

  } catch (error) {
    console.error(
      "Memory deletion failed:",
      error
    );

    if (
      error.message === "Memory not found"
    ) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete memory",
    });
  }
};