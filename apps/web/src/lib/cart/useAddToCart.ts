import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addItem, type CartItem } from "../redux/slices/cartSlice";
import { setCart } from "../redux/slices/cartSlice";
import { useAddCartItemMutation } from "../redux/api/cartApi";
import { mapCartResponseToItems } from "./mapCartResponse";

export type AddToCartInput = Omit<CartItem, "id" | "quantity"> & { quantity?: number };

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.accessToken));
  const [addCartItem] = useAddCartItemMutation();

  return async (input: AddToCartInput) => {
    const quantity = input.quantity ?? 1;

    // Instant, optimistic update — this is what makes "Add to Bag" feel
    // immediate regardless of network speed or whether the user is even
    // logged in. The server is the source of truth, but only once it
    // actually answers.
    dispatch(
      addItem({
        productId: input.productId,
        variantId: input.variantId,
        name: input.name,
        slug: input.slug,
        image: input.image,
        price: input.price,
        quantity,
      })
    );

    if (!isAuthenticated) return;

    try {
      const cart = await addCartItem({
        productId: input.productId,
        variantId: input.variantId,
        quantity,
      }).unwrap();

      // Replace the optimistic guess with server truth (real stock-checked
      // quantity, and the server item id needed for later update/remove).
      dispatch(setCart(mapCartResponseToItems(cart)));
    } catch {
      // The optimistic local item stands; the next successful sync
      // (e.g. opening the cart drawer, which refetches) will reconcile
      // it. A toast here would be a nice future addition.
    }
  };
}
