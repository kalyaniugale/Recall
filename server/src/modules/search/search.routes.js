import express from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  search,
} from "./search.controller.js";


const router =
  express.Router();


router.use(
  requireAuth
);


router.get(
  "/",
  search
);


export default router;