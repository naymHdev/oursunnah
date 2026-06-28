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
  isFeatured: boolean;
  children?: TCategory[];
  _count?: { products: number };
};

export type TCategoryTree = Omit<TCategory, "children"> & {
  children: TCategoryTree[];
};

type CategoryTreeNode = {
  category: TCategory;
  children: CategoryTreeNode[];
};

const mapCategoryTree = (nodes: CategoryTreeNode[]): TCategoryTree[] =>
  nodes.map(({ category, children }) => ({
    ...category,
    children: mapCategoryTree(children),
  }));

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategoryTree: build.query<TCategoryTree[], void>({
      query: () => "/categories",
      transformResponse: (response: { data: CategoryTreeNode[] }) =>
        mapCategoryTree(response.data),
      providesTags: [tagTypes.category],
    }),

    createCategory: build.mutation<{ data: TCategory }, CreateCategoryInput>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [tagTypes.category],
    }),

    updateCategory: build.mutation<{ data: TCategory }, { id: string; body: UpdateCategoryInput }>({
      query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PATCH", body }),
      invalidatesTags: [tagTypes.category],
    }),

    deleteCategory: build.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.category],
    }),

    reorderCategories: build.mutation<void, ReorderCategoriesInput>({
      query: (body) => ({ url: "/categories/reorder", method: "PATCH", body }),
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
