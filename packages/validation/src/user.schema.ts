import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  avatar: z.string().url().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.coerce.date().optional(),
});

export const createAddressSchema = z.object({
  label: z.string().min(1, "Label is required"), // e.g. "Home", "Office"
  line1: z.string().min(1, "Address line is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().min(6, "Phone number is required"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
