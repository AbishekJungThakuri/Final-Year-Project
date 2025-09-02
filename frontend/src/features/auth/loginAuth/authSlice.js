import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser,fetchUserProfile, forgetPassword, resetPassword, getGoogleUrl,googleCallback } from './authThunks';

import { jwtDecode } from "jwt-decode";
import axiosInstance from '../../../services/axiosInstances';

const initialState = {
  token: localStorage.getItem('accessToken') || null,
  role: null,          
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: "",
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
      state.user = null,
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        delete axiosInstance.defaults.headers.common['Authorization'];
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

         // decode role from token if backend doesn't return it
  const token = state.token || localStorage.getItem("accessToken");
  if (token) {
    const decoded = jwtDecode(token);
    state.role = decoded.role;
  }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })
      // Forget password
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
       // Reset password
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
       // Get Google URL
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
      
      // Google Callback
      .addCase(googleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role || action.payload.user?.role;
        state.isAuthenticated = true;
      })
      .addCase(googleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;