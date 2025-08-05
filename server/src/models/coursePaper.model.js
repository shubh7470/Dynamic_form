import { Schema, model } from "mongoose";

const coursePaperSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    coursename: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    paperno: {
      type: String,
      required: true,
      trim: true,
    },
    theorymarks: {
      type: Number,
      required: true,
    },
    practicalmarks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CoursePaper = model("CoursePaper", coursePaperSchema);
