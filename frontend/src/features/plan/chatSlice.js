import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatSession = createAsyncThunk(
  'chat/fetchChatSession',
  async (planId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/ai/${planId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.data || err.message);
    }
  }
);

const initialState = {
  messages: [],
};

const AiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    addChatMessage(state, action) {
      state.messages.push(action.payload);
    },
    resetChat(state) {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatSession.pending, (state) => {
        state.messages = [];
      })
      .addCase(fetchChatSession.fulfilled, (state, action) => {
        state.messages = action.payload || [];
      });
  }
});


export const { addChatMessage, resetChat } = AiChatSlice.actions;
export default AiChatSlice.reducer;