import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecommandedAccommodation = createAsyncThunk(
  'service/fetchRecommandedAccommodation',
  async (accommodationServiceId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/accommodation-services/${accommodationServiceId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.data || err.message);
    }
  }
);

const accommodationSlice = createSlice({
  name: 'accommodation',
  initialState: {
    currentAccommodation: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommandedAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommandedAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccommodation = action.payload;
      })
      .addCase(fetchRecommandedAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default accommodationSlice.reducer;
