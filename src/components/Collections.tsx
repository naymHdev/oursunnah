import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 1,
    label: 'Prayer Essentials',
    title: 'Prayer Mats',
    subtitle: 'Handcrafted luxury prayer rugs woven with devotion and precision.',
    image: 'https://images.pexels.com/photos/8533458/pexels-photo-8533458.jpeg?auto=compress&cs=tinysrgb&w=900&q=85',
    count: 42,
    accent: 'Artisan Woven',
    size: 'large',
  },
  {
    id: 2,
    label: 'Modest Fashion',
    title: 'Abayas & Modest Wear',
    subtitle: 'Flowing silhouettes in the finest fabrics.',
    image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    count: 86,
    accent: 'New Season',
    size: 'medium',
  },
  {
    id: 3,
    label: 'Hijab Collection',
    title: 'Hijabs & Scarves',
    subtitle: 'Silk, modal & premium chiffon drapes.',
    image: 'https://images.pexels.com/photos/6069509/pexels-photo-6069509.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    count: 64,
    accent: 'Bestseller',
    size: 'small',
  },
  {
    id: 4,
    label: 'Islamic Living',
    title: 'Home Décor',
    subtitle: 'Calligraphy art, lanterns & treasured objects.',
    image: 'https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    count: 38,
    accent: 'Curated',
    size: 'small',
  },
];

function CollectionCard({ item, delay = 0 }: { item: typeof collections[0]; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden cursor-pointer transition-all duration-1000 ease-luxury ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent transition-opacity duration-500" />

        {/* Accent badge */}
        <div className="absolute top-5 left-5">
          <span className="inline-block px-3 py-1 bg-brand-gold text-brand-cream text-label uppercase tracking-widest">
            {item.accent}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
          <p className="section-label text-brand-gold/80 mb-1">{item.label}</p>
          <h3 className="font-serif text-heading-md text-brand-cream mb-1">{item.title}</h3>
          <p className="text-brand-cream/60 text-sm font-sans mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury max-w-xs">
            {item.subtitle}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-brand-cream/50 text-label uppercase tracking-widest">{item.count} Products</span>
            <div className="flex items-center gap-2 text-brand-gold text-label uppercase tracking-widest group/cta">
              <span>Shop Now</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Collections() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="collections" className="py-24 lg:py-36 bg-brand-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div
          ref={titleRef}
          className={`flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 transition-all duration-1000 ease-luxury ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <p className="section-label">Our Collections</p>
            <h2 className="font-serif text-display-md text-brand-charcoal max-w-md text-balance">
              Curated for the{' '}
              <em className="text-brand-emerald not-italic">Mindful</em> Life
            </h2>
          </div>
          <div className="mt-6 lg:mt-0 max-w-xs">
            <div className="gold-divider mb-4" />
            <p className="text-brand-stone font-sans text-body-md text-balance">
              Each collection is thoughtfully designed to celebrate Islamic heritage through contemporary, elegant design.
            </p>
          </div>
        </div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Large featured card */}
          <div className="lg:col-span-5">
            <CollectionCard item={collections[0]} delay={0} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            <div className="sm:col-span-2">
              <CollectionCard item={collections[1]} delay={100} />
            </div>
            <CollectionCard item={collections[2]} delay={200} />
            <CollectionCard item={collections[3]} delay={300} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <a href="#" className="btn-outline group">
            View All Collections
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
