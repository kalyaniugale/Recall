import express from "express";
import multer from "multer";

import {
  uploadScreenshot,
  createReel,
  getAllMemories,
  removeMemory,
} from "./memory.controller.js";

const router = express.Router();


// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


// ==========================================
// ROUTES
// ==========================================

// Get all memories
router.get(
  "/",
  getAllMemories
);


// Upload screenshot
router.post(
  "/screenshots",
  upload.single("screenshot"),
  uploadScreenshot
);


// Save Instagram Reel
router.post(
  "/reels",
  createReel
);


// Delete memory
router.delete(
  "/:id",
  removeMemory
);


export default router;