import { z } from "zod";

export const socialLoginSchema = z.object({
  provider: z.enum(["GOOGLE", "FACEBOOK", "APPLE"]),
  providerId: z.string().min(1, "providerId is required"),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
});

export type SocialLoginInput = z.infer<typeof socialLoginSchema>;
