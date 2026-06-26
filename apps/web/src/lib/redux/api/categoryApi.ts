import { baseApi } from "./baseApi";
import type { ApiResponse, CategoryTreeNode } from "@/types/catalog";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Backs the navbar "Collections" mega-menu and any sidebar filters.
     * Categories change rarely, so this is heavily cached client-side;
     * the homepage itself still renders the tree server-side for the
     * first paint — this endpoint exists for client navigations and
     * pages that didn't fetch it on the server (e.g. SPA route changes).
     */
    getCategoryTree: builder.query<CategoryTreeNode[], void>({
      query: () => "/categories",
      transformResponse: (response: ApiResponse<CategoryTreeNode[]>) => response.data,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoryTreeQuery } = categoryApi;
