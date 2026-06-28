import type { CategoryTreeNode } from '@/types/catalog';
import FilterDrawer from './FilterDrawer';

export default function ResultsBar({
  total,
  categories,
  activeCategorySlug,
}: {
  total: number;
  categories: CategoryTreeNode[];
  activeCategorySlug?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-6 mb-10 sticky top-20 bg-brand-cream z-20 pt-4">
      <p className="text-body-md text-brand-charcoal/60">
        {total} {total === 1 ? 'product' : 'products'}
      </p>
      <FilterDrawer categories={categories} activeCategorySlug={activeCategorySlug} />
    </div>
  );
}
