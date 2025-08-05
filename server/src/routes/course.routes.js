import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createCourse,
  updateCourse,
  getAllCourses,
  updateCourseSatus,
  getCourseById,
  getAllCourseName,
} from "../controllers/course.controller.js";

const router = Router();

// Create course
router
  .route("/")
  .post(
    verifyJWT,
    verifyAdmin,
    upload.fields([{ name: "image", maxCount: 1 }]),
    createCourse
  );

// Update course by ID
router
  .route("/:id")
  .put(
    verifyJWT,
    verifyAdmin,
    upload.fields([{ name: "image", maxCount: 1 }]),
    updateCourse
  );
router.route("/:id/status").put(verifyJWT, updateCourseSatus);

// Get all courses
router.route("/").get(getAllCourses);
router.route("/all").get(getAllCourseName);
// Get courses by ID
router.route("/:id").get(getCourseById);

export default router;
