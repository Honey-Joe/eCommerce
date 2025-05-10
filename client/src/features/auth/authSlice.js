// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null, // Fetched from server if needed
  status: "idle",
  user: null,
  isAuthenticated: false,

  error: null,
  loading: false,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.user = null;
      state.success = false;
    },
    registerStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.success = true;
    },
    registerFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  setUser,
} = authSlice.actions;

export const selectAuthRole = (state) => state.auth.role;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
