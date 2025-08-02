import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ NEW: Fetch single place by ID
export const fetchPlaceByIdThunk = createAsyncThunk(
  'location/fetchPlaceById',
  async (placeId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/places/${placeId}`);
      return res.data.data; // Assuming response: { data: { ...place } }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Existing fetchPlacesThunk
export const fetchPlacesThunk = createAsyncThunk(
  'location/fetchPlaces',
  async ({ search = '', cityId = null, page = 1, size = 5, sortBy = 'id', order = 'asc' } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get('/places', {
        params: {
          search,
          city_id: cityId,
          page,
          size,
          sort_by: sortBy,
          order
        }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Existing fetchCitiesThunk
export const fetchCitiesThunk = createAsyncThunk(
  'location/fetchCities',
  async ({ search = ''  , page = 1, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get('/cities', {
        params: {
          search,
          page,
          size
        }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// Existing fetchCitiesThunk
export const fetchNearestCitiesThunk = createAsyncThunk(
  'location/fetchNearestCities',
  async ({city_id  , page = 1, size = 5,  search = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get('/cities/nearest', {
        params: {
          city_id,
          search,
          page,
          size
        }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const LocationSlice = createSlice({
  name: 'location',
  initialState: {
    places: [],
    placeDetails: null, // ✅ For individual place details
    cities: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch multiple places
      .addCase(fetchPlacesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlacesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.places = action.payload;
      })
      .addCase(fetchPlacesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch cities
      .addCase(fetchCitiesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCitiesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cities = action.payload;
      })
      .addCase(fetchCitiesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchNearestCitiesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNearestCitiesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cities = action.payload;
      })
      .addCase(fetchNearestCitiesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Fetch place by ID
      .addCase(fetchPlaceByIdThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlaceByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.placeDetails = action.payload;
      })
      .addCase(fetchPlaceByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default LocationSlice.reducer;
