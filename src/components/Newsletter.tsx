'use client';

import { useRef, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

export default function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-brand-cream-warm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ease-luxury ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-brand-gold/50" />
            <div className="w-3 h-3 border border-brand-gold rotate-45 opacity-60" />
            <div className="w-12 h-px bg-brand-gold/50" />
          </div>

          <p className="section-label text-brand-gold mb-3">The Noor Circle</p>
          <h2 className="font-serif text-display-md text-brand-charcoal mb-5">
            Join Our Community
          </h2>
          <p className="text-brand-stone font-sans text-body-md max-w-md mx-auto mb-10">
            Receive exclusive collections, Ramadan gift guides, styling inspiration, and early access — delivered with care.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-brand-emerald flex items-center justify-center">
                <Mail size={20} className="text-brand-cream" />
              </div>
              <p className="font-serif text-2xl text-brand-charcoal">Ahlan wa Sahlan</p>
              <p className="text-brand-stone text-sm">Thank you for joining the Noor community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 w-full px-5 py-3.5 bg-transparent border border-brand-stone/30 text-brand-charcoal placeholder:text-brand-stone/50 font-sans text-sm focus:outline-none focus:border-brand-gold transition-colors duration-300"
              />
              <button type="submit" className="btn-primary shrink-0 group whitespace-nowrap">
                Subscribe
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}

          <p className="text-brand-stone/50 text-label uppercase tracking-widest mt-5">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
