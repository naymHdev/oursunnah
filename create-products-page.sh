#!/usr/bin/env bash
set -e
# Run this from the ROOT of your our_sunnah_web repo (on the development branch).
echo "Creating product listing + category page files..."

mkdir -p apps/web/src/app/products
mkdir -p 'apps/web/src/app/category/[slug]'
mkdir -p apps/web/src/components/products
mkdir -p apps/web/src/lib/api

cat > 'apps/web/src/lib/api/server.ts' << 'PATCH_EOF'
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
PATCH_EOF

cat > 'apps/web/src/components/products/ProductCard.tsx' << 'PATCH_EOF'
import { Star } from 'lucide-react';
import type { ProductListItem } from '@/types/catalog';
import ProductCardActions from '../ProductCardActions';

/**
 * Shared storefront product card — used by `/products`, `/category/[slug]`,
 * and search results. Pure Server Component; the only client island inside
 * is `ProductCardActions` (cart / wishlist), matching the split already
 * established in `FeaturedProducts.tsx`.
 */

function getBadge(product: ProductListItem): { label: string; color: string } | null {
  const hasDiscount = product.compareAtPrice !== null;
  if (hasDiscount) return { label: 'Sale', color: 'bg-rose-700' };
  if (product.isFeatured) return { label: 'Featured', color: 'bg-brand-gold' };
  const isNew = Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
  if (isNew) return { label: 'New', color: 'bg-brand-emerald' };
  return null;
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: ProductListItem;
  /** Set true for above-the-fold cards (first row) to skip lazy-loading. */
  priority?: boolean;
}) {
  const image = product.images[0]?.url ?? '/placeholder.jpg';
  const image2 = product.images[1]?.url ?? image;
  const price = parseFloat(product.price);
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const category = product.categories[0]?.name ?? '';
  const badge = getBadge(product);

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-brand-beige mb-4">
        <a href={`/products/${product.slug}`} className="block aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            width={600}
            height={800}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover transition-all duration-700 ease-luxury
              group-hover:scale-105 group-hover:opacity-0 absolute inset-0"
          />
          <img
            src={image2}
            alt=""
            aria-hidden
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-all duration-700 ease-luxury
              group-hover:scale-105 opacity-0 group-hover:opacity-100"
          />
        </a>

        {badge && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className={`${badge.color} text-brand-cream text-label px-2.5 py-1 uppercase tracking-widest`}>
              {badge.label}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        <ProductCardActions
          productId={product.id}
          slug={product.slug}
          name={product.name}
          image={image}
          price={price}
        />
      </div>

      <div className="space-y-2">
        <p className="text-label text-brand-stone uppercase tracking-widest">{category}</p>

        <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-emerald transition-colors duration-300">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className="text-brand-gold fill-brand-gold" />
            ))}
          </div>
          <span className="text-label text-brand-stone sr-only">5 stars</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-brand-charcoal">${price.toFixed(2)}</span>
            {compareAtPrice && (
              <span className="text-brand-stone line-through text-sm font-sans">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock === 0 && (
            <span className="text-label text-brand-stone/60 uppercase tracking-widest text-xs">
              Sold out
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
PATCH_EOF

cat > 'apps/web/src/components/products/ProductGrid.tsx' << 'PATCH_EOF'
import type { ProductListItem } from '@/types/catalog';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-2xl text-brand-charcoal/40">
          No products found
        </p>
        <p className="text-body-md text-brand-charcoal/50 mt-2">
          Try adjusting your filters or browse all collections.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
PATCH_EOF

cat > 'apps/web/src/components/products/ProductGridSkeleton.tsx' << 'PATCH_EOF'
/**
 * ProductGridSkeleton — Suspense fallback for `/products` and
 * `/category/[slug]` while the server fetches the filtered list.
 * Same shimmer technique as FeaturedProductsSkeleton, sized as an
 * 8-card grid to match ProductGrid's layout (avoids layout shift).
 */
export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-[3/4] bg-brand-beige animate-pulse" />
          <div className="h-3 w-1/3 bg-brand-beige animate-pulse" />
          <div className="h-5 w-3/4 bg-brand-beige animate-pulse" />
          <div className="h-4 w-1/4 bg-brand-beige animate-pulse" />
        </div>
      ))}
    </div>
  );
}
PATCH_EOF

cat > 'apps/web/src/components/products/SortBar.tsx' << 'PATCH_EOF'
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

/**
 * Client island — only piece of the listing page that needs interactivity.
 * Updates the URL's `sort` param via `router.push`, which re-runs the
 * Server Component fetch with the new query (Next.js handles this as a
 * soft navigation, not a full page reload).
 */
export default function SortBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') ?? 'newest';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    params.delete('page'); // reset pagination when sort changes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-6 mb-10">
      <p className="text-body-md text-brand-charcoal/60">
        {total} {total === 1 ? 'product' : 'products'}
      </p>

      <label className="flex items-center gap-2">
        <span className="text-label uppercase tracking-widest text-brand-charcoal/60">Sort</span>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="bg-transparent text-body-md text-brand-charcoal border-none focus:outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
PATCH_EOF

cat > 'apps/web/src/components/products/Pagination.tsx' << 'PATCH_EOF'
import type { ApiMeta } from '@/types/catalog';

/**
 * Plain `<a>` links, not a client component — pagination should be
 * crawlable by search engines and work with JS disabled. Preserves every
 * existing query param (sort, price filters, etc.) and only swaps `page`.
 */
export default function Pagination({
  meta,
  searchParams,
  basePath,
}: {
  meta: ApiMeta;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  if (meta.totalPage <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: meta.totalPage }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-16" aria-label="Pagination">
      <a
        href={meta.page > 1 ? buildHref(meta.page - 1) : undefined}
        aria-disabled={meta.page <= 1}
        className={`px-4 py-2 text-label uppercase tracking-widest transition-colors duration-300 ${
          meta.page <= 1
            ? 'text-brand-charcoal/30 pointer-events-none'
            : 'text-brand-charcoal/70 hover:text-brand-gold'
        }`}
      >
        Prev
      </a>

      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(p)}
          aria-current={p === meta.page ? 'page' : undefined}
          className={`w-9 h-9 flex items-center justify-center text-body-md transition-colors duration-300 ${
            p === meta.page
              ? 'bg-brand-charcoal text-brand-cream'
              : 'text-brand-charcoal/70 hover:text-brand-gold'
          }`}
        >
          {p}
        </a>
      ))}

      <a
        href={meta.page < meta.totalPage ? buildHref(meta.page + 1) : undefined}
        aria-disabled={meta.page >= meta.totalPage}
        className={`px-4 py-2 text-label uppercase tracking-widest transition-colors duration-300 ${
          meta.page >= meta.totalPage
            ? 'text-brand-charcoal/30 pointer-events-none'
            : 'text-brand-charcoal/70 hover:text-brand-gold'
        }`}
      >
        Next
      </a>
    </nav>
  );
}
PATCH_EOF

cat > 'apps/web/src/app/products/page.tsx' << 'PATCH_EOF'
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SortBar from '@/components/products/SortBar';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Pagination from '@/components/products/Pagination';
import { getCategoryTree, getProducts } from '@/lib/api/server';
import type { ProductQueryParams } from '@/types/catalog';

export const metadata: Metadata = {
  title: 'All Products | Our Sunnah',
  description: 'Browse our full collection of Islamic lifestyle products — clothing, home essentials, and more, ethically sourced and thoughtfully curated.',
};

type Search = Record<string, string | undefined>;

function parseParams(search: Search): ProductQueryParams {
  return {
    page: search.page ? Number(search.page) : 1,
    limit: 12,
    search: search.q,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: (search.sort as ProductQueryParams['sort']) ?? 'newest',
  };
}

async function ProductsContent({ search }: { search: Search }) {
  const params = parseParams(search);
  const { items, meta } = await getProducts(params);

  return (
    <>
      <SortBar total={meta.total} />
      <ProductGrid products={items} />
      <Pagination meta={meta} searchParams={search} basePath="/products" />
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const search = await searchParams;
  const categories = await getCategoryTree();

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-brand-charcoal mb-10">All Products</h1>
        <Suspense key={JSON.stringify(search)} fallback={<ProductGridSkeleton />}>
          <ProductsContent search={search} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
PATCH_EOF

cat > 'apps/web/src/app/category/[slug]/page.tsx' << 'PATCH_EOF'
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SortBar from '@/components/products/SortBar';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Pagination from '@/components/products/Pagination';
import { getCategoryBySlug, getCategoryTree, getProducts } from '@/lib/api/server';
import type { ProductQueryParams } from '@/types/catalog';

type Search = Record<string, string | undefined>;
type Params = { slug: string };

function parseParams(search: Search, categorySlug: string): ProductQueryParams {
  return {
    page: search.page ? Number(search.page) : 1,
    limit: 12,
    categorySlug,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: (search.sort as ProductQueryParams['sort']) ?? 'newest',
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} | Our Sunnah`,
    description:
      category.description ??
      `Shop our ${category.name} collection — ethically sourced Islamic lifestyle products.`,
  };
}

async function CategoryContent({ search, categorySlug }: { search: Search; categorySlug: string }) {
  const params = parseParams(search, categorySlug);
  const { items, meta } = await getProducts(params);

  return (
    <>
      <SortBar total={meta.total} />
      <ProductGrid products={items} />
      <Pagination meta={meta} searchParams={search} basePath={`/category/${categorySlug}`} />
    </>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const search = await searchParams;

  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryTree(),
  ]);

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-brand-charcoal mb-10">{category.name}</h1>
        <Suspense key={JSON.stringify(search)} fallback={<ProductGridSkeleton />}>
          <CategoryContent search={search} categorySlug={slug} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
PATCH_EOF

echo "Done. All files written successfully."
