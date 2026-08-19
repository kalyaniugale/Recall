import express from "express";
import multer from "multer";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  uploadScreenshot,
  createReel,
  getAllMemories,
  removeMemory,
} from "./memory.controller.js";


const router =
  express.Router();


// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage:
    multer.memoryStorage(),

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },
});


// ==========================================
// AUTHENTICATION
// ==========================================

// Every route below requires JWT

router.use(requireAuth);


// ==========================================
// ROUTES
// ==========================================

router.get(
  "/",
  getAllMemories
);


router.post(
  "/screenshots",
  upload.single("screenshot"),
  uploadScreenshot
);


router.post(
  "/reels",
  createReel
);


router.delete(
  "/:id",
  removeMemory
);


export default router;