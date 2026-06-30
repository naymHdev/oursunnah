'use client';

import { useRef, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Mail, Loader2 } from 'lucide-react';
import { useSubscribeNewsletterMutation } from '@/lib/redux/api/newsletterApi';

/** Narrow type for the shape RTK Query's fetchBaseQuery error actually has. */
type ApiError = { data?: { message?: string }; status?: number };

const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError?.data?.message ?? 'Something went wrong. Please try again.';
};

export default function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');

  const [subscribeNewsletter, { isLoading, isSuccess, reset }] =
    useSubscribeNewsletterMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setErrorMessage(null);

    try {
      await subscribeNewsletter({ email, source: 'homepage_footer' }).unwrap();
      setEmail('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleTryAgain = () => {
    reset();
    setErrorMessage(null);
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

          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-brand-emerald flex items-center justify-center">
                <Mail size={20} className="text-brand-cream" />
              </div>
              <p className="font-serif text-2xl text-brand-charcoal">Ahlan wa Sahlan</p>
              <p className="text-brand-stone text-sm">Thank you for joining the Noor community.</p>
              <button
                onClick={handleTryAgain}
                className="text-brand-gold text-label uppercase tracking-widest mt-2 hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Your email address"
                  required
                  disabled={isLoading}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? 'newsletter-error' : undefined}
                  className={`w-full px-5 py-3.5 bg-transparent border text-brand-charcoal placeholder:text-brand-stone/50 font-sans text-sm focus:outline-none transition-colors duration-300 disabled:opacity-60 ${
                    errorMessage
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-brand-stone/30 focus:border-brand-gold'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary shrink-0 group whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-brand-emerald disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <>
                    Subscribing
                    <Loader2 size={13} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {errorMessage && (
            <p id="newsletter-error" role="alert" className="text-red-500 text-xs font-sans mt-3 animate-fade-in">
              {errorMessage}
            </p>
          )}

          {!isSuccess && (
            <p className="text-brand-stone/50 text-label uppercase tracking-widest mt-5">
              No spam, ever. Unsubscribe at any time.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
