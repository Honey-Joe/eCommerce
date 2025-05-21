// redux/slices/brandSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const initialState = {
  brands: [],
  loading: false,
  error: null,
  status: 'pending'
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action) => {
      const idx = state.brands.findIndex(b => b._id === action.payload._id);
      if (idx !== -1) state.brands[idx] = action.payload;
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter(b => b._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateBrandStatus:(state,action) =>{
        state.status = action.payload;
    }
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  setLoading,
  setError,
  updateBrandStatus
} = brandSlice.actions;

export default brandSlice.reducer;

// Actions (manual async)
export const fetchBrands = () => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.get('/brands');
    dispatch(setBrands(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  }
  dispatch(setLoading(false));
};

export const createBrand = formData => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.post('/brands', formData);
    dispatch(addBrand(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  }
  dispatch(setLoading(false));
};

export const editBrand = (id, formData) => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.put(`/brands/${id}/status`, formData);
    dispatch(updateBrandStatus(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  }
  dispatch(setLoading(false));
};


export const removeBrand = id => async dispatch => {
  dispatch(setLoading(true));
  try {
    await axiosInstance.delete(`/brands/${id}`);
    dispatch(deleteBrand(id));
  } catch (err) {
    dispatch(setError(err.message));
  }
  dispatch(setLoading(false));
};
