import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type UiState = {
  cartDrawerOpen: boolean;
  searchModalOpen: boolean;
  searchQuery: string;
};

const initialState: UiState = {
  cartDrawerOpen: false,
  searchModalOpen: false,
  searchQuery: "",
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
    openSearchModal: (state) => {
      state.searchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
      state.searchQuery = "";
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  openSearchModal,
  closeSearchModal,
  setSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;

export const selectCartDrawerOpen = (state: RootState) => state.ui.cartDrawerOpen;
export const selectSearchModalOpen = (state: RootState) => state.ui.searchModalOpen;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
