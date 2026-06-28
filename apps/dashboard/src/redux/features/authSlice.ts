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
      // No explicit expires — session cookie.
      // The access token itself is 15 min; silent refresh keeps the session
      // alive. If refresh fails, clearCredentials removes the cookie and
      // Next.js middleware redirects to /login on the next navigation.
      Cookies.set("dashboard-access-token", accessToken, {
        path: "/",
        sameSite: "strict",
        secure: typeof window !== "undefined" && window.location.protocol === "https:",
      });
    },

    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      Cookies.remove("dashboard-access-token", { path: "/" });
      // Force redirect to login — works from RTK Query middleware context
      // where router hooks are not available.
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
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
