import { createSlice } from '@reduxjs/toolkit';

const MATRIX_KEY = 'shopmart_matrix_mode';

const loadMatrixOverride = () => {
  try {
    const v = localStorage.getItem(MATRIX_KEY);
    if (v === 'on' || v === 'off' || v === 'auto') return v;
  } catch {
    /* ignore */
  }
  return 'auto';
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    quickViewProduct: null,
    commandPaletteOpen: false,
    matrixModeOverride: loadMatrixOverride(),
    budgetLimit: null,
  },
  reducers: {
    openQuickView: (state, action) => {
      state.quickViewProduct = action.payload;
    },
    closeQuickView: (state) => {
      state.quickViewProduct = null;
    },
    openCommandPalette: (state) => {
      state.commandPaletteOpen = true;
    },
    closeCommandPalette: (state) => {
      state.commandPaletteOpen = false;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    setMatrixModeOverride: (state, action) => {
      state.matrixModeOverride = action.payload;
      localStorage.setItem(MATRIX_KEY, action.payload);
    },
    cycleMatrixMode: (state) => {
      const order = ['auto', 'on', 'off'];
      const idx = order.indexOf(state.matrixModeOverride);
      const next = order[(idx + 1) % order.length];
      state.matrixModeOverride = next;
      localStorage.setItem(MATRIX_KEY, next);
    },
    setBudgetLimit: (state, action) => {
      state.budgetLimit = action.payload;
    },
  },
});

export const {
  openQuickView,
  closeQuickView,
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  setMatrixModeOverride,
  cycleMatrixMode,
  setBudgetLimit,
} = uiSlice.actions;

export const selectMatrixModeActive = (state) => {
  const override = state.ui.matrixModeOverride;
  if (override === 'on') return true;
  if (override === 'off') return false;
  const hour = new Date().getHours();
  return hour >= 0 && hour < 6;
};

export default uiSlice.reducer;
