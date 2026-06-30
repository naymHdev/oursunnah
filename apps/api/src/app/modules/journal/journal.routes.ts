import { Router } from "express";
import { JournalController } from "./journal.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { uploadSingle, handleMulterErrors } from "../upload/upload.middleware.js";
import {
  createJournalCommentSchema,
  updateJournalCommentSchema,
  moderateCommentSchema,
} from "@our-sunnah/validation";

const router = Router();

// ── Posts — public (storefront) ─────────────────────────────────────────────────
// optionalAuth lets staff preview DRAFT/ARCHIVED posts while guests only see PUBLISHED
router.get("/", optionalAuth(), JournalController.getPosts);
router.get("/:slug", optionalAuth(), JournalController.getPostBySlug);

// ── Posts — protected (EDITOR, ADMIN, SUPER_ADMIN) ──────────────────────────────
// Multipart: Content-Type: multipart/form-data, data field (JSON stringified) + image field (file)
router.post(
  "/",
  auth("EDITOR"),
  uploadSingle,
  handleMulterErrors,
  JournalController.createPost
);

router.patch(
  "/:id",
  auth("EDITOR"),
  uploadSingle,
  handleMulterErrors,
  JournalController.updatePost
);

router.delete("/:id", auth("EDITOR"), JournalController.deletePost);

// ── Comments — nested under /journal/:postId/comments ──────────────────────────

router.get("/:postId/comments", JournalController.getComments);

router.post(
  "/:postId/comments",
  auth(), // any logged-in user
  validateRequest(createJournalCommentSchema),
  JournalController.createComment
);

router.patch(
  "/:postId/comments/:commentId",
  auth(), // service checks ownership; ADMIN/SUPER_ADMIN can edit any
  validateRequest(updateJournalCommentSchema),
  JournalController.updateComment
);

router.delete(
  "/:postId/comments/:commentId",
  auth(), // service checks ownership; ADMIN/SUPER_ADMIN can delete any
  JournalController.deleteComment
);

// ── Comment moderation (EDITOR, ADMIN, SUPER_ADMIN) ─────────────────────────────

router.patch(
  "/:postId/comments/:commentId/moderate",
  auth("EDITOR"),
  validateRequest(moderateCommentSchema),
  JournalController.moderateComment
);

export const JournalRoutes = router;
