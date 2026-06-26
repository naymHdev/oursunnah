import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type WishlistState = {
  productIds: string[];
};

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const index = state.productIds.indexOf(action.payload);
      if (index === -1) {
        state.productIds.push(action.payload);
      } else {
        state.productIds.splice(index, 1);
      }
    },

    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// ---------- Selectors ----------

export const selectWishlistIds = (state: RootState) => state.wishlist.productIds;

export const selectIsWishlisted = (productId: string) => (state: RootState) =>
  state.wishlist.productIds.includes(productId);
