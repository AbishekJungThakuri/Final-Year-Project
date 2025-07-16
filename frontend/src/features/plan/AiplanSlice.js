import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Generate a new plan
export const generatePlanThunk = createAsyncThunk(
  'plan/generate',
  async (prompt, { rejectWithValue }) => {
    try {
      const res = await axios.post('/ai/generate-plan', null, {
        params: { prompt },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Edit an existing plan with prompt
export const editPlanThunk = createAsyncThunk(
  'plan/edit',
  async ({ planId, prompt }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/ai/edit-plan/${planId}`, null, {
        params: { prompt },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get all plans
export const fetchAllPlansThunk = createAsyncThunk(
  'plan/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/plans');
      // console.log("Fetched plans", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchPlanByIdThunk = createAsyncThunk(
  'plan/fetchById',
  async (planId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/plans/${planId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a plan
export const deletePlanThunk = createAsyncThunk(
  'plan/delete',
  async (planId, { rejectWithValue }) => {
    try {
      await axios.delete(`/plans/${planId}`);
      return planId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update plan via form (title & description)
export const updatePlanThunk = createAsyncThunk(
  'plan/update',
  async ({ planId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/plans/${planId}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Duplicate a plan
export const duplicatePlanThunk = createAsyncThunk(
  'plan/duplicate',
  async (planId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/plans/${planId}/duplicate`);
      console.log("API duplicate response:", res.data); // Debug log
      return res.data.data; // Make sure backend returns duplicated plan here
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Add a new day to a plan
export const addDayThunk = createAsyncThunk(
  'plan/addDay',
  async ({ planId, title }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/plan-days/', null, {
        params: {
          plan_id: planId,
          title: title,
        },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Add a new step to a specific day
export const addStepThunk = createAsyncThunk(
  'plan/addStep',
  async ({ planId, dayId, category, placeId, endCityId }, { rejectWithValue }) => {
    try {
      const payload = {
        plan_id: Number(planId),
        plan_day_id: Number(dayId),
        category,
        place_id: category === 'visit' ? Number(placeId) : null,
        end_city_id: category === 'transport' ? Number(endCityId) : null,
        place_activity_id: null,
      };

      const res = await axios.post('/plan-day-steps/', payload);
      return res.data.data;
    } catch (err) {
      console.error('Add step error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);





// Slice
const AiplanSlice = createSlice({
  name: 'plan',
  initialState: {
    data: null,           // current selected/generated plan
    list: [],             // all plans for home list
    generateStatus: 'idle',
    editStatus: 'idle',
    fetchStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Generate
      .addCase(generatePlanThunk.pending, (state) => {
        state.generateStatus = 'loading';
        state.error = null;
      })
      .addCase(generatePlanThunk.fulfilled, (state, action) => {
        state.generateStatus = 'succeeded';
        state.data = action.payload;
      })
      .addCase(generatePlanThunk.rejected, (state, action) => {
        state.generateStatus = 'failed';
        state.error = action.payload;
      })

      // Edit with prompt
      .addCase(editPlanThunk.pending, (state) => {
        state.editStatus = 'loading';
        state.error = null;
      })
      .addCase(editPlanThunk.fulfilled, (state, action) => {
        state.editStatus = 'succeeded';
        state.data = action.payload;
      })
      .addCase(editPlanThunk.rejected, (state, action) => {
        state.editStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch All Plans
      .addCase(fetchAllPlansThunk.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchAllPlansThunk.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.list = action.payload.data;
      })
      .addCase(fetchAllPlansThunk.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchPlanByIdThunk.pending, (state) => {
      state.fetchStatus = 'loading';
     })
    .addCase(fetchPlanByIdThunk.fulfilled, (state, action) => {
    state.fetchStatus = 'succeeded';
    state.data = action.payload;
    } )
   .addCase(fetchPlanByIdThunk.rejected, (state, action) => {
    state.fetchStatus = 'failed';
    state.error = action.payload;
     })

      // Delete
      .addCase(deletePlanThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((plan) => plan.id !== action.payload);
        if (state.data?.id === action.payload) {
          state.data = null;
        }
      })

      // Update
      .addCase(updatePlanThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })

      // Duplicate
      .addCase(duplicatePlanThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(addDayThunk.fulfilled, (state, action) => {
  state.data = action.payload;
})
.addCase(addStepThunk.fulfilled, (state, action) => {
  state.data = action.payload;
});
  },
});

export default AiplanSlice.reducer;
