import type { CartDto } from "@/types/catalog";
import type { CartItem } from "../redux/slices/cartSlice";

/**
 * The server cart includes full product/variant records (for stock
 * validation, display, etc). The Redux cart only needs a flat snapshot
 * per line so the drawer can render without further lookups — this is
 * the single place that does that translation, called after every
 * mutation that returns a fresh CartDto (add/update/remove/merge).
 */
export function mapCartResponseToItems(cart: CartDto): CartItem[] {
  return cart.items.map((line) => {
    const price = line.variant?.price ?? line.product.price;
    const image = line.variant?.image ?? line.product.images[0]?.url ?? null;

    return {
      id: line.id,
      productId: line.productId,
      variantId: line.variantId,
      name: line.product.name,
      slug: line.product.slug,
      image,
      price: Number(price),
      quantity: line.quantity,
    };
  });
}
