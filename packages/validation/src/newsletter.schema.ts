import { z } from "zod";

// ── Subscribe ──────────────────────────────────────────────────────────────
export const subscribeNewsletterSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),
    // Lets one endpoint serve every signup surface (homepage, footer,
    // checkout, blog) while still knowing where the lead came from.
    source: z.string().max(50).optional(),
  }),
});

// ── Unsubscribe ────────────────────────────────────────────────────────────
export const unsubscribeNewsletterSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),
  }),
});

// ── Types ──────────────────────────────────────────────────────────────────
export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>["body"];
export type UnsubscribeNewsletterInput = z.infer<typeof unsubscribeNewsletterSchema>["body"];
