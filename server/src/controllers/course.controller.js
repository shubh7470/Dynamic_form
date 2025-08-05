import { Course } from "../models/course.model.js";
import { CourseCategory } from "../models/courseCategory.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

// Create course
const createCourse = asyncHandler(async (req, res) => {
  const { name, description, category, price, branchprice, duration } =
    req.body;
  const { image } = req.files || {};

  if (
    [name, description, category, price, branchprice, duration].some(
      (field) => !field || field?.toString().trim() === ""
    ) ||
    !image
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }
  const checkCategory = CourseCategory.findById(category);
  // console.log(checkCategory);
  if (!checkCategory) {
    throw new ApiError(400, "Invalid Category");
  }
  // console.log(req.body);

  const imageUrl = `${req.protocol}://${req.get("host")}/assets/${
    image[0].filename
  }`;

  const existingCourse = await Course.findOne({ name });
  if (existingCourse) {
    throw new ApiError(400, "Course with this name already exists");
  }

  const course = await Course.create({
    name,
    description,
    category,
    price,
    branchprice,
    duration,
    image: imageUrl,
  });

  if (!course) {
    throw new ApiError(500, "Somthing went wrong");
  }

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course created successfully"));
});

// Update course by ID
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  const { image } = req.files || {};

  const currentCourse = await Course.findById(id);
  if (!currentCourse) {
    throw new ApiError(401, "Course not found");
  }

  if (image) {
    const oldImagePath = currentCourse.image.split("/assets/")[1];
    fs.unlinkSync(path.join("public/assets", oldImagePath));
    updateData.image = `${req.protocol}://${req.get("host")}/assets/${
      image[0].filename
    }`;
  }

  const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
  res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});
// Update course status by ID
const updateCourseSatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const currentCourse = await Course.findById(id);
  if (!currentCourse) {
    throw new ApiError(401, "Course not found");
  }

  currentCourse.isActive = !currentCourse.isActive;
  currentCourse.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, currentCourse, "Course satus changed successfully")
    );
});

// Get all courses with search and sort
const getAllCourses = asyncHandler(async (req, res) => {
  const { search = "", sortBy = "createdAt", order = "asc" } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  // console.log(req);
  const sortOrder = order === "desc" ? -1 : 1;

  const matchStage = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "category.name": { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const courses = await Course.aggregate([
    {
      $lookup: {
        from: "coursecategories", // correct collection name (not model name)
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $match: matchStage },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalCoursesCount = await Course.aggregate([
    {
      $lookup: {
        from: "coursecategories",
        localField: "category",
        foreignField: "_id",
        as: "categor",
      },
    },
    { $unwind: "$category" },
    { $match: matchStage },
    { $count: "total" },
  ]);

  const totalCourses = totalCoursesCount[0]?.total || 0;
  const totalPages = Math.ceil(totalCourses / limit);

  const pagination = {
    totalCourses,
    totalPages,
    currentPage: page,
    limit,
    count: courses.length,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { courses, pagination },
        "All courses fetched successfully"
      )
    );
});

const getAllCourseName = asyncHandler(async (req, res) => {
  const courses = await Course.find().select("name _id");

  const data = courses.map((course) => ({
    value: course._id.toString(),
    label: course.name,
  }));

  res.status(200).json(new ApiResponse(200, data, "success"));
});

//Get by ID
const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = Course.findById(id);
  if (!course) {
    throw new ApiError(400, "Course not found");
  }
  res.status(200).json(200, course, "Course get successfully");
});

export {
  createCourse,
  updateCourse,
  getAllCourses,
  getAllCourseName,
  updateCourseSatus,
  getCourseById,
};
