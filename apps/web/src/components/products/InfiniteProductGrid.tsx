'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGetProductsQuery } from '@/lib/redux/api/productApi';
import type { ApiMeta, ProductListItem, ProductQueryParams } from '@/types/catalog';
import ProductCard from './ProductCard';
import ProductGridSkeleton from './ProductGridSkeleton';

/**
 * Infinite-scroll grid (Kith-style — no pagination links).
 *
 * Receives the server-fetched FIRST page as `initialItems`/`initialMeta`
 * (SEO + fast first paint, same as before). Every page after that is
 * fetched client-side via RTK Query as the sentinel `<div>` at the bottom
 * scrolls into view. `baseParams` changing (sort/category/price filters)
 * resets accumulated pages back to page 1.
 */
export default function InfiniteProductGrid({
  initialItems,
  initialMeta,
  baseParams,
  hideSoldOut = false,
}: {
  initialItems: ProductListItem[];
  initialMeta: ApiMeta;
  baseParams: Omit<ProductQueryParams, 'page'>;
  hideSoldOut?: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialMeta.page);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filters changed (new SSR page landed) -> reset accumulated state.
  // Keyed by a stable stringified signature of the filters that matter.
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
      { rootMargin: '600px' } // start loading before the user hits the very bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [triggerLoadMore]);

  const visibleItems = hideSoldOut ? items.filter((p) => p.stock > 0) : items;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {visibleItems.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-brand-charcoal/40">No products found</p>
          <p className="text-body-md text-brand-charcoal/50 mt-2">
            Try adjusting your filters or browse all collections.
          </p>
        </div>
      )}

      {/* Loading skeleton for the next page */}
      {isFetching && (
        <div className="mt-12">
          <ProductGridSkeleton />
        </div>
      )}

      {/* Sentinel — IntersectionObserver target. 1px tall, invisible. */}
      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden />}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-label uppercase tracking-widest text-brand-charcoal/40 pt-16">
          You&apos;ve reached the end
        </p>
      )}
    </>
  );
}
