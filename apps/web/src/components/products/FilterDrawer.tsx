'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, SlidersHorizontal } from 'lucide-react';
import type { CategoryTreeNode } from '@/types/catalog';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

/** Flattens the category tree into a single list of {slug, name, depth} for the filter checklist. */
function flattenCategories(
  nodes: CategoryTreeNode[],
  depth = 0
): { slug: string; name: string; depth: number }[] {
  return nodes.flatMap((node) => [
    { slug: node.category.slug, name: node.category.name, depth },
    ...flattenCategories(node.children, depth + 1),
  ]);
}

/**
 * Kith-style "Filter & Sort" slide-over. Note: the backend's
 * `getProducts` query currently accepts a single `categorySlug`, not an
 * array — so unlike Kith's multi-select checkboxes, category here is a
 * single active filter (radio-like toggle). Extending to true multi-category
 * would need a backend change (`categorySlug: string[]` + `in` query).
 */
export default function FilterDrawer({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryTreeNode[];
  /** Pre-set when rendered on a `/category/[slug]` page — locks that filter visually. */
  activeCategorySlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const flatCategories = flattenCategories(categories);

  const [sort, setSort] = useState(searchParams.get('sort') ?? 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [hideSoldOut, setHideSoldOut] = useState(searchParams.get('hideSoldOut') === '1');
  const [category, setCategory] = useState(activeCategorySlug ?? searchParams.get('category') ?? '');

  // Keep local state in sync if the URL changes externally (e.g. back/forward nav)
  useEffect(() => {
    setSort(searchParams.get('sort') ?? 'newest');
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
    setHideSoldOut(searchParams.get('hideSoldOut') === '1');
  }, [searchParams]);

  const apply = () => {
    const params = new URLSearchParams();
    if (sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (hideSoldOut) params.set('hideSoldOut', '1');

    // On the generic /products page, category is a query param.
    // On /category/[slug], switching category should navigate to the new route instead.
    if (activeCategorySlug !== undefined) {
      const target = category ? `/category/${category}` : '/products';
      router.push(`${target}?${params.toString()}`);
    } else {
      if (category) params.set('category', category);
      router.push(`${pathname}?${params.toString()}`);
    }
    setOpen(false);
  };

  const reset = () => {
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setHideSoldOut(false);
    setCategory(activeCategorySlug ?? '');
    router.push(activeCategorySlug ? `/category/${activeCategorySlug}` : pathname);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-label uppercase tracking-widest text-brand-charcoal/80 hover:text-brand-gold transition-colors duration-300 border border-brand-charcoal/15 px-4 py-2.5"
      >
        <SlidersHorizontal size={14} strokeWidth={1.5} />
        Filter &amp; Sort
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-charcoal/40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm h-full bg-brand-cream overflow-y-auto shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-brand-charcoal/10 sticky top-0 bg-brand-cream z-10">
              <h2 className="font-serif text-xl text-brand-charcoal">Filter &amp; Sort</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} className="text-brand-charcoal/60" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Sort */}
              <fieldset>
                <legend className="text-label uppercase tracking-widest text-brand-charcoal/90 mb-3">
                  Sort By
                </legend>
                <div className="space-y-2.5">
                  {SORT_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value={opt.value}
                        checked={sort === opt.value}
                        onChange={() => setSort(opt.value)}
                        className="accent-brand-charcoal"
                      />
                      <span className="text-body-md text-brand-charcoal/80">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Category */}
              {flatCategories.length > 0 && (
                <fieldset>
                  <legend className="text-label uppercase tracking-widest text-brand-charcoal/90 mb-3">
                    Category
                  </legend>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === ''}
                        onChange={() => setCategory('')}
                        className="accent-brand-charcoal"
                      />
                      <span className="text-body-md text-brand-charcoal/80">All Categories</span>
                    </label>
                    {flatCategories.map((c) => (
                      <label
                        key={c.slug}
                        className="flex items-center gap-3 cursor-pointer"
                        style={{ paddingLeft: c.depth * 14 }}
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={category === c.slug}
                          onChange={() => setCategory(c.slug)}
                          className="accent-brand-charcoal"
                        />
                        <span className="text-body-md text-brand-charcoal/80">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Price range */}
              <fieldset>
                <legend className="text-label uppercase tracking-widest text-brand-charcoal/90 mb-3">
                  Price
                </legend>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-brand-charcoal/20 bg-transparent px-3 py-2 text-body-md text-brand-charcoal focus:outline-none focus:border-brand-charcoal/50"
                  />
                  <span className="text-brand-charcoal/40">—</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-brand-charcoal/20 bg-transparent px-3 py-2 text-body-md text-brand-charcoal focus:outline-none focus:border-brand-charcoal/50"
                  />
                </div>
              </fieldset>

              {/* Hide sold out — client-side filter, see InfiniteProductGrid */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideSoldOut}
                  onChange={(e) => setHideSoldOut(e.target.checked)}
                  className="accent-brand-charcoal"
                />
                <span className="text-body-md text-brand-charcoal/80">Hide Sold Out Products</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-brand-cream border-t border-brand-charcoal/10 p-6 flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 text-label uppercase tracking-widest text-brand-charcoal/70 border border-brand-charcoal/20 hover:border-brand-charcoal/50 transition-colors duration-300"
              >
                Reset
              </button>
              <button
                onClick={apply}
                className="flex-1 py-3 text-label uppercase tracking-widest text-brand-cream bg-brand-charcoal hover:bg-brand-emerald transition-colors duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
