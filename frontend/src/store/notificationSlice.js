import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from '../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiEndpoints.getNotifications();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const markRead = createAsyncThunk('notifications/markRead', async (id) => {
  await apiEndpoints.markNotificationRead(id);
  return id;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addLocalNotification: (state, action) => {
      state.items.unshift({
        id: `local-${Date.now()}`,
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find((i) => i.id === action.payload);
        if (n) n.read = true;
      });
  },
});

export const { addLocalNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
