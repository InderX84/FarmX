import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const createRequest = createAsyncThunk('requests/createRequest', async (requestData, { rejectWithValue }) => {
  try {
    const response = await api.post('/requests', requestData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create request');
  }
});

export const fetchMyRequests = createAsyncThunk('requests/fetchMyRequests', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/requests/my-requests');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
  }
});

export const fetchAllRequests = createAsyncThunk('requests/fetchAllRequests', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/requests', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
  }
});

const initialState = {
  requests: [],
  myRequests: [],
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create request
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRequests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch my requests
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      // Fetch all requests
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.requests = action.payload.requests;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      });
  },
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;