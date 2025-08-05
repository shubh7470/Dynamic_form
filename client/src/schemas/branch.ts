import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().trim().min(1, "User name is required"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
  code: z.string().trim().min(1, "Branch code is required"),
  branchName: z.string().trim().min(1, "Branch name is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  directorname: z.string().trim().min(1, "Director name is required"),
  directoradress: z.string().trim().min(1, "Director address is required"),
  location: z.string().trim().min(1, "Location is required"),
  dist: z.string().trim().min(1, "District is required"),
  state: z.string().trim().min(1, "State is required"),
  religion: z.string().trim().optional(),
  signature: z
    .instanceof(File, { message: "Please upload signature." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  image: z
    .instanceof(File, { message: "Please upload a photo." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  coursefees: z.array(
    z.object({
      duration: z.string().min(1, "Duration is required"),
      fees: z.string({ required_error: "Fees is required" }),
    })
  ),
});
