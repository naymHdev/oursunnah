#!/bin/bash
set -e
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"
echo "📁 Repo root: $REPO_ROOT"


echo "✍️  Writing packages/validation/src/review.schema.ts..."
mkdir -p "$(dirname "packages/validation/src/review.schema.ts")"
cat > 'packages/validation/src/review.schema.ts' << 'EOF_PACKAGES_VALIDATION_SRC_REVIEW_SCHEMA_TS'
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

EOF_PACKAGES_VALIDATION_SRC_REVIEW_SCHEMA_TS

echo "✍️  Writing apps/api/src/app/modules/review/review.service.ts..."
mkdir -p "$(dirname "apps/api/src/app/modules/review/review.service.ts")"
cat > 'apps/api/src/app/modules/review/review.service.ts' << 'EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_SERVICE_TS'
import type {
  CreateReviewInput,
  UpdateReviewInput,
  ReviewQueryInput,
  ToggleReactionInput,
  CreateReplyInput,
  UpdateReplyInput,
} from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";

// ── Helpers ────────────────────────────────────────────────────────────────────

const MAX_REPLY_DEPTH = 3;

/**
 * Recursively builds the hierarchical reply tree for a set of top-level replies.
 * Each reply includes nested children up to MAX_REPLY_DEPTH.
 */
const buildReplyTree = (
  allReplies: ReplyWithRelations[],
  parentId: string | null
): ReplyWithRelations[] => {
  return allReplies
    .filter((r) => r.parentId === parentId)
    .map((r) => ({
      ...r,
      children: buildReplyTree(allReplies, r.id),
    }));
};

type ReplyWithRelations = {
  id: string;
  reviewId: string;
  userId: string;
  body: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string; avatar: string | null };
  reactions: { type: string; userId: string }[];
  reactionCounts: Record<string, number>;
  children?: ReplyWithRelations[];
};

/**
 * Computes per-type reaction counts from a flat reactions array.
 * e.g. [{ type: "LIKE" }, { type: "LIKE" }, { type: "HELPFUL" }]
 * → { LIKE: 2, HELPFUL: 1 }
 */
const countReactions = (reactions: { type: string }[]): Record<string, number> => {
  return reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});
};

// ── Review CRUD ────────────────────────────────────────────────────────────────

const createReview = async (
  productId: string,
  userId: string,
  payload: CreateReviewInput
) => {
  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError(404, "Product not found");

  // One review per user per product (DB unique constraint also enforces this)
  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId } },
  });
  if (existing) throw new AppError(409, "You have already reviewed this product");

  const review = await prisma.review.create({
    data: {
      productId,
      userId,
      rating: payload.rating,
      title: payload.title,
      body: payload.body,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      reactions: { select: { type: true, userId: true } },
      _count: { select: { replies: true } },
    },
  });

  return {
    ...review,
    reactionCounts: countReactions(review.reactions),
  };
};

const getProductReviews = async (productId: string, query: ReviewQueryInput, requestUserId?: string) => {
  const { page, limit, sort, rating: ratingFilter } = query;

  const where = {
    productId,
    ...(ratingFilter ? { rating: ratingFilter } : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "highest"
        ? { rating: "desc" as const }
        : sort === "lowest"
          ? { rating: "asc" as const }
          : { createdAt: "desc" as const }; // newest & helpful default

  const [reviews, total, ratingAgg, ratingDistribution] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        reactions: { select: { type: true, userId: true } },
        _count: { select: { replies: true } },
      },
    }),
    prisma.review.count({ where }),
    // Average rating across ALL reviews for this product (not paginated)
    prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    // Distribution: how many reviews per star (1–5)
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true },
    }),
  ]);

  // Normalise distribution into { 1: N, 2: N, 3: N, 4: N, 5: N }
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of ratingDistribution) {
    distribution[row.rating] = row._count.rating;
  }

  type RxItem = { type: string; userId: string };
  const formattedReviews = reviews.map((r) => ({
    ...r,
    reactionCounts: countReactions(r.reactions),
    myReactions: requestUserId
      ? r.reactions.filter((rx: RxItem) => rx.userId === requestUserId).map((rx: RxItem) => rx.type)
      : [],
  }));

  return {
    // SEO / schema.org AggregateRating compatible fields
    aggregateRating: {
      ratingValue: ratingAgg._avg.rating
        ? parseFloat(ratingAgg._avg.rating.toFixed(1))
        : 0,
      reviewCount: ratingAgg._count.rating,
      ratingDistribution: distribution,
    },
    reviews: formattedReviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateReview = async (
  reviewId: string,
  userId: string,
  payload: UpdateReviewInput
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");
  if (review.userId !== userId) throw new AppError(403, "You can only edit your own review");

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(payload.rating !== undefined && { rating: payload.rating }),
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.body !== undefined && { body: payload.body }),
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      reactions: { select: { type: true, userId: true } },
      _count: { select: { replies: true } },
    },
  });
};

const deleteReview = async (reviewId: string, userId: string, userRole: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");

  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
  if (review.userId !== userId && !isAdmin) {
    throw new AppError(403, "You can only delete your own review");
  }

  await prisma.review.delete({ where: { id: reviewId } });
};

// ── Reactions ──────────────────────────────────────────────────────────────────

/**
 * Toggle reaction on a Review. If the user already reacted with this type,
 * it is removed (un-react). Otherwise it is added.
 * Returns the updated reaction counts for the review.
 */
const toggleReviewReaction = async (
  reviewId: string,
  userId: string,
  payload: ToggleReactionInput
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");

  const existing = await prisma.reviewReaction.findUnique({
    where: { reviewId_userId_type: { reviewId, userId, type: payload.type } },
  });

  if (existing) {
    await prisma.reviewReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reviewReaction.create({
      data: { reviewId, userId, type: payload.type },
    });
  }

  const reactions = await prisma.reviewReaction.findMany({
    where: { reviewId },
    select: { type: true, userId: true },
  });

  return {
    reactionCounts: countReactions(reactions),
    myReactions: reactions.filter((r) => r.userId === userId).map((r) => r.type),
    toggled: existing ? "removed" : "added",
  };
};

const toggleReplyReaction = async (
  replyId: string,
  userId: string,
  payload: ToggleReactionInput
) => {
  const reply = await prisma.reviewReply.findUnique({ where: { id: replyId } });
  if (!reply) throw new AppError(404, "Reply not found");

  const existing = await prisma.reviewReplyReaction.findUnique({
    where: { replyId_userId_type: { replyId, userId, type: payload.type } },
  });

  if (existing) {
    await prisma.reviewReplyReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reviewReplyReaction.create({
      data: { replyId, userId, type: payload.type },
    });
  }

  const reactions = await prisma.reviewReplyReaction.findMany({
    where: { replyId },
    select: { type: true, userId: true },
  });

  return {
    reactionCounts: countReactions(reactions),
    myReactions: reactions.filter((r) => r.userId === userId).map((r) => r.type),
    toggled: existing ? "removed" : "added",
  };
};

// ── Replies ────────────────────────────────────────────────────────────────────

/**
 * Returns the full hierarchical reply tree for a review.
 * Depth is capped at MAX_REPLY_DEPTH (3) in business logic, not in DB.
 */
const getReviewReplies = async (reviewId: string, requestUserId?: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");

  const allReplies = await prisma.reviewReply.findMany({
    where: { reviewId },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      reactions: { select: { type: true, userId: true } },
    },
  });

  const enriched = allReplies.map((r) => ({
    ...r,
    reactionCounts: countReactions(r.reactions),
    myReactions: requestUserId
      ? r.reactions.filter((rx) => rx.userId === requestUserId).map((rx) => rx.type)
      : [],
    children: [] as ReplyWithRelations[],
  }));

  return buildReplyTree(enriched as ReplyWithRelations[], null);
};

const createReply = async (
  reviewId: string,
  userId: string,
  payload: CreateReplyInput
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");

  // Enforce depth limit
  if (payload.parentId) {
    const parent = await prisma.reviewReply.findUnique({
      where: { id: payload.parentId },
    });
    if (!parent) throw new AppError(404, "Parent reply not found");
    if (parent.reviewId !== reviewId) {
      throw new AppError(400, "Parent reply does not belong to this review");
    }

    // Walk up to count depth
    let depth = 1;
    let currentParentId: string | null = parent.parentId;
    while (currentParentId) {
      depth++;
      if (depth >= MAX_REPLY_DEPTH) {
        throw new AppError(400, `Maximum reply depth of ${MAX_REPLY_DEPTH} reached`);
      }
      const ancestor = await prisma.reviewReply.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });
      currentParentId = ancestor?.parentId ?? null;
    }
  }

  const reply = await prisma.reviewReply.create({
    data: {
      reviewId,
      userId,
      body: payload.body,
      parentId: payload.parentId ?? null,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      reactions: { select: { type: true, userId: true } },
    },
  });

  return {
    ...reply,
    reactionCounts: countReactions(reply.reactions),
    myReactions: [] as string[],
    children: [],
  };
};

const updateReply = async (
  replyId: string,
  userId: string,
  payload: UpdateReplyInput
) => {
  const reply = await prisma.reviewReply.findUnique({ where: { id: replyId } });
  if (!reply) throw new AppError(404, "Reply not found");
  if (reply.userId !== userId) throw new AppError(403, "You can only edit your own reply");

  return prisma.reviewReply.update({
    where: { id: replyId },
    data: { body: payload.body },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });
};

const deleteReply = async (replyId: string, userId: string, userRole: string) => {
  const reply = await prisma.reviewReply.findUnique({ where: { id: replyId } });
  if (!reply) throw new AppError(404, "Reply not found");

  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
  if (reply.userId !== userId && !isAdmin) {
    throw new AppError(403, "You can only delete your own reply");
  }

  // Deleting a parent cascades to children via DB onDelete: Cascade
  await prisma.reviewReply.delete({ where: { id: replyId } });
};

export const ReviewService = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleReviewReaction,
  toggleReplyReaction,
  getReviewReplies,
  createReply,
  updateReply,
  deleteReply,
};

EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_SERVICE_TS

echo "✍️  Writing apps/api/src/app/modules/review/review.controller.ts..."
mkdir -p "$(dirname "apps/api/src/app/modules/review/review.controller.ts")"
cat > 'apps/api/src/app/modules/review/review.controller.ts' << 'EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_CONTROLLER_TS'
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReviewService } from "./review.service.js";
import { reviewQuerySchema } from "@our-sunnah/validation";

// ── Reviews ────────────────────────────────────────────────────────────────────

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(
    req.params.productId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 201, success: true, message: "Review created", data: result });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const query = reviewQuerySchema.shape.query.parse(req.query);
  const result = await ReviewService.getProductReviews(
    req.params.productId,
    query,
    req.userId
  );
  sendResponse(res, { statusCode: 200, success: true, message: "Reviews fetched", data: result });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.params.reviewId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 200, success: true, message: "Review updated", data: result });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview(req.params.reviewId, req.userId!, req.userRole!);
  sendResponse(res, { statusCode: 200, success: true, message: "Review deleted", data: null });
});

// ── Reactions ──────────────────────────────────────────────────────────────────

const toggleReviewReaction = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.toggleReviewReaction(
    req.params.reviewId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 200, success: true, message: `Reaction ${result.toggled}`, data: result });
});

const toggleReplyReaction = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.toggleReplyReaction(
    req.params.replyId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 200, success: true, message: `Reaction ${result.toggled}`, data: result });
});

// ── Replies ────────────────────────────────────────────────────────────────────

const getReviewReplies = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewReplies(
    req.params.reviewId,
    req.userId
  );
  sendResponse(res, { statusCode: 200, success: true, message: "Replies fetched", data: result });
});

const createReply = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReply(
    req.params.reviewId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 201, success: true, message: "Reply created", data: result });
});

const updateReply = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReply(
    req.params.replyId,
    req.userId!,
    req.body
  );
  sendResponse(res, { statusCode: 200, success: true, message: "Reply updated", data: result });
});

const deleteReply = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReply(req.params.replyId, req.userId!, req.userRole!);
  sendResponse(res, { statusCode: 200, success: true, message: "Reply deleted", data: null });
});

export const ReviewController = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleReviewReaction,
  toggleReplyReaction,
  getReviewReplies,
  createReply,
  updateReply,
  deleteReply,
};

EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_CONTROLLER_TS

echo "✍️  Writing apps/api/src/app/modules/review/review.routes.ts..."
mkdir -p "$(dirname "apps/api/src/app/modules/review/review.routes.ts")"
cat > 'apps/api/src/app/modules/review/review.routes.ts' << 'EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_ROUTES_TS'
import { Router } from "express";
import { ReviewController } from "./review.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import {
  createReviewSchema,
  updateReviewSchema,
  toggleReactionSchema,
  createReplySchema,
  updateReplySchema,
} from "@our-sunnah/validation";

const router = Router({ mergeParams: true });

// ── Reviews (nested under /products/:productId/reviews) ───────────────────────
// Mounted at /products/:productId/reviews in the parent router via mergeParams

router.get(
  "/",
  optionalAuth(),
  ReviewController.getProductReviews
);

router.post(
  "/",
  auth(), // any logged-in user
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

// ── Single review actions (own resource) ──────────────────────────────────────

router.patch(
  "/:reviewId",
  auth(),
  validateRequest(updateReviewSchema),
  ReviewController.updateReview
);

router.delete(
  "/:reviewId",
  auth(), // service checks ownership; ADMIN can delete any
  ReviewController.deleteReview
);

// ── Reactions on a review ─────────────────────────────────────────────────────

router.post(
  "/:reviewId/reactions",
  auth(),
  validateRequest(toggleReactionSchema),
  ReviewController.toggleReviewReaction
);

// ── Reply tree for a review ───────────────────────────────────────────────────

router.get(
  "/:reviewId/replies",
  optionalAuth(),
  ReviewController.getReviewReplies
);

router.post(
  "/:reviewId/replies",
  auth(),
  validateRequest(createReplySchema),
  ReviewController.createReply
);

// ── Single reply actions ──────────────────────────────────────────────────────

router.patch(
  "/:reviewId/replies/:replyId",
  auth(),
  validateRequest(updateReplySchema),
  ReviewController.updateReply
);

router.delete(
  "/:reviewId/replies/:replyId",
  auth(),
  ReviewController.deleteReply
);

// ── Reactions on a reply ──────────────────────────────────────────────────────

router.post(
  "/:reviewId/replies/:replyId/reactions",
  auth(),
  validateRequest(toggleReactionSchema),
  ReviewController.toggleReplyReaction
);

export const ReviewRoutes = router;

EOF_APPS_API_SRC_APP_MODULES_REVIEW_REVIEW_ROUTES_TS

echo "✍️  Writing packages/validation/src/index.ts..."
mkdir -p "$(dirname "packages/validation/src/index.ts")"
cat > 'packages/validation/src/index.ts' << 'EOF_PACKAGES_VALIDATION_SRC_INDEX_TS'
export * from "./auth.schema";
export * from "./social-auth.schema";
export * from "./category.schema";
export * from "./product.schema";
export * from "./user.schema";
export * from "./cart.schema";
export * from "./review.schema";

EOF_PACKAGES_VALIDATION_SRC_INDEX_TS

echo "✍️  Writing apps/api/src/app/routes/index.ts..."
mkdir -p "$(dirname "apps/api/src/app/routes/index.ts")"
cat > 'apps/api/src/app/routes/index.ts' << 'EOF_APPS_API_SRC_APP_ROUTES_INDEX_TS'
import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";
import { ProductRoutes } from "../modules/product/product.routes.js";
import { ReviewRoutes } from "../modules/review/review.routes.js";
import { AnalyticsRoutes } from "../modules/analytics/analytics.routes.js";
import { UserRoutes } from "../modules/user/user.routes.js";
import { CartRoutes } from "../modules/cart/cart.routes.js";
import { UploadRoutes } from "../modules/upload/upload.routes.js";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/analytics", route: AnalyticsRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/cart", route: CartRoutes },
  { path: "/upload", route: UploadRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Reviews nested under products — mergeParams lets :productId flow into ReviewRoutes
router.use("/products/:productId/reviews", ReviewRoutes);

export default router;

EOF_APPS_API_SRC_APP_ROUTES_INDEX_TS

echo "✍️  Writing apps/api/src/app/modules/product/product.service.ts..."
mkdir -p "$(dirname "apps/api/src/app/modules/product/product.service.ts")"
cat > 'apps/api/src/app/modules/product/product.service.ts' << 'EOF_APPS_API_SRC_APP_MODULES_PRODUCT_PRODUCT_SERVICE_TS'
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";
import { UploadService } from "../upload/upload.service.js";

const slugExists = (excludeId?: string) => async (slug: string) => {
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
};

const assertCategoriesExist = async (categoryIds: string[]) => {
  const count = await prisma.category.count({ where: { id: { in: categoryIds } } });
  if (count !== categoryIds.length) {
    throw new AppError(404, "One or more categories not found");
  }
};

const PRODUCT_DETAIL_INCLUDE = {
  images: { orderBy: { position: "asc" as const } },
  categories: true,
  attributes: { orderBy: { position: "asc" as const } },
  options: {
    orderBy: { position: "asc" as const },
    include: { values: { orderBy: { position: "asc" as const } } },
  },
  variants: {
    include: { optionValues: { include: { option: true } } },
  },
};

/**
 * Creates the options/values/variants for a product inside an existing
 * transaction. Variants reference option values by name (not id) in the
 * input, so values must be created first and mapped before variants can
 * connect to them.
 */
const createOptionsAndVariants = async (
  tx: typeof prisma,
  productId: string,
  options: CreateProductInput["options"],
  variants: CreateProductInput["variants"]
) => {
  if (!options || options.length === 0) return;

  // optionName::value -> valueId, used to resolve variant input below.
  const valueIdByKey = new Map<string, string>();

  for (const [index, option] of options.entries()) {
    const created = await tx.productOption.create({
      data: {
        productId,
        name: option.name,
        position: index,
        values: {
          create: option.values.map((value, valueIndex) => ({
            value,
            position: valueIndex,
          })),
        },
      },
      include: { values: true },
    });

    for (const value of created.values) {
      valueIdByKey.set(`${option.name}::${value.value}`, value.id);
    }
  }

  if (!variants || variants.length === 0) return;

  for (const variant of variants) {
    const optionValueIds: string[] = [];

    for (const [optionName, value] of Object.entries(variant.optionValues)) {
      const valueId = valueIdByKey.get(`${optionName}::${value}`);
      if (!valueId) {
        throw new AppError(
          400,
          `Variant references unknown option value: ${optionName} = ${value}`
        );
      }
      optionValueIds.push(valueId);
    }

    await tx.productVariant.create({
      data: {
        productId,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        image: variant.image,
        optionValues: { connect: optionValueIds.map((id) => ({ id })) },
      },
    });
  }
};

const createProduct = async (payload: CreateProductInput) => {
  await assertCategoriesExist(payload.categoryIds);
  const slug = await generateUniqueSlug(payload.name, slugExists());

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: payload.name,
        slug,
        shortDescription: payload.shortDescription,
        description: payload.description,
        sku: payload.sku,
        brand: payload.brand,
        price: payload.price,
        compareAtPrice: payload.compareAtPrice,
        stock: payload.stock,
        isActive: payload.isActive,
        isFeatured: payload.isFeatured,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        categories: { connect: payload.categoryIds.map((id) => ({ id })) },
        images: { create: payload.images },
        attributes: { create: payload.attributes },
      },
    });

    await createOptionsAndVariants(tx as unknown as typeof prisma, product.id, payload.options, payload.variants);

    return tx.product.findUniqueOrThrow({
      where: { id: product.id },
      include: PRODUCT_DETAIL_INCLUDE,
    });
  });
};

const getProducts = async (query: ProductQueryInput) => {
  const { page, limit, search, categorySlug, minPrice, maxPrice, isFeatured, sort } = query;

  const where = {
    isActive: true,
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(categorySlug ? { categories: { some: { slug: categorySlug } } } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        categories: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_DETAIL_INCLUDE,
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  // Aggregate rating for schema.org AggregateRating (SEO structured data)
  const [ratingAgg, ratingDistribution] = await Promise.all([
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId: product.id },
      _count: { rating: true },
    }),
  ]);

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of ratingDistribution) {
    distribution[row.rating] = row._count.rating;
  }

  return {
    ...product,
    aggregateRating: {
      ratingValue: ratingAgg._avg.rating
        ? parseFloat(ratingAgg._avg.rating.toFixed(1))
        : 0,
      reviewCount: ratingAgg._count.rating,
      ratingDistribution: distribution,
    },
  };
};

const updateProduct = async (id: string, payload: UpdateProductInput) => {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new AppError(404, "Product not found");
  }

  if (payload.categoryIds) {
    await assertCategoriesExist(payload.categoryIds);
  }

  let slug = existing.slug;
  if (payload.name && payload.name !== existing.name) {
    slug = await generateUniqueSlug(payload.name, slugExists(id));
  }

  // Delete old images from Cloudinary if new images are provided
  if (payload.images && existing.images.length > 0) {
    const publicIds = existing.images.map((img) => img.publicId);
    await UploadService.bulkDeleteImages(publicIds).catch((err) => {
      console.error(`Failed to delete old images for product ${id}:`, err);
      // Continue with update even if image deletion fails
    });
  }

  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: payload.name,
        slug,
        shortDescription: payload.shortDescription,
        description: payload.description,
        sku: payload.sku,
        brand: payload.brand,
        price: payload.price,
        compareAtPrice: payload.compareAtPrice,
        stock: payload.stock,
        isActive: payload.isActive,
        isFeatured: payload.isFeatured,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        ...(payload.categoryIds
          ? { categories: { set: payload.categoryIds.map((cid) => ({ id: cid })) } }
          : {}),
      },
    });

    // Images/attributes/options/variants are replaced wholesale when
    // provided, rather than diffed, to keep the update logic simple and
    // predictable for an admin form that resubmits the full product.
    if (payload.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: payload.images.map((img) => ({ ...img, productId: id })),
      });
    }

    if (payload.attributes) {
      await tx.productAttribute.deleteMany({ where: { productId: id } });
      await tx.productAttribute.createMany({
        data: payload.attributes.map((attr) => ({ ...attr, productId: id })),
      });
    }

    if (payload.options) {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.productOption.deleteMany({ where: { productId: id } });
      await createOptionsAndVariants(tx as unknown as typeof prisma, id, payload.options, payload.variants);
    }

    return tx.product.findUniqueOrThrow({
      where: { id },
      include: PRODUCT_DETAIL_INCLUDE,
    });
  });
};

const deleteProduct = async (id: string) => {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new AppError(404, "Product not found");
  }

  // Bulk delete images from Cloudinary before deleting from DB
  if (existing.images && existing.images.length > 0) {
    const publicIds = existing.images.map((img) => img.publicId);
    await UploadService.bulkDeleteImages(publicIds).catch((err) => {
      console.error(`Failed to delete images for product ${id}:`, err);
      // Continue with DB deletion even if image deletion fails
    });
  }

  await prisma.product.delete({ where: { id } });
};

export const ProductService = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};

EOF_APPS_API_SRC_APP_MODULES_PRODUCT_PRODUCT_SERVICE_TS

echo "✍️  Writing packages/database/prisma/schema.prisma..."
mkdir -p "$(dirname "packages/database/prisma/schema.prisma")"
cat > 'packages/database/prisma/schema.prisma' << 'EOF_PACKAGES_DATABASE_PRISMA_SCHEMA_PRISMA'
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ---------- Enums ----------

enum AuthProvider {
  CREDENTIALS
  GOOGLE
  FACEBOOK
  APPLE
}


enum UserRole {
  CUSTOMER
  MANAGER      // orders & customers — read/update only
  EDITOR       // products & categories — full CRUD
  ADMIN        // all of the above
  SUPER_ADMIN  // can create/demote other admins
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// ---------- Auth ----------

model User {
  id            String         @id @default(cuid())
  name          String
  email         String         @unique
  password      String?
  phone         String?
  avatar        String?
  gender        Gender?
  dateOfBirth   DateTime?
  role          UserRole        @default(CUSTOMER)
  emailVerified Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  accounts      SocialAccount[]
  refreshTokens RefreshToken[]
  addresses     Address[]
  cart          Cart?
  orders        Order[]
  deviceTokens  DeviceToken[]
  productViews  ProductView[]
  categoryInterests UserCategoryInterest[]
  reviews       Review[]
  reviewReactions ReviewReaction[]
  reviewReplies ReviewReply[]
  reviewReplyReactions ReviewReplyReaction[]

  @@map("users")
}

model SocialAccount {
  id         String       @id @default(cuid())
  provider   AuthProvider
  providerId String
  userId     String
  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime     @default(now())

  @@unique([provider, providerId])
  @@map("social_accounts")
}

/// Doubles as a "session" record - one row per login. Kept (not deleted)
/// on logout via `revokedAt` so login history is preserved.
model RefreshToken {
  id           String    @id @default(cuid())
  token        String    @unique
  userId       String
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  ipAddress    String?
  country      String?
  city         String?
  deviceType   String?   // mobile | desktop | tablet
  browser      String?
  os           String?

  lastActiveAt DateTime  @default(now())
  revokedAt    DateTime?

  expiresAt    DateTime
  createdAt    DateTime  @default(now())

  @@map("refresh_tokens")
}

model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String
  line1      String
  line2      String?
  city       String
  district   String?
  postalCode String?
  phone      String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())

  orders     Order[]

  @@map("addresses")
}

// ---------- Catalog ----------

model Category {
  id            String     @id @default(cuid())
  name          String
  slug          String     @unique
  description   String?
  image         String?
  imagePublicId String?
  position      Int        @default(0)
  isActive      Boolean    @default(true)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  parentId      String?
  parent        Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children      Category[] @relation("CategoryHierarchy")

  products      Product[]  @relation("ProductCategories")
  userInterests UserCategoryInterest[]

  @@map("categories")
}

model Product {
  id               String              @id @default(cuid())
  name             String
  slug             String              @unique
  shortDescription String?
  description      String
  sku              String?             @unique
  brand            String?
  price            Decimal             @db.Decimal(10, 2)
  compareAtPrice   Decimal?            @db.Decimal(10, 2)
  stock            Int                 @default(0)
  isActive         Boolean             @default(true)
  isFeatured       Boolean             @default(false)
  metaTitle        String?
  metaDescription  String?

  categories       Category[]          @relation("ProductCategories")
  images           ProductImage[]
  options          ProductOption[]
  variants         ProductVariant[]
  attributes       ProductAttribute[]
  cartItems        CartItem[]
  orderItems       OrderItem[]
  views            ProductView[]
  reviews          Review[]

  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  @@map("products")
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  publicId  String
  position  Int     @default(0)

  @@map("product_images")
}

/// A configurable option for a product, e.g. "Color", "Size", "Length".
model ProductOption {
  id        String              @id @default(cuid())
  productId String
  product   Product             @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String
  position  Int                 @default(0)
  values    ProductOptionValue[]

  @@unique([productId, name])
  @@map("product_options")
}

/// A single value for an option, e.g. "White" for "Color", "M" for "Size".
model ProductOptionValue {
  id       String          @id @default(cuid())
  optionId String
  option   ProductOption   @relation(fields: [optionId], references: [id], onDelete: Cascade)
  value    String
  position Int             @default(0)
  variants ProductVariant[] @relation("VariantOptionValues")

  @@unique([optionId, value])
  @@map("product_option_values")
}

/// A specific purchasable combination of option values (e.g. White + M).
/// Simple products (no options) don't need any variant rows - the base
/// Product's own price/stock is used directly in that case.
model ProductVariant {
  id           String               @id @default(cuid())
  productId    String
  product      Product              @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku          String?              @unique
  price        Decimal?             @db.Decimal(10, 2)
  stock        Int                  @default(0)
  image        String?
  optionValues ProductOptionValue[] @relation("VariantOptionValues")
  cartItems    CartItem[]
  orderItems   OrderItem[]

  @@map("product_variants")
}

/// Flexible key-value spec, e.g. ("Material", "100% Cotton"),
/// ("Scent", "Oud"), ("Country of Origin", "Bangladesh"). Lets very
/// different product types (clothing vs. prayer items) carry their own
/// relevant specs without the schema needing a fixed field per type.
model ProductAttribute {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  key       String
  value     String
  position  Int     @default(0)

  @@map("product_attributes")
}

// ---------- Cart ----------

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  updatedAt DateTime   @updatedAt

  @@map("carts")
}

model CartItem {
  id        String          @id @default(cuid())
  cartId    String
  cart      Cart            @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product         @relation(fields: [productId], references: [id])
  variantId String?
  variant   ProductVariant? @relation(fields: [variantId], references: [id])
  quantity  Int             @default(1)

  @@unique([cartId, productId, variantId])
  @@map("cart_items")
}

// ---------- Orders & Payment ----------

model Order {
  id           String        @id @default(cuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  addressId    String
  address      Address       @relation(fields: [addressId], references: [id])
  items        OrderItem[]
  payment      Payment?
  status       OrderStatus   @default(PENDING)
  subtotal     Decimal       @db.Decimal(10, 2)
  total        Decimal       @db.Decimal(10, 2)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@map("orders")
}

model OrderItem {
  id         String          @id @default(cuid())
  orderId    String
  order      Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String
  product    Product         @relation(fields: [productId], references: [id])
  variantId  String?
  variant    ProductVariant? @relation(fields: [variantId], references: [id])
  quantity   Int
  unitPrice  Decimal         @db.Decimal(10, 2)

  @@map("order_items")
}

model Payment {
  id            String        @id @default(cuid())
  orderId       String        @unique
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status        PaymentStatus @default(PENDING)
  method        String        @default("sslcommerz")
  transactionId String?       @unique
  amount        Decimal       @db.Decimal(10, 2)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("payments")
}

// ---------- Notifications ----------

model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  platform  String
  createdAt DateTime @default(now())

  @@map("device_tokens")
}

// ---------- Behavior tracking ----------

/// Raw log of a product detail page view. userId is nullable so guest
/// browsing can be tracked too once a guest/anonymous id is added later.
model ProductView {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  viewedAt  DateTime @default(now())

  @@map("product_views")
}

/// Pre-aggregated per-user, per-category view counter, updated whenever
/// a ProductView is recorded. Querying this directly (rather than
/// aggregating ProductView on the fly) is what makes "Recommended for
/// you" cheap to compute.
model UserCategoryInterest {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  viewCount    Int      @default(0)
  lastViewedAt DateTime @default(now())

  @@unique([userId, categoryId])
  @@map("user_category_interests")
}

// ---------- Reviews ----------

enum ReactionType {
  LIKE
  HELPFUL
  LOVE
}

/// A customer review on a product. One review per user per product.
/// averageRating & totalReviews are computed at query time from this
/// table so they never drift out of sync with the actual data.
model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  rating    Int      // 1–5, validated in application layer
  title     String?
  body      String?

  replies   ReviewReply[]
  reactions ReviewReaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([productId, userId]) // one review per user per product
  @@map("reviews")
}

/// Reaction on a root Review (LIKE, HELPFUL, LOVE).
/// One reaction type per user per review enforced by @@unique.
model ReviewReaction {
  id       String       @id @default(cuid())
  reviewId String
  review   Review       @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId   String
  user     User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  type     ReactionType

  createdAt DateTime @default(now())

  @@unique([reviewId, userId, type])
  @@map("review_reactions")
}

/// Hierarchical reply tree under a Review.
/// parentId = null  →  top-level reply (direct reply to the review)
/// parentId = someId → nested reply (reply to another reply)
/// depth is not capped in schema; application layer limits to 3 levels.
model ReviewReply {
  id       String  @id @default(cuid())
  reviewId String
  review   Review  @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId   String
  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  body     String

  parentId String?
  parent   ReviewReply?  @relation("ReplyHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children ReviewReply[] @relation("ReplyHierarchy")

  reactions ReviewReplyReaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("review_replies")
}

/// Reaction on a ReviewReply (LIKE only — simpler for nested comments).
model ReviewReplyReaction {
  id      String      @id @default(cuid())
  replyId String
  reply   ReviewReply @relation(fields: [replyId], references: [id], onDelete: Cascade)
  userId  String
  user    User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  type    ReactionType

  createdAt DateTime @default(now())

  @@unique([replyId, userId, type])
  @@map("review_reply_reactions")
}

EOF_PACKAGES_DATABASE_PRISMA_SCHEMA_PRISMA

echo "✅ All files written!"
echo ""
echo "Now run:"
echo "  git add ."
echo "  git commit -m \"feat(api): add hierarchical review & rating system\""
echo "  git push origin development"
echo "  cd apps/api && pnpm prisma migrate dev --name add_review_system"