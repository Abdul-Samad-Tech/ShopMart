import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from '../services/api';

export const fetchSiteContent = createAsyncThunk('site/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const [siteRes, navRes, footerRes, catRes] = await Promise.all([
      apiEndpoints.getSite(),
      apiEndpoints.getNavigation(),
      apiEndpoints.getFooter(),
      apiEndpoints.getCategories(),
    ]);
    return {
      site: siteRes.data,
      navigation: navRes.data,
      footer: footerRes.data,
      categories: catRes.data,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const siteSlice = createSlice({
  name: 'site',
  initialState: {
    site: null,
    navigation: null,
    footer: null,
    categories: [],
    loading: true,
    error: null,
    themeMode: localStorage.getItem('theme') || 'light',
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      const next = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = next;
      localStorage.setItem('theme', next);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.site = action.payload.site;
        state.navigation = action.payload.navigation;
        state.footer = action.payload.footer;
        state.categories = action.payload.categories;
        if (action.payload.site?.theme?.defaultMode && !localStorage.getItem('theme')) {
          state.themeMode = action.payload.site.theme.defaultMode;
        }
      })
      .addCase(fetchSiteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setThemeMode, toggleTheme } = siteSlice.actions;
export default siteSlice.reducer;
