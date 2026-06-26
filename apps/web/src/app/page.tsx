import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import EditorialSection from '@/components/EditorialSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { getCategoryTree } from '@/lib/api/server';

export default async function Home() {
  const categories = await getCategoryTree();
  // console.log("categories_______", categories);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar categories={categories} />
      <main>
        <Hero />
        <Collections />
        <FeaturedProducts />
        <Testimonials />
        <EditorialSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
