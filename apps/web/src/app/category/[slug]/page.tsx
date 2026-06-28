import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductListing from '@/components/products/ProductListing';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import SubcategoryNav, { findRootChain } from '@/components/products/SubcategoryNav';
import { getCategoryBySlug, getCategoryTree, getProducts } from '@/lib/api/server';
import type { ProductQueryParams } from '@/types/catalog';

type Search = Record<string, string | undefined>;
type Params = { slug: string };

function parseParams(search: Search, categorySlug: string): ProductQueryParams {
  return {
    page: 1,
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

async function CategoryContent({
  search,
  categorySlug,
  categories,
  label,
}: {
  search: Search;
  categorySlug: string;
  categories: Awaited<ReturnType<typeof getCategoryTree>>;
  label: string;
}) {
  const params = parseParams(search, categorySlug);
  const { items, meta } = await getProducts(params);

  return (
    <ProductListing
      label={label}
      categories={categories}
      activeCategorySlug={categorySlug}
      initialItems={items}
      initialMeta={meta}
      baseParams={params}
      hideSoldOut={search.hideSoldOut === '1'}
    />
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

  // Always show the ROOT ancestor's children as the pill nav — never the
  // current node's own children — so the nav stays visible even when
  // browsing a leaf category that has no children of its own (a deep
  // category that simply has no products yet should still show its
  // siblings, not disappear).
  const chain = findRootChain(categories, slug);
  const rootNode = chain?.[0] ?? null;
  const rootName = rootNode?.category.name ?? category.name;
  // Highlight whichever immediate child of the root the current page falls under
  // (or the root itself if we're already at depth 1).
  const activeTopLevelSlug = chain && chain.length > 1 ? chain[1].category.slug : slug;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-brand-charcoal mb-6">{rootName}</h1>
        <SubcategoryNav children={rootNode?.children ?? []} activeSlug={activeTopLevelSlug} />
        {category.description && (
          <p className="text-body-md text-brand-charcoal/60 max-w-2xl mt-6 mb-2">
            {category.description}
          </p>
        )}
        <Suspense key={JSON.stringify(search)} fallback={<ProductGridSkeleton />}>
          <CategoryContent
            search={search}
            categorySlug={slug}
            categories={categories}
            label={category.name}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
