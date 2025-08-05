import { z } from "zod";

// Define the Zod schema for student data
export const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  dateOfBirth: z.coerce.date({ required_error: "Date of birth is required" }),
  fathersName: z.string().trim().min(1, "Father's name is required"),
  mothersName: z.string().trim().optional(),
  guardiansName: z.string().trim().optional(),
  maritalStatus: z.enum(["married", "unmarried"], {
    required_error: "Marital status is required",
  }),
  course: z.string().min(1, "Course name is required"),
  branch: z.string().trim().optional(),
  registrationNo: z.string().trim().min(1, "Registration number is required"),
  registrationYear: z.coerce.date({
    required_error: "Registration year is required",
  }),
  addmissionDate: z.coerce.date({
    required_error: "Admission date is required",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  pin: z.string().trim().min(1, "PIN code is required"),
  adhaarNo: z.string().trim().min(1, "Adhaar number is required"),
  photo: z
    .instanceof(File, { message: "Please upload student photo." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  signature: z
    .instanceof(File, { message: "Please upload student signature." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  documents: z
    .instanceof(File, { message: "Please upload student documents." })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Image must be under 1MB",
    }),
  isCompleted: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  isRegistered: z.boolean().optional().default(true),
});
