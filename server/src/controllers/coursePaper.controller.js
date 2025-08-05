import { CoursePaper } from "../models/coursePaper.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create course paper
const createCoursePaper = asyncHandler(async (req, res) => {
  const { title, coursename, paperno, theorymarks, practicalmarks } = req.body;

  if (
    [title, coursename, paperno, theorymarks, practicalmarks].some(
      (field) => !field || field?.toString().trim() === ""
    )
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const existingPaper = await CoursePaper.findOne({ paperno });
  if (existingPaper) {
    throw new ApiError(400, "Paper with this number already exists");
  }

  const paper = await CoursePaper.create({
    title,
    coursename,
    paperno,
    theorymarks,
    practicalmarks,
  });

  res
    .status(201)
    .json(new ApiResponse(201, paper, "Course paper created successfully"));
});

// Update course paper by ID
const updateCoursePaper = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const paper = await CoursePaper.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!paper) {
    throw new ApiError(404, "Course paper not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, paper, "Course paper updated successfully"));
});

// Get all course papers
const getAllCoursePapers = asyncHandler(async (req, res) => {
  const papers = await CoursePaper.find().populate("coursename");
  res
    .status(200)
    .json(
      new ApiResponse(200, papers, "All course papers fetched successfully")
    );
});

export { createCoursePaper, updateCoursePaper, getAllCoursePapers };
