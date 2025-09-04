import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchRecommandedTransport = createAsyncThunk(
    'recommand/fetchTransportRecommand',
    async (planDayStepId, { rejectWithValue }) => {
        try {
        const res = await axios.get(`/plan-day-steps/${planDayStepId}/transport-services`);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data?.data || err.message);
        }
    }
);


export const fetchRecommandedAccommodation = createAsyncThunk(
    'recommand/fetchAccommodationRecommand',
    async (planDayId, { rejectWithValue }) => {
        try {
        const res = await axios.get(`/plan-days/${planDayId}/accommodation-services`);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data?.data || err.message);
        }
    }
);
