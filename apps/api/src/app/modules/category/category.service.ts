import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
} from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";
import { buildCategoryTree } from "../../utils/buildCategoryTree.js";
import { UploadService } from "../upload/upload.service.js";

const slugExists = (excludeId?: string) => async (slug: string) => {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
};

const assertParentExists = async (parentId: string) => {
  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) {
    throw new AppError(404, "Parent category not found");
  }
};

const createCategory = async (payload: CreateCategoryInput) => {
  if (payload.parentId) {
    await assertParentExists(payload.parentId);
  }

  const slug = await generateUniqueSlug(payload.name, slugExists());

  return prisma.category.create({
    data: { ...payload, slug },
  });
};

const getCategoryTree = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });

  return buildCategoryTree(categories);
};

const getFeaturedCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      position: true,
      _count: { select: { products: true } },
    },
  });
};

const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { where: { isActive: true }, orderBy: { position: "asc" } } },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const breadcrumb: { id: string; name: string; slug: string }[] = [];
  let currentParentId = category.parentId;

  while (currentParentId) {
    const parent = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { id: true, name: true, slug: true, parentId: true },
    });
    if (!parent) break;
    breadcrumb.unshift({ id: parent.id, name: parent.name, slug: parent.slug });
    currentParentId = parent.parentId;
  }

  return { category, breadcrumb };
};

const updateCategory = async (id: string, payload: UpdateCategoryInput) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Category not found");
  }

  if (payload.parentId) {
    if (payload.parentId === id) {
      throw new AppError(400, "A category cannot be its own parent");
    }
    await assertParentExists(payload.parentId);
  }

  let slug = existing.slug;
  if (payload.name && payload.name !== existing.name) {
    slug = await generateUniqueSlug(payload.name, slugExists(id));
  }

  if (payload.image && existing.imagePublicId) {
    await UploadService.deleteSingleImage(existing.imagePublicId).catch((err) => {
      console.error(`Failed to delete old image for category ${id}:`, err);
    });
  }

  return prisma.category.update({
    where: { id },
    data: { ...payload, slug },
  });
};

const deleteCategory = async (id: string) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Category not found");
  }

  if (existing.imagePublicId) {
    await UploadService.deleteSingleImage(existing.imagePublicId).catch((err) => {
      console.error(`Failed to delete image for category ${id}:`, err);
    });
  }

  await prisma.category.delete({ where: { id } });
};

const reorderCategories = async (payload: ReorderCategoriesInput) => {
  await prisma.$transaction(
    payload.items.map((item) =>
      prisma.category.update({
        where: { id: item.id },
        data: { position: item.position, parentId: item.parentId ?? null },
      })
    )
  );
};

export const CategoryService = {
  createCategory,
  getCategoryTree,
  getFeaturedCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories,
};
