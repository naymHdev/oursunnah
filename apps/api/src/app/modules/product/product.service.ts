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

