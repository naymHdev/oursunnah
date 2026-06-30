import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const JournalStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const JournalCategoryEnum = z.enum([
  "STYLE_GUIDE",
  "HOME_LIVING",
  "HERITAGE",
  "WELLNESS",
  "CULTURE",
  "COMMUNITY",
  "PRODUCT_STORY",
  "CRAFTMANSHIP",
]);

// ── Create Journal Post ────────────────────────────────────────────────────────

export const createJournalPostSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  excerpt: z
    .string({ required_error: "Excerpt is required" })
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt is too long"),
  content: z
    .string({ required_error: "Content is required" })
    .min(1, "Content cannot be empty"),
  category: JournalCategoryEnum,
  status: JournalStatusEnum.optional().default("DRAFT"),
  readTimeMinutes: z.number().int().min(1).max(120).optional().default(5),
  hijriMonth: z.string().max(50).optional(),
  hijriYear: z.number().int().min(1400).max(1600).optional(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
});

// ── Update Journal Post ────────────────────────────────────────────────────────

export const updateJournalPostSchema = createJournalPostSchema.partial();

// ── List Query ─────────────────────────────────────────────────────────────────

export const journalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: JournalCategoryEnum.optional(),
  status: JournalStatusEnum.optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest", "popular"]).default("newest"),
});

// ── Journal Comment ────────────────────────────────────────────────────────────

export const createJournalCommentSchema = z.object({
  body: z
    .string({ required_error: "Comment body is required" })
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
  parentId: z.string().cuid("Invalid parentId").optional(),
});

export const updateJournalCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

// ── Comment moderation (ADMIN/EDITOR) ─────────────────────────────────────────

export const moderateCommentSchema = z.object({
  status: z.enum(["approved", "pending", "spam"]),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type CreateJournalPostInput = z.infer<typeof createJournalPostSchema>;
export type UpdateJournalPostInput = z.infer<typeof updateJournalPostSchema>;
export type JournalQueryInput = z.infer<typeof journalQuerySchema>;
export type CreateJournalCommentInput = z.infer<typeof createJournalCommentSchema>;
export type UpdateJournalCommentInput = z.infer<typeof updateJournalCommentSchema>;
export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>;
