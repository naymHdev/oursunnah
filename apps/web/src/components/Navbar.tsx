'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import type { CategoryTreeNode } from '@/types/catalog';
import { CollectionsMegaMenu } from './navbar/CollectionsMegaMenu';
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

// Closing the mega-menu after a short delay (instead of instantly on
// mouseleave) absorbs the gap between the "Collections" link and the
// panel below it, so moving the cursor down into the panel doesn't
// flicker it shut.
const CLOSE_DELAY_MS = 150;

type NavbarProps = {
  categories: CategoryTreeNode[];
};

export default function Navbar({ categories }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const cartCount = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tracks the header's real rendered height (announcement bar +
  // nav row, which both change with the `scrolled` state) so the
  // full-width mega menu can sit flush underneath it instead of using
  // a guessed/hardcoded offset.
  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const update = () => setHeaderHeight(el.getBoundingClientRect().bottom);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
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
      {/* Announcement bar */}
      <div className="bg-brand-emerald text-brand-cream/90 text-center py-2.5">
        <p className="text-label tracking-widest uppercase">
          Free shipping on orders over $150 &nbsp;·&nbsp; New Ramadan Collection Now Live
        </p>
      </div>

      {/* Main navbar */}
      <header
        ref={headerRef}
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-700 ease-luxury ${
          scrolled
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-nav top-0'
            : 'bg-transparent top-8'
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
                      className={`nav-link flex items-center gap-1 ${scrolled ? 'text-brand-charcoal/80' : 'text-brand-cream/90 after:bg-brand-gold'}`}
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
                  <a key={link.label} href={link.href} className={`nav-link flex items-center gap-1 ${scrolled ? 'text-brand-charcoal/80' : 'text-brand-cream/90 after:bg-brand-gold'}`}>
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Logo */}
            <a href="#" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
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
                <a key={link.label} href={link.href} className={`nav-link ${scrolled ? 'text-brand-charcoal/80' : 'text-brand-cream/90 after:bg-brand-gold'}`}>
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-5 ml-4 border-l border-current/10 pl-6">
                <button onClick={() => dispatch(openSearchModal())} className={`transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`} aria-label="Search">
                  <Search size={18} strokeWidth={1.5} />
                </button>
                <button className={`transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`} aria-label="Wishlist">
                  <Heart size={18} strokeWidth={1.5} />
                </button>
                <button onClick={() => dispatch(openCartDrawer())} className={`relative transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`} aria-label="Cart">
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
              <button onClick={() => dispatch(openCartDrawer())} className={`relative transition-colors duration-300 hover:text-brand-gold ${scrolled ? 'text-brand-charcoal/60' : 'text-brand-cream/70'}`} aria-label="Cart">
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

      <div onMouseEnter={openCollections} onMouseLeave={scheduleCloseCollections}>
        <CollectionsMegaMenu categories={categories} open={collectionsOpen} topOffset={headerHeight} />
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-brand-cream transition-transform duration-700 ease-luxury lg:hidden overflow-y-auto ${
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
