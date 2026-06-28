'use client';

import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { FeaturedCategory } from '@/types/catalog';

function CollectionCard({ item, delay = 0 }: { item: FeaturedCategory; delay?: number }) {
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
      <div className="relative overflow-hidden aspect-[3/4]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-brand-beige-dark" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
          <h3 className="font-serif text-heading-md text-brand-cream mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-brand-cream/60 text-sm font-sans mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury max-w-xs">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-brand-cream/50 text-label uppercase tracking-widest">
              {item._count.products} Products
            </span>
            <a
              href={`/category/${item.slug}`}
              className="flex items-center gap-2 text-brand-gold text-label uppercase tracking-widest group/cta"
            >
              <span>Shop Now</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CollectionsProps {
  categories: FeaturedCategory[];
}

export default function Collections({ categories }: CollectionsProps) {
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

  if (categories.length === 0) return null;

  const [first, ...rest] = categories;

  return (
    <section id="collections" className="py-24 lg:py-36 bg-brand-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
          <div className="lg:col-span-5">
            <CollectionCard item={first} delay={0} />
          </div>

          {rest.length > 0 && (
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {rest[0] && (
                <div className="sm:col-span-2">
                  <CollectionCard item={rest[0]} delay={100} />
                </div>
              )}
              {rest[1] && <CollectionCard item={rest[1]} delay={200} />}
              {rest[2] && <CollectionCard item={rest[2]} delay={300} />}
            </div>
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <a href="/products" className="btn-outline group">
            View All Collections
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
