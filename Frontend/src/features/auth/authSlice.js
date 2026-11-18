
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Save logged-in user
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // Logout user
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // Update authentication loading state
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCredentials,
  logoutUser,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
