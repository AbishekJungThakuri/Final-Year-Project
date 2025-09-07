import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../services/axiosInstances';

export const fetchSavedPlansThunk = createAsyncThunk(
  "plan/fetchSavedPlans",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/plans/saved", { params });
      console.log("Fetched plans", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

const savedPlanSlice = createSlice({
  name: "savedPlan",
  initialState: {
    list: null,
    status: "idle",
    error: null,
    page: 1,
    size: 5,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedPlansThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavedPlansThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.data;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.total = action.payload.total;
      })
      .addCase(fetchSavedPlansThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reducer: savedPlanReducer } = savedPlanSlice;
export default savedPlanSlice.reducer;

