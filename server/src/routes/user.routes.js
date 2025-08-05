import { Router } from "express";

import {
  changePassword,
  getAllUsers,
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("image"), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/").get(verifyJWT, getAllUsers);

export default router;
