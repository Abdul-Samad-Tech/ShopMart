import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiEndpoints.getProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiEndpoints.getProduct(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchFilterMeta = createAsyncThunk('products/filterMeta', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiEndpoints.getProductFilters();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  products: [],
  filteredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  filterMeta: null,
  total: 0,
  loading: false,
  detailLoading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 10000],
    brand: '',
    color: '',
    luxury: false,
    search: '',
  },
  sortBy: 'default',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [
          state.filterMeta?.priceRange?.min ?? 0,
          state.filterMeta?.priceRange?.max ?? 10000,
        ],
        brand: '',
        color: '',
        luxury: false,
        search: '',
      };
      state.sortBy = 'default';
    },
    setRelatedProducts: (state, action) => {
      state.relatedProducts = action.payload;
    },
    loadMoreProducts: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload;
        state.filteredProducts = action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilterMeta.fulfilled, (state, action) => {
        state.filterMeta = action.payload;
        if (action.payload?.priceRange) {
          state.filters.priceRange = [
            action.payload.priceRange.min || 0,
            action.payload.priceRange.max || 10000,
          ];
        }
      });
  },
});

export const { setFilter, setSortBy, clearFilters, setRelatedProducts, loadMoreProducts } = productSlice.actions;
export default productSlice.reducer;
