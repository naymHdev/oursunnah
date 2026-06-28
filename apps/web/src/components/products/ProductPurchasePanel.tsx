'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, ShoppingBag, Minus, Plus, ShieldCheck, Leaf, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleWishlist, selectIsWishlisted } from '@/lib/redux/slices/wishlistSlice';
import { useAddToCart } from '@/lib/cart/useAddToCart';
import { findMatchingVariant } from '@/lib/products/variant';
import type { ProductDetail } from '@/types/catalog';
import ProductOptionsSelector from './ProductOptionsSelector';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Halal Certified' },
  { icon: Leaf, label: 'Ethically Sourced' },
  { icon: RotateCcw, label: 'Free Returns' },
];

/**
 * The interactive "buy box" for the product detail page — option
 * selection, quantity, add-to-cart, and wishlist. Pure client component
 * that receives the already-fetched `ProductDetail` from the server
 * page, so it does zero data fetching of its own (unlike QuickViewModal,
 * which fetches client-side because it can open from anywhere).
 */
export default function ProductPurchasePanel({ product }: { product: ProductDetail }) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));
  const addToCart = useAddToCart();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const variant = useMemo(
    () => findMatchingVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions]
  );

  const price = parseFloat(variant?.price ?? product.price);
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const stock = variant?.stock ?? product.stock;
  const inStock = stock > 0;

  const allOptionsSelected =
    product.options.length === 0 || product.options.every((opt) => selectedOptions[opt.id]);

  // Quantity can never exceed what's actually in stock for the selected variant.
  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(stock, 1)));
  }, [stock]);

  const handleAddToCart = async () => {
    if (!allOptionsSelected || !inStock || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: variant?.id ?? null,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url ?? '/placeholder.jpg',
        price,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="font-serif text-3xl text-brand-charcoal">${price.toFixed(2)}</span>
        {compareAtPrice && (
          <span className="text-brand-stone line-through font-sans">
            ${compareAtPrice.toFixed(2)}
          </span>
        )}
      </div>

      {product.options.length > 0 && (
        <ProductOptionsSelector
          options={product.options}
          selected={selectedOptions}
          onChange={(optionId, valueId) =>
            setSelectedOptions((prev) => ({ ...prev, [optionId]: valueId }))
          }
        />
      )}

      {/* Quantity */}
      <div>
        <p className="text-label uppercase tracking-widest text-brand-charcoal/70 mb-2">
          Quantity
        </p>
        <div className="inline-flex items-center border border-brand-charcoal/20">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-10 h-10 flex items-center justify-center text-brand-charcoal/60 hover:text-brand-charcoal disabled:opacity-30 transition-colors duration-300"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-body-md text-brand-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(Math.max(stock, 1), q + 1))}
            disabled={quantity >= stock}
            aria-label="Increase quantity"
            className="w-10 h-10 flex items-center justify-center text-brand-charcoal/60 hover:text-brand-charcoal disabled:opacity-30 transition-colors duration-300"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {!inStock && (
        <p className="text-label uppercase tracking-widest text-rose-600">Currently Sold Out</p>
      )}
      {inStock && stock <= 5 && (
        <p className="text-label uppercase tracking-widest text-brand-gold">
          Only {stock} left in stock
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || !allOptionsSelected || isAdding}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-label uppercase tracking-widest transition-colors duration-300 ${
            !inStock || !allOptionsSelected
              ? 'bg-brand-charcoal/20 text-brand-charcoal/40 cursor-not-allowed'
              : added
                ? 'bg-brand-emerald text-brand-cream'
                : 'bg-brand-charcoal text-brand-cream hover:bg-brand-emerald'
          }`}
        >
          <ShoppingBag size={16} />
          {added
            ? 'Added to Bag'
            : !allOptionsSelected
              ? 'Select Options'
              : !inStock
                ? 'Sold Out'
                : 'Add to Bag'}
        </button>

        <button
          onClick={() => dispatch(toggleWishlist(product.id))}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`w-14 flex items-center justify-center border transition-colors duration-300 ${
            isWishlisted
              ? 'border-rose-300 bg-rose-50 text-rose-500'
              : 'border-brand-charcoal/20 text-brand-charcoal/60 hover:text-rose-500'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Trust badges — same language as the site footer, for consistency */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-charcoal/10">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-brand-charcoal/60">
            <Icon size={14} strokeWidth={1.5} />
            <span className="text-label uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
