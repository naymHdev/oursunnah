import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SortBar from '@/components/products/SortBar';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Pagination from '@/components/products/Pagination';
import { getCategoryTree, getProducts } from '@/lib/api/server';
import type { ProductQueryParams } from '@/types/catalog';

export const metadata: Metadata = {
  title: 'All Products | Our Sunnah',
  description: 'Browse our full collection of Islamic lifestyle products — clothing, home essentials, and more, ethically sourced and thoughtfully curated.',
};

type Search = Record<string, string | undefined>;

function parseParams(search: Search): ProductQueryParams {
  return {
    page: search.page ? Number(search.page) : 1,
    limit: 12,
    search: search.q,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: (search.sort as ProductQueryParams['sort']) ?? 'newest',
  };
}

async function ProductsContent({ search }: { search: Search }) {
  const params = parseParams(search);
  const { items, meta } = await getProducts(params);

  return (
    <>
      <SortBar total={meta.total} />
      <ProductGrid products={items} />
      <Pagination meta={meta} searchParams={search} basePath="/products" />
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const search = await searchParams;
  const categories = await getCategoryTree();

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-brand-charcoal mb-10">All Products</h1>
        <Suspense key={JSON.stringify(search)} fallback={<ProductGridSkeleton />}>
          <ProductsContent search={search} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
