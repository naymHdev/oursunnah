import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";
import type {
  UpdateProductInput,
  ProductQueryInput,
} from "@our-sunnah/validation";

// ---------- Response shapes ----------

export type ProductImage = {
  id: string;
  url: string;
  publicId: string;
  position: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductAttribute = {
  id: string;
  key: string;
  value: string;
  position: number;
};

export type ProductOptionValue = {
  id: string;
  value: string;
  position: number;
};

export type ProductOption = {
  id: string;
  name: string;
  position: number;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  id: string;
  sku: string | null;
  price: string | null;
  stock: number;
  image: string | null;
  optionValues: (ProductOptionValue & { option: { name: string } })[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  sku: string | null;
  brand: string | null;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  categories: ProductCategory[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  options: ProductOption[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type ProductListItem = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "compareAtPrice"
  | "stock"
  | "isActive"
  | "isFeatured"
  | "brand"
  | "createdAt"
> & {
  images: Pick<ProductImage, "url" | "position">[];
  categories: ProductCategory[];
};

export type ProductListResponse = {
  data: ProductListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
};

export type ProductDetailResponse = { data: Product };
export type ProductMutationResponse = { data: Product };

// ---------- API ----------

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductListResponse, Partial<ProductQueryInput>>({
      query: (params = {}) => ({
        url: "/products",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: tagTypes.product as typeof tagTypes.product,
                id,
              })),
              { type: tagTypes.product, id: "LIST" },
            ]
          : [{ type: tagTypes.product, id: "LIST" }],
    }),

    getProductBySlug: build.query<ProductDetailResponse, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (_result, _err, slug) => [{ type: tagTypes.product, id: slug }],
    }),

    // Accepts FormData (multipart) — backend parses `data` field + `images` files
    createProduct: build.mutation<ProductMutationResponse, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
        // Do NOT set Content-Type — browser auto-sets multipart boundary
        formData: true,
      }),
      invalidatesTags: [{ type: tagTypes.product, id: "LIST" }],
    }),

    // Accepts FormData (multipart) for update as well
    updateProduct: build.mutation<
      ProductMutationResponse,
      { id: string; body: FormData | Partial<UpdateProductInput> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
        ...(body instanceof FormData ? { formData: true } : {}),
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: tagTypes.product, id },
        { type: tagTypes.product, id: "LIST" },
      ],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: tagTypes.product, id },
        { type: tagTypes.product, id: "LIST" },
      ],
    }),

    toggleProductActive: build.mutation<
      ProductMutationResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: tagTypes.product, id },
        { type: tagTypes.product, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductActiveMutation,
} = productApi;
