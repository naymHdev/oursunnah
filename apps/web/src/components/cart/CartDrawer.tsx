'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeCartDrawer, selectCartDrawerOpen } from '@/lib/redux/slices/uiSlice';
import { selectCartItems, selectCartSubtotal, type CartItem } from '@/lib/redux/slices/cartSlice';
import { useCartLineActions } from '@/lib/cart/useCartLineActions';

function CartLine({ item }: { item: CartItem }) {
  const { setLineQuantity, removeLine } = useCartLineActions();

  return (
    <div className="flex gap-4 py-5 border-b border-brand-stone/10">
      <div className="w-20 h-24 bg-brand-beige flex-shrink-0 overflow-hidden">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-base text-brand-charcoal leading-snug">{item.name}</h4>
          <button
            onClick={() => removeLine(item)}
            className="text-brand-charcoal/40 hover:text-rose-500 transition-colors duration-300 flex-shrink-0"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="font-serif text-sm text-brand-charcoal/70 mt-1">${item.price.toFixed(2)}</p>

        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center border border-brand-stone/20">
            <button
              onClick={() => setLineQuantity(item, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-brand-charcoal/60 hover:text-brand-gold transition-colors duration-300"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="w-8 text-center text-sm font-sans text-brand-charcoal">
              {item.quantity}
            </span>
            <button
              onClick={() => setLineQuantity(item, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-brand-charcoal/60 hover:text-brand-gold transition-colors duration-300"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const close = () => dispatch(closeCartDrawer());

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-brand-charcoal/30 backdrop-blur-sm transition-opacity duration-500 ease-luxury ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[61] h-full w-full max-w-md bg-brand-cream shadow-card-hover flex flex-col transition-transform duration-500 ease-luxury ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-brand-stone/10">
          <h2 className="font-serif text-2xl text-brand-charcoal">Your Bag</h2>
          <button
            onClick={close}
            className="text-brand-charcoal/60 hover:text-brand-gold transition-colors duration-300"
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-20">
              <ShoppingBag size={32} strokeWidth={1.25} className="text-brand-stone/40" />
              <p className="text-brand-charcoal/60 font-sans">Your bag is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <CartLine key={`${item.productId}-${item.variantId ?? 'base'}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-brand-stone/10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-brand-charcoal/70">Subtotal</span>
              <span className="font-serif text-xl text-brand-charcoal">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button className="btn-primary w-full justify-center">Checkout</button>
            <p className="text-label text-brand-stone text-center mt-3">
              Shipping &amp; taxes calculated at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
