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
