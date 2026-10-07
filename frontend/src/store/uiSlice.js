import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    quickViewProduct: null,
    commandPaletteOpen: false,
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
  setBudgetLimit,
} = uiSlice.actions;

export default uiSlice.reducer;
