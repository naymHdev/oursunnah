'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Star, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeQuickView, selectQuickViewSlug } from '@/lib/redux/slices/quickViewSlice';
import { toggleWishlist, selectIsWishlisted } from '@/lib/redux/slices/wishlistSlice';
import { useGetProductBySlugQuery } from '@/lib/redux/api/productApi';
import { useAddToCart } from '@/lib/cart/useAddToCart';
import type { ProductOption, ProductVariant } from '@/types/catalog';

/**
 * Self-contained image carousel — kept inside this file since Quick View
 * is currently its only consumer, but it takes nothing but a string[],
 * so lifting it into its own file later (e.g. for the product detail
 * page) is a one-line import change, not a rewrite.
 */
function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder.jpg'];

  const go = (delta: number) =>
    setIndex((i) => (i + delta + safeImages.length) % safeImages.length);

  return (
    <div className="relative bg-brand-beige h-full min-h-[360px]">
      <img
        src={safeImages[index]}
        alt={alt}
        className="w-full h-full object-cover absolute inset-0"
      />

      {safeImages.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brand-cream/90 flex items-center justify-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brand-cream/90 flex items-center justify-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors duration-300"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i === index ? 'bg-brand-charcoal' : 'bg-brand-charcoal/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Finds the variant matching every currently-selected option value, if any. */
function findMatchingVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | null {
  if (variants.length === 0) return null;
  return (
    variants.find((variant) => {
      const variantValueIds = variant.optionValues.map((v) => v.id);
      return Object.values(selected).every((valueId) => variantValueIds.includes(valueId));
    }) ?? null
  );
}

export default function QuickViewModal() {
  const dispatch = useAppDispatch();
  const slug = useAppSelector(selectQuickViewSlug);
  const isOpen = slug !== null;

  const { data: product, isLoading } = useGetProductBySlugQuery(slug ?? '', { skip: !slug });
  const isWishlisted = useAppSelector(selectIsWishlisted(product?.id ?? ''));
  const addToCart = useAddToCart();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  // Reset local selection state every time a different product is opened.
  useEffect(() => {
    setSelectedOptions({});
    setAdded(false);
  }, [slug]);

  // Close on Escape, and lock page scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeQuickView());
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, dispatch]);

  const variant = useMemo(
    () => (product ? findMatchingVariant(product.variants, selectedOptions) : null),
    [product, selectedOptions]
  );

  if (!isOpen) return null;

  const close = () => dispatch(closeQuickView());

  const price = product ? parseFloat(variant?.price ?? product.price) : 0;
  const compareAtPrice = product?.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const stock = variant?.stock ?? product?.stock ?? 0;
  const inStock = stock > 0;

  const allOptionsSelected =
    !product || product.options.length === 0
      ? true
      : product.options.every((opt) => selectedOptions[opt.id]);

  const handleAddToCart = async () => {
    if (!product || !allOptionsSelected) return;
    await addToCart({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url ?? '/placeholder.jpg',
      price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-brand-charcoal/50" onClick={close} />

      <div className="relative bg-brand-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto sm:overflow-hidden grid sm:grid-cols-2 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={close}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-cream/90 flex items-center justify-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors duration-300"
        >
          <X size={18} />
        </button>

        {isLoading || !product ? (
          <div className="col-span-2 flex items-center justify-center py-32">
            <p className="text-body-md text-brand-charcoal/50">Loading...</p>
          </div>
        ) : (
          <>
            {/* Left — image carousel */}
            <ImageCarousel images={product.images.map((img) => img.url)} alt={product.name} />

            {/* Right — informative details */}
            <div className="p-8 flex flex-col">
              <p className="text-label uppercase tracking-widest text-brand-stone">
                {product.categories[0]?.name ?? ''}
              </p>

              <h2 className="font-serif text-2xl text-brand-charcoal mt-1">{product.name}</h2>

              <div className="flex items-center gap-1 mt-2" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="font-serif text-2xl text-brand-charcoal">
                  ${price.toFixed(2)}
                </span>
                {compareAtPrice && (
                  <span className="text-brand-stone line-through font-sans text-sm">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-body-md text-brand-charcoal/70 mt-4 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Option selectors (size, color, etc.) */}
              {product.options.length > 0 && (
                <div className="mt-6 space-y-4">
                  {product.options.map((option: ProductOption) => (
                    <div key={option.id}>
                      <p className="text-label uppercase tracking-widest text-brand-charcoal/70 mb-2">
                        {option.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const isSelected = selectedOptions[option.id] === value.id;
                          return (
                            <button
                              key={value.id}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.id]: value.id,
                                }))
                              }
                              className={`px-3 py-1.5 text-sm border transition-colors duration-300 ${
                                isSelected
                                  ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal'
                                  : 'text-brand-charcoal/70 border-brand-charcoal/20 hover:border-brand-charcoal/50'
                              }`}
                            >
                              {value.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-8 space-y-3">
                {!inStock && (
                  <p className="text-label uppercase tracking-widest text-rose-600">Sold Out</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock || !allOptionsSelected}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 text-label uppercase tracking-widest transition-colors duration-300 ${
                      !inStock || !allOptionsSelected
                        ? 'bg-brand-charcoal/20 text-brand-charcoal/40 cursor-not-allowed'
                        : added
                          ? 'bg-brand-emerald text-brand-cream'
                          : 'bg-brand-charcoal text-brand-cream hover:bg-brand-emerald'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    {added ? 'Added to Bag' : !allOptionsSelected ? 'Select Options' : 'Add to Bag'}
                  </button>

                  <button
                    onClick={() => dispatch(toggleWishlist(product.id))}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-12 flex items-center justify-center border transition-colors duration-300 ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-500'
                        : 'border-brand-charcoal/20 text-brand-charcoal/60 hover:text-rose-500'
                    }`}
                  >
                    <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <a
                  href={`/products/${product.slug}`}
                  className="block text-center text-label uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal transition-colors duration-300 pt-1"
                >
                  View Full Details
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
