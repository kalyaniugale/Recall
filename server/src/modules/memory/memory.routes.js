import express from "express";

import upload from "../../middleware/upload.middleware.js";
import { uploadScreenshot ,fetchMemories,} from "./memory.controller.js";
import {
  removeMemory,
} from "./memory.controller.js";
const router = express.Router();

router.get("/", fetchMemories);
router.delete("/:id", removeMemory);
router.post(
  "/screenshots",
  upload.single("screenshot"),
  uploadScreenshot
);


export default router;