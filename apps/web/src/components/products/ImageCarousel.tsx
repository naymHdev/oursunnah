'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable product image carousel. Two visual modes share the same
 * navigation logic:
 *  - `dots`       — compact, used in QuickViewModal
 *  - `thumbnails` — vertical thumbnail rail beside the main image, used
 *                   on the full product detail page
 */
export default function ImageCarousel({
  images,
  alt,
  variant = 'dots',
}: {
  images: string[];
  alt: string;
  variant?: 'dots' | 'thumbnails';
}) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder.jpg'];

  const go = (delta: number) =>
    setIndex((i) => (i + delta + safeImages.length) % safeImages.length);

  const mainImage = (
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

          {variant === 'dots' && (
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
          )}
        </>
      )}
    </div>
  );

  if (variant === 'dots' || safeImages.length <= 1) return mainImage;

  return (
    <div className="flex gap-3 h-full">
      {/* Thumbnail rail */}
      <div className="hidden sm:flex flex-col gap-3 w-20 shrink-0 overflow-y-auto">
        {safeImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative aspect-square bg-brand-beige border transition-colors duration-300 ${
              i === index ? 'border-brand-charcoal' : 'border-transparent hover:border-brand-charcoal/30'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover absolute inset-0" />
          </button>
        ))}
      </div>

      <div className="flex-1">{mainImage}</div>
    </div>
  );
}
