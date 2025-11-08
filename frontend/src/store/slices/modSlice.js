import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchMods = createAsyncThunk('mods/fetchMods', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/mods', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch mods');
  }
});

export const fetchModById = createAsyncThunk('mods/fetchModById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/mods/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch mod');
  }
});

export const createMod = createAsyncThunk('mods/createMod', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/mods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create mod');
  }
});

export const downloadMod = createAsyncThunk('mods/downloadMod', async (id, { rejectWithValue }) => {
  try {
    const response = await api.post(`/mods/${id}/download`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to download mod');
  }
});

const initialState = {
  mods: [],
  currentMod: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    type: 'all',
    search: '',
    sort: 'createdAt',
    order: 'desc'
  }
};

const modSlice = createSlice({
  name: 'mods',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentMod: (state) => {
      state.currentMod = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mods
      .addCase(fetchMods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mods = action.payload.mods;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchMods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch mod by ID
      .addCase(fetchModById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMod = action.payload;
      })
      .addCase(fetchModById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create mod
      .addCase(createMod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mods.unshift(action.payload);
      })
      .addCase(createMod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentMod, clearError } = modSlice.actions;
export default modSlice.reducer;