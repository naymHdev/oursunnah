import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/**
 * Carts store a small snapshot of the product (name/price/image) instead
 * of just an id, so the cart drawer renders instantly from Redux state
 * without an extra fetch per item. `price` is captured at add-time; the
 * checkout step re-validates current price/stock against the API before
 * payment, so a stale snapshot here is a UX-only concern, not a money one.
 */
export type CartItem = {
  /** Present once this line has been synced to the server cart (i.e.
   *  for any logged-in user after their first add/merge). Absent for
   *  guest-only items that exist purely in localStorage. */
  id?: string;
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const sameLine = (a: CartItem, b: { productId: string; variantId: string | null }) =>
  a.productId === b.productId && a.variantId === b.variantId;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => sameLine(item, action.payload));

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    removeItem: (
      state,
      action: PayloadAction<{ productId: string; variantId: string | null }>
    ) => {
      state.items = state.items.filter((item) => !sameLine(item, action.payload));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId: string | null; quantity: number }>
    ) => {
      const item = state.items.find((line) => sameLine(line, action.payload));
      if (!item) return;

      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((line) => line !== item);
      } else {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    /** Replaces the whole cart — used when hydrating from localStorage on
     *  app start, or after merging the guest cart into the server cart
     *  on login. */
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

// ---------- Selectors ----------

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
