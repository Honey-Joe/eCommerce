import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
  user: null,
  isAuthenticated: false,
  permissions: [], // NEW
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.role = action.payload.role.name;
      state.permissions = action.payload.permissions || []; // NEW
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.permissions = [];
    },
    setAdmin: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAdmin } = authSlice.actions;

export const selectAuthRole = (state) => state.auth.role
export const selectPermissions = (state) => state.auth.permissions;

export default authSlice.reducer;
