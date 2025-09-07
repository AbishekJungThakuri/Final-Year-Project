// src/features/images/imageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstances";

// ✅ Upload image
export const uploadImage = createAsyncThunk(
  "images/uploadImage",
  async ({ file, category }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(
        `/images/?category=${encodeURIComponent(category)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return res.data.data; // API should return uploaded image info
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const updateImage = createAsyncThunk(
  "images/updateImage",
  async ({ imageId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.put(
        `/images?id=${imageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return res.data.data; // API should return updated image info
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
)

const imageSlice = createSlice({
  name: "images",
  initialState: {
    uploadedImage: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearImageState: (state) => {
      state.uploadedImage = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedImage = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedImage = action.payload;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageState } = imageSlice.actions;
export default imageSlice.reducer;
