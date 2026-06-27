import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateQuantity, removeItem, setCart, type CartItem } from "../redux/slices/cartSlice";
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from "../redux/api/cartApi";
import { mapCartResponseToItems } from "./mapCartResponse";

export function useCartLineActions() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.accessToken));
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const setLineQuantity = async (line: CartItem, quantity: number) => {
    dispatch(
      updateQuantity({ productId: line.productId, variantId: line.variantId, quantity })
    );

    // No server id yet means this line was never synced (shouldn't
    // normally happen for a logged-in user — see useAddToCart — but
    // guards against it regardless).
    if (!isAuthenticated || !line.id) return;

    try {
      const cart = await updateCartItem({ itemId: line.id, quantity }).unwrap();
      dispatch(setCart(mapCartResponseToItems(cart)));
    } catch {
      // optimistic state stands
    }
  };

  const removeLine = async (line: CartItem) => {
    dispatch(removeItem({ productId: line.productId, variantId: line.variantId }));

    if (!isAuthenticated || !line.id) return;

    try {
      const cart = await removeCartItem({ itemId: line.id }).unwrap();
      dispatch(setCart(mapCartResponseToItems(cart)));
    } catch {
      // optimistic state stands
    }
  };

  return { setLineQuantity, removeLine };
}
