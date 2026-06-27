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

