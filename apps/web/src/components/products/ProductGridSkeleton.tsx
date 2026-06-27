/**
 * ProductGridSkeleton — Suspense fallback for `/products` and
 * `/category/[slug]` while the server fetches the filtered list.
 * Same shimmer technique as FeaturedProductsSkeleton, sized as an
 * 8-card grid to match ProductGrid's layout (avoids layout shift).
 */
export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-[3/4] bg-brand-beige animate-pulse" />
          <div className="h-3 w-1/3 bg-brand-beige animate-pulse" />
          <div className="h-5 w-3/4 bg-brand-beige animate-pulse" />
          <div className="h-4 w-1/4 bg-brand-beige animate-pulse" />
        </div>
      ))}
    </div>
  );
}
