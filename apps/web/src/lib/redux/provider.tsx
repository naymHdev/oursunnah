"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { makeStore, CART_STORAGE_KEY, WISHLIST_STORAGE_KEY, type AppStore } from "./store";
import { setCart, type CartItem } from "./slices/cartSlice";
import { setWishlist } from "./slices/wishlistSlice";
import { setSession, clearSession } from "./slices/authSlice";
import { readStorage } from "./persist/storage";
import { useAppDispatch } from "./hooks";

/**
 * Restores the guest cart/wishlist from localStorage on first mount.
 * Runs once, inside the Provider tree, so it has access to `dispatch`.
 */
function CartHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cart = readStorage<CartItem[]>(CART_STORAGE_KEY);
    const wishlist = readStorage<string[]>(WISHLIST_STORAGE_KEY);

    if (cart) dispatch(setCart(cart));
    if (wishlist) dispatch(setWishlist(wishlist));
  }, [dispatch]);

  return null;
}

/**
 * Mirrors the NextAuth session into `authSlice` so RTK Query's
 * `baseApi` (a plain Redux middleware, with no hook access) can read
 * the access token via `getState()` when attaching the Authorization
 * header. This is the *only* bridge between NextAuth and Redux —
 * NextAuth remains the source of truth for the session itself.
 */
function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(setSession({ userId: session.user.id, accessToken: session.accessToken }));
    } else if (status === "unauthenticated") {
      dispatch(clearSession());
    }
  }, [status, session, dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Created once per browser tab via useState, not at module scope —
  // module-scope would leak a single store instance across requests
  // during SSR. The store itself is only ever read/written client-side.
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <SessionProvider>
        <SessionSync />
        <CartHydration />
        {children}
      </SessionProvider>
    </Provider>
  );
}
