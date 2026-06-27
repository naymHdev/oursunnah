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

