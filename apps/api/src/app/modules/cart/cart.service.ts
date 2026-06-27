import type { MergeCartInput } from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";

const CART_ITEM_INCLUDE = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      isActive: true,
      images: { orderBy: { position: "asc" as const }, take: 1 },
    },
  },
  variant: {
    select: {
      id: true,
      price: true,
      stock: true,
      image: true,
      optionValues: {
        include: { option: { select: { name: true } } },
      },
    },
  },
};

const CART_INCLUDE = {
  items: { include: CART_ITEM_INCLUDE, orderBy: { id: "asc" as const } },
};

/** Every user has at most one cart; created lazily on first touch. */
const getOrCreateCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: CART_INCLUDE,
  });

  if (cart) return cart;

  return prisma.cart.create({
    data: { userId },
    include: CART_INCLUDE,
  });
};

/**
 * Loads the product/variant being added and validates it's actually
 * purchasable: exists, active, and has enough stock for the requested
 * total quantity (existing line quantity + the new amount).
 */
const assertPurchasable = async (
  productId: string,
  variantId: string | null | undefined,
  requestedQuantity: number
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.isActive) {
    throw new AppError(404, "Product not found");
  }

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });

    if (!variant || variant.productId !== productId) {
      throw new AppError(404, "Product variant not found");
    }

    if (variant.stock < requestedQuantity) {
      throw new AppError(400, `Only ${variant.stock} of this option left in stock`);
    }

    return;
  }

  if (product.stock < requestedQuantity) {
    throw new AppError(400, `Only ${product.stock} left in stock`);
  }
};

const getCart = async (userId: string) => getOrCreateCart(userId);

/**
 * Adds a line, or increments quantity if the same product+variant
 * combination is already in the cart. Matched manually (rather than a
 * DB-level upsert on the [cartId, productId, variantId] unique index)
 * because Postgres treats every NULL as distinct, so two cart items
 * with the same productId and variantId = NULL would NOT collide on
 * that index — manual lookup is what actually enforces "one line per
 * product+variant" when variantId is absent.
 */
const addItem = async (
  userId: string,
  input: { productId: string; variantId?: string | null; quantity: number }
) => {
  const variantId = input.variantId ?? null;
  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: input.productId, variantId },
  });

  const totalQuantity = (existing?.quantity ?? 0) + input.quantity;
  await assertPurchasable(input.productId, variantId, totalQuantity);

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: totalQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: input.productId, variantId, quantity: input.quantity },
    });
  }

  return getOrCreateCart(userId);
};

const assertOwnedItem = async (userId: string, itemId: string) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new AppError(404, "Cart item not found");
  }

  return item;
};

const updateItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  const item = await assertOwnedItem(userId, itemId);

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getOrCreateCart(userId);
  }

  await assertPurchasable(item.productId, item.variantId, quantity);
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

  return getOrCreateCart(userId);
};

const removeItem = async (userId: string, itemId: string) => {
  await assertOwnedItem(userId, itemId);
  await prisma.cartItem.delete({ where: { id: itemId } });
  return getOrCreateCart(userId);
};

const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getOrCreateCart(userId);
};

/**
 * Folds a guest's localStorage cart into their server cart right after
 * login. Quantities are summed line-by-line (not replaced), and stock
 * limits are clamped rather than rejected outright — a stale guest
 * cart shouldn't block login, it should just merge as best it can.
 */
const mergeCart = async (userId: string, input: MergeCartInput) => {
  const cart = await getOrCreateCart(userId);

  for (const line of input.items) {
    const variantId = line.variantId ?? null;

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: line.productId, variantId },
    });

    const product = await prisma.product.findUnique({ where: { id: line.productId } });
    if (!product || !product.isActive) continue;

    const variant = variantId
      ? await prisma.productVariant.findUnique({ where: { id: variantId } })
      : null;
    if (variantId && (!variant || variant.productId !== line.productId)) continue;

    const availableStock = variant ? variant.stock : product.stock;
    const desiredQuantity = (existing?.quantity ?? 0) + line.quantity;
    const finalQuantity = Math.min(desiredQuantity, availableStock);

    if (finalQuantity <= 0) continue;

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: finalQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: line.productId, variantId, quantity: finalQuantity },
      });
    }
  }

  return getOrCreateCart(userId);
};

export const CartService = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  mergeCart,
};
