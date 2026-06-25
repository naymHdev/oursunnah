import { prisma } from "../../../shared/prisma.js";

/**
 * Records a product view and, if the viewer is a logged-in user, bumps
 * their interest counter for every category that product belongs to.
 * Fire-and-forget from the caller's perspective - a tracking failure
 * should never break the page response.
 */
const recordProductView = async (params: { userId?: string; productId: string }) => {
  const { userId, productId } = params;

  await prisma.productView.create({
    data: { userId, productId },
  });

  if (!userId) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categories: { select: { id: true } } },
  });

  if (!product) return;

  await Promise.all(
    product.categories.map((category) =>
      prisma.userCategoryInterest.upsert({
        where: { userId_categoryId: { userId, categoryId: category.id } },
        create: { userId, categoryId: category.id, viewCount: 1 },
        update: { viewCount: { increment: 1 }, lastViewedAt: new Date() },
      })
    )
  );
};

/**
 * Returns the user's top categories by view count - the basis for a
 * "Recommended for you" rail. Cheap because it reads the pre-aggregated
 * counter table instead of scanning ProductView.
 */
const getTopInterests = async (userId: string, take = 5) => {
  return prisma.userCategoryInterest.findMany({
    where: { userId },
    orderBy: { viewCount: "desc" },
    take,
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
};

export const AnalyticsService = {
  recordProductView,
  getTopInterests,
};
