import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce
    .number()
    .int("Threshold must be a whole number")
    .min(0, "Threshold cannot be negative"),
  thumbnail: z.url("Enter a valid image URL"),
  status: z.enum(["active", "draft", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
