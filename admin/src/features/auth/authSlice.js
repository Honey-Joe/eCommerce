// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,        // Fetched from server if needed
  status: 'idle',
  user: null,
    isAuthenticated: false,

  error: null,
  loading: false,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
    },
    
    setAdmin: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  setAdmin,
} = authSlice.actions;

export const selectAuthRole = (state) => state.auth.role;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
