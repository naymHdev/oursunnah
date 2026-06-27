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

