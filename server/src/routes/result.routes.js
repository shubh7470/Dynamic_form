import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createResult,
  updateResult,
  getAllResults,
} from "../controllers/result.controller.js";

const router = Router();

// Create result
router.route("/").post(verifyJWT, verifyAdmin, createResult);

// Update result by ID
router.route("/:id").put(verifyJWT, verifyAdmin, updateResult);

// Get all results
router.route("/").get(verifyJWT, getAllResults);

export default router;
