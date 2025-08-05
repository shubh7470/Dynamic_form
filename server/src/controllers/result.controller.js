import { Result } from "../models/result.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create result
const createResult = asyncHandler(async (req, res) => {
  const {
    student,
    coursePaper,
    TheoryMarksObtained,
    TheoryTotalMarks,
    PracticalMarksObtained,
    PracticalTotalMarks,
    year,
  } = req.body;

  if (
    [
      student,
      coursePaper,
      TheoryMarksObtained,
      TheoryTotalMarks,
      PracticalMarksObtained,
      PracticalTotalMarks,
    ].some((field) => !field || field?.toString().trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const existingResult = await Result.findOne({ student, coursePaper });
  if (existingResult) {
    throw new ApiError(
      400,
      "Result for this student and course paper already exists"
    );
  }

  const result = await Result.create({
    student,
    coursePaper,
    TheoryMarksObtained,
    TheoryTotalMarks,
    PracticalMarksObtained,
    PracticalTotalMarks,
    year,
  });

  res
    .status(201)
    .json(new ApiResponse(201, result, "Result created successfully"));
});

// Update result by ID
const updateResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const result = await Result.findByIdAndUpdate(id, updateData, { new: true });
  if (!result) {
    throw new ApiError(404, "Result not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, result, "Result updated successfully"));
});

// Get all results
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find().populate(["student", "coursePaper"]);
  res
    .status(200)
    .json(new ApiResponse(200, results, "All results fetched successfully"));
});

export { createResult, updateResult, getAllResults };
