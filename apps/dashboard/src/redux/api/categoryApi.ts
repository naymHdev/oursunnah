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

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /categories — full tree (public)
    getCategoryTree: build.query<{ data: TCategoryTree[] }, void>({
      query: () => "/categories",
      providesTags: [tagTypes.category],
    }),

    // POST /categories
    createCategory: build.mutation<{ data: TCategory }, CreateCategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    // PATCH /categories/:id
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

    // DELETE /categories/:id
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),

    // PATCH /categories/reorder
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
