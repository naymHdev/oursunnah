import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import EditorialSection from '@/components/EditorialSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
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
