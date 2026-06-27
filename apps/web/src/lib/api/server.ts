import "server-only";
import type { ApiResponse, CategoryTreeNode, ProductListItem } from "@/types/catalog";

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

