import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiEndpoints } from '../services/api';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const rememberUser = (user) => {
  localStorage.removeItem('token');
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiEndpoints.getMe();
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.status || 'unauthorized');
  }
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    await apiEndpoints.logout();
  } catch {
    // Local session still ends if the cookie clear request fails.
  }
});

const applyUser = (state, user) => {
  state.loading = false;
  state.user = user || null;
  state.token = null;
  state.isAuthenticated = Boolean(user);
  state.error = null;
  rememberUser(user);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      applyUser(state, action.payload.user);
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      applyUser(state, null);
    },

    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    registerSuccess: (state, action) => {
      applyUser(state, action.payload.user);
    },

    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    loadUserFromStorage: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      if (state.isAuthenticated) return;
      state.user = null;
      state.isAuthenticated = false;
    },

    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      rememberUser(state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        applyUser(state, action.payload);
      })
      .addCase(restoreSession.rejected, (state) => {
        applyUser(state, null);
      })
      .addCase(signOut.fulfilled, (state) => {
        applyUser(state, null);
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  loadUserFromStorage,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
