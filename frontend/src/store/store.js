import { configureStore } from '@reduxjs/toolkit';
import planReducer from '../features/plan/AiplanSlice';
import locationReducer from '../features/plan/LocationSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    location: locationReducer,
  },
});
