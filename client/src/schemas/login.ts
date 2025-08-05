import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
export type LoginDataType = z.infer<typeof loginSchema>;
