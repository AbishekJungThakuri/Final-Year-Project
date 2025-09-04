import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, verifyEmail } from './registerApi';

export const register = createAsyncThunk('auth/register', async (formData, thunkAPI) => {
  try {
    return await registerUser(formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Registration failed');
  }
});

export const verify = createAsyncThunk('auth/verify', async ({ email, otp }, thunkAPI) => {
  try {
    return await verifyEmail({ email, otp });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Verification failed');
  }
});

const registerAuth = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    emailVerified: false,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.loading = false;
        state.emailVerified = true;
        state.user = action.payload;
      })
      .addCase(verify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerAuth.reducer;
