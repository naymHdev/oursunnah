/**
 * FeaturedProducts — Async Server Component
 *
 * Fetches featured products server-side so the HTML arriving at the browser
 * already contains product data (good for SEO + LCP). Interactive bits
 * (cart, wishlist) live in the 'use client' ProductCardActions child.
 *
 * Wrapped in <Suspense> in page.tsx so the rest of the page is never
 * blocked by this fetch.
 */

import { Suspense } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/api/server';
import type { ProductListItem } from '@/types/catalog';
import ProductCardActions from './ProductCardActions';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';

// ── Feature banner (static) ────────────────────────────────────────────────────

const FEATURES = [
  { icon: '✦', title: 'Free Shipping',    desc: 'Complimentary worldwide shipping on all orders above $150' },
  { icon: '◇', title: 'Ethically Sourced', desc: 'All materials are responsibly sourced and ethically produced' },
  { icon: '◈', title: 'Premium Quality',  desc: 'Curated by experts who understand Islamic aesthetics' },
];

// ── Badge helpers ──────────────────────────────────────────────────────────────

function getBadge(product: ProductListItem): { label: string; color: string } | null {
  const hasDiscount = product.compareAtPrice !== null;
  if (hasDiscount) return { label: 'Sale',      color: 'bg-rose-700' };
  if (product.isFeatured) return { label: 'Featured', color: 'bg-brand-gold' };
  // New if created within last 14 days
  const isNew = Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
  if (isNew) return { label: 'New', color: 'bg-brand-emerald' };
  return null;
}

// ── Individual card — Server Component wrapper ────────────────────────────────

function ProductCard({ product, index }: { product: ProductListItem; index: number }) {
  const image  = product.images[0]?.url ?? '/placeholder.jpg';
  const image2 = product.images[1]?.url ?? image;
  const price  = parseFloat(product.price);
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const category = product.categories[0]?.name ?? '';
  const badge  = getBadge(product);

  return (
    <article
      className="group"
      style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-brand-beige mb-4">
        <a href={`/products/${product.slug}`} className="block aspect-[3/4] overflow-hidden">
          {/* Primary image */}
          <img
            src={image}
            alt={product.name}
            width={600}
            height={800}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover transition-all duration-700 ease-luxury
              group-hover:scale-105 group-hover:opacity-0 absolute inset-0"
          />
          {/* Hover image (crossfade) */}
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

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className={`${badge.color} text-brand-cream text-label px-2.5 py-1 uppercase tracking-widest`}>
              {badge.label}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Client-side interactive actions (cart / wishlist / quick-view) */}
        <ProductCardActions
          productId={product.id}
          slug={product.slug}
          name={product.name}
          image={image}
          price={price}
          
        />
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <p className="text-label text-brand-stone uppercase tracking-widest">{category}</p>

        <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-emerald transition-colors duration-300">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>

        {/* Static 5-star placeholder — replace with real rating once review API is wired */}
        <div className="flex items-center gap-2">
          <div className="flex" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className="text-brand-gold fill-brand-gold"
              />
            ))}
          </div>
          <span className="text-label text-brand-stone sr-only">5 stars</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-brand-charcoal">
              ${price.toFixed(2)}
            </span>
            {compareAtPrice && (
              <span className="text-brand-stone line-through text-sm font-sans">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Out of stock indicator */}
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

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-3 py-24 text-center">
      <p className="font-serif text-2xl text-brand-charcoal/40">
        New arrivals coming soon
      </p>
    </div>
  );
}

// ── Async RSC — data fetch happens here ──────────────────────────────────────

async function FeaturedProductsContent() {
  const products = await getFeaturedProducts(6);

  return (
    <section className="py-24 lg:py-36 bg-brand-cream-warm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 lg:mb-20">
          <div>
            <p className="section-label">Featured Products</p>
            <h2 className="font-serif text-display-md text-brand-charcoal max-w-md">
              Thoughtfully{' '}
              <em className="text-brand-emerald not-italic">Crafted</em>
            </h2>
          </div>
          <a
            href="/products"
            className="mt-6 lg:mt-0 btn-ghost text-brand-charcoal group flex items-center gap-2"
          >
            View All Products
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-14 lg:gap-x-10 lg:gap-y-20">
          {products.length === 0
            ? <EmptyState />
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
          }
        </div>

        {/* Feature banner */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="flex items-start gap-5 p-8 bg-brand-cream border border-brand-beige-dark/60 hover:border-brand-gold/30 transition-colors duration-500"
            >
              <span className="text-brand-gold text-2xl mt-1 font-serif" aria-hidden>{feat.icon}</span>
              <div>
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">{feat.title}</h4>
                <p className="text-brand-stone text-sm font-sans leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Default export — Suspense boundary এখানে ──────────────────────────────────

export default function FeaturedProducts() {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <FeaturedProductsContent />
    </Suspense>
  );
}

