import { z } from "zod";

export const ReactionTypeEnum = z.enum(["LIKE", "HELPFUL", "LOVE"]);

// ── Create Review ──────────────────────────────────────────────────────────────
export const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ required_error: "Rating is required" })
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    title: z.string().max(150, "Title too long").optional(),
    body: z.string().max(2000, "Review body too long").optional(),
  }),
});

// ── Update Review (owner only) ─────────────────────────────────────────────────
export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(150).optional(),
    body: z.string().max(2000).optional(),
  }),
});

// ── List Reviews query ─────────────────────────────────────────────────────────
export const reviewQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(["newest", "oldest", "highest", "lowest", "helpful"]).default("newest"),
    rating: z.coerce.number().int().min(1).max(5).optional(), // filter by star
  }),
});

// ── Reaction ──────────────────────────────────────────────────────────────────
export const toggleReactionSchema = z.object({
  body: z.object({
    type: ReactionTypeEnum,
  }),
});

// ── Reply ─────────────────────────────────────────────────────────────────────
export const createReplySchema = z.object({
  body: z.object({
    body: z
      .string({ required_error: "Reply body is required" })
      .min(1, "Reply cannot be empty")
      .max(1000, "Reply too long"),
    parentId: z.string().cuid("Invalid parentId").optional(), // null = top-level
  }),
});

export const updateReplySchema = z.object({
  body: z.object({
    body: z.string().min(1).max(1000),
  }),
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>["body"];
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>["query"];
export type ToggleReactionInput = z.infer<typeof toggleReactionSchema>["body"];
export type CreateReplyInput = z.infer<typeof createReplySchema>["body"];
export type UpdateReplyInput = z.infer<typeof updateReplySchema>["body"];

