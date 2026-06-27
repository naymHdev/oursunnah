import "server-only";
import type {
  ApiMeta,
  ApiResponse,
  Category,
  CategoryTreeNode,
  ProductListItem,
  ProductQueryParams,
} from "@/types/catalog";

const API_URL = process.env.API_URL ?? "http://localhost:5001";

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/categories`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const { data }: ApiResponse<CategoryTreeNode[]> = await response.json();
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Fetches featured products for the homepage section.
 * Cached for 5 minutes — fresh enough for price/stock changes,
 * fast enough to not hit the API on every request.
 * Never throws: returns [] on any failure so the page still renders.
 */
export async function getFeaturedProducts(limit = 6): Promise<ProductListItem[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/products?isFeatured=true&limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return [];
    const json: ApiResponse<ProductListItem[]> = await response.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/categories/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const { data }: ApiResponse<Category> = await response.json();
    return data ?? null;
  } catch {
    return null;
  }
}

type ProductListResult = { items: ProductListItem[]; meta: ApiMeta };

const EMPTY_LIST_RESULT: ProductListResult = {
  items: [],
  meta: { page: 1, limit: 12, total: 0, totalPage: 0 },
};

/**
 * Shared fetch for both `/products` (all products) and `/category/[slug]`
 * (category-filtered) — both pages pass the same `ProductQueryParams` shape
 * to the same backend endpoint, so one function backs both routes.
 *
 * Runs server-side for SEO + fast first paint. Short revalidate window
 * (60s) keeps stock/price reasonably fresh without hitting the API on
 * every single request. Never throws — listing page renders an empty
 * state instead of crashing if the API is down.
 */
export async function getProducts(
  params: ProductQueryParams
): Promise<ProductListResult> {
  try {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/api/v1/products?${search.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return EMPTY_LIST_RESULT;

    const json: ApiResponse<ProductListItem[]> = await response.json();
    return {
      items: json.data ?? [],
      meta: json.meta ?? EMPTY_LIST_RESULT.meta,
    };
  } catch {
    return EMPTY_LIST_RESULT;
  }
}
