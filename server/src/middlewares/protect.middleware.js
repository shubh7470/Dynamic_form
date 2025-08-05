import { ApiError } from "../utils/apiArror.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler((req, _, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(401, "Unauthorized access");
  }
  next();
});

export const verifySuperAdmin = asyncHandler((req, _, next) => {
  if (req.user.role !== "superadmin") {
    throw new ApiError(401, "Unauthorized access");
  }
  next();
});

export const verifyAdminOrBranch = asyncHandler((req, _, next) => {
  if (req.user.role !== "admin" && req.user.role !== "branch") {
    throw new ApiError(401, "Unauthorized access");
  }
  next();
});
