'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import type { CategoryTreeNode } from '@/types/catalog';
import { MegaMenuPanel } from './navbar/MegaMenuPanel';
import { CollectionsAccordion } from './navbar/CollectionsAccordion';
import CartDrawer from './cart/CartDrawer';
import SearchModal from './search/SearchModal';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openCartDrawer, openSearchModal } from '@/lib/redux/slices/uiSlice';
import { selectCartCount } from '@/lib/redux/slices/cartSlice';

const navLinks = [
  { label: 'Collections', href: '#collections', hasDropdown: true },
  { label: 'Prayer Essentials', href: '#prayer', hasDropdown: false },
  { label: 'Modest Wear', href: '#wear', hasDropdown: false },
  { label: 'Home', href: '#home-decor', hasDropdown: false },
  { label: 'Our Story', href: '#story', hasDropdown: false },
];

// Absorbs the gap between the "Collections" trigger and the panel below
// so moving the cursor downward doesn't flicker the panel shut.
const CLOSE_DELAY_MS = 150;

type NavbarProps = {
  categories: CategoryTreeNode[];
};

export default function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const cartCount = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: wrap the entire fixed header (announcement bar + nav row) in
  // one ref so headerHeight always equals the true bottom edge of the
  // whole fixed block — including the announcement bar when visible.
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // On non-home pages start scrolled immediately (no transparent phase).
  useEffect(() => {
    setScrolled(pathname !== '/');
  }, [pathname]);

  // On the home page react to scroll position.
  useEffect(() => {
    if (pathname !== '/') return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // FIX: useLayoutEffect fires synchronously after DOM mutations but
  // before paint, so the first measured height is available on the
  // very first render — eliminates the topOffset=0 flicker in
  // MegaMenuPanel on initial hover.
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      setHeaderHeight(h);
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // FIX: also re-measure on scroll so the CSS variable stays correct
    // while the announcement bar is collapsing out.
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update);
      document.documentElement.style.removeProperty('--navbar-height');
    };
  }, [scrolled]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openCollections = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCollectionsOpen(true);
  };

  const scheduleCloseCollections = () => {
    closeTimer.current = setTimeout(() => setCollectionsOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <>
      {/*
        FIX: One fixed wrapper for the entire top chrome.
        - Announcement bar collapses (max-h-0) when scrolled so the
          navbar row slides up to fill the gap — no orphaned space.
        - The wrapper's measured height drives topOffset for MegaMenuPanel,
          so the panel always sits flush under whatever is actually visible.
      */}
      <div ref={wrapperRef} className="fixed top-0 left-0 right-0 z-50">

        {/* Announcement bar — collapses on scroll */}
        <div
          className={`bg-brand-emerald text-brand-cream/90 text-center overflow-hidden transition-all duration-500 ease-luxury ${
            scrolled ? 'max-h-0 py-0' : 'max-h-12 py-2.5'
          }`}
        >
          <p className="text-label tracking-widest uppercase">
            Free shipping on orders over $150 &nbsp;·&nbsp; New Ramadan Collection Now Live
          </p>
        </div>

        {/* Main navbar row */}
        <header
          className={`transition-all duration-700 ease-luxury ${
            scrolled
              ? 'bg-brand-cream/95 backdrop-blur-md shadow-nav'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-16 lg:h-20">

              {/* Left nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.slice(0, 3).map((link) =>
                  link.hasDropdown ? (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={openCollections}
                      onMouseLeave={scheduleCloseCollections}
                    >
                      <a
                        href={link.href}
                        className={`nav-link flex items-center gap-1 ${
                          scrolled
                            ? 'text-brand-charcoal/80'
                            : 'text-brand-cream/90 after:bg-brand-gold'
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={11}
                          strokeWidth={1.5}
                          className={`transition-transform duration-300 ${collectionsOpen ? 'rotate-180' : ''}`}
                        />
                      </a>
                    </div>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`nav-link flex items-center gap-1 ${
                        scrolled
                          ? 'text-brand-charcoal/80'
                          : 'text-brand-cream/90 after:bg-brand-gold'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                )}
              </nav>

              {/* Logo */}
              <a href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="flex items-center gap-2.5">
                  <div className={`w-px h-5 transition-colors duration-700 ${scrolled ? 'bg-brand-gold' : 'bg-brand-gold/70'}`} />
                  <span className={`font-serif text-2xl lg:text-3xl tracking-[0.25em] uppercase transition-colors duration-700 ${scrolled ? 'text-brand-charcoal' : 'text-brand-cream'}`}>
                    Noor
                  </span>
                  <div className={`w-px h-5 transition-colors duration-700 ${scrolled ? 'bg-brand-gold' : 'bg-brand-gold/70'}`} />
                </div>
                <span className={`text-[9px] tracking-[0.4em] uppercase font-sans font-light mt-0.5 transition-colors duration-700 ${scrolled ? 'text-brand-gold' : 'text-brand-gold/80'}`}>
                  Islamic Lifestyle
                </span>
              </a>

              {/* Right nav */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.slice(3).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`nav-link ${scrolled ? 'text-brand-charcoal/80' : 'text-brand-cream/90 after:bg-brand-gold'}`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-5 ml-4 border-l border-current/10 pl-6">
                  <button
                    onClick={() => dispatch(openSearchModal())}
                    className={`transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`}
                    aria-label="Search"
                  >
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    className={`transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`}
                    aria-label="Wishlist"
                  >
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => dispatch(openCartDrawer())}
                    className={`relative transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`}
                    aria-label="Cart"
                  >
                    <ShoppingBag size={18} strokeWidth={1.5} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-gold text-brand-cream text-[9px] flex items-center justify-center font-sans font-medium">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile right */}
              <div className="lg:hidden flex items-center gap-4">
                <button
                  onClick={() => dispatch(openCartDrawer())}
                  className={`relative transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`}
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-gold text-brand-cream text-[9px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal' : 'text-brand-cream'}`}
                >
                  {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                </button>
              </div>

            </div>
          </div>
        </header>
      </div>

      {/* MegaMenu sits outside the fixed wrapper so it can spread full-width
          below the header without being clipped by the wrapper's own stacking
          context. topOffset (live header height) positions it exactly. */}
      <div onMouseEnter={openCollections} onMouseLeave={scheduleCloseCollections}>
        <MegaMenuPanel categories={categories} open={collectionsOpen} topOffset={headerHeight} />
      </div>

      {/*
        FIX: Mobile menu z-50 → z-[60] so it sits above the fixed header
        wrapper (z-50) and the mega menu (z-40).
      */}
      <div
        className={`fixed inset-0 z-[60] bg-brand-cream transition-transform duration-700 ease-luxury lg:hidden overflow-y-auto ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-center min-h-full px-10 pt-24 pb-12">
          <div className="mb-10">
            <p className="section-label text-brand-gold">Navigation</p>
            <div className="gold-divider mb-8" />
          </div>
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, i) =>
              link.hasDropdown ? (
                <div key={link.label} style={{ transitionDelay: `${i * 50}ms` }}>
                  <CollectionsAccordion
                    categories={categories}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-brand-charcoal hover:text-brand-gold transition-colors duration-300"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
          <div className="mt-12 flex items-center gap-6">
            <button onClick={() => dispatch(openSearchModal())} className="btn-ghost text-brand-charcoal/70">Search</button>
            <button className="btn-ghost text-brand-charcoal/70">Wishlist</button>
          </div>
        </div>
      </div>

      <CartDrawer />
      <SearchModal />
    </>
  );
}
