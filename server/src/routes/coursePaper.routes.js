import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createCoursePaper,
  updateCoursePaper,
  getAllCoursePapers,
} from "../controllers/coursePaper.controller.js";

const router = Router();

// Create course paper
router.route("/").post(verifyJWT, verifyAdmin, createCoursePaper);

// Update course paper by ID
router.route("/:id").put(verifyJWT, verifyAdmin, updateCoursePaper);

// Get all course papers
router.route("/").get(verifyJWT, getAllCoursePapers);

export default router;
