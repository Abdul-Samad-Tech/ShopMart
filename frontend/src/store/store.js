import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import authReducer from './authSlice';
import siteReducer from './siteSlice';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
import uiReducer from './uiSlice';
import { saveCartToStorage } from './cartPersistence';
import { saveWishlistToStorage } from './wishlistSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer,
    site: siteReducer,
    notifications: notificationReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

let lastCartJson = '';
let lastWishlistJson = '';

store.subscribe(() => {
  const state = store.getState();
  const cartJson = JSON.stringify({
    items: state.cart.items,
    promoCode: state.cart.promoCode,
    promoDiscount: state.cart.promoDiscount,
    promoType: state.cart.promoType,
  });
  if (cartJson !== lastCartJson) {
    lastCartJson = cartJson;
    saveCartToStorage(state.cart);
  }

  const wishJson = JSON.stringify(state.wishlist.ids);
  if (wishJson !== lastWishlistJson) {
    lastWishlistJson = wishJson;
    saveWishlistToStorage(state.wishlist.ids);
  }
});

export default store;
