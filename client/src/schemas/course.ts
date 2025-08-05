import { z } from "zod";

export const courseCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
});

export const courseSchema = z.object({
  name: z.string().trim().min(1, "Course name is required"),
  image: z
    .instanceof(File, { message: "Please upload a image." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  description: z.string().min(1, "Course description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price is required"),
  branchprice: z.coerce.number().min(1, "Branch price is required"),
  duration: z.coerce.number().min(1, "Duration is required"),
});

export const coursePaperSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  coursename: z.string().min(1, "Course  is required"), // ObjectId as string
  paperno: z.string().trim().min(1, "Paper number is required"),
  theorymarks: z.coerce.number().min(0, "Theory marks must be a number"),
  practicalmarks: z.coerce.number().min(0, "Practical marks must be a number"),
});
