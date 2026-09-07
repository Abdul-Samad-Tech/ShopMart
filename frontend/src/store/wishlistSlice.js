import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_KEY = 'shophub_wishlist_v1';

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ids: loadWishlist(),
  },
  reducers: {
    toggleWishlistLocal: (state, action) => {
      const id = String(action.payload);
      const idx = state.ids.indexOf(id);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(id);
    },
    setWishlistIds: (state, action) => {
      state.ids = action.payload.map((p) => String(p.id || p._id || p));
    },
    clearWishlistLocal: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleWishlistLocal, setWishlistIds, clearWishlistLocal } = wishlistSlice.actions;

export const saveWishlistToStorage = (ids) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
};

export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.ids.includes(String(productId));

export default wishlistSlice.reducer;
