import { configureStore } from '@reduxjs/toolkit';
import planReducer from '../features/plan/AiplanSlice';
import locationReducer from '../features/plan/LocationSlice';
import aiChatReducer from '../features/plan/chatSlice';

import transportReducer from '../features/service/TransportSlice';
import accommodationReducer from '../features/service/AccommodationSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    location: locationReducer,
    aiChat: aiChatReducer,
    transport: transportReducer,
    accommodation: accommodationReducer,
  },
});
