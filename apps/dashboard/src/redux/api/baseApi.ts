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

// Prevent concurrent refresh storms — if a refresh is already in flight,
// queue up and wait for it rather than firing N parallel refresh calls.
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const tryRefresh = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2]
): Promise<string | null> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = rawBaseQuery(
    { url: "/auth/refresh-token", method: "POST" },
    api,
    extraOptions
  ).then((refreshResult) => {
    const refreshData = refreshResult.data as
      | { data: { accessToken: string; user: { id: string; name: string; email: string } } }
      | undefined;

    if (refreshData?.data?.accessToken) {
      api.dispatch(
        setCredentials({
          user: refreshData.data.user,
          accessToken: refreshData.data.accessToken,
        })
      );
      return refreshData.data.accessToken;
    }

    // Refresh token expired or revoked — clear everything and redirect
    api.dispatch(clearCredentials());
    return null;
  }).finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const newToken = await tryRefresh(api, extraOptions);

    if (newToken) {
      // Retry original request — prepareHeaders picks up the new token automatically
      result = await rawBaseQuery(args, api, extraOptions);
    }
    // If newToken is null, clearCredentials already redirected to /login
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
