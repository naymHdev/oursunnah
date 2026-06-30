import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";
import { UploadService } from "../upload/upload.service.js";
import type {
  CreateJournalPostInput,
  UpdateJournalPostInput,
  JournalQueryInput,
  CreateJournalCommentInput,
  UpdateJournalCommentInput,
  ModerateCommentInput,
} from "@our-sunnah/validation";

// ── Slug helpers ───────────────────────────────────────────────────────────────

const slugExists = (excludeId?: string) => async (slug: string) => {
  const existing = await prisma.journalPost.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
};

// ── Shared selects ─────────────────────────────────────────────────────────────

const POST_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  category: true,
  status: true,
  publishedAt: true,
  readTimeMinutes: true,
  hijriMonth: true,
  hijriYear: true,
  tags: true,
  views: true,
  createdAt: true,
  author: {
    select: { id: true, name: true, avatar: true },
  },
  _count: { select: { comments: true } },
} as const;

const POST_DETAIL_INCLUDE = {
  author: {
    select: { id: true, name: true, avatar: true },
  },
  _count: { select: { comments: true } },
} as const;

// ── Posts ──────────────────────────────────────────────────────────────────────

const createPost = async (
  authorId: string,
  payload: CreateJournalPostInput,
  file?: Express.Multer.File
) => {
  if (!file) {
    throw new AppError(400, "Featured image is required");
  }

  const uploadResult = await UploadService.uploadSingleImage(file, "journal");
  const slug = await generateUniqueSlug(payload.title, slugExists());

  const publishedAt =
    payload.status === "PUBLISHED" ? new Date() : undefined;

  const post = await prisma.journalPost.create({
    data: {
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      featuredImage: uploadResult.url,
      imagePublicId: uploadResult.publicId,
      category: payload.category,
      authorId,
      status: payload.status ?? "DRAFT",
      readTimeMinutes: payload.readTimeMinutes ?? 5,
      hijriMonth: payload.hijriMonth,
      hijriYear: payload.hijriYear,
      tags: payload.tags ?? [],
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      publishedAt,
    },
    include: POST_DETAIL_INCLUDE,
  });

  return post;
};

const getPosts = async (query: JournalQueryInput, isStaff = false) => {
  const { page, limit, category, status, tag, search, sort } = query;

  const where: Record<string, unknown> = {
    // Public visitors only see PUBLISHED posts; staff can filter by status
    ...(isStaff
      ? status
        ? { status }
        : {}
      : { status: "PUBLISHED" }),
    ...(category ? { category } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { publishedAt: "asc" as const }
      : sort === "popular"
        ? { views: "desc" as const }
        : { publishedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.journalPost.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: POST_LIST_SELECT,
    }),
    prisma.journalPost.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

const getPostBySlug = async (slug: string, userId?: string) => {
  const post = await prisma.journalPost.findUnique({
    where: { slug },
    include: POST_DETAIL_INCLUDE,
  });

  if (!post) {
    throw new AppError(404, "Journal post not found");
  }

  // Guests and non-staff can only see published posts
  if (post.status !== "PUBLISHED") {
    if (!userId) throw new AppError(404, "Journal post not found");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    const staffRoles = ["EDITOR", "ADMIN", "SUPER_ADMIN"];
    if (!user || !staffRoles.includes(user.role)) {
      throw new AppError(404, "Journal post not found");
    }
  }

  // Fire-and-forget view increment (non-blocking)
  prisma.journalPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch((err) => console.error("Failed to increment post views:", err));

  return post;
};

const updatePost = async (
  id: string,
  authorId: string,
  authorRole: string,
  payload: UpdateJournalPostInput,
  file?: Express.Multer.File
) => {
  const existing = await prisma.journalPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal post not found");

  // Only author, ADMIN, or SUPER_ADMIN can update
  const staffRoles = ["ADMIN", "SUPER_ADMIN"];
  if (existing.authorId !== authorId && !staffRoles.includes(authorRole)) {
    throw new AppError(403, "You do not have permission to update this post");
  }

  let featuredImage = existing.featuredImage;
  let imagePublicId = existing.imagePublicId;

  if (file) {
    // Delete old image from Cloudinary
    if (existing.imagePublicId) {
      await UploadService.deleteSingleImage(existing.imagePublicId).catch((err) =>
        console.error("Failed to delete old featured image:", err)
      );
    }
    const uploadResult = await UploadService.uploadSingleImage(file, "journal");
    featuredImage = uploadResult.url;
    imagePublicId = uploadResult.publicId;
  }

  let slug = existing.slug;
  if (payload.title && payload.title !== existing.title) {
    slug = await generateUniqueSlug(payload.title, slugExists(id));
  }

  // Set publishedAt when transitioning to PUBLISHED for the first time
  let publishedAt = existing.publishedAt;
  if (payload.status === "PUBLISHED" && !existing.publishedAt) {
    publishedAt = new Date();
  }

  const updated = await prisma.journalPost.update({
    where: { id },
    data: {
      ...payload,
      slug,
      featuredImage,
      imagePublicId,
      publishedAt,
    },
    include: POST_DETAIL_INCLUDE,
  });

  return updated;
};

const deletePost = async (id: string, authorId: string, authorRole: string) => {
  const existing = await prisma.journalPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal post not found");

  const staffRoles = ["ADMIN", "SUPER_ADMIN"];
  if (existing.authorId !== authorId && !staffRoles.includes(authorRole)) {
    throw new AppError(403, "You do not have permission to delete this post");
  }

  // Delete featured image from Cloudinary
  if (existing.imagePublicId) {
    await UploadService.deleteSingleImage(existing.imagePublicId).catch((err) =>
      console.error("Failed to delete featured image from Cloudinary:", err)
    );
  }

  await prisma.journalPost.delete({ where: { id } });
};

// ── Comments ───────────────────────────────────────────────────────────────────

/** Recursively shape a flat comment list into a nested tree (max 3 levels). */
const buildCommentTree = (
  comments: Array<{
    id: string;
    body: string;
    status: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; name: string; avatar: string | null };
    children?: unknown[];
  }>,
  parentId: string | null = null,
  depth = 0
): unknown[] => {
  if (depth >= 3) return [];
  return comments
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      children: buildCommentTree(comments, c.id, depth + 1),
    }));
};

const getComments = async (postId: string) => {
  const post = await prisma.journalPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new AppError(404, "Journal post not found");

  const comments = await prisma.journalComment.findMany({
    where: { postId, status: "approved" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      status: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  return buildCommentTree(comments);
};

const createComment = async (
  postId: string,
  authorId: string,
  payload: CreateJournalCommentInput
) => {
  const post = await prisma.journalPost.findUnique({
    where: { id: postId, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!post) throw new AppError(404, "Journal post not found or not published");

  // Validate parentId if provided
  if (payload.parentId) {
    const parent = await prisma.journalComment.findUnique({
      where: { id: payload.parentId, postId },
      select: { id: true },
    });
    if (!parent) throw new AppError(404, "Parent comment not found");
  }

  const comment = await prisma.journalComment.create({
    data: {
      postId,
      authorId,
      body: payload.body,
      parentId: payload.parentId ?? null,
      status: "pending", // all new comments pending moderation
    },
    select: {
      id: true,
      body: true,
      status: true,
      parentId: true,
      createdAt: true,
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  return comment;
};

const updateComment = async (
  commentId: string,
  authorId: string,
  authorRole: string,
  payload: UpdateJournalCommentInput
) => {
  const comment = await prisma.journalComment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new AppError(404, "Comment not found");

  const staffRoles = ["ADMIN", "SUPER_ADMIN"];
  if (comment.authorId !== authorId && !staffRoles.includes(authorRole)) {
    throw new AppError(403, "You do not have permission to update this comment");
  }

  const updated = await prisma.journalComment.update({
    where: { id: commentId },
    data: { body: payload.body },
    select: {
      id: true,
      body: true,
      status: true,
      parentId: true,
      updatedAt: true,
    },
  });

  return updated;
};

const deleteComment = async (
  commentId: string,
  authorId: string,
  authorRole: string
) => {
  const comment = await prisma.journalComment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new AppError(404, "Comment not found");

  const staffRoles = ["ADMIN", "SUPER_ADMIN"];
  if (comment.authorId !== authorId && !staffRoles.includes(authorRole)) {
    throw new AppError(403, "You do not have permission to delete this comment");
  }

  // Cascade handled by Prisma schema (onDelete: Cascade on children)
  await prisma.journalComment.delete({ where: { id: commentId } });
};

const moderateComment = async (
  commentId: string,
  payload: ModerateCommentInput
) => {
  const comment = await prisma.journalComment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new AppError(404, "Comment not found");

  return prisma.journalComment.update({
    where: { id: commentId },
    data: { status: payload.status },
    select: { id: true, status: true },
  });
};

// ── Exports ────────────────────────────────────────────────────────────────────

export const JournalService = {
  // Posts
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  // Comments
  getComments,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};
