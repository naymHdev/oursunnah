import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  ApiMeta,
  ProductDetail,
  ProductListItem,
  ProductQueryParams,
} from "@/types/catalog";

type ProductListResponse = {
  items: ProductListItem[];
  meta: ApiMeta;
};

/** Builds a query string from only the params that are actually set. */
const toSearchParams = (params: ProductQueryParams): string => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  return search.toString();
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * General storefront listing — category pages, search results,
     * "View All Products". Used for client-side pagination/filtering
     * after the initial server-rendered page.
     */
    getProducts: builder.query<ProductListResponse, ProductQueryParams | void>({
      query: (params) => `/products${params ? `?${toSearchParams(params)}` : ""}`,
      transformResponse: (response: ApiResponse<ProductListItem[]>) => ({
        items: response.data,
        meta: response.meta as ApiMeta,
      }),
      providesTags: ["Product"],
    }),

    /** Thin wrapper kept separate from `getProducts` so the homepage's
     *  "Featured Products" section has its own cache entry/tag and isn't
     *  invalidated by unrelated listing-page filters. */
    getFeaturedProducts: builder.query<ProductListItem[], { limit?: number } | void>({
      query: (params) =>
        `/products?${toSearchParams({ isFeatured: true, limit: params?.limit ?? 6 })}`,
      transformResponse: (response: ApiResponse<ProductListItem[]>) => response.data,
      providesTags: ["Product"],
    }),

    getNewArrivals: builder.query<ProductListItem[], { limit?: number } | void>({
      query: (params) =>
        `/products/new-arrivals${params?.limit ? `?limit=${params.limit}` : ""}`,
      transformResponse: (response: ApiResponse<ProductListItem[]>) => response.data,
      providesTags: ["Product"],
    }),

    getBestSellers: builder.query<ProductListItem[], { limit?: number } | void>({
      query: (params) =>
        `/products/best-sellers${params?.limit ? `?limit=${params.limit}` : ""}`,
      transformResponse: (response: ApiResponse<ProductListItem[]>) => response.data,
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<ProductDetail, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response: ApiResponse<ProductDetail>) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
  useGetProductBySlugQuery,
} = productApi;
