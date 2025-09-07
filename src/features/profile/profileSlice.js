import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../services/axiosInstances';

export const fetchMyProfile = createAsyncThunk(
  "me/profile",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/me", { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);
export const updateMyProfile = createAsyncThunk(
  "me/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.put("/me", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

const myProfileSlice = createSlice({
  name: "myProfile",
  initialState: {
    status: "idle",
    error: null,
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // <-- fix: no .data here
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // update store with new profile
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reducer: myProfileReducer } = myProfileSlice;
export default myProfileReducer.reducer;
