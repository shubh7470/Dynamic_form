import { Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    coursePaper: {
      type: Schema.Types.ObjectId,
      ref: "CoursePaper",
      required: true,
    },
    TheoryMarksObtained: {
      type: Number,
      required: true,
    },
    TheoryTotalMarks: {
      type: Number,
      required: true,
    },
    PracticalMarksObtained: {
      type: Number,
      required: true,
    },
    PracticalTotalMarks: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Result = model("Result", resultSchema);
