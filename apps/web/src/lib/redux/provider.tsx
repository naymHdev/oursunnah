"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { makeStore, CART_STORAGE_KEY, WISHLIST_STORAGE_KEY, type AppStore } from "./store";
import { setCart, selectCartItems, type CartItem } from "./slices/cartSlice";
import { setWishlist } from "./slices/wishlistSlice";
import { setSession, clearSession } from "./slices/authSlice";
import { readStorage } from "./persist/storage";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useMergeCartMutation, useGetServerCartQuery } from "./api/cartApi";
import { mapCartResponseToItems } from "@/lib/cart/mapCartResponse";

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
 *
 * It also runs the one-time guest-cart merge right after login: if the
 * localStorage cart (built while signed out) has items, they're folded
 * into the user's server cart. If it was empty — e.g. logging in on a
 * new device — the existing server cart is fetched instead, so the
 * person doesn't see an empty bag when they actually have one.
 */
function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [mergeCart] = useMergeCartMutation();

  // Captured once per login, not recomputed as cartItems changes during
  // the merge itself — otherwise the "hydrate from server" query below
  // would race the merge call.
  const [pendingGuestMerge, setPendingGuestMerge] = useState<CartItem[] | null>(null);
  const [hasHandledLogin, setHasHandledLogin] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(setSession({ userId: session.user.id, accessToken: session.accessToken }));

      if (!hasHandledLogin) {
        setHasHandledLogin(true);
        const guestItems = cartItems.filter((item) => !item.id);
        setPendingGuestMerge(guestItems.length > 0 ? guestItems : null);
      }
    } else if (status === "unauthenticated") {
      dispatch(clearSession());
      setHasHandledLogin(false);
      setPendingGuestMerge(null);
    }
    // cartItems intentionally excluded: this should only fire on the
    // status transition, not on every cart change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, dispatch, hasHandledLogin]);

  useEffect(() => {
    if (!pendingGuestMerge) return;

    mergeCart({
      items: pendingGuestMerge.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    })
      .unwrap()
      .then((cart) => dispatch(setCart(mapCartResponseToItems(cart))))
      .catch(() => {
        // Guest cart stays as-is locally; nothing destructive happened.
      })
      .finally(() => setPendingGuestMerge(null));
  }, [pendingGuestMerge, mergeCart, dispatch]);

  // Only hydrate from the server when there was no guest cart to merge —
  // avoids overwriting the merge result with the pre-merge server cart.
  const { data: serverCart } = useGetServerCartQuery(undefined, {
    skip: status !== "authenticated" || pendingGuestMerge !== null,
  });

  useEffect(() => {
    if (serverCart && cartItems.length === 0) {
      dispatch(setCart(mapCartResponseToItems(serverCart)));
    }
  }, [serverCart, dispatch, cartItems.length]);

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
