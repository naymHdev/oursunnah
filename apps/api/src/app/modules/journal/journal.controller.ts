import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { JournalService } from "./journal.service.js";
import {
  createJournalPostSchema,
  updateJournalPostSchema,
  journalQuerySchema,
} from "@our-sunnah/validation";
import AppError from "../../error/AppError.js";

// ── Posts ──────────────────────────────────────────────────────────────────────

const createPost = catchAsync(async (req: Request, res: Response) => {
  // Multipart: Content-Type: multipart/form-data, data field (JSON stringified) + image file
  const formData = JSON.parse(req.body.data || "{}");
  const payload = createJournalPostSchema.parse(formData);

  const post = await JournalService.createPost(req.userId!, payload, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Journal post created successfully",
    data: post,
  });
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const query = journalQuerySchema.parse(req.query);

  const staffRoles = ["EDITOR", "ADMIN", "SUPER_ADMIN"];
  const isStaff = !!req.userRole && staffRoles.includes(req.userRole);

  const { items, meta } = await JournalService.getPosts(query, isStaff);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Journal posts retrieved successfully",
    meta,
    data: items,
  });
});

const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await JournalService.getPostBySlug(req.params.slug, req.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Journal post retrieved successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const formData = req.file ? JSON.parse(req.body.data || "{}") : req.body;
  const payload = updateJournalPostSchema.parse(formData);

  const post = await JournalService.updatePost(
    req.params.id,
    req.userId!,
    req.userRole!,
    payload,
    req.file
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Journal post updated successfully",
    data: post,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  await JournalService.deletePost(req.params.id, req.userId!, req.userRole!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Journal post deleted successfully",
    data: null,
  });
});

// ── Comments ───────────────────────────────────────────────────────────────────

const getComments = catchAsync(async (req: Request, res: Response) => {
  const comments = await JournalService.getComments(req.params.postId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await JournalService.createComment(
    req.params.postId,
    req.userId!,
    req.body
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Comment submitted and pending moderation",
    data: comment,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await JournalService.updateComment(
    req.params.commentId,
    req.userId!,
    req.userRole!,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  await JournalService.deleteComment(
    req.params.commentId,
    req.userId!,
    req.userRole!
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

const moderateComment = catchAsync(async (req: Request, res: Response) => {
  if (!req.body?.status) {
    throw new AppError(400, "status is required");
  }
  const comment = await JournalService.moderateComment(
    req.params.commentId,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment moderated successfully",
    data: comment,
  });
});

export const JournalController = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};
