import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "../store";

export type TAdminUser = {
  id: string;
  name: string;
  email: string;
};

type TAuthState = {
  user: TAdminUser | null;
  accessToken: string | null;
};

const initialState: TAuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: TAdminUser; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;

      // Mirror token in cookie so middleware can read it server-side
      Cookies.set("dashboard-access-token", accessToken, {
        path: "/",
        expires: 1, // 1 day — matches backend accessToken TTL
        sameSite: "strict",
      });
    },

    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      Cookies.remove("dashboard-access-token", { path: "/" });
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user);
