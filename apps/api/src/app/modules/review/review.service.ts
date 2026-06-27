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

