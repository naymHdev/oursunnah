import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';

const slides = [
  {
    image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90',
    label: 'New Season',
    title: 'Draped in\nSerenity',
    subtitle: 'Premium abayas crafted with intention — where modesty meets artistry.',
    cta: 'Explore the Collection',
  },
  {
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90',
    label: 'Prayer Essentials',
    title: 'Sacred\nSpaces',
    subtitle: 'Luxury prayer rugs and essentials for moments of devotion.',
    cta: 'Shop Prayer Mats',
  },
  {
    image: 'https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90',
    label: 'Home Collection',
    title: 'The Art of\nIslamic Living',
    subtitle: 'Bring warmth and heritage into every corner of your home.',
    cta: 'Discover Home Decor',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-luxury ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover object-center scale-105"
            style={{ transform: i === current ? 'scale(1)' : 'scale(1.05)', transition: 'transform 6s ease-luxury' }}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/75 via-brand-charcoal/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 via-transparent to-transparent z-10" />

      {/* Islamic geometric overlay (subtle) */}
      <div className="absolute inset-0 islamic-pattern z-10 opacity-30" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-20 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Label */}
            <div
              key={`label-${current}`}
              className="flex items-center gap-3 mb-6 animate-fade-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <div className="w-6 h-px bg-brand-gold" />
              <span className="text-label uppercase tracking-widest text-brand-gold font-sans">
                {slide.label}
              </span>
            </div>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="font-serif text-brand-cream text-display-xl mb-6 whitespace-pre-line animate-fade-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="text-brand-cream/75 text-body-lg font-sans font-light mb-10 max-w-lg animate-fade-up"
              style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div
              key={`cta-${current}`}
              className="flex flex-wrap items-center gap-5 animate-fade-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <a href="#collections" className="btn-primary group">
                {slide.cta}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <button className="flex items-center gap-3 text-brand-cream/80 hover:text-brand-cream transition-colors duration-300 group">
                <span className="w-10 h-10 rounded-full border border-brand-cream/40 flex items-center justify-center group-hover:border-brand-gold transition-colors duration-300">
                  <Play size={13} fill="currentColor" />
                </span>
                <span className="text-label uppercase tracking-widest">Watch Film</span>
              </button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute right-6 lg:right-12 bottom-28 lg:bottom-36 flex flex-col gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-500 ease-luxury rounded-full ${
                  i === current
                    ? 'w-1 h-8 bg-brand-gold'
                    : 'w-1 h-4 bg-brand-cream/30 hover:bg-brand-cream/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute left-6 lg:left-12 bottom-8 flex items-center gap-3 opacity-60">
            <div className="w-px h-12 bg-brand-cream/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-brand-gold animate-float" style={{ height: '40%' }} />
            </div>
            <span className="text-brand-cream/60 text-label uppercase tracking-widest rotate-0">
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-brand-emerald/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-3 divide-x divide-brand-cream/10 py-5">
            {[
              { value: '12,000+', label: 'Happy Customers' },
              { value: '150+', label: 'Premium Products' },
              { value: '15+', label: 'Countries Served' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-1">
                <span className="font-serif text-xl lg:text-2xl text-brand-gold">{stat.value}</span>
                <span className="text-label text-brand-cream/60 uppercase tracking-widest mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
