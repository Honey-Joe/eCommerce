// redux/slices/brandSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const initialState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
      state.loading = false;
    },
    updateBrand: (state, action) => {
      const index = state.brands.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
      state.loading = false;
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter(b => b._id !== action.payload);
      state.loading = false;
    },
    updateBrandStatus: (state, action) => {
      const { id, status } = action.payload;
      const brand = state.brands.find(b => b._id === id);
      if (brand) {
        brand.status = status;
      }
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  updateBrandStatus,
  setLoading,
  setError,
} = brandSlice.actions;

export default brandSlice.reducer;

// redux/slices/brandSlice.js (below the reducer)
export const fetchBrands = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.get('/brands');
    dispatch(setBrands(res.data));
  } catch (err) {
    dispatch(setError(err?.response?.data?.message || err.message));
  }
};

export const createBrand = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.post('/brands', formData);
    dispatch(addBrand(res.data));
  } catch (err) {
    dispatch(setError(err?.response?.data?.message || err.message));
  }
};

export const editBrand = (id, formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.put(`/brands/${id}`, formData);
    dispatch(updateBrand(res.data));
  } catch (err) {
    dispatch(setError(err?.response?.data?.message || err.message));
  }
};

export const removeBrand = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axiosInstance.delete(`/brands/${id}`);
    dispatch(deleteBrand(id));
  } catch (err) {
    dispatch(setError(err?.response?.data?.message || err.message));
  }
};

export const changeBrandStatus = (id, status) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axiosInstance.put(`/brands/${id}/status`, { status });
    dispatch(updateBrandStatus({ id, status: res.data.status }));
  } catch (err) {
    dispatch(setError(err?.response?.data?.message || err.message));
  }
};

