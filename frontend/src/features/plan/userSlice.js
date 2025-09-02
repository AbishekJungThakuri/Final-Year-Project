import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstances";


// Async thunk to fetch user by ID
export const getUser = createAsyncThunk(
  "user/getUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // assuming auth slice stores token
      const res = await axiosInstance.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data)
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userplans: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.userplans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userplans = action.payload.plans || [];
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
