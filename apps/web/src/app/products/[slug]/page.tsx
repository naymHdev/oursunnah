import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageCarousel from '@/components/products/ImageCarousel';
import ProductPurchasePanel from '@/components/products/ProductPurchasePanel';
import ProductCard from '@/components/products/ProductCard';
import { getCategoryTree, getProductBySlug, getProducts } from '@/lib/api/server';

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description =
    product.shortDescription ?? product.description.slice(0, 160);

  return {
    title: `${product.name} | Our Sunnah`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategoryTree(),
  ]);

  if (!product) notFound();

  const primaryCategory = product.categories[0];

  // Related products — same category, current product excluded.
  const related = primaryCategory
    ? (await getProducts({ categorySlug: primaryCategory.slug, limit: 5 })).items.filter(
        (p) => p.id !== product.id
      )
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku ?? undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    image: product.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-label uppercase tracking-widest text-brand-charcoal/50 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-brand-charcoal transition-colors duration-300">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/products"
            className="hover:text-brand-charcoal transition-colors duration-300"
          >
            All Products
          </Link>
          {primaryCategory && (
            <>
              <ChevronRight size={12} />
              <Link
                href={`/category/${primaryCategory.slug}`}
                className="hover:text-brand-charcoal transition-colors duration-300"
              >
                {primaryCategory.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-brand-charcoal/80">{product.name}</span>
        </nav>

        {/* Gallery + purchase panel */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="lg:h-[640px]">
            <ImageCarousel
              images={product.images.map((img) => img.url)}
              alt={product.name}
              variant="thumbnails"
            />
          </div>

          <div>
            <p className="text-label uppercase tracking-widest text-brand-stone">
              {primaryCategory?.name ?? ''}
            </p>
            <h1 className="font-serif text-4xl text-brand-charcoal mt-1 mb-6">{product.name}</h1>

            <ProductPurchasePanel product={product} />
          </div>
        </div>

        {/* Description + attributes */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20">
          <div>
            <h2 className="font-serif text-2xl text-brand-charcoal mb-4">Description</h2>
            <p className="text-body-md text-brand-charcoal/70 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {product.attributes.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-brand-charcoal mb-4">Details</h2>
              <dl className="divide-y divide-brand-charcoal/10">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="flex justify-between py-3">
                    <dt className="text-body-md text-brand-charcoal/60">{attr.key}</dt>
                    <dd className="text-body-md text-brand-charcoal text-right">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-2xl text-brand-charcoal mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
