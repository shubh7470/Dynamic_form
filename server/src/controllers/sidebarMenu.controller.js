import { SidebarMenu } from "../models/sidebarMenu.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create sidebar menu
const createSidebarMenu = asyncHandler(async (req, res) => {
  const { name, icon, subMenu, link } = req.body;

  if (!name || !icon || !link) {
    throw new ApiError(400, "Name, icon, and link are required");
  }

  const existingMenu = await SidebarMenu.findOne({ name });
  if (existingMenu) {
    throw new ApiError(400, "Menu with this name already exists");
  }

  const sidebarMenu = await SidebarMenu.create({
    name,
    icon,
    subMenu,
    link,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, sidebarMenu, "Sidebar menu created successfully")
    );
});

// Update sidebar menu by ID
const updateSidebarMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const sidebarMenu = await SidebarMenu.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!sidebarMenu) {
    throw new ApiError(404, "Sidebar menu not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, sidebarMenu, "Sidebar menu updated successfully")
    );
});

// Get all sidebar menus
const getAllSidebarMenus = asyncHandler(async (req, res) => {
  const sidebarMenus = await SidebarMenu.find();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sidebarMenus,
        "All sidebar menus fetched successfully"
      )
    );
});

export { createSidebarMenu, updateSidebarMenu, getAllSidebarMenus };
