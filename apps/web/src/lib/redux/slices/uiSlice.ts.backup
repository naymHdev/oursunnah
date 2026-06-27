import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type UiState = {
  cartDrawerOpen: boolean;
};

const initialState: UiState = {
  cartDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false;
    },
  },
});

export const { openCartDrawer, closeCartDrawer } = uiSlice.actions;
export default uiSlice.reducer;

export const selectCartDrawerOpen = (state: RootState) => state.ui.cartDrawerOpen;
