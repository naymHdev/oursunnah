import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type QuickViewState = {
  activeSlug: string | null;
};

const initialState: QuickViewState = {
  activeSlug: null,
};

const quickViewSlice = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    openQuickView: (state, action: PayloadAction<string>) => {
      state.activeSlug = action.payload;
    },
    closeQuickView: (state) => {
      state.activeSlug = null;
    },
  },
});

export const { openQuickView, closeQuickView } = quickViewSlice.actions;
export default quickViewSlice.reducer;

// ---------- Selectors ----------

export const selectQuickViewSlug = (state: RootState) => state.quickView.activeSlug;
