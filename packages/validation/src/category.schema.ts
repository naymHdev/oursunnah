import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  imagePublicId: z.string().optional(),
  parentId: z.string().optional().nullable(),
  position: z.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const reorderCategoriesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        position: z.number().int(),
        parentId: z.string().optional().nullable(),
      })
    )
    .min(1, "At least one item is required"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
