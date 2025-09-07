import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axiosInstances';
export const fetchRecommandedTransport = createAsyncThunk(
  'service/fetchRecommandedTransport',
  async (transportServiceId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/transport-services/${transportServiceId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.data || err.message);
    }
  }
);

const transportSlice = createSlice({
  name: 'transport',
  initialState: {
    currentTransport: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommandedTransport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommandedTransport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransport = action.payload;
      })
      .addCase(fetchRecommandedTransport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default transportSlice.reducer;
