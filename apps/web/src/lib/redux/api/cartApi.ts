import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  AddCartItemPayload,
  CartDto,
  MergeCartPayload,
} from "@/types/catalog";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServerCart: builder.query<CartDto, void>({
      query: () => "/cart",
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
    }),

    addCartItem: builder.mutation<CartDto, AddCartItemPayload>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
    }),

    updateCartItem: builder.mutation<CartDto, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
    }),

    removeCartItem: builder.mutation<CartDto, { itemId: string }>({
      query: ({ itemId }) => ({ url: `/cart/items/${itemId}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
    }),

    /** Called once, right after login, to fold the guest cart in. */
    mergeCart: builder.mutation<CartDto, MergeCartPayload>({
      query: (body) => ({ url: "/cart/merge", method: "POST", body }),
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
    }),
  }),
});

export const {
  useGetServerCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
} = cartApi;
