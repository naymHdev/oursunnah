'use client';

import { useRef, useEffect, useState } from 'react';
import { Heart, ShoppingBag, Star, ArrowRight, Eye } from 'lucide-react';
import { useAddToCart } from '@/lib/cart/useAddToCart';

const products = [
  {
    id: 1,
    name: 'Al-Andalus Prayer Rug',
    category: 'Prayer Essentials',
    price: 189,
    originalPrice: 240,
    rating: 4.9,
    reviews: 148,
    badge: 'Bestseller',
    badgeColor: 'bg-brand-emerald',
    image: 'https://images.pexels.com/photos/8533458/pexels-photo-8533458.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#1B4332', '#B8975A', '#3B3A1A'],
    isNew: false,
    isSale: true,
  },
  {
    id: 2,
    name: 'Medina Silk Abaya',
    category: 'Modest Wear',
    price: 329,
    originalPrice: null,
    rating: 5.0,
    reviews: 93,
    badge: 'New',
    badgeColor: 'bg-brand-gold',
    image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#1C1C1C', '#1B4332', '#F5EFE6'],
    isNew: true,
    isSale: false,
  },
  {
    id: 3,
    name: 'Luminara Chiffon Hijab',
    category: 'Hijabs & Scarves',
    price: 68,
    originalPrice: null,
    rating: 4.8,
    reviews: 217,
    badge: null,
    badgeColor: '',
    image: 'https://images.pexels.com/photos/6069509/pexels-photo-6069509.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#F5EFE6', '#B8975A', '#2D6A4F', '#1C1C1C'],
    isNew: false,
    isSale: false,
  },
  {
    id: 4,
    name: 'Oud al-Haramain Candle',
    category: 'Islamic Home Décor',
    price: 54,
    originalPrice: 72,
    rating: 4.9,
    reviews: 76,
    badge: 'Limited',
    badgeColor: 'bg-brand-olive-mid',
    image: 'https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/8533458/pexels-photo-8533458.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#B8975A', '#1C1C1C'],
    isNew: false,
    isSale: true,
  },
  {
    id: 5,
    name: 'Bismillah Wall Art Frame',
    category: 'Islamic Home Décor',
    price: 145,
    originalPrice: null,
    rating: 4.7,
    reviews: 54,
    badge: 'Artisan',
    badgeColor: 'bg-brand-emerald-light',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#B8975A', '#1C1C1C', '#F5EFE6'],
    isNew: false,
    isSale: false,
  },
  {
    id: 6,
    name: 'Tasbih Pearl Rosary Set',
    category: 'Prayer Essentials',
    price: 98,
    originalPrice: 120,
    rating: 5.0,
    reviews: 131,
    badge: 'Sale',
    badgeColor: 'bg-rose-700',
    image: 'https://images.pexels.com/photos/8533458/pexels-photo-8533458.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    image2: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600&q=85',
    colors: ['#F5EFE6', '#B8975A'],
    isNew: false,
    isSale: true,
  },
];

function ProductCard({ product, delay = 0 }: { product: typeof products[0]; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useAddToCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleCart = () => {
    // NOTE: this section still renders mock data (see `products` array
    // above) — real catalog integration is a separate, not-yet-done
    // step. The cart system itself is fully wired here so it's ready
    // the moment FeaturedProducts switches to live API data.
    addToCart({
      productId: `mock-${product.id}`,
      variantId: null,
      name: product.name,
      slug: `mock-${product.id}`,
      image: product.image,
      price: product.price,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ease-luxury ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-brand-beige mb-4">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={hovered && product.image2 ? product.image2 : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-luxury group-hover:scale-105"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`${product.badgeColor} text-brand-cream text-label px-2.5 py-1 uppercase tracking-widest`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Overlay actions */}
        <div className={`absolute inset-0 bg-brand-charcoal/10 transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Wishlist button */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-300 ease-luxury
            ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            ${wishlisted ? 'bg-rose-100 text-rose-500' : 'bg-brand-cream text-brand-charcoal/60 hover:text-rose-500'}`}
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick view */}
        <button
          className={`absolute top-14 right-4 z-10 w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-brand-charcoal/60 hover:text-brand-emerald
            transition-all duration-300 ease-luxury
            ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
          style={{ transitionDelay: hovered ? '50ms' : '0ms' }}
        >
          <Eye size={14} />
        </button>

        {/* Add to cart bar */}
        <button
          onClick={handleCart}
          className={`absolute bottom-0 left-0 right-0 z-10 py-3 flex items-center justify-center gap-2
            transition-all duration-500 ease-luxury
            ${addedToCart ? 'bg-brand-emerald text-brand-cream' : 'bg-brand-charcoal/85 text-brand-cream hover:bg-brand-emerald'}
            ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <ShoppingBag size={14} />
          <span className="text-label uppercase tracking-widest">
            {addedToCart ? 'Added to Bag' : 'Add to Bag'}
          </span>
        </button>
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <p className="text-label text-brand-stone uppercase tracking-widest">{product.category}</p>
        <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-emerald transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-brand-gold fill-brand-gold' : 'text-brand-stone-light/40'}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-label text-brand-stone">({product.reviews})</span>
        </div>

        {/* Price & colors */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-brand-charcoal">${product.price}</span>
            {product.originalPrice && (
              <span className="text-brand-stone line-through text-sm font-sans">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-brand-stone/20 cursor-pointer hover:scale-125 transition-transform duration-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-36 bg-brand-cream-warm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div
          ref={headerRef}
          className={`flex flex-col lg:flex-row lg:items-end justify-between mb-14 lg:mb-20 transition-all duration-1000 ease-luxury ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <p className="section-label">Featured Products</p>
            <h2 className="font-serif text-display-md text-brand-charcoal max-w-md">
              Thoughtfully{' '}
              <em className="text-brand-emerald not-italic">Crafted</em>
            </h2>
          </div>
          <a href="#" className="mt-6 lg:mt-0 btn-ghost text-brand-charcoal group flex items-center gap-2">
            View All Products
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-14 lg:gap-x-10 lg:gap-y-20">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 80} />
          ))}
        </div>

        {/* Feature banner */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✦', title: 'Free Shipping', desc: 'Complimentary worldwide shipping on all orders above $150' },
            { icon: '◇', title: 'Ethically Sourced', desc: 'All materials are responsibly sourced and ethically produced' },
            { icon: '◈', title: 'Premium Quality', desc: 'Curated by experts who understand Islamic aesthetics' },
          ].map((feat) => (
            <div key={feat.title} className="flex items-start gap-5 p-8 bg-brand-cream border border-brand-beige-dark/60 hover:border-brand-gold/30 transition-colors duration-500">
              <span className="text-brand-gold text-2xl mt-1 font-serif">{feat.icon}</span>
              <div>
                <h4 className="font-serif text-xl text-brand-charcoal mb-2">{feat.title}</h4>
                <p className="text-brand-stone text-sm font-sans leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
