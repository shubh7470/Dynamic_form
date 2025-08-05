import express from "express";
import {
  createFormData,
  updateFormData,
  getAllFormData,
  deleteFormData,
} from "../controllers/student.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", upload.any(), createFormData); // 👈 FIXED LINE

router.put("/:id", upload.any(), updateFormData); // also fix this

router.get("/type/:formType", getAllFormData);

router.delete("/:id", deleteFormData);

export default router;
