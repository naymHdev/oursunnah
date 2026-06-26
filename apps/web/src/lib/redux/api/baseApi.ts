import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

/**
 * Public, browser-reachable API origin. Distinct from the server-only
 * `API_URL` used in `src/auth.ts` — that one is read inside the NextAuth
 * callback which runs on the server and can safely target an internal
 * hostname. This one ships to the client bundle, so it must be the
 * publicly reachable URL.
 */
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

/**
 * Single RTK Query instance for the whole app. Feature-specific files
 * (`categoryApi.ts`, `productApi.ts`, ...) call `baseApi.injectEndpoints`
 * instead of creating their own `createApi` — this keeps one shared
 * cache, one shared middleware, and one shared set of tag types.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${PUBLIC_API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category", "Product"],
  endpoints: () => ({}),
});
