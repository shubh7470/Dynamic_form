import { AdminMenu } from "../models/adminMenu.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create admin menu
const createAdminMenu = asyncHandler(async (req, res) => {
  const { menu } = req.body;

  if (!menu) {
    throw new ApiError(400, "Menu is required");
  }

  const existingMenu = await AdminMenu.findOne({ menu });
  if (existingMenu) {
    throw new ApiError(400, "Menu already exists");
  }

  const adminMenu = await AdminMenu.create({ menu });
  res
    .status(201)
    .json(new ApiResponse(201, adminMenu, "Admin menu created successfully"));
});

// Update admin menu by ID
const updateAdminMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const adminMenu = await AdminMenu.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!adminMenu) {
    throw new ApiError(404, "Admin menu not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, adminMenu, "Admin menu updated successfully"));
});

// Get all admin menus
const getAllAdminMenus = asyncHandler(async (req, res) => {
  const adminMenus = await AdminMenu.find().populate("menu");
  res
    .status(200)
    .json(
      new ApiResponse(200, adminMenus, "All admin menus fetched successfully")
    );
});

export { createAdminMenu, updateAdminMenu, getAllAdminMenus };
