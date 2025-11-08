import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  sidebarOpen: false,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleDarkMode, toggleSidebar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;