import { z } from "zod";

export const dynamicFormFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  type: z.enum(['text', 'email', 'tel', 'number', 'date', 'select', 'textarea', 'checkbox', 'file']),
  isActive: z.boolean(),
  order: z.number().min(1),
  options: z.array(z.string()).optional(),
});

export const dynamicFormSchema = z.object({
  formType: z.enum(['student', 'course', 'branch']),
  fields: z.record(dynamicFormFieldSchema)
});

export type DynamicFormField = z.infer<typeof dynamicFormFieldSchema>;
export type DynamicForm = z.infer<typeof dynamicFormSchema>;
