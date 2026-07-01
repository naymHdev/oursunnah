import { z } from "zod";

const optionalImageUrl = z.preprocess((value) => value === "" ? undefined : value, z.string().url("Image must be a valid URL").optional());

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: optionalImageUrl,
  imagePublicId: z.string().optional(),
  parentId: z.string().optional().nullable(),
  position: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
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
