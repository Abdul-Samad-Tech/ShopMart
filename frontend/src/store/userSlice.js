import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from '../services/api';

export const fetchDashboard = createAsyncThunk('user/dashboard', async (_, { rejectWithValue }) => {
  try {
    const [profile, orders, activity, wishlist] = await Promise.all([
      apiEndpoints.getProfile().catch(() => ({ data: null })),
      apiEndpoints.getOrders().catch(() => ({ data: [] })),
      apiEndpoints.getActivity().catch(() => ({ data: [] })),
      apiEndpoints.getWishlist().catch(() => ({ data: [] })),
    ]);
    return {
      profile: profile.data,
      orders: orders.data,
      activity: activity.data,
      wishlist: wishlist.data,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiEndpoints.updateProfile(payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const toggleWishlistItem = createAsyncThunk(
  'user/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await apiEndpoints.toggleWishlist(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    orders: [],
    activity: [],
    wishlist: [],
    dashboardLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.orders = action.payload.orders;
        state.activity = action.payload.activity;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.name) {
          /* profile synced via auth slice */
        }
      });
  },
});

export default userSlice.reducer;
