import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
} from "@our-sunnah/validation";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tagTypes";

export type TCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  imagePublicId: string | null;
  parentId: string | null;
  position: number;
  isActive: boolean;
  children?: TCategory[];
  _count?: { products: number };
};

export type TCategoryTree = TCategory & { children: TCategoryTree[] };

// Alias used by ProductForm
export type CategoryItem = TCategory;
export type CategoryTreeResponse = { data: TCategoryTree[] };

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategoryTree: build.query<{ data: TCategoryTree[] }, void>({
      query: () => "/categories",
      providesTags: [tagTypes.category],
    }),

    createCategory: build.mutation<{ data: TCategory }, CreateCategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    updateCategory: build.mutation<
      { data: TCategory },
      { id: string; body: UpdateCategoryInput }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),

    reorderCategories: build.mutation<void, ReorderCategoriesInput>({
      query: (body) => ({
        url: "/categories/reorder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const {
  useGetCategoryTreeQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
} = categoryApi;
