import { z } from "zod";
import type { ZodTypeAny } from "zod";

export const generateZodSchema = (fields: any[]): z.ZodObject<any> => {
  const schemaShape: Record<string, ZodTypeAny> = {};

  fields.forEach((field) => {
    if (!field.isActive) return; // Skip inactive fields

    let zodField: ZodTypeAny;

    switch (field.type) {
      case "text":
      case "textarea":
        zodField = z.string().min(1, `${field.label} is required`);
        break;

      case "email":
        zodField = z.string().email(`${field.label} must be a valid email`);
        break;

      case "number":
        zodField = z.string().refine((val) => !isNaN(Number(val)), {
          message: `${field.label} must be a number`,
        });
        break;

      case "tel":
        zodField = z
          .string()
          .regex(/^[0-9]{10}$/, `${field.label} must be a valid 10-digit number`);
        break;

      case "checkbox":
        zodField = z.boolean();
        break;

      case "select":
        zodField = z
          .string()
          .min(1, `${field.label} is required`)
          .refine((val) => field.options?.some((opt: any) => opt.value === val), {
            message: `${field.label} selection is invalid`,
          });
        break;

      case "date":
  zodField = z
    .date({
      required_error: `${field.label} is required`,
      invalid_type_error: `${field.label} must be a valid date`,
    });
  break;


      case "file":
        // You might use react-hook-form's `validate` separately for actual file uploads
        zodField = z.any(); // Or custom refine
        break;

      default:
        zodField = z.any();
    }

    // Add required check
    if (field.required !== false) {
      schemaShape[field.name] = zodField;
    }
  });

  return z.object(schemaShape);
};
