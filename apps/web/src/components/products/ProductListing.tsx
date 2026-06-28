'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Grid2x2, Grid3x3 } from 'lucide-react';
import { useGetProductsQuery } from '@/lib/redux/api/productApi';
import type {
  ApiMeta,
  CategoryTreeNode,
  ProductListItem,
  ProductQueryParams,
} from '@/types/catalog';
import FilterDrawer from './FilterDrawer';
import ProductCard from './ProductCard';
import ProductGridSkeleton from './ProductGridSkeleton';

/**
 * Combines the header bar (category label + Filter & Sort + density
 * toggle) and the infinite-scroll grid into one client component so the
 * grid-density toggle (2 vs 4 columns) can live in local state without
 * having to lift it between separate server-rendered siblings.
 *
 * Replaces the old `ResultsBar` (which showed a "X products" count on
 * the left — removed per design feedback) + `InfiniteProductGrid`.
 */
export default function ProductListing({
  label,
  categories,
  activeCategorySlug,
  initialItems,
  initialMeta,
  baseParams,
  hideSoldOut = false,
}: {
  /** Left-aligned label shown instead of the product count, e.g. category name or "All Products". */
  label: string;
  categories: CategoryTreeNode[];
  activeCategorySlug?: string;
  initialItems: ProductListItem[];
  initialMeta: ApiMeta;
  baseParams: Omit<ProductQueryParams, 'page'>;
  hideSoldOut?: boolean;
}) {
  const [cols, setCols] = useState<2 | 4>(4);

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialMeta.page);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filterKey = JSON.stringify(baseParams);
  const prevFilterKey = useRef(filterKey);
  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      setItems(initialItems);
      setPage(initialMeta.page);
      prevFilterKey.current = filterKey;
    }
  }, [filterKey, initialItems, initialMeta.page]);

  const nextPage = page + 1;
  const hasMore = page < initialMeta.totalPage;
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isFetching } = useGetProductsQuery(
    shouldFetch && hasMore ? { ...baseParams, page: nextPage } : undefined,
    { skip: !shouldFetch || !hasMore }
  );

  useEffect(() => {
    if (data && shouldFetch) {
      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setShouldFetch(false);
    }
  }, [data, shouldFetch, nextPage]);

  const triggerLoadMore = useCallback(() => {
    if (!isFetching && hasMore) setShouldFetch(true);
  }, [isFetching, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) triggerLoadMore();
      },
      { rootMargin: '600px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [triggerLoadMore]);

  const visibleItems = hideSoldOut ? items.filter((p) => p.stock > 0) : items;

  const gridColsClass =
    cols === 4
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2';

  return (
    <>
      {/* Header row: category label (left) — Filter & Sort + density toggle (right), same baseline */}
      <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-6 mb-10 sticky top-20 bg-brand-cream z-20 pt-4">
        <p className="text-label uppercase tracking-widest text-brand-charcoal/70">{label}</p>

        <div className="flex items-center gap-4">
          <FilterDrawer categories={categories} activeCategorySlug={activeCategorySlug} />

          <div className="hidden sm:flex items-center gap-1 border border-brand-charcoal/15">
            <button
              type="button"
              onClick={() => setCols(4)}
              aria-label="Compact grid"
              aria-pressed={cols === 4}
              className={`p-2 transition-colors duration-300 ${
                cols === 4 ? 'bg-brand-charcoal text-brand-cream' : 'text-brand-charcoal/60 hover:text-brand-charcoal'
              }`}
            >
              <Grid3x3 size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setCols(2)}
              aria-label="Large grid"
              aria-pressed={cols === 2}
              className={`p-2 transition-colors duration-300 ${
                cols === 2 ? 'bg-brand-charcoal text-brand-cream' : 'text-brand-charcoal/60 hover:text-brand-charcoal'
              }`}
            >
              <Grid2x2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid ${gridColsClass} gap-x-6 gap-y-12`}>
        {visibleItems.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-brand-charcoal/40">No products found</p>
          <p className="text-body-md text-brand-charcoal/50 mt-2">
            There are no products in this category yet — check back soon, or browse another
            category above.
          </p>
        </div>
      )}

      {isFetching && (
        <div className="mt-12">
          <ProductGridSkeleton />
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden />}

      {!hasMore && visibleItems.length > 0 && (
        <p className="text-center text-label uppercase tracking-widest text-brand-charcoal/40 pt-16">
          You&apos;ve reached the end
        </p>
      )}
    </>
  );
}
