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
