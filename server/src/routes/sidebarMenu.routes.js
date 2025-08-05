import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createSidebarMenu,
  updateSidebarMenu,
  getAllSidebarMenus,
} from "../controllers/sidebarMenu.controller.js";

const router = Router();

// Create sidebar menu
router.route("/").post(verifyJWT, verifyAdmin, createSidebarMenu);

// Update sidebar menu by ID
router.route("/:id").put(verifyJWT, verifyAdmin, updateSidebarMenu);

// Get all sidebar menus
router.route("/").get(verifyJWT, getAllSidebarMenus);

export default router;
