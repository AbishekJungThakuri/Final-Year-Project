import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch places
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
      return res.data.data; // Assuming your backend returns paginated results in `data`
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCitiesThunk = createAsyncThunk(
  'location/fetchCities',
  async ({ search = '', page = 1, size = 5 } = {}, { rejectWithValue }) => {
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


const LocationSlice = createSlice({
  name: 'location',
  initialState: {
    places: [],
    cities: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default LocationSlice.reducer;  


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const locationApi = createApi({
//   reducerPath: 'locationApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }), // adjust if needed
//   tagTypes: ['Location'],
//   endpoints: (builder) => ({
//     fetchPlaces: builder.query({
//       query: () => '/places',
//       providesTags: ['Location'],
//     }),
//     fetchCities: builder.query({
//       query: () => '/cities',
//       providesTags: ['Location'],
//     }),
//   }),
// });

// export const {
//   useFetchPlacesQuery,
//   useFetchCitiesQuery,
// } = locationApi;


