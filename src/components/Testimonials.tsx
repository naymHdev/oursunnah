import { useRef, useEffect, useState } from 'react';
import { Star, Quote, MapPin } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Fatima Al-Rashidi',
    location: 'Dubai, UAE',
    avatar: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&q=80',
    rating: 5,
    text: 'The prayer mat I received is beyond anything I\'ve seen — the craftsmanship, the weight of the fabric, the delicate embroidery. Each prayer feels like a sacred moment wrapped in beauty.',
    product: 'Al-Andalus Prayer Rug',
    verified: true,
  },
  {
    id: 2,
    name: 'Aisha Binte Yusuf',
    location: 'Kuala Lumpur, Malaysia',
    avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150&q=80',
    rating: 5,
    text: 'Noor understands modesty in a way that doesn\'t compromise elegance. My Medina abaya is my most treasured piece. I wear it to jumu\'ah and feel completely at peace.',
    product: 'Medina Silk Abaya',
    verified: true,
  },
  {
    id: 3,
    name: 'Mariam Okonkwo',
    location: 'London, UK',
    avatar: 'https://images.pexels.com/photos/3765132/pexels-photo-3765132.jpeg?auto=compress&cs=tinysrgb&w=150&q=80',
    rating: 5,
    text: 'The packaging alone was a gift. The Bismillah frame now hangs in our dining room and every guest asks where it\'s from. A truly premium brand that respects our aesthetic.',
    product: 'Bismillah Wall Art Frame',
    verified: true,
  },
  {
    id: 4,
    name: 'Nadia Al-Hassan',
    location: 'Toronto, Canada',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&q=80',
    rating: 5,
    text: 'I\'ve been searching for a brand that captures the refinement of Islamic culture. Noor has done that beautifully. The chiffon hijab is impossibly soft and drapes like poetry.',
    product: 'Luminara Chiffon Hijab',
    verified: true,
  },
  {
    id: 5,
    name: 'Zaynab Ibrahim',
    location: 'Riyadh, Saudi Arabia',
    avatar: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&q=80',
    rating: 5,
    text: 'I gifted the pearl Tasbih set to my mother on Eid and she cried. The quality and the care in the box — it felt like receiving a heirloom, not just a purchase.',
    product: 'Tasbih Pearl Rosary Set',
    verified: true,
  },
];

const storeLocations = [
  { city: 'Dubai', country: 'UAE', status: 'Flagship' },
  { city: 'London', country: 'UK', status: 'Studio' },
  { city: 'Kuala Lumpur', country: 'Malaysia', status: 'Studio' },
  { city: 'Istanbul', country: 'Turkey', status: 'Boutique' },
  { city: 'New York', country: 'USA', status: 'Popup' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 bg-brand-emerald relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-emerald via-brand-emerald to-brand-emerald-light/80" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div
          className={`text-center mb-16 lg:mb-24 transition-all duration-1000 ease-luxury ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-label text-brand-gold">Testimonials</p>
          <h2 className="font-serif text-display-md text-brand-cream mt-2">
            Words from Our Community
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-brand-gold/50" />
            <div className="w-1.5 h-1.5 bg-brand-gold rotate-45" />
            <div className="w-12 h-px bg-brand-gold/50" />
          </div>
        </div>

        {/* Featured testimonial */}
        <div
          className={`transition-all duration-1000 ease-luxury delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 lg:mb-20">

            {/* Large featured quote */}
            <div className="lg:col-span-7 relative">
              <Quote size={60} className="text-brand-gold/20 mb-6" strokeWidth={0.8} />
              <blockquote
                key={active.id}
                className="font-serif text-2xl lg:text-3xl text-brand-cream/90 leading-relaxed mb-8 italic animate-fade-in"
              >
                "{active.text}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold/40">
                  <img src={active.avatar} alt={active.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif text-brand-cream text-lg">{active.name}</p>
                  <p className="text-brand-cream/50 text-label uppercase tracking-widest mt-0.5">{active.location}</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-brand-gold fill-brand-gold" />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-px bg-brand-gold/40" />
                <p className="text-brand-gold/60 text-label uppercase tracking-widest">{active.product}</p>
                {active.verified && (
                  <span className="text-brand-gold/50 text-label border border-brand-gold/20 px-2 py-0.5">Verified</span>
                )}
              </div>
            </div>

            {/* Testimonial selector + mini cards */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(i)}
                  className={`text-left p-4 border transition-all duration-400 ease-luxury ${
                    i === activeIndex
                      ? 'border-brand-gold/50 bg-brand-cream/10'
                      : 'border-brand-cream/10 hover:border-brand-cream/25 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full overflow-hidden border ${i === activeIndex ? 'border-brand-gold/60' : 'border-brand-cream/20'}`}>
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-serif text-sm truncate ${i === activeIndex ? 'text-brand-cream' : 'text-brand-cream/60'}`}>
                        {t.name}
                      </p>
                      <p className="text-brand-cream/30 text-label uppercase tracking-widest truncate">{t.location}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={9} className="text-brand-gold fill-brand-gold" />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall rating strip */}
        <div
          className={`border-t border-brand-cream/10 pt-12 lg:pt-16 transition-all duration-1000 ease-luxury delay-400 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Ratings overview */}
            <div>
              <p className="section-label text-brand-gold mb-6">Customer Ratings</p>
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <span className="font-serif text-6xl text-brand-cream">4.9</span>
                  <div className="flex gap-1 justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                  <p className="text-brand-cream/40 text-label mt-1 uppercase tracking-widest">2,400+ Reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { stars: 5, pct: 87 },
                    { stars: 4, pct: 10 },
                    { stars: 3, pct: 2 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-brand-cream/40 text-label w-4">{stars}</span>
                      <div className="flex-1 h-1 bg-brand-cream/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-gold rounded-full transition-all duration-1000"
                          style={{ width: visible ? `${pct}%` : '0%', transitionDelay: '600ms' }}
                        />
                      </div>
                      <span className="text-brand-cream/30 text-label w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Store locator */}
            <div>
              <p className="section-label text-brand-gold mb-6">Our Locations</p>
              <div className="space-y-3">
                {storeLocations.map((loc) => (
                  <div key={loc.city} className="flex items-center gap-4 py-3 border-b border-brand-cream/10 group cursor-pointer">
                    <MapPin size={14} className="text-brand-gold shrink-0" />
                    <div className="flex-1">
                      <span className="font-serif text-lg text-brand-cream group-hover:text-brand-gold transition-colors duration-300">
                        {loc.city}
                      </span>
                      <span className="text-brand-cream/40 font-sans text-sm ml-2">{loc.country}</span>
                    </div>
                    <span className="text-label border border-brand-gold/30 text-brand-gold px-2.5 py-0.5 uppercase tracking-widest group-hover:bg-brand-gold group-hover:text-brand-cream transition-all duration-300">
                      {loc.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-6 btn-outline border-brand-cream/30 text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal text-sm group">
                Find a Store Near You
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
