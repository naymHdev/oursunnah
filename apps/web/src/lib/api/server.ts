import "server-only";
import type { ApiResponse, CategoryTreeNode } from "@/types/catalog";

// Server-only: points at the internal/origin API directly, same as
// `src/auth.ts`. Never bundled to the client — that's what
// NEXT_PUBLIC_API_URL (used by the RTK Query baseApi) is for.
const API_URL = process.env.API_URL ?? "http://localhost:5001";

/**
 * Fetches the category tree for the navbar mega-menu (and anywhere else
 * a Server Component needs it). Cached for an hour — categories change
 * rarely, and a stale menu for a few minutes after an admin edit is an
 * acceptable trade-off for not hitting the API on every request.
 *
 * Never throws: a failed fetch degrades to an empty menu instead of
 * breaking the whole page, since the navbar renders on every route.
 */
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
