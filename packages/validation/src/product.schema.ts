import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().url("Image must be a valid URL"),
  publicId: z.string().min(1, "publicId is required"),
  position: z.number().int().optional(),
});

const productAttributeSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  value: z.string().min(1, "Attribute value is required"),
  position: z.number().int().optional(),
});

const productOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"), // e.g. "Color", "Size"
  values: z.array(z.string().min(1)).min(1, "At least one value is required"),
});

const productVariantSchema = z.object({
  // Maps each option name to the chosen value for this variant,
  // e.g. { "Color": "White", "Size": "M" }
  optionValues: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {
    message: "A variant must specify at least one option value",
  }),
  sku: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  image: z.string().url().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  shortDescription: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sku: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),

  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  images: z.array(productImageSchema).optional().default([]),
  attributes: z.array(productAttributeSchema).optional().default([]),

  // Both omitted for a simple product (uses the base price/stock directly).
  options: z.array(productOptionSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial().extend({
  categoryIds: z.array(z.string()).min(1, "At least one category is required").optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categorySlug: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isFeatured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional().default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
