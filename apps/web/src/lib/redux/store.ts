import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import { writeStorage } from "./persist/storage";

export const CART_STORAGE_KEY = "our-sunnah:cart";
export const WISHLIST_STORAGE_KEY = "our-sunnah:wishlist";

/**
 * Writes `cart`/`wishlist` to localStorage after every action that
 * touches them, instead of wiring up a full persistence library —
 * these are the only two slices that need to survive a refresh for a
 * guest shopper, so a couple of targeted writes are simpler to reason
 * about than a generic persist layer.
 */
const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  writeStorage(CART_STORAGE_KEY, state.cart.items);
  writeStorage(WISHLIST_STORAGE_KEY, state.wishlist.productIds);

  return result;
};

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, persistenceMiddleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
