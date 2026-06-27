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
