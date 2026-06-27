#!/bin/bash
set -e
echo "Applying FeaturedProducts RSC..."

echo "Writing apps/web/src/lib/api/server.ts..."
mkdir -p "$(dirname 'apps/web/src/lib/api/server.ts')"
cat > 'apps/web/src/lib/api/server.ts' << 'HEREDOC_APPS_WEB_SRC_LIB_API_SERVER_TS'
import "server-only";
import type { ApiResponse, CategoryTreeNode, ProductListItem } from "@/types/catalog";

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

HEREDOC_APPS_WEB_SRC_LIB_API_SERVER_TS

echo "Writing apps/web/src/components/FeaturedProductsSkeleton.tsx..."
mkdir -p "$(dirname 'apps/web/src/components/FeaturedProductsSkeleton.tsx')"
cat > 'apps/web/src/components/FeaturedProductsSkeleton.tsx' << 'HEREDOC_APPS_WEB_SRC_COMPONENTS_FEATUREDPRODUCTSSKELETON_TSX'
/**
 * FeaturedProductsSkeleton
 * Shown via <Suspense fallback> while the RSC fetches featured products.
 * Matches the exact layout of FeaturedProductsGrid so there's zero
 * layout shift when real content arrives.
 */

function shimmer(w: number, h: number) {
  return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#e8e0d5" stop-opacity="1"/>
          <stop offset="45%"  stop-color="#f5efe6" stop-opacity="1"/>
          <stop offset="100%" stop-color="#e8e0d5" stop-opacity="1">
            <animate attributeName="offset" values="-2;1" dur="1.4s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stop-color="#e8e0d5" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>`;
}

function toBase64(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4">
      {/* Image placeholder — aspect-[3/4] matches real card */}
      <div className="relative overflow-hidden bg-brand-beige aspect-[3/4]">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 skeleton-shimmer" />

        {/* Badge placeholder */}
        <div className="absolute top-4 left-4 w-16 h-5 bg-brand-beige-dark/40 skeleton-shimmer" />

        {/* Wishlist button placeholder */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-beige-dark/30 skeleton-shimmer" />
      </div>

      {/* Text info */}
      <div className="space-y-3 pt-1">
        {/* Category label */}
        <div className="h-3 w-28 bg-brand-beige-dark/50 skeleton-shimmer" />

        {/* Product name */}
        <div className="h-6 w-4/5 bg-brand-beige-dark/60 skeleton-shimmer" />
        <div className="h-6 w-3/5 bg-brand-beige-dark/40 skeleton-shimmer" />

        {/* Stars */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-brand-beige-dark/40 skeleton-shimmer" />
            ))}
          </div>
          <div className="w-8 h-3 bg-brand-beige-dark/30 skeleton-shimmer" />
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-brand-beige-dark/60 skeleton-shimmer" />
            <div className="h-4 w-10 bg-brand-beige-dark/30 skeleton-shimmer" />
          </div>
          {/* Color dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-brand-beige-dark/40 skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-24 lg:py-36 bg-brand-cream-warm">
      <style>{`
        @keyframes skeleton-sweep {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #ede5d8 0%,
            #f5efe6 40%,
            #ede5d8 80%
          );
          background-size: 800px 100%;
          animation: skeleton-sweep 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 lg:mb-20">
          <div className="space-y-4">
            <div className="h-3 w-36 bg-brand-beige-dark/50 skeleton-shimmer" />
            <div className="h-10 w-64 bg-brand-beige-dark/60 skeleton-shimmer" />
            <div className="h-10 w-48 bg-brand-beige-dark/40 skeleton-shimmer" />
          </div>
          <div className="mt-6 lg:mt-0 h-5 w-36 bg-brand-beige-dark/40 skeleton-shimmer" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-14 lg:gap-x-10 lg:gap-y-20">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Feature banner skeleton */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-5 p-8 bg-brand-cream border border-brand-beige-dark/60">
              <div className="w-7 h-7 bg-brand-beige-dark/40 skeleton-shimmer mt-1" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-32 bg-brand-beige-dark/50 skeleton-shimmer" />
                <div className="h-3 w-full bg-brand-beige-dark/30 skeleton-shimmer" />
                <div className="h-3 w-4/5 bg-brand-beige-dark/30 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

HEREDOC_APPS_WEB_SRC_COMPONENTS_FEATUREDPRODUCTSSKELETON_TSX

echo "Writing apps/web/src/components/ProductCardActions.tsx..."
mkdir -p "$(dirname 'apps/web/src/components/ProductCardActions.tsx')"
cat > 'apps/web/src/components/ProductCardActions.tsx' << 'HEREDOC_APPS_WEB_SRC_COMPONENTS_PRODUCTCARDACTIONS_TSX'
'use client';

import { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useAddToCart } from '@/lib/cart/useAddToCart';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleWishlist, selectIsWishlisted } from '@/lib/redux/slices/wishlistSlice';

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

/**
 * Client island for the hover-interactive parts of a product card.
 * Manages its own hover state so the parent RSC stays server-only.
 */
export default function ProductCardActions({ productId, slug, name, image, price }: Props) {
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useAddToCart();
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(productId));

  const handleCart = async () => {
    await addToCart({ productId, variantId: null, name, slug, image, price });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    /* Invisible overlay that captures hover for the whole card */
    <div
      className="absolute inset-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Wishlist */}
      <button
        onClick={() => dispatch(toggleWishlist(productId))}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-300 ease-luxury
          ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
          ${isWishlisted
            ? 'bg-rose-100 text-rose-500'
            : 'bg-brand-cream text-brand-charcoal/60 hover:text-rose-500'
          }`}
      >
        <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Quick view */}
      <a
        href={`/products/${slug}`}
        aria-label="Quick view"
        className={`absolute top-14 right-4 z-10 w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center
          text-brand-charcoal/60 hover:text-brand-emerald
          transition-all duration-300 ease-luxury
          ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        style={{ transitionDelay: hovered ? '50ms' : '0ms' }}
      >
        <Eye size={14} />
      </a>

      {/* Add to cart bar */}
      <button
        onClick={handleCart}
        aria-label="Add to bag"
        className={`absolute bottom-0 left-0 right-0 z-10 py-3 flex items-center justify-center gap-2
          transition-all duration-500 ease-luxury
          ${addedToCart
            ? 'bg-brand-emerald text-brand-cream'
            : 'bg-brand-charcoal/85 text-brand-cream hover:bg-brand-emerald'
          }
          ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        <ShoppingBag size={14} />
        <span className="text-label uppercase tracking-widest">
          {addedToCart ? 'Added to Bag' : 'Add to Bag'}
        </span>
      </button>
    </div>
  );
}

HEREDOC_APPS_WEB_SRC_COMPONENTS_PRODUCTCARDACTIONS_TSX

echo "Writing apps/web/src/components/FeaturedProducts.tsx..."
mkdir -p "$(dirname 'apps/web/src/components/FeaturedProducts.tsx')"
cat > 'apps/web/src/components/FeaturedProducts.tsx' << 'HEREDOC_APPS_WEB_SRC_COMPONENTS_FEATUREDPRODUCTS_TSX'
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

HEREDOC_APPS_WEB_SRC_COMPONENTS_FEATUREDPRODUCTS_TSX

echo ""
echo "✅ Done! Now run:"
echo "  git add ."
echo "  git commit -m \"feat(web): FeaturedProducts RSC with Suspense skeleton\""
echo "  git push origin development"