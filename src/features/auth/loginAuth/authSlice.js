import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, fetchUserProfile, forgetPassword, resetPassword, getGoogleUrl, googleCallback } from './authThunks';
import axiosInstance from '../../../services/axiosInstances';

const initialState = {
  token: localStorage.getItem('accessToken') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  googleUrl: "",
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.googleUrl = "";
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      delete axiosInstance.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Normal Login ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${action.payload.access_token}`;
        localStorage.setItem('accessToken', action.payload.access_token);
        localStorage.setItem('role', action.payload.role);
        if (action.payload.user_id) localStorage.setItem('userId', action.payload.user_id);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.role = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        delete axiosInstance.defaults.headers.common['Authorization'];
      })

      // --- Fetch User Profile ---
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })

      // --- Forget Password ---
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Reset Password ---
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Google URL ---
      .addCase(getGoogleUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoogleUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.googleUrl = action.payload;
      })
      .addCase(getGoogleUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Google Callback / Verify Email Redirect ---
      .addCase(googleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleCallback.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        state.token = payload.access_token;
        state.role = payload.role;
        state.user = payload.user || null;
        state.isAuthenticated = true;

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${payload.access_token}`;
        localStorage.setItem('accessToken', payload.access_token);
        localStorage.setItem('role', payload.role);
        if (payload.user_id) localStorage.setItem('userId', payload.user_id);
      })
      .addCase(googleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
