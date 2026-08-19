import { createScreenshotMemory, getMemories, deleteMemory,} from "./memory.service.js";

export const uploadScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Screenshot is required",
      });
    }

    const memory = await createScreenshotMemory(req.file);

    return res.status(201).json({
      success: true,
      message: "Screenshot uploaded successfully",
      data: memory,
    });
  } catch (error) {
    console.error("Screenshot upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload screenshot",
    });
  }
};

export const fetchMemories = async (req, res) => {
  try {
    const memories = await getMemories();

    return res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });
  } catch (error) {
    console.error("Fetching memories failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch memories",
    });
  }
};

export const removeMemory = async (req, res) => {
  try {
    const { id } = req.params;

    const memory = await deleteMemory(id);

    return res.status(200).json({
      success: true,
      message: "Memory deleted successfully",
      data: {
        id: memory._id,
      },
    });

  } catch (error) {
    console.error(
      "Memory deletion failed:",
      error
    );

    if (error.message === "Memory not found") {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete memory",
    });
  }
};