import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SortBar from '@/components/products/SortBar';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Pagination from '@/components/products/Pagination';
import { getCategoryBySlug, getCategoryTree, getProducts } from '@/lib/api/server';
import type { ProductQueryParams } from '@/types/catalog';

type Search = Record<string, string | undefined>;
type Params = { slug: string };

function parseParams(search: Search, categorySlug: string): ProductQueryParams {
  return {
    page: search.page ? Number(search.page) : 1,
    limit: 12,
    categorySlug,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: (search.sort as ProductQueryParams['sort']) ?? 'newest',
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} | Our Sunnah`,
    description:
      category.description ??
      `Shop our ${category.name} collection — ethically sourced Islamic lifestyle products.`,
  };
}

async function CategoryContent({ search, categorySlug }: { search: Search; categorySlug: string }) {
  const params = parseParams(search, categorySlug);
  const { items, meta } = await getProducts(params);

  return (
    <>
      <SortBar total={meta.total} />
      <ProductGrid products={items} />
      <Pagination meta={meta} searchParams={search} basePath={`/category/${categorySlug}`} />
    </>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const search = await searchParams;

  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryTree(),
  ]);

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-brand-charcoal mb-10">{category.name}</h1>
        <Suspense key={JSON.stringify(search)} fallback={<ProductGridSkeleton />}>
          <CategoryContent search={search} categorySlug={slug} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
