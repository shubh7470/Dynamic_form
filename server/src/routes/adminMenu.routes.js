import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";
import {
  createAdminMenu,
  updateAdminMenu,
  getAllAdminMenus,
} from "../controllers/adminMenu.controller.js";

const router = Router();

// Create admin menu
router.route("/").post(verifyJWT, verifyAdmin, createAdminMenu);

// Update admin menu by ID
router.route("/:id").put(verifyJWT, verifyAdmin, updateAdminMenu);

// Get all admin menus
router.route("/").get(verifyJWT, getAllAdminMenus);

export default router;
