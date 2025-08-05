import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CourseCategory",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    branchprice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = model("Course", courseSchema);
