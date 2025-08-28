import { configureStore } from '@reduxjs/toolkit';
import planReducer from '../features/plan/PlanSlice';
import locationReducer from '../features/plan/LocationSlice';

import transportReducer from '../features/service/TransportSlice';
import accommodationReducer from '../features/service/AccommodationSlice';
import registerReducer from '../features/auth/registerAuth/registerSlice'

export const store = configureStore({
  reducer: {
    plan: planReducer,
    location: locationReducer,
    transport: transportReducer,
    accommodation: accommodationReducer,
    register: registerReducer,
  },
});
