import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/protect.middleware.js";

import {
  getAllBranches,
  getAllbranchesName,
  registerBranch,
} from "../controllers/branch.controller.js";

const router = Router();

router.route("/").post(
  verifyJWT,
  verifyAdmin,
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  registerBranch
);

router.route("/").get(verifyJWT, verifyAdmin, getAllBranches);
router.route("/all").get(verifyJWT, verifyAdmin, getAllbranchesName);

export default router;
