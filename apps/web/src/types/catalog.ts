/**
 * Shapes mirrored from the API's Prisma models + response envelope
 * (see apps/api/src/app/utils/sendResponse.ts and the category/product
 * services). Kept hand-written rather than imported across the app/api
 * boundary so the web app never depends on backend-only packages.
 */

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  meta?: ApiMeta;
  data: T;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  position: number;
  isActive: boolean;
  parentId: string | null;
};

/** Recursive node shape returned by `buildCategoryTree` on the API. */
export type CategoryTreeNode = {
  category: Category;
  children: CategoryTreeNode[];
};

export type ProductImage = {
  id: string;
  url: string;
  position: number;
};

export type ProductCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

/** Shape returned by `GET /products` (list view — lightweight). */
export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: string; // Prisma Decimal is serialized as a string over JSON
  compareAtPrice: string | null;
  stock: number;
  isFeatured: boolean;
  images: ProductImage[];
  categories: ProductCategoryRef[];
  createdAt: string;
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
  optionValues: ProductOptionValue[];
};

export type ProductAttribute = {
  id: string;
  key: string;
  value: string;
  position: number;
};

/** Shape returned by `GET /products/:slug` (full detail view). */
export type ProductDetail = ProductListItem & {
  description: string;
  brand: string | null;
  sku: string | null;
  options: ProductOption[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sort?: "price_asc" | "price_desc" | "newest";
};
