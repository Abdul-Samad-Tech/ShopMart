import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadCartFromStorage } from './cartPersistence';
import { apiEndpoints } from '../services/api';

const recalcItem = (item) => ({
  ...item,
  totalPrice: item.price * item.quantity,
});

const recalcTotals = (items) => {
  const totalQuantity = items.reduce((t, i) => t + i.quantity, 0);
  const totalAmount = items.reduce((t, i) => t + i.price * i.quantity, 0);
  return { totalQuantity, totalAmount };
};

const persisted = loadCartFromStorage();
const initialItems = persisted?.items?.map(recalcItem) || [];
const initialTotals = recalcTotals(initialItems);

const initialState = {
  items: initialItems,
  totalQuantity: initialTotals.totalQuantity,
  totalAmount: initialTotals.totalAmount,
  isDrawerOpen: false,
  promoCode: persisted?.promoCode || '',
  promoDiscount: persisted?.promoDiscount || 0,
  promoType: persisted?.promoType || 'percent',
  promoError: null,
  promoLoading: false,
};

export const applyPromoCode = createAsyncThunk(
  'cart/applyPromo',
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await apiEndpoints.validatePromo(code);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid promo code');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    addToCart: (state, action) => {
      const incoming = action.payload;
      const qty = incoming.quantity || 1;
      const existing = state.items.find((item) => item.id === incoming.id);

      if (existing) {
        existing.quantity += qty;
        existing.totalPrice = existing.price * existing.quantity;
      } else {
        state.items.push(recalcItem({ ...incoming, quantity: qty }));
      }

      const totals = recalcTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.isDrawerOpen = true;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = recalcTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
      }
      const totals = recalcTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.promoCode = '';
      state.promoDiscount = 0;
      state.promoError = null;
    },
    removePromo: (state) => {
      state.promoCode = '';
      state.promoDiscount = 0;
      state.promoError = null;
    },
    hydrateCart: (state, action) => {
      return { ...state, ...action.payload };
    },
    revertCartSnapshot: (state, action) => {
      const { items, totalQuantity, totalAmount } = action.payload;
      state.items = items.map(recalcItem);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.promoLoading = true;
        state.promoError = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.promoLoading = false;
        state.promoCode = action.payload.code;
        state.promoDiscount = action.payload.discount;
        state.promoType = action.payload.type;
        state.promoError = null;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.promoLoading = false;
        state.promoError = action.payload;
        state.promoCode = '';
        state.promoDiscount = 0;
      });
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  removePromo,
  hydrateCart,
  revertCartSnapshot,
} = cartSlice.actions;

export default cartSlice.reducer;
