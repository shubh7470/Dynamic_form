import { BranchMenu } from "../models/branchMenu.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create branch menu
const createBranchMenu = asyncHandler(async (req, res) => {
  const { menu, branch } = req.body;

  if (!menu || !branch) {
    throw new ApiError(400, "Menu and branch are required");
  }

  const existingMenu = await BranchMenu.findOne({ menu, branch });
  if (existingMenu) {
    throw new ApiError(400, "Menu for this branch already exists");
  }

  const branchMenu = await BranchMenu.create({ menu, branch });
  res
    .status(201)
    .json(new ApiResponse(201, branchMenu, "Branch menu created successfully"));
});

// Update branch menu by ID
const updateBranchMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const branchMenu = await BranchMenu.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!branchMenu) {
    throw new ApiError(404, "Branch menu not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, branchMenu, "Branch menu updated successfully"));
});

// Get all branch menus
const getAllBranchMenus = asyncHandler(async (req, res) => {
  const branchMenus = await BranchMenu.find().populate(["menu", "branch"]);
  res
    .status(200)
    .json(
      new ApiResponse(200, branchMenus, "All branch menus fetched successfully")
    );
});

export { createBranchMenu, updateBranchMenu, getAllBranchMenus };
