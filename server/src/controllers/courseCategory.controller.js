import { CourseCategory } from "../models/courseCategory.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create course category
const createCourseCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // console.log(req.body);
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  const existingCategory = await CourseCategory.findOne({
    name: name.toLowerCase(),
  });
  if (existingCategory) {
    throw new ApiError(400, "Category with this name already exists");
  }

  const category = await CourseCategory.create({ name: name.toLowerCase() });
  res
    .status(200)
    .json(
      new ApiResponse(200, category, "Course category created successfully")
    );
});

// Update course category by ID
const updateCourseCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // console.log(id);

  if (!name || name.trim() === "") {
    throw new ApiError(401, "Category name is required");
  }

  const existedCategory = await CourseCategory.findOne({ name });

  if (existedCategory) {
    throw new ApiError(400, "Category allready exist");
  }

  const category = await CourseCategory.findByIdAndUpdate(
    id,
    { name: name.toLowerCase() },
    { new: true }
  );
  if (!category) {
    throw new ApiError(404, "Course category not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, category, "Course category updated successfully")
    );
});

const changeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CourseCategory.findById(id);

  if (!category) {
    throw new ApiError(400, "Course category not found");
  }

  // Toggle isActive
  category.isActive = !category.isActive;

  // Save updated document
  await category.save();

  res.status(200).json(new ApiResponse(200, {}, "Status chamged successfully"));
});

// Get all course categories
const getAllCourseCategories = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "desc" ? -1 : 1;

  // console.log(req.query);

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // console.log(query);

  const skip = (page - 1) * limit;

  const categories = await CourseCategory.find(query)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);
  const count = categories.length;
  const totalCategories = await CourseCategory.countDocuments(query);
  const totalPages = Math.ceil(totalCategories / limit);

  const pagination = {
    totalCategories,
    totalPages,
    currentPage: page,
    limit,
    count,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories, pagination },
        "All course categories fetched successfully"
      )
    );
});

const getAllCategoriesName = asyncHandler(async (req, res) => {
  const categories = await CourseCategory.find().select("name _id");

  const data = categories.map((category) => ({
    value: category._id.toString(),
    label: category.name,
  }));

  res.status(200).json(new ApiResponse(200, data, "success"));
});

export {
  createCourseCategory,
  updateCourseCategory,
  getAllCourseCategories,
  changeStatus,
  getAllCategoriesName,
};
