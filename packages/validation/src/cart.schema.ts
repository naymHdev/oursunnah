import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  variantId: z.string().min(1).optional().nullable(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "quantity cannot be negative"),
});

/**
 * Used once, right after login, to fold a guest's localStorage cart
 * into their server-side cart. Quantities are summed with whatever the
 * user already had server-side (see CartService.mergeCart).
 */
export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).optional().nullable(),
        quantity: z.number().int().positive(),
      })
    )
    .max(100, "Too many items to merge at once"),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;
