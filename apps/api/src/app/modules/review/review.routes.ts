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

