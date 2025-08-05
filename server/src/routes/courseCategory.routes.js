import { Router } from "express";
import {
  createCourseCategory,
  updateCourseCategory,
  getAllCourseCategories,
  changeStatus,
  getAllCategoriesName,
} from "../controllers/courseCategory.controller.js";

const router = Router();

// Create course category
router.route("/").post(createCourseCategory);

// Update course category by ID
router.route("/:id").put(updateCourseCategory);

// Update course category status by ID
router.route("/:id/status").put(changeStatus);

// Get all course categories with search and sort
router.route("/").get(getAllCourseCategories);

// Get all course categories
router.route("/all").get(getAllCategoriesName);

export default router;
