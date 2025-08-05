import { Router } from "express";
import {
  createForm,
  updateForm,
  getFormByType,
} from "../controllers/dynamicForm.controller.js";

const router = Router();

// For creating form
router.post("/", createForm);

// For updating form by ID
router.put("/:id", updateForm);

// For getting form by type
router.get("/type/:formType", getFormByType);


export default router;
