import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createBranchMenu,
  updateBranchMenu,
  getAllBranchMenus,
} from "../controllers/branchMenu.controller.js";

const router = Router();

// Create branch menu
router.route("/").post(verifyJWT, verifyAdmin, createBranchMenu);

// Update branch menu by ID
router.route("/:id").put(verifyJWT, verifyAdmin, updateBranchMenu);

// Get all branch menus
router.route("/").get(verifyJWT, getAllBranchMenus);

export default router;
