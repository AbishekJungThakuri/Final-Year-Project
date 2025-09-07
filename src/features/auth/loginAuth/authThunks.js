import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../services/axiosInstances';


// ✅ Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email_or_username, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email_or_username, password });
      const { access_token, role, user_id } = res.data.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user_id)

      // Set default Authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      console.log("Login",res.data.data)
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Login failed' });
    }
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/auth/logout');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      delete axiosInstance.defaults.headers.common['Authorization'];

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Logout failed' });
    }
  }
);

// ✅ Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/me');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch user info' });
    }
  }
);

// ✅ Forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/forget_password?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send reset email");
    }
  }
);

// ✅ Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/auth/reset_password?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`
      );
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Something went wrong");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/auth/change_password?old_password=${encodeURIComponent(oldPassword)}&new_password=${encodeURIComponent(newPassword)}`
      );
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Something went wrong");
    }
  }
);



// Get Google login URL
export const getGoogleUrl = createAsyncThunk(
  "auth/getGoogleUrl",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/oauth/google");
      return res.data.data.url;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Google callback login
export const googleCallback = createAsyncThunk(
  "auth/googleCallback",
  async (code, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/auth/oauth/google/callback?code=${code}`
      );

      const { access_token, role, user_id } = res.data.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user_id);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
