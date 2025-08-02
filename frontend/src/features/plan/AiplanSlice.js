import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update plan via form partial
export const updatePlanPartialThunk = createAsyncThunk(
  'plan/updatePartial',
  async ({ planId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/plans/${planId}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

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

// Toggle save
export const toggleSaveThunk = createAsyncThunk(
  "plan/toggleSave",
  async (planId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/plans/${planId}/toggle-save`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

// Rate plan
export const ratePlanThunk = createAsyncThunk(
  "plan/rate",
  async ({ planId, rating }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/plans/${planId}/rate`, null, {params: { rating : rating }});
      return res.data.data.rating;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const removeRatingThunk = createAsyncThunk(
  "plan/removeRating",
  async (planId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/plans/${planId}/rate`);
      return res.data.data.rating;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

// Add a new day to a plan
export const addDayThunk = createAsyncThunk(
  'plan/addDay',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/plan-days/', data );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Add a new step to a specific day
export const addStepThunk = createAsyncThunk(
  'plan/addStep',
  async ({planId,  dayId, category, index, placeId, placeActivityId, cityId }, { rejectWithValue }) => {
    try {
      const payload = { 
        plan_id: planId,
        plan_day_id: dayId,
        category,
        index,
        place_id: placeId,
        place_activity_id: placeActivityId,
        city_id: cityId
      };
      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const res = await axios.post('/plan-day-steps/', payload);
      return res.data.data;
    } catch (err) {
      console.error('Add step error:', err.response?.data?.detail || err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



// DELETE a day
export const deleteDayThunk = createAsyncThunk(
  'plan/deleteDay',
  async ({ dayId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/plan-days/${dayId}`, null);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE a step
export const deleteStepThunk = createAsyncThunk(
  'plan/deleteStep',
  async ({ stepId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/plan-day-steps/${stepId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE day title
export const updateDayThunk = createAsyncThunk(
  'plan/updateDay',
  async ({ dayId, newTitle }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/plan-days/${dayId}`, { title: newTitle });
      return res.data.data;
    } catch (err) {
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
  reducers: {
    setPlanFromSocket: (state, action) => {
      state.data = action.payload;
      state.generateStatus = 'generating'; // new status while streaming
    },
    markPlanGenerationComplete: (state) => {
      state.generateStatus = 'succeeded';
    },
    // Add this new action
    setGenerationInProgress: (state) => {
      console.log("GENERATION IN PROGRESS");
      state.generateStatus = 'loading';
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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

      // Partial Update
      .addCase(updatePlanPartialThunk.fulfilled, (state, action) => {
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
      })
      // Delete Day
      .addCase(deleteDayThunk.fulfilled, (state, action) => {
        if (state.data?.days) {
          state.data = action.payload;
        }
      })

      // Delete Step
      .addCase(deleteStepThunk.fulfilled, (state, action) => {
        if (state.data?.days) {
          state.data = action.payload;
        }
      })

      // Update Day Title
      .addCase(updateDayThunk.fulfilled, (state, action) => {
        if (state.data?.days) {
          state.data = action.payload;
        }
      })

      .addCase(ratePlanThunk.fulfilled, (state, action) => {
        if (state.data) {
          state.data.rating = action.payload;
        }
      })

      // Remove Rating
      .addCase(removeRatingThunk.fulfilled, (state, action) => {
        if (state.data) {
          state.data.rating = action.payload;
        }
      })

  },
});

export const { setPlanFromSocket, markPlanGenerationComplete, setGenerationInProgress } = AiplanSlice.actions;
export default AiplanSlice.reducer;

