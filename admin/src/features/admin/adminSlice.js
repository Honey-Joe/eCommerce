import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    sellers: [],
    loading: false,
    admins: [],
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    setSellers: (state, action) => {
      state.sellers = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAdmin: (state,action)=>{
      state.admins = action.payload
    }
  },
});

export const selectUsers = (state) => state.admin.users;
export const selectSellers = (state) => state.admin.sellers;
export const { setLoading, setUsers, setSellers, setError,getAdmin } = adminSlice.actions;
export default adminSlice.reducer;
