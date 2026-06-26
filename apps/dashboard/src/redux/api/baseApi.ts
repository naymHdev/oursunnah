import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { clearCredentials, setCredentials } from "../features/authSlice";
import { tagTypesList } from "../tagTypes";

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${PUBLIC_API_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Re-attempt with refreshed token on 401 — mirrors salon-chatbot pattern
const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try refreshing
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    const refreshData = refreshResult.data as
      | { data: { accessToken: string } }
      | undefined;

    if (refreshData?.data?.accessToken) {
      const currentUser = (api.getState() as RootState).auth.user;

      if (currentUser) {
        api.dispatch(
          setCredentials({
            user: currentUser,
            accessToken: refreshData.data.accessToken,
          })
        );
      }

      // Retry original request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — force logout
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
