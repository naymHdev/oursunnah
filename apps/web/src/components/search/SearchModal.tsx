'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search, Loader } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectSearchModalOpen,
  selectSearchQuery,
  closeSearchModal,
  setSearchQuery,
} from '@/lib/redux/slices/uiSlice';
import { useGetProductsQuery } from '@/lib/redux/api/productApi';
import ProductCard from '@/components/products/ProductCard';

export default function SearchModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSearchModalOpen);
  const searchQuery = useAppSelector(selectSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localQuery);
      dispatch(setSearchQuery(localQuery));
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, dispatch]);

  // Fetch products based on debounced query
  const { data, isLoading } = useGetProductsQuery(
    debouncedQuery
      ? {
          search: debouncedQuery,
          limit: 20,
          page: 1,
        }
      : undefined,
    { skip: !debouncedQuery }
  );

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeSearchModal());
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, dispatch]);

  const handleClose = () => {
    dispatch(closeSearchModal());
  };

  const handleProductClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Header */}
        <div className="bg-brand-cream border-b border-brand-charcoal/10 px-6 py-6 lg:py-8">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-brand-charcoal/5 rounded-lg px-4 py-3">
              <Search size={20} className="text-brand-charcoal/40" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-brand-charcoal placeholder:text-brand-charcoal/40 text-lg"
              />
              {localQuery && (
                <button
                  onClick={() => setLocalQuery('')}
                  className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-brand-charcoal/10 rounded-lg transition-colors"
              aria-label="Close search"
            >
              <X size={24} className="text-brand-charcoal" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-brand-cream">
          <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
            {!debouncedQuery ? (
              <div className="text-center py-16">
                <p className="text-brand-charcoal/60 text-lg">
                  Start typing to search for products...
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="text-brand-gold animate-spin" strokeWidth={1.5} />
              </div>
            ) : data?.items && data.items.length > 0 ? (
              <div>
                <p className="text-brand-charcoal/60 mb-6">
                  Found {data.meta.total} result{data.meta.total !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {data.items.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleProductClick}
                      className="block"
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>

                {/* Category filters */}
                {data.items.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-brand-charcoal/10">
                    <h3 className="text-brand-charcoal font-serif text-lg mb-4">Filter by category</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Map(
                          data.items
                            .flatMap((p) => p.categories)
                            .map((cat) => [cat.slug, cat])
                        ).values()
                      ).map((category) => (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          onClick={handleProductClick}
                          className="px-4 py-2 rounded-full border border-brand-charcoal/20 text-brand-charcoal hover:bg-brand-gold/10 hover:border-brand-gold transition-colors duration-300"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-brand-charcoal/60 text-lg">
                  No products found for "{debouncedQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
