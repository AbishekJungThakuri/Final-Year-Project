import { configureStore } from '@reduxjs/toolkit';
import planReducer from '../features/plan/PlanSlice';
import locationReducer from '../features/plan/LocationSlice';
import transportReducer from '../features/service/TransportSlice';
import accommodationReducer from '../features/service/AccommodationSlice';
import registerReducer from '../features/auth/registerAuth/registerSlice'
import authReducer from '../features/auth/loginAuth/authSlice';
import userReducer from "../features/plan/userSlice";
import { myPlanReducer } from '../features/plan/MyPlanSlice';
import { savedPlanReducer } from '../features/plan/SavedPlanSlice';
import { myProfileReducer } from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    myPlan: myPlanReducer,
    myProfile: myProfileReducer,
    savedPlan: savedPlanReducer,
    location: locationReducer,
    transport: transportReducer,
    accommodation: accommodationReducer,
    auth: authReducer,
    register: registerReducer,
    user: userReducer,
  },
});
