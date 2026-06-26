import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  userId: string | null;
  accessToken: string | null;
};

const initialState: AuthState = {
  userId: null,
  accessToken: null,
};

/**
 * This slice does NOT own the session — NextAuth does. A small client
 * component (`SessionSync`) reads `useSession()` and dispatches
 * `setSession`/`clearSession` so RTK Query's `baseApi` can attach the
 * access token to outgoing requests without every API hook needing to
 * call `useSession()` itself.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthState>) => {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
    },
    clearSession: (state) => {
      state.userId = null;
      state.accessToken = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
